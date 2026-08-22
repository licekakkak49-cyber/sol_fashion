const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.module.css';
let css = fs.readFileSync(path, 'utf8');

// 1. sidebarContainer width
css = css.replace('width: 500px;', 'width: 50vw;');

// 2. Add innerContainer
const innerContainerStr = `
.innerContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 40px;
  height: 100vh;
}

@media (max-width: 768px) {
  .innerContainer {
    padding: 24px;
    height: 90vh;
    max-width: 100%;
  }
}
`;
css = css + innerContainerStr;

// 3. Adjust padding on header, tabs, content
css = css.replace(/padding: 24px 32px;/g, 'padding: 0 0 24px 0;');
css = css.replace(/padding: 20px 24px;/g, 'padding: 0 0 20px 0;');
css = css.replace(/padding: 0 32px;/g, 'padding: 0;');
css = css.replace(/padding: 0 24px;/g, 'padding: 0;');
css = css.replace(/padding: 0 32px 32px;/g, 'padding: 0 0 32px 0;');
css = css.replace(/padding: 0 24px 24px;/g, 'padding: 0 0 24px 0;');

fs.writeFileSync(path, css);
