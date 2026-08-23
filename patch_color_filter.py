import re
with open('src/pages/ProductsPage.jsx', 'r') as f:
    code = f.read()

old_color_logic = """          } else if (category === 'color') {
            const hasColor = (product.colorVariants || []).some(v => values.includes(v.name));
            if (!hasColor) return false;"""

new_color_logic = """          } else if (category === 'color') {
            const hasColor = (product.colorVariants || []).some(v => {
              if (!values.includes(v.name)) return false;
              return v.stock && Object.values(v.stock).some(qty => parseInt(qty) > 0);
            });
            if (!hasColor) return false;"""

code = code.replace(old_color_logic, new_color_logic)
with open('src/pages/ProductsPage.jsx', 'w') as f:
    f.write(code)

with open('src/components/SearchDrawer.jsx', 'r') as f:
    code2 = f.read()
code2 = code2.replace(old_color_logic, new_color_logic)
with open('src/components/SearchDrawer.jsx', 'w') as f:
    f.write(code2)
