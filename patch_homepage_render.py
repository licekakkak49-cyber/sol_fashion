import re

with open('src/pages/HomePage.jsx', 'r') as f:
    code = f.read()

replacement = """        let displayClass = '';
        if (item.layout_size === '4x2') {
          const mode = item.content_data?.displayMode || 'normal';
          if (mode === 'edge-to-edge') displayClass = styles.edgeToEdge;
          if (mode === 'full-width') displayClass = styles.fullWidth;
        }

        // For text blocks (4x1), we DO NOT want to constrain aspectRatio
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
          >"""

code = re.sub(r"        let displayClass = '';\n        if \(item\.layout_size === '4x2'\) \{.*?\}\n\n        return \(\n          <div \n            key=\{item\.id\} \n            className=\{displayClass\}\n            style=\{\{\n              gridColumn: `span \$\{w\}`,(?:.*?)\n              aspectRatio: w === 4 && h === 2 \? '3/2' : '3/4',\n              overflow: 'hidden'\n            \}\}\n          >", replacement.strip(), code, flags=re.DOTALL)

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(code)
