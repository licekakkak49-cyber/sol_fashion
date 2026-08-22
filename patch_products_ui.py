import re

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

# Conditionally render Header
# Look for: <div className={styles.header}>
old_header = r"(<div className=\{styles\.header\}>.*?<\/div>\n\n        \{\/\* Global Filter Panel drops down from here \*\/\}\n        <GlobalFilterPanel .*?\/>)"
new_header = r"{!previewSets && (\n      <>\n      \1\n      </>\n      )}"

c = re.sub(old_header, new_header, c, flags=re.DOTALL)

# Conditionally render Bottom Section
# Look for: {/* Bottom Section */}
old_bottom = r"(      \{\/\* Bottom Section \*\/\}\n      <div className=\{styles\.bottomSection\}>.*?<\/div>\n    <\/div>\n  \);\n)"
new_bottom = r"      {!previewSets && (\n\1      )}\n    </div>\n  );\n"

c = re.sub(old_bottom, new_bottom, c, flags=re.DOTALL)

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
