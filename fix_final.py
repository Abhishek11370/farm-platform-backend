import os

backend_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src\modules"

def replace_file_content(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix auth.controller.ts
f1 = os.path.join(backend_dir, 'auth', 'auth.controller.ts')
replace_file_content(f1, [
    ("import { AuthenticatedRequest } from '../../types/authenticated-request';", ""),
    ("interface AuthenticatedRequest extends Request { user: RequestUser; }", "import { RequestUser } from '../../types/request-user';\ninterface AuthenticatedRequest extends Request { user: RequestUser; }")
])

# Fix order.controller.ts
f2 = os.path.join(backend_dir, 'order', 'order.controller.ts')
replace_file_content(f2, [
    ("import { Request } from 'express';\nimport { Request } from 'express';", "import { Request } from 'express';")
])

print("Final fix done")
