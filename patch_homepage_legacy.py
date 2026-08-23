import re

with open('src/pages/HomePage.jsx', 'r') as f:
    code = f.read()

import_statement = "import SpacerBlock from '../components/HomepageBlocks/SpacerBlock';\nimport CollectionHighlight from '../components/CollectionHighlight';"
code = code.replace("import SpacerBlock from '../components/HomepageBlocks/SpacerBlock';", import_statement)

logic = """} else if (mod.type === 'spacer') {
          Component = SpacerBlock;
          spanClass = mod.data?.span === 1 ? styles.span1 : mod.data?.span === 2 ? styles.span2 : styles.span4;
          isEdgeToEdge = mod.data?.span === 4;
        } else if (mod.type === 'collection-highlight') {
          Component = CollectionHighlight;
          spanClass = styles.span4;
          isEdgeToEdge = true;
        }"""
code = code.replace("} else if (mod.type === 'spacer') {\n          Component = SpacerBlock;\n          spanClass = mod.data?.span === 1 ? styles.span1 : mod.data?.span === 2 ? styles.span2 : styles.span4;\n          isEdgeToEdge = mod.data?.span === 4;\n        }", logic)

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(code)
