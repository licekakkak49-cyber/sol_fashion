import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

c = c.replace(
    """  const updateSet = async (setId, updatedData) => {
    const { error } = await supabase.from('sets').update(updatedData).eq('id', setId);
    if (error) console.error("Update set error:", error);
    fetchData();
  };""",
    """  const updateSet = async (setId, updatedData) => {
    // Optimistic UI update
    setSets(prev => prev.map(s => s.id === setId ? { ...s, ...updatedData } : s));
    
    // Background DB update
    const { error } = await supabase.from('sets').update(updatedData).eq('id', setId);
    if (error) {
      console.error("Update set error:", error);
      fetchData(); // Rollback if error
    }
  };"""
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)

