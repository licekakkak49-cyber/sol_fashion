import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

c = c.replace(
    """  const addSet = async (newSet) => {
    await supabase.from('sets').insert([newSet]);
    fetchData();
  };""",
    """  const addSet = async (newSet) => {
    const { error } = await supabase.from('sets').insert([newSet]);
    if (error) {
      console.error('Error adding set:', error);
      alert('Failed to create set: ' + error.message);
    }
    fetchData();
  };"""
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)

