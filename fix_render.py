with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

import re

# We want to replace the broken placeholder block
broken_regex = r"if \(product\.isPlaceholder\) \{.*?return \(\s*<div key=\{product\.id\}>.*?return \(\s*<div key=\{product\.id\}>"
# This might be hard to match accurately. Let's just use string replacement on a very specific chunk.

c = re.sub(r"\)\;\n\s*\{\/\* Actions \*\/\}\n\s*<div style=\{\{ position: 'absolute'", "    {/* Actions */}\n                      <div style={{ position: 'absolute'", c, flags=re.DOTALL)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
