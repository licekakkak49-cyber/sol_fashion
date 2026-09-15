import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Layout, 
  Settings, 
  AlignLeft, 
  AlignRight, 
  Check, 
  X, 
  Copy, 
  Globe, 
  Eye, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import styles from './AdminLayout.module.css';
import HomepageEditorDrawer from './components/HomepageEditorDrawer';
import HomepagePreviewModal from './components/HomepagePreviewModal';
import TextBlock from '../../components/HomepageBlocks/TextBlock';
import HeroBlock from '../../components/HomepageBlocks/HeroBlock';
import ImageBlock from '../../components/HomepageBlocks/ImageBlock';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function ManageHomepagePage() {
  const { 
    homepageGridItems, 
    homepageCollections,
    homepageCollectionsLoaded,
    createHomepageDraft,
    publishHomepageCollection,
    updateHomepageCollection,
    deleteHomepageDraft,
    products 
  } = useAdmin();
  
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [rowHeight, setRowHeight] = useState(250);
  const [gridWidth, setGridWidth] = useState(1000);
  const [editorConfig, setEditorConfig] = useState({ isOpen: false, item: null });
  const [isReseeding, setIsReseeding] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Mobile responsive detection
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile Bottom Sheets
  const [isMobileAddBlockOpen, setIsMobileAddBlockOpen] = useState(false);
  const [isMobileCollectionSheetOpen, setIsMobileCollectionSheetOpen] = useState(false);
  const [isMobileRowSheetOpen, setIsMobileRowSheetOpen] = useState(false);

  const indentOffsetPx = isMobile ? Math.round(gridWidth * 0.08) : (Math.round(gridWidth * 0.10) || 95);

  // Draft modal & rename state
  const [isNewDraftModalOpen, setIsNewDraftModalOpen] = useState(false);
  const [newDraftName, setNewDraftName] = useState('');
  const [cloneFromCurrent, setCloneFromCurrent] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Toast Notification State (identical to ManageProductsPage)
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Resolve collections
  const collections = homepageCollections && homepageCollections.length > 0
    ? homepageCollections
    : [{
        id: 'home-col-main',
        name: 'Main Campaign (Live)',
        status: 'published',
        items: homepageGridItems || [],
        updated_at: new Date().toISOString()
      }];

  const currentCollection = collections.find(c => c.id === selectedCollectionId)
    || collections.find(c => c.status === 'published')
    || collections[0];

  useEffect(() => {
    if (!selectedCollectionId && currentCollection?.id) {
      setSelectedCollectionId(currentCollection.id);
    }
  }, [currentCollection?.id, selectedCollectionId]);

  const currentItems = currentCollection.items || [];
  const sortedItems = [...currentItems].sort((a, b) => (a.gridIndex ?? 0) - (b.gridIndex ?? 0));

  const handleAddBlock = async (size, type = 'placeholder') => {
    const newItem = {
      id: crypto.randomUUID(),
      layoutSize: size,
      contentType: type,
      contentData: {},
      gridIndex: sortedItems.length
    };
    const updatedItems = [...sortedItems, newItem];
    await updateHomepageCollection(currentCollection.id, { items: updatedItems });
    const sizeLabel = size === '4x2' ? '4x2 Hero/Banner' : (size === '4x1' && type === 'spacer' ? '4x1 Space' : (size === '4x1' ? '4x1 Text' : (size === '2x2' ? '2x2 Large' : '1x1 Small')));
    showToast(`Block added (${sizeLabel})`, 'success');
  };

  const handleDeleteBlock = async (itemId) => {
    const updatedItems = sortedItems.filter(i => i.id !== itemId).map((item, idx) => ({
      ...item,
      gridIndex: idx
    }));
    await updateHomepageCollection(currentCollection.id, { items: updatedItems });
    showToast('Block removed', 'info');
  };

  const handleBlockClick = (item) => {
    setEditorConfig({
      isOpen: true,
      item: {
        id: item.id,
        layoutSize: item.layoutSize || item.layout_size || '1x1',
        contentType: item.contentType || item.content_type || 'placeholder',
        contentData: item.contentData || item.content_data || {}
      }
    });
  };

  const handleSaveBlock = async (updatedData) => {
    if (editorConfig.item) {
      const updatedItems = sortedItems.map(item => {
        if (item.id === editorConfig.item.id) {
          return {
            ...item,
            contentType: updatedData.contentType,
            contentData: updatedData.contentData
          };
        }
        return item;
      });
      await updateHomepageCollection(currentCollection.id, { items: updatedItems });
      showToast('Block settings saved', 'success');
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

  // Generate desktop layout (4 columns)
  const layout = [];
  sortedItems.forEach((item) => {
    let w = 1;
    let h = 4;
    
    const lSize = item.layoutSize || item.layout_size;
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

  // Generate mobile layout (2 columns - WYSIWYG Storefront Parity)
  const mobileLayout = [];
  sortedItems.forEach((item) => {
    let w = 1;
    let h = 4;
    
    const lSize = item.layoutSize || item.layout_size;
    if (lSize === '2x2') { w = 2; h = 8; }
    if (lSize === '4x2') { w = 2; h = 6; }
    if (lSize === '4x1') { w = 2; h = 2; }
    
    let placed = false;
    let checkY = 0;
    while (!placed) {
      for (let checkX = 0; checkX <= 2 - w; checkX++) {
        if (!isOccupied(mobileLayout, checkX, checkY, w, h)) {
          mobileLayout.push({ i: item.id, x: checkX, y: checkY, w, h });
          placed = true;
          break;
        }
      }
      if (!placed) checkY++;
    }
  });

  const handleLayoutChange = (newLayout) => {
    if (isReseeding || !sortedItems || sortedItems.length === 0) return;
    
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

    let hasChanges = false;
    const reorderedItems = newLayout.map((lItem, index) => {
      const origItem = sortedItems.find(i => i.id === lItem.i);
      if (!origItem) return null;
      const layoutInfo = layoutMap[lItem.i];
      
      let newContentData = { ...(origItem.contentData || origItem.content_data || {}) };
      if (layoutInfo) {
         newContentData.logicalRowId = layoutInfo.rowId;
      }

      if (origItem.gridIndex !== index || JSON.stringify(origItem.contentData || origItem.content_data) !== JSON.stringify(newContentData)) {
        hasChanges = true;
      }

      return { 
        id: origItem.id,
        layoutSize: origItem.layoutSize || origItem.layout_size,
        contentType: origItem.contentType || origItem.content_type,
        contentData: newContentData,
        gridIndex: index
      };
    }).filter(Boolean);

    if (hasChanges && reorderedItems.length > 0) {
      updateHomepageCollection(currentCollection.id, { items: reorderedItems });
      showToast('Layout updated', 'success');
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
     row.isIndented = firstItem?.contentData?.isIndented || firstItem?.content_data?.isIndented || false;
  });

  const handleMoveRowUp = (rowIndex) => {
     if (rowIndex === 0) return;
     const rows = logicalRowsUI.map(r => r.items.map(id => sortedItems.find(item => item.id === id)));
     const temp = rows[rowIndex];
     rows[rowIndex] = rows[rowIndex - 1];
     rows[rowIndex - 1] = temp;
     const flattened = rows.flat().map((item, idx) => ({ ...item, gridIndex: idx }));
     updateHomepageCollection(currentCollection.id, { items: flattened });
     showToast('Row moved up', 'success');
  };

  const handleMoveRowDown = (rowIndex) => {
     if (rowIndex === logicalRowsUI.length - 1) return;
     const rows = logicalRowsUI.map(r => r.items.map(id => sortedItems.find(item => item.id === id)));
     const temp = rows[rowIndex];
     rows[rowIndex] = rows[rowIndex + 1];
     rows[rowIndex + 1] = temp;
     const flattened = rows.flat().map((item, idx) => ({ ...item, gridIndex: idx }));
     updateHomepageCollection(currentCollection.id, { items: flattened });
     showToast('Row moved down', 'success');
  };

  const handleToggleIndent = (row) => {
     const newIndentState = !row.isIndented;
     const newItems = sortedItems.map(item => {
        if (row.items.includes(item.id)) {
           return {
              id: item.id,
              layoutSize: item.layoutSize || item.layout_size,
              contentType: item.contentType || item.content_type,
              contentData: { ...(item.contentData || item.content_data || {}), isIndented: newIndentState },
              gridIndex: item.gridIndex
           };
        }
        return {
           id: item.id,
           layoutSize: item.layoutSize || item.layout_size,
           contentType: item.contentType || item.content_type,
           contentData: item.contentData || item.content_data || {},
           gridIndex: item.gridIndex
        };
     });
     updateHomepageCollection(currentCollection.id, { items: newItems });
     showToast(newIndentState ? 'Row indented by 10% (Live sync)' : 'Row reset to full width', 'success');
  };

  // Collection Lifecycle handlers
  const handleStartRename = () => {
    setEditTitleValue(currentCollection.name);
    setIsEditingTitle(true);
  };

  const handleSaveRename = async () => {
    if (editTitleValue.trim() && editTitleValue.trim() !== currentCollection.name) {
      await updateHomepageCollection(currentCollection.id, { name: editTitleValue.trim() });
      showToast(`Collection renamed to "${editTitleValue.trim()}"`, 'success');
    }
    setIsEditingTitle(false);
  };

  const handleCreateDraft = async (e) => {
    e?.preventDefault();
    const name = newDraftName.trim() || `Draft ${collections.length + 1}`;
    const cloneId = cloneFromCurrent ? currentCollection.id : null;
    const newCol = await createHomepageDraft(name, cloneId);
    setIsNewDraftModalOpen(false);
    setNewDraftName('');
    if (newCol?.id) {
      setSelectedCollectionId(newCol.id);
      showToast(`Draft "${name}" created`, 'success');
    }
  };

  const handleDuplicateCurrent = async () => {
    const copyName = `${currentCollection.name} (Copy)`;
    const newCol = await createHomepageDraft(copyName, currentCollection.id);
    if (newCol?.id) {
      setSelectedCollectionId(newCol.id);
      showToast(`Duplicated as "${copyName}"`, 'success');
    }
  };

  const handlePublishCurrent = async () => {
    if (currentCollection.status === 'published') return;
    const confirmMsg = `Publish "${currentCollection.name}" to live storefront?\nThe current live collection will automatically become a draft.`;
    if (window.confirm(confirmMsg)) {
      setIsPublishing(true);
      const success = await publishHomepageCollection(currentCollection.id);
      setIsPublishing(false);
      if (success) {
        showToast(`Collection "${currentCollection.name}" is now LIVE!`, 'success');
      } else {
        showToast('Failed to publish collection', 'error');
      }
    }
  };

  const handleDeleteCurrent = async () => {
    if (currentCollection.status === 'published') return;
    if (window.confirm(`Delete draft "${currentCollection.name}"? This action cannot be undone.`)) {
      const deletedName = currentCollection.name;
      const publishedCol = collections.find(c => c.status === 'published') || collections[0];
      const success = await deleteHomepageDraft(currentCollection.id);
      if (success) {
        if (publishedCol) {
          setSelectedCollectionId(publishedCol.id);
        }
        showToast(`Draft "${deletedName}" deleted`, 'info');
      } else {
        showToast('Cannot delete published collection', 'error');
      }
    }
  };

  const renderItems = sortedItems.map(item => {
    return {
      id: item.id,
      layoutSize: item.layoutSize || item.layout_size,
      contentType: item.contentType || item.content_type,
      contentData: item.contentData || item.content_data || {}
    };
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%' }}>
      
      {/* Top Controls: Mobile Master Bar vs Desktop Bars */}
      {isMobile ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '4px 0 12px 0',
          borderBottom: '1px solid #f3f4f6',
          width: '100%'
        }}>
          {/* Active Collection Pill Button */}
          <button
            onClick={() => setIsMobileCollectionSheetOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '100px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: currentCollection.status === 'published' ? '#10b981' : '#f59e0b',
              flexShrink: 0
            }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentCollection.name}
            </span>
            <span style={{ fontSize: '10px', color: '#9ca3af' }}>▾</span>
          </button>

          {/* Actions: Add Block, Rows, Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsMobileAddBlockOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 12px',
                borderRadius: '100px',
                background: '#111',
                color: '#fff',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}
            >
              <Plus size={13} /> Block ▾
            </button>

            <button
              onClick={() => setIsMobileRowSheetOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 10px',
                borderRadius: '100px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#374151',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
              title="Manage Rows & Indent"
            >
              <Layout size={13} />
              <span>Rows</span>
            </button>

            <button
              onClick={() => setIsPreviewOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '100px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#111',
                cursor: 'pointer'
              }}
              title="Live Storefront Preview"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 1. Collection Switcher Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            overflowX: 'auto', 
            paddingBottom: '8px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            {collections.map((col) => {
              const isSelected = col.id === currentCollection.id;
              const isLive = col.status === 'published';
              return (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollectionId(col.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: isSelected ? '1px solid #111' : '1px solid #e5e7eb',
                    background: isSelected ? '#111' : '#fff',
                    color: isSelected ? '#fff' : '#374151',
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.12)' : 'none'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isLive ? '#10b981' : '#f59e0b',
                      display: 'inline-block'
                    }}
                  />
                  <span>{col.name}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '100px',
                      background: isSelected ? (isLive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)') : (isLive ? '#d1fae5' : '#fef3c7'),
                      color: isSelected ? (isLive ? '#34d399' : '#fbbf24') : (isLive ? '#065f46' : '#92400e'),
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {isLive ? 'Live' : 'Draft'}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => {
                setNewDraftName(`Draft ${collections.length + 1}`);
                setCloneFromCurrent(true);
                setIsNewDraftModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '100px',
                border: '1px dashed #9ca3af',
                background: 'transparent',
                color: '#4b5563',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={14} /> New Draft
            </button>
          </div>

          {/* 2. Current Collection Header & Actions Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              {isEditingTitle ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={editTitleValue}
                    onChange={(e) => setEditTitleValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename();
                      if (e.key === 'Escape') setIsEditingTitle(false);
                    }}
                    autoFocus
                    style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      border: '1px solid #3b82f6',
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  <button onClick={handleSaveRename} style={iconBtnStyle} title="Save">
                    <Check size={16} color="#10b981" />
                  </button>
                  <button onClick={() => setIsEditingTitle(false)} style={iconBtnStyle} title="Cancel">
                    <X size={16} color="#6b7280" />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
                    {currentCollection.name}
                  </h2>
                  <button 
                    onClick={handleStartRename} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', display: 'flex', alignItems: 'center' }} 
                    title="Rename Collection"
                  >
                    <Edit2 size={15} />
                  </button>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '3px 10px',
                      borderRadius: '100px',
                      background: currentCollection.status === 'published' ? '#d1fae5' : '#fef3c7',
                      color: currentCollection.status === 'published' ? '#065f46' : '#92400e',
                      fontWeight: 600
                    }}
                  >
                    {currentCollection.status === 'published' ? '● Published (Live)' : '● Draft Mode'}
                  </span>
                </div>
              )}
              <p style={{ color: '#6b7280', margin: '6px 0 0 0', fontSize: '13px' }}>
                {currentCollection.status === 'published' 
                  ? 'This collection is currently visible on the live storefront.' 
                  : 'This is a draft version. Edit freely without affecting the live website.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {currentCollection.status === 'draft' && (
                <button
                  onClick={handlePublishCurrent}
                  disabled={isPublishing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  <Globe size={15} /> {isPublishing ? 'Publishing...' : 'Publish to Live'}
                </button>
              )}

              <button
                onClick={handleDuplicateCurrent}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 15px',
                  background: '#fff',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                title="Duplicate layout into a new draft"
              >
                <Copy size={15} /> Duplicate
              </button>

              <button 
                onClick={() => setIsPreviewOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  background: '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Eye size={15} /> Preview
              </button>

              {currentCollection.status === 'draft' && collections.length > 1 && (
                <button
                  onClick={handleDeleteCurrent}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 12px',
                    background: '#fff',
                    color: '#ef4444',
                    border: '1px solid #fee2e2',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  title="Delete this draft"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* 3. Block Add Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => handleAddBlock('1x1')} style={addBtnStyle}><Plus size={15}/> 1x1 (Small)</button>
            <button onClick={() => handleAddBlock('2x2')} style={addBtnStyle}><Plus size={15}/> 2x2 (Large)</button>
            <button onClick={() => handleAddBlock('4x2')} style={addBtnStyle}><Plus size={15}/> 4x2 (Hero/Banner)</button>
            <button onClick={() => handleAddBlock('4x1')} style={addBtnStyle}><Plus size={15}/> 4x1 (Text Module)</button>
            <button onClick={() => handleAddBlock('4x1', 'spacer')} style={addBtnStyle}><Plus size={15}/> 4x1 (Vertical Space)</button>
          </div>
        </>
      )}

      {/* 4. Canvas & Grid Layout */}
      <div style={{ background: '#f9fafb', padding: isMobile ? '10px 4px' : '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <div style={{ margin: isMobile ? '0' : '-12px', position: 'relative', paddingLeft: isMobile ? '0px' : '160px', paddingRight: isMobile ? '0px' : '160px' }}>
          
          {/* Row Controls & Visual Indent Guide - Desktop Only */}
          {!isMobile && logicalRowsUI.map((row, i) => (
             <React.Fragment key={row.id}>
               <div 
                 style={{
                   position: 'absolute',
                   left: '10px',
                   top: `${row.minY * rowHeight + row.minY * 12}px`,
                   width: '180px',
                   zIndex: 10,
                   display: 'flex',
                   alignItems: 'flex-start',
                   justifyContent: 'flex-end',
                   paddingTop: '20px',
                   gap: '8px'
                 }}
               >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button 
                      onClick={() => handleMoveRowUp(i)}
                      disabled={i === 0}
                      style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.3 : 1 }}
                      title="Move Row Up"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => handleMoveRowDown(i)}
                      disabled={i === logicalRowsUI.length - 1}
                      style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px', cursor: i === logicalRowsUI.length - 1 ? 'not-allowed' : 'pointer', opacity: i === logicalRowsUI.length - 1 ? 0.3 : 1 }}
                      title="Move Row Down"
                    >
                      ↓
                    </button>
                  </div>
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

               {/* Visual Indent Guide on the left side of the row */}
               {row.isIndented && (
                 <div 
                   style={{
                     position: 'absolute',
                     left: '160px',
                     top: `${row.minY * rowHeight + row.minY * 12}px`,
                     height: `${(row.maxY - row.minY) * rowHeight + (row.maxY - row.minY - 1) * 12}px`,
                     width: `${indentOffsetPx}px`,
                     borderLeft: '2px dashed #93c5fd',
                     borderTop: '1px dashed #bfdbfe',
                     borderBottom: '1px dashed #bfdbfe',
                     borderRadius: '6px 0 0 6px',
                     background: 'linear-gradient(90deg, rgba(239, 246, 255, 0.85) 0%, rgba(239, 246, 255, 0.2) 100%)',
                     pointerEvents: 'none',
                     zIndex: 2,
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     transition: 'all 0.3s ease'
                   }}
                 >
                   <span style={{ fontSize: '9px', color: '#2563eb', fontWeight: 600, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                     ↳ 10%
                   </span>
                 </div>
               )}
             </React.Fragment>
          ))}

          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout, md: layout, sm: mobileLayout, xs: mobileLayout, xxs: mobileLayout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 2 }}
            rowHeight={rowHeight}
            margin={[isMobile ? 8 : 12, isMobile ? 8 : 12]}
            containerPadding={[0, 0]}
            onLayoutChange={handleLayoutChange}
            onWidthChange={(containerWidth, margin, cols) => {
              setGridWidth(containerWidth);
              const colW = (containerWidth - (margin[0] * (cols - 1))) / cols;
              const targetHeight = (colW * (4/3));
              const newRowHeight = (targetHeight - (3 * margin[1])) / 4;
              setRowHeight(newRowHeight);
            }}
            isResizable={false}
          >
            {renderItems.map((item) => {
              const isPlaceholder = item.contentType === 'placeholder' || (item.contentType === 'image' && !item.contentData?.imageUrl && !item.contentData?.videoUrl) || (item.contentType === 'product' && !item.contentData?.productId);
              const itemRow = logicalRowsUI.find(r => r.items.includes(item.id));
              const isRowIndented = itemRow?.isIndented || false;
              
              return (
                <div key={item.id} data-grid-id={item.id}>
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      transform: isRowIndented ? `translateX(${indentOffsetPx}px)` : 'translateX(0)',
                      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative'
                    }}
                  >
                    {isPlaceholder ? (
                      <div 
                        className={styles.ghostSlot} 
                        onClick={() => handleBlockClick(item)}
                        style={{ position: 'relative' }}
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteBlock(item.id); }}
                          style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', padding: '6px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
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
                      <div 
                        className={styles.productCard} 
                        style={item.contentType === 'text' ? { border: '1px solid #e5e7eb' } : {}}
                        onClick={isMobile ? () => handleBlockClick(item) : undefined}
                      >
                        {item.contentType === 'spacer' ? (
                           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px)' }}>
                             <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Empty Vertical Space</span>
                           </div>
                        ) : item.contentType === 'text' ? (
                          <div style={{ pointerEvents: 'none', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                             <TextBlock data={item.contentData} isPreview={true} />
                          </div>
                        ) : item.contentType === 'image' && (item.contentData?.imageUrl || item.contentData?.videoUrl) ? (
                          <div style={{ pointerEvents: 'none', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                            {item.layoutSize === '4x2' ? (
                              <HeroBlock data={item.contentData} isPreview={true} />
                            ) : (
                              <ImageBlock data={item.contentData} isPreview={true} />
                            )}
                          </div>
                        ) : item.contentType === 'product' && item.contentData?.productId ? (
                          <img src={products?.find(p => p.id === item.contentData.productId)?.image || 'https://via.placeholder.com/150'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Product Block" draggable={false} />
                        ) : (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', border: '1px dashed #d1d5db' }}>
                             <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>{item.contentType}</span>
                          </div>
                        )}
                        
                        <div 
                          className={styles.productOverlay}
                          style={isMobile ? {
                            opacity: 1,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.08) 40%, transparent 70%)',
                            pointerEvents: 'none'
                          } : undefined}
                        >
                          <div 
                            className={styles.overlayActions}
                            style={isMobile ? { pointerEvents: 'auto', bottom: '8px', right: '8px' } : undefined}
                          >
                            {item.contentType !== 'spacer' && (
                              <button 
                                className={styles.overlayActionBtn}
                                onClick={(e) => { e.stopPropagation(); handleBlockClick(item); }}
                                title="Edit Block"
                                style={isMobile ? { width: '32px', height: '32px', background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' } : undefined}
                              >
                                <Edit2 size={15} className={styles.overlayEditBtn} />
                              </button>
                            )}
                            <button 
                              className={styles.overlayActionBtn}
                              onClick={(e) => { e.stopPropagation(); handleDeleteBlock(item.id); }}
                              title="Delete Block"
                              style={isMobile ? { width: '32px', height: '32px', background: 'rgba(255,255,255,0.95)', color: '#ef4444', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' } : undefined}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </ResponsiveGridLayout>
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

      {/* Mobile Bottom Sheet 1: Add Block */}
      {isMobile && isMobileAddBlockOpen && (
        <div className={styles.bottomSheetContainer} onClick={() => setIsMobileAddBlockOpen(false)}>
          <div className={styles.bottomSheetContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.bottomSheetHandle} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Add Homepage Block</h3>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  Select a layout size to add to the canvas
                </div>
              </div>
              <button 
                onClick={() => setIsMobileAddBlockOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '60vh', overflowY: 'auto' }}>
              {/* 1x1 Small Card */}
              <button
                onClick={() => { handleAddBlock('1x1'); setIsMobileAddBlockOpen(false); }}
                style={mobileBlockCardStyle}
              >
                <div style={mobileBlockIconBoxStyle}>
                  <Layout size={20} color="#2563eb" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>1x1 (Small Block)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>1-column fashion card · 3:4 portrait (Image or Product)</div>
                </div>
              </button>

              {/* 2x2 Large Block */}
              <button
                onClick={() => { handleAddBlock('2x2'); setIsMobileAddBlockOpen(false); }}
                style={mobileBlockCardStyle}
              >
                <div style={mobileBlockIconBoxStyle}>
                  <Layout size={20} color="#7c3aed" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>2x2 (Large Feature)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Full width feature · 3:4 portrait (Image or Looping Video)</div>
                </div>
              </button>

              {/* 4x2 Hero Banner */}
              <button
                onClick={() => { handleAddBlock('4x2'); setIsMobileAddBlockOpen(false); }}
                style={mobileBlockCardStyle}
              >
                <div style={mobileBlockIconBoxStyle}>
                  <Globe size={20} color="#059669" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>4x2 (Hero / Banner)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Full width hero banner with headline, CTA & video/image</div>
                </div>
              </button>

              {/* 4x1 Text Module */}
              <button
                onClick={() => { handleAddBlock('4x1'); setIsMobileAddBlockOpen(false); }}
                style={mobileBlockCardStyle}
              >
                <div style={mobileBlockIconBoxStyle}>
                  <AlignLeft size={20} color="#d97706" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>4x1 (Text Module)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Editorial typography, headline, subtitle & link buttons</div>
                </div>
              </button>

              {/* 4x1 Spacer */}
              <button
                onClick={() => { handleAddBlock('4x1', 'spacer'); setIsMobileAddBlockOpen(false); }}
                style={mobileBlockCardStyle}
              >
                <div style={mobileBlockIconBoxStyle}>
                  <Plus size={20} color="#6b7280" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>4x1 (Vertical Space)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Empty vertical spacing between sections</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet 2: Campaigns & Actions */}
      {isMobile && isMobileCollectionSheetOpen && (
        <div className={styles.bottomSheetContainer} onClick={() => setIsMobileCollectionSheetOpen(false)}>
          <div className={styles.bottomSheetContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.bottomSheetHandle} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Homepage Campaigns</h3>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  Switch campaigns or manage drafts
                </div>
              </div>
              <button 
                onClick={() => setIsMobileCollectionSheetOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Collection List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', maxHeight: '35vh', overflowY: 'auto' }}>
              {collections.map(col => {
                const isSelected = col.id === currentCollection.id;
                const isLive = col.status === 'published';
                return (
                  <div
                    key={col.id}
                    onClick={() => { setSelectedCollectionId(col.id); setIsMobileCollectionSheetOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid #111' : '1px solid #e5e7eb',
                      background: isSelected ? '#f9fafb' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isLive ? '#10b981' : '#f59e0b'
                      }} />
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: isSelected ? 600 : 500, color: '#111' }}>
                          {col.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                          {isLive ? 'Currently active on live storefront' : 'Draft version'}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '100px',
                      background: isLive ? '#d1fae5' : '#fef3c7',
                      color: isLive ? '#065f46' : '#92400e',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {isLive ? 'Live' : 'Draft'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current Collection Actions */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentCollection.status === 'draft' && (
                <button
                  onClick={() => { setIsMobileCollectionSheetOpen(false); handlePublishCurrent(); }}
                  disabled={isPublishing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <Globe size={16} /> {isPublishing ? 'Publishing...' : 'Publish to Live Storefront'}
                </button>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => {
                    setIsMobileCollectionSheetOpen(false);
                    setNewDraftName(`Draft ${collections.length + 1}`);
                    setCloneFromCurrent(true);
                    setIsNewDraftModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    background: '#fff',
                    color: '#111',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} /> New Draft
                </button>

                <button
                  onClick={() => { setIsMobileCollectionSheetOpen(false); handleDuplicateCurrent(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    background: '#fff',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={14} /> Duplicate
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: currentCollection.status === 'draft' && collections.length > 1 ? '1fr 1fr' : '1fr', gap: '8px' }}>
                <button
                  onClick={() => { setIsMobileCollectionSheetOpen(false); handleStartRename(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    background: '#f9fafb',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <Edit2 size={14} /> Rename
                </button>

                {currentCollection.status === 'draft' && collections.length > 1 && (
                  <button
                    onClick={() => { setIsMobileCollectionSheetOpen(false); handleDeleteCurrent(); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} /> Delete Draft
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet 3: Manage Grid Rows */}
      {isMobile && isMobileRowSheetOpen && (
        <div className={styles.bottomSheetContainer} onClick={() => setIsMobileRowSheetOpen(false)}>
          <div className={styles.bottomSheetContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.bottomSheetHandle} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Manage Grid Rows</h3>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  Reorder rows or toggle 10% left indentation
                </div>
              </div>
              <button 
                onClick={() => setIsMobileRowSheetOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '55vh', overflowY: 'auto' }}>
              {logicalRowsUI.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                  No rows on canvas yet. Add blocks first.
                </div>
              ) : (
                logicalRowsUI.map((row, idx) => (
                  <div
                    key={row.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#111' }}>
                        Row {idx + 1}
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 400, marginLeft: '6px' }}>
                          ({row.items.length} {row.items.length === 1 ? 'block' : 'blocks'})
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: row.isIndented ? '#2563eb' : '#9ca3af', marginTop: '2px', fontWeight: row.isIndented ? 600 : 400 }}>
                        {row.isIndented ? '↳ Indented by 10%' : 'Full width'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => handleToggleIndent(row)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '100px',
                          border: row.isIndented ? '1px solid #2563eb' : '1px solid #d1d5db',
                          background: row.isIndented ? '#2563eb' : '#fff',
                          color: row.isIndented ? '#fff' : '#374151',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {row.isIndented ? 'Indented ✓' : '+ Indent 10%'}
                      </button>

                      <button
                        onClick={() => handleMoveRowUp(idx)}
                        disabled={idx === 0}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          background: '#fff',
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          opacity: idx === 0 ? 0.3 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px'
                        }}
                        title="Move Row Up"
                      >
                        ↑
                      </button>

                      <button
                        onClick={() => handleMoveRowDown(idx)}
                        disabled={idx === logicalRowsUI.length - 1}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          background: '#fff',
                          cursor: idx === logicalRowsUI.length - 1 ? 'not-allowed' : 'pointer',
                          opacity: idx === logicalRowsUI.length - 1 ? 0.3 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px'
                        }}
                        title="Move Row Down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Draft Modal */}
      {isNewDraftModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 600, margin: 0 }}>Create Homepage Draft</h3>
              <button 
                onClick={() => setIsNewDraftModalOpen(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateDraft}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  Draft Name
                </label>
                <input
                  type="text"
                  value={newDraftName}
                  onChange={(e) => setNewDraftName(e.target.value)}
                  placeholder="e.g. Fall Lookbook, Mid-Season Sale"
                  autoFocus
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cloneFromCurrent}
                    onChange={(e) => setCloneFromCurrent(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#111' }}
                  />
                  <span>Clone current layout from <strong>{currentCollection.name}</strong></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewDraftModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: '#111', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Create Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification - Top Center & High Visibility (Identical to ManageProductsPage) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -25, x: '-50%', scale: 0.92 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '24px',
              left: '50%',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              borderRadius: '9999px',
              background: toast.type === 'error' ? '#ef4444' : (toast.type === 'info' ? '#1f2937' : '#09090b'),
              color: '#ffffff',
              border: toast.type === 'error' ? '1px solid #dc2626' : '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
              fontSize: '13.5px',
              fontWeight: 500,
              letterSpacing: '0.01em',
              pointerEvents: 'auto',
              minWidth: '280px',
              maxWidth: '90vw'
            }}
          >
            {toast.type === 'error' ? (
              <AlertTriangle size={19} color="#fca5a5" style={{ flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={19} color={toast.type === 'info' ? '#93c5fd' : '#4ade80'} style={{ flexShrink: 0 }} />
            )}
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                width: '22px',
                height: '22px',
                marginLeft: '8px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const addBtnStyle = {
  padding: '8px 14px',
  background: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: '100px',
  cursor: 'pointer',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px'
};

const iconBtnStyle = {
  background: '#f3f4f6',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)'
};

const modalContentStyle = {
  background: '#fff',
  padding: '24px',
  borderRadius: '14px',
  width: '100%',
  maxWidth: '420px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

const mobileBlockCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  background: '#fff',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  width: '100%',
  boxSizing: 'border-box'
};

const mobileBlockIconBoxStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  background: '#f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};
