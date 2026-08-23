import re
with open('src/components/CartSidebar.jsx', 'r') as f:
    code = f.read()

old_func = """  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };"""

new_func = """  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };"""

code = code.replace(old_func, new_func)

# Also fix the patch where I assumed 'const CartSidebar = ({ isOpen, onClose })'
# Actually in my previous patch I replaced:
# "const CartSidebar = ({ isOpen, onClose }) => {" with "const CartSidebar = ({ isOpen, onClose }) => {" which failed if it was "const CartSidebar = () => {"
