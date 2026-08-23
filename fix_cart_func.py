import re
with open('src/components/CartSidebar.jsx', 'r') as f:
    code = f.read()

old = """const CartSidebar = () => {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal, formatPrice } = useCart();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);"""

new = """const CartSidebar = () => {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal, formatPrice } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);"""

code = code.replace(old, new)
with open('src/components/CartSidebar.jsx', 'w') as f:
    f.write(code)
