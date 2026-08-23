import re

with open('src/pages/HomePage.jsx', 'r') as f:
    code = f.read()

stable_logic = """  return (
    <div className={styles.homepageContainer}>
      <div className={styles.homepageGrid}>
        {homepageGridItems.map(item => {
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
    </div>
  );"""

code = re.sub(r"  // Group items by logicalRowId\n  const rows = \[\];.*?\n    </div>\n  \);", stable_logic.strip(), code, flags=re.DOTALL)

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(code)
