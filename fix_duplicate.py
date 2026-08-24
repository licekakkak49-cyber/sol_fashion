with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    lines = f.readlines()

# The old block starts around `const logicalRowsUI = [];` and ends before `const renderItems`
start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "const logicalRowsUI = [];" in line:
        start_idx = i
    if "const renderItems = sortedItems.map(" in line and start_idx != -1:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    del lines[start_idx:end_idx]

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.writelines(lines)
