import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# 1. Remove the static padding from the grid container
code = code.replace("<div style={{ margin: '-12px', position: 'relative', paddingLeft: '140px' }}>", "<div style={{ position: 'relative' }}>")

# 2. Update the floating buttons
# We want them to float on the left edge, maybe slightly overlapping the grid.
# But we don't want them to be huge. We can make them sleek.

old_button_container = """             <div 
               key={row.id}
               style={{
                 position: 'absolute',
                 left: '0px',
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
             </div>"""

new_button_container = """             <div 
               key={row.id}
               style={{
                 position: 'absolute',
                 left: '12px',
                 top: `${row.minY * rowHeight + row.minY * 12 + 12}px`,
                 zIndex: 20,
                 display: 'flex'
               }}
             >
                <button
                   onClick={(e) => { e.stopPropagation(); handleToggleIndent(row); }}
                   style={{
                      background: row.isIndented ? '#111' : 'rgba(255, 255, 255, 0.9)',
                      color: row.isIndented ? '#fff' : '#111',
                      border: row.isIndented ? '1px solid #111' : '1px solid #ddd',
                      padding: '8px 14px',
                      borderRadius: '100px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.2s ease',
                      opacity: row.isIndented ? 1 : 0.6,
                   }}
                   onMouseEnter={e => e.currentTarget.style.opacity = 1}
                   onMouseLeave={e => e.currentTarget.style.opacity = row.isIndented ? 1 : 0.6}
                >
                   {row.isIndented ? '→ Indented' : '+ Left Space'}
                </button>
             </div>"""

code = code.replace(old_button_container, new_button_container)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
