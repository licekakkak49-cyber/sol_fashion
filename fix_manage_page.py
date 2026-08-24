import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

# 1. Fix handleSaveBlock
content = content.replace(
    """      await updateHomepageGridItem(editorConfig.item.id, {
        content_type: updatedData.contentType,
        content_data: updatedData.contentData
      });""",
    """      await updateHomepageGridItem(editorConfig.item.id, {
        contentType: updatedData.contentType,
        contentData: updatedData.contentData
      });"""
)

# 2. Add Preview State
if "const [isPreviewOpen, setIsPreviewOpen] = useState(false);" not in content:
    content = content.replace(
        "const [isReseeding, setIsReseeding] = useState(false);",
        "const [isReseeding, setIsReseeding] = useState(false);\n  const [isPreviewOpen, setIsPreviewOpen] = useState(false);"
    )

# 3. Add Preview Button
if "onClick={() => setIsPreviewOpen(true)}" not in content:
    content = content.replace(
        """        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Manage Homepage</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button """,
        """        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Manage Homepage</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setIsPreviewOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
            >
              👁️ Preview
            </button>
            <button """
    )

# 4. Add HomepagePreviewModal import
if "HomepagePreviewModal" not in content:
    content = content.replace(
        "import HomepageEditorDrawer from './components/HomepageEditorDrawer';",
        "import HomepageEditorDrawer from './components/HomepageEditorDrawer';\nimport HomepagePreviewModal from './components/HomepagePreviewModal';"
    )

# 5. Add HomepagePreviewModal JSX
if "<HomepagePreviewModal" not in content:
    content = content.replace(
        """      <HomepageEditorDrawer 
        isOpen={editorConfig.isOpen}
        onClose={() => setEditorConfig({ isOpen: false, item: null })}
        onSave={handleSaveBlock}
        initialData={editorConfig.item}
      />
    </div>""",
        """      <HomepageEditorDrawer 
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
            content_data: item.contentData || item.content_data || {},
            grid_index: item.gridIndex || item.grid_index
          }))}
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}
    </div>"""
    )

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(content)

print("Restored fixes!")
