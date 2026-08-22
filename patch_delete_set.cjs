const fs = require('fs');
const path = 'src/pages/admin/ManageProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldDeleteSet = `  const deleteSet = async (setId) => {
    await supabase.from('sets').delete().eq('id', setId);
    fetchData();
  };`;

const newDeleteSet = `  const deleteSet = async (setId) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเซ็ตนี้ รวมถึง 'สินค้าทั้งหมด' ที่อยู่ในเซ็ต? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      return;
    }

    const setToDelete = sets.find(s => s.id === setId);
    if (setToDelete && setToDelete.items) {
      const productIdsToDelete = setToDelete.items
        .filter(item => !item.isPlaceholder && item.productId)
        .map(item => item.productId);
      
      if (productIdsToDelete.length > 0) {
        await supabase.from('products').delete().in('id', productIdsToDelete);
      }
    }

    await supabase.from('sets').delete().eq('id', setId);
    fetchData();
  };`;

code = code.replace(oldDeleteSet, newDeleteSet);
fs.writeFileSync(path, code);
