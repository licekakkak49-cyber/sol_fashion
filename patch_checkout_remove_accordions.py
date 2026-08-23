import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Remove Accordions
accordion_start = "{/* ACCORDIONS */}"
accordion_end = "      </div>\n    </div>\n  );\n};\n\nexport default CheckoutPage;"

if accordion_start in code:
    code = code[:code.find(accordion_start)] + accordion_end

# Modify imports (remove ChevronDown, ChevronUp, motion, AnimatePresence, openAccordion state if we want, but easiest is to just leave them or clean them up)
code = code.replace("import { ChevronDown, ChevronUp, X } from 'lucide-react';", "import { X } from 'lucide-react';")
code = code.replace("import { motion, AnimatePresence } from 'framer-motion';", "")
code = code.replace("const [openAccordion, setOpenAccordion] = useState('contact');\n", "")
code = code.replace("const toggleAccordion = (id) => {\n    setOpenAccordion(prev => prev === id ? null : id);\n  };\n", "")

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
