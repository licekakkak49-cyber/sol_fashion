import re

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'r') as f:
    c = f.read()

old_link_desktop = """<li key={cat}><Link to={`/products?main=${cat}`}>{cat === 'Ready to Wear' ? 'Ready-to-Wear' : cat}</Link></li>"""
new_link_desktop = """<li key={cat}><Link to={`/products?main=${encodeURIComponent(cat)}`}>{cat === 'Ready to Wear' ? 'Ready-to-Wear' : cat}</Link></li>"""

c = c.replace(old_link_desktop, new_link_desktop)

old_link_mobile = """<li key={cat}><Link to={`/products?main=${cat}`} onClick={toggleMenu}>{cat === 'Ready to Wear' ? 'Ready-to-Wear' : cat}</Link></li>"""
new_link_mobile = """<li key={cat}><Link to={`/products?main=${encodeURIComponent(cat)}`} onClick={toggleMenu}>{cat === 'Ready to Wear' ? 'Ready-to-Wear' : cat}</Link></li>"""

c = c.replace(old_link_mobile, new_link_mobile)

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'w') as f:
    f.write(c)
