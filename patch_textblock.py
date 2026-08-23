import re

with open('src/components/HomepageBlocks/TextBlock.jsx', 'r') as f:
    code = f.read()

code = code.replace("const TextBlock = ({ data }) => {", "const TextBlock = ({ data, isPreview }) => {")
code = code.replace("padding: '72px 0px',", "padding: isPreview ? '0' : '72px 0px',")

with open('src/components/HomepageBlocks/TextBlock.jsx', 'w') as f:
    f.write(code)

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

code = code.replace("<TextBlock data={item.contentData} />", "<TextBlock data={item.contentData} isPreview={true} />")

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
