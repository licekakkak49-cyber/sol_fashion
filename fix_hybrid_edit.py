with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

old_click_wrapper = """                        cursor: 'grab'
                      }}
                    >"""

new_click_wrapper = """                        cursor: isPlaceholder ? 'pointer' : 'grab'
                      }}
                      onClick={(e) => { 
                         if (isPlaceholder) {
                             e.stopPropagation();
                             handleBlockClick(item);
                         }
                      }}
                    >"""

content = content.replace(old_click_wrapper, new_click_wrapper)

old_buttons = """                      {item.contentType !== 'spacer' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleBlockClick(item); }}
                          style={{ position: 'absolute', top: 12, right: 44, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6', padding: '6px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                          title="Edit Block"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}"""

new_buttons = """                      {!isPlaceholder && item.contentType !== 'spacer' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleBlockClick(item); }}
                          style={{ position: 'absolute', top: 12, right: 44, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6', padding: '6px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                          title="Edit Block"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}"""

content = content.replace(old_buttons, new_buttons)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(content)

print("Hybrid edit fixed!")
