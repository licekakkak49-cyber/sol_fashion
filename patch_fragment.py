import re
with open('src/pages/admin/components/InventoryList.jsx', 'r') as f:
    code = f.read()

code = code.replace("  return (\n    <div style={{ width: '100%'", "  return (\n    <>\n    <div style={{ width: '100%'")
code = code.replace("        </div>\n      )}\n  </div>\n  );\n}", "        </div>\n      )}\n  </>\n  );\n}")

with open('src/pages/admin/components/InventoryList.jsx', 'w') as f:
    f.write(code)
