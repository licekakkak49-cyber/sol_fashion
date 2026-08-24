import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# 1. Add gridWidth state
state_replacement = """  const [rowHeight, setRowHeight] = useState(250);
  const [gridWidth, setGridWidth] = useState(1000);"""
code = code.replace("  const [rowHeight, setRowHeight] = useState(250);", state_replacement)

# 2. Update gridWidth in onWidthChange
width_change_replacement = """              onWidthChange={(width, margin, cols) => {
                setGridWidth(width);
                const colW = (width - (margin[0] * (cols - 1))) / cols;"""
code = code.replace("""              onWidthChange={(width, margin, cols) => {
                const colW = (width - (margin[0] * (cols - 1))) / cols;""", width_change_replacement)

# 3. Update the inner div rendering logic
render_replacement = """              {renderItems.map((item) => {
                const isPlaceholder = item.contentType === 'placeholder';
                const isItemIndented = uiRows.find(r => r.items.includes(item.id))?.isIndented || false;
                
                const layoutItem = layout.find(l => l.i === item.id);
                const x = layoutItem?.x || 0;
                const w = layoutItem?.w || 2;
                
                const shiftPx = isItemIndented ? 0.25 * gridWidth * (1 - x / 4) : 0;
                const shrinkPx = isItemIndented ? 0.25 * gridWidth * (w / 4) : 0;
                
                return (
                  <div key={item.id} data-grid-id={item.id}>
                    <div 
                      style={{ 
                        width: `calc(100% - ${shrinkPx}px)`, 
                        height: '100%', 
                        background: isPlaceholder ? '#fef3c7' : item.contentType === 'spacer' ? 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px)' : '#fff',
                        border: '2px dashed #e5e7eb',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: `translateX(${shiftPx}px)`,
                        boxShadow: isItemIndented ? '-20px 0 0 0 rgba(0,0,0,0.02)' : 'none'
                      }}"""

code = re.sub(r"              \{renderItems\.map\(\(item\) => \{\n                const isPlaceholder = item\.contentType === 'placeholder';\n                const isItemIndented = uiRows\.find\(r => r\.items\.includes\(item\.id\)\)\?\.isIndented \|\| false;\n                \n                return \(\n                  <div key=\{item\.id\} data-grid-id=\{item\.id\}>\n                    <div \n                      style=\{\{ \n                        width: '100%', \n                        height: '100%', \n                        background: isPlaceholder \? '#fef3c7' : item\.contentType === 'spacer' \? 'repeating-linear-gradient\(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px\)' : '#fff',\n                        border: '2px dashed #e5e7eb',\n                        borderRadius: '12px',\n                        overflow: 'hidden',\n                        position: 'relative',\n                        cursor: 'pointer',\n                        transition: 'all 0\.3s cubic-bezier\(0\.4, 0, 0\.2, 1\)',\n                        transform: isItemIndented \? 'translateX\(40px\) scale\(0\.95\)' : 'none',\n                        boxShadow: isItemIndented \? '-20px 0 0 0 rgba\(0,0,0,0\.03\)' : 'none'\n                      \}\}", render_replacement, code)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
