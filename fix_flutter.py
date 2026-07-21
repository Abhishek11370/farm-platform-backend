import os
import re

lib_dir = r"c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\farm_to_platform_mobile\lib"

total_withOpacity = 0
total_background = 0
total_print = 0

for root, _, files in os.walk(lib_dir):
    for file in files:
        if not file.endswith(".dart"):
            continue
        filepath = os.path.join(root, file)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = content
        
        # 1. Color.withOpacity -> Color.withValues(alpha: ...)
        if 'withOpacity(' in new_content:
            new_content, count = re.subn(r'\.withOpacity\(([^)]+)\)', r'.withValues(alpha: \1)', new_content)
            total_withOpacity += count

        # 2. background: -> delete the line in app_theme.dart
        if file == "app_theme.dart" and 'background:' in new_content:
            new_content, count = re.subn(r'.*\bbackground:\s*.*\n', r'', new_content)
            total_background += count
        
        # 3. avoid_print -> debugPrint
        if re.search(r'\bprint\(', new_content):
            new_content, count = re.subn(r'\bprint\(', r'debugPrint(', new_content)
            total_print += count
            if count > 0 and "package:flutter/foundation.dart" not in new_content:
                new_content = "import 'package:flutter/foundation.dart';\n" + new_content

        if content != new_content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)

print(f"Fixed withOpacity: {total_withOpacity}")
print(f"Fixed background: {total_background}")
print(f"Fixed print: {total_print}")
