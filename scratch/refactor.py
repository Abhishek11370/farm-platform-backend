import os
import hashlib
import shutil

root_dir = r'c:\Users\abhis\.gemini\antigravity\scratch\farm-to-platform\Backend\src'
src_src_dir = os.path.join(root_dir, 'src')

def get_hash(filepath):
    with open(filepath, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

# 1. Deduplication within src/src
hashes = {}
duplicates_to_delete = []

for dirpath, dirnames, filenames in os.walk(src_src_dir):
    for filename in filenames:
        if filename.endswith('.ts'):
            full_path = os.path.join(dirpath, filename)
            h = get_hash(full_path)
            if h in hashes:
                existing = hashes[h]
                # Keep the one in 'modules', delete the other
                if 'modules' in full_path and 'modules' not in existing:
                    duplicates_to_delete.append(existing)
                    hashes[h] = full_path
                elif 'modules' in existing and 'modules' not in full_path:
                    duplicates_to_delete.append(full_path)
                else:
                    # both in modules or both outside? Just delete one
                    duplicates_to_delete.append(full_path)
            else:
                hashes[h] = full_path

print(f"Found {len(duplicates_to_delete)} duplicate files to delete.")
for f in duplicates_to_delete:
    print(f"Deleting {f}")
    os.remove(f)

# 2. Check for Backend/src/types duplicate
outer_types_dir = os.path.join(root_dir, 'types')
if os.path.exists(outer_types_dir):
    for filename in os.listdir(outer_types_dir):
        outer_file = os.path.join(outer_types_dir, filename)
        inner_file = os.path.join(src_src_dir, 'types', filename)
        if os.path.isfile(outer_file) and os.path.isfile(inner_file):
            if get_hash(outer_file) == get_hash(inner_file):
                print(f"Deleting outer duplicate: {outer_file}")
                os.remove(outer_file)

# 3. Move everything from src/src to src
print("Moving files from src/src to src...")

def move_tree(src, dst):
    if not os.path.exists(dst):
        os.makedirs(dst)
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            move_tree(s, d)
        else:
            if not os.path.exists(d):
                shutil.move(s, d)
            else:
                print(f"Warning: {d} already exists, overwriting!")
                os.remove(d)
                shutil.move(s, d)

move_tree(src_src_dir, root_dir)
shutil.rmtree(src_src_dir)
print("Finished deduplication and moving.")
