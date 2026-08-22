import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

# 1. Update fetch
old_fetch = """  useEffect(() => {
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
  }, []);"""

new_fetch = """  useEffect(() => {
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
  }, []);"""

c = c.replace(old_fetch, new_fetch)

# 2. Update save
old_save = """  useEffect(() => {
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

new_save = """  useEffect(() => {
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
  }, [categories, categoriesLoaded]);"""

c = c.replace(old_save, new_save)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
