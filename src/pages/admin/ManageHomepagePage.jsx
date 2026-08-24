import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Trash2, Edit2, Layout, Settings, AlignLeft, AlignRight } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import styles from './AdminLayout.module.css';
import HomepageEditorDrawer from './components/HomepageEditorDrawer';
import HomepagePreviewModal from './components/HomepagePreviewModal';
import TextBlock from '../../components/HomepageBlocks/TextBlock';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function ManageHomepagePage() {
  const { homepageGridItems, addHomepageGridItem, updateHomepageGridItem, deleteHomepageGridItem, updateGridOrder, products } = useAdmin();
  
  const [rowHeight, setRowHeight] = useState(250);
  const [editorConfig, setEditorConfig] = useState({ isOpen: false, item: null });
  const [isReseeding, setIsReseeding] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const sortedItems = [...homepageGridItems].sort((a, b) => a.grid_index - b.grid_index);
  const items = sortedItems;

  const handleAddBlock = (size, type = 'placeholder') => {
    addHomepageGridItem({
      layoutSize: size,
      contentType: type
    });
  };

const handleBlockClick = (item) => {
    setEditorConfig({
      isOpen: true,
      item: {
        id: item.id,
        layoutSize: item.layoutSize || (item.layoutSize || item.layout_size),
        contentType: item.contentType || item.content_type,
        contentData: item.contentData || item.content_data || {}
      }
    });
  };

  const handleSaveBlock = async (updatedData) => {
    if (editorConfig.item) {
      await updateHomepageGridItem(editorConfig.item.id, {
        contentType: updatedData.contentType,
        contentData: updatedData.contentData
      });
    }
  };

  const isOccupied = (layout, x, y, w, h) => {
    for (const item of layout) {
      if (
        x < item.x + item.w &&
        x + w > item.x &&
        y < item.y + item.h &&
        y + h > item.y
      ) {
        return true;
      }
    }
    return false;
  };

  // Generate layout
  const layout = [];
  sortedItems.forEach((item, index) => {
    let w = 1;
    let h = 4;
    
    const lSize = item.layoutSize || (item.layoutSize || item.layout_size);
    if (lSize === '2x2') { w = 2; h = 8; }
    if (lSize === '4x2') { w = 4; h = 8; }
    if (lSize === '4x1') { w = 4; h = 1; }
    
    let placed = false;
    let checkY = 0;
    while (!placed) {
      for (let checkX = 0; checkX <= 4 - w; checkX++) {
        if (!isOccupied(layout, checkX, checkY, w, h)) {
          layout.push({ i: item.id, x: checkX, y: checkY, w, h });
          placed = true;
          break;
        }
      }
      if (!placed) checkY++;
    }
  });

  const handleLayoutChange = (newLayout) => {
    if (isReseeding || !items || items.length === 0) return;
    
    const sortedLayout = [...newLayout].sort((a, b) => a.y - b.y || a.x - b.x);
    const logicalRows = [];
    sortedLayout.forEach(lItem => {
       let placed = false;
       for (const row of logicalRows) {
          if (lItem.y < row.maxY) {
             row.items.push(lItem);
             row.maxY = Math.max(row.maxY, lItem.y + lItem.h);
             placed = true;
             break;
          }
       }
       if (!placed) {
          logicalRows.push({ id: `row-${lItem.y}`, minY: lItem.y, maxY: lItem.y + lItem.h, items: [lItem] });
       }
    });
    
    const layoutMap = {};
    logicalRows.forEach(row => {
       row.items.forEach(lItem => {
          layoutMap[lItem.i] = { rowId: row.id, y: lItem.y };
       });
    });

    const reorderedItems = newLayout.map((lItem, index) => {
      const origItem = sortedItems.find(i => i.id === lItem.i);
      if (!origItem) return null;
      const layoutInfo = layoutMap[lItem.i];
      
      let newContentData = { ...(origItem.contentData || origItem.content_data || {}) };
      if (layoutInfo) {
         newContentData.logicalRowId = layoutInfo.rowId;
      }

      if (origItem.gridIndex !== index || JSON.stringify(origItem.contentData || origItem.content_data) !== JSON.stringify(newContentData)) {
        return { 
          id: origItem.id,
          layoutSize: (origItem.layoutSize || origItem.layout_size),
          contentType: origItem.contentType || origItem.content_type,
          contentData: newContentData 
        };
      }
      return null;
    }).filter(Boolean);

    if (reorderedItems.length > 0) {
      updateGridOrder(reorderedItems);
    }
  };

  // UI Calculation for Row Controls
  const logicalRowsUI = [];
  layout.forEach(lItem => {
     let placed = false;
     for (const row of logicalRowsUI) {
        if (lItem.y < row.maxY) {
           row.items.push(lItem.i);
           row.maxY = Math.max(row.maxY, lItem.y + lItem.h);
           placed = true;
           break;
        }
     }
     if (!placed) {
        logicalRowsUI.push({ id: `row-${lItem.y}`, minY: lItem.y, maxY: lItem.y + lItem.h, items: [lItem.i] });
     }
  });

  logicalRowsUI.forEach(row => {
     const firstItem = sortedItems.find(i => i.id === row.items[0]);
     row.isIndented = firstItem?.content_data?.isIndented || false;
  });

  const handleToggleIndent = (row) => {
     const newItems = sortedItems.map(item => {
        if (row.items.includes(item.id)) {
           return {
              id: item.id,
              layoutSize: (item.layoutSize || item.layout_size),
              contentType: item.contentType || item.content_type,
              contentData: { ...(item.contentData || item.content_data || {}), isIndented: !row.isIndented }
           };
        }
        return {
           id: item.id,
           layoutSize: (item.layoutSize || item.layout_size),
           contentType: item.contentType || item.content_type,
           contentData: item.contentData || item.content_data || {}
        };
     });
     updateGridOrder(newItems);
  };

  const renderItems = sortedItems.map(item => {
    return {
      id: item.id,
      layoutSize: (item.layoutSize || item.layout_size),
      contentType: item.contentType || item.content_type,
      contentData: item.contentData || item.content_data || {}
    };
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '32px', width: '100%' }}>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Homepage Layout</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Design your asymmetric grid layout. Drag to reorder.</p>
          </div>
          <button 
            onClick={() => setIsPreviewOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
          >
            👁️ Preview
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button onClick={() => handleAddBlock('1x1')} style={addBtnStyle}><Plus size={16}/> 1x1 (Small)</button>
          <button onClick={() => handleAddBlock('2x2')} style={addBtnStyle}><Plus size={16}/> 2x2 (Large)</button>
          <button onClick={() => handleAddBlock('4x2')} style={addBtnStyle}><Plus size={16}/> 4x2 (Hero/Banner)</button>
          <button onClick={() => handleAddBlock('4x1')} style={addBtnStyle}><Plus size={16}/> 4x1 (Text Module)</button>
          <button onClick={() => handleAddBlock('4x1', 'spacer')} style={addBtnStyle}><Plus size={16}/> 4x1 (Vertical Space)</button>
        </div>

        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px',  }}>
          <div style={{ margin: '-12px' }}>
            
            {/* Row Controls */}
            {logicalRowsUI.map(row => (
               <div 
                 key={row.id}
                 style={{
                   position: 'absolute',
                   left: '-140px',
                   top: `${row.minY * rowHeight + row.minY * 12}px`,
                   width: '120px',
                   zIndex: 10,
                   display: 'flex',
                   alignItems: 'flex-start',
                   justifyContent: 'flex-end',
                   paddingTop: '20px'
                 }}
               >
                  <button
                     onClick={() => handleToggleIndent(row)}
                     style={{
                        background: row.isIndented ? '#111' : '#fff',
                        color: row.isIndented ? '#fff' : '#111',
                        border: row.isIndented ? '1px solid #111' : '1px solid #ddd',
                        padding: '6px 12px',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                     }}
                  >
                     {row.isIndented ? '→ Indented' : '+ Left Space'}
                  </button>
               </div>
            ))}

            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 }}
              rowHeight={rowHeight}
              margin={[12, 12]}
              onLayoutChange={handleLayoutChange}
              onWidthChange={(containerWidth, margin, cols) => {
                const colW = (containerWidth - (margin[0] * (cols - 1))) / cols;
                const targetHeight = (colW * (4/3));
                const newRowHeight = (targetHeight - (3 * margin[1])) / 4;
                setRowHeight(newRowHeight);
              }}
              isResizable={false}
            >
              {renderItems.map((item) => {
                const isPlaceholder = item.contentType === 'placeholder' || (item.contentType === 'image' && !item.contentData?.imageUrl) || (item.contentType === 'product' && !item.contentData?.productId);
                
                return (
                  <div key={item.id} data-grid-id={item.id}>
                    {isPlaceholder ? (
                      <div 
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
                      </div>
                    ) : (
                      <div className={styles.productCard} style={item.contentType === 'text' ? { border: '1px solid #e5e7eb' } : {}}>
                        {item.contentType === 'spacer' ? (
                           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px)' }}>
                             <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Empty Vertical Space</span>
                           </div>
                        ) : item.contentType === 'text' ? (
                          <div style={{ pointerEvents: 'none', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                             <TextBlock data={item.contentData} isPreview={true} />
                          </div>
                        ) : item.contentType === 'image' && item.contentData?.imageUrl ? (
                          <img src={item.contentData.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Block" draggable={false} />
                        ) : item.contentType === 'product' && item.contentData?.productId ? (
                          <img src={products?.find(p => p.id === item.contentData.productId)?.image || 'https://via.placeholder.com/150'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Product Block" draggable={false} />
                        ) : null}
                        
                        <div className={styles.productOverlay}>
                          <div className={styles.overlayActions}>
                            {item.contentType !== 'spacer' && (
                              <button 
                                className={styles.overlayActionBtn}
                                onClick={(e) => { e.stopPropagation(); handleBlockClick(item); }}
                                title="Edit Block"
                              >
                                <Edit2 size={14} className={styles.overlayEditBtn} />
                              </button>
                            )}
                            <button 
                              className={styles.overlayActionBtn}
                              onClick={(e) => { e.stopPropagation(); deleteHomepageGridItem(item.id); }}
                              title="Delete Block"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </ResponsiveGridLayout>
          </div>
        </div>

      </div>

      <HomepageEditorDrawer 
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
    </div>
  );
}

const addBtnStyle = {
  padding: '10px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px'
};
