import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/PreviewModal.jsx', 'r') as f:
    c = f.read()

browser_bar = r"          \{\/\* Fake Browser Bar \*\/}.*?<\/div> \/\* Spacer to center URL bar \*\/\}[\s]*<\/div>\n\n"

c = re.sub(browser_bar, "", c, flags=re.DOTALL)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/PreviewModal.jsx', 'w') as f:
    f.write(c)
