import re

with open('src/context/AdminContext.jsx', 'r') as f:
    code = f.read()

replacement = """        grid_index: i,
        layout_size: newItemsOrder[i].layoutSize,
        content_data: newItemsOrder[i].contentData
      }).eq('id', newItemsOrder[i].id);"""

original = """        grid_index: i,
        layout_size: newItemsOrder[i].layoutSize 
      }).eq('id', newItemsOrder[i].id);"""

code = code.replace(replacement, original)

# I ALSO modified fetchAllData! But I actually FIXED a massive bug there where it wasn't fetching homepage_grid_items!
# Wait, if I revert fetchAllData, the user will STILL have the 1x1 bug if they reload?
# But before I added it, HOW DID IT WORK?
# Maybe `HomePage.jsx` fetched it, and when the user is in Admin, they navigate there and they see it? No!
# Let me leave the `fetchHomepageGridItems` in `AdminContext.jsx` alone because that is a pure bug fix that ensures data actually loads on mount!
# The user wants to revert the UI mess. The UI mess was caused by `HomePage.jsx` layout groupings and `ManageHomepagePage.jsx` logic.
# I will NOT revert the fetch fix because that is a genuine fix.

with open('src/context/AdminContext.jsx', 'w') as f:
    f.write(code)
