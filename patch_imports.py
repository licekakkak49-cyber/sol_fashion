with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()
c = c.replace("import { supabase } from '../utils/supabaseClient';", "import { supabase } from '../../utils/supabaseClient';")
with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
