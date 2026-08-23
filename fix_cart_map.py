import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Replace cartItems.map with cart.map for the large list
code = code.replace("{cartItems.map((item, idx) => (", "{cart.map((item, idx) => (")

# Update fields to match our actual cart object
# {item.image} -> {item.image || item.variant?.images?.[0] || item.coverImage}
code = code.replace("src={item.image}", "src={item.image || item.variant?.images?.[0] || item.coverImage}")

# {item.price} USD -> {formatPrice(item.price)}
code = code.replace("{item.price} USD", "{formatPrice(item.price)}")

# The variants part: item.variants -> item.variant, item.size
old_variants = """                      {item.variants && item.variants.map((v, i) => (
                        <div key={i} className={styles.cartLargeVariant}>
                          {v.name === 'Size' ? `Size ${v.value}` : v.value}
                        </div>
                      ))}"""

new_variants = """                      <div className={styles.cartLargeVariant}>
                        {item.variant?.name || 'Dark Brown'}
                      </div>
                      {(item.size || item.selectedSize) && (
                        <div className={styles.cartLargeVariant}>
                          Size {item.size || item.selectedSize}
                        </div>
                      )}"""
code = code.replace(old_variants, new_variants)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
