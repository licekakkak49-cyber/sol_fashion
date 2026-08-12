import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const MOCK_PRODUCTS = [
  { id: '1', name: 'The Triangle bikini top', price: '225 USD', isLarge: false, image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw66f02643/26ETOW00914AW000963HD_17.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '2', name: 'The small Soli Ibiza Resort basket', price: '595 USD', isLarge: false, image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw757c19ae/26HBAW00044AC01C272DE_17.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '3', name: 'The Mimosa sunglasses', price: '445 USD', isLarge: false, image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dwdfc242c5/26HEYU00072AMAC001810_17.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '4', name: 'The Voile skirt', price: '625 USD', isLarge: false, image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw68248fca/26ESKW00677AK00322520_30.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '5', name: 'Le Maillot bikini', price: '250 USD', isLarge: true, layoutSize: 'large', image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw040b3344/MAILLOT-TRIANGLE-PRINT-DOTS-NAVY.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '6', name: 'The Les Mules', price: '725 USD', layoutSize: 'small', image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw5b68dd32/26EACW00756BW00329142_19.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '7', name: 'The Le Bisou Bag', price: '850 USD', layoutSize: 'small', image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw9767c278/26EBAU00417BW00513150_17.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '8', name: 'The La Robe Dress', price: '920 USD', layoutSize: 'small', image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw4763ed24/26EOPW00050AW00096850_18.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '9', name: 'The La Jupe Skirt', price: '540 USD', layoutSize: 'small', image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw912aa6f4/25ESKW00084BW00565850_17.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '10', name: 'The Triangle bikini top (2)', price: '225 USD', isLarge: false, image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw66f02643/26ETOW00914AW000963HD_17.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '11', name: 'The small Soli Ibiza Resort basket (2)', price: '595 USD', isLarge: false, image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw757c19ae/26HBAW00044AC01C272DE_17.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '12', name: 'The Mimosa sunglasses (2)', price: '445 USD', isLarge: false, image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dwdfc242c5/26HEYU00072AMAC001810_17.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '13', name: 'The Voile skirt (2)', price: '625 USD', isLarge: false, image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw68248fca/26ESKW00677AK00322520_30.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '14', name: 'Le Maillot bikini (2)', price: '250 USD', isLarge: true, layoutSize: 'large', image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw040b3344/MAILLOT-TRIANGLE-PRINT-DOTS-NAVY.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '15', name: 'The Les Mules (2)', price: '725 USD', layoutSize: 'small', image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw5b68dd32/26EACW00756BW00329142_19.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '16', name: 'The Le Bisou Bag (2)', price: '850 USD', layoutSize: 'small', image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw9767c278/26EBAU00417BW00513150_17.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '17', name: 'The La Robe Dress (2)', price: '920 USD', layoutSize: 'small', image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw4763ed24/26EOPW00050AW00096850_18.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
  { id: '18', name: 'The La Jupe Skirt (2)', price: '540 USD', layoutSize: 'small', image: 'https://www.jacquemus.com/dw/image/v2/BJFJ_PRD/on/demandware.static/-/Sites-master-jacquemus/default/dw912aa6f4/25ESKW00084BW00565850_17.jpg?sw=881&q=100', uploadDate: new Date().toISOString() },
];

export const AdminProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('sol_products');
    let parsed = saved ? JSON.parse(saved) : MOCK_PRODUCTS;
    
    // Auto-inject the new items if they don't exist yet
    if (!parsed.find(p => p.id === '10')) {
      const existingIds = parsed.map(p => p.id);
      const newMocks = MOCK_PRODUCTS.filter(p => !existingIds.includes(p.id));
      parsed = [...parsed, ...newMocks];
    }

    // Auto-inject demo tags for product 1 and 2
    parsed = parsed.map(p => {
      if (p.id === '1') return { ...p, tags: ['NEW'] };
      
      const newP = { ...p };
      
      if (p.id === '2') {
        newP.tags = ['NEW'];
        newP.colors = ['#8b5a2b', '#000000', '#d4af37', '#f5f5dc', '#ffc0cb'];
        newP.selectedColor = '#f5f5dc';
        newP.extraColorsCount = 2;
      }
      
      // Randomly inject colors into some other products
      if (['4', '7'].includes(p.id)) {
        newP.colors = ['#000000', '#ffffff'];
        newP.selectedColor = '#000000';
      }
      
      if (p.id === '5') {
        newP.colors = ['#ff0000', '#00ff00', '#0000ff'];
        newP.selectedColor = '#ff0000';
        newP.extraColorsCount = 1;
      }

      if (['8', '11'].includes(p.id)) {
        newP.colors = ['#e8e2d6'];
        newP.selectedColor = '#e8e2d6';
      }
      
      return newP;
    });
    
    return parsed;
  });
  const [contentArticles, setContentArticles] = useState([]);
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

      // 2. Fetch Products (BYPASSED - Using LocalStorage instead)
      /* 
      const { data: productsData } = await supabase.from('products').select('*').order('upload_date', { ascending: false });
      if (productsData) {
        ...
      }
      */

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

  useEffect(() => {
    localStorage.setItem('sol_products', JSON.stringify(products));
  }, [products]);

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

  const addProduct = async (product) => {
    const newId = Date.now().toString();
    const newProduct = {
      ...product,
      id: newId,
      uploadDate: new Date().toISOString()
    };
    // Update local state, useEffect will sync to localStorage
    setProducts([...products, newProduct]);
  };

  const updateProduct = async (id, updatedData) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = async (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const changeProductOrder = (id, newIndex) => {
    const currentIndex = products.findIndex(p => p.id === id);
    if (currentIndex === -1 || currentIndex === newIndex) return false;

    const newProducts = [...products];
    const [movedProduct] = newProducts.splice(currentIndex, 1);
    newProducts.splice(newIndex, 0, movedProduct);

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

  const value = {
    brands,
    products,
    contentArticles,
    loading,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    addBrand,
    updateBrand,
    deleteBrand,
    changeBrandOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    changeProductOrder,
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
