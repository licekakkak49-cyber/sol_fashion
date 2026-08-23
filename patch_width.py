import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

replacement = """onDragStop={handleDragStop}
            onWidthChange={(containerWidth, margin, cols, containerPadding) => {
              const pad = containerPadding ? (containerPadding[0] * 2) : 0;
              const colW = (containerWidth - (margin[0] * (cols - 1)) - pad) / cols;
              const newRowHeight = (colW * (4/3)); // removed +70 if we want pure 3:4, but let's check what SetsManager did
              setRowHeight(newRowHeight);
            }}"""
            
code = code.replace("onDragStop={handleDragStop}", replacement)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
