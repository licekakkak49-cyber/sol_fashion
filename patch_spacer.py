import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# 1. Update handleAddBlock
add_block_logic = """  const handleAddBlock = (size, type = 'placeholder') => {
    addHomepageGridItem({
      layoutSize: size,
      contentType: type
    });
  };"""

code = re.sub(r"  const handleAddBlock = \(size\) => \{\n    addHomepageGridItem\(\{\n      layoutSize: size\n    \}\);\n  \};", add_block_logic, code)

# 2. Add the button
btn_logic = """          <button onClick={() => handleAddBlock('4x2')} style={addBtnStyle}><Plus size={16}/> 4x2 (Hero/Banner)</button>
          <button onClick={() => handleAddBlock('4x1')} style={addBtnStyle}><Plus size={16}/> 4x1 (Text Module)</button>
          <button onClick={() => handleAddBlock('4x1', 'spacer')} style={addBtnStyle}><Plus size={16}/> 4x1 (Vertical Space)</button>"""

code = code.replace("""          <button onClick={() => handleAddBlock('4x2')} style={addBtnStyle}><Plus size={16}/> 4x2 (Hero/Banner)</button>
          <button onClick={() => handleAddBlock('4x1')} style={addBtnStyle}><Plus size={16}/> 4x1 (Text Module)</button>""", btn_logic)

# 3. Update the item render
item_render = """                  <div 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      background: isPlaceholder ? '#fef3c7' : item.contentType === 'spacer' ? 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px)' : '#fff',
                      border: '2px dashed #e5e7eb',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                    onClick={() => {
                       if (item.contentType !== 'spacer') {
                           setEditorConfig({ isOpen: true, itemId: item.id });
                       }
                    }}
                  >
                    {item.contentType === 'spacer' ? (
                       <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Empty Vertical Space</span>
                       </div>
                    ) : item.contentType === 'text' ? (
                      <div style={{ pointerEvents: 'none', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <TextBlock data={item.contentData} isPreview={true} />
                      </div>
                    ) : item.contentType === 'image' && item.contentData?.imageUrl ? (
                      <img src={item.contentData.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Block" />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                        <span style={{ fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>
                          {item.layoutSize === '4x2' ? '4x2 (Hero/Banner)' : 
                           item.layoutSize === '4x1' ? '4x1 (Text)' :
                           item.layoutSize === '2x2' ? '2x2 (Large)' : '1x1 (Small)'}
                        </span>
                      </div>
                    )}
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteHomepageGridItem(item.id); }}
                      style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4, zIndex: 10 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>"""

code = re.sub(r"                  <div \n                    style=\{\{ \n                      width: '100%', \n                      height: '100%', .*?\n                  </div>", item_render.strip(), code, flags=re.DOTALL)


with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
