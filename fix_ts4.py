import os

backend_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src\modules"

f1 = os.path.join(backend_dir, 'order', 'order.controller.ts')
with open(f1, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any occurrence of `import { Request } from "express";` with nothing, except the first one.
# Easier way: just remove all of them and add it at the top once.

content = content.replace("import { Request } from \"express\";", "")
content = content.replace("import { Request } from 'express';", "")

content = "import { Request } from 'express';\n" + content

with open(f1, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed order.controller.ts duplicate imports")
