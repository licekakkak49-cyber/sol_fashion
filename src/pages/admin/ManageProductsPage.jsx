import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);
import { useAdmin } from '../../context/AdminContext';
import { Plus, X, UploadCloud, Search, Filter, Package, Edit2, Trash2, AlertTriangle, ArrowLeft, Briefcase, Shirt, Glasses, Watch, Activity, Settings, Hexagon, Eye, PanelTop, Tag, LayoutGrid, AlignJustify, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import styles from './AdminLayout.module.css';
import ImageCropper from '../../components/ImageCropper';
import SetsManager from './components/SetsManager';
import ProductEditorDrawer from './components/ProductEditorDrawer';
import { supabase } from '../../utils/supabaseClient';
import InventoryList from './components/InventoryList';
import CategoriesManagerModal from './components/CategoriesManagerModal';
import ProductPickerModal from './components/ProductPickerModal';

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
    editSubCategory,
    reorderSets: adminReorderSets,
    refreshData
  } = useAdmin();

  const [products, setProducts] = useState([]);
  const [sets, setSets] = useState([]);
  
  // Toast Notification State
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  
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
        colorVariants: p.color_variants,
        heelHeight: p.heel_height,
        image: p.cover_image_url,
        status: p.status || 'active',
        created_at: p.created_at || p.createdAt || null
      }));
      
      setProducts(mappedProducts);
      setSets((sData || []).map(s => ({
        ...s,
        mainCategory: s.main_category,
        subCategory: s.sub_category,
        scheduledDate: s.scheduled_date
      })));
    } catch(e) {
      console.error("Fetch data error:", e);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const addSet = async (newSet) => {
    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : 'set-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

    const dbPayload = {
      id: newSet.id || newId,
      name: newSet.name,
      status: newSet.status || 'draft',
      items: newSet.items || [],
      main_category: newSet.mainCategory,
      sub_category: newSet.subCategory,
      scheduled_date: newSet.scheduledDate || null
    };

    setSets(prev => [{
      ...newSet,
      id: dbPayload.id,
      mainCategory: newSet.mainCategory,
      subCategory: newSet.subCategory,
      scheduledDate: newSet.scheduledDate || null
    }, ...prev]);

    const { error } = await supabase.from('sets').insert([dbPayload]);
    if (error) {
      console.error('Error adding set:', error);
      showToast('Failed to create set: ' + error.message, 'error');
      fetchData(); // Rollback
    } else {
      showToast(`Set "${newSet.name}" created`, 'success');
      fetchData();
    }
  };

  const updateSet = async (setId, updatedData) => {
    // Optimistic UI update
    setSets(prev => prev.map(s => s.id === setId ? { ...s, ...updatedData } : s));
    
    const dbUpdate = { ...updatedData };
    if (updatedData.mainCategory !== undefined) { dbUpdate.main_category = updatedData.mainCategory; delete dbUpdate.mainCategory; }
    if (updatedData.subCategory !== undefined) { dbUpdate.sub_category = updatedData.subCategory; delete dbUpdate.subCategory; }
    if (updatedData.scheduledDate !== undefined) { dbUpdate.scheduled_date = updatedData.scheduledDate; delete dbUpdate.scheduledDate; }
    
    // Background DB update
    const { error } = await supabase.from('sets').update(dbUpdate).eq('id', setId);
    
    // Cascade status to all products in the set
    if (updatedData.status !== undefined) {
      const setToUpdate = sets.find(s => s.id === setId);
      if (setToUpdate && setToUpdate.items) {
        const productIds = setToUpdate.items
          .filter(item => !item.isPlaceholder && item.productId)
          .map(item => item.productId);
          
        if (productIds.length > 0) {
          const newProductStatus = updatedData.status === 'published' ? 'active' : 'draft';
          await supabase.from('products').update({ status: newProductStatus }).in('id', productIds);
          // Optimistically update products state
          setProducts(prev => prev.map(p => productIds.includes(p.id) ? { ...p, status: newProductStatus } : p));
        }
      }
    }

    if (error) {
      console.error("Update set error:", error);
      showToast('Failed to save set: ' + error.message, 'error');
      fetchData(); // Rollback if error
    } else {
      const currentSet = sets.find(s => s.id === setId);
      const setName = updatedData.name || currentSet?.name || 'Look Set';
      if (updatedData.status !== undefined) {
        showToast(`Set "${setName}" updated to ${updatedData.status.toUpperCase()}`, 'success');
      } else {
        showToast(`Set "${setName}" updated`, 'success');
      }
      if (updatedData.status !== undefined) {
        fetchData();
      }
    }
  };

  const reorderSets = async (setIdA, setIdB, timeA, timeB) => {
    // 1. Optimistic UI update
    setSets(prev => {
      const idxA = prev.findIndex(s => s.id === setIdA);
      const idxB = prev.findIndex(s => s.id === setIdB);
      if (idxA === -1 || idxB === -1) return prev;

      const newSets = [...prev];
      newSets[idxA] = { ...newSets[idxA], created_at: timeA };
      newSets[idxB] = { ...newSets[idxB], created_at: timeB };

      return newSets.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
    });

    // Update AdminContext state
    adminReorderSets?.(setIdA, setIdB, timeA, timeB);

    // 2. Persist to Supabase
    try {
      const [resA, resB] = await Promise.all([
        supabase.from('sets').update({ created_at: timeA }).eq('id', setIdA),
        supabase.from('sets').update({ created_at: timeB }).eq('id', setIdB)
      ]);

      if (resA.error || resB.error) {
        console.error("Reorder sets error:", resA.error || resB.error);
        showToast('Failed to save set order: ' + (resA.error?.message || resB.error?.message), 'error');
        fetchData(); // Rollback
      } else {
        showToast('Set display order updated', 'success');
        refreshData?.();
      }
    } catch (err) {
      console.error("Reorder sets error:", err);
      fetchData();
    }
  };

  const deleteSet = async (setId) => {
    if (!window.confirm("Are you sure you want to delete this set and all products within it? This action cannot be undone.")) {
      return;
    }

    const setToDelete = sets.find(s => s.id === setId);
    if (setToDelete && setToDelete.items) {
      const productIdsToDelete = setToDelete.items
        .filter(item => !item.isPlaceholder && item.productId)
        .map(item => item.productId);
      
      if (productIdsToDelete.length > 0) {
        await supabase.from('products').delete().in('id', productIdsToDelete);
      }
    }

    const { error } = await supabase.from('sets').delete().eq('id', setId);
    if (error) {
      showToast('Failed to delete set: ' + error.message, 'error');
    } else {
      showToast('Set deleted', 'info');
    }
    fetchData();
  };

  const removeProductFromSet = async (setId, productId, slotIndex = null) => {
    const draftId = `draft-${Date.now()}-${Math.random()}`;
    // 1. Optimistic UI update
    setSets(prev => prev.map(s => {
      if (s.id !== setId) return s;
      const newItems = s.items.map((item, idx) => {
        const isMatch = (slotIndex !== null && slotIndex !== undefined)
          ? idx === slotIndex
          : (item.productId === productId);
        return isMatch ? { productId: draftId, layoutSize: item.layoutSize, isHidden: true } : item;
      });
      
      // 2. Background DB update
      supabase.from('sets').update({ items: newItems }).eq('id', setId).then(({ error }) => {
        if (error) {
          console.error("removeProductFromSet error:", error);
          showToast('Failed to remove product: ' + error.message, 'error');
          fetchData(); // Rollback
        } else {
          showToast('Product removed from set', 'info');
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
          showToast('Failed to update product: ' + error.message, 'error');
          fetchData(); // Rollback
        } else {
          showToast('Product updated in set', 'success');
        }
      });
      
      return { ...s, items: newItems };
    }));
  };

  const changeProductOrderInSet = async (setId, productId, newIndex, updatedData = null, slotIndex = null) => {
    // 1. Optimistic UI update
    setSets(prev => prev.map(s => {
      if (s.id !== setId) return s;
      const currentIndex = (slotIndex !== null && slotIndex !== undefined && slotIndex >= 0)
        ? slotIndex
        : s.items.findIndex((i, idx) => (i.slotId || `${i.productId}-${idx}`) === productId || i.productId === productId);
      if (currentIndex === -1) return s;
      const newItems = [...s.items];
      const [movedItem] = newItems.splice(currentIndex, 1);
      const itemToInsert = updatedData ? { ...movedItem, ...updatedData } : movedItem;
      newItems.splice(newIndex, 0, itemToInsert);
      
      // 2. Background DB update
      supabase.from('sets').update({ items: newItems }).eq('id', setId).then(({ error }) => {
        if (error) {
          console.error("changeProductOrderInSet error:", error);
          showToast('Failed to save layout: ' + error.message, 'error');
          fetchData(); // Rollback
        } else {
          showToast('Layout updated', 'success');
        }
      });
      
      return { ...s, items: newItems };
    }));
  };
  
  const toggleProductStatus = async (product) => {
    const newStatus = (product.status || 'draft').toLowerCase() === 'draft' ? 'active' : 'draft';
    await supabase.from('products').update({ status: newStatus }).eq('id', product.id);
    showToast(`Product set to ${newStatus === 'active' ? 'PUBLISHED' : 'DRAFT'}`, 'success');
    fetchData(); // Refresh list
  };

  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    showToast('Product deleted', 'info');
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

  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL first, then localStorage fallback
  const getInitialContext = () => {
    const urlView = searchParams.get('view');
    const urlCat = searchParams.get('cat');
    const urlSub = searchParams.get('sub');

    if (urlView || urlCat || urlSub) {
      return {
        view: urlView === 'list' ? 'list' : 'grid',
        cat: urlCat || 'All',
        sub: urlSub || 'All'
      };
    }

    try {
      const saved = localStorage.getItem('sol_admin_active_context');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          view: parsed.view === 'list' ? 'list' : 'grid',
          cat: parsed.cat || 'All',
          sub: parsed.sub || 'All'
        };
      }
    } catch (e) {}

    return { view: 'grid', cat: 'All', sub: 'All' };
  };

  const initialCtx = useRef(getInitialContext()).current;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainCategory, setActiveMainCategory] = useState(initialCtx.cat);
  const [activeSubCategory, setActiveSubCategory] = useState(initialCtx.sub);
  const [viewMode, setViewMode] = useState(initialCtx.view);

  // Sync state to URL search parameters and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sol_admin_active_context', JSON.stringify({
        cat: activeMainCategory,
        sub: activeSubCategory,
        view: viewMode
      }));
    } catch (e) {}

    const newParams = new URLSearchParams(searchParams);
    newParams.set('view', viewMode);
    if (activeMainCategory && activeMainCategory !== 'All') {
      newParams.set('cat', activeMainCategory);
    } else {
      newParams.delete('cat');
    }
    if (activeSubCategory && activeSubCategory !== 'All') {
      newParams.set('sub', activeSubCategory);
    } else {
      newParams.delete('sub');
    }

    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams, { replace: true });
    }
  }, [activeMainCategory, activeSubCategory, viewMode, searchParams, setSearchParams]);

  const handleSelectMainCategory = (cat) => {
    setActiveMainCategory(cat);
    if (cat === 'All') {
      setActiveSubCategory('All');
    } else {
      const subs = categories[cat] || [];
      if (viewMode === 'grid') {
        // Smart select: find first subcategory with existing sets
        const subWithSets = subs.find(s => (sets || []).some(item => 
          (item.mainCategory === cat || item.main_category === cat) && 
          (item.subCategory === s || item.sub_category === s)
        ));
        setActiveSubCategory(subWithSets || (subs.includes('Sets') ? 'Sets' : (subs[0] || 'All')));
      } else {
        const subWithProducts = subs.find(s => (products || []).some(p => p.mainCategory === cat && p.subCategory === s));
        setActiveSubCategory(subWithProducts || subs[0] || 'All');
      }
    }
  };
  
  // List Mode Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [listFilters, setListFilters] = useState({
    categories: [],
    stockLevels: [], // 'out_of_stock', 'low_stock', 'in_stock'
    statuses: [], // 'active', 'draft'
    sets: []
  });
  const addSetTriggerRef = useRef(null);

  const activeFilterCount = useMemo(() => {
    return (listFilters.categories?.length || 0) +
      (listFilters.stockLevels?.length || 0) +
      (listFilters.statuses?.length || 0) +
      (listFilters.sets?.length || 0);
  }, [listFilters]);

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
    const [isCategoriesManagerOpen, setIsCategoriesManagerOpen] = useState(false);
  
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

  // Product Picker Modal state (for styling Look Sets)
  const [pickerConfig, setPickerConfig] = useState({
    isOpen: false,
    targetSlot: null,
    targetSetId: null,
    targetLayoutSize: 'small',
    currentSetItemIds: []
  });

  const handleOpenPicker = ({ slot, setId, layoutSize, currentSetItemIds = [] }) => {
    setPickerConfig({
      isOpen: true,
      targetSlot: slot,
      targetSetId: setId,
      targetLayoutSize: layoutSize || slot?.layoutSize || 'small',
      currentSetItemIds
    });
  };

  const handleSelectProductForSlot = async (selectedProduct) => {
    if (!pickerConfig.targetSetId || !pickerConfig.targetSlot) return;

    const targetSet = sets.find(s => s.id === pickerConfig.targetSetId);
    if (!targetSet) return;

    const slotIndex = pickerConfig.targetSlot.slotIndex;
    const slotId = pickerConfig.targetSlot.id;
    const rawProductId = pickerConfig.targetSlot.rawProductId;
    const layoutSize = pickerConfig.targetLayoutSize || pickerConfig.targetSlot.layoutSize || 'small';

    const updatedItems = (targetSet.items || []).map((item, idx) => {
      const isMatch = (slotIndex !== null && slotIndex !== undefined)
        ? idx === slotIndex
        : (item.productId === slotId || (rawProductId && item.productId === rawProductId) || (item.slotId && item.slotId === slotId));
      if (isMatch) {
        return { 
          ...item, 
          productId: selectedProduct.id, 
          layoutSize,
          customCover: item.customCover || null
        };
      }
      return item;
    });

    await updateSet(pickerConfig.targetSetId, { items: updatedItems });
    showToast(`"${selectedProduct.name}" added to set`, 'success');
  };

  const handleCreateNewProductFromPicker = () => {
    setEditorConfig({
      isOpen: true,
      initialData: { 
        mainCategory: activeMainCategory !== 'All' ? activeMainCategory : '', 
        subCategory: activeSubCategory !== 'All' ? activeSubCategory : '' 
      },
      targetSetId: pickerConfig.targetSetId,
      targetSlotId: pickerConfig.targetSlot?.id,
      targetSlotIndex: pickerConfig.targetSlot?.slotIndex,
      targetRawProductId: pickerConfig.targetSlot?.rawProductId
    });
  };

  const handleFastUpdate = async (payload) => {
    if (!payload.id) return;
    try {
      const dbPayload = {
        stock: payload.stock,
        status: payload.status,
        color_variants: payload.colorVariants
      };
      
      const { error } = await supabase
        .from('products')
        .update(dbPayload)
        .eq('id', payload.id);
        
      if (error) throw error;
      showToast('Inventory updated', 'success');
      fetchData(); // Reload inventory list
    } catch (err) {
      console.error('Error fast updating product:', err);
      showToast('Failed to update: ' + err.message, 'error');
    }
  };

  const handleSaveProduct = async (payload) => {
    const isPlaceholder = payload.id && payload.id.startsWith('draft-');
    
    const dbPayload = {
      name: payload.name,
      subtitle: payload.subtitle || null,
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
      heel_height: payload.heelHeight,
      tags: payload.highlight || [],
      color_variants: payload.colorVariants || []
    };
    
    try {
      if (isPlaceholder || !payload.id) {
        // Insert new product
        dbPayload.id = Date.now().toString();
        dbPayload.created_at = new Date().toISOString();
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([dbPayload])
          .select()
          .single();
          
        if (error) throw error;
        
        // If it was a placeholder in a set, update the set's JSON
        const targetSlotId = editorConfig.targetSlotId || (isPlaceholder ? payload.id : null);
        if (editorConfig.targetSetId && (targetSlotId || editorConfig.targetSlotIndex !== undefined)) {
          // We need to fetch the set, update the items JSON, and save back
          const { data: setRecord } = await supabase.from('sets').select('*').eq('id', editorConfig.targetSetId).single();
          if (setRecord) {
            const newItems = (setRecord.items || []).map((item, idx) => {
              const isMatch = (editorConfig.targetSlotIndex !== null && editorConfig.targetSlotIndex !== undefined)
                ? idx === editorConfig.targetSlotIndex
                : (item.productId === targetSlotId || (editorConfig.targetRawProductId && item.productId === editorConfig.targetRawProductId));
              return isMatch ? { ...item, productId: newProduct.id, isHidden: false } : item;
            });
            await supabase.from('sets').update({ items: newItems }).eq('id', setRecord.id);
          }
          showToast(`Product "${payload.name}" added to set`, 'success');
        } else {
          showToast(`Product "${payload.name}" created`, 'success');
        }
      } else {
        // Update existing
        const { error } = await supabase
          .from('products')
          .update(dbPayload)
          .eq('id', payload.id);
          
        if (error) throw error;
        showToast(`Product "${payload.name}" updated`, 'success');
      }
      
      console.log('Saved to Supabase successfully!');
      fetchData();
    } catch (e) {
      console.error('Supabase Error:', e);
      showToast('Error saving product: ' + e.message, 'error');
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
          const pStatus = (p.status || 'draft').toLowerCase();
          const matches = listFilters.statuses.some(st => {
            if (st === 'active' || st === 'published') return pStatus === 'active' || pStatus === 'published';
            return pStatus === st.toLowerCase();
          });
          if (!matches) return false;
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
      {/* HEADER SECTION - Strict 1 Row on Mobile */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '12px' : '24px', gap: isMobile ? '8px' : '20px', width: '100%', flexWrap: 'nowrap' }}>
        
        {/* Search Bar Input */}
        <div style={{ flex: 1, maxWidth: '800px', position: 'relative', minWidth: 0 }}>
          <Search size={isMobile ? 15 : 18} color="#888" style={{ position: 'absolute', left: isMobile ? '12px' : '20px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder={viewMode === 'grid' ? (isMobile ? "Search sets..." : "Search look sets...") : (isMobile ? "Search..." : "Search products by name or SKU...")} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: isMobile ? '8px 12px 8px 34px' : '14px 20px 14px 48px', 
              paddingRight: searchQuery ? '36px' : (isMobile ? '12px' : '20px'), 
              border: 'none', 
              borderRadius: '100px', 
              fontSize: isMobile ? '13px' : '15px', 
              outline: 'none', 
              background: '#F3F4F6', 
              color: '#111',
              transition: 'padding 0.2s'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: isMobile ? '10px' : '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#e5e7eb',
                border: 'none',
                borderRadius: '50%',
                width: isMobile ? '18px' : '22px',
                height: isMobile ? '18px' : '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#4b5563',
                padding: 0
              }}
              title="Clear search"
            >
              <X size={isMobile ? 10 : 13} />
            </button>
          )}
        </div>
        
        {/* Right Controls: View Switcher + Primary Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px', flexShrink: 0 }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: '#F3F4F6', padding: isMobile ? '3px' : '4px', borderRadius: '100px', gap: isMobile ? '2px' : '4px' }}>
            <button 
              type="button"
              onClick={() => setViewMode('grid')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: isMobile ? '6px 10px' : '10px 16px', border: 'none', borderRadius: '100px', cursor: 'pointer',
                background: viewMode === 'grid' ? '#fff' : 'transparent',
                color: viewMode === 'grid' ? '#111' : '#6b7280',
                fontWeight: viewMode === 'grid' ? 600 : 500,
                fontSize: isMobile ? '12px' : '13px',
                boxShadow: viewMode === 'grid' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <LayoutGrid size={isMobile ? 14 : 16} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>Lookbook (Grid)</span>
            </button>
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: isMobile ? '6px 10px' : '10px 16px', border: 'none', borderRadius: '100px', cursor: 'pointer',
                background: viewMode === 'list' ? '#fff' : 'transparent',
                color: viewMode === 'list' ? '#111' : '#6b7280',
                fontWeight: viewMode === 'list' ? 600 : 500,
                fontSize: isMobile ? '12px' : '13px',
                boxShadow: viewMode === 'list' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <AlignJustify size={isMobile ? 14 : 16} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>Catalog (List)</span>
            </button>
          </div>

          {/* Primary Action Button */}
          {viewMode === 'grid' ? (
            <button 
              type="button"
              onClick={() => addSetTriggerRef.current?.()}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '6px',
                padding: isMobile ? '0' : '10px 20px', 
                width: isMobile ? '36px' : 'auto',
                height: isMobile ? '36px' : 'auto',
                border: 'none', 
                borderRadius: '100px', 
                cursor: 'pointer',
                background: '#111',
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              title="New Look Set"
            >
              <Plus size={isMobile ? 18 : 16} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>New Look Set</span>
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleAddNew}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '6px',
                padding: isMobile ? '0' : '10px 20px', 
                width: isMobile ? '36px' : 'auto',
                height: isMobile ? '36px' : 'auto',
                border: 'none', 
                borderRadius: '100px', 
                cursor: 'pointer',
                background: '#111',
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              title="Add Product"
            >
              <Plus size={isMobile ? 18 : 16} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>Add Product</span>
            </button>
          )}
        </div>
      </div>

      
      
      
            {/* Main Categories Row */}
      <div className={isMobile ? styles.hideScrollbar : ''} style={{ display: viewMode === 'list' ? 'none' : 'flex', alignItems: 'center', marginBottom: isMobile ? '12px' : '16px', flexWrap: isMobile ? 'nowrap' : 'wrap', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '4px' : '0' }}>
        <div style={{ display: 'flex', background: '#F3F4F6', padding: '4px', borderRadius: '100px', gap: '4px', whiteSpace: 'nowrap' }}>
          <button 
            onClick={() => handleSelectMainCategory('All')}
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
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            All Look Sets
            <span style={{ 
              background: activeMainCategory === 'All' ? '#111' : '#e5e7eb',
              color: activeMainCategory === 'All' ? '#fff' : '#4b5563',
              padding: '1px 7px', borderRadius: '100px', fontSize: '11px', fontWeight: 600
            }}>
              {sets.length}
            </span>
          </button>
          {Object.keys(categories).map(cat => {
            const catSetCount = sets.filter(s => (s.mainCategory === cat || s.main_category === cat)).length;
            const catProdCount = validProducts.filter(p => p.mainCategory === cat).length;
            const count = viewMode === 'grid' ? catSetCount : catProdCount;
            const hasItems = count > 0;
            return (
              <button 
                key={cat}
                onClick={() => handleSelectMainCategory(cat)}
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
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {cat}
                <span style={{ 
                  background: activeMainCategory === cat ? '#111' : (hasItems ? '#e5e7eb' : 'transparent'),
                  color: activeMainCategory === cat ? '#fff' : (hasItems ? '#4b5563' : '#9ca3af'),
                  padding: '1px 7px', borderRadius: '100px', fontSize: '11px', fontWeight: 600
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <button 
          onClick={() => setIsCategoriesManagerOpen(true)}
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
        {activeMainCategory === 'All' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#6b7280', padding: '4px 0' }}>
            <span style={{ fontWeight: 600, color: '#111' }}>Showing all sets across all categories</span>
            <span>•</span>
            <span>Published: <strong style={{ color: '#10b981' }}>{sets.filter(s => s.status === 'published').length}</strong></span>
            <span>•</span>
            <span>Draft: <strong style={{ color: '#f59e0b' }}>{sets.filter(s => s.status === 'draft').length}</strong></span>
          </div>
        )}
        
        {activeMainCategory !== 'All' && categories[activeMainCategory] && categories[activeMainCategory].map(sub => {
          const subSetCount = sets.filter(s => 
            (s.mainCategory === activeMainCategory || s.main_category === activeMainCategory) && 
            (s.subCategory === sub || s.sub_category === sub)
          ).length;
          const subProdCount = validProducts.filter(p => p.mainCategory === activeMainCategory && p.subCategory === sub).length;
          const count = viewMode === 'grid' ? subSetCount : subProdCount;
          const hasItems = count > 0;
          return (
            <button
              key={sub}
              onClick={() => setActiveSubCategory(sub)}
              style={{
                padding: isMobile ? '0 0 8px 0' : '0 0 12px 0',
                border: 'none',
                background: 'transparent',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: activeSubCategory === sub ? 600 : 500,
                color: activeSubCategory === sub ? '#111' : (hasItems ? '#4b5563' : '#9ca3af'),
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
                background: activeSubCategory === sub ? '#111' : (hasItems ? '#f3f4f6' : 'transparent'),
                color: activeSubCategory === sub ? '#fff' : (hasItems ? '#374151' : '#9ca3af'),
                padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600
              }}>
                {count}
              </span>
            </button>
          );
        })}

        <div style={{ flexGrow: 1 }}></div>
      </div>
      
      

            </div>
            {/* MEGA FILTER PANEL */}
      {viewMode === 'list' && isFilterOpen && (
        isMobile ? (
          /* Mobile Filter Bottom Sheet */
          <div 
            className={styles.bottomSheetContainer}
            onClick={() => setIsFilterOpen(false)}
          >
            <div 
              className={styles.bottomSheetContent}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.bottomSheetHandle} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#111' }}>Catalog Filters</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>Filter products by category, stock, and status</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  style={{ border: 'none', background: '#f3f4f6', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={16} color="#666" />
                </button>
              </div>

              {/* Categories */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#111', fontWeight: 600 }}>Categories</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.keys(categories).map(cat => {
                    const isChecked = listFilters.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleListFilter('categories', cat)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '100px',
                          border: isChecked ? '1px solid #111' : '1px solid #e5e7eb',
                          background: isChecked ? '#111' : '#f9fafb',
                          color: isChecked ? '#fff' : '#374151',
                          fontSize: '13px',
                          fontWeight: isChecked ? 600 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock Level */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#111', fontWeight: 600 }}>Stock Level</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { key: 'in_stock', label: 'In Stock' },
                    { key: 'low_stock', label: 'Low Stock (< 10)' },
                    { key: 'out_of_stock', label: 'Out of Stock' }
                  ].map(opt => {
                    const isChecked = listFilters.stockLevels.includes(opt.key);
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => toggleListFilter('stockLevels', opt.key)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '100px',
                          border: isChecked ? '1px solid #111' : '1px solid #e5e7eb',
                          background: isChecked ? '#111' : '#f9fafb',
                          color: isChecked ? '#fff' : '#374151',
                          fontSize: '13px',
                          fontWeight: isChecked ? 600 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#111', fontWeight: 600 }}>Status</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { key: 'active', label: 'Active / Published' },
                    { key: 'draft', label: 'Draft' }
                  ].map(opt => {
                    const isChecked = listFilters.statuses.includes(opt.key);
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => toggleListFilter('statuses', opt.key)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '100px',
                          border: isChecked ? '1px solid #111' : '1px solid #e5e7eb',
                          background: isChecked ? '#111' : '#f9fafb',
                          color: isChecked ? '#fff' : '#374151',
                          fontSize: '13px',
                          fontWeight: isChecked ? 600 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Look Sets */}
              {sets && sets.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#111', fontWeight: 600 }}>Look Sets</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
                    {sets.map(s => {
                      const isChecked = listFilters.sets && listFilters.sets.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleListFilter('sets', s.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '100px',
                            border: isChecked ? '1px solid #111' : '1px solid #e5e7eb',
                            background: isChecked ? '#111' : '#f9fafb',
                            color: isChecked ? '#fff' : '#374151',
                            fontSize: '12px',
                            fontWeight: isChecked ? 600 : 500,
                            cursor: 'pointer'
                          }}
                        >
                          {s.name || 'Unnamed Set'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setListFilters({ categories: [], stockLevels: [], statuses: [], sets: [] })}
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
                  onClick={() => setIsFilterOpen(false)}
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
                  Apply {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop In-Page Mega Filter Panel */
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
        )
      )}

      {viewMode === 'list' && (
        <div 
          className={isMobile ? styles.hideScrollbar : ''}
          style={{ 
            display: 'flex', 
            flexWrap: isMobile ? 'nowrap' : 'wrap', 
            overflowX: isMobile ? 'auto' : 'visible',
            gap: '8px', 
            marginBottom: isMobile ? '12px' : '24px', 
            minHeight: isMobile ? 'auto' : '32px',
            paddingBottom: isMobile ? '4px' : '0'
          }}
        >
          {listFilters.categories.map(val => (
            <span key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151', flexShrink: 0 }}>
              Category: {val}
              <X size={14} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => removeListFilter('categories', val)} />
            </span>
          ))}
          {listFilters.stockLevels.map(val => (
            <span key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151', flexShrink: 0 }}>
              Stock: {val.replace('_', ' ')}
              <X size={14} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => removeListFilter('stockLevels', val)} />
            </span>
          ))}
          {listFilters.statuses.map(val => (
            <span key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151', flexShrink: 0 }}>
              Status: {val}
              <X size={14} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => removeListFilter('statuses', val)} />
            </span>
          ))}
          {listFilters.sets && listFilters.sets.map(val => {
            const setName = sets.find(s => s.id === val)?.name || 'Unknown Set';
            return (
              <span key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#374151', flexShrink: 0 }}>
                Set: {setName}
                <X size={14} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => removeListFilter('sets', val)} />
              </span>
            );
          })}
          {(listFilters.categories.length > 0 || listFilters.stockLevels.length > 0 || listFilters.statuses.length > 0 || (listFilters.sets && listFilters.sets.length > 0)) && (
            <button onClick={() => setListFilters({ categories: [], stockLevels: [], statuses: [], sets: [] })} style={{ border: 'none', background: 'transparent', fontSize: '13px', color: '#6b7280', cursor: 'pointer', padding: '6px 8px', flexShrink: 0 }}>
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
            toggleProductStatus={toggleProductStatus}
            handleFastUpdate={handleFastUpdate}
            onAddNew={handleAddNew}
            isFilterOpen={isFilterOpen}
            onToggleFilter={() => setIsFilterOpen(prev => !prev)}
            activeFilterCount={activeFilterCount}
            isMobile={isMobile}
          />
        ) : (
          <SetsManager 
            handleEdit={handleEdit} 
            activeMainCategory={activeMainCategory}
            activeSubCategory={activeSubCategory || 'All'}
            categories={categories}
            products={products}
            sets={sets}
            addSet={addSet}
            updateSet={updateSet}
            deleteSet={deleteSet}
            removeProductFromSet={removeProductFromSet}
            updateProductInSet={updateProductInSet}
            changeProductOrderInSet={changeProductOrderInSet}
            reorderSets={reorderSets}
            showToast={showToast}
            searchQuery={searchQuery}
            onOpenPicker={handleOpenPicker}
            onRegisterAddSet={(fn) => { addSetTriggerRef.current = fn; }}
            onSelectCategory={(main, sub) => {
              if (main) setActiveMainCategory(main);
              if (sub) setActiveSubCategory(sub);
            }}
            isMobile={isMobile}
          />
        )}
      </div>

    


      <CategoriesManagerModal 
        isOpen={isCategoriesManagerOpen} 
        onClose={() => setIsCategoriesManagerOpen(false)} 
      />
      <ProductPickerModal 
        isOpen={pickerConfig.isOpen}
        onClose={() => setPickerConfig(prev => ({ ...prev, isOpen: false }))}
        onSelectProduct={handleSelectProductForSlot}
        onCreateNewProduct={handleCreateNewProductFromPicker}
        currentSlot={pickerConfig.targetSlot}
        products={products}
        categories={categories}
        currentSetItemIds={pickerConfig.currentSetItemIds}
      />
      <ProductEditorDrawer 
        isOpen={editorConfig.isOpen}
        onClose={() => setEditorConfig({ ...editorConfig, isOpen: false })}
        onSave={handleSaveProduct}
        initialData={editorConfig.initialData}
        categories={categories}
        brands={brands}
        config={{ defaultMainCategory: activeMainCategory, defaultSubCategory: activeSubCategory, targetSetId: editorConfig.targetSetId }}
      />
      
      {/* Floating Toast Notification - Top Center & High Visibility */}
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
};

export default ManageProductsPage;
