with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

import re

# Add imports
c = c.replace("import ProductEditorDrawer from './components/ProductEditorDrawer';", "import ProductEditorDrawer from './components/ProductEditorDrawer';\nimport { supabase } from '../utils/supabaseClient';")

# We will rewrite handleSaveProduct completely
old_save = """  const handleSaveProduct = async (payload) => {
    const isPlaceholder = payload.id && payload.id.startsWith('draft-');
    let finalId = payload.id;
    
    if (isPlaceholder || !payload.id) {
      const newPayload = { ...payload };
      delete newPayload.id;
      const added = await addProduct(newPayload);
      finalId = added.id;
      
      if (editorConfig.targetSetId && isPlaceholder) {
        updateProductInSet(editorConfig.targetSetId, payload.id, { productId: finalId, isHidden: false });
      }
    } else {
      updateProduct(payload.id, payload);
    }
  };"""

new_save = """  const handleSaveProduct = async (payload) => {
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
      // Temporary hack: fallback to old context to keep UI updated until we refactor the fetch query
      // (This will be removed in the next step when we fetch from Supabase)
    } catch (e) {
      console.error('Supabase Error:', e);
      alert('Error saving to database. Check console.');
    }
  };"""

c = c.replace(old_save, new_save)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)

