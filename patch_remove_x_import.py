import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

code = code.replace("import { X } from 'lucide-react';\n", "")

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
