import os
import re

target_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\farm_to_platform_mobile\lib"

pattern = re.compile(r"ApiService\.(get|post|put|delete|patch)\((['\"])(.*?)\2")

endpoints = set()

for root, _, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.dart'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = pattern.findall(content)
                for method, quote, endpoint in matches:
                    endpoints.add(f"{method.upper()} {endpoint} (in {file})")

with open('flutter_endpoints.txt', 'w', encoding='utf-8') as f:
    for ep in sorted(list(endpoints)):
        f.write(ep + "\n")
print(f"Extracted {len(endpoints)} endpoints.")
