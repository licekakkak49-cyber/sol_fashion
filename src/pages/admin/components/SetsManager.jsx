import React, { useState, useMemo, useRef } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Plus, X, ChevronDown, ChevronUp, Trash2, Edit2, Image as ImageIcon, LayoutGrid, Layout, Eye } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import styles from '../AdminLayout.module.css';
import PreviewModal from './PreviewModal';


const ResponsiveGridLayout = WidthProvider(Responsive);

const CATEGORIES = ['Bags', 'Dresses', 'Tops', 'Bottoms', 'Accessories'];

const SetAccordion = ({ set, products, updateSet, deleteSet, removeProductFromSet, updateProductInSet, changeProductOrderInSet, handleEdit}) => {
  const [isOpen, setIsOpen] = useState(true); // Open by default
  const [rowHeight, setRowHeight] = useState(250);
  
  const [activePlaceholder, setActivePlaceholder] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  

  // Map items to either real products or placeholders
  const setProducts = set.items.map(item => {
    if (item.productId && item.productId.startsWith('draft-')) {
      return { id: item.productId, isPlaceholder: true, layoutSize: item.layoutSize, setId: set.id };
    }
    const product = products.find(p => p.id === item.productId);
    return product ? { ...product, setId: set.id, layoutSize: item.layoutSize } : null;
  }).filter(Boolean);

  const { layout, renderItems, blockMarkers } = useMemo(() => {
    const layout = [];
    const renderItems = [];
    const blockMarkers = [];
    
    let currentY = 0;
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
          
          blockMarkers.push({ y: currentY, startIndex: i, length: 5, type: '4+1' });
          layout.push({ i: smalls[0].id, x: 0, y: currentY, w: 1, h: 1 });
          layout.push({ i: smalls[1].id, x: 1, y: currentY, w: 1, h: 1 });
          layout.push({ i: smalls[2].id, x: 0, y: currentY+1, w: 1, h: 1 });
          layout.push({ i: smalls[3].id, x: 1, y: currentY+1, w: 1, h: 1 });
          layout.push({ i: large.id, x: 2, y: currentY, w: 2, h: 2 });
          
          for(let j=0; j<5; j++) renderItems.push({ isPlaceholder: blockItems[j].isPlaceholder, product: blockItems[j] });
          i += 5;
          currentY += 2;
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
          blockMarkers.push({ y: currentY, startIndex: i, length: 5, type: '1+4' });
          // Large on left
          layout.push({ i: setProducts[i].id,   x: 0, y: currentY, w: 2, h: 2 });
          // Smalls on right
          layout.push({ i: setProducts[i+1].id, x: 2, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+2].id, x: 3, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+3].id, x: 2, y: currentY+1, w: 1, h: 1 });
          layout.push({ i: setProducts[i+4].id, x: 3, y: currentY+1, w: 1, h: 1 });
          
          for(let j=0; j<5; j++) renderItems.push({ isPlaceholder: setProducts[i+j].isPlaceholder, product: setProducts[i+j] });
          i += 5;
          currentY += 2;
       } 
       // Look ahead: Flat Row pattern (4 smalls)
       else if (
         i + 3 < setProducts.length &&
         setProducts[i].layoutSize === 'small' &&
         setProducts[i+1].layoutSize === 'small' &&
         setProducts[i+2].layoutSize === 'small' &&
         setProducts[i+3].layoutSize === 'small'
       ) {
          blockMarkers.push({ y: currentY, startIndex: i, length: 4, type: 'row' });
          layout.push({ i: setProducts[i].id,   x: 0, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+1].id, x: 1, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+2].id, x: 2, y: currentY, w: 1, h: 1 });
          layout.push({ i: setProducts[i+3].id, x: 3, y: currentY, w: 1, h: 1 });
          
          for(let j=0; j<4; j++) renderItems.push({ isPlaceholder: setProducts[i+j].isPlaceholder, product: setProducts[i+j] });
          i += 4;
          currentY += 1;
       }
       // Fallback: standard linear mapping
       else {
          const item = setProducts[i];
          const w = item.layoutSize === 'large' ? 2 : 1;
          const h = item.layoutSize === 'large' ? 2 : 1;
          blockMarkers.push({ y: currentY, startIndex: i, length: 1, type: 'fallback' });
          layout.push({ i: item.id, x: 0, y: currentY, w, h });
          renderItems.push({ isPlaceholder: item.isPlaceholder, product: item });
          i += 1;
          currentY += h;
       }
    }

    return { layout, renderItems, blockMarkers };
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

    if (targetElement) {
      const targetId = targetElement.getAttribute('data-grid-id');
      
      // SWAP in set.items
      const newItems = [...set.items];
      const indexA = newItems.findIndex(i => i.productId === draggedId);
      const indexB = newItems.findIndex(i => i.productId === targetId);
      
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
        
        updateSet(set.id, { items: newItems });
      }
    } else {
      // Dropped outside. Standard reordering based on grid position.
      const sorted = [...newRglLayout].sort((a, b) => (a.y * 4 + a.x) - (b.y * 4 + b.x));
      const newIndex = sorted.findIndex(item => item.i === draggedId);
      if (newIndex !== -1) {
        changeProductOrderInSet(set.id, draggedId, newIndex);
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
    updateSet(set.id, { items: newItems });
  };
  
  const appendRow1x1 = () => {
    const newItems = [...set.items];
    for(let i=0; i<4; i++) newItems.push({ productId: `draft-${Date.now()}-${i}`, layoutSize: 'small' });
    updateSet(set.id, { items: newItems });
  };
  
  const deleteBlock = (startIndex, length) => {
    if (!window.confirm("Delete this block?")) return;
    const newItems = [...set.items];
    newItems.splice(startIndex, length);
    updateSet(set.id, { items: newItems });
  };
  
  const appendBlock1Plus4 = () => {
    const newItems = [...set.items];
    newItems.push({ productId: `draft-${Date.now()}-L`, layoutSize: 'large' });
    for(let i=0; i<4; i++) newItems.push({ productId: `draft-${Date.now()}-${i}`, layoutSize: 'small' });
    updateSet(set.id, { items: newItems });
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
    updateSet(set.id, { items: newItems });
  };
  
  
  // Image Upload Flow
  const handlePlaceholderClick = (placeholder) => {
    handleEdit(placeholder, set.id);
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
        updateSet(set.id, { items: newItems });
        setActivePlaceholder(null);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  return (
    <div style={{ marginBottom: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      
      
      <div 
        style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: '#f9fafb', borderBottom: isOpen ? '1px solid #e5e7eb' : 'none' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{set.name}</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '100px', background: getStatusColor(set.status) + '20', color: getStatusColor(set.status), fontWeight: 600, textTransform: 'uppercase' }}>
              {set.status}
            </span>
            <span style={{ fontSize: '13px', color: '#666' }}>({setProducts.length} items)</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
          <select 
            value={set.status}
            onChange={(e) => updateSet(set.id, { status: e.target.value })}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
          {set.status === 'scheduled' && (
            <input 
              type="datetime-local" 
              value={set.scheduledDate || ''} 
              onChange={e => updateSet(set.id, { scheduledDate: e.target.value })}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
            />
          )}
          <button onClick={() => deleteSet(set.id)} style={{ padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{ padding: '20px' }}>
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

          <div style={{ position: 'relative', paddingLeft: '40px' }}>
            {/* Block Controls (Floating Trash Cans) */}
            {blockMarkers.map((marker, idx) => (
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
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 }}
            rowHeight={rowHeight}
            containerPadding={[0, 0]}
            margin={[12, 12]}
            compactType={null}
            preventCollision={true}
            onDragStop={handleDragStop}
            onWidthChange={(containerWidth, margin, cols, containerPadding) => {
              const pad = containerPadding ? (containerPadding[0] * 2) : 0;
              const colW = (containerWidth - (margin[0] * (cols - 1)) - pad) / cols;
              const newRowHeight = (colW * (4/3)) + 70;
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
              return (
                <div key={product.id} data-grid-id={product.id}>
                  <div className={styles.productCard}>
                    <img src={product.image} alt={product.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {!product.image && <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red'}}>No Image</div>}
                    
                    <div className={styles.productOverlay}>
                      <div className={styles.overlayActions}>
                        <button 
                          className={styles.overlayActionBtn}
                          onClick={(e) => { e.stopPropagation(); handleEdit(product, set.id); }}
                          title="Edit Product"
                        >
                          <Edit2 size={14} className={styles.overlayEditBtn} />
                        </button>
                        <button 
                          className={styles.overlayActionBtn}
                          onClick={(e) => { e.stopPropagation(); removeProductFromSet(set.id, product.id); }}
                          title="Remove from Set"
                        >
                          <Trash2 size={14} />
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

      

    </div>
  );
};

export default function SetsManager({ handleEdit, activeMainCategory, activeSubCategory, products, sets, addSet, updateSet, deleteSet, removeProductFromSet, updateProductInSet, changeProductOrderInSet }) {
  
  const [isAddingSet, setIsAddingSet] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleCreateSet = () => {
    if (!newSetName.trim()) return;
    
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
      mainCategory: activeMainCategory, 
      subCategory: activeSubCategory 
    });
    setNewSetName("");
    setIsAddingSet(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 4px 0' }}>Visual Set Builder</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setShowPreview(true)}
            style={{ padding: '10px 20px', background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Eye size={18} /> Live Preview
          </button>
          <button 
            onClick={() => setIsAddingSet(true)}
            style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> New Look Set
          </button>
        </div>
      </div>

      {isAddingSet && (
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Set Name (e.g., Summer Beach Look)" 
            value={newSetName}
            onChange={e => setNewSetName(e.target.value)}
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
            autoFocus
          />
          <button onClick={handleCreateSet} style={{ padding: '10px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Create
          </button>
          <button onClick={() => setIsAddingSet(false)} style={{ padding: '10px 24px', background: 'transparent', color: '#666', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Cancel
          </button>
        </div>
      )}

      <div>
        {sets.filter(s => {
            if (activeMainCategory && activeMainCategory !== 'New In') {
              if (s.mainCategory !== activeMainCategory && s.main_category !== activeMainCategory) return false;
            }
            if (activeSubCategory && activeSubCategory !== 'View all' && activeSubCategory !== 'New In') {
              if (s.subCategory !== activeSubCategory && s.sub_category !== activeSubCategory) return false;
            }
            return true;
          }).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
            <Layout size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111' }}>No sets created yet</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Click "New Look Set" to start building your first visual campaign.</p>
          </div>
        ) : (
          sets.filter(s => {
            if (activeMainCategory && activeMainCategory !== 'New In') {
              if (s.mainCategory !== activeMainCategory && s.main_category !== activeMainCategory) return false;
            }
            if (activeSubCategory && activeSubCategory !== 'View all' && activeSubCategory !== 'New In') {
              if (s.subCategory !== activeSubCategory && s.sub_category !== activeSubCategory) return false;
            }
            return true;
          }).map(set => (
            <SetAccordion 
              key={set.id} 
              set={set} 
              products={products} 
              updateSet={updateSet}
              deleteSet={deleteSet}
              removeProductFromSet={removeProductFromSet}
              updateProductInSet={updateProductInSet}
              changeProductOrderInSet={changeProductOrderInSet}
              handleEdit={handleEdit}
              
            />
          ))
        )}
      </div>

      {showPreview && <PreviewModal sets={sets} onClose={() => setShowPreview(false)} />}
    </div>
  );
}
