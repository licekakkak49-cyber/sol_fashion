import re

with open('src/pages/HomePage.jsx', 'r') as f:
    code = f.read()

# Instead of rendering a flat map inside .homepageGrid, we will group them first
render_logic = """  // Group items by logicalRowId
  const rows = [];
  homepageGridItems.forEach(item => {
     const rowId = item.content_data?.logicalRowId || `default-${item.id}`;
     let row = rows.find(r => r.id === rowId);
     if (!row) {
        row = { id: rowId, items: [], isIndented: item.content_data?.isIndented || false };
        rows.push(row);
     }
     row.items.push(item);
     if (item.content_data?.isIndented) row.isIndented = true;
  });

  return (
    <div className={styles.homepageContainer}>
      <div className={styles.homepageGridWrapper}>
        {rows.map(row => (
          <div 
            key={row.id} 
            className={styles.homepageGrid} 
            style={{ 
               paddingLeft: row.isIndented ? '25%' : '12px',
               transition: 'padding 0.3s ease'
            }}
          >
            {row.items.map(item => {
              let w = 1;
              let h = 1;
              if (item.layout_size === '2x2') { w = 2; h = 2; }
              if (item.layout_size === '4x2') { w = 4; h = 2; }
              if (item.layout_size === '4x1') { w = 4; h = 1; }

              let displayClass = '';
              if (item.layout_size === '4x2') {
                const mode = item.content_data?.displayMode || 'normal';
                if (mode === 'edge-to-edge') displayClass = styles.edgeToEdge;
                if (mode === 'full-width') displayClass = styles.fullWidth;
              }

              const style = {
                gridColumn: `span ${w}`,
                gridRow: `span ${h}`,
                overflow: 'hidden'
              };
              
              if (item.layout_size !== '4x1') {
                style.aspectRatio = w === 4 && h === 2 ? '3/2' : '3/4';
              }

              return (
                <div 
                  key={item.id} 
                  className={displayClass}
                  style={style}
                >
                  {item.content_type === 'image' ? (
                    <ImageBlock data={item.content_data} />
                  ) : item.content_type === 'text' ? (
                    <TextBlock data={item.content_data} />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );"""

code = re.sub(r"  return \(\n    <div className=\{styles\.homepageContainer\}>\n      <div className=\{styles\.homepageGrid\}>\n        \{homepageGridItems\.map\(item => \{.*?\n        \}\)\}\n      </div>\n    </div>\n  \);", render_logic.strip(), code, flags=re.DOTALL)

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(code)
