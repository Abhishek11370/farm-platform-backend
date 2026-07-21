import os

backend_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src\modules"

f1 = os.path.join(backend_dir, 'auth', 'auth.controller.ts')
with open(f1, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { any } from '../../types/authenticated-request';", "import { AuthenticatedRequest } from '../../types/authenticated-request';")
content = content.replace("@Req() req: any", "@Req() req: AuthenticatedRequest")

with open(f1, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed auth.controller.ts")
