import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# 1. Update the layout calculation
layout_logic = """    sortedItems.forEach((item, index) => {
      let w = 1;
      let h = 4; // 1x1 image is 4 subdivisions tall
      
      if (item.layoutSize === '2x2') { w = 2; h = 8; }
      if (item.layoutSize === '4x2') { w = 4; h = 8; }
      if (item.layoutSize === '4x1') { w = 4; h = 1; } // Text is 1 subdivision tall"""

code = re.sub(r"    sortedItems\.forEach\(\(item, index\) => \{\n      let w = 1;\n      let h = 1;\n      \n      if \(item\.layoutSize === '2x2'\) \{ w = 2; h = 2; \}\n      if \(item\.layoutSize === '4x2'\) \{ w = 4; h = 2; \}\n      if \(item\.layoutSize === '4x1'\) \{ w = 4; h = 1; \}", layout_logic, code)

# 2. Update rowHeight calculation
rowheight_logic = """            onWidthChange={(containerWidth, margin, cols, containerPadding) => {
              const pad = containerPadding ? (containerPadding[0] * 2) : 0;
              const colW = (containerWidth - (margin[0] * (cols - 1)) - pad) / cols;
              // Subdivided by 4:
              // Total target height for 1x1 (h=4) is colW * 4/3
              // h=4 height is (4 * rowHeight) + (3 * marginY)
              const targetHeight = (colW * (4/3));
              const newRowHeight = (targetHeight - (3 * margin[1])) / 4;
              setRowHeight(newRowHeight);
            }}"""

code = re.sub(r"            onWidthChange=\{\(containerWidth, margin, cols, containerPadding\) => \{.*?\n            \}\}", rowheight_logic.strip(), code, flags=re.DOTALL)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
