with open('src/pages/CheckoutPage.module.css', 'r') as f:
    lines = f.readlines()

responsive_idx = -1
for i, line in enumerate(lines):
    if "/* RESPONSIVE */" in line:
        responsive_idx = i
        break

# The responsive block ends before /* OVERRIDES FOR PAYMENT BOX */
payment_idx = -1
for i, line in enumerate(lines):
    if "/* OVERRIDES FOR PAYMENT BOX */" in line:
        payment_idx = i
        break

if responsive_idx != -1 and payment_idx != -1 and responsive_idx < payment_idx:
    responsive_lines = lines[responsive_idx:payment_idx]
    before_responsive = lines[:responsive_idx]
    after_responsive = lines[payment_idx:]
    
    new_lines = before_responsive + after_responsive + ['\n'] + responsive_lines
    with open('src/pages/CheckoutPage.module.css', 'w') as f:
        f.writelines(new_lines)
    print("Moved responsive block to end")
