with open('src/pages/CheckoutPage.module.css', 'r') as f:
    lines = f.readlines()

# Find the start of the media query
responsive_idx = -1
for i, line in enumerate(lines):
    if "/* RESPONSIVE */" in line:
        responsive_idx = i
        break

if responsive_idx != -1:
    # All the lines from .cartLargeList to the end should be moved above the responsive block
    # Let's find where .cartLargeList starts
    cart_idx = -1
    for i, line in enumerate(lines):
        if ".cartLargeList {" in line:
            cart_idx = i
            break
    
    if cart_idx != -1 and cart_idx > responsive_idx:
        # Move everything from cart_idx to the end, ABOVE responsive_idx
        cart_lines = lines[cart_idx:]
        other_lines = lines[:cart_idx]
        
        # Now split other_lines at responsive_idx
        before_responsive = other_lines[:responsive_idx]
        responsive_lines = other_lines[responsive_idx:]
        
        new_lines = before_responsive + cart_lines + ['\n'] + responsive_lines
        
        with open('src/pages/CheckoutPage.module.css', 'w') as f:
            f.writelines(new_lines)
        print("CSS fixed successfully")
    else:
        print("Could not find cartLargeList or it's already above responsive block")
else:
    print("Could not find responsive block")

