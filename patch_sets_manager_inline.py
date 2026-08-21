import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

# Add a header with the "New Look Set" button at the top of SetsManager's return
old_return = '''  return (
    <div>
      

      {isAddingSet && ('''

new_return = '''  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111' }}>
          {activeSubCategory} Look Sets
        </h3>
        {!isAddingSet && (
          <button onClick={() => setIsAddingSet(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '100px', fontWeight: 500, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Plus size={16} /> New Look Set
          </button>
        )}
      </div>

      {isAddingSet && ('''

c = c.replace(old_return, new_return)

# In the empty state, change the text to match the new button, or add a button there too
old_empty = '''        {sets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
            <Layout size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111' }}>No sets created yet</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Click "New Look Set" to create a collection for {activeSubCategory}.</p>
          </div>
        ) : ('''

new_empty = '''        {sets.length === 0 && !isAddingSet ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
            <Layout size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111' }}>No sets created yet</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px' }}>Create your first collection for {activeSubCategory}.</p>
            <button onClick={() => setIsAddingSet(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: '100px', fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={18} /> New Look Set
            </button>
          </div>
        ) : sets.length > 0 ? ('''

c = c.replace(old_empty, new_empty)

# Also update the input to use onKeyDown for Enter
old_input = '''          <input 
            type="text" 
            placeholder="Set Name (e.g., Summer Beach Look)" 
            value={newSetName}
            onChange={e => setNewSetName(e.target.value)}
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
            autoFocus
          />'''

new_input = '''          <input 
            type="text" 
            placeholder="Set Name (e.g., Summer Beach Look)" 
            value={newSetName}
            onChange={e => setNewSetName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreateSet(); }}
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
            autoFocus
          />'''

c = c.replace(old_input, new_input)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
