with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

import re

# We will wrap localStorage.setItem in a try-catch for sol_products_v6 and sol_categories_v2
c = re.sub(
    r"localStorage\.setItem\('sol_products_v6', JSON\.stringify\(products\)\);",
    "try { localStorage.setItem('sol_products_v6', JSON.stringify(products)); } catch (e) { console.error('LocalStorage Quota Exceeded:', e); alert('Storage limit reached! Please delete some old products to free up space.'); }",
    c
)
c = re.sub(
    r"localStorage\.setItem\('sol_sets_v2', JSON\.stringify\(sets\)\);",
    "try { localStorage.setItem('sol_sets_v2', JSON.stringify(sets)); } catch (e) { console.error('LocalStorage Quota Exceeded:', e); }",
    c
)

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)

