import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

# 1. Fix handleLayoutChange mapping bug
content = content.replace(
    """          contentType: origItem.content_type,""",
    """          contentType: origItem.contentType || origItem.content_type,"""
)
content = content.replace(
    """      let newContentData = { ...(origItem.content_data || {}) };""",
    """      let newContentData = { ...(origItem.contentData || origItem.content_data || {}) };"""
)
content = content.replace(
    """      if (origItem.grid_index !== index || JSON.stringify(origItem.content_data) !== JSON.stringify(newContentData)) {""",
    """      if (origItem.gridIndex !== index || JSON.stringify(origItem.contentData || origItem.content_data) !== JSON.stringify(newContentData)) {"""
)

# 2. Fix handleToggleIndent mapping bug
content = content.replace(
    """              contentType: item.content_type,
              contentData: { ...(item.content_data || {}), isIndented: !row.isIndented }""",
    """              contentType: item.contentType || item.content_type,
              contentData: { ...(item.contentData || item.content_data || {}), isIndented: !row.isIndented }"""
)
content = content.replace(
    """           contentType: item.content_type,
           contentData: item.content_data || {}""",
    """           contentType: item.contentType || item.content_type,
           contentData: item.contentData || item.content_data || {}"""
)

# 3. Add Trash Button to ghostSlot
old_ghost_slot = """                      <div 
                        className={styles.ghostSlot} 
                        onClick={() => handleBlockClick(item)}
                      >
                        <Plus className={styles.ghostSlotIcon} size={32} style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '12px', fontWeight: 500, marginTop: '4px', textAlign: 'center' }}>
                          {item.layoutSize === '4x2' ? '4x2 (Hero/Banner)' : 
                           item.layoutSize === '4x1' && item.contentType === 'text' ? '4x1 (Text)' :
                           item.layoutSize === '4x1' && item.contentType === 'spacer' ? '4x1 (Space)' :
                           item.layoutSize === '2x2' ? '2x2 (Large)' : '1x1 (Small)'}
                        </span>
                      </div>"""

new_ghost_slot = """                      <div 
                        className={styles.ghostSlot} 
                        onClick={() => handleBlockClick(item)}
                        style={{ position: 'relative' }}
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteHomepageGridItem(item.id); }}
                          style={{ position: 'absolute', top: 12, right: 12, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', color: '#ef4444', padding: '6px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                          title="Delete Block"
                        >
                          <Trash2 size={14} />
                        </button>
                        <Plus className={styles.ghostSlotIcon} size={32} style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '12px', fontWeight: 500, marginTop: '4px', textAlign: 'center' }}>
                          {item.layoutSize === '4x2' ? '4x2 (Hero/Banner)' : 
                           item.layoutSize === '4x1' && item.contentType === 'text' ? '4x1 (Text)' :
                           item.layoutSize === '4x1' && item.contentType === 'spacer' ? '4x1 (Space)' :
                           item.layoutSize === '2x2' ? '2x2 (Large)' : '1x1 (Small)'}
                        </span>
                      </div>"""

content = content.replace(old_ghost_slot, new_ghost_slot)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(content)

print("All fixes applied!")
