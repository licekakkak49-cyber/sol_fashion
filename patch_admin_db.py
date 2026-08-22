import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

# 1. Update fetchAllData (products and sets)
old_fetch = """      // 2. Fetch Products (BYPASSED - Using LocalStorage instead)
      /* 
      const { data: productsData } = await supabase.from('products').select('*').order('upload_date', { ascending: false });
      if (productsData) {
        ...
      }
      */"""

new_fetch = """      // 2. Fetch Products
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
          scheduledDate: s.scheduled_date
        })));
      }"""

c = c.replace(old_fetch, new_fetch)

# 2. Update Set Mutators
old_set_mutators = """  const addSet = (set) => {
    const newId = Date.now().toString();
    const newSet = { ...set, id: newId, items: set.items || [], status: set.status || 'draft', scheduledDate: set.scheduledDate || null };
    setSets([...sets, newSet]);
  };

  const updateSet = (id, updatedData) => {
    setSets(sets.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteSet = (id) => {
    setSets(sets.filter(s => s.id !== id));
  };"""

new_set_mutators = """  const addSet = (set) => {
    const newId = Date.now().toString();
    const newSet = { ...set, id: newId, items: set.items || [], status: set.status || 'draft', scheduledDate: set.scheduledDate || null };
    setSets(prev => [...prev, newSet]);
    
    supabase.from('sets').insert({
      id: newId,
      name: set.name,
      items: newSet.items,
      status: newSet.status,
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
  };"""

c = c.replace(old_set_mutators, new_set_mutators)

# 3. Update Product Mutators
old_product_mutators = """  const addProduct = async (product) => {
    const newId = Date.now().toString();
    const newProduct = {
      ...product,
      id: newId,
      uploadDate: new Date().toISOString()
    };
    // Update local state, useEffect will sync to localStorage
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = async (id, updatedData) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = async (id) => {
    setProducts(products.filter(p => p.id !== id));
  };"""

new_product_mutators = """  const addProduct = async (product) => {
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
  };"""

c = c.replace(old_product_mutators, new_product_mutators)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
