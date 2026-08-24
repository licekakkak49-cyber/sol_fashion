import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# 1. Imports
if 'import HomepagePreviewModal' not in code:
    code = code.replace("import HomepageEditorDrawer from './components/HomepageEditorDrawer';", "import HomepageEditorDrawer from './components/HomepageEditorDrawer';\nimport HomepagePreviewModal from './components/HomepagePreviewModal';")

if ' Eye,' not in code and ' Eye ' not in code:
    code = code.replace('Trash2', 'Trash2, Eye')

# 2. Add state
if 'const [isPreviewOpen' not in code:
    code = code.replace("const [gridWidth, setGridWidth] = useState(1000);", "const [gridWidth, setGridWidth] = useState(1000);\n  const [isPreviewOpen, setIsPreviewOpen] = useState(false);")

# 3. Add button in header
header_replace = """          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Homepage Layout</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Design your asymmetric grid layout. Drag to reorder.</p>
          </div>
          <div>
            <button onClick={() => setIsPreviewOpen(true)} style={{ background: '#fff', border: '1px solid #ddd', padding: '10px 16px', borderRadius: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <Eye size={18} /> Preview
            </button>
          </div>"""
code = code.replace("""          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Homepage Layout</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Design your asymmetric grid layout. Drag to reorder.</p>
          </div>""", header_replace)

# 4. Map the items to snake_case for the preview modal
preview_modal = """      <HomepageEditorDrawer 
        isOpen={editorConfig.isOpen}
        onClose={() => setEditorConfig({ isOpen: false, item: null })}
        onSave={handleSaveBlock}
        initialData={editorConfig.item}
      />

      {isPreviewOpen && (
        <HomepagePreviewModal 
          items={sortedItems.map(item => ({
            id: item.id,
            layout_size: item.layoutSize || item.layout_size,
            content_type: item.contentType || item.content_type,
            content_data: item.contentData || item.content_data,
            grid_index: item.gridIndex || item.grid_index
          }))} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}"""

code = code.replace("""      <HomepageEditorDrawer 
        isOpen={editorConfig.isOpen}
        onClose={() => setEditorConfig({ isOpen: false, item: null })}
        onSave={handleSaveBlock}
        initialData={editorConfig.item}
      />""", preview_modal)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
