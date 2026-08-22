import re

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

c = c.replace("const ProductsPage = () => {", "const ProductsPage = ({ previewSets = null }) => {")
c = c.replace("const { products, sets, loading } = useAdmin();", """const adminCtx = useAdmin();
  const products = adminCtx.products;
  const sets = previewSets || adminCtx.sets;
  const loading = adminCtx.loading;""")

# Also in ProductsPage, activeSets filters by 'published'. If we are previewing, we want ALL sets (even drafts) to be shown.
# Wait, let's see how activeSets is calculated.
active_sets_logic = """    const activeSets = (sets || []).filter(s => {
       if (s.status === 'published') return true;
       if (s.status === 'scheduled' && s.scheduledDate) {
          return new Date(s.scheduledDate) <= now;
       }
       return false;
    });"""

new_active_sets = """    const activeSets = (sets || []).filter(s => {
       if (previewSets) return true; // Show all sets in preview mode
       if (s.status === 'published') return true;
       if (s.status === 'scheduled' && s.scheduledDate) {
          return new Date(s.scheduledDate) <= now;
       }
       return false;
    });"""

c = c.replace(active_sets_logic, new_active_sets)

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
