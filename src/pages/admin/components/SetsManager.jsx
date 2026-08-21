import React, { useState, useMemo, useRef } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Plus, X, ChevronDown, ChevronUp, Trash2, Image as ImageIcon, LayoutGrid, Layout } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import styles from '../AdminLayout.module.css';

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

  const { layout, renderItems } = useMemo(() => {
    const layout = [];
    const renderItems = [];
    let currentY = 0;
    let currentX = 0;
    
    setProducts.forEach(product => {
      const size = product.layoutSize || 'small';
      
      if (size === 'wide') {
        if (currentX > 0) { currentX = 0; currentY += 1; }
        layout.push({ i: product.id, x: 0, y: currentY, w: 4, h: 1 });
        renderItems.push({ isPlaceholder: product.isPlaceholder, product });
        currentY += 1;
      } else if (size === 'large') {
        if (currentX > 2) { currentX = 0; currentY += 1; }
        layout.push({ i: product.id, x: currentX, y: currentY, w: 2, h: 2 });
        renderItems.push({ isPlaceholder: product.isPlaceholder, product });
        currentX += 2;
      } else {
        if (currentX > 3) { currentX = 0; currentY += 1; }
        layout.push({ i: product.id, x: currentX, y: currentY, w: 1, h: 1 });
        renderItems.push({ isPlaceholder: product.isPlaceholder, product });
        currentX += 1;
      }
    });

    return { layout, renderItems };
  }, [setProducts]);

  const handleDragStop = (newRglLayout, oldItem, newItem) => {
    const draggedId = newItem.i;
    const targetX = newItem.x;
    const targetY = newItem.y;

    // Find if the drop coordinate falls inside the bounding box of any existing item
    let dropTargetIndex = layout.findIndex(item => 
      targetX >= item.x && targetX < item.x + item.w && 
      targetY >= item.y && targetY < item.y + item.h
    );

    if (dropTargetIndex !== -1) {
      const targetId = layout[dropTargetIndex].i;
      
      if (targetId !== draggedId) {
        // SWAP in set.items
        const newItems = [...set.items];
        const indexA = newItems.findIndex(i => i.productId === draggedId);
        const indexB = newItems.findIndex(i => i.productId === targetId);
        
        if (indexA !== -1 && indexB !== -1) {
          const itemA = { ...newItems[indexA] };
          const itemB = { ...newItems[indexB] };
          
          const sizeA = itemA.layoutSize;
          const sizeB = itemB.layoutSize;
          
          itemA.layoutSize = sizeB;
          itemB.layoutSize = sizeA;
          
          // Swap positions in the array
          newItems[indexA] = itemB;
          newItems[indexB] = itemA;
          
          updateSet(set.id, { items: newItems });
        }
      }
    } else {
      // Fallback: Just reorder if dropped outside (like the very end)
      const sorted = [...newRglLayout].sort((a, b) => {
        return (a.y * 4 + a.x) - (b.y * 4 + b.x);
      });
      const newIndex = sorted.findIndex(item => item.i === draggedId);
      if (newIndex !== -1) {
        changeProductOrderInSet(set.id, draggedId, newIndex);
      }
    }
  };

  const handleToggleSize = (product) => {
    const currentSize = product.layoutSize || 'small';
    const sizes = ['small', 'large', 'wide'];
    const nextSize = sizes[(sizes.indexOf(currentSize) + 1) % sizes.length];
    
    // For placeholders, we update via updateSet directly because they don't have standard updateProductInSet
    if (product.isPlaceholder) {
      const newItems = set.items.map(item => item.productId === product.id ? { ...item, layoutSize: nextSize } : item);
      updateSet(set.id, { items: newItems });
    } else {
      updateProductInSet(set.id, product.id, { layoutSize: nextSize });
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
  
  const appendWideRow = () => {
    const newItems = [...set.items];
    for(let i=0; i<4; i++) newItems.push({ productId: `draft-${Date.now()}-${i}`, layoutSize: 'small' });
    // Note: a wide row is just 4 smalls in sequence
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
              <LayoutGrid size={16} /> Add 4+1 Block
            </button>
            <button onClick={appendWideRow} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#f3f4f6', color: '#111', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
              <Layout size={16} /> Add 1x4 Row
            </button>
          </div>

          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 }}
            rowHeight={rowHeight}
            containerPadding={[0, 0]}
            margin={[12, 12]}
            compactType={null}
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
                  <div key={product.id}>
                    <div 
                      style={{ 
                        height: '100%', 
                        border: '2px dashed #cbd5e1', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: '#f8fafc',
                        cursor: 'grab',
                        color: '#64748b',
                        position: 'relative'
                      }}
                    >
                      <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePlaceholderClick(product); }}
                        style={{ 
                          padding: '8px 16px', background: '#111', color: '#fff', border: 'none', 
                          borderRadius: '100px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                          marginBottom: '4px', zIndex: 10 
                        }}
                      >
                        Add Product
                      </button>
                      <span style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>{layoutSize === 'large' ? '2x2 (Large)' : '1x1 (Small)'}</span>
                      
                      {/* Drag handle area */}
                      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                         <button onClick={(e) => { e.stopPropagation(); handleToggleSize(product); }} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer' }}>Resize</button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={product.id}>
                  <div 
                    className={`${styles.card} ${isLarge ? styles.largeCard : styles.standardCard}`} 
                    style={{ 
                      padding: '0', 
                      overflow: 'hidden', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'grab',
                      height: '100%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ flex: 1, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <img src={product.image} alt={product.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
       <div style={{position:'absolute', top: 30, background:'rgba(255,0,0,0.8)', color: '#fff', padding: 4, zIndex: 99}}>{product.image ? 'IMG LEN: ' + product.image.length : 'NO IMG'}</div>
                      {!product.image && <div style={{position: 'absolute', color: 'red'}}>No Image</div>}
                      
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', zIndex: 10 }}>
                        <button onClick={() => handleToggleSize(product)} style={{ background: layoutSize === 'wide' ? '#10b981' : (isLarge ? '#007aff' : '#111'), color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}>
                          {layoutSize === 'wide' ? '1x4' : (isLarge ? '2x2 (Large)' : '1x1 (Small)')}
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'rgb(30, 30, 30)', lineHeight: '1.2' }}>{product.name}</h4>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px' }}>
                        <button onClick={() => handleEdit(product)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#2563eb', padding: '0', fontSize: '11px', fontWeight: 500, textDecoration: 'underline' }}>
                          Edit Details
                        </button>
                        <button onClick={() => removeProductFromSet(set.id, product.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '0', fontSize: '11px', fontWeight: 500, textDecoration: 'underline' }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ResponsiveGridLayout>
        </div>
      )}

      
    </div>
  );
};

export default function SetsManager({ handleEdit, activeMainCategory, activeSubCategory, products, sets, addSet, updateSet, deleteSet, removeProductFromSet, updateProductInSet, changeProductOrderInSet }) {
  
  const [isAddingSet, setIsAddingSet] = useState(false);
  const [newSetName, setNewSetName] = useState("");

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

    addSet({ name: newSetName, status: 'draft', items: defaultItems });
    setNewSetName("");
    setIsAddingSet(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 4px 0' }}>Visual Set Builder</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Build complete looks and campaigns by arranging placeholders and uploading images directly.</p>
        </div>
        <button 
          onClick={() => setIsAddingSet(true)}
          style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> New Look Set
        </button>
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
        {sets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
            <Layout size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#111' }}>No sets created yet</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Click "New Look Set" to start building your first visual campaign.</p>
          </div>
        ) : (
          sets.map(set => (
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
    </div>
  );
}
