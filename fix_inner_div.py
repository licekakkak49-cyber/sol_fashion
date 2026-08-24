import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

replacement = """              {renderItems.map((item) => {
                const isPlaceholder = item.contentType === 'placeholder';
                const isItemIndented = uiRows.find(r => r.items.includes(item.id))?.isIndented || false;
                
                return (
                  <div key={item.id} data-grid-id={item.id}>
                    <div 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: isPlaceholder ? '#fef3c7' : item.contentType === 'spacer' ? 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px)' : '#fff',
                        border: '2px dashed #e5e7eb',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isItemIndented ? 'translateX(40px) scale(0.95)' : 'none',
                        boxShadow: isItemIndented ? '-20px 0 0 0 rgba(0,0,0,0.03)' : 'none'
                      }}"""

code = re.sub(r"              \{renderItems\.map\(\(item\) => \{\n                const isPlaceholder = item\.contentType === 'placeholder';\n                \n                return \(\n                  <div key=\{item\.id\} data-grid-id=\{item\.id\}>\n                    <div \n                      style=\{\{ \n                        width: '100%', \n                        height: '100%', \n                        background: isPlaceholder \? '#fef3c7' : item\.contentType === 'spacer' \? 'repeating-linear-gradient\(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px\)' : '#fff',\n                        border: '2px dashed #e5e7eb',\n                        borderRadius: '12px',\n                        overflow: 'hidden',\n                        position: 'relative',\n                        cursor: 'pointer'\n                      \}\}", replacement, code)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
