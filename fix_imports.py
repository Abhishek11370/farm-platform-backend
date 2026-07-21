import os
import re

backend_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src\modules"

def ensure_import(filepath, symbol, module_path, is_type=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already imported
    if re.search(r'import\s*{[^}]*\b' + symbol + r'\b[^}]*}\s*from\s*[\'"]' + module_path + r'[\'"]', content):
        return
        
    # See if the module is already imported, then inject symbol
    match = re.search(r'import\s*{([^}]+)}\s*from\s*[\'"]' + module_path + r'[\'"]', content)
    if match:
        existing_symbols = match.group(1)
        new_symbols = existing_symbols + f", {symbol}"
        content = content[:match.start(1)] + new_symbols + content[match.end(1):]
    else:
        # Append as new import below existing ones
        import_stmt = f"import {{ {symbol} }} from '{module_path}';\n"
        # Find first non-import line
        lines = content.split('\n')
        idx = 0
        for i, line in enumerate(lines):
            if not line.startswith('import') and line.strip() != '':
                idx = i
                break
        lines.insert(idx, import_stmt)
        content = '\n'.join(lines)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed imports in {filepath}")

# analytics.controller.ts
f1 = os.path.join(backend_dir, 'analytics', 'analytics.controller.ts')
ensure_import(f1, 'Role', '@prisma/client')
ensure_import(f1, 'Req', '@nestjs/common')
ensure_import(f1, 'Roles', '../../common/decorators/roles.decorator')
ensure_import(f1, 'AuthenticatedRequest', '../../types/request-user') # Might not exist, let's use any for req or just define it. Wait, let's just use `Request` from express or change Req to @Req() req: any

def replace_auth_req(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('AuthenticatedRequest', 'any')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)

replace_auth_req(f1)

# chat.controller.ts
f2 = os.path.join(backend_dir, 'chat', 'chat.controller.ts')
ensure_import(f2, 'Delete', '@nestjs/common')
replace_auth_req(f2)

# order.controller.ts
f3 = os.path.join(backend_dir, 'order', 'order.controller.ts')
replace_auth_req(f3)

# order.service.ts
f4 = os.path.join(backend_dir, 'order', 'order.service.ts')
with open(f4, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('this.orderRepository.updateOrderStatus', 'this.prisma.order.update({where: {id}, data: {status: status as any}})')
with open(f4, 'w', encoding='utf-8') as f:
    f.write(c)

# payments.controller.ts
f5 = os.path.join(backend_dir, 'payments', 'payments.controller.ts')
ensure_import(f5, 'Role', '@prisma/client')
ensure_import(f5, 'Req', '@nestjs/common')
ensure_import(f5, 'Roles', '../../common/decorators/roles.decorator')
replace_auth_req(f5)

# products.controller.ts
f6 = os.path.join(backend_dir, 'products', 'products.controller.ts')
replace_auth_req(f6)

# auction.controller.ts
f7 = os.path.join(backend_dir, 'auction', 'auction.controller.ts')
replace_auth_req(f7)

# auth.controller.ts
f8 = os.path.join(backend_dir, 'auth', 'auth.controller.ts')
replace_auth_req(f8)

print("Imports fixed.")
