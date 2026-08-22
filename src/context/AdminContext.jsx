import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const MOCK_PRODUCTS = [
  {"id": "1", "name": "Classic Mini Tote", "price": 8697, "stock": 8, "mainCategory": "Bags", "subCategory": "Bags", "status": "active", "layoutSize": "large", "image": "https://alemais.com/cdn/shop/files/7988D_6000x.jpg?v=1786473375", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "2", "name": "Canvas Shoulder Bag", "price": 1948, "stock": 4, "mainCategory": "Bags", "subCategory": "Bags", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/Disruptor_-_2_rows_3.jpg?v=1786331368&width=2000", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "3", "name": "Leather Tote", "price": 1477, "stock": 0, "mainCategory": "Bags", "subCategory": "Bags", "status": "draft", "layoutSize": "large", "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-top-winifred-lace-blouse-1253883444_6000x.jpg?v=1786474157", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "4", "name": "Everyday Crossbody", "price": 7463, "stock": 29, "mainCategory": "Bags", "subCategory": "Bags", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8230A-1_6000x.jpg?v=1783657629", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "5", "name": "Woven Beach Tote", "price": 7742, "stock": 35, "mainCategory": "Bags", "subCategory": "Bags", "status": "draft", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-jacket-spur-denim-jacket-1253883487_6000x.jpg?v=1786475956", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "6", "name": "Quilted Mini Bag", "price": 8078, "stock": 34, "mainCategory": "Bags", "subCategory": "Bags", "status": "draft", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8076D_c7fc4759-d747-4c18-bf25-389f7b0219b0_6000x.jpg?v=1786332923", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "7", "name": "Slouchy Shoulder Bag", "price": 1935, "stock": 32, "mainCategory": "Bags", "subCategory": "Bags", "status": "draft", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8116S_2b259435-913b-40d0-820f-da3729472494_6000x.jpg?v=1786333610", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "8", "name": "Strappy Heels", "price": 4469, "stock": 6, "mainCategory": "Shoes", "subCategory": "Shoes", "status": "draft", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8115T_49da3fae-0b9d-4d8e-b663-0f16b8c34c71_6000x.jpg?v=1786332736", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "9", "name": "Ballet Flats", "price": 8776, "stock": 0, "mainCategory": "Shoes", "subCategory": "Shoes", "status": "active", "layoutSize": "small", "image": "https://cdn.shopify.com/s/files/1/0457/2990/6847/files/8084D_1200x.jpg?v=1784181396", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "10", "name": "Chunky Sneakers", "price": 6489, "stock": 31, "mainCategory": "Shoes", "subCategory": "Shoes", "status": "draft", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-pant-spur-denim-cropped-jean-1253882886_6000x.jpg?v=1786476495", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "11", "name": "Ankle Boots", "price": 2944, "stock": 0, "mainCategory": "Shoes", "subCategory": "Shoes", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-jacket-spur-denim-jacket-1253883487_6000x.jpg?v=1786475956", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "12", "name": "Platform Sneakers", "price": 7470, "stock": 5, "mainCategory": "Shoes", "subCategory": "Shoes", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8115T_49da3fae-0b9d-4d8e-b663-0f16b8c34c71_6000x.jpg?v=1786332736", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "13", "name": "Suede Knee Boots", "price": 6667, "stock": 0, "mainCategory": "Shoes", "subCategory": "Shoes", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-pant-spur-denim-cropped-jean-1253882886_6000x.jpg?v=1786476495", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "14", "name": "Pointed Toe Flats", "price": 1202, "stock": 38, "mainCategory": "Shoes", "subCategory": "Shoes", "status": "draft", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8075D_8cd95c7d-e125-4db9-a3e2-98804190e2d3_6000x.jpg?v=1786073558", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "15", "name": "Floral Midi Dress", "price": 2493, "stock": 19, "mainCategory": "Ready-to-Wear", "subCategory": "Maxi Dress", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8116S_2b259435-913b-40d0-820f-da3729472494_6000x.jpg?v=1786333610", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "16", "name": "Silk Slip Dress", "price": 5192, "stock": 0, "mainCategory": "Ready-to-Wear", "subCategory": "Maxi Dress", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/7988D_6000x.jpg?v=1786473375", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "17", "name": "Ribbed Knit Top", "price": 6825, "stock": 21, "mainCategory": "Ready-to-Wear", "subCategory": "Shirt", "status": "draft", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8230A-1_6000x.jpg?v=1783657629", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "18", "name": "Linen Button Down", "price": 8164, "stock": 38, "mainCategory": "Ready-to-Wear", "subCategory": "Shirt", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8076D_c7fc4759-d747-4c18-bf25-389f7b0219b0_6000x.jpg?v=1786332923", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "19", "name": "Pleated Maxi Skirt", "price": 3613, "stock": 23, "mainCategory": "Ready-to-Wear", "subCategory": "Skirt", "status": "draft", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8075D_8cd95c7d-e125-4db9-a3e2-98804190e2d3_6000x.jpg?v=1786073558", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "20", "name": "Denim Mini Skirt", "price": 1650, "stock": 7, "mainCategory": "Ready-to-Wear", "subCategory": "Skirt", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8115T_49da3fae-0b9d-4d8e-b663-0f16b8c34c71_6000x.jpg?v=1786332736", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "21", "name": "Oversized Blazer", "price": 7377, "stock": 0, "mainCategory": "Ready-to-Wear", "subCategory": "Shirt", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8115T_49da3fae-0b9d-4d8e-b663-0f16b8c34c71_6000x.jpg?v=1786332736", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "22", "name": "Trench Coat", "price": 2636, "stock": 32, "mainCategory": "Ready-to-Wear", "subCategory": "Shirt", "status": "active", "layoutSize": "large", "image": "https://alemais.com/cdn/shop/files/8076D_c7fc4759-d747-4c18-bf25-389f7b0219b0_6000x.jpg?v=1786332923", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "23", "name": "Cat Eye Sunglasses", "price": 3679, "stock": 0, "mainCategory": "Accessories", "subCategory": "Others", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-top-winifred-lace-blouse-1253883444_6000x.jpg?v=1786474157", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "24", "name": "Oversized Aviators", "price": 2739, "stock": 4, "mainCategory": "Accessories", "subCategory": "Others", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-jacket-spur-denim-jacket-1253883487_6000x.jpg?v=1786475956", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "25", "name": "Gold Hoop Earrings", "price": 2646, "stock": 38, "mainCategory": "Accessories", "subCategory": "Others", "status": "draft", "layoutSize": "large", "image": "https://alemais.com/cdn/shop/files/8116S_2b259435-913b-40d0-820f-da3729472494_6000x.jpg?v=1786333610", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "26", "name": "Layered Necklace", "price": 3971, "stock": 0, "mainCategory": "Accessories", "subCategory": "Others", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-top-winifred-lace-blouse-1253883444_6000x.jpg?v=1786474157", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "27", "name": "Straw Sun Hat", "price": 3871, "stock": 0, "mainCategory": "Accessories", "subCategory": "Head Piece", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/alemais-sustainable-pant-spur-denim-cropped-jean-1253882886_6000x.jpg?v=1786476495", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "28", "name": "Leather Waist Belt", "price": 7192, "stock": 8, "mainCategory": "Accessories", "subCategory": "Others", "status": "draft", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8230A-1_6000x.jpg?v=1783657629", "uploadDate": "2026-08-20T10:00:00.000Z"},
  {"id": "29", "name": "Classic Buckle Belt", "price": 4782, "stock": 29, "mainCategory": "Accessories", "subCategory": "Others", "status": "active", "layoutSize": "small", "image": "https://alemais.com/cdn/shop/files/8076D_c7fc4759-d747-4c18-bf25-389f7b0219b0_6000x.jpg?v=1786332923", "uploadDate": "2026-08-20T10:00:00.000Z"},
];


export const AdminProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  
  const [sets, setSets] = useState(() => {
    const saved = localStorage.getItem('sol_sets_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sol_sets_v1', JSON.stringify(sets));
  }, [sets]);

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('sol_products_v6');
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
          hoverImage: p.hover_image_url,
          galleryImages: p.gallery_images_urls || [],
          layoutSize: p.layout_size,
          heelHeight: p.heel_height
        })));
      }

      // Fetch Sets
      const { data: setsData } = await supabase.from('sets').select('*').order('created_at', { ascending: false });
      if (setsData && setsData.length > 0) {
        setSets(setsData.map(s => ({
          ...s,
          mainCategory: s.main_category,
          subCategory: s.sub_category,
          scheduledDate: s.scheduled_date
        })));
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

  useEffect(() => {
    try { localStorage.setItem('sol_products_v6', JSON.stringify(products)); } catch (e) { console.error('LocalStorage Quota Exceeded:', e); alert('Storage limit reached! Please delete some old products to free up space.'); }
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
    
    const dbUpdate = {};
    if (updatedData.name !== undefined) dbUpdate.name = updatedData.name;
    if (updatedData.items !== undefined) dbUpdate.items = updatedData.items;
    if (updatedData.status !== undefined) dbUpdate.status = updatedData.status;
    if (updatedData.mainCategory !== undefined) dbUpdate.main_category = updatedData.mainCategory;
    if (updatedData.subCategory !== undefined) dbUpdate.sub_category = updatedData.subCategory;
    if (updatedData.scheduledDate !== undefined) dbUpdate.scheduled_date = updatedData.scheduledDate;

    if (Object.keys(dbUpdate).length > 0) {
      supabase.from('sets').update(dbUpdate).eq('id', id).then(({ error }) => {
        if (error) console.error("Error updating set:", error);
      });
    }
  };

  const deleteSet = (id) => {
    setSets(prev => prev.filter(s => s.id !== id));
    supabase.from('sets').delete().eq('id', id).then(({ error }) => {
      if (error) console.error("Error deleting set:", error);
    });
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

  const value = {

    brands,
    products,
    sets,
    contentArticles,
    loading,
    isAdminAuthenticated,
    loginAdmin,

    logoutAdmin,
    addSet,
    updateSet,
    deleteSet,
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
