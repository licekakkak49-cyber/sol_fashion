import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

# 1. Update SetsManager signature
c = c.replace('export default function SetsManager({ handleEdit }) {', 'export default function SetsManager({ handleEdit, activeMainCategory, activeSubCategory }) {')

# 2. Update addSet to include categories
old_create = '''  const handleCreateSet = () => {
    if (!newSetName.trim()) return;
    
    // Create Default Block: 4 smalls (left), 1 large (right)
    const defaultItems = [
      { productId: `draft-${Date.now()}-1`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-2`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-3`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-4`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-5`, layoutSize: 'large' },
    ];
    
    addSet({ name: newSetName, items: defaultItems });'''

new_create = '''  const handleCreateSet = () => {
    if (!newSetName.trim()) return;
    
    // Create Default Block: 4 smalls (left), 1 large (right)
    const defaultItems = [
      { productId: `draft-${Date.now()}-1`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-2`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-3`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-4`, layoutSize: 'small' },
      { productId: `draft-${Date.now()}-5`, layoutSize: 'large' },
    ];
    
    addSet({ 
      name: newSetName, 
      items: defaultItems,
      mainCategory: activeMainCategory,
      subCategory: activeSubCategory 
    });'''

c = c.replace(old_create, new_create)

# 3. Filter sets by categories
c = c.replace('const { sets = []', 'const { sets: allSets = []')
old_filter = '''  const [isAddingSet, setIsAddingSet] = useState(false);'''
new_filter = '''  const [isAddingSet, setIsAddingSet] = useState(false);
  const sets = allSets.filter(s => s.mainCategory === activeMainCategory && s.subCategory === activeSubCategory);'''
c = c.replace(old_filter, new_filter)

# 4. Change "New Look Set" button text
c = c.replace('New Look Set</button>', 'New Look Set in {activeSubCategory}</button>')
c = c.replace('Click "New Look Set" to start building your first visual campaign.', 'Click "New Look Set" to create a collection for {activeSubCategory}.')

# 5. Fix ImageCropper product inheritance
old_upload = '''          const newProductData = {
            name: 'New Product',
            price: 1500,
            images: [webpDataUrl],
            category: 'Bags',
            stock: 10,
            status: 'draft',
            createdAt: new Date().toISOString()
          };
          
          const newProduct = addProduct(newProductData);'''

new_upload = '''          const newProductData = {
            name: 'New Product',
            price: 1500,
            images: [webpDataUrl],
            mainCategory: activeMainCategory,
            subCategory: activeSubCategory,
            category: activeMainCategory, // fallback
            stock: 10,
            status: 'draft',
            createdAt: new Date().toISOString()
          };
          
          const newProduct = addProduct(newProductData);'''

c = c.replace(old_upload, new_upload)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
