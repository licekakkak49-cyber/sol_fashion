import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const MOCK_PRODUCTS = [];


export const AdminProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  
  const [sets, setSets] = useState([]);
  const [newInLookbookIds, setNewInLookbookIds] = useState(() => {
    try {
      const saved = localStorage.getItem('sol_new_in_lookbooks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [curatedViewAllLookbooks, setCuratedViewAllLookbooks] = useState(() => {
    try {
      const saved = localStorage.getItem('sol_curated_view_all_lookbooks');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [homepageCollections, setHomepageCollections] = useState(() => {
    try {
      const saved = localStorage.getItem('sol_homepage_collections_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [homepageCollectionsLoaded, setHomepageCollectionsLoaded] = useState(false);

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sol_categories_v3');
    return saved ? JSON.parse(saved) : {
      'Bags': ['Crossbody Bags', 'Shoulder Bags', 'Handbags', 'Totes', 'Mini Bags'],
      'Ready to Wear': ['Knit Top', 'Shirt', 'Blouse', 'Shorts', 'Pants', 'Skirt', 'Mini Dress', 'Maxi Dress', 'Sets'],
      'Accessories & Shoes': ['Jewelry', 'Hats', 'Belts', 'Sandals', 'Heels', 'Flats']
    };
  });

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // 1. Fetch categories from Supabase on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('setting_value')
          .eq('key_name', 'categories_v2')
          .single();
        
        if (data && data.setting_value && Array.isArray(data.setting_value)) {
          const newCats = {};
          data.setting_value.forEach(cat => {
            newCats[cat.name] = cat.subcategories;
          });
          setCategories(newCats);
        } else {
          // Fallback to old
          const { data: oldData } = await supabase.from('store_settings').select('setting_value').eq('key_name', 'categories').single();
          if (oldData && oldData.setting_value) {
            setCategories(oldData.setting_value);
          }
        }
      } catch (err) {
        console.warn("Could not fetch categories from Supabase, using local fallback.");
      } finally {
        setCategoriesLoaded(true);
      }
    };
    fetchCats();
  }, []);

  // 2. Save categories to Supabase and LocalStorage when modified
  useEffect(() => {
    localStorage.setItem('sol_categories_v3', JSON.stringify(categories));
    
    // Only push to Supabase if we have already loaded the real data from it
    if (categoriesLoaded) {
      const orderedArray = Object.keys(categories).map(key => ({
        name: key,
        subcategories: categories[key]
      }));

      supabase
        .from('store_settings')
        .upsert({ 
          key_name: 'categories_v2', 
          setting_value: orderedArray 
        })
        .then(({ error }) => {
          if (error) console.error("Error syncing categories to Supabase:", error);
        });
    }
  }, [categories, categoriesLoaded]);

  const addCategory = (name) => {
    if (!name || categories[name]) return false;
    setCategories(prev => ({ ...prev, [name]: [] }));
    return true;
  };

  const addSubCategory = (mainName, subName) => {
    if (!mainName || !subName || !categories[mainName]) return false;
    if (categories[mainName].includes(subName)) return false;
    setCategories(prev => ({
      ...prev,
      [mainName]: [...prev[mainName], subName]
    }));
    return true;
  };

  const editCategory = (oldName, newName) => {
    if (!oldName || !newName || !categories[oldName] || categories[newName]) return false;
    setCategories(prev => {
      const next = { ...prev };
      next[newName] = next[oldName];
      delete next[oldName];
      return next;
    });
    setProducts(prev => prev.map(p => p.mainCategory === oldName ? { ...p, mainCategory: newName } : p));
    return true;
  };

  const editSubCategory = (mainName, oldSub, newSub) => {
    if (!mainName || !oldSub || !newSub || !categories[mainName]) return false;
    if (categories[mainName].includes(newSub)) return false;
    setCategories(prev => ({
      ...prev,
      [mainName]: prev[mainName].map(sub => sub === oldSub ? newSub : sub)
    }));
    setProducts(prev => prev.map(p => (p.mainCategory === mainName && p.subCategory === oldSub) ? { ...p, subCategory: newSub } : p));
    return true;
  };

  const deleteCategory = (mainName) => {
    setCategories(prev => {
      const newP = { ...prev };
      delete newP[mainName];
      return newP;
    });
  };

  const deleteSubCategory = (mainName, subName) => {
    setCategories(prev => {
      const newP = { ...prev };
      if (newP[mainName]) {
        newP[mainName] = newP[mainName].filter(sub => sub !== subName);
      }
      return newP;
    });
  };

  const reorderCategories = (newOrderKeys) => {
    setCategories(prev => {
      const newP = {};
      newOrderKeys.forEach(key => {
        if (prev[key]) newP[key] = prev[key];
      });
      // Ensure any missing keys are appended at the end
      Object.keys(prev).forEach(key => {
        if (!newP[key]) newP[key] = prev[key];
      });
      return newP;
    });
  };

  const reorderSubCategories = (mainName, newOrderArr) => {
    setCategories(prev => {
      const newP = { ...prev };
      if (newP[mainName]) {
        newP[mainName] = newOrderArr;
      }
      return newP;
    });
  };
  const [contentArticles, setContentArticles] = useState([]);
  const [homepageModules, setHomepageModules] = useState([]);
  const [homepageGridItems, setHomepageGridItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Basic Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('sol_admin_auth') === 'true';
  });

  const loginAdmin = (email, password) => {
    if (email === 'admin@solfashion.com' && password === 'Sol-Fashion-2026!') {
      localStorage.setItem('sol_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('sol_admin_auth');
    setIsAdminAuthenticated(false);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Brands
      const { data: brandsData } = await supabase.from('brands').select('*').order('created_at', { ascending: true });
      if (brandsData) {
        setBrands(brandsData.map(b => ({
          ...b,
          banner: b.banner_url
        })));
      }

      // 2. Fetch Products
      const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (productsData && productsData.length > 0) {
        setProducts(productsData.map(p => ({
          ...p,
          uploadDate: p.created_at,
          mainCategory: p.main_category,
          subCategory: p.sub_category,
          coverImage: p.cover_image_url,
          image: p.cover_image_url,
          hoverImage: p.hover_image_url,
          galleryImages: p.gallery_images_urls || [],
          layoutSize: p.layout_size,
          heelHeight: p.heel_height,
          subtitle: p.subtitle || '',
          material: p.material || '',
          sku: p.sku || '',
          brandId: p.brand_id || '',
          colorVariants: p.color_variants || [],
          colors: (p.color_variants || []).map(v => (v.swatchType === 'pattern' ? v.patternImage : v.hex) || v.hex || '#000000').filter(Boolean)
        })));
      }

      // Fetch Sets & New In & Curated View All Lookbook settings
      let activeNewInIds = newInLookbookIds;
      try {
        const { data: newInSetting } = await supabase
          .from('store_settings')
          .select('setting_value')
          .eq('key_name', 'new_in_lookbooks')
          .single();
        if (newInSetting && Array.isArray(newInSetting.setting_value)) {
          activeNewInIds = newInSetting.setting_value;
          setNewInLookbookIds(activeNewInIds);
          localStorage.setItem('sol_new_in_lookbooks', JSON.stringify(activeNewInIds));
        }
      } catch (err) {
        console.warn("Could not fetch new_in_lookbooks, using fallback:", err);
      }

      let activeCuratedViewAll = curatedViewAllLookbooks;
      try {
        const { data: curatedSetting } = await supabase
          .from('store_settings')
          .select('setting_value')
          .eq('key_name', 'curated_view_all_lookbooks')
          .single();
        if (curatedSetting && typeof curatedSetting.setting_value === 'object' && curatedSetting.setting_value !== null) {
          activeCuratedViewAll = curatedSetting.setting_value;
          setCuratedViewAllLookbooks(activeCuratedViewAll);
          localStorage.setItem('sol_curated_view_all_lookbooks', JSON.stringify(activeCuratedViewAll));
        }
      } catch (err) {
        console.warn("Could not fetch curated_view_all_lookbooks, using fallback:", err);
      }

      const { data: setsData } = await supabase.from('sets').select('*').order('created_at', { ascending: false });
      if (setsData && setsData.length > 0) {
        setSets(setsData.map(s => {
          const sMain = s.main_category;
          const curatedList = activeCuratedViewAll[sMain] || [];
          return {
            ...s,
            mainCategory: s.main_category,
            subCategory: s.sub_category,
            scheduledDate: s.scheduled_date,
            isNewIn: activeNewInIds.includes(s.id),
            isViewAll: curatedList.includes(s.id)
          };
        }));
      }


      // Fetch Homepage Grid Items
      const { data: gridData } = await supabase.from('homepage_grid_items').select('*').order('grid_index', { ascending: true });
      const mappedGridItems = (gridData || []).map(item => ({
        id: item.id,
        layoutSize: item.layout_size,
        contentType: item.content_type,
        contentData: item.content_data || {},
        gridIndex: item.grid_index
      }));
      setHomepageGridItems(mappedGridItems);

      // Fetch Homepage Collections from store_settings
      try {
        const { data: colSetting } = await supabase
          .from('store_settings')
          .select('setting_value')
          .eq('key_name', 'homepage_collections_v1')
          .single();

        if (colSetting && Array.isArray(colSetting.setting_value) && colSetting.setting_value.length > 0) {
          setHomepageCollections(colSetting.setting_value);
          localStorage.setItem('sol_homepage_collections_v1', JSON.stringify(colSetting.setting_value));
        } else {
          // Initialize default live collection from existing grid items
          const initialCollection = [{
            id: 'home-col-main',
            name: 'Main Campaign (Live)',
            status: 'published',
            items: mappedGridItems || [],
            updated_at: new Date().toISOString()
          }];
          setHomepageCollections(initialCollection);
          localStorage.setItem('sol_homepage_collections_v1', JSON.stringify(initialCollection));
          supabase
            .from('store_settings')
            .upsert({ key_name: 'homepage_collections_v1', setting_value: initialCollection })
            .then(({ error }) => { if (error) console.error("Error initializing homepage collections:", error); });
        }
      } catch (colErr) {
        console.warn("Could not fetch homepage collections:", colErr);
      } finally {
        setHomepageCollectionsLoaded(true);
      }

      // 3. Fetch Articles & Modules

      const { data: articlesData } = await supabase.from('content_articles').select(`
        *,
        content_modules (*)
      `).order('publish_date', { ascending: false });
      
      if (articlesData) {
        setContentArticles(articlesData.map(a => {
          const sortedModules = (a.content_modules || []).sort((m1, m2) => m1.sort_order - m2.sort_order);
          return {
            ...a,
            date: a.publish_date,
            isPinned: a.is_pinned,
            coverImage: a.cover_image_url,
            coverSettings: typeof a.cover_settings === 'string' ? JSON.parse(a.cover_settings) : a.cover_settings,
            thumbnailImage: a.thumbnail_image_url,
            modules: sortedModules.map(m => ({
              id: m.id,
              type: m.type,
              isVisible: m.is_visible,
              data: typeof m.data === 'string' ? JSON.parse(m.data) : m.data
            }))
          };
        }));
      }
    } catch (err) {
      console.error("Error fetching data from Supabase:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);



  const addBrand = async (brand) => {
    const newId = Date.now().toString();
    const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const dbBrand = {
      id: newId,
      name: brand.name,
      slug: slug,
      description: brand.description || '',
      banner_url: brand.banner || ''
    };
    
    const { error } = await supabase.from('brands').insert([dbBrand]);
    if (!error) {
      setBrands(prev => [...prev, { ...brand, id: newId, slug }]);
      return true;
    } else {
      console.error("Error adding brand:", error);
      return false;
    }
  };

  const updateBrand = async (id, updatedFields) => {
    // Generate new slug if name is updated
    const slug = updatedFields.name 
      ? updatedFields.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : undefined;

    const dbUpdate = {
      ...(updatedFields.name && { name: updatedFields.name, slug }),
      ...(updatedFields.description !== undefined && { description: updatedFields.description }),
      ...(updatedFields.banner !== undefined && { banner_url: updatedFields.banner })
    };

    const { error } = await supabase.from('brands').update(dbUpdate).eq('id', id);
    if (!error) {
      setBrands(prev => prev.map(b => b.id === id ? { ...b, ...updatedFields, ...(slug && {slug}) } : b));
      return true;
    } else {
      console.error("Error updating brand:", error);
      return false;
    }
  };

  const deleteBrand = async (id) => {
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (!error) setBrands(brands.filter(b => b.id !== id));
  };

  const changeBrandOrder = async (id, newIndex) => {
    const currentIndex = brands.findIndex(b => b.id === id);
    if (currentIndex === -1 || currentIndex === newIndex) return false;

    // Create a new array with the moved item
    const newBrands = [...brands];
    const [movedBrand] = newBrands.splice(currentIndex, 1);
    newBrands.splice(newIndex, 0, movedBrand);

    // Now update all created_at timestamps to enforce the new array order
    const baseTime = Date.now();
    
    // Update local state immediately for snappy UI
    const updatedBrands = newBrands.map((b, idx) => ({
      ...b,
      created_at: new Date(baseTime + idx * 1000).toISOString()
    }));
    setBrands(updatedBrands);

    // Update in Supabase in the background
    for (let i = 0; i < updatedBrands.length; i++) {
      await supabase.from('brands').update({ created_at: updatedBrands[i].created_at }).eq('id', updatedBrands[i].id);
    }
    
    return true;
  };


  const addSet = (set) => {
    const newId = Date.now().toString();
    const newSet = { ...set, id: newId, items: set.items || [], status: set.status || 'draft', scheduledDate: set.scheduledDate || null };
    setSets(prev => [...prev, newSet]);
    
    supabase.from('sets').insert({
      id: newId,
      name: set.name,
      items: newSet.items,
      status: newSet.status,
      main_category: newSet.mainCategory,
      sub_category: newSet.subCategory,
      scheduled_date: newSet.scheduledDate
    }).then(({ error }) => {
      if (error) console.error("Error inserting set:", error);
    });
  };

  const updateSet = (id, updatedData) => {
    setSets(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));

    if (updatedData.isNewIn !== undefined) {
      const nextIds = updatedData.isNewIn
        ? Array.from(new Set([...newInLookbookIds, id]))
        : newInLookbookIds.filter(setId => setId !== id);
      setNewInLookbookIds(nextIds);
      localStorage.setItem('sol_new_in_lookbooks', JSON.stringify(nextIds));
      supabase.from('store_settings').upsert({
        key_name: 'new_in_lookbooks',
        setting_value: nextIds
      }).then(({ error }) => {
        if (error) console.error("Error updating new_in_lookbooks:", error);
      });
    }

    if (updatedData.isViewAll !== undefined) {
      const setObj = sets.find(s => s.id === id);
      const targetMain = updatedData.mainCategory || setObj?.mainCategory || setObj?.main_category;
      if (targetMain) {
        const currentList = curatedViewAllLookbooks[targetMain] || [];
        const nextList = updatedData.isViewAll
          ? Array.from(new Set([...currentList, id]))
          : currentList.filter(setId => setId !== id);
        const nextCuratedObj = {
          ...curatedViewAllLookbooks,
          [targetMain]: nextList
        };
        setCuratedViewAllLookbooks(nextCuratedObj);
        localStorage.setItem('sol_curated_view_all_lookbooks', JSON.stringify(nextCuratedObj));
        supabase.from('store_settings').upsert({
          key_name: 'curated_view_all_lookbooks',
          setting_value: nextCuratedObj
        }).then(({ error }) => {
          if (error) console.error("Error updating curated_view_all_lookbooks:", error);
        });
      }
    }

    if (updatedData.mainCategory !== undefined) {
      const setObj = sets.find(s => s.id === id);
      const oldMain = setObj?.mainCategory || setObj?.main_category;
      if (oldMain && oldMain !== updatedData.mainCategory && (curatedViewAllLookbooks[oldMain] || []).includes(id)) {
        const nextCuratedObj = {
          ...curatedViewAllLookbooks,
          [oldMain]: (curatedViewAllLookbooks[oldMain] || []).filter(setId => setId !== id)
        };
        setCuratedViewAllLookbooks(nextCuratedObj);
        localStorage.setItem('sol_curated_view_all_lookbooks', JSON.stringify(nextCuratedObj));
        supabase.from('store_settings').upsert({
          key_name: 'curated_view_all_lookbooks',
          setting_value: nextCuratedObj
        });
      }
    }
    
    const dbUpdate = {};
    if (updatedData.name !== undefined) dbUpdate.name = updatedData.name;
    if (updatedData.items !== undefined) dbUpdate.items = updatedData.items;
    if (updatedData.status !== undefined) dbUpdate.status = updatedData.status;
    if (updatedData.mainCategory !== undefined) dbUpdate.main_category = updatedData.mainCategory;
    if (updatedData.subCategory !== undefined) dbUpdate.sub_category = updatedData.subCategory;
    if (updatedData.scheduledDate !== undefined) dbUpdate.scheduled_date = updatedData.scheduledDate;

    if (updatedData.created_at !== undefined) dbUpdate.created_at = updatedData.created_at;

    if (Object.keys(dbUpdate).length > 0) {
      supabase.from('sets').update(dbUpdate).eq('id', id).then(({ error }) => {
        if (error) console.error("Error updating set:", error);
      });
    }
  };

  const reorderSets = (setIdA, setIdB, timeA, timeB) => {
    setSets(prev => {
      const idxA = prev.findIndex(s => s.id === setIdA);
      const idxB = prev.findIndex(s => s.id === setIdB);
      if (idxA === -1 || idxB === -1) return prev;

      const newSets = [...prev];
      newSets[idxA] = { ...newSets[idxA], created_at: timeA };
      newSets[idxB] = { ...newSets[idxB], created_at: timeB };

      return newSets.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
    });
  };

  const deleteSet = (id) => {
    setSets(prev => prev.filter(s => s.id !== id));
    if (newInLookbookIds.includes(id)) {
      const nextIds = newInLookbookIds.filter(setId => setId !== id);
      setNewInLookbookIds(nextIds);
      localStorage.setItem('sol_new_in_lookbooks', JSON.stringify(nextIds));
      supabase.from('store_settings').upsert({
        key_name: 'new_in_lookbooks',
        setting_value: nextIds
      });
    }

    let changedCurated = false;
    const updatedCurated = { ...curatedViewAllLookbooks };
    Object.keys(updatedCurated).forEach(cat => {
      if ((updatedCurated[cat] || []).includes(id)) {
        updatedCurated[cat] = updatedCurated[cat].filter(setId => setId !== id);
        changedCurated = true;
      }
    });
    if (changedCurated) {
      setCuratedViewAllLookbooks(updatedCurated);
      localStorage.setItem('sol_curated_view_all_lookbooks', JSON.stringify(updatedCurated));
      supabase.from('store_settings').upsert({
        key_name: 'curated_view_all_lookbooks',
        setting_value: updatedCurated
      });
    }

    supabase.from('sets').delete().eq('id', id).then(({ error }) => {
      if (error) console.error("Error deleting set:", error);
    });
  };

  const toggleCurateSetForViewAll = async (mainCategory, setId) => {
    if (!mainCategory || !setId) return;
    const currentList = curatedViewAllLookbooks[mainCategory] || [];
    const isCurated = currentList.includes(setId);
    const nextList = isCurated
      ? currentList.filter(id => id !== setId)
      : [...currentList, setId];

    const nextCuratedObj = {
      ...curatedViewAllLookbooks,
      [mainCategory]: nextList
    };

    setCuratedViewAllLookbooks(nextCuratedObj);
    localStorage.setItem('sol_curated_view_all_lookbooks', JSON.stringify(nextCuratedObj));
    
    // Update local set state
    setSets(prev => prev.map(s => s.id === setId ? { ...s, isViewAll: !isCurated } : s));

    try {
      await supabase.from('store_settings').upsert({
        key_name: 'curated_view_all_lookbooks',
        setting_value: nextCuratedObj
      });
    } catch (err) {
      console.error("Error updating curated_view_all_lookbooks in store_settings:", err);
    }
    return !isCurated;
  };

  const reorderViewAllSets = async (mainCategory, newOrderedIds) => {
    if (!mainCategory || !Array.isArray(newOrderedIds)) return;
    const nextCuratedObj = {
      ...curatedViewAllLookbooks,
      [mainCategory]: newOrderedIds
    };
    setCuratedViewAllLookbooks(nextCuratedObj);
    localStorage.setItem('sol_curated_view_all_lookbooks', JSON.stringify(nextCuratedObj));

    try {
      await supabase.from('store_settings').upsert({
        key_name: 'curated_view_all_lookbooks',
        setting_value: nextCuratedObj
      });
    } catch (err) {
      console.error("Error updating curated_view_all_lookbooks order:", err);
    }
  };

  const addProductToSet = (setId, productId, layoutSize = 'small') => {
    setSets(sets.map(s => {
      if (s.id === setId) {
        // avoid duplicates
        if (s.items.find(i => i.productId === productId)) return s;
        return { ...s, items: [...s.items, { productId, layoutSize }] };
      }
      return s;
    }));
  };

  const removeProductFromSet = (setId, productId) => {
    setSets(sets.map(s => {
      if (s.id === setId) {
        return { 
          ...s, 
          items: s.items.map(i => {
            if (i.productId === productId) {
               return { productId: `draft-${Date.now()}-${Math.random()}`, layoutSize: i.layoutSize, isHidden: true };
            }
            return i;
          }) 
        };
      }
      return s;
    }));
  };

  const updateProductInSet = (setId, productId, updatedData) => {
    setSets(sets.map(s => {
      if (s.id === setId) {
        return {
          ...s,
          items: s.items.map(i => i.productId === productId ? { ...i, ...updatedData } : i)
        };
      }
      return s;
    }));
  };

  const changeProductOrderInSet = (setId, productId, newIndex, updatedData = null) => {
    setSets(sets.map(s => {
      if (s.id === setId) {
        const currentIndex = s.items.findIndex(i => i.productId === productId);
        if (currentIndex === -1) return s;
        
        const newItems = [...s.items];
        const [moved] = newItems.splice(currentIndex, 1);
        const finalItem = updatedData ? { ...moved, ...updatedData } : moved;
        
        newItems.splice(newIndex, 0, finalItem);
        return { ...s, items: newItems };
      }
      return s;
    }));
  };

  const addProduct = async (product) => {
    const newId = Date.now().toString();
    const newProduct = {
      ...product,
      id: newId,
      uploadDate: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    
    supabase.from('products').insert({
      id: newProduct.id,
      name: newProduct.name,
      price: newProduct.price,
      main_category: newProduct.mainCategory,
      sub_category: newProduct.subCategory,
      cover_image_url: newProduct.coverImage,
      hover_image_url: newProduct.hoverImage,
      gallery_images_urls: newProduct.galleryImages,
      description: newProduct.description,
      status: newProduct.status || 'draft',
      layout_size: newProduct.layoutSize || 'small',
      stock: newProduct.stock,
      size: newProduct.size,
      fit: newProduct.fit,
      hardware: newProduct.hardware,
      heel_height: newProduct.heelHeight
    }).then(({ error }) => {
      if (error) console.error("Error inserting product:", error);
    });
    
    return newProduct;
  };

  const updateProduct = async (id, updatedData) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    
    const dbUpdate = {};
    if (updatedData.name !== undefined) dbUpdate.name = updatedData.name;
    if (updatedData.price !== undefined) dbUpdate.price = updatedData.price;
    if (updatedData.mainCategory !== undefined) dbUpdate.main_category = updatedData.mainCategory;
    if (updatedData.subCategory !== undefined) dbUpdate.sub_category = updatedData.subCategory;
    if (updatedData.coverImage !== undefined) dbUpdate.cover_image_url = updatedData.coverImage;
    if (updatedData.hoverImage !== undefined) dbUpdate.hover_image_url = updatedData.hoverImage;
    if (updatedData.galleryImages !== undefined) dbUpdate.gallery_images_urls = updatedData.galleryImages;
    if (updatedData.description !== undefined) dbUpdate.description = updatedData.description;
    if (updatedData.status !== undefined) dbUpdate.status = updatedData.status;
    if (updatedData.layoutSize !== undefined) dbUpdate.layout_size = updatedData.layoutSize;
    if (updatedData.stock !== undefined) dbUpdate.stock = updatedData.stock;
    if (updatedData.size !== undefined) dbUpdate.size = updatedData.size;
    if (updatedData.fit !== undefined) dbUpdate.fit = updatedData.fit;
    if (updatedData.hardware !== undefined) dbUpdate.hardware = updatedData.hardware;
    if (updatedData.heelHeight !== undefined) dbUpdate.heel_height = updatedData.heelHeight;
    
    if (Object.keys(dbUpdate).length > 0) {
      supabase.from('products').update(dbUpdate).eq('id', id).then(({ error }) => {
        if (error) console.error("Error updating product:", error);
      });
    }
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    supabase.from('products').delete().eq('id', id).then(({ error }) => {
      if (error) console.error("Error deleting product:", error);
    });
  };

  const changeProductOrder = (id, newIndex, updatedData = null) => {
    const currentIndex = products.findIndex(p => p.id === id);
    if (currentIndex === -1) return false;
    if (currentIndex === newIndex && !updatedData) return false;

    const newProducts = [...products];
    const [movedProduct] = newProducts.splice(currentIndex, 1);
    
    const finalProduct = updatedData ? { ...movedProduct, ...updatedData } : movedProduct;
    
    newProducts.splice(newIndex, 0, finalProduct);

    setProducts(newProducts);
    return true;
  };

  const swapProducts = (idA, idB) => {
    if (idA === idB) return false;
    const indexA = products.findIndex(p => p.id === idA);
    const indexB = products.findIndex(p => p.id === idB);
    if (indexA === -1 || indexB === -1) return false;

    // Create shallow copies of the products to avoid mutating state directly
    const newProducts = [...products];
    const productA = { ...newProducts[indexA] };
    const productB = { ...newProducts[indexB] };

    // Swap their positions in the array
    newProducts[indexA] = productB;
    newProducts[indexB] = productA;

    // To maintain the "Slot-based" layout, we must NOT swap their size properties.
    // Meaning the product moving into slot A must adopt slot A's size, and vice versa.
    // Since we just swapped the products, we need to swap their layout properties BACK.
    const tempLayoutSize = newProducts[indexA].layoutSize;
    const tempIsLarge = newProducts[indexA].isLarge;

    newProducts[indexA].layoutSize = newProducts[indexB].layoutSize;
    newProducts[indexA].isLarge = newProducts[indexB].isLarge;

    newProducts[indexB].layoutSize = tempLayoutSize;
    newProducts[indexB].isLarge = tempIsLarge;

    setProducts(newProducts);
    return true;
  };

  const addContentArticle = async (article) => {
    const newId = Date.now().toString();
    const dbArticle = {
      id: newId,
      title: article.title,
      excerpt: article.excerpt || '',
      category: article.category,
      status: article.status || 'Draft',
      is_pinned: article.isPinned || false,
      cover_image_url: article.coverImage || '',
      cover_settings: article.coverSettings || { isVisible: true, showTitle: true },
      thumbnail_image_url: article.thumbnailImage || ''
    };

    const { error } = await supabase.from('content_articles').insert([dbArticle]);
    if (!error) {
      setContentArticles([{ 
        ...article, 
        id: newId,
        date: new Date().toISOString(),
        modules: []
      }, ...contentArticles]);
      return newId;
    } else {
      console.error("Add Article Error:", error);
    }
    return null;
  };

  const updateContentArticle = async (id, updatedData) => {
    const dbArticle = {
      title: updatedData.title,
      excerpt: updatedData.excerpt,
      category: updatedData.category,
      status: updatedData.status,
      is_pinned: updatedData.isPinned,
      cover_image_url: updatedData.coverImage,
      cover_settings: updatedData.coverSettings,
      thumbnail_image_url: updatedData.thumbnailImage
    };
    Object.keys(dbArticle).forEach(key => dbArticle[key] === undefined && delete dbArticle[key]);

    const { error } = await supabase.from('content_articles').update(dbArticle).eq('id', id);
    
    // Update modules if they exist in updatedData
    if (updatedData.modules && !error) {
      // 1. Delete old modules
      await supabase.from('content_modules').delete().eq('article_id', id);
      // 2. Insert new modules
      if (updatedData.modules.length > 0) {
        const dbModules = updatedData.modules.map((m, idx) => ({
          id: m.id || Date.now().toString() + idx,
          article_id: id,
          type: m.type,
          is_visible: m.isVisible,
          sort_order: idx,
          data: m.data
        }));
        const { error: modErr } = await supabase.from('content_modules').insert(dbModules);
        if (modErr) console.error("Error updating modules:", modErr);
      }
    }

    if (!error) {
      setContentArticles(contentArticles.map(a => a.id === id ? { ...a, ...updatedData } : a));
    } else {
      console.error("Update Article Error:", error);
    }
  };

  const deleteContentArticle = async (id) => {
    const { error } = await supabase.from('content_articles').delete().eq('id', id);
    if (!error) {
      setContentArticles(contentArticles.filter(a => a.id !== id));
    }
  };

  const changeContentOrder = async (category, id, newIndex) => {
    const categoryArticles = contentArticles.filter(a => a.category === category);
    const sorted = [...categoryArticles].sort((a, b) => {
      if (category !== 'lenses') {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
      }
      return new Date(b.date) - new Date(a.date);
    });

    const currentIndex = sorted.findIndex(a => a.id === id);
    if (currentIndex === -1 || currentIndex === newIndex) return false;

    const [moved] = sorted.splice(currentIndex, 1);
    sorted.splice(newIndex, 0, moved);

    const baseTime = Date.now();
    const updatedSubset = sorted.map((a, idx) => ({
      ...a,
      date: new Date(baseTime - idx * 1000).toISOString()
    }));

    setContentArticles(prev => prev.map(a => {
      const updated = updatedSubset.find(u => u.id === a.id);
      return updated ? updated : a;
    }));

    for (let item of updatedSubset) {
      await supabase.from('content_articles').update({ publish_date: item.date }).eq('id', item.id);
    }
    return true;
  };


  
  const addHomepageGridItem = async (item) => {
    const newId = crypto.randomUUID();
    const dbItem = {
      id: newId,
      layout_size: item.layoutSize || '1x1',
      content_type: item.contentType || 'placeholder',
      content_data: item.contentData || {},
      grid_index: item.gridIndex || homepageGridItems.length
    };
    
    const { error } = await supabase.from('homepage_grid_items').insert([dbItem]);
    if (!error) {
      setHomepageGridItems(prev => [...prev, {
        id: newId,
        layoutSize: dbItem.layout_size,
        contentType: dbItem.content_type,
        contentData: dbItem.content_data,
        gridIndex: dbItem.grid_index
      }]);
    } else {
      console.error("Error adding grid item:", error);
    }
  };

  const updateHomepageGridItem = async (id, updates) => {
    const dbUpdates = {};
    if (updates.layoutSize !== undefined) dbUpdates.layout_size = updates.layoutSize;
    if (updates.contentType !== undefined) dbUpdates.content_type = updates.contentType;
    if (updates.contentData !== undefined) dbUpdates.content_data = updates.contentData;
    if (updates.gridIndex !== undefined) dbUpdates.grid_index = updates.gridIndex;

    setHomepageGridItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    const { error } = await supabase.from('homepage_grid_items').update(dbUpdates).eq('id', id);
    if (error) console.error("Error updating grid item:", error);
  };

  const deleteHomepageGridItem = async (id) => {
    setHomepageGridItems(prev => prev.filter(item => item.id !== id));
    await supabase.from('homepage_grid_items').delete().eq('id', id);
  };

  const updateGridOrder = async (newItemsOrder) => {
    setHomepageGridItems(newItemsOrder);
    
    // Bulk update positions, layout_size, and content_data
    for (let i = 0; i < newItemsOrder.length; i++) {
      await supabase.from('homepage_grid_items').update({ 
        grid_index: i,
        layout_size: newItemsOrder[i].layoutSize,
        content_data: newItemsOrder[i].contentData
      }).eq('id', newItemsOrder[i].id);
    }
  };

  // Helper to persist homepage collections to state, localStorage, and store_settings in Supabase
  const saveHomepageCollections = async (newCollections) => {
    setHomepageCollections(newCollections);
    try {
      localStorage.setItem('sol_homepage_collections_v1', JSON.stringify(newCollections));
    } catch (e) {}

    const { error } = await supabase
      .from('store_settings')
      .upsert({ key_name: 'homepage_collections_v1', setting_value: newCollections });

    if (error) {
      console.error("Error saving homepage collections to Supabase:", error);
    }
  };

  // Create a new Draft Homepage Collection (optionally cloning layout from another collection)
  const createHomepageDraft = async (name, cloneFromId = null) => {
    const newId = 'home-col-' + Date.now();
    let initialItems = [];
    if (cloneFromId) {
      const sourceCol = homepageCollections.find(c => c.id === cloneFromId);
      if (sourceCol && sourceCol.items) {
        initialItems = JSON.parse(JSON.stringify(sourceCol.items));
      }
    } else if (homepageGridItems.length > 0) {
      // Default fallback clone from current grid items
      initialItems = JSON.parse(JSON.stringify(homepageGridItems));
    }

    const newCollection = {
      id: newId,
      name: name?.trim() || 'Untitled Draft',
      status: 'draft',
      items: initialItems,
      updated_at: new Date().toISOString()
    };

    const updatedCollections = [...homepageCollections, newCollection];
    await saveHomepageCollections(updatedCollections);
    return newCollection;
  };

  // Publish a Homepage Collection (Enforces Single-Active Rule: ONLY 1 collection can be published)
  const publishHomepageCollection = async (collectionId) => {
    const targetCol = homepageCollections.find(c => c.id === collectionId);
    if (!targetCol) return false;

    // Set target to 'published', automatically relegate all others to 'draft'
    const updatedCollections = homepageCollections.map(c => ({
      ...c,
      status: c.id === collectionId ? 'published' : 'draft',
      updated_at: c.id === collectionId ? new Date().toISOString() : c.updated_at
    }));

    await saveHomepageCollections(updatedCollections);

    // Sync published items to homepage_grid_items for backward compatibility
    if (targetCol.items && targetCol.items.length > 0) {
      try {
        await supabase.from('homepage_grid_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const dbItems = targetCol.items.map((item, idx) => ({
          id: item.id || crypto.randomUUID(),
          layout_size: item.layoutSize || item.layout_size || '1x1',
          content_type: item.contentType || item.content_type || 'placeholder',
          content_data: item.contentData || item.content_data || {},
          grid_index: idx
        }));
        await supabase.from('homepage_grid_items').insert(dbItems);
        setHomepageGridItems(targetCol.items);
      } catch (syncErr) {
        console.warn("Could not sync to legacy homepage_grid_items:", syncErr);
      }
    }

    return true;
  };

  // Update a Homepage Collection (rename, update items, layout changes)
  const updateHomepageCollection = async (collectionId, updates) => {
    const updatedCollections = homepageCollections.map(c => {
      if (c.id !== collectionId) return c;
      return {
        ...c,
        ...updates,
        updated_at: new Date().toISOString()
      };
    });

    await saveHomepageCollections(updatedCollections);

    // If updating the currently published collection, keep homepageGridItems in sync
    const updatedCol = updatedCollections.find(c => c.id === collectionId);
    if (updatedCol && updatedCol.status === 'published' && updates.items) {
      setHomepageGridItems(updates.items);
    }
  };

  // Delete a Draft Homepage Collection (cannot delete the published one)
  const deleteHomepageDraft = async (collectionId) => {
    const targetCol = homepageCollections.find(c => c.id === collectionId);
    if (!targetCol || targetCol.status === 'published') return false;

    const updatedCollections = homepageCollections.filter(c => c.id !== collectionId);
    await saveHomepageCollections(updatedCollections);
    return true;
  };

  const updateHomepageModule = async (id, updatedFields) => {
    const dbUpdate = {};
    if (updatedFields.data !== undefined) dbUpdate.data = updatedFields.data;
    if (updatedFields.isVisible !== undefined) dbUpdate.is_visible = updatedFields.isVisible;
    if (updatedFields.displayOrder !== undefined) dbUpdate.display_order = updatedFields.displayOrder;
    if (updatedFields.type !== undefined) dbUpdate.type = updatedFields.type;

    const { error } = await supabase.from('homepage_modules').update(dbUpdate).eq('id', id);
    if (!error) {
      setHomepageModules(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
    } else {
      console.error("Error updating homepage module:", error);
    }
  };

  const addHomepageModule = async (module) => {
    const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    const dbModule = {
      id: newId,
      type: module.type,
      data: module.data || {},
      is_visible: module.isVisible !== false,
      display_order: module.displayOrder || homepageModules.length
    };
    
    const { error } = await supabase.from('homepage_modules').insert([dbModule]);
    if (!error) {
      setHomepageModules(prev => [...prev, {
        id: newId,
        type: dbModule.type,
        data: dbModule.data,
        isVisible: dbModule.is_visible,
        displayOrder: dbModule.display_order
      }]);
    } else {
      console.error("Error adding homepage module:", error);
    }
  };

  const deleteHomepageModule = async (id) => {
    const { error } = await supabase.from('homepage_modules').delete().eq('id', id);
    if (!error) {
      setHomepageModules(prev => prev.filter(m => m.id !== id));
    } else {
      console.error("Error deleting homepage module:", error);
    }
  };

  const reorderHomepageModules = async (newModulesArray) => {
    // Optimistic update
    setHomepageModules(newModulesArray);
    
    // Update DB
    for (let i = 0; i < newModulesArray.length; i++) {
      await supabase.from('homepage_modules')
        .update({ display_order: i })
        .eq('id', newModulesArray[i].id);
    }
  };

  const value = {

    brands,
    products,
    sets,
    newInLookbookIds,
    curatedViewAllLookbooks,
    toggleCurateSetForViewAll,
    reorderViewAllSets,
    contentArticles,
    homepageModules,
    homepageGridItems,
    homepageCollections,
    homepageCollectionsLoaded,
    createHomepageDraft,
    publishHomepageCollection,
    updateHomepageCollection,
    deleteHomepageDraft,
    addHomepageGridItem,
    updateHomepageGridItem,
    deleteHomepageGridItem,
    updateGridOrder,
    updateHomepageModule,
    addHomepageModule,
    deleteHomepageModule,
    reorderHomepageModules,
    loading,
    isAdminAuthenticated,
    loginAdmin,

    logoutAdmin,
    addSet,
    updateSet,
    deleteSet,
    reorderSets,
    addProductToSet,
    removeProductFromSet,
    updateProductInSet,
    changeProductOrderInSet,
    addBrand,
    updateBrand,
    deleteBrand,
    changeBrandOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    changeProductOrder,
    swapProducts,
    categories,
    addCategory,
    addSubCategory,
    editCategory,
    editSubCategory,
    deleteCategory,
    deleteSubCategory,
    reorderCategories,
    reorderSubCategories,
    addContentArticle,
    updateContentArticle,
    deleteContentArticle,
    changeContentOrder,
    refreshData: fetchAllData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
