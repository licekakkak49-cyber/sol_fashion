import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

old_usecart = "const { cartItems: cart, cartTotal, openCart: setIsCartOpen, formatPrice } = useCart();"
new_usecart = "const { cartItems: cart, cartTotal, openCart: setIsCartOpen, formatPrice, updateQuantity, removeFromCart } = useCart();"

code = code.replace(old_usecart, new_usecart)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
