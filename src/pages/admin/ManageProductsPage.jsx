import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);
import { useAdmin } from '../../context/AdminContext';
import { Plus, X, UploadCloud, Search, Filter, Package, Edit2, Trash2, AlertTriangle, ArrowLeft, Briefcase, Shirt, Glasses, Watch, Activity, Settings, Hexagon, Eye, PanelTop, Tag } from 'lucide-react';
import styles from './AdminLayout.module.css';
import ImageCropper from '../../components/ImageCropper';

// Pill Selector for Light Mode
const PillSelector = ({ label, options, selectedValue, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '12px', fontWeight: 600, color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            border: selectedValue === opt.value ? '1px solid #111' : '1px solid #e5e7eb',
            background: selectedValue === opt.value ? '#111' : '#fff',
            color: selectedValue === opt.value ? '#fff' : '#666',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const MultiPillSelector = ({ label, options, selectedValues, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '12px', fontWeight: 600, color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map(opt => {
        const isSelected = selectedValues.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              if (isSelected) onChange(selectedValues.filter(v => v !== opt.value));
              else onChange([...selectedValues, opt.value]);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: isSelected ? '1px solid #111' : '1px solid #e5e7eb',
              background: isSelected ? '#111' : '#fff',
              color: isSelected ? '#fff' : '#666',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

const ManageProductsPage = () => {
  const { products, brands, addProduct, updateProduct, deleteProduct, changeProductOrder, swapProducts, categories, addCategory, addSubCategory, editCategory, editSubCategory } = useAdmin();
  
  // Filtering and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainCategory, setActiveMainCategory] = useState('Bags');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'In Stock', 'Low Stock', 'Out of Stock'
  
  // Category Modal State
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, type: '', action: '', oldName: '', mainName: '' });
  const [categoryInput, setCategoryInput] = useState('');

  const [filterBrand, setFilterBrand] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterHighlight, setFilterHighlight] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  const [isAdding, setIsAdding] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [productCategory, setProductCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  
  // Drag and Drop State
  
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [imageWarning, setImageWarning] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    price: '',
    sku: '',
    stock: '',
    description: '',
    sizeLens: '',
    sizeBridge: '',
    sizeTemple: '',
    gender: 'Unisex',
    isPolarized: 'No',
    frameColor: 'Black',
    lensColor: 'Clear',
    material: 'Acetate',
    shape: 'Square',
    highlight: [],
    images: [],
    primaryImageIndex: 0,
    tags: '',
    mainCategory: '',
    subCategory: ''
  });

  const getBrandName = (brandId) => {
    const brand = (brands || []).find(b => b?.slug === brandId || b?.id === brandId);
    return brand ? brand.name : brandId;
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name.trim()) {
      setFormError('⚠️ Product Name is required.');
      return;
    }
    if (!formData.brandId) {
      setFormError('⚠️ Please select a Brand.');
      return;
    }
    if (!formData.price) {
      setFormError('⚠️ Price is required.');
      return;
    }
    
    const finalImages = formData.images.length > 0 ? formData.images : (editingId && formData.image ? [formData.image] : ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000"]);
    
    const payload = {
      ...formData,
      status: parseInt(formData.stock) > 0 ? 'In Stock' : 'Out of Stock',
      images: finalImages,
      image: finalImages[formData.primaryImageIndex] || finalImages[0]
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '', brandId: '', price: '', sku: '', stock: '', description: '',
      sizeLens: '', sizeBridge: '', sizeTemple: '', gender: 'Unisex', isPolarized: 'No',
      frameColor: 'Black', lensColor: 'Clear', material: 'Acetate', shape: 'Square', highlight: [], 
      images: [], primaryImageIndex: 0, tags: '', mainCategory: '', subCategory: ''
    });
    setIsAdding(false);
    setEditingId(null);
    setFormError('');
    setModalStep(1);
    setProductCategory('');
  };

  const handleEdit = (product) => {
    // Ensure highlight is an array for old data compatibility
    const safeHighlight = Array.isArray(product.highlight) 
      ? product.highlight 
      : (product.highlight && product.highlight !== 'None' ? [product.highlight] : []);
      
    // Reconstruct images array if not present but image exists
    const safeImages = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : (product.image ? [product.image] : []);
      
    // Find primary index if it matches the main image, otherwise default to 0
    let primaryIdx = safeImages.findIndex(img => img === product.image);
    if (primaryIdx === -1) primaryIdx = 0;

    setFormData({
      ...product,
      highlight: safeHighlight,
      images: safeImages,
      primaryImageIndex: primaryIdx,
      tags: product.tags ? (Array.isArray(product.tags) ? product.tags.join(', ') : product.tags) : '',
      mainCategory: product.mainCategory || '',
      subCategory: product.subCategory || ''
    });
    setEditingId(product.id);
    setProductCategory(product.mainCategory || 'Bags');
    setModalStep(2);
    setIsAdding(true);
    setFormError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          if (img.width < 800 || img.height < 800) {
            setImageWarning('⚠️ Warning: Image resolution is below 800x800px. It may appear blurry after cropping.');
          } else {
            setImageWarning('');
          }
          setCropImageSrc(reader.result);
        };
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null; // Reset so the same file can be clicked again
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validProducts = Array.isArray(products) ? products.filter(Boolean) : [];

  // Filter Logic
  const filteredProducts = useMemo(() => {
    if (!validProducts.length) return [];
    
    const filtered = validProducts.filter(p => {
      // 1. Tab Filter
      const stockNum = parseInt(p.stock) || 0;
      if (activeTab === 'In Stock' && stockNum === 0) return false;
      if (activeTab === 'Low Stock' && (stockNum === 0 || stockNum > 5)) return false;
      if (activeTab === 'Out of Stock' && stockNum > 0) return false;
      
      // 2. Category Filters
      if (activeMainCategory !== 'All' && p.mainCategory !== activeMainCategory) return false;
      if (activeSubCategory !== 'All' && p.subCategory !== activeSubCategory) return false;

      // 3. Dropdown Filters
      if (filterBrand !== 'All' && p.brandId !== filterBrand) return false;
      
      // Fallback gender to Unisex if missing for older mock data
      const pGender = p.gender || 'Unisex';
      if (filterGender !== 'All' && pGender !== filterGender) return false;
      
      const pHighlight = Array.isArray(p.highlight) ? p.highlight : (p.highlight && p.highlight !== 'None' ? [p.highlight] : []);
      if (filterHighlight !== 'All' && !pHighlight.includes(filterHighlight)) return false;
      
      // 4. Search Query
      if (searchQuery) {
        const query = String(searchQuery || '').toLowerCase();
        const safeName = String(p.name || '');
        const safeSku = String(p.sku || '');
        
        const matchName = safeName.toLowerCase().includes(query);
        const matchSku = safeSku.toLowerCase().includes(query);
        if (!matchName && !matchSku) return false;
      }
      
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0);
      } else if (sortBy === 'Oldest') {
        return new Date(a.uploadDate || 0) - new Date(b.uploadDate || 0);
      } else if (sortBy === 'Name A-Z') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'Name Z-A') {
        return (b.name || '').localeCompare(a.name || '');
      }
      return 0;
    });
  }, [validProducts, searchQuery, activeTab, filterBrand, filterGender, filterHighlight, sortBy]);

  const getInitialBreakpoint = () => {
    if (typeof window === 'undefined') return 'lg';
    const w = window.innerWidth;
    if (w < 480) return 'xs';
    if (w < 768) return 'sm';
    if (w < 996) return 'md';
    return 'lg';
  };
  const [currentBreakpoint, setCurrentBreakpoint] = useState(getInitialBreakpoint);
  const targetCols = (currentBreakpoint === 'sm' || currentBreakpoint === 'xs' || currentBreakpoint === 'xxs') ? 2 : 4;
  const isMobile = targetCols === 2;

  const { layout, renderItems } = useMemo(() => {
    const layout = [];
    const renderItems = [];
    let currentY = 0;
    let currentRowType = null;
    let currentCapacity = 0; 
    let currentBlocksInRow = []; 
    let currentBlockItems = [];

    const numBlocks = targetCols / 2; // For 4 cols -> 2 blocks. For 2 cols -> 1 block.

    const pushCurrentBlock = () => {
      if (currentBlocksInRow.length === 0 && currentBlockItems.length === 0) return;
      
      if (currentBlockItems.length > 0) {
        currentBlocksInRow.push(currentBlockItems);
        currentBlockItems = [];
      }
      if (currentBlocksInRow.length === 0) return;

      if (currentRowType === 'wide') {
        let x = 0;
        currentBlocksInRow[0].forEach(item => {
          layout.push({ i: item.id, x, y: currentY, w: 1, h: 1 });
          renderItems.push({ isPlaceholder: false, product: item });
          x++;
        });
        for (; x < targetCols; x++) {
          const phId = `ph-wide-${currentY}-${x}`;
          layout.push({ i: phId, x, y: currentY, w: 1, h: 1, isDraggable: false, isResizable: false });
          renderItems.push({ isPlaceholder: true, id: phId });
        }
        currentY += 1;
      } else {
        for (let b = 0; b < numBlocks; b++) {
          const blockX = b * 2;
          if (b < currentBlocksInRow.length) {
            const blockItems = currentBlocksInRow[b];
            if (blockItems.length === 1 && blockItems[0].layoutSize === 'large') {
              layout.push({ i: blockItems[0].id, x: blockX, y: currentY, w: 2, h: 2 });
              renderItems.push({ isPlaceholder: false, product: blockItems[0] });
            } else {
              let bx = 0, by = 0;
              blockItems.forEach(item => {
                layout.push({ i: item.id, x: blockX + bx, y: currentY + by, w: 1, h: 1 });
                renderItems.push({ isPlaceholder: false, product: item });
                bx++;
                if (bx > 1) { bx = 0; by++; }
              });
              while (by < 2) {
                const phId = `ph-std-${currentY}-${blockX + bx}-${by}`;
                layout.push({ i: phId, x: blockX + bx, y: currentY + by, w: 1, h: 1, isDraggable: false, isResizable: false });
                renderItems.push({ isPlaceholder: true, id: phId });
                bx++;
                if (bx > 1) { bx = 0; by++; }
              }
            }
          } else {
            for (let bx = 0; bx < 2; bx++) {
              for (let by = 0; by < 2; by++) {
                const phId = `ph-std-${currentY}-${blockX + bx}-${by}`;
                layout.push({ i: phId, x: blockX + bx, y: currentY + by, w: 1, h: 1, isDraggable: false, isResizable: false });
                renderItems.push({ isPlaceholder: true, id: phId });
              }
            }
          }
        }
        currentY += 2;
      }

      currentRowType = null;
      currentCapacity = 0;
      currentBlocksInRow = [];
    };

    filteredProducts.forEach(product => {
      const productType = product.layoutSize === 'wide' ? 'wide' : 'standard';
      
      if (currentRowType !== null && currentRowType !== productType) {
        pushCurrentBlock();
      }
      
      currentRowType = productType;

      if (productType === 'wide') {
        if (currentCapacity + 1 > targetCols) {
           pushCurrentBlock();
           currentRowType = productType;
        }
        currentBlockItems.push(product);
        currentCapacity += 1;
      } else {
        const requiredCapacity = product.layoutSize === 'large' ? 4 : 1;
        if (requiredCapacity > (4 - currentCapacity) && currentBlockItems.length > 0) {
          currentBlocksInRow.push(currentBlockItems);
          currentBlockItems = [];
          currentCapacity = 0;
          if (currentBlocksInRow.length >= numBlocks) {
            pushCurrentBlock();
            currentRowType = productType;
          }
        }
        currentBlockItems.push(product);
        currentCapacity += requiredCapacity;
      }
    });

    if (currentBlockItems.length > 0 || currentBlocksInRow.length > 0) {
      pushCurrentBlock();
    }

    return { layout, renderItems };
  }, [filteredProducts, targetCols]);

  const [rowHeight, setRowHeight] = useState(380);

  // Track the actual layout generated by RGL (crucial for responsive breakpoints)
  const currentLayoutRef = useRef(layout);

  const handleLayoutChange = (newLayout) => {
    currentLayoutRef.current = newLayout;
  };

  const handleDragStop = (newRglLayout, oldItem, newItem, placeholder, e, element) => {
    const draggedId = newItem.i;
    const targetX = newItem.x;
    const targetY = newItem.y;

    // Use the actual responsive layout (which could be 2-cols on mobile) to find the target
    const currentLayout = currentLayoutRef.current || layout;

    // Find if the drop coordinate falls inside the bounding box of any existing item
    let dropTargetIndex = currentLayout.findIndex(item => 
      targetX >= item.x && targetX < item.x + item.w && 
      targetY >= item.y && targetY < item.y + item.h
    );
    const dropTarget = currentLayout[dropTargetIndex];

    // If dropped on an existing product, SWAP them!
    if (dropTarget && !dropTarget.i.startsWith('ph-')) {
       const targetId = dropTarget.i;
       if (targetId !== draggedId) {
          swapProducts(draggedId, targetId);
       }
       return;
    }

    // Otherwise, they dropped it into an empty placeholder slot (or out of bounds)
    // We proceed with the insertion and auto-conversion logic
    let targetSubsetIndex;
    if (dropTargetIndex === -1) {
       targetSubsetIndex = filteredProducts.length;
    } else {
       let productsBefore = 0;
       for (let i = 0; i < dropTargetIndex; i++) {
         if (!renderItems[i].isPlaceholder) {
           productsBefore++;
         }
       }
       targetSubsetIndex = productsBefore;
    }

    const currentSubsetIndex = filteredProducts.findIndex(p => p.id === draggedId);
    
    // Auto-conversion logic based on the drop target's row type in the NEW layout
    const newProductLayouts = newRglLayout.filter(item => !item.i.startsWith('ph-'));
    const rowMates = newProductLayouts.filter(item => item.y === targetY && item.i !== draggedId);
    let typeChanged = false;
    let newLayoutSize = null;

    if (rowMates.length > 0) {
      const mateId = rowMates[0].i;
      const mateProduct = filteredProducts.find(p => p.id === mateId);
      if (mateProduct) {
        const mateType = mateProduct.layoutSize === 'wide' ? 'wide' : 'standard';
        const draggedProduct = filteredProducts.find(p => p.id === draggedId);
        const draggedType = draggedProduct.layoutSize === 'wide' ? 'wide' : 'standard';
        
        if (mateType !== draggedType) {
           typeChanged = true;
           newLayoutSize = mateType === 'wide' ? 'wide' : 'small';
        }
      }
    }

    if (currentSubsetIndex !== targetSubsetIndex) {
      let targetGlobalIndex;
      if (targetSubsetIndex >= filteredProducts.length) {
         const prevId = filteredProducts[filteredProducts.length - 1].id;
         targetGlobalIndex = products.findIndex(p => p.id === prevId) + 1;
      } else {
         const nextId = filteredProducts[targetSubsetIndex].id;
         targetGlobalIndex = products.findIndex(p => p.id === nextId);
      }

      const currentGlobalIndex = products.findIndex(p => p.id === draggedId);
      let adjustedIndex = targetGlobalIndex;
      if (currentGlobalIndex < targetGlobalIndex) {
         adjustedIndex -= 1;
      }
      
      if (adjustedIndex !== currentGlobalIndex) {
         const updatedData = typeChanged ? { layoutSize: newLayoutSize, isLarge: false } : null;
         changeProductOrder(draggedId, adjustedIndex, updatedData);
      } else if (typeChanged) {
         updateProduct(draggedId, { layoutSize: newLayoutSize, isLarge: false });
      }
    } else if (typeChanged) {
      updateProduct(draggedId, { layoutSize: newLayoutSize, isLarge: false });
    }
  };

  // Derived counts for tabs
  const inStockCount = validProducts.filter(p => parseInt(p.stock || 0) > 0).length;
  const lowStockCount = validProducts.filter(p => parseInt(p.stock || 0) > 0 && parseInt(p.stock || 0) <= 5).length;
  const outOfStockCount = validProducts.filter(p => !p.stock || parseInt(p.stock || 0) === 0).length;

  const handleToggleSize = (product) => {
    const currentSize = product.layoutSize || (product.isLarge ? 'large' : 'small');
    const sizes = ['small', 'large', 'wide'];
    const nextSize = sizes[(sizes.indexOf(currentSize) + 1) % sizes.length];
    updateProduct(product.id, { 
      layoutSize: nextSize, 
      isLarge: nextSize === 'large' // Keep for backwards compatibility with older components
    });
  };

  const inputStyle = {
    width: '100%', 
    padding: '10px 14px', 
    border: '1px solid #e5e7eb', 
    borderRadius: '10px', 
    fontSize: '13px', 
    background: '#f9fafb', 
    color: '#111', 
    outline: 'none'
  };

  const labelStyle = { 
    display: 'block', 
    marginBottom: '6px', 
    fontSize: '11px', 
    color: '#888', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em' 
  };

  const frameColors = ['Black', 'Silver', 'Brown', 'Clear', 'White', 'Gold', 'Tortoise'].map(c => ({ label: c, value: c }));
  const lensColors = ['Black', 'Gray', 'Brown', 'Green', 'Blue', 'Clear', 'Pink'].map(c => ({ label: c, value: c }));
  const shapes = ['Square', 'Oval', 'Round', 'Cat-eye', 'Aviator'].map(c => ({ label: c, value: c }));
  const materials = ['Acetate', 'Metal', 'Mixed', 'Nylon'].map(c => ({ label: c, value: c }));
  const genders = ['Men', 'Women', 'Unisex', 'Kids'].map(c => ({ label: c, value: c }));
  const polarizeOptions = [{label: 'Yes', value: 'Yes'}, {label: 'No', value: 'No'}];
  const highlightOptions = [{label: 'New Arrival', value: 'New Arrival'}, {label: 'Best Seller', value: 'Best Seller'}];
  const brandOptions = (brands || []).map(b => ({ label: b?.name || '', value: b?.slug || '' }));


  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      
      
      {/* STICKY HEADER WRAPPER */}
      <div style={{ position: 'sticky', top: isMobile ? '-24px' : '-40px', paddingTop: isMobile ? '12px' : '20px', background: 'rgba(249, 250, 251, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', zIndex: 10, margin: isMobile ? '-24px -12px 12px -16px' : '-40px -12px 16px -20px', paddingLeft: isMobile ? '16px' : '20px', paddingRight: '12px' }}>
{/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? '16px' : '24px', gap: isMobile ? '12px' : '24px', width: '100%' }}>
        
        {/* Full-width Centered Search */}
        <div style={{ flex: 1, maxWidth: '800px', position: 'relative' }}>
          <Search size={18} color="#888" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: isMobile ? '10px 16px 10px 42px' : '14px 20px 14px 48px', border: 'none', borderRadius: '100px', fontSize: isMobile ? '14px' : '15px', outline: 'none', background: '#F3F4F6', color: '#111' }}
          />
        </div>

        <button className={styles.btnPrimary} onClick={() => {
          if (isAdding) resetForm();
          else {
            setIsAdding(true);
            setModalStep(1);
          }
        }} style={{ flexShrink: 0 }}>
          {isAdding ? <X size={14} style={{ marginRight: isMobile ? '0' : '6px' }} /> : <Plus size={14} style={{ marginRight: isMobile ? '0' : '6px' }} />}
          {!isMobile && (isAdding ? 'Close Panel' : 'New Product')}
        </button>
      </div>

      
      
      
      {/* Main Categories Row */}
      <div className={isMobile ? styles.hideScrollbar : ''} style={{ display: 'flex', alignItems: 'center', marginBottom: isMobile ? '12px' : '16px', flexWrap: isMobile ? 'nowrap' : 'wrap', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '4px' : '0' }}>
        <div style={{ display: 'flex', background: '#F3F4F6', padding: '4px', borderRadius: '100px', gap: '4px', whiteSpace: 'nowrap' }}>
          <button
            onClick={() => { setActiveMainCategory('All'); setActiveSubCategory('All'); }}
            style={{
              padding: isMobile ? '6px 14px' : '8px 20px',
              border: 'none',
              borderRadius: '100px',
              background: activeMainCategory === 'All' ? '#fff' : 'transparent',
              color: activeMainCategory === 'All' ? '#111' : '#666',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: activeMainCategory === 'All' ? 600 : 500,
              boxShadow: activeMainCategory === 'All' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            All Categories
          </button>
          {Object.keys(categories).map(cat => (
            <button 
              key={cat}
              onClick={() => { setActiveMainCategory(cat); setActiveSubCategory('All'); }}
              style={{
                padding: isMobile ? '6px 14px' : '8px 20px',
                border: 'none',
                borderRadius: '100px',
                background: activeMainCategory === cat ? '#fff' : 'transparent',
                color: activeMainCategory === cat ? '#111' : '#666',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: activeMainCategory === cat ? 600 : 500,
                boxShadow: activeMainCategory === cat ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <button 
          onClick={() => {
             setCategoryInput('');
             setCategoryModal({ isOpen: true, type: 'main', action: 'add', oldName: '', mainName: '' });
          }}
          style={{
            padding: '8px',
            border: 'none',
            borderRadius: '50%',
            background: 'transparent',
            color: '#888',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto'
          }}
          title="Manage Categories"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Sub Categories Row */}
      <div className={isMobile ? styles.hideScrollbar : ''} style={{ display: 'flex', gap: isMobile ? '16px' : '24px', marginBottom: isMobile ? '8px' : '16px', alignItems: 'center', flexWrap: isMobile ? 'nowrap' : 'wrap', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '4px' : '0' }}>
        <button
          onClick={() => setActiveSubCategory('All')}
          style={{
            padding: isMobile ? '0 0 8px 0' : '0 0 12px 0',
            border: 'none',
            background: 'transparent',
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: activeSubCategory === 'All' ? 600 : 500,
            color: activeSubCategory === 'All' ? '#111' : '#888',
            borderBottom: activeSubCategory === 'All' ? '2px solid #111' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          All
          <span style={{ 
            background: activeSubCategory === 'All' ? '#f3f4f6' : 'transparent',
            padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600
          }}>
            {activeMainCategory === 'All' 
              ? validProducts.length 
              : validProducts.filter(p => p.mainCategory === activeMainCategory).length}
          </span>
        </button>
        
        {activeMainCategory !== 'All' && categories[activeMainCategory] && categories[activeMainCategory].map(sub => (
          <button
            key={sub}
            onClick={() => setActiveSubCategory(sub)}
            style={{
              padding: isMobile ? '0 0 8px 0' : '0 0 12px 0',
              border: 'none',
              background: 'transparent',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: activeSubCategory === sub ? 600 : 500,
              color: activeSubCategory === sub ? '#111' : '#888',
              borderBottom: activeSubCategory === sub ? '2px solid #111' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {sub}
            <span style={{ 
              background: activeSubCategory === sub ? '#f3f4f6' : 'transparent',
              padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600
            }}>
              {validProducts.filter(p => p.mainCategory === activeMainCategory && p.subCategory === sub).length}
            </span>
          </button>
        ))}

        {activeMainCategory !== 'All' && (
          <button 
            onClick={() => {
              setCategoryInput('');
              setCategoryModal({ isOpen: true, type: 'sub', action: 'add', oldName: '', mainName: activeMainCategory });
            }}
            style={{
              padding: '0 0 12px 0',
              border: 'none',
              background: 'transparent',
              color: '#888',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Manage Subcategories"
          >
            <Settings size={14} />
          </button>
        )}
        
        <div style={{ flexGrow: 1 }}></div>
        {/* Keep Sorting */}
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ marginBottom: '12px', padding: '8px 16px', border: 'none', borderRadius: '100px', fontSize: '13px', outline: 'none', background: '#F3F4F6', color: '#111', cursor: 'pointer', fontWeight: 500 }}
        >
          <option value="Newest">Sort: Newest</option>
          <option value="Oldest">Sort: Oldest</option>
          <option value="Name A-Z">Sort: Name A-Z</option>
          <option value="Name Z-A">Sort: Name Z-A</option>
        </select>
      </div>
      
      {/* CATEGORY MODAL */}
      {categoryModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '400px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
              {categoryModal.action === 'add' ? 'Add' : 'Edit'} {categoryModal.type === 'main' ? 'Category' : 'Subcategory'}
            </h3>
            <input 
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="e.g. Vintage Collections"
              autoFocus
              style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '24px', outline: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setCategoryModal({ isOpen: false, type: '', action: '', oldName: '', mainName: '' })}
                style={{ padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 500 }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!categoryInput.trim()) return;
                  if (categoryModal.type === 'main') {
                    addCategory(categoryInput.trim());
                  } else {
                    addSubCategory(categoryModal.mainName, categoryInput.trim());
                  }
                  setCategoryModal({ isOpen: false, type: '', action: '', oldName: '', mainName: '' });
                }}
                className={styles.btnPrimary}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

            </div>

      {/* WYSIWYG Product Grid */}
      <div className={styles.productGridContainer} style={{ minHeight: '400px' }}>
        {filteredProducts.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888' }}>
            <Package size={48} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#111', fontWeight: 500 }}>No products found</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 2 }}
            onBreakpointChange={(newBreakpoint) => setCurrentBreakpoint(newBreakpoint)}
            rowHeight={rowHeight}
            containerPadding={[0, 0]}
            margin={[12, 12]}
            compactType="vertical"
            allowOverlap={true}
            onLayoutChange={handleLayoutChange}
            onDragStop={handleDragStop}
            onWidthChange={(containerWidth, margin, cols, containerPadding) => {
              const pad = containerPadding ? (containerPadding[0] * 2) : 0;
              const colW = (containerWidth - (margin[0] * (cols - 1)) - pad) / cols;
              const newRowHeight = (colW * (4/3)) + 70; // 3:4 aspect ratio + 70px for the text block
              setRowHeight(newRowHeight);
            }}
            isResizable={false}
          >
            {renderItems.map((item) => {
              if (item.isPlaceholder) {
                return (
                  <div key={item.id} style={{ pointerEvents: 'none' }}></div>
                );
              }
              const product = item.product;
              const layoutSize = product.layoutSize || (product.isLarge ? 'large' : 'small');
              const isLarge = layoutSize === 'large';
              
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
                      
                      {/* Editor Controls Overlay */}
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', zIndex: 10 }}>
                        <button onClick={() => handleToggleSize(product)} style={{ background: layoutSize === 'wide' ? '#10b981' : (isLarge ? '#007aff' : '#111'), color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}>
                          {layoutSize === 'wide' ? '1x4' : (isLarge ? '2x2 (Large)' : '1x1 (Small)')}
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'rgb(30, 30, 30)', lineHeight: '1.2' }}>{product.name}</h4>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#888', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                          {product.price}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px' }}>
                        <button onClick={() => handleEdit(product)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#666', padding: '0', fontSize: '11px', fontWeight: 500, textDecoration: 'underline' }}>
                          Edit
                        </button>
                        <button onClick={() => deleteProduct(product.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '0', fontSize: '11px', fontWeight: 500, textDecoration: 'underline' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ResponsiveGridLayout>
        )}
      </div>

      {cropImageSrc && (
        <ImageCropper 
          imageSrc={cropImageSrc} 
          onCropComplete={(croppedBase64) => {
            setFormData(prev => ({ 
              ...prev, 
              images: [...prev.images, croppedBase64] 
            }));
            setCropImageSrc(null);
          }}
          onCancel={() => setCropImageSrc(null)}
        />
      )}
    

{isAdding && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
          <div className={styles.card} style={{ background: '#fff', padding: '40px', width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111' }}>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {formError && <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: 500, background: '#fee2e2', padding: '6px 12px', borderRadius: '100px' }}>{formError}</span>}
                <button onClick={resetForm} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', transition: 'background 0.2s' }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Step 1: Category Selection */}
            {modalStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '24px 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>What are you creating?</h2>
                  <p style={{ color: '#666', fontSize: '14px' }}>Select a category to customize your product details</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', width: '100%', maxWidth: '800px' }}>
                  {Object.keys(categories).map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => { handleChange('mainCategory', cat); setModalStep(2); }} 
                      style={{ padding: '24px', border: '1px solid #e5e7eb', borderRadius: '16px', background: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }} 
                      onMouseOver={(e) => e.currentTarget.style.borderColor = '#111'} 
                      onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    >
                       <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                         {cat === 'Bags' ? <Package size={24} /> : cat === 'Shoes' ? <Hexagon size={24} /> : cat === 'Lenses' ? <Eye size={24} /> : cat === 'Bespoke' ? <PanelTop size={24} /> : <Tag size={24} />}
                       </div>
                       <span style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Image Upload & Crop */}
            {modalStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666', fontSize: '13px', fontWeight: 500 }}>
                   <button onClick={() => setModalStep(1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', gap: '4px' }}>← Back</button>
                   <span>/ Step 2: Product Images</span>
                </div>
                <div style={{ flex: 1, minHeight: '300px', border: '1px dashed #bbb', borderRadius: '16px', display: 'flex', flexDirection: 'column', color: '#666', background: '#f9fafb', position: 'relative', overflow: 'hidden', padding: '24px' }}>
                  {formData.images.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', width: '100%' }}>
                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', background: '#fff', border: formData.primaryImageIndex === idx ? '2px solid #111' : '1px solid #e5e7eb' }}>
                          <img src={imgUrl} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          <button type="button" onClick={() => handleChange('primaryImageIndex', idx)} style={{ position: 'absolute', top: '8px', left: '8px', background: formData.primaryImageIndex === idx ? '#111' : 'rgba(255,255,255,0.9)', color: formData.primaryImageIndex === idx ? '#fff' : '#ccc', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }} title="Set as Primary Image"><span style={{ fontSize: '14px' }}>★</span></button>
                          <button type="button" onClick={() => { const newImages = formData.images.filter((_, i) => i !== idx); const newPrimary = formData.primaryImageIndex === idx ? 0 : (formData.primaryImageIndex > idx ? formData.primaryImageIndex - 1 : formData.primaryImageIndex); setFormData(prev => ({ ...prev, images: newImages, primaryImageIndex: newPrimary })); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}><X size={14} /></button>
                        </div>
                      ))}
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff' }}>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 2 }} />
                        <Plus size={32} color="#999" />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', minHeight: '250px' }}>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 2 }} />
                      <UploadCloud size={48} style={{ marginBottom: '16px', color: '#888' }} />
                      <span style={{ fontSize: '15px', fontWeight: 500, color: '#444' }}>Click or Drop images here</span>
                      <span style={{ fontSize: '13px', opacity: 0.7, marginTop: '8px' }}>High quality images will be cropped and optimized to WebP</span>
                    </div>
                  )}
                </div>
                {imageWarning && (
                  <div style={{ padding: '12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', color: '#d97706', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} />{imageWarning}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button onClick={() => setModalStep(3)} className={styles.btnPrimary} disabled={formData.images.length === 0} style={{ padding: '12px 32px', fontSize: '14px', opacity: formData.images.length === 0 ? 0.5 : 1 }}>Next Step →</button>
                </div>
              </div>
            )}

            {/* Step 3: Product Details & Publish */}
            {modalStep === 3 && (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666', fontSize: '13px', fontWeight: 500 }}>
                   <button type="button" onClick={() => setModalStep(2)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', gap: '4px' }}>← Back</button>
                   <span>/ Step 3: Details for {formData.mainCategory}</span>
                </div>
                
                {/* Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={labelStyle}>Product Name *</label><input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle} placeholder="e.g. Aden 02" /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div><label style={labelStyle}>Price (฿) *</label><input type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} style={inputStyle} placeholder="e.g. 15900" /></div>
                      <div><label style={labelStyle}>SKU</label><input type="text" value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} style={inputStyle} placeholder="e.g. AD-02-BLK" /></div>
                    </div>
                    <div><label style={labelStyle}>Stock Quantity</label><input type="number" value={formData.stock} onChange={(e) => handleChange('stock', e.target.value)} style={inputStyle} placeholder="e.g. 15" /></div>
                    <div><label style={labelStyle}>Product Story / Description</label><textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Describe the inspiration, fit, and feel..." /></div>
                  </div>
                  
                  {/* Dynamic Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      {formData.mainCategory && categories[formData.mainCategory] && (
                        <PillSelector label="Sub Category" options={categories[formData.mainCategory].map(c => ({ value: c, label: c }))} selectedValue={formData.subCategory} onChange={(val) => handleChange('subCategory', val)} />
                      )}
                      <PillSelector label="Brand" options={brandOptions} selectedValue={formData.brandId} onChange={(val) => handleChange('brandId', val)} />
                    </div>
                    
                    {(formData.mainCategory === 'Lenses' || formData.mainCategory === 'Bespoke') && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <PillSelector label="Frame Color" options={frameColors} selectedValue={formData.frameColor} onChange={(val) => handleChange('frameColor', val)} />
                          <PillSelector label="Lens Color" options={lensColors} selectedValue={formData.lensColor} onChange={(val) => handleChange('lensColor', val)} />
                          <PillSelector label="Shape" options={shapes} selectedValue={formData.shape} onChange={(val) => handleChange('shape', val)} />
                          <PillSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                        </div>
                        <div>
                          <label style={labelStyle}>Dimensions (mm)</label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <input type="number" value={formData.sizeLens} onChange={(e) => handleChange('sizeLens', e.target.value)} style={inputStyle} placeholder="Lens (e.g. 52)" />
                            <input type="number" value={formData.sizeBridge} onChange={(e) => handleChange('sizeBridge', e.target.value)} style={inputStyle} placeholder="Bridge (e.g. 20)" />
                            <input type="number" value={formData.sizeTemple} onChange={(e) => handleChange('sizeTemple', e.target.value)} style={inputStyle} placeholder="Temple (e.g. 145)" />
                          </div>
                        </div>
                      </>
                    )}

                    {(formData.mainCategory === 'Shoes' || formData.mainCategory === 'Ready-to-Wear') && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <PillSelector label="Gender" options={genders} selectedValue={formData.gender} onChange={(val) => handleChange('gender', val)} />
                        <PillSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                      </div>
                    )}
                    
                    <MultiPillSelector label="Collection Highlight" options={highlightOptions} selectedValues={formData.highlight} onChange={(val) => handleChange('highlight', val)} />
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.05)', margin: '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={resetForm} style={{ padding: '12px 24px', fontSize: '14px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '100px', cursor: 'pointer', fontWeight: 500, color: '#666' }}>Cancel</button>
                  <button type="submit" className={styles.btnPrimary} style={{ padding: '12px 32px', fontSize: '14px' }}>{editingId ? 'Update Product' : 'Publish Product'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
</div>
  );
};

export default ManageProductsPage;
