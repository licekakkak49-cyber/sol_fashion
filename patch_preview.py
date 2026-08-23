import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# Add import for TextBlock
if "import TextBlock from" not in code:
    code = code.replace("import HomepageEditorDrawer from './components/HomepageEditorDrawer';", "import HomepageEditorDrawer from './components/HomepageEditorDrawer';\nimport TextBlock from '../../components/HomepageBlocks/TextBlock';")

# Replace the text preview logic
replacement = """                    {item.contentType === 'text' && (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                         <TextBlock data={item.contentData} />
                      </div>
                    )}"""

code = re.sub(r"                    \{item\.contentType === 'text' && \(\n                      <div style=\{\{ background: '#fef3c7'.*?</div>\n                    \)\}", replacement, code, flags=re.DOTALL)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
