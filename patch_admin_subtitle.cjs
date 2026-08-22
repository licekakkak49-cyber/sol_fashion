const fs = require('fs');

// 1. AdminContext.jsx
const adminPath = 'src/context/AdminContext.jsx';
let adminCode = fs.readFileSync(adminPath, 'utf8');

const oldAdminMap = `          layoutSize: p.layout_size,
          heelHeight: p.heel_height,
          colorVariants: p.color_variants || [],
          colors: (p.color_variants || []).map(v => v.hex).filter(Boolean)
        })));`;

const newAdminMap = `          layoutSize: p.layout_size,
          heelHeight: p.heel_height,
          subtitle: p.subtitle || '',
          colorVariants: p.color_variants || [],
          colors: (p.color_variants || []).map(v => v.hex).filter(Boolean)
        })));`;
adminCode = adminCode.replace(oldAdminMap, newAdminMap);
fs.writeFileSync(adminPath, adminCode);

// 2. ManageProductsPage.jsx
const managePath = 'src/pages/admin/ManageProductsPage.jsx';
let manageCode = fs.readFileSync(managePath, 'utf8');

const oldManagePayload = `    const dbPayload = {
      name: payload.name,
      price: payload.price,
      main_category: payload.mainCategory,
      sub_category: payload.subCategory,`;
      
const newManagePayload = `    const dbPayload = {
      name: payload.name,
      subtitle: payload.subtitle || null,
      price: payload.price,
      main_category: payload.mainCategory,
      sub_category: payload.subCategory,`;
      
manageCode = manageCode.replace(oldManagePayload, newManagePayload);
fs.writeFileSync(managePath, manageCode);

