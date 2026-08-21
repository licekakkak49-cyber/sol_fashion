import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 2. Update handleCreateSet
old_create = '''  const handleCreateSet = () => {
    const defaultItems = [
      { productId: `draft-${Date.now()}-1`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-2`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-3`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-4`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-5`, layoutSize: 'large' },
    ];

    addSet({ 
      name: 'New Collection', 
      status: 'draft', 
      items: defaultItems, 
      mainCategory: activeMainCategory, 
      subCategory: activeSubCategory 
    });
  };'''

new_create = '''  const handleCreateSet = () => {
    if (!newSetName.trim()) return;
    const defaultItems = [
      { productId: `draft-${Date.now()}-1`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-2`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-3`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-4`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-5`, layoutSize: 'large' },
    ];

    addSet({ 
      name: newSetName.trim(), 
      status: 'draft', 
      items: defaultItems, 
      mainCategory: activeMainCategory, 
      subCategory: activeSubCategory 
    });
    setNewSetName("");
    setIsAddingSet(false);
  };'''

if old_create in c:
    c = c.replace(old_create, new_create)
else:
    print('Failed to replace handleCreateSet')

# 3. Update the button to open modal instead of creating instantly
old_btn = '''        {activeSubCategory && activeSubCategory !== 'All' && (
          <button className={styles.btnPrimary} onClick={handleCreateSet} style={{ flexShrink: 0 }}>
            <Plus size={14} style={{ marginRight: isMobile ? '0' : '6px' }} />
            {!isMobile && `New Look Set in ${activeSubCategory}`}
          </button>
        )}'''

new_btn = '''        {activeSubCategory && activeSubCategory !== 'All' && (
          <button className={styles.btnPrimary} onClick={() => setIsAddingSet(true)} style={{ flexShrink: 0 }}>
            <Plus size={14} style={{ marginRight: isMobile ? '0' : '6px' }} />
            {!isMobile && `New Look Set in ${activeSubCategory}`}
          </button>
        )}'''

if old_btn in c:
    c = c.replace(old_btn, new_btn)
else:
    print('Failed to replace new look set button')

# 4. Insert Modal JSX at the end of the return statement
modal_jsx = '''      {/* Create Set Modal */}
      {isAddingSet && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111' }}>Create New Look Set</h3>
              <button onClick={() => { setIsAddingSet(false); setNewSetName(""); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>COLLECTION NAME</label>
              <input
                type="text"
                placeholder="e.g., Summer Beach Collection 2026"
                value={newSetName}
                onChange={e => setNewSetName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newSetName.trim()) handleCreateSet(); }}
                autoFocus
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#f9fafb' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setIsAddingSet(false); setNewSetName(""); }} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#111', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                onClick={handleCreateSet} 
                disabled={!newSetName.trim()}
                style={{ flex: 1, padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: newSetName.trim() ? 'pointer' : 'not-allowed', opacity: newSetName.trim() ? 1 : 0.5 }}
              >
                Create Set
              </button>
            </div>
          </div>
        </div>
      )}'''

c_parts = c.rsplit('</div>', 1)
c = c_parts[0] + modal_jsx + '\n    </div>' + c_parts[1]

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
