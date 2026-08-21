with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

import re

# We need to add useEffect to fetch from Supabase
old_use_admin = """  const { 
    products, 
    sets,
    categories,
    brands,
    deleteProduct,
    deleteSet,
    changeProductOrder,
    updateProductInSet
  } = useAdmin();"""

new_use_admin = """  const { 
    categories,
    brands,
    changeProductOrder,
  } = useAdmin();
  
  const [products, setProducts] = useState([]);
  const [sets, setSets] = useState([]);
  
  const fetchData = async () => {
    const { data: pData } = await supabase.from('products').select('*');
    const { data: sData } = await supabase.from('sets').select('*');
    
    // Map Supabase snake_case back to camelCase for the UI
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
    setSets(sData || []);
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    fetchData();
  };
  
  const deleteSet = async (id) => {
    await supabase.from('sets').delete().eq('id', id);
    fetchData();
  };
  
  const updateProductInSet = async (setId, productId, updatedData) => {
    // This is mainly for removing or hiding in SetsManager
    const { data: set } = await supabase.from('sets').select('*').eq('id', setId).single();
    if (set) {
      const newItems = set.items.map(item => item.productId === productId ? { ...item, ...updatedData } : item);
      await supabase.from('sets').update({ items: newItems }).eq('id', setId);
      fetchData();
    }
  };"""

c = c.replace(old_use_admin, new_use_admin)

# Also update handleSaveProduct to call fetchData() at the end
c = c.replace("console.log('Saved to Supabase successfully!');", "console.log('Saved to Supabase successfully!');\n      fetchData();")

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)

