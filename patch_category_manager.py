import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/CategoriesManagerModal.jsx', 'r') as f:
    c = f.read()

# 1. Update the import from useAdmin to include addCategory and addSubCategory
old_use_admin = "const { categories, deleteCategory, deleteSubCategory, reorderCategories, reorderSubCategories, products } = useAdmin();"
new_use_admin = "const { categories, addCategory, addSubCategory, deleteCategory, deleteSubCategory, reorderCategories, reorderSubCategories, products } = useAdmin();"
c = c.replace(old_use_admin, new_use_admin)

# 2. Add state for inline inputs
old_state = "const [expandedCats, setExpandedCats] = useState({});"
new_state = """const [expandedCats, setExpandedCats] = useState({});
  const [addingMain, setAddingMain] = useState(false);
  const [newMainName, setNewMainName] = useState('');
  const [addingSubFor, setAddingSubFor] = useState(null);
  const [newSubName, setNewSubName] = useState('');"""
c = c.replace(old_state, new_state)

# 3. Add handlers for saving new categories
old_handlers_end = """    deleteSubCategory(mainName, subName);
  };"""

new_handlers_end = """    deleteSubCategory(mainName, subName);
  };

  const handleSaveMain = () => {
    if (newMainName.trim()) {
      addCategory(newMainName.trim());
      setNewMainName('');
      setAddingMain(false);
    }
  };

  const handleSaveSub = (mainName) => {
    if (newSubName.trim()) {
      addSubCategory(mainName, newSubName.trim());
      setNewSubName('');
      setAddingSubFor(null);
    }
  };"""
c = c.replace(old_handlers_end, new_handlers_end)

# 4. Add "Add Subcategory" button inside the expanded view
old_sub_expanded = """                      {subs.length === 0 ? ("""
new_sub_expanded = """                      {subs.length === 0 ? ("""

old_sub_map = """                          );
                        })
                      )}
                    </div>
                  )}"""

new_sub_map = """                          );
                        })
                      )}
                      
                      {/* Add Subcategory Inline */}
                      {addingSubFor === mainCat ? (
                        <div style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            autoFocus
                            value={newSubName}
                            onChange={e => setNewSubName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveSub(mainCat)}
                            placeholder="Subcategory name..."
                            style={{ flex: 1, padding: '6px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
                          />
                          <button onClick={() => handleSaveSub(mainCat)} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setAddingSubFor(null)} style={{ background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ padding: '8px 24px', display: 'flex' }}>
                          <button 
                            onClick={() => { setAddingSubFor(mainCat); setNewSubName(''); }}
                            style={{ background: 'none', border: 'none', color: '#666', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            + Add Subcategory
                          </button>
                        </div>
                      )}
                    </div>
                  )}"""
c = c.replace(old_sub_map, new_sub_map)

# 5. Add "Add Main Category" button at the bottom of the list
old_main_list_end = """            })}
          </div>

        </div>"""

new_main_list_end = """            })}
            
            {/* Add Main Category Inline */}
            {addingMain ? (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: '#f9fafb' }}>
                <input 
                  autoFocus
                  value={newMainName}
                  onChange={e => setNewMainName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveMain()}
                  placeholder="Main category name..."
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                />
                <button onClick={handleSaveMain} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                <button onClick={() => setAddingMain(false)} style={{ background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Cancel</button>
              </div>
            ) : (
              <button 
                onClick={() => { setAddingMain(true); setNewMainName(''); }}
                style={{ background: '#f9fafb', border: '1px dashed #ccc', borderRadius: '12px', padding: '12px 16px', color: '#666', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 500 }}
              >
                + Add Main Category
              </button>
            )}
          </div>

        </div>"""
c = c.replace(old_main_list_end, new_main_list_end)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/CategoriesManagerModal.jsx', 'w') as f:
    f.write(c)
