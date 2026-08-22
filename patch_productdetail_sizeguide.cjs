const fs = require('fs');
const path = 'src/pages/ProductDetailPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const importStatement = `import SizeGuideDrawer from '../components/SizeGuideDrawer';\n`;
if (!code.includes('SizeGuideDrawer')) {
  // insert after last import
  const lastImportIdx = code.lastIndexOf('import ');
  const endOfLine = code.indexOf('\n', lastImportIdx);
  code = code.slice(0, endOfLine + 1) + importStatement + code.slice(endOfLine + 1);
}

const oldStateStr = `  const [activeVariant, setActiveVariant] = useState(null);`;
const newStateStr = `  const [activeVariant, setActiveVariant] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);`;
if (!code.includes('isSizeGuideOpen')) {
  code = code.replace(oldStateStr, newStateStr);
}

const oldDesktopBtn = `<button className={styles.sizeGuideBtn}>Size guide</button>`;
const newDesktopBtn = `<button className={styles.sizeGuideBtn} onClick={() => setIsSizeGuideOpen(true)}>Size guide</button>`;
code = code.replaceAll(oldDesktopBtn, newDesktopBtn);

// Add the SizeGuideDrawer component before the closing </div> of the page.
const renderComponent = `
      <SizeGuideDrawer isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
`;
const oldRender = `    </div>
  );
};`;
if (!code.includes('<SizeGuideDrawer')) {
  code = code.replace(oldRender, renderComponent);
}

fs.writeFileSync(path, code);
