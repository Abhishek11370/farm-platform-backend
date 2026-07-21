import os
import re
import json

backend_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src\modules"

controller_pattern = re.compile(r'@Controller\([\'"]([^\'"]+)[\'"]\)')
method_pattern = re.compile(r'@(Get|Post|Put|Patch|Delete)\((?:[\'"]([^\'"]*)[\'"])?\)')
roles_pattern = re.compile(r'@Roles\(([^)]+)\)')

routes = []

for root, _, files in os.walk(backend_dir):
    for file in files:
        if file.endswith('.controller.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Find controller base path
                base_match = controller_pattern.search(content)
                base_path = base_match.group(1) if base_match else ''
                
                # Find controller-level roles
                c_roles_match = roles_pattern.search(content[:content.find('export class')])
                c_roles = c_roles_match.group(1).replace('Role.', '').replace(',', '').split() if c_roles_match else []
                
                # Split by method decorators
                methods = list(method_pattern.finditer(content))
                for i in range(len(methods)):
                    match = methods[i]
                    http_method = match.group(1).upper()
                    sub_path = match.group(2) or ''
                    
                    full_path = f"/{base_path}/{sub_path}".replace('//', '/').rstrip('/')
                    if not full_path:
                        full_path = '/'
                        
                    # find method block to extract roles
                    start_idx = match.start()
                    end_idx = methods[i+1].start() if i + 1 < len(methods) else len(content)
                    block = content[start_idx:end_idx]
                    
                    m_roles_match = roles_pattern.search(block)
                    m_roles = m_roles_match.group(1).replace('Role.', '').replace(',', '').split() if m_roles_match else []
                    roles = m_roles if m_roles else c_roles
                    
                    routes.append({
                        'method': http_method,
                        'path': full_path,
                        'roles': roles,
                        'controller': file
                    })

with open('backend_routes.json', 'w', encoding='utf-8') as f:
    json.dump(routes, f, indent=2)

print(f"Extracted {len(routes)} routes from backend.")
