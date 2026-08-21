import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

c = c.replace(
    """  const updateSet = async (setId, updatedData) => {
    await supabase.from('sets').update(updatedData).eq('id', setId);
    fetchData();
  };""",
    """  const updateSet = async (setId, updatedData) => {
    const { error } = await supabase.from('sets').update(updatedData).eq('id', setId);
    if (error) console.error("Update set error:", error);
    fetchData();
  };"""
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
