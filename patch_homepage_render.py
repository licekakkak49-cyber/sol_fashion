import re

with open('src/pages/HomePage.jsx', 'r') as f:
    code = f.read()

# I want to replace the `items.map` block entirely.
start_marker = "  return (\n    <div className={styles.homepageGrid}>"
end_marker = "    </div>\n  );\n};\n\nexport default HomePage;"

replacement = """  // Calculate Logical Rows
  const rows = [];
  items.forEach(item => {
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
            {row.items.map((item) => {
              let Component = null;
              let w = 1;
              let h = 1;

              if (item.layout_size === '2x2') { w = 2; h = 2; }
              if (item.layout_size === '4x2') { w = 4; h = 2; }
              
              if (item.content_type === 'image' && item.layout_size === '4x2') { Component = HeroBlock; }
              else if (item.content_type === 'image') { Component = ImageBlock; }
              else if (item.content_type === 'product') { Component = ProductBlock; }
              else if (item.content_type === 'text') { Component = TextBlock; }
              else if (item.content_type === 'spacer') { Component = SpacerBlock; }
              else if (item.content_type === 'collection-highlight') { Component = CollectionHighlight; }

              if (!Component || item.content_type === 'placeholder') return null;

              let displayClass = '';
              if (item.layout_size === '4x2') {
                const mode = item.content_data?.displayMode || 'normal';
                if (mode === 'edge-to-edge') displayClass = styles.edgeToEdge;
                if (mode === 'full-width') displayClass = styles.fullWidth;
              }

              return (
                <div 
                  key={item.id} 
                  className={displayClass}
                  style={{
                    gridColumn: `span ${w}`,
                    gridRow: `span ${h}`,
                    aspectRatio: w === 4 && h === 2 ? '3/2' : '3/4',
                    overflow: 'hidden'
                  }}
                >
                  <Component data={item.content_data} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;"""

code = code[:code.find(start_marker)] + replacement

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(code)
