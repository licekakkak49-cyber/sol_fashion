import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

toggle_logic = """    const handleToggleIndent = (row) => {
       const newItems = sortedItems.map(item => {
          if (row.items.includes(item.id)) {
             return {
                ...item,
                contentData: { ...item.contentData, isIndented: !row.isIndented }
             };
          }
          return item;
       });
       updateGridOrder(newItems);
    };"""

code = re.sub(r"    const handleToggleIndent = \(row\) => \{.*?\n       if \(updates\.length > 0\) updateGridOrder\(updates\);\n    \};", toggle_logic.strip(), code, flags=re.DOTALL)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
