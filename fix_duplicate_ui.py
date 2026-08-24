with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "{logicalRowsUI.map" in line:
        # Found the first loop
        start_idx = i - 1 # Include the comment
    if "{/* Row Controls */}" in line and i > start_idx + 5 and start_idx != -1:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    del lines[start_idx:end_idx]

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.writelines(lines)
