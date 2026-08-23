import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

replacement = """                      <div className={styles.overlayInfo}>
                        <h4>IMAGE BLOCK ({item.layoutSize})</h4>
                        {item.contentData?.linkUrl && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', display: 'block' }}>Links to: {item.contentData.linkUrl}</span>}
                      </div>"""

code = re.sub(r"                      <div className=\{styles\.overlayInfo\}>\n                        <h4>\{item\.contentType\.toUpperCase\(\)\} \(\{item\.layoutSize\}\)</h4>\n                      </div>", replacement, code)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
