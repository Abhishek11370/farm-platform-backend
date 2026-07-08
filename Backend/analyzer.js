const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const srcDir = path.join(__dirname, 'src');

const stats = {
  modules: [],
  apis: [],
  globalFiles: 0,
};

function walk(dir, moduleName) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (dir === path.join(srcDir, 'modules')) {
        stats.modules.push({
          name: file,
          controllers: 0,
          services: 0,
          dtos: 0,
          entities: 0,
          repositories: 0,
          apis: 0,
          status: 'Empty'
        });
        walk(fullPath, file);
      } else {
        walk(fullPath, moduleName);
      }
    } else if (file.endsWith('.ts')) {
      if (!moduleName) stats.globalFiles++;
      const mod = stats.modules.find(m => m.name === moduleName);
      if (mod) {
        if (file.endsWith('.controller.ts')) mod.controllers++;
        if (file.endsWith('.service.ts')) mod.services++;
        if (file.includes('dto')) mod.dtos++;
        if (file.includes('entity')) mod.entities++;
        if (file.includes('repository')) mod.repositories++;
        
        // Count APIs in controllers
        if (file.endsWith('.controller.ts')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const methodRegex = /@(Get|Post|Patch|Put|Delete)\(['"](.*?)['"]\)/g;
          const authRegex = /@UseGuards\(/;
          const hasAuth = authRegex.test(content);
          
          let match;
          while ((match = methodRegex.exec(content)) !== null) {
            mod.apis++;
            stats.apis.push({
              method: match[1].toUpperCase(),
              route: match[2],
              auth: hasAuth,
              controller: file.replace('.ts', ''),
              module: moduleName
            });
          }
          // Handle default decorators like @Get()
          const emptyMethodRegex = /@(Get|Post|Patch|Put|Delete)\(\)/g;
          while ((match = emptyMethodRegex.exec(content)) !== null) {
            mod.apis++;
            stats.apis.push({
              method: match[1].toUpperCase(),
              route: '/',
              auth: hasAuth,
              controller: file.replace('.ts', ''),
              module: moduleName
            });
          }
        }
      }
    }
  }
}

async function analyzePrisma() {
  const prisma = new PrismaClient();
  const dbStats = { connected: false, counts: {} };
  try {
    await prisma.$connect();
    dbStats.connected = true;
    
    // Dynamically count models
    const models = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$') && typeof prisma[k].count === 'function');
    for (const model of models) {
      try {
        dbStats.counts[model] = await prisma[model].count();
      } catch(e) {
        dbStats.counts[model] = 'Error';
      }
    }
  } catch (err) {
    dbStats.connected = false;
    dbStats.error = err.message;
  } finally {
    await prisma.$disconnect();
  }
  return dbStats;
}

async function main() {
  if (fs.existsSync(path.join(srcDir, 'modules'))) {
    walk(path.join(srcDir, 'modules'), null);
  } else {
    console.log("No modules dir");
  }
  
  for(const mod of stats.modules) {
    if (mod.controllers > 0 && mod.services > 0) mod.status = 'Complete';
    else if (mod.controllers > 0 || mod.services > 0) mod.status = 'Partial';
  }

  const dbStats = await analyzePrisma();
  
  fs.writeFileSync('audit-result.json', JSON.stringify({ codeStats: stats, dbStats: dbStats }, null, 2));
  console.log("Audit complete");
}

main().catch(console.error);
