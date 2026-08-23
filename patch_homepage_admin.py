import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# Add button
btn_html = """          <button onClick={() => handleAddBlock('4x2')} style={addBtnStyle}><Plus size={16}/> 4x2 (Hero/Banner)</button>
          <button onClick={() => handleAddBlock('4x1')} style={addBtnStyle}><Plus size={16}/> 4x1 (Text Module)</button>"""
code = code.replace("<button onClick={() => handleAddBlock('4x2')} style={addBtnStyle}><Plus size={16}/> 4x2 (Hero/Banner)</button>", btn_html)

# Add logic for 4x1 bin packing
binpack_logic = """      if (item.layoutSize === '2x2') { w = 2; h = 2; }
      if (item.layoutSize === '4x2') { w = 4; h = 2; }
      if (item.layoutSize === '4x1') { w = 4; h = 1; }"""
code = code.replace("""      if (item.layoutSize === '2x2') { w = 2; h = 2; }
      if (item.layoutSize === '4x2') { w = 4; h = 2; }""", binpack_logic)

# Ghost slot label
ghost_label = """                        {item.layoutSize === '4x2' ? '4x2 (Hero/Banner)' : 
                         item.layoutSize === '4x1' ? '4x1 (Text Module)' :
                         item.layoutSize === '2x2' ? '2x2 (Large)' : '1x1 (Small)'}"""
code = re.sub(r"\{item\.layoutSize === '4x2' \? '4x2 \(Hero/Banner\)' : item\.layoutSize === '2x2' \? '2x2 \(Large\)' : '1x1 \(Small\)'\}", ghost_label.strip(), code)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
