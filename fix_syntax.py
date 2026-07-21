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

# Fix chat.controller.ts
f1 = os.path.join(backend_dir, 'chat', 'chat.controller.ts')
replace_file_content(f1, [
    ("\n, Delete}", ", Delete\n}"),
    ("interface any extends Request {", "interface AuthenticatedRequest extends Request {"),
    ("@Req() req: any", "@Req() req: AuthenticatedRequest")
])

# Fix payments.controller.ts
f2 = os.path.join(backend_dir, 'payments', 'payments.controller.ts')
replace_file_content(f2, [
    ("\n, Role}", ", Role\n}"),
    ("\n, Req}", ", Req\n}"),
    ("interface any extends Request {", "interface AuthenticatedRequest extends Request {"),
    ("@Req() req: any", "@Req() req: AuthenticatedRequest")
])

# Fix analytics.controller.ts
f3 = os.path.join(backend_dir, 'analytics', 'analytics.controller.ts')
replace_file_content(f3, [
    ("\n, Role}", ", Role\n}"),
    ("\n, Req}", ", Req\n}"),
    ("interface any extends Request {", "interface AuthenticatedRequest extends Request {"),
    ("@Req() req: any", "@Req() req: AuthenticatedRequest")
])

# Fix order.controller.ts
f4 = os.path.join(backend_dir, 'order', 'order.controller.ts')
replace_file_content(f4, [
    ("interface any extends Request {", "interface AuthenticatedRequest extends Request {"),
    ("@Req() req: any", "@Req() req: AuthenticatedRequest")
])

# Fix products.controller.ts
f5 = os.path.join(backend_dir, 'products', 'products.controller.ts')
replace_file_content(f5, [
    ("interface any extends Request {", "interface AuthenticatedRequest extends Request {"),
    ("@Req() req: any", "@Req() req: AuthenticatedRequest")
])

# Fix auction.controller.ts
f6 = os.path.join(backend_dir, 'auction', 'auction.controller.ts')
replace_file_content(f6, [
    ("interface any extends Request {", "interface AuthenticatedRequest extends Request {"),
    ("@Req() req: any", "@Req() req: AuthenticatedRequest")
])

# Fix auth.controller.ts
f7 = os.path.join(backend_dir, 'auth', 'auth.controller.ts')
replace_file_content(f7, [
    ("interface any extends Request {", "interface AuthenticatedRequest extends Request {"),
    ("@Req() req: any", "@Req() req: AuthenticatedRequest")
])

print("Syntax errors fixed.")
