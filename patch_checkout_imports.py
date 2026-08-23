import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

code = code.replace("import { useShop } from '../context/ShopContext';", "import { useCart } from '../context/CartContext';")
code = code.replace("const { cart, cartTotal, setIsCartOpen } = useShop();", "const { cartItems: cart, cartTotal, openCart: setIsCartOpen } = useCart();")

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
