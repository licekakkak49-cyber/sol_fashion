with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

old_click_wrapper = """                        cursor: 'pointer'
                      }}
                      onClick={(e) => { 
                         e.stopPropagation();
                         if (item.contentType !== 'spacer') {
                             handleBlockClick(item);
                         }
                      }}
                    >"""

new_click_wrapper = """                        cursor: 'grab'
                      }}
                    >"""

content = content.replace(old_click_wrapper, new_click_wrapper)

old_buttons = """                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteHomepageGridItem(item.id); }}
                        style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4, zIndex: 10 }}
                      >
                        <Trash2 size={16} />
                      </button>"""

new_buttons = """                      {item.contentType !== 'spacer' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleBlockClick(item); }}
                          style={{ position: 'absolute', top: 12, right: 44, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6', padding: '6px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                          title="Edit Block"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteHomepageGridItem(item.id); }}
                        style={{ position: 'absolute', top: 12, right: 12, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#ef4444', padding: '6px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                        title="Delete Block"
                      >
                        <Trash2 size={14} />
                      </button>"""

content = content.replace(old_buttons, new_buttons)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(content)

print("Buttons fixed!")
