import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# 1. Replace Cards SVG with Feather Credit Card SVG
old_cards_svg = """<svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '8px'}}>
                    <rect width="24" height="16" rx="2" fill="#1A1A1A"/>
                    <rect y="3" width="24" height="3" fill="#333333"/>
                  </svg>"""
new_cards_svg = """<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px', marginRight: '4px'}}>
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>"""
code = code.replace(old_cards_svg, new_cards_svg)

# 2. Replace Apple Pay SVG
old_apple_svg = """<svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '8px'}}>
                    <rect width="24" height="16" rx="2" fill="#000"/>
                    <path d="M14.5 7.5C14.5 6.5 15.2 5.8 16.1 5.5C15.5 4.6 14.5 4.5 14.1 4.5C13.2 4.4 12.3 5 11.8 5C11.3 5 10.6 4.5 9.8 4.5C8.8 4.5 7.9 5.1 7.4 5.9C6.4 7.7 7.1 10.3 8.1 11.7C8.6 12.4 9.1 13.2 9.9 13.1C10.6 13.1 10.9 12.6 11.8 12.6C12.7 12.6 12.9 13.2 13.7 13.1C14.5 13.1 14.9 12.4 15.4 11.7C16 10.8 16.2 9.9 16.3 9.9C16.2 9.8 14.5 9.2 14.5 7.5ZM13.4 3.4C13.8 2.9 14.1 2.2 14 1.5C13.4 1.5 12.7 1.9 12.3 2.4C12 2.8 11.7 3.5 11.8 4.2C12.5 4.2 13.1 3.8 13.4 3.4Z" fill="white"/>
                  </svg>"""
new_apple_img = """<img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" style={{ height: '16px', marginLeft: '8px', marginRight: '4px' }} />"""
code = code.replace(old_apple_svg, new_apple_img)

# 3. Replace PayPal SVG
old_paypal_svg = """<svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '8px'}}>
                    <rect width="24" height="16" rx="2" fill="#003087"/>
                    <path d="M10.8 4H14C15.3 4 16.1 4.6 16.1 5.8C16.1 7.4 15 8.7 13.3 8.7H11.5L11 11.5H9.3L10.8 4Z" fill="white"/>
                    <path d="M12.6 9C13.8 9 14.5 8.3 14.7 7.2L14.3 9.8C14.2 10.3 13.8 10.6 13.2 10.6H11.6L11.3 12.5H9.6L10.3 9H12.6Z" fill="#0079C1"/>
                  </svg>"""
new_paypal_img = """<img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '18px', marginLeft: '8px', marginRight: '4px' }} />"""
code = code.replace(old_paypal_svg, new_paypal_img)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
