import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

# 1. Add handleMoveRowUp and handleMoveRowDown
move_fns = """  const handleToggleIndent = (row) => {
"""
new_move_fns = """  const handleMoveRowUp = (rowIndex) => {
     if (rowIndex === 0) return;
     const rows = logicalRowsUI.map(r => r.items.map(id => sortedItems.find(item => item.id === id)));
     const temp = rows[rowIndex];
     rows[rowIndex] = rows[rowIndex - 1];
     rows[rowIndex - 1] = temp;
     updateGridOrder(rows.flat());
  };

  const handleMoveRowDown = (rowIndex) => {
     if (rowIndex === logicalRowsUI.length - 1) return;
     const rows = logicalRowsUI.map(r => r.items.map(id => sortedItems.find(item => item.id === id)));
     const temp = rows[rowIndex];
     rows[rowIndex] = rows[rowIndex + 1];
     rows[rowIndex + 1] = temp;
     updateGridOrder(rows.flat());
  };

  const handleToggleIndent = (row) => {
"""
content = content.replace(move_fns, new_move_fns)

# 2. Add buttons to Row Controls
row_ui_old = """            {/* Row Controls */}
            {logicalRowsUI.map(row => (
               <div 
                 key={row.id}
                 style={{
                   position: 'absolute',
                   left: '-140px',
                   top: `${row.minY * rowHeight + row.minY * 12}px`,
                   width: '120px',
                   zIndex: 10,
                   display: 'flex',
                   alignItems: 'flex-start',
                   justifyContent: 'flex-end',
                   paddingTop: '20px'
                 }}
               >
                  <button
                     onClick={() => handleToggleIndent(row)}
                     style={{
                        background: row.isIndented ? '#111' : '#fff',
                        color: row.isIndented ? '#fff' : '#111',
                        border: row.isIndented ? '1px solid #111' : '1px solid #ddd',
                        padding: '6px 12px',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                     }}
                  >
                     {row.isIndented ? '→ Indented' : '+ Left Space'}
                  </button>
               </div>
            ))}"""

row_ui_new = """            {/* Row Controls */}
            {logicalRowsUI.map((row, i) => (
               <div 
                 key={row.id}
                 style={{
                   position: 'absolute',
                   left: '-200px',
                   top: `${row.minY * rowHeight + row.minY * 12}px`,
                   width: '180px',
                   zIndex: 10,
                   display: 'flex',
                   alignItems: 'flex-start',
                   justifyContent: 'flex-end',
                   paddingTop: '20px',
                   gap: '8px'
                 }}
               >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button 
                      onClick={() => handleMoveRowUp(i)}
                      disabled={i === 0}
                      style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.3 : 1 }}
                      title="Move Row Up"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => handleMoveRowDown(i)}
                      disabled={i === logicalRowsUI.length - 1}
                      style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', cursor: i === logicalRowsUI.length - 1 ? 'not-allowed' : 'pointer', opacity: i === logicalRowsUI.length - 1 ? 0.3 : 1 }}
                      title="Move Row Down"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                     onClick={() => handleToggleIndent(row)}
                     style={{
                        background: row.isIndented ? '#111' : '#fff',
                        color: row.isIndented ? '#fff' : '#111',
                        border: row.isIndented ? '1px solid #111' : '1px solid #ddd',
                        padding: '6px 12px',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                     }}
                  >
                     {row.isIndented ? '→ Indented' : '+ Left Space'}
                  </button>
               </div>
            ))}"""

content = content.replace(row_ui_old, row_ui_new)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(content)

print("Row controls added!")
