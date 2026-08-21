import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# Replace the useAdmin destructuring completely
# Find everything from "const { ... } = useAdmin();"
c = re.sub(
    r'const \{[^\}]+\}\s*=\s*useAdmin\(\);',
    """const { 
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
      setSets(sData || []);
    } catch(e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const addSet = async (newSet) => {
    await supabase.from('sets').insert([newSet]);
    fetchData();
  };

  const updateSet = async (setId, updatedData) => {
    await supabase.from('sets').update(updatedData).eq('id', setId);
    fetchData();
  };

  const deleteSet = async (setId) => {
    await supabase.from('sets').delete().eq('id', setId);
    fetchData();
  };

  const removeProductFromSet = async (setId, productId) => {
    const { data: set } = await supabase.from('sets').select('*').eq('id', setId).single();
    if (set) {
      const newItems = set.items.map(item => {
        if (item.productId === productId) {
           return { productId: `draft-${Date.now()}-${Math.random()}`, layoutSize: item.layoutSize, isHidden: true };
        }
        return item;
      });
      await supabase.from('sets').update({ items: newItems }).eq('id', setId);
      fetchData();
    }
  };

  const updateProductInSet = async (setId, productId, updatedData) => {
    const { data: set } = await supabase.from('sets').select('*').eq('id', setId).single();
    if (set) {
      const newItems = set.items.map(item => item.productId === productId ? { ...item, ...updatedData } : item);
      await supabase.from('sets').update({ items: newItems }).eq('id', setId);
      fetchData();
    }
  };

  const changeProductOrderInSet = async (setId, productId, newIndex, updatedData = null) => {
    const { data: set } = await supabase.from('sets').select('*').eq('id', setId).single();
    if (set) {
      const currentIndex = set.items.findIndex(i => i.productId === productId);
      if (currentIndex === -1) return;
      const newItems = [...set.items];
      const [movedItem] = newItems.splice(currentIndex, 1);
      const itemToInsert = updatedData ? { ...movedItem, ...updatedData } : movedItem;
      newItems.splice(newIndex, 0, itemToInsert);
      await supabase.from('sets').update({ items: newItems }).eq('id', setId);
      fetchData();
    }
  };
  
  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    fetchData();
  };
""",
    c, count=1
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)

