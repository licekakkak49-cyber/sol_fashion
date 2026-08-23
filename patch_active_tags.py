import re
with open('src/components/GlobalFilterPanel.jsx', 'r') as f:
    code = f.read()

old_footer = """            <div className={styles.footer}>
              <div className={styles.innerContent} style={{ display: 'flex', gap: '6px', width: '100%' }}>"""

new_footer = """            <div className={styles.footer}>
              {Object.keys(selectedFilters || {}).some(k => selectedFilters[k] && selectedFilters[k].length > 0) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                  {Object.entries(selectedFilters || {}).flatMap(([cat, vals]) => 
                    vals.map(val => (
                      <span 
                        key={`${cat}-${val}`} 
                        onClick={() => removeFilter(cat, val)}
                        style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#111', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}
                      >
                        {val} <X size={12} strokeWidth={2} color="#999" style={{ transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#111'} onMouseOut={(e) => e.currentTarget.style.color = '#999'} />
                      </span>
                    ))
                  )}
                </div>
              )}
              <div className={styles.innerContent} style={{ display: 'flex', gap: '6px', width: '100%' }}>"""

code = code.replace(old_footer, new_footer)

with open('src/components/GlobalFilterPanel.jsx', 'w') as f:
    f.write(code)
