with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

old_logic = "const isPlaceholder = item.contentType === 'placeholder';"
new_logic = "const isPlaceholder = item.contentType === 'placeholder' || (item.contentType === 'image' && !item.contentData?.imageUrl) || (item.contentType === 'product' && !item.contentData?.productId);"

if old_logic in content:
    content = content.replace(old_logic, new_logic)
    with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
        f.write(content)
    print("Placeholder logic fixed!")
else:
    print("Could not find old logic.")
