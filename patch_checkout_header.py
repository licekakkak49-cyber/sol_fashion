import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Add X import if missing
if "import { X " not in code and "import { ChevronDown" in code:
    code = code.replace("import { ChevronDown, ChevronUp } from 'lucide-react';", "import { ChevronDown, ChevronUp, X } from 'lucide-react';")
elif "import { X } from 'lucide-react';" not in code:
    code = code.replace("import { ChevronDown, ChevronUp } from 'lucide-react';", "import { ChevronDown, ChevronUp, X } from 'lucide-react';")

# Replace logo
old_logo = """        <div 
          className={styles.logo} 
          onClick={() => navigate('/')}
        >
          SOL FASHION
        </div>"""

new_logo = """        <div className={styles.logoContainer} onClick={() => navigate('/')}>
          <span className={styles.textLogo}>SOL</span>
          <span className={styles.tagline}>Let your SOL shine</span>
        </div>"""

code = code.replace(old_logo, new_logo)

# Add close button
if "<button className={styles.closeBtn}" not in code:
    # Add it inside checkoutContainer before leftCol
    old_start = """    <div className={styles.checkoutContainer}>
      
      {/* LEFT COLUMN */}"""
      
    new_start = """    <div className={styles.checkoutContainer}>
      <button className={styles.closeBtn} onClick={() => navigate(-1)}>
        <X size={24} strokeWidth={1.5} />
      </button>
      
      {/* LEFT COLUMN */}"""
    
    code = code.replace(old_start, new_start)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
