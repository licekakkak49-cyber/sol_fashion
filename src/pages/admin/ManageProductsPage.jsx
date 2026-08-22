import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);
import { useAdmin } from '../../context/AdminContext';
import { Plus, X, UploadCloud, Search, Filter, Package, Edit2, Trash2, AlertTriangle, ArrowLeft, Briefcase, Shirt, Glasses, Watch, Activity, Settings, Hexagon, Eye, PanelTop, Tag, LayoutGrid, AlignJustify, SlidersHorizontal } from 'lucide-react';
import styles from './AdminLayout.module.css';
import ImageCropper from '../../components/ImageCropper';
import SetsManager from './components/SetsManager';
import ProductEditorDrawer from './components/ProductEditorDrawer';
import { supabase } from '../../utils/supabaseClient';
import InventoryList from './components/InventoryList';

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


const DropdownSelector = ({ label, options, selectedValue, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <select
      value={selectedValue || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '13px',
        background: '#f9fafb',
        color: selectedValue ? '#111' : '#888',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '16px'
      }}
    >
      <option value="" disabled>Select {label}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
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
  const { 
    brands, 
    changeProductOrder, 
    swapProducts, 
    categories, 
    addCategory, 
    addSubCategory, 
    editCategory, 
    editSubCategory 
  } = useAdmin();

  const [products, setProducts] = useState([]);
  const [sets, setSets] = useState([]);
  
  const fetchData = async () => {
    try {
      const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      const { data: sData } = await supabase.from('sets').select('*').order('created_at', { ascending: false });
      
      const mappedProducts = (pData || []).map(p => ({
        ...p,
        mainCategory: p.main_category,
        subCategory: p.sub_category,
        coverImage: p.cover_image_url,
        hoverImage: p.hover_image_url,
        galleryImages: p.gallery_images_urls,
        layoutSize: p.layout_size,
        heelHeight: p.heel_height,
        image: p.cover_image_url
      }));
      
      setProducts(mappedProducts);
      setSets((sData || []).map(s => ({
        ...s,
        mainCategory: s.main_category,
        subCategory: s.sub_category,
        scheduledDate: s.scheduled_date
      })));
    } catch(e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const addSet = async (newSet) => {
    const dbPayload = {
      id: Date.now().toString(),
      name: newSet.name,
      status: newSet.status,
      items: newSet.items,
      main_category: newSet.mainCategory,
      sub_category: newSet.subCategory
    };
    
    // Optimistic Update
    setSets(prev => [{
      ...newSet, 
      id: dbPayload.id,
      mainCategory: newSet.mainCategory,
      subCategory: newSet.subCategory
    }, ...prev]);

    const { error } = await supabase.from('sets').insert([dbPayload]);
    if (error) {
      console.error('Error adding set:', error);
      alert('Failed to create set: ' + error.message);
      fetchData(); // Rollback
    }
  };

  const updateSet = async (setId, updatedData) => {
    // Optimistic UI update
    setSets(prev => prev.map(s => s.id === setId ? { ...s, ...updatedData } : s));
    
    const dbUpdate = { ...updatedData };
    if (updatedData.mainCategory !== undefined) { dbUpdate.main_category = updatedData.mainCategory; delete dbUpdate.mainCategory; }
    if (updatedData.subCategory !== undefined) { dbUpdate.sub_category = updatedData.subCategory; delete dbUpdate.subCategory; }
    
    // Background DB update
    const { error } = await supabase.from('sets').update(dbUpdate).eq('id', setId);
    if (error) {
      console.error("Update set error:", error);
      fetchData(); // Rollback if error
    }
  };

  const deleteSet = async (setId) => {
    await supabase.from('sets').delete().eq('id', setId);
    fetchData();
  };

  const removeProductFromSet = async (setId, productId) => {
    const draftId = `draft-${Date.now()}-${Math.random()}`;
    // 1. Optimistic UI update
    setSets(prev => prev.map(s => {
      if (s.id !== setId) return s;
      const newItems = s.items.map(item => 
        item.productId === productId ? { productId: draftId, layoutSize: item.layoutSize, isHidden: true } : item
      );
      
      // 2. Background DB update
      supabase.from('sets').update({ items: newItems }).eq('id', setId).then(({ error }) => {
        if (error) {
          console.error("removeProductFromSet error:", error);
          fetchData(); // Rollback
        }
      });
      
      return { ...s, items: newItems };
    }));
  };

  const updateProductInSet = async (setId, productId, updatedData) => {
    // 1. Optimistic UI update
    setSets(prev => prev.map(s => {
      if (s.id !== setId) return s;
      const newItems = s.items.map(item => item.productId === productId ? { ...item, ...updatedData } : item);
      
      // 2. Background DB update
      supabase.from('sets').update({ items: newItems }).eq('id', setId).then(({ error }) => {
        if (error) {
          console.error("updateProductInSet error:", error);
          fetchData(); // Rollback
        }
      });
      
      return { ...s, items: newItems };
    }));
  };

  const changeProductOrderInSet = async (setId, productId, newIndex, updatedData = null) => {
    // 1. Optimistic UI update
    setSets(prev => prev.map(s => {
      if (s.id !== setId) return s;
      const currentIndex = s.items.findIndex(i => i.productId === productId);
      if (currentIndex === -1) return s;
      const newItems = [...s.items];
      const [movedItem] = newItems.splice(currentIndex, 1);
      const itemToInsert = updatedData ? { ...movedItem, ...updatedData } : movedItem;
      newItems.splice(newIndex, 0, itemToInsert);
      
      // 2. Background DB update
      supabase.from('sets').update({ items: newItems }).eq('id', setId).then(({ error }) => {
        if (error) {
          console.error("changeProductOrderInSet error:", error);
          fetchData(); // Rollback
        }
      });
      
      return { ...s, items: newItems };
    }));
  };
  
  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    fetchData();
  };

  
  // Filtering and Search State
  
    
  const handleCreateSet = () => {
    if (!newSetName.trim()) return;
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

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainCategory, setActiveMainCategory] = useState('Bags');
  const [activeSubCategory, setActiveSubCategory] = useState('Tote Bags');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // List Mode Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [listFilters, setListFilters] = useState({
    categories: [],
    stockLevels: [], // 'out_of_stock', 'low_stock', 'in_stock'
    statuses: [], // 'active', 'draft'
    sets: []
  });

  const toggleListFilter = (type, value) => {
    setListFilters(prev => {
      const current = prev[type];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  const removeListFilter = (type, value) => {
    setListFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(v => v !== value)
    }));
  };
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'In Stock', 'Low Stock', 'Out of Stock'
  
  // Category Modal State
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, type: '', action: '', oldName: '', mainName: '' });
  const [categoryInput, setCategoryInput] = useState('');

  const [filterBrand, setFilterBrand] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterHighlight, setFilterHighlight] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  const [isAdding, setIsAdding] = useState(false);
  
  const [editorConfig, setEditorConfig] = useState({ isOpen: false, initialData: null, targetSetId: null });

  const handleAddNew = () => {
    setEditorConfig({
      isOpen: true,
      initialData: { mainCategory: activeMainCategory !== 'All' ? activeMainCategory : '', subCategory: activeSubCategory !== 'All' ? activeSubCategory : '' },
      targetSetId: null
    });
  };

  const handleEdit = (product, setId = null) => {
    setEditorConfig({
      isOpen: true,
      initialData: product,
      targetSetId: setId
    });
  };

  const handleSaveProduct = async (payload) => {
    const isPlaceholder = payload.id && payload.id.startsWith('draft-');
    
    const dbPayload = {
      name: payload.name,
      price: payload.price,
      main_category: payload.mainCategory,
      sub_category: payload.subCategory,
      cover_image_url: payload.coverImage,
      hover_image_url: payload.hoverImage,
      gallery_images_urls: payload.galleryImages,
      description: payload.description,
      status: payload.status,
      layout_size: payload.layoutSize,
      stock: payload.stock,
      size: payload.size,
      fit: payload.fit,
      hardware: payload.hardware,
      heel_height: payload.heelHeight
    };
    
    try {
      if (isPlaceholder || !payload.id) {
        // Insert new product
        dbPayload.id = Date.now().toString();
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([dbPayload])
          .select()
          .single();
          
        if (error) throw error;
        
        // If it was a placeholder in a set, update the set's JSON
        if (editorConfig.targetSetId && isPlaceholder) {
          // We need to fetch the set, update the items JSON, and save back
          const { data: set } = await supabase.from('sets').select('*').eq('id', editorConfig.targetSetId).single();
          if (set) {
            const newItems = set.items.map(item => 
              item.productId === payload.id ? { ...item, productId: newProduct.id, isHidden: false } : item
            );
            await supabase.from('sets').update({ items: newItems }).eq('id', set.id);
          }
        }
      } else {
        // Update existing
        const { error } = await supabase
          .from('products')
          .update(dbPayload)
          .eq('id', payload.id);
          
        if (error) throw error;
      }
      
      // We should ideally fetch the fresh data here or let real-time handle it.
      // For now, we will call a refresh function if we build one, or just let the user know.
      console.log('Saved to Supabase successfully!');
      fetchData();
      // Temporary hack: fallback to old context to keep UI updated until we refactor the fetch query
      // (This will be removed in the next step when we fetch from Supabase)
    } catch (e) {
      console.error('Supabase Error:', e);
      alert('Error saving to database. Check console.');
    }
  };

  const validProducts = Array.isArray(products) ? products.filter(Boolean) : [];

  // Filter Logic
  const filteredProducts = useMemo(() => {
    if (!validProducts.length) return [];
    
    const filtered = validProducts.filter(p => {
      // 1. Search Query (Applies to both modes)
      if (searchQuery) {
        const query = String(searchQuery || '').toLowerCase();
        const safeName = String(p.name || '');
        const safeSku = String(p.sku || '');
        
        const matchName = safeName.toLowerCase().includes(query);
        const matchSku = safeSku.toLowerCase().includes(query);
        if (!matchName && !matchSku) return false;
      }

      const stockNum = parseInt(p.stock) || 0;

      if (viewMode === 'grid') {
        // --- GRID MODE LOGIC ---
        // Tab Filter
        if (activeTab === 'In Stock' && stockNum === 0) return false;
        if (activeTab === 'Low Stock' && (stockNum === 0 || stockNum > 5)) return false;
        if (activeTab === 'Out of Stock' && stockNum > 0) return false;
        
        // Category Filters
        if (activeMainCategory !== 'All' && p.mainCategory !== activeMainCategory) return false;
        if (activeSubCategory !== 'All' && p.subCategory !== activeSubCategory) return false;

        // Dropdown Filters
        if (filterBrand !== 'All' && p.brandId !== filterBrand) return false;
        const pGender = p.gender || 'Unisex';
        if (filterGender !== 'All' && pGender !== filterGender) return false;
        
        const pHighlight = Array.isArray(p.highlight) ? p.highlight : (p.highlight && p.highlight !== 'None' ? [p.highlight] : []);
        if (filterHighlight !== 'All' && !pHighlight.includes(filterHighlight)) return false;
      } else {
        // --- LIST MODE LOGIC (Faceted Filters) ---
        // Categories
        if (listFilters.categories.length > 0) {
          if (!listFilters.categories.includes(p.mainCategory)) return false;
        }
        
        // Stock Levels
        if (listFilters.stockLevels.length > 0) {
          const isOOS = stockNum === 0;
          const isLow = stockNum > 0 && stockNum < 10;
          const isInStock = stockNum >= 10;
          
          let matchesStock = false;
          if (listFilters.stockLevels.includes('out_of_stock') && isOOS) matchesStock = true;
          if (listFilters.stockLevels.includes('low_stock') && isLow) matchesStock = true;
          if (listFilters.stockLevels.includes('in_stock') && isInStock) matchesStock = true;
          
          if (!matchesStock) return false;
        }
        
        // Statuses
        if (listFilters.statuses.length > 0) {
          const pStatus = p.status || 'draft';
          if (!listFilters.statuses.includes(pStatus)) return false;
        }

        // Sets
        if (listFilters.sets && listFilters.sets.length > 0) {
          const isInSet = sets.some(s => listFilters.sets.includes(s.id) && s.items.some(i => i.productId === p.id));
          if (!isInSet) return false;
        }
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

  const rtwSizes = ['XS', 'S', 'M', 'L', 'XL'].map(c => ({ label: c, value: c }));
  const rtwFits = ['Oversized', 'Slim Fit', 'Relaxed', 'Cropped'].map(c => ({ label: c, value: c }));
  const bagHardware = ['Gold-tone', 'Silver-tone', 'Matte Black'].map(c => ({ label: c, value: c }));
  const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42'].map(c => ({ label: c, value: c }));
  const heelHeights = ['Flat', '55mm', '85mm', '100mm'].map(c => ({ label: c, value: c }));
  const accSizes = ['One Size', 'S', 'M', 'L'].map(c => ({ label: c, value: c }));
  const materials = ['Cotton', 'Silk', 'Leather', 'Calfskin', 'Suede', 'Canvas', 'Nylon'].map(c => ({ label: c, value: c }));
  const highlightOptions = [{label: 'New Arrival', value: 'New Arrival'}, {label: 'Best Seller', value: 'Best Seller'}];
  const brandOptions = (brands || []).map(b => ({ label: b?.name || '', value: b?.slug || '' }));


  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      
      
      {/* STICKY HEADER WRAPPER */}
      <div style={{ position: 'sticky', top: isMobile ? '-24px' : '-40px', paddingTop: isMobile ? '12px' : '20px', background: 'rgba(249, 250, 251, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', zIndex: 10, margin: isMobile ? '-24px -12px 12px -16px' : '-40px -12px 16px -20px', paddingLeft: isMobile ? '16px' : '20px', paddingRight: '12px' }}>
{/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? '16px' : '24px', gap: isMobile ? '12px' : '24px', width: '100%', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        
        {/* Full-width Centered Search */}
        <div style={{ flex: 1, maxWidth: '800px', position: 'relative', width: isMobile ? '100%' : 'auto' }}>
          <Search size={18} color="#888" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: isMobile ? '10px 16px 10px 42px' : '14px 20px 14px 48px', 
              paddingRight: viewMode === 'list' ? '48px' : '20px', 
              border: 'none', 
              borderRadius: '100px', 
              fontSize: isMobile ? '14px' : '15px', 
              outline: 'none', 
              background: '#F3F4F6', 
              color: '#111',
              transition: 'padding 0.2s'
            }}
          />
          {viewMode === 'list' && (
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               style={{ 
                 position: 'absolute', 
                 right: '8px', 
                 top: '50%', 
                 transform: 'translateY(-50%)',
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center',
                 width: '32px',
                 height: '32px',
                 borderRadius: '50%', 
                 border: 'none', 
                 background: isFilterOpen ? '#e5e7eb' : 'transparent', 
                 color: isFilterOpen ? '#111' : '#6b7280', 
                 cursor: 'pointer', 
                 transition: 'all 0.2s'
               }}
               title="Toggle Filters"
             >
               <SlidersHorizontal size={18} />
             </button>
          )}
        </div>
        
        {/* View Mode Toggle */}

        <div style={{ display: 'flex', background: '#F3F4F6', padding: '4px', borderRadius: '100px', gap: '4px' }}>
          <button 
            onClick={() => setViewMode('grid')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: isMobile ? '8px 12px' : '10px 16px', border: 'none', borderRadius: '100px', cursor: 'pointer',
              background: viewMode === 'grid' ? '#fff' : 'transparent',
              color: viewMode === 'grid' ? '#111' : '#6b7280',
              fontWeight: viewMode === 'grid' ? 600 : 500,
              fontSize: '13px',
              boxShadow: viewMode === 'grid' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <LayoutGrid size={16} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>Layout</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: isMobile ? '8px 12px' : '10px 16px', border: 'none', borderRadius: '100px', cursor: 'pointer',
              background: viewMode === 'list' ? '#fff' : 'transparent',
              color: viewMode === 'list' ? '#111' : '#6b7280',
              fontWeight: viewMode === 'list' ? 600 : 500,
              fontSize: '13px',
              boxShadow: viewMode === 'list' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <AlignJustify size={16} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>List</span>
          </button>

        </div>

      </div>

      
      
      
            {/* Main Categories Row */}
      <div className={isMobile ? styles.hideScrollbar : ''} style={{ display: viewMode === 'list' ? 'none' : 'flex', alignItems: 'center', marginBottom: isMobile ? '12px' : '16px', flexWrap: isMobile ? 'nowrap' : 'wrap', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '4px' : '0' }}>
        <div style={{ display: 'flex', background: '#F3F4F6', padding: '4px', borderRadius: '100px', gap: '4px', whiteSpace: 'nowrap' }}>
          {Object.keys(categories).map(cat => (
            <button 
              key={cat}
              onClick={() => { setActiveMainCategory(cat); setActiveSubCategory(categories[cat]?.[0] || ''); }}
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
      <div className={isMobile ? styles.hideScrollbar : ''} style={{ display: viewMode === 'list' ? 'none' : 'flex', gap: isMobile ? '16px' : '24px', marginBottom: isMobile ? '8px' : '16px', alignItems: 'center', flexWrap: isMobile ? 'nowrap' : 'wrap', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '4px' : '0' }}>
        
        
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
            {/* MEGA FILTER PANEL */}
      {viewMode === 'list' && isFilterOpen && (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '16px', position: 'relative' }}>
          
          <button 
            onClick={() => setIsFilterOpen(false)}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <X size={20} />
          </button>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
            
            {/* Column 1: Category */}
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Categories</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {Object.keys(categories).map(cat => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                    <input 
                      type="checkbox" 
                      checked={listFilters.categories.includes(cat)} 
                      onChange={() => toggleListFilter('categories', cat)} 
                      style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }}
                    /> 
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Column 2: Stock Level */}
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Stock Level</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                  <input type="checkbox" checked={listFilters.stockLevels.includes('in_stock')} onChange={() => toggleListFilter('stockLevels', 'in_stock')} style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }} /> In Stock
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                  <input type="checkbox" checked={listFilters.stockLevels.includes('low_stock')} onChange={() => toggleListFilter('stockLevels', 'low_stock')} style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }} /> Low Stock (&lt; 10)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                  <input type="checkbox" checked={listFilters.stockLevels.includes('out_of_stock')} onChange={() => toggleListFilter('stockLevels', 'out_of_stock')} style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }} /> Out of Stock
                </label>
              </div>
            </div>

            {/* Column 3: Status */}
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                  <input type="checkbox" checked={listFilters.statuses.includes('active')} onChange={() => toggleListFilter('statuses', 'active')} style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }} /> Active
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                  <input type="checkbox" checked={listFilters.statuses.includes('draft')} onChange={() => toggleListFilter('statuses', 'draft')} style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }} /> Draft
                </label>
              </div>
            </div>

            {/* Column 4: Look Sets */}
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Look Sets</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                {sets.length === 0 && <span style={{ fontSize: '14px', color: '#888' }}>No sets available</span>}
                {sets.map(s => (
                  <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', color: '#4b5563' }}>
                    <input 
                      type="checkbox" 
                      checked={listFilters.sets && listFilters.sets.includes(s.id)} 
                      onChange={() => toggleListFilter('sets', s.id)} 
                      style={{ accentColor: '#111', width: '16px', height: '16px', cursor: 'pointer' }}
                    /> 
                    {s.name || 'Unnamed Set'}
                  </label>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', minHeight: '32px' }}>
          {listFilters.categories.map(val => (
            <span key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              Category: {val}
              <X size={14} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => removeListFilter('categories', val)} />
            </span>
          ))}
          {listFilters.stockLevels.map(val => (
            <span key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              Stock: {val.replace('_', ' ')}
              <X size={14} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => removeListFilter('stockLevels', val)} />
            </span>
          ))}
          {listFilters.statuses.map(val => (
            <span key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
              Status: {val}
              <X size={14} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => removeListFilter('statuses', val)} />
            </span>
          ))}
          {listFilters.sets && listFilters.sets.map(val => {
            const setName = sets.find(s => s.id === val)?.name || 'Unknown Set';
            return (
              <span key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                Set: {setName}
                <X size={14} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => removeListFilter('sets', val)} />
              </span>
            );
          })}
          {(listFilters.categories.length > 0 || listFilters.stockLevels.length > 0 || listFilters.statuses.length > 0 || (listFilters.sets && listFilters.sets.length > 0)) && (
            <button onClick={() => setListFilters({ categories: [], stockLevels: [], statuses: [], sets: [] })} style={{ border: 'none', background: 'transparent', fontSize: '13px', color: '#6b7280', cursor: 'pointer', padding: '6px 8px' }}>
              Clear all
            </button>
          )}
        </div>
      )}
      
      {/* View Container */}

      <div className={styles.productGridContainer} style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        {viewMode === 'list' ? (
          <InventoryList 
            products={filteredProducts} 
            handleEdit={handleEdit} 
            handleDelete={deleteProduct} 
          />
        ) : !activeSubCategory || activeSubCategory === 'All' ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#888' }}>
            <Package size={48} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#111', fontWeight: 500 }}>Select a Subcategory</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Please select a subcategory (e.g., Tote Bags) to view or create Look Sets.</p>
          </div>
        ) : (
          <SetsManager 
            handleEdit={handleEdit} 
            activeMainCategory={activeMainCategory}
            activeSubCategory={activeSubCategory}
            products={products}
            sets={sets}
            addSet={addSet}
            updateSet={updateSet}
            deleteSet={deleteSet}
            removeProductFromSet={removeProductFromSet}
            updateProductInSet={updateProductInSet}
            changeProductOrderInSet={changeProductOrderInSet}
          />
        )}
      </div>

    


      <ProductEditorDrawer 
        isOpen={editorConfig.isOpen}
        onClose={() => setEditorConfig({ ...editorConfig, isOpen: false })}
        onSave={handleSaveProduct}
        initialData={editorConfig.initialData}
        categories={categories}
        brands={brands}
        config={{ defaultMainCategory: activeMainCategory, defaultSubCategory: activeSubCategory, targetSetId: editorConfig.targetSetId }}
      />
      
          
    </div>
  );
};

export default ManageProductsPage;
