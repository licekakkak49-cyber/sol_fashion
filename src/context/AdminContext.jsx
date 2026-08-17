import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const MOCK_PRODUCTS = [
  // Block 1
  { id: '1', name: 'Alemais Outfit 1', price: '450 USD', layoutSize: 'small', image: 'https://cdn.shopify.com/s/files/1/0457/2990/6847/files/8084D_1200x.jpg?v=1784181396', uploadDate: new Date().toISOString() },
  { id: '2', name: 'Alemais Outfit 2', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/8230A-1_6000x.jpg?v=1783657629', hoverImage: 'https://alemais.com/cdn/shop/files/8230A_ACE_1_6000x.jpg?v=1783657630', uploadDate: new Date().toISOString() },
  { id: '3', name: 'Alemais Outfit 3', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/8115T_49da3fae-0b9d-4d8e-b663-0f16b8c34c71_6000x.jpg?v=1786332736', hoverImage: 'https://alemais.com/cdn/shop/files/8115T_KENNY_1_6000x.jpg?v=1783653708', uploadDate: new Date().toISOString() },
  { id: '4', name: 'Alemais Outfit 4', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/alemais-sustainable-pant-spur-denim-cropped-jean-1253882886_6000x.jpg?v=1786476495', hoverImage: 'https://alemais.com/cdn/shop/files/alemais-sustainable-pant-spur-denim-cropped-jean-1253882888_6000x.jpg?v=1786476442', uploadDate: new Date().toISOString() },
  { id: '5', name: 'Alemais Hero Look', price: '850 USD', layoutSize: 'large', image: 'https://alemais.com/cdn/shop/files/Disruptor_-_2_rows_3.jpg?v=1786331368&width=2000', uploadDate: new Date().toISOString() },
  // Block 2
  { id: '6', name: 'Alemais Outfit 5', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/alemais-sustainable-jacket-spur-denim-jacket-1253883487_6000x.jpg?v=1786475956', hoverImage: 'https://alemais.com/cdn/shop/files/alemais-sustainable-jacket-spur-denim-jacket-1253883492_6000x.jpg?v=1786475777', uploadDate: new Date().toISOString() },
  { id: '7', name: 'Alemais Outfit 6', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/8116S_2b259435-913b-40d0-820f-da3729472494_6000x.jpg?v=1786333610', hoverImage: 'https://alemais.com/cdn/shop/files/8116S_KENNY_1_6000x.jpg?v=1783653964', uploadDate: new Date().toISOString() },
  { id: '8', name: 'Alemais Outfit 7', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/8074D_6000x.jpg?v=1783653185', hoverImage: 'https://alemais.com/cdn/shop/files/8074D_EZRA_1_6000x.jpg?v=1783653185', uploadDate: new Date().toISOString() },
  { id: '9', name: 'Alemais Outfit 8', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/alemais-sustainable-short-spur-denim-micro-short-1253883483_6000x.jpg?v=1786475241', hoverImage: 'https://alemais.com/cdn/shop/files/alemais-sustainable-short-spur-denim-micro-short-1253883482_6000x.jpg?v=1786475191', uploadDate: new Date().toISOString() },
  { id: '10', name: 'Alemais Outfit 9', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/alemais-sustainable-top-winifred-lace-blouse-1253883444_6000x.jpg?v=1786474157', hoverImage: 'https://alemais.com/cdn/shop/files/alemais-sustainable-top-winifred-lace-blouse-1253883443_6000x.jpg?v=1786474101', uploadDate: new Date().toISOString() },
  { id: '11', name: 'Alemais Outfit 10', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/8075D_8cd95c7d-e125-4db9-a3e2-98804190e2d3_6000x.jpg?v=1786073558', hoverImage: 'https://alemais.com/cdn/shop/files/8075D_EZRA_1_6000x.jpg?v=1783653104', uploadDate: new Date().toISOString() },
  { id: '12', name: 'Alemais Outfit 11', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/8076D_c7fc4759-d747-4c18-bf25-389f7b0219b0_6000x.jpg?v=1786332923', hoverImage: 'https://alemais.com/cdn/shop/files/8076D_EZRA_1_6000x.jpg?v=1783653145', uploadDate: new Date().toISOString() },
  { id: '13', name: 'Alemais Outfit 12', price: '450 USD', layoutSize: 'small', image: 'https://alemais.com/cdn/shop/files/7988D_6000x.jpg?v=1786473375', hoverImage: 'https://alemais.com/cdn/shop/files/alemais-sustainable-dress-mini-winifred-lace-mini-dress-1253883431_6000x.jpg?v=1786473267', uploadDate: new Date().toISOString() }
];

export const AdminProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('sol_products_v4');
    let parsed = saved ? JSON.parse(saved) : MOCK_PRODUCTS;
    
    // Auto-inject the new items if they don't exist yet
    if (!parsed.find(p => p.id === '8')) {
      const existingIds = parsed.map(p => p.id);
      const newMocks = MOCK_PRODUCTS.filter(p => !existingIds.includes(p.id));
      parsed = [...parsed, ...newMocks];
    }

    // Auto-inject demo tags
    parsed = parsed.map(p => {
      const newP = { ...p };
      
      if (!newP.tags) newP.tags = [];
      
      if (['1', '2'].includes(p.id)) {
        if (!newP.tags.includes('NEW')) newP.tags.push('NEW');
      } else {
        // Randomly assign NEW to about 40% of the rest
        if (Math.random() < 0.4 && !newP.tags.includes('NEW')) {
          newP.tags.push('NEW');
        }
      }
      
      if (p.id === '2') {
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

      // Assign categories for testing
      if (!newP.mainCategory) {
        const defaultCats = {
          'Bags': ['Mini Bags', 'Shoulder Bags', 'Totes', 'Crossbody'],
          'Shoes': ['Heels', 'Flats', 'Sneakers', 'Boots'],
          'Ready-to-Wear': ['Dresses', 'Tops', 'Skirts', 'Outerwear'],
          'Accessories': ['Sunglasses', 'Jewelry', 'Hats', 'Belts']
        };
        const mainKeys = Object.keys(defaultCats);
        let randomMain = mainKeys[Math.floor(Math.random() * mainKeys.length)];
        
        // Let's manually map some known mock products for better realism
        if (p.name.includes('Bag') || p.name.includes('basket')) randomMain = 'Bags';
        else if (p.name.includes('bikini') || p.name.includes('Dress') || p.name.includes('skirt') || p.name.includes('Skirt')) randomMain = 'Ready-to-Wear';
        else if (p.name.includes('sunglasses')) randomMain = 'Accessories';
        else if (p.name.includes('Mules')) randomMain = 'Shoes';

        newP.mainCategory = randomMain;
        
        const subs = defaultCats[randomMain];
        newP.subCategory = subs[Math.floor(Math.random() * subs.length)];
      }
      
      return newP;
    });
    
    return parsed;
  });
  
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sol_categories');
    return saved ? JSON.parse(saved) : {
      'Bags': ['Mini Bags', 'Shoulder Bags', 'Totes', 'Crossbody'],
      'Shoes': ['Heels', 'Flats', 'Sneakers', 'Boots'],
      'Ready-to-Wear': ['Dresses', 'Tops', 'Skirts', 'Outerwear'],
      'Accessories': ['Sunglasses', 'Jewelry', 'Hats', 'Belts']
    };
  });

  useEffect(() => {
    localStorage.setItem('sol_categories', JSON.stringify(categories));
  }, [categories]);

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
    localStorage.setItem('sol_products_v4', JSON.stringify(products));
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
    swapProducts,
    categories,
    addCategory,
    addSubCategory,
    editCategory,
    editSubCategory,
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
