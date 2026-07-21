import os

target_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\farm_to_platform_mobile\lib"

replacements = {
    "'/products": "'/product",
    "'/products/": "'/product/",
    "'/auctions": "'/auction",
    "'/auctions/": "'/auction/",
    "'/messages": "'/chat",
    "'/messages/": "'/chat/",
    "'/admin/stats'": "'/analytics/dashboard'",
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.dart'):
            process_file(os.path.join(root, file))
