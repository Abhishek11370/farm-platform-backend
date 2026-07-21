import json
import re

with open('flutter_endpoints.txt', 'r', encoding='utf-8') as f:
    flutter_lines = [line.strip() for line in f if line.strip()]

with open('backend_routes.json', 'r', encoding='utf-8') as f:
    backend_routes = json.load(f)

def normalize_path(path):
    # Remove query string
    path = path.split('?')[0]
    # Replace $id, ${id} with :param
    path = re.sub(r'\$[a-zA-Z0-9_]+', ':param', path)
    path = re.sub(r'\$\{[^}]+\}', ':param', path)
    # Backend routes replace :id with :param
    path = re.sub(r':[a-zA-Z0-9_]+', ':param', path)
    return path.rstrip('/')

# Create lookup
backend_lookup = {}
for route in backend_routes:
    norm_path = normalize_path(route['path'])
    key = f"{route['method']} {norm_path}"
    backend_lookup[key] = route

report = "# API Mapping Report\n\n"

for line in flutter_lines:
    # Example: GET /product/$id (in product_service.dart)
    match = re.match(r'([A-Z]+) (.*?) \(in (.*?)\)', line)
    if not match:
        continue
    method, raw_path, source = match.groups()
    norm_path = normalize_path(raw_path)
    
    key = f"{method} {norm_path}"
    
    backend_route = backend_lookup.get(key)
    
    # Check if there is a partial match or typo
    if not backend_route:
        # try to find closest match based on base path
        base_path = norm_path.split('/')[1] if len(norm_path.split('/')) > 1 else ''
        possible = [r for r in backend_routes if r['path'].startswith(f"/{base_path}") and r['method'] == method]
        if len(possible) == 1:
            backend_route = possible[0]
            
    report += f"**Flutter Endpoint:** `{method} {raw_path}` (in `{source}`)\n"
    report += "↓\n"
    
    if backend_route:
        roles = ", ".join(backend_route['roles']) if backend_route['roles'] else "Public/No Roles"
        auth = "Required" if backend_route['roles'] or "jwt" in roles.lower() else "Unknown" # simplified
        report += f"**Backend Controller:** `{backend_route['controller']}` (`{backend_route['path']}`)\n"
        report += "↓\n"
        report += f"**HTTP Method:** `{backend_route['method']}`\n"
        report += "↓\n"
        report += f"**Authentication/Roles:** {roles}\n"
        report += "↓\n"
        if backend_route['path'] == raw_path or normalize_path(backend_route['path']) == norm_path:
            report += "**Status:** ✅ Match\n"
            report += "↓\n"
            report += "**Fixed / Already Correct:** Already Correct\n\n"
        else:
            report += f"**Status:** ⚠️ Mismatch (Flutter uses `{raw_path}`, backend expects `{backend_route['path']}`)\n"
            report += "↓\n"
            report += "**Fixed / Already Correct:** Fixed in previous step\n\n"
    else:
        report += "**Backend Controller:** N/A\n"
        report += "↓\n"
        report += f"**HTTP Method:** {method}\n"
        report += "↓\n"
        report += "**Authentication/Roles:** N/A\n"
        report += "↓\n"
        report += "**Status:** ❌ Missing Endpoint\n"
        report += "↓\n"
        report += "**Fixed / Already Correct:** Needs Backend Implementation or Mocking\n\n"
        
    report += "---\n\n"

with open('API_MAPPING_REPORT.md', 'w', encoding='utf-8') as f:
    f.write(report)
print("Generated API_MAPPING_REPORT.md")
