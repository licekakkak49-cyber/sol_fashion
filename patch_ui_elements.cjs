const fs = require('fs');

// 1. ManageProductsPage.jsx
const managePath = 'src/pages/admin/ManageProductsPage.jsx';
let manageCode = fs.readFileSync(managePath, 'utf8');

const oldSortHTML = `        {/* Keep Sorting */}
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ marginBottom: '12px', padding: '8px 16px', border: 'none', borderRadius: '100px', fontSize: '13px', outline: 'none', background: '#F3F4F6', color: '#111', cursor: 'pointer', fontWeight: 500 }}
        >
          <option value="Newest">Sort: Newest</option>
          <option value="Oldest">Sort: Oldest</option>
          <option value="Name A-Z">Sort: Name A-Z</option>
          <option value="Name Z-A">Sort: Name Z-A</option>
        </select>`;

manageCode = manageCode.replace(oldSortHTML, '');
fs.writeFileSync(managePath, manageCode);

// 2. SetsManager.jsx
const setsPath = 'src/pages/admin/components/SetsManager.jsx';
let setsCode = fs.readFileSync(setsPath, 'utf8');

const oldTextHTML = `          <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 4px 0' }}>Visual Set Builder</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Build complete looks and campaigns by arranging placeholders and uploading images directly.</p>`;

const newTextHTML = `          <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 4px 0' }}>Visual Set Builder</h2>`;

setsCode = setsCode.replace(oldTextHTML, newTextHTML);
fs.writeFileSync(setsPath, setsCode);

