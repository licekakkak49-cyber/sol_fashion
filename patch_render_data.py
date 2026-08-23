import re
with open('src/components/GlobalFilterPanel.jsx', 'r') as f:
    code = f.read()

code = code.replace("{renderColorOptions('color', FILTER_DATA.color)}", "{renderColorOptions('color', dynamicFilterData.color)}")
code = code.replace("{renderBoxOptions('size', FILTER_DATA.size, true)}", "{renderBoxOptions('size', dynamicFilterData.size, true)}")
code = code.replace("{renderBoxOptions('category', FILTER_DATA.category)}", "{renderBoxOptions('category', dynamicFilterData.category)}")

with open('src/components/GlobalFilterPanel.jsx', 'w') as f:
    f.write(code)
