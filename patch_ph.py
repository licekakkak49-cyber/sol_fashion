import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

old_ph_1 = '''                        border: layoutSize === 'wide' ? '2px dashed #10b981' : (layoutSize === 'large' ? '2px dashed #3b82f6' : '2px dashed #cbd5e1'),'''
new_ph_1 = '''                        border: layoutSize === 'large' ? '2px dashed #3b82f6' : '2px dashed #cbd5e1','''
c = c.replace(old_ph_1, new_ph_1)

old_ph_2 = '''                        background: layoutSize === 'wide' ? '#ecfdf5' : (layoutSize === 'large' ? '#eff6ff' : '#f8fafc'),'''
new_ph_2 = '''                        background: layoutSize === 'large' ? '#eff6ff' : '#f8fafc','''
c = c.replace(old_ph_2, new_ph_2)

old_ph_3 = '''                        color: layoutSize === 'wide' ? '#047857' : (layoutSize === 'large' ? '#1d4ed8' : '#64748b')'''
new_ph_3 = '''                        color: layoutSize === 'large' ? '#1d4ed8' : '#64748b' '''
c = c.replace(old_ph_3, new_ph_3)

old_ph_text = '''<span style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>{layoutSize === 'wide' ? '1x4 (Wide Item)' : (layoutSize === 'large' ? '2x2 (Large)' : '1x1 (Small)')}</span>'''
new_ph_text = '''<span style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>{layoutSize === 'large' ? '2x2 (Large)' : '1x1 (Small)'}</span>'''
c = c.replace(old_ph_text, new_ph_text)

old_btn = '''<Layout size={16} /> Add 1x4 Row'''
new_btn = '''<Layout size={16} /> Add Straight Row'''
c = c.replace(old_btn, new_btn)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
