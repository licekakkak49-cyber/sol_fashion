import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

start_str = "{/* CATEGORY MODAL */}"
# The modal ends with "</div>\n      )}"
# I will use a regex to remove it
modal_regex = r"\{/\* CATEGORY MODAL \*/\}.*?</div>\n      \)\}"
c = re.sub(modal_regex, "", c, flags=re.DOTALL)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
