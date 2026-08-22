const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

// Add the bodyData object before the return statement
const oldDataStr = `  const shoeData = {
    eu: ['35', '36', '37', '38', '39', '40'],
    uk: ['2', '3', '4', '5', '6', '7'],
    us: ['4', '5', '6', '7', '8', '9'],
    japan: ['22', '23', '24', '25', '26', '27'],
    china: ['35', '36', '37', '38', '39', '40']
  };`;

const newDataStr = `  const shoeData = {
    eu: ['35', '36', '37', '38', '39', '40'],
    uk: ['2', '3', '4', '5', '6', '7'],
    us: ['4', '5', '6', '7', '8', '9'],
    japan: ['22', '23', '24', '25', '26', '27'],
    china: ['35', '36', '37', '38', '39', '40']
  };

  const bodyData = {
    size: ['32', '34', '36', '38', '40', '42', '44', '46'],
    chest: ['78', '82', '86', '90', '94', '99', '104', '109'],
    waist: ['58', '62', '66', '70', '74', '79', '84', '89'],
    pelvis: ['86', '90', '94', '98', '102', '107', '112', '117']
  };`;

code = code.replace(oldDataStr, newDataStr);

// Add the table in the UI
const oldBodyUI = `                    <p style={{ marginBottom: '4px' }}><strong>3. Hips</strong></p>
                    <p>Pass the tape measure across your hipbone, around the fullest point of your hips.</p>
                  </div>
                </div>
              )}`;

const newBodyUI = `                    <p style={{ marginBottom: '4px' }}><strong>3. Hips</strong></p>
                    <p>Pass the tape measure across your hipbone, around the fullest point of your hips.</p>
                  </div>
                  
                  <div style={{ marginTop: '40px' }}>
                    <table className={styles.sizeTable}>
                      <thead>
                        <tr>
                          <th>Size</th>
                          {bodyData.size.map((val, idx) => <th key={idx}>{val}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>Chest size</td>{bodyData.chest.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                        <tr><td>Waist size</td>{bodyData.waist.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                        <tr><td>Pelvis size</td>{bodyData.pelvis.map((val, idx) => <td key={idx}>{val}</td>)}</tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}`;

code = code.replace(oldBodyUI, newBodyUI);
fs.writeFileSync(path, code);
