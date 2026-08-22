const fs = require('fs');
const path = 'src/components/ProductCard.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldState = `const [activeVariantIdx, setActiveVariantIdx] = React.useState(-1);`;
const newState = `const [activeVariantIdx, setActiveVariantIdx] = React.useState(() => {
    if (!colorVariants || colorVariants.length === 0) return -1;
    const mainIdx = colorVariants.findIndex(v => v.isMain);
    return mainIdx >= 0 ? mainIdx : 0;
  });`;

code = code.replace(oldState, newState);
fs.writeFileSync(path, code);
