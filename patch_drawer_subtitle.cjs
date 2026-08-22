const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldState = `name: '', brandId: '', price: '', sku: '', stock: '', description: '',`;
const newState = `name: '', subtitle: '', brandId: '', price: '', sku: '', stock: '', description: '',`;
code = code.replace(oldState, newState);

const oldInit = `        name: initialData.name || '',
        price: initialData.price || '',`;
const newInit = `        name: initialData.name || '',
        subtitle: initialData.subtitle || '',
        price: initialData.price || '',`;
code = code.replace(oldInit, newInit);

const oldUI = `              <div><label style={labelStyle}>Product Name *</label><input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle} placeholder="e.g. Silk Blouse" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>`;
const newUI = `              <div><label style={labelStyle}>Product Name *</label><input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle} placeholder="e.g. Silk Blouse" /></div>
              <div><label style={labelStyle}>Subtitle</label><input type="text" value={formData.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} style={inputStyle} placeholder="e.g. Ruched fitted dress" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>`;
code = code.replace(oldUI, newUI);

fs.writeFileSync(path, code);
