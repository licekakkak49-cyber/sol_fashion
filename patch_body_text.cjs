const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldBodyText = `<p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, fontFamily: '"Futura PT", sans-serif' }}>
                    To choose the correct size for you, measure your body as follows: <br/><br/>
                    <strong>1. Bust</strong> - Measure around the fullest part.<br/>
                    <strong>2. Waist</strong> - Measure around natural waistline.<br/>
                    <strong>3. Hips</strong> - Measure 20cm down from the natural waistline.
                  </p>`;

const newBodyText = `<div style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, fontFamily: '"Futura PT", sans-serif' }}>
                    <p style={{ marginBottom: '16px' }}>To choose the correct size for you, measure your body as follows:</p>
                    
                    <p style={{ marginBottom: '4px' }}><strong>1. Bust</strong></p>
                    <p style={{ marginBottom: '16px' }}>Wearing a bra, pass the tape measure straight across your back, under your arms and over the fullest point of your bust.</p>
                    
                    <p style={{ marginBottom: '4px' }}><strong>2. Waist</strong></p>
                    <p style={{ marginBottom: '16px' }}>Pass the tape measure around your natural waistline, at the narrowest point of your waist. The tape measure should sit snugly against your body, but should not be pulled too tight.</p>
                    
                    <p style={{ marginBottom: '4px' }}><strong>3. Hips</strong></p>
                    <p>Pass the tape measure across your hipbone, around the fullest point of your hips.</p>
                  </div>`;

code = code.replace(oldBodyText, newBodyText);
fs.writeFileSync(path, code);
