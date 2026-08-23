import re

with open('src/components/CartSidebar.jsx', 'r') as f:
    code = f.read()

# Make sure useCart imports formatPrice
if "formatPrice" not in code.split("useCart()")[0] + "useCart()":
    code = code.replace("const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, cartTotal } = useCart();",
                        "const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, cartTotal, formatPrice } = useCart();")

# Replace item.price with formatPrice(item.price)
code = code.replace("{item.price}", "{formatPrice(item.price)}")

with open('src/components/CartSidebar.jsx', 'w') as f:
    f.write(code)
