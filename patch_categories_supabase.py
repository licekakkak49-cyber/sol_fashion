import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

# Make sure supabase is imported. It is imported at the top. Let's verify.
# Assuming `supabase` is in scope since fetchAllData uses it.

# 1. Update the categories useState and useEffects
old_cat_logic = """  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('sol_categories_v3');
    return saved ? JSON.parse(saved) : {
      'Bags': ['Crossbody Bags', 'Shoulder Bags', 'Handbags', 'Totes', 'Mini Bags'],
      'Ready to Wear': ['Knit Top', 'Shirt', 'Blouse', 'Shorts', 'Pants', 'Skirt', 'Mini Dress', 'Maxi Dress', 'Sets'],
      'Accessories & Shoes': ['Jewelry', 'Hats', 'Belts', 'Sandals', 'Heels', 'Flats']
    };
  });

  useEffect(() => {
    localStorage.setItem('sol_categories_v3', JSON.stringify(categories));
  }, [categories]);"""

new_cat_logic = """  const [categories, setCategories] = useState(() => {
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
          .eq('key_name', 'categories')
          .single();
        
        if (data && data.setting_value) {
          setCategories(data.setting_value);
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
      supabase
        .from('store_settings')
        .upsert({ 
          key_name: 'categories', 
          setting_value: categories 
        })
        .then(({ error }) => {
          if (error) console.error("Error syncing categories to Supabase:", error);
        });
    }
  }, [categories, categoriesLoaded]);"""

c = c.replace(old_cat_logic, new_cat_logic)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
