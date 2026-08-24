import re

with open('src/components/Nav.jsx', 'r') as f:
    content = f.read()

# Replace desktop logo
content = content.replace(
    '<span className={styles.textLogo}>SOL</span>',
    '<img src="https://dpxkmjupcwgmyjhbdexz.supabase.co/storage/v1/object/public/product-images/homepage/SOL-Photoroom%20(3).svg" alt="SOL" className={`${styles.imgLogo} ${useWhiteText ? styles.whiteFilter : \'\'}`} />'
)

# Replace mobile menu logo
content = content.replace(
    '<span className={styles.textLogo}>SOL</span>',
    '<img src="https://dpxkmjupcwgmyjhbdexz.supabase.co/storage/v1/object/public/product-images/homepage/SOL-Photoroom%20(3).svg" alt="SOL" className={styles.imgLogo} />'
)

with open('src/components/Nav.jsx', 'w') as f:
    f.write(content)

print("Nav updated")
