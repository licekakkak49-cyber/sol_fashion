const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

// replace 4px with 12px for headings
code = code.replace(/<p style=\{\{ marginBottom: '4px' \}\}>1\. Bust<\/p>/g, "<p style={{ marginBottom: '12px' }}>1. Bust</p>");
code = code.replace(/<p style=\{\{ marginBottom: '4px' \}\}>2\. Waist<\/p>/g, "<p style={{ marginBottom: '12px' }}>2. Waist</p>");
code = code.replace(/<p style=\{\{ marginBottom: '4px' \}\}>3\. Hips<\/p>/g, "<p style={{ marginBottom: '12px' }}>3. Hips</p>");

// replace 16px with 24px for paragraphs
code = code.replace(/<p style=\{\{ marginBottom: '16px' \}\}>Wearing a bra/g, "<p style={{ marginBottom: '24px' }}>Wearing a bra");
code = code.replace(/<p style=\{\{ marginBottom: '16px' \}\}>Pass the tape measure around your natural waistline/g, "<p style={{ marginBottom: '24px' }}>Pass the tape measure around your natural waistline");
// The intro paragraph can stay at 16px, or we can make it 24px as well.
code = code.replace(/<p style=\{\{ marginBottom: '16px' \}\}>In order to select/g, "<p style={{ marginBottom: '24px' }}>In order to select");

fs.writeFileSync(path, code);
