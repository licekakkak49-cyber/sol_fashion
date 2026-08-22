const fs = require('fs');
const path = 'src/context/AdminContext.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldMap = `          layoutSize: p.layout_size,
          heelHeight: p.heel_height,
          colorVariants: p.color_variants || []
        })));`;

const newMap = `          layoutSize: p.layout_size,
          heelHeight: p.heel_height,
          colorVariants: p.color_variants || [],
          colors: (p.color_variants || []).map(v => v.hex).filter(Boolean)
        })));`;

code = code.replace(oldMap, newMap);
fs.writeFileSync(path, code);
