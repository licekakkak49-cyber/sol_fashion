import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Plus, X, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Trash2, Edit2, RefreshCw, Image as ImageIcon, Video, LayoutGrid, Layout, Eye, SlidersHorizontal, Check } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import styles from '../AdminLayout.module.css';
import PreviewModal from './PreviewModal';
import CoverImagePickerModal from './CoverImagePickerModal';
import { isVideoMedia } from '../../../utils/supabaseStorage';


const ResponsiveGridLayout = WidthProvider(Responsive);

const CATEGORIES = ['Bags', 'Dresses', 'Tops', 'Bottoms', 'Accessories'];

const SetAccordion = ({ 
  set, 
  index, 
  totalSets, 
  onMoveUp, 
  onMoveDown, 
  isActiveSet,
  onMarkActive,
  onSelectCategory,
  products, 
  updateSet, 
  deleteSet, 
  removeProductFromSet, 
  updateProductInSet, 
  changeProductOrderInSet, 
  handleEdit, 
  showToast, 
  onOpenPicker,
  isMobile = false
}) => {
  const [isOpen, setIsOpen] = useState(true); // Open by default
  const [rowHeight, setRowHeight] = useState(250);
  const [isPatternSheetOpen, setIsPatternSheetOpen] = useState(false);
  
  const [activePlaceholder, setActivePlaceholder] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Instant visual saved feedback on this set card
  const [justSaved, setJustSaved] = useState(false);
  const saveTimerRef = useRef(null);

  const notifySaved = () => {
    setJustSaved(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setJustSaved(false);
    }, 2500);
  };

  const handleUpdateSet = (id, data) => {
    onMarkActive?.();
    notifySaved();
    updateSet(id, data);
  };

  // Inline rename state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(set.name);

  // Custom slot cover modal state
  const [coverModalConfig, setCoverModalConfig] = useState({
    isOpen: false,
    product: null,
    slotIndex: null,
    currentCover: null
  });

  const handleOpenCoverModal = (prod, slotIndex) => {
    setCoverModalConfig({
      isOpen: true,
      product: prod,
      slotIndex,
      currentCover: prod.customCover || null
    });
  };

  const handleSaveCoverImage = (newCover) => {
    const { slotIndex } = coverModalConfig;
    if (slotIndex === null || slotIndex === undefined) return;

    const newItems = [...set.items];
    if (newItems[slotIndex]) {
      newItems[slotIndex] = {
        ...newItems[slotIndex],
        customCover: newCover || null
      };
      handleUpdateSet(set.id, { items: newItems });
      if (newCover) {
        showToast?.('Cover updated', 'success');
      } else {
        showToast?.('Cover reset to default', 'info');
      }
    }
  };

  // Map items to either real products or placeholders with unique slot IDs
  const setProducts = set.items.map((item, itemIdx) => {
    const uniqueSlotId = item.slotId || `${item.productId}-${itemIdx}`;
    if (item.productId && item.productId.startsWith('draft-')) {
      return { 
        id: uniqueSlotId, 
        rawProductId: item.productId, 
        slotIndex: itemIdx, 
        isPlaceholder: true, 
        layoutSize: item.layoutSize, 
        setId: set.id 
      };
    }
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;
    return { 
      ...product, 
      id: uniqueSlotId, 
      realProductId: product.id, 
      slotIndex: itemIdx, 
      setId: set.id, 
      layoutSize: item.layoutSize,
      customCover: item.customCover || null,
      displayCover: item.customCover || product.image || product.coverImage
    };
  }).filter(Boolean);

  const { layout, mobileLayout, renderItems, blockMarkers } = useMemo(() => {
    const layout = [];
    const mobileLayout = [];
    const renderItems = [];
    const blockMarkers = [];
    
    let currentY = 0;
    let mobileY = 0;
    let i = 0;
    
    while (i < setProducts.length) {
       // Look ahead: Game Map pattern (4 smalls + 1 large)
       if (
         i + 4 < setProducts.length &&
         setProducts[i].layoutSize === 'small' &&
         setProducts[i+1].layoutSize === 'small' &&
         (
           (setProducts[i+2].layoutSize === 'small' && setProducts[i+3].layoutSize === 'small' && setProducts[i+4].layoutSize === 'large') ||
           (setProducts[i+2].layoutSize === 'large' && setProducts[i+3].layoutSize === 'small' && setProducts[i+4].layoutSize === 'small')
         )
       ) {
          const blockItems = [setProducts[i], setProducts[i+1], setProducts[i+2], setProducts[i+3], setProducts[i+4]];
          const smalls = blockItems.filter(p => p.layoutSize === 'small');
          const large = blockItems.find(p => p.layoutSize === 'large');
          
          blockMarkers.push({ y: currentY, mobileY, startIndex: i, length: 5, type: '4+1' });
          
          // 4-Column Desktop Layout
          layout.push({ i: smalls[0].id, x: 0, y: currentY, w: 1, h: 1 });
          layout.push({ i: smalls[1].id, x: 1, y: currentY, w: 1, h: 1 });
          layout.push({ i: smalls[2].id, x: 0, y: currentY+1, w: 1, h: 1 });
          layout.push({ i: smalls[3].id, x: 1, y: currentY+1, w: 1, h: 1 });
          layout.push({ i: large.id, x: 2, y: currentY, w: 2, h: 2 });
          
          // 2-Column Mobile Layout (4 smalls in 2 rows, then 1 large full width)
          mobileLayout.push({ i: smalls[0].id, x: 0, y: mobileY, w: 1, h: 1 });
          mobileLayout.push({ i: smalls[1].id, x: 1, y: mobileY, w: 1, h: 1 });
          mobileLayout.push({ i: smalls[2].id, x: 0, y: mobileY+1, w: 1, h: 1 });
          mobileLayout.push({ i: smalls[3].id, x: 1, y: mobileY+1, w: 1, h: 1 });
          mobileLayout.push({ i: large.id, x: 0, y: mobileY+2, w: 2, h: 2 });
          
          for(let j=0; j<5; j++) renderItems.push({ isPlaceholder: blockItems[j].isPlaceholder, product: blockItems[j] });
          i += 5;
          currentY += 2;
          mobileY += 4;
       }
       // Look ahead: Inverted Game Map pattern (1 large + 4 smalls)
       else if (
         i + 4 < setProducts.length &&
         setProducts[i].layoutSize === 'large' &&
         setProducts[i+1].layoutSize === 'small' &&
         setProducts[i+2].layoutSize === 'small' &&
         setProducts[i+3].layoutSize === 'small' &&
         setProducts[i+4].layoutSize === 'small'
       ) {
          blockMarkers.push({ y: currentY, mobileY, startIndex: i, length: 5, type: '1+4' });
          
          // 4-Column Desktop Layout
          layout.push({ i: setProducts[i].id,   x: 0, y: currentY, w: 2, h: 2 });
          layout.push({ i: setProducts[i+1].id, x: 2, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+2].id, x: 3, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+3].id, x: 2, y: currentY+1, w: 1, h: 1 });
          layout.push({ i: setProducts[i+4].id, x: 3, y: currentY+1, w: 1, h: 1 });
          
          // 2-Column Mobile Layout (1 large full width, then 4 smalls in 2 rows)
          mobileLayout.push({ i: setProducts[i].id,   x: 0, y: mobileY, w: 2, h: 2 });
          mobileLayout.push({ i: setProducts[i+1].id, x: 0, y: mobileY+2, w: 1, h: 1 });
          mobileLayout.push({ i: setProducts[i+2].id, x: 1, y: mobileY+2, w: 1, h: 1 });
          mobileLayout.push({ i: setProducts[i+3].id, x: 0, y: mobileY+3, w: 1, h: 1 });
          mobileLayout.push({ i: setProducts[i+4].id, x: 1, y: mobileY+3, w: 1, h: 1 });
          
          for(let j=0; j<5; j++) renderItems.push({ isPlaceholder: setProducts[i+j].isPlaceholder, product: setProducts[i+j] });
          i += 5;
          currentY += 2;
          mobileY += 4;
       } 
       // Look ahead: Flat Row pattern (4 smalls)
       else if (
         i + 3 < setProducts.length &&
         setProducts[i].layoutSize === 'small' &&
         setProducts[i+1].layoutSize === 'small' &&
         setProducts[i+2].layoutSize === 'small' &&
         setProducts[i+3].layoutSize === 'small'
       ) {
          blockMarkers.push({ y: currentY, mobileY, startIndex: i, length: 4, type: 'row' });
          
          // 4-Column Desktop Layout
          layout.push({ i: setProducts[i].id,   x: 0, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+1].id, x: 1, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+2].id, x: 2, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+3].id, x: 3, y: currentY, w: 1, h: 1 });
          
          // 2-Column Mobile Layout (4 smalls in 2 rows of 2)
          mobileLayout.push({ i: setProducts[i].id,   x: 0, y: mobileY, w: 1, h: 1 });
          mobileLayout.push({ i: setProducts[i+1].id, x: 1, y: mobileY, w: 1, h: 1 });
          mobileLayout.push({ i: setProducts[i+2].id, x: 0, y: mobileY+1, w: 1, h: 1 });
          mobileLayout.push({ i: setProducts[i+3].id, x: 1, y: mobileY+1, w: 1, h: 1 });
          
          for(let j=0; j<4; j++) renderItems.push({ isPlaceholder: setProducts[i+j].isPlaceholder, product: setProducts[i+j] });
          i += 4;
          currentY += 1;
          mobileY += 2;
       }
       // Fallback: standard linear mapping
       else {
          const item = setProducts[i];
          const w = item.layoutSize === 'large' ? 2 : 1;
          const h = item.layoutSize === 'large' ? 2 : 1;
          blockMarkers.push({ y: currentY, mobileY, startIndex: i, length: 1, type: 'fallback' });
          
          layout.push({ i: item.id, x: 0, y: currentY, w, h });
          mobileLayout.push({ i: item.id, x: 0, y: mobileY, w, h });
          renderItems.push({ isPlaceholder: item.isPlaceholder, product: item });
          i += 1;
          currentY += h;
          mobileY += h;
       }
    }

    return { layout, mobileLayout, renderItems, blockMarkers };
  }, [setProducts]);

  const handleDragStop = (newRglLayout, oldItem, newItem, placeholder, e, element) => {
    const draggedId = newItem.i;

    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

    if (!clientX || !clientY || !element) return;

    // Temporarily hide the dragged element to find what's underneath
    const originalVisibility = element.style.visibility;
    element.style.visibility = 'hidden';
    const elementsUnder = document.elementsFromPoint(clientX, clientY);
    element.style.visibility = originalVisibility;

    // Find the first element that is a grid item and not the dragged element itself
    const targetElement = elementsUnder.find(el => el.hasAttribute('data-grid-id') && el.getAttribute('data-grid-id') !== draggedId);

    const newItems = [...set.items];

    if (targetElement) {
      const targetId = targetElement.getAttribute('data-grid-id');
      
      // SWAP in set.items
      const indexA = newItems.findIndex((item, idx) => (item.slotId || `${item.productId}-${idx}`) === draggedId || item.productId === draggedId);
      const indexB = newItems.findIndex((item, idx) => (item.slotId || `${item.productId}-${idx}`) === targetId || item.productId === targetId);
      
      if (indexA !== -1 && indexB !== -1) {
        const itemA = { ...newItems[indexA] };
        const itemB = { ...newItems[indexB] };
        
        // Retain original slot shapes
        const sizeA = itemA.layoutSize;
        const sizeB = itemB.layoutSize;
        
        itemA.layoutSize = sizeB;
        itemB.layoutSize = sizeA;
        
        // Swap the items
        newItems[indexA] = itemB;
        newItems[indexB] = itemA;
        
        handleUpdateSet(set.id, { items: newItems });
      }
    } else {
      // Dropped outside. Standard reordering based on grid position.
      const sorted = [...newRglLayout].sort((a, b) => (a.y * 4 + a.x) - (b.y * 4 + b.x));
      const newIndex = sorted.findIndex(item => item.i === draggedId);
      const currentIndex = newItems.findIndex((item, idx) => (item.slotId || `${item.productId}-${idx}`) === draggedId || item.productId === draggedId);
      if (newIndex !== -1 && currentIndex !== -1) {
        notifySaved();
        changeProductOrderInSet(set.id, draggedId, newIndex, null, currentIndex);
      }
    }
  };


  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return '#10b981';
      case 'scheduled': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // UI actions for structural blocks
  const appendBlock4Plus1 = () => {
    const newItems = [...set.items];
    for(let i=0; i<4; i++) newItems.push({ productId: `draft-${Date.now()}-${i}`, layoutSize: 'small' });
    newItems.push({ productId: `draft-${Date.now()}-L`, layoutSize: 'large' });
    handleUpdateSet(set.id, { items: newItems });
  };
  
  const appendRow1x1 = () => {
    const newItems = [...set.items];
    for(let i=0; i<4; i++) newItems.push({ productId: `draft-${Date.now()}-${i}`, layoutSize: 'small' });
    handleUpdateSet(set.id, { items: newItems });
  };
  
  const deleteBlock = (startIndex, length) => {
    if (!window.confirm("Delete this block?")) return;
    const newItems = [...set.items];
    newItems.splice(startIndex, length);
    handleUpdateSet(set.id, { items: newItems });
  };
  
  const appendBlock1Plus4 = () => {
    const newItems = [...set.items];
    newItems.push({ productId: `draft-${Date.now()}-L`, layoutSize: 'large' });
    for(let i=0; i<4; i++) newItems.push({ productId: `draft-${Date.now()}-${i}`, layoutSize: 'small' });
    handleUpdateSet(set.id, { items: newItems });
  };

  const flipBlock = (startIndex, type) => {
    const newItems = [...set.items];
    const block = newItems.slice(startIndex, startIndex + 5);
    
    if (type === '4+1') {
      // Current: [s,s,s,s, L] -> Target: [L, s,s,s,s]
      const L = block.pop();
      block.unshift(L);
    } else if (type === '1+4') {
      // Current: [L, s,s,s,s] -> Target: [s,s,s,s, L]
      const L = block.shift();
      block.push(L);
    }
    
    newItems.splice(startIndex, 5, ...block);
    handleUpdateSet(set.id, { items: newItems });
  };
  
  
  // Picker & Image Upload Flow
  const handlePlaceholderClick = (placeholder) => {
    if (onOpenPicker) {
      const currentSetItemIds = (set.items || [])
        .filter(i => !i.isPlaceholder && i.productId && !i.productId.startsWith('draft-'))
        .map(i => i.productId);
      onOpenPicker({ 
        slot: placeholder, 
        setId: set.id, 
        layoutSize: placeholder.layoutSize, 
        currentSetItemIds 
      });
    } else {
      handleEdit(placeholder, set.id);
    }
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setShowCategoryModal(false);
    // Trigger file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && activePlaceholder) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        // Create draft product
        const newProduct = await addProduct({
          name: "New Item",
          price: 0,
          mainCategory: selectedCategory,
          subCategory: "All",
          image: base64,
          images: [base64],
          status: 'draft'
        });
        
        // Replace placeholder in set
        const newItems = set.items.map(item => {
          if (item.productId === activePlaceholder.id) {
            return { productId: newProduct.id, layoutSize: item.layoutSize };
          }
          return item;
        });
        handleUpdateSet(set.id, { items: newItems });
        setActivePlaceholder(null);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  return (
    <div 
      id={`set-card-${set.id}`}
      onClick={onMarkActive}
      style={{ 
        marginBottom: '16px', 
        background: '#fff', 
        borderRadius: '12px', 
        border: isActiveSet ? '1px solid #111' : '1px solid #e5e7eb',
        boxShadow: isActiveSet ? '0 0 0 1px #111, 0 4px 12px rgba(0,0,0,0.06)' : 'none',
        overflow: 'hidden',
        transition: 'all 0.2s'
      }}
    >
      
      
      {isMobile ? (
        /* Mobile Header: Strict 1-Row Clean Layout */
        <div 
          style={{ 
            padding: '12px 14px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            cursor: 'pointer', 
            background: '#f9fafb', 
            borderBottom: isOpen ? '1px solid #e5e7eb' : 'none',
            gap: '8px'
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Left: Order + Chevron + Name + Status Dot + Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
            {/* Order Stepper compact */}
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '3px', 
                background: '#ffffff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '6px', 
                padding: '2px 5px',
                flexShrink: 0
              }}
              onClick={e => e.stopPropagation()}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
                #{index + 1}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }}
                  disabled={index === 0}
                  style={{ border: 'none', background: 'transparent', padding: '0 1px', cursor: index === 0 ? 'default' : 'pointer', color: index === 0 ? '#d1d5db' : '#374151', lineHeight: 1 }}
                >
                  <ArrowUp size={9} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }}
                  disabled={index === totalSets - 1}
                  style={{ border: 'none', background: 'transparent', padding: '0 1px', cursor: index === totalSets - 1 ? 'default' : 'pointer', color: index === totalSets - 1 ? '#d1d5db' : '#374151', lineHeight: 1 }}
                >
                  <ArrowDown size={9} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {isOpen ? <ChevronUp size={16} color="#6b7280" /> : <ChevronDown size={16} color="#6b7280" />}
            </div>

            {isEditingName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0 }} onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && editingName.trim()) {
                      handleUpdateSet(set.id, { name: editingName.trim() });
                      setIsEditingName(false);
                    } else if (e.key === 'Escape') {
                      setIsEditingName(false);
                    }
                  }}
                  autoFocus
                  style={{ width: '100%', minWidth: '70px', padding: '2px 6px', borderRadius: '4px', border: '1px solid #111', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                />
                <button
                  onClick={() => {
                    if (editingName.trim()) handleUpdateSet(set.id, { name: editingName.trim() });
                    setIsEditingName(false);
                  }}
                  style={{ padding: '3px 6px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, overflow: 'hidden' }}>
                <span 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#111',
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    maxWidth: '120px'
                  }}
                  title={set.name}
                >
                  {set.name}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsEditingName(true); setEditingName(set.name); }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: '#9ca3af', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                  title="Rename"
                >
                  <Edit2 size={11} />
                </button>
                <span 
                  title={`Status: ${set.status}`}
                  style={{ 
                    width: '7px', 
                    height: '7px', 
                    borderRadius: '50%', 
                    backgroundColor: getStatusColor(set.status),
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0 }}>
                  ({setProducts.length})
                </span>
              </div>
            )}
          </div>

          {/* Right: Quick Status Select + Trash */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            {justSaved && (
              <span style={{ fontSize: '10px', color: '#059669', background: '#ecfdf5', padding: '2px 5px', borderRadius: '4px', fontWeight: 600 }}>
                Saved
              </span>
            )}
            <select 
              value={set.status}
              onChange={(e) => handleUpdateSet(set.id, { status: e.target.value })}
              style={{ 
                padding: '4px 6px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db', 
                fontSize: '11px', 
                background: '#fff', 
                color: '#374151',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: 500
              }}
            >
              <option value="draft">Draft</option>
              <option value="published">Live</option>
              <option value="scheduled">Sched</option>
            </select>
            <button 
              onClick={() => deleteSet(set.id)} 
              style={{ 
                width: '28px', 
                height: '28px', 
                background: '#fee2e2', 
                color: '#ef4444', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
              title="Delete Look Set"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ) : (
        /* Desktop Header */
        <div 
          style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: '#f9fafb', borderBottom: isOpen ? '1px solid #e5e7eb' : 'none' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Order Rank & Stepper Buttons */}
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: '#ffffff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '3px 8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                color: '#111827', 
                minWidth: '22px', 
                textAlign: 'center',
                userSelect: 'none',
                fontVariantNumeric: 'tabular-nums'
              }}>
                #{index + 1}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }}
                  disabled={index === 0}
                  title={index === 0 ? "Top position" : "Move Set Up"}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '2px',
                    borderRadius: '3px',
                    cursor: index === 0 ? 'default' : 'pointer',
                    color: index === 0 ? '#d1d5db' : '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={e => { if (index > 0) e.currentTarget.style.color = '#000'; }}
                  onMouseLeave={e => { if (index > 0) e.currentTarget.style.color = '#374151'; }}
                >
                  <ArrowUp size={11} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }}
                  disabled={index === totalSets - 1}
                  title={index === totalSets - 1 ? "Bottom position" : "Move Set Down"}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '2px',
                    borderRadius: '3px',
                    cursor: index === totalSets - 1 ? 'default' : 'pointer',
                    color: index === totalSets - 1 ? '#d1d5db' : '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={e => { if (index < totalSets - 1) e.currentTarget.style.color = '#000'; }}
                  onMouseLeave={e => { if (index < totalSets - 1) e.currentTarget.style.color = '#374151'; }}
                >
                  <ArrowDown size={11} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div 
              onClick={() => setIsOpen(!isOpen)}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              {isOpen ? <ChevronUp size={18} color="#6b7280" /> : <ChevronDown size={18} color="#6b7280" />}
            </div>
            
            {isEditingName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && editingName.trim()) {
                      handleUpdateSet(set.id, { name: editingName.trim() });
                      setIsEditingName(false);
                    } else if (e.key === 'Escape') {
                      setIsEditingName(false);
                    }
                  }}
                  autoFocus
                  style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #111', fontSize: '15px', fontWeight: 600, outline: 'none' }}
                />
                <button
                  onClick={() => {
                    if (editingName.trim()) {
                      handleUpdateSet(set.id, { name: editingName.trim() });
                    }
                    setIsEditingName(false);
                  }}
                  style={{ padding: '4px 10px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  style={{ padding: '4px 8px', background: '#f3f4f6', color: '#666', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{set.name}</h3>
                {isActiveSet && (
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 7px', 
                    background: '#111', 
                    color: '#fff', 
                    borderRadius: '100px', 
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    Active
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setIsEditingName(true); setEditingName(set.name); }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px', color: '#9ca3af', display: 'flex', alignItems: 'center' }}
                  title="Rename Look Set"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {(set.mainCategory || set.main_category) && (
                <span 
                  onClick={(e) => {
                    if (onSelectCategory) {
                      e.stopPropagation();
                      onSelectCategory(set.mainCategory || set.main_category, set.subCategory || set.sub_category || 'Sets');
                    }
                  }}
                  title={onSelectCategory ? `Filter to ${set.mainCategory || set.main_category} › ${set.subCategory || set.sub_category}` : ''}
                  style={{ 
                    fontSize: '11px', 
                    padding: '3px 8px', 
                    borderRadius: '6px', 
                    background: '#f3f4f6', 
                    color: '#4b5563', 
                    fontWeight: 500,
                    border: '1px solid #e5e7eb',
                    cursor: onSelectCategory ? 'pointer' : 'default',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => { if (onSelectCategory) e.currentTarget.style.background = '#e5e7eb'; }}
                  onMouseLeave={e => { if (onSelectCategory) e.currentTarget.style.background = '#f3f4f6'; }}
                >
                  {set.mainCategory || set.main_category} &rsaquo; {set.subCategory || set.sub_category || 'Sets'}
                </span>
              )}
              <span style={{ 
                fontSize: '12px', 
                padding: '4px 10px', 
                borderRadius: '100px', 
                background: getStatusColor(set.status) + '20', 
                color: getStatusColor(set.status), 
                fontWeight: 600, 
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {set.status === 'published' && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                )}
                {set.status}
              </span>
              <span style={{ fontSize: '13px', color: '#666' }}>({setProducts.length} items)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
            {/* Instant Local Saved Feedback */}
            {justSaved && (
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '12px', 
                fontWeight: 600, 
                color: '#059669', 
                background: '#ecfdf5', 
                border: '1px solid #a7f3d0', 
                padding: '4px 10px', 
                borderRadius: '20px',
                boxShadow: '0 1px 4px rgba(16, 185, 129, 0.15)'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                Saved
              </span>
            )}

            <select 
              value={set.status}
              onChange={(e) => handleUpdateSet(set.id, { status: e.target.value })}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px', cursor: 'pointer', background: '#fff' }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
            {set.status === 'scheduled' && (
              <input 
                type="datetime-local" 
                value={set.scheduledDate || ''} 
                onChange={e => handleUpdateSet(set.id, { scheduledDate: e.target.value })}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
              />
            )}
            <button onClick={() => deleteSet(set.id)} style={{ padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div style={{ padding: isMobile ? '12px' : '20px' }}>
          {isMobile ? (
            /* Mobile Pattern Add Button */
            <div style={{ marginBottom: '12px' }}>
              <button 
                type="button"
                onClick={() => setIsPatternSheetOpen(true)}
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  padding: '10px 14px', 
                  background: '#f9fafb', 
                  color: '#111', 
                  border: '1px dashed #cbd5e1', 
                  borderRadius: '10px', 
                  cursor: 'pointer', 
                  fontSize: '13px', 
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
              >
                <Plus size={16} /> Add Layout Pattern ▾
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button onClick={appendBlock4Plus1} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#f3f4f6', color: '#111', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                <LayoutGrid size={16} /> Add 4+1 (Large Right)
              </button>
              <button onClick={appendBlock1Plus4} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#f3f4f6', color: '#111', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                <LayoutGrid size={16} style={{ transform: 'scaleX(-1)' }} /> Add 1+4 (Large Left)
              </button>
              <button onClick={appendRow1x1} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#f3f4f6', color: '#111', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                <Layout size={16} /> Add 4-Card Row
              </button>
            </div>
          )}

          <div style={{ position: 'relative', paddingLeft: isMobile ? '0px' : '40px' }}>
            {/* Block Controls (Floating Trash Cans) - Only rendered on Desktop */}
            {!isMobile && blockMarkers.map((marker, idx) => (
              <div 
                key={`marker-${idx}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: marker.y * (rowHeight + 12),
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  zIndex: 20,
                  marginTop: '12px'
                }}
              >
                {(marker.type === '4+1' || marker.type === '1+4') && (
                  <div 
                    onClick={() => flipBlock(marker.startIndex, marker.type)}
                    style={{
                      width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#0ea5e9', background: '#e0f2fe', borderRadius: '8px',
                      transition: 'all 0.2s ease', opacity: 0.6
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.transform = 'scale(1)'; }}
                    title="Flip Block (Swap Left/Right)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                  </div>
                )}
                
                <div 
                  onClick={() => deleteBlock(marker.startIndex, marker.length)}
                  style={{
                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#ef4444', background: '#fee2e2', borderRadius: '8px',
                    transition: 'all 0.2s ease', opacity: 0.6
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.transform = 'scale(1)'; }}
                  title="Delete Block"
                >
                  <Trash2 size={16} />
                </div>
              </div>
            ))}

          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout, md: layout, sm: mobileLayout, xs: mobileLayout, xxs: mobileLayout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 2 }}
            rowHeight={rowHeight}
            containerPadding={[0, 0]}
            margin={[isMobile ? 8 : 12, isMobile ? 8 : 12]}
            compactType={null}
            preventCollision={true}
            onDragStop={handleDragStop}
            onWidthChange={(containerWidth, margin, cols, containerPadding) => {
              const pad = containerPadding ? (containerPadding[0] * 2) : 0;
              const colW = (containerWidth - (margin[0] * (cols - 1)) - pad) / cols;
              const newRowHeight = (colW * (4/3)) + (isMobile ? 55 : 70);
              setRowHeight(newRowHeight);
            }}
            isResizable={false}
          >
            {renderItems.map((item) => {
              const product = item.product;
              const layoutSize = product.layoutSize || 'small';
              const isLarge = layoutSize === 'large';
              
              if (item.isPlaceholder) {
                return (
                  <div key={product.id} data-grid-id={product.id}>
                    <div 
                      className={styles.ghostSlot}
                      onClick={(e) => { e.stopPropagation(); handlePlaceholderClick(product); }}
                      title="Click to add product, or drag to swap"
                    >
                      <Plus className={styles.ghostSlotIcon} size={32} style={{ marginBottom: '8px' }} />
                      <span style={{ fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>
                        {layoutSize === 'large' ? '2x2 (Large)' : '1x1 (Small)'}
                      </span>
                    </div>
                  </div>
                );
              }
              const currentMedia = product.displayCover || product.image;
              const isMediaVideo = isVideoMedia(currentMedia);
              const isCustomVideo = isVideoMedia(product.customCover);

              return (
                <div key={product.id} data-grid-id={product.id}>
                  <div className={styles.productCard}>
                    {isMediaVideo ? (
                      <video 
                        src={currentMedia} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        draggable={false} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                      />
                    ) : (
                      <img src={currentMedia} alt={product.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    {!currentMedia && <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red'}}>No Image</div>}
                    
                    {product.customCover && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: 'rgba(0, 0, 0, 0.75)',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          backdropFilter: 'blur(4px)',
                          zIndex: 2,
                          pointerEvents: 'none'
                        }}
                      >
                        {isCustomVideo ? <Video size={10} /> : <ImageIcon size={10} />} 
                        {isCustomVideo ? 'Video Cover' : 'Exclusive Cover'}
                      </div>
                    )}

                    <div className={styles.productOverlay}>
                      <div className={styles.overlayActions}>
                        <button 
                          className={styles.overlayActionBtn}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleOpenCoverModal(product, product.slotIndex); 
                          }}
                          title="Change cover"
                        >
                          <ImageIcon size={13} />
                        </button>
                        {onOpenPicker && (
                          <button 
                            className={styles.overlayActionBtn}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              const currentSetItemIds = (set.items || [])
                                .filter(i => !i.isPlaceholder && i.productId && !i.productId.startsWith('draft-'))
                                .map(i => i.productId);
                              onOpenPicker({ 
                                slot: { 
                                  id: product.id, 
                                  realProductId: product.realProductId || product.id, 
                                  slotIndex: product.slotIndex, 
                                  layoutSize: product.layoutSize || layoutSize 
                                }, 
                                setId: set.id, 
                                layoutSize: product.layoutSize || layoutSize, 
                                currentSetItemIds 
                              });
                            }}
                            title="Swap"
                          >
                            <RefreshCw size={13} />
                          </button>
                        )}
                        <button 
                          className={styles.overlayActionBtn}
                          onClick={(e) => { e.stopPropagation(); handleEdit(product, set.id); }}
                          title="Edit"
                        >
                          <Edit2 size={13} className={styles.overlayEditBtn} />
                        </button>
                        <button 
                          className={styles.overlayActionBtn}
                          onClick={(e) => { e.stopPropagation(); removeProductFromSet(set.id, product.realProductId || product.id, product.slotIndex); }}
                          title="Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      
                      <div className={styles.overlayInfo}>
                        <h4>{product.name}</h4>
                        <p>${product.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ResponsiveGridLayout>
          </div>
        </div>
      )}

      {/* Mobile Pattern Bottom Sheet */}
      {isMobile && isPatternSheetOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsPatternSheetOpen(false)}
        >
          <div 
            style={{
              background: '#ffffff',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '20px 20px 32px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '2px', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#111' }}>Add Pattern</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>Choose layout pattern to append</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsPatternSheetOpen(false)}
                style={{ border: 'none', background: '#f3f4f6', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#666" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => { appendBlock4Plus1(); setIsPatternSheetOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', flexShrink: 0 }}>
                  <LayoutGrid size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>4 + 1 Pattern (Large Right)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>4 small cards + 1 large feature card</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { appendBlock1Plus4(); setIsPatternSheetOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', flexShrink: 0 }}>
                  <LayoutGrid size={22} style={{ transform: 'scaleX(-1)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>1 + 4 Pattern (Large Left)</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>1 large feature card + 4 small cards</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { appendRow1x1(); setIsPatternSheetOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
                  <Layout size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>4-Card Row</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>4 small 1x1 cards</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cover Image Picker Modal for this Set */}
      <CoverImagePickerModal
        isOpen={coverModalConfig.isOpen}
        onClose={() => setCoverModalConfig({ isOpen: false, product: null, slotIndex: null, currentCover: null })}
        product={coverModalConfig.product}
        currentCover={coverModalConfig.currentCover}
        onSaveCover={handleSaveCoverImage}
        isLarge={coverModalConfig.product?.layoutSize === 'large'}
      />

    </div>
  );
};

export default function SetsManager({ 
  handleEdit, 
  activeMainCategory, 
  activeSubCategory, 
  categories = {},
  products, 
  sets, 
  addSet, 
  updateSet, 
  deleteSet, 
  removeProductFromSet, 
  updateProductInSet, 
  changeProductOrderInSet,
  reorderSets,
  showToast,
  searchQuery = "",
  onOpenPicker,
  onRegisterAddSet,
  onSelectCategory,
  isMobile: isMobileProp = false
}) {
  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = isMobileProp || windowWidth <= 768;
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const [isAddingSet, setIsAddingSet] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [targetMainCat, setTargetMainCat] = useState("");
  const [targetSubCat, setTargetSubCat] = useState("");
  const [createError, setCreateError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const addSetCardRef = useRef(null);

  // Remember last active set for instant visual focus
  const [lastActiveSetId, setLastActiveSetId] = useState(() => {
    try {
      return localStorage.getItem('sol_admin_last_set_id') || null;
    } catch (e) {
      return null;
    }
  });

  const markSetActive = (id) => {
    setLastActiveSetId(id);
    try {
      localStorage.setItem('sol_admin_last_set_id', id);
    } catch (e) {}
  };

  // Find subcategories in the active main category that have existing sets
  const otherSubsWithSets = useMemo(() => {
    if (!activeMainCategory || activeMainCategory === 'All') return [];
    const subs = categories[activeMainCategory] || [];
    return subs
      .map(sub => ({
        sub,
        count: (sets || []).filter(s => 
          (s.mainCategory === activeMainCategory || s.main_category === activeMainCategory) && 
          (s.subCategory === sub || s.sub_category === sub)
        ).length
      }))
      .filter(item => item.count > 0 && item.sub !== activeSubCategory);
  }, [activeMainCategory, activeSubCategory, categories, sets]);

  // Sorting and Filtering states for Look Sets - default to 'order'
  const [sortBy, setSortBy] = useState("order"); // 'order', 'newest', 'oldest', 'name', 'category'
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'published', 'draft', 'scheduled'

  const handleOpenAddSet = () => {
    setIsAddingSet(true);
    setCreateError("");
    setNewSetName("");

    if (activeMainCategory && activeMainCategory !== 'All') {
      setTargetMainCat(activeMainCategory);
      setTargetSubCat(activeSubCategory && activeSubCategory !== 'All' ? activeSubCategory : (categories[activeMainCategory]?.[0] || 'Lookbook'));
    } else {
      const mainKeys = Object.keys(categories);
      const firstMain = mainKeys[0] || 'Campaign';
      setTargetMainCat(firstMain);
      const subs = categories[firstMain] || [];
      setTargetSubCat(subs.includes('Sets') ? 'Sets' : (subs[0] || 'Lookbook'));
    }

    setTimeout(() => {
      addSetCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  useEffect(() => {
    if (onRegisterAddSet) {
      onRegisterAddSet(handleOpenAddSet);
    }
  }, [onRegisterAddSet, activeMainCategory, activeSubCategory, categories]);

  const handleCreateSet = () => {
    setCreateError("");
    if (!newSetName.trim()) {
      setCreateError("Please enter a name for the Look Set.");
      return;
    }

    const finalMain = activeMainCategory !== 'All' ? activeMainCategory : (targetMainCat || 'Campaign');
    const finalSub = activeMainCategory !== 'All' ? (activeSubCategory !== 'All' ? activeSubCategory : 'Lookbook') : (targetSubCat || 'Lookbook');

    // Create Default Block: 4 smalls (left), 1 large (right)
    const defaultItems = [
      { productId: `draft-${Date.now()}-1`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-2`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-3`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-4`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-5`, layoutSize: 'large' },
    ];

    addSet({ 
      name: newSetName.trim(), 
      status: 'draft', 
      items: defaultItems, 
      mainCategory: finalMain, 
      subCategory: finalSub 
    });
    setNewSetName("");
    setIsAddingSet(false);
  };

  const displayedSets = useMemo(() => {
    let list = (sets || []).filter(s => {
      // 1. Main category filter
      if (activeMainCategory && activeMainCategory !== 'All' && activeMainCategory !== 'New In') {
        const sMain = s.mainCategory || s.main_category;
        if (sMain !== activeMainCategory) return false;
      }
      // 2. Sub category filter
      if (activeSubCategory && activeSubCategory !== 'All' && activeSubCategory !== 'View all' && activeSubCategory !== 'New In') {
        const sSub = s.subCategory || s.sub_category;
        if (sSub !== activeSubCategory) return false;
      }
      // 3. Status filter
      if (statusFilter !== 'all') {
        if ((s.status || 'draft').toLowerCase() !== statusFilter.toLowerCase()) return false;
      }
      // 4. Search query (driven from top master search bar)
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const sName = (s.name || '').toLowerCase();
        const sMain = (s.mainCategory || s.main_category || '').toLowerCase();
        const sSub = (s.subCategory || s.sub_category || '').toLowerCase();
        const matchItem = (s.items || []).some(item => {
          const pId = item.productId || item.product?.id;
          const p = (products || []).find(prod => prod.id === pId) || (typeof item.product === 'object' ? item.product : null);
          if (!p) return false;
          const pName = String(p.name || '').toLowerCase();
          const pSku = String(p.sku || '').toLowerCase();
          return pName.includes(q) || pSku.includes(q);
        });
        if (!sName.includes(q) && !sMain.includes(q) && !sSub.includes(q) && !matchItem) return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'order' || sortBy === 'newest') {
        return new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0);
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at || a.createdAt || 0) - new Date(b.created_at || b.createdAt || 0);
      } else if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'category') {
        const catA = `${a.mainCategory || a.main_category || ''} > ${a.subCategory || a.sub_category || ''}`;
        const catB = `${b.mainCategory || b.main_category || ''} > ${b.subCategory || b.sub_category || ''}`;
        return catA.localeCompare(catB);
      }
      return 0;
    });
  }, [sets, activeMainCategory, activeSubCategory, statusFilter, searchQuery, sortBy, products]);

  const handleMoveSet = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= displayedSets.length) return;

    const currentSet = displayedSets[index];
    const targetSet = displayedSets[targetIndex];

    const tCurrent = currentSet.created_at ? new Date(currentSet.created_at).getTime() : Date.now();
    const tTarget = targetSet.created_at ? new Date(targetSet.created_at).getTime() : Date.now();

    let newTimeCurrent, newTimeTarget;

    if (direction === 'up') {
      if (tCurrent <= tTarget) {
        newTimeCurrent = new Date(tTarget + 1000).toISOString();
        newTimeTarget = new Date(tTarget).toISOString();
      } else {
        newTimeCurrent = new Date(tTarget).toISOString();
        newTimeTarget = new Date(tCurrent).toISOString();
        if (new Date(newTimeCurrent).getTime() <= new Date(newTimeTarget).getTime()) {
          newTimeCurrent = new Date(new Date(newTimeTarget).getTime() + 1000).toISOString();
        }
      }
    } else {
      if (tCurrent >= tTarget) {
        newTimeCurrent = new Date(tTarget - 1000).toISOString();
        newTimeTarget = new Date(tTarget).toISOString();
      } else {
        newTimeCurrent = new Date(tTarget).toISOString();
        newTimeTarget = new Date(tCurrent).toISOString();
        if (new Date(newTimeCurrent).getTime() >= new Date(newTimeTarget).getTime()) {
          newTimeCurrent = new Date(new Date(newTimeTarget).getTime() - 1000).toISOString();
        }
      }
    }

    if (sortBy !== 'order') {
      setSortBy('order');
    }

    if (reorderSets) {
      reorderSets(currentSet.id, targetSet.id, newTimeCurrent, newTimeTarget);
    }
  };

  return (
    <div>
      {isMobile ? (
        /* Mobile 1-Row Utility Bar */
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '14px',
          gap: '8px'
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2 style={{ 
              fontSize: '15px', 
              fontWeight: 700, 
              margin: 0, 
              color: '#111',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {activeMainCategory === 'All' ? 'All Sets' : activeSubCategory}
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginLeft: '6px' }}>
                ({displayedSets.length})
              </span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            {/* Filter & Sort Trigger Button */}
            <button
              type="button"
              onClick={() => setIsFilterSheetOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                background: (statusFilter !== 'all' || sortBy !== 'order') ? '#111' : '#fff',
                color: (statusFilter !== 'all' || sortBy !== 'order') ? '#fff' : '#374151',
                border: (statusFilter !== 'all' || sortBy !== 'order') ? '1px solid #111' : '1px solid #e5e7eb',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {(statusFilter !== 'all' || sortBy !== 'order') && (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              )}
            </button>

            {/* Live Preview Button */}
            <button 
              type="button"
              onClick={() => setShowPreview(true)}
              style={{ 
                padding: '7px 12px', 
                background: '#fff', 
                color: '#111', 
                border: '1px solid #e5e7eb', 
                borderRadius: '100px', 
                cursor: 'pointer', 
                fontWeight: 600, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                fontSize: '12px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <Eye size={13} /> Preview
            </button>
          </div>
        </div>
      ) : (
        /* Desktop Utility Bar */
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px 0' }}>
              {activeMainCategory === 'All' ? 'All Look Sets Hub' : `${activeMainCategory} › ${activeSubCategory}`}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
              {activeMainCategory === 'All' ? `Managing all campaign look sets (${displayedSets.length} sets)` : `Managing look sets under ${activeSubCategory}`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '100px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', background: '#fff', cursor: 'pointer', fontWeight: 500 }}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>

            {/* Sort order */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '100px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', background: '#fff', cursor: 'pointer', fontWeight: 500 }}
            >
              <option value="order">Custom Order</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="category">Category</option>
            </select>

            <button 
              onClick={() => setShowPreview(true)}
              style={{ padding: '8px 18px', background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            >
              <Eye size={16} /> Live Preview
            </button>

          </div>
        </div>
      )}

      {isAddingSet && (
        <div ref={addSetCardRef} style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {createError && (
              <div style={{ padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '13px' }}>
                ⚠️ {createError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Set Name (e.g., Summer Beach Look)" 
                value={newSetName}
                onChange={e => { setNewSetName(e.target.value); setCreateError(""); }}
                style={{ flex: '1 1 240px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', fontSize: '14px' }}
                autoFocus
              />

              {activeMainCategory === 'All' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>Category:</span>
                    <select
                      value={targetMainCat}
                      onChange={e => {
                        const newM = e.target.value;
                        setTargetMainCat(newM);
                        const subs = categories[newM] || [];
                        setTargetSubCat(subs.includes('Sets') ? 'Sets' : (subs[0] || ''));
                      }}
                      style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '13px', outline: 'none', background: '#fff' }}
                    >
                      {Object.keys(categories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>Subcategory:</span>
                    <select
                      value={targetSubCat}
                      onChange={e => setTargetSubCat(e.target.value)}
                      style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '13px', outline: 'none', background: '#fff' }}
                    >
                      {(categories[targetMainCat] || []).map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '13px', color: '#666', background: '#fff', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  Target: <strong style={{ color: '#111' }}>{activeMainCategory} &rsaquo; {activeSubCategory}</strong>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleCreateSet} style={{ padding: '10px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  Create
                </button>
                <button onClick={() => setIsAddingSet(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#666', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {displayedSets.length === 0 ? (
          searchQuery || statusFilter !== 'all' ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#888', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
              <Layout size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111' }}>No matching sets found</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Try adjusting your search query or status filter.</p>
            </div>
          ) : activeMainCategory !== 'All' ? (
            <div style={{ textAlign: 'center', padding: '50px 24px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
              <Layout size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', color: '#111', fontWeight: 600 }}>
                No look sets in {activeMainCategory} &rsaquo; {activeSubCategory}
              </h3>
              {otherSubsWithSets.length > 0 ? (
                <>
                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6b7280' }}>
                    You have active sets in other {activeMainCategory} subcategories:
                  </p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {otherSubsWithSets.map(item => (
                      <button
                        key={item.sub}
                        type="button"
                        onClick={() => onSelectCategory?.(activeMainCategory, item.sub)}
                        style={{
                          padding: '7px 16px',
                          background: '#fff',
                          border: '1px solid #d1d5db',
                          borderRadius: '100px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#111',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                      >
                        Go to {item.sub} ({item.count}) &rarr;
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6b7280' }}>
                  Click below to create the first look set for this subcategory.
                </p>
              )}
              <button 
                type="button"
                onClick={handleOpenAddSet}
                style={{
                  padding: '9px 20px',
                  background: '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                + Create Look Set for {activeSubCategory}
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#888', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
              <Layout size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111' }}>No sets created yet</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Click "New Look Set" above to start building your visual campaign.</p>
              <button 
                type="button"
                onClick={handleOpenAddSet}
                style={{
                  padding: '9px 20px',
                  background: '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                + New Look Set
              </button>
            </div>
          )
        ) : (
          displayedSets.map((set, index) => (
            <SetAccordion 
              key={set.id} 
              set={set} 
              index={index}
              totalSets={displayedSets.length}
              isMobile={isMobile}
              onMoveUp={() => { markSetActive(set.id); handleMoveSet(index, 'up'); }}
              onMoveDown={() => { markSetActive(set.id); handleMoveSet(index, 'down'); }}
              isActiveSet={set.id === lastActiveSetId}
              onMarkActive={() => markSetActive(set.id)}
              onSelectCategory={onSelectCategory}
              products={products} 
              updateSet={updateSet} 
              deleteSet={deleteSet} 
              removeProductFromSet={removeProductFromSet} 
              updateProductInSet={updateProductInSet} 
              changeProductOrderInSet={changeProductOrderInSet} 
              handleEdit={handleEdit} 
              showToast={showToast}
              onOpenPicker={onOpenPicker}
            />
          ))
        )}

      {/* Mobile Filter & Sort Bottom Sheet */}
      {isMobile && isFilterSheetOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsFilterSheetOpen(false)}
        >
          <div 
            style={{
              background: '#ffffff',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '20px 20px 32px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '40px', height: '4px', background: '#e5e7eb', borderRadius: '2px', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#111' }}>Filter & Sort</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>Customize display of Look Sets</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                style={{ border: 'none', background: '#f3f4f6', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#666" />
              </button>
            </div>

            {/* Status Filter Chips */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>
                Status
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'scheduled', label: 'Scheduled' }
                ].map(item => {
                  const isSelected = statusFilter === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setStatusFilter(item.value)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '100px',
                        border: isSelected ? '1px solid #111' : '1px solid #e5e7eb',
                        background: isSelected ? '#111' : '#f9fafb',
                        color: isSelected ? '#fff' : '#374151',
                        fontSize: '13px',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Order Chips */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>
                Sort By
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { value: 'order', label: 'Custom Order' },
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'name', label: 'Name (A-Z)' },
                  { value: 'category', label: 'Category' }
                ].map(item => {
                  const isSelected = sortBy === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setSortBy(item.value)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '100px',
                        border: isSelected ? '1px solid #111' : '1px solid #e5e7eb',
                        background: isSelected ? '#111' : '#f9fafb',
                        color: isSelected ? '#fff' : '#374151',
                        fontSize: '13px',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setSortBy('order');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                style={{
                  flex: 2,
                  padding: '12px',
                  background: '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && <PreviewModal sets={sets} onClose={() => setShowPreview(false)} />}
    </div>
  );
}
