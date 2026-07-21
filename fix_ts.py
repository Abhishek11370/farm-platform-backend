import os
import re

backend_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src\modules"

def replace_file_content(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix analytics.controller.ts (missing Query)
f1 = os.path.join(backend_dir, 'analytics', 'analytics.controller.ts')
replace_file_content(f1, [
    ("import { Controller, Get, UseGuards, Req }", "import { Controller, Get, UseGuards, Req, Query }")
])

# Fix auth.controller.ts
f2 = os.path.join(backend_dir, 'auth', 'auth.controller.ts')
replace_file_content(f2, [
    ("import { any } from '../../types/authenticated-request';", "import { AuthenticatedRequest } from '../../types/authenticated-request';"),
    ("@Req() req: any", "@Req() req: AuthenticatedRequest")
])

# Fix order.controller.ts
f3 = os.path.join(backend_dir, 'order', 'order.controller.ts')
with open(f3, 'r', encoding='utf-8') as f:
    c = f.read()
if "interface AuthenticatedRequest" not in c and "import { AuthenticatedRequest" not in c:
    lines = c.split('\n')
    idx = 0
    for i, line in enumerate(lines):
        if not line.startswith('import') and line.strip() != '':
            idx = i
            break
    lines.insert(idx, "import { Request } from 'express';\nimport { RequestUser } from '../../types/request-user';\ninterface AuthenticatedRequest extends Request { user: RequestUser; }")
    with open(f3, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

# Fix order.service.ts
f4 = os.path.join(backend_dir, 'order', 'order.service.ts')
replace_file_content(f4, [
    ("this.prisma.order.update({where: {id}, data: {status: status as any}})(id, dto.status || 'UPDATED')", "this.prisma.order.update({where: {id}, data: {status: dto.status as any}})")
])

print("Typescript errors fixed again.")
