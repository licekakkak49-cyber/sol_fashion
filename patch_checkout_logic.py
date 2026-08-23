import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Add getFutureDate
func_str = """  const toggleAccordion = (id) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };"""
  
new_func = """  const toggleAccordion = (id) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  const getFutureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2); // Assume 2 days from now
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };"""

code = code.replace(func_str, new_func)

# Replace the cart mapping block
old_cart_map = """        <div className={styles.cartItemsList}>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={`${item.id}-${item.variant?.name}-${item.selectedSize}-${index}`} className={styles.itemTop}>
                <img 
                  src={item.variant?.images?.[0] || item.coverImage} 
                  alt={item.name} 
                  className={styles.itemImage} 
                />
                <div className={styles.itemDetails}>
                  <div className={styles.itemHeaderRow}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                  </div>
                  
                  <div className={styles.itemMeta}>
                    {item.variant?.name && (
                      <p className={styles.metaText}>{item.variant.name}</p>
                    )}
                    {item.selectedSize && (
                      <p className={styles.metaText}>Size {item.selectedSize}</p>
                    )}
                    <p className={styles.metaText}>Qty {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.itemTop}>
              <div className={styles.itemDetails}>
                <p className={styles.itemName}>Your cart is empty</p>
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <p className={styles.deliveryEstimate}>
            Estimated delivery date: from 26/08/2026
          </p>
        )}"""

new_cart_map = """        <div className={styles.cartItemsList}>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className={styles.item}>
                <div className={styles.itemTop}>
                  <img 
                    src={item.image || item.variant?.images?.[0] || item.coverImage} 
                    alt={item.name} 
                    className={styles.itemImage} 
                  />
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeaderRow}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                    </div>
                    
                    <div className={styles.itemMeta}>
                      <p className={styles.metaText}>{item.variant?.name || 'Dark Brown'}</p>
                      {(item.size || item.selectedSize) && (
                        <p className={styles.metaText}>Size {item.size || item.selectedSize}</p>
                      )}
                      <p className={styles.metaText}>Qty {item.quantity}</p>
                    </div>
                  </div>
                </div>
                <p className={styles.deliveryEstimate}>
                  Estimated delivery date: from {getFutureDate()}
                </p>
              </div>
            ))
          ) : (
            <div className={styles.item}>
              <div className={styles.itemTop}>
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>Your cart is empty</p>
                </div>
              </div>
            </div>
          )}
        </div>"""

code = code.replace(old_cart_map, new_cart_map)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
