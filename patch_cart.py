import re

with open('src/components/CartSidebar.jsx', 'r') as f:
    code = f.read()

# Add useNavigate
if "useNavigate" not in code:
    code = code.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport { useNavigate } from 'react-router-dom';")

# Extract component body to add navigate
old_comp = """const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();"""

new_comp = """const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };"""

if "const handleCheckout" not in code:
    code = code.replace(old_comp, new_comp)

# Update button
old_btn = """                  <button className={styles.checkoutBtn}>
                    PROCEED TO CHECKOUT
                  </button>"""

new_btn = """                  <button className={styles.checkoutBtn} onClick={handleCheckout}>
                    PROCEED TO CHECKOUT
                  </button>"""

code = code.replace(old_btn, new_btn)

with open('src/components/CartSidebar.jsx', 'w') as f:
    f.write(code)
