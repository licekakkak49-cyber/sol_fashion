import re

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Signature
c = c.replace("const ProductsPage = () => {", "const ProductsPage = ({ previewSets = null }) => {")

# 2. State
c = c.replace("const { products, sets, loading } = useAdmin();", """const adminCtx = useAdmin();
  const products = adminCtx.products;
  const sets = previewSets || adminCtx.sets;
  const loading = adminCtx.loading;""")

# 3. activeSets logic
old_active = """    const activeSets = (sets || []).filter(s => {
       if (s.status === 'published') return true;
       if (s.status === 'scheduled' && s.scheduledDate) {
          return new Date(s.scheduledDate) <= now;
       }
       return false;
    });"""

new_active = """    const activeSets = (sets || []).filter(s => {
       if (previewSets) return true;
       if (s.status === 'published') return true;
       if (s.status === 'scheduled' && s.scheduledDate) {
          return new Date(s.scheduledDate) <= now;
       }
       return false;
    });"""

c = c.replace(old_active, new_active)

# 4. Hide Header & Options Bar
# Start: {/* Options Bar */}
# End: <GlobalFilterPanel ... />
old_ui_top = r"(      \{\/\* Options Bar \*\/}.*?onClearAll=\{clearAllFilters\}\n        \/>)"
new_ui_top = r"{!previewSets && (\n        <>\n\1\n        </>\n      )}"

c = re.sub(old_ui_top, new_ui_top, c, flags=re.DOTALL)

# 5. Hide Bottom Section
old_ui_bottom = r"(      \{\/\* Bottom Section \*\/}.*?<\/div>\n      <\/div>)"
new_ui_bottom = r"{!previewSets && (\n\1\n      )}"

c = re.sub(old_ui_bottom, new_ui_bottom, c, flags=re.DOTALL)

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
