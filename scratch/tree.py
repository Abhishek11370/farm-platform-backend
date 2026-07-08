import os
import sys

root_dir = r'c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform'
output_file = r'C:\Users\abhis\.gemini\antigravity-ide\brain\a9fe9183-96f2-4b12-9759-ba80d161bf64\project_structure.md'
ignores = {'.git', 'node_modules', 'dist', 'build', '.dart_tool', 'generated', '.pub-cache', 'ios', 'android', 'web', 'macos', 'windows', 'linux'}

res = ['# Project Structure\n\n```text']
res.append(os.path.basename(root_dir) + '/')

def walk(path, prefix=''):
    try:
        items = sorted([d for d in os.listdir(path) if d not in ignores])
    except PermissionError:
        return
    
    for i, item in enumerate(items):
        is_last = (i == len(items) - 1)
        res.append(prefix + ('└── ' if is_last else '├── ') + item)
        sub_path = os.path.join(path, item)
        if os.path.isdir(sub_path):
            walk(sub_path, prefix + ('    ' if is_last else '│   '))

walk(root_dir)
res.append('```\n')

with open(output_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(res))

print("Done")
