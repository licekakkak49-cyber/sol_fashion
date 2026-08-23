import re

with open('src/pages/admin/components/HomepageEditors/BannerSectionEditor.jsx', 'r') as f:
    code = f.read()

code = code.replace(
    "style={{ objectPosition: data.objectPosition || 'center' }}",
    "style={{ objectPosition: data.objectPosition || 'center', height: '100%' }}"
)

with open('src/pages/admin/components/HomepageEditors/BannerSectionEditor.jsx', 'w') as f:
    f.write(code)

with open('src/pages/admin/components/HomepageEditors/HeroSectionEditor.jsx', 'r') as f:
    code = f.read()

code = code.replace(
    "style={{ objectPosition: data.objectPosition || 'top' }}",
    "style={{ objectPosition: data.objectPosition || 'top', height: '100%' }}"
)

with open('src/pages/admin/components/HomepageEditors/HeroSectionEditor.jsx', 'w') as f:
    f.write(code)
