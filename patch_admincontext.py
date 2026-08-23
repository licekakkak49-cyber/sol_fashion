import re

with open('src/context/AdminContext.jsx', 'r') as f:
    code = f.read()

replacement = """        grid_index: i,
        layout_size: newItemsOrder[i].layoutSize,
        content_data: newItemsOrder[i].contentData
      }).eq('id', newItemsOrder[i].id);"""

code = code.replace("""        grid_index: i,
        layout_size: newItemsOrder[i].layoutSize 
      }).eq('id', newItemsOrder[i].id);""", replacement)

with open('src/context/AdminContext.jsx', 'w') as f:
    f.write(code)
