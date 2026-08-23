import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

ui_logic = """      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', paddingLeft: '140px' }}>
        <div style={{ margin: '-12px', position: 'relative' }}>
          
          {/* Row Controls */}
          {logicalRows.map(row => (
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
          ))}

          <ResponsiveGridLayout"""

code = code.replace("""      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ margin: '-12px' }}>
          <ResponsiveGridLayout""", ui_logic)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
