const fs = require('fs');

// 1. AdminContext.jsx
const adminPath = 'src/context/AdminContext.jsx';
let adminCode = fs.readFileSync(adminPath, 'utf8');

const oldAdminMap = `          layoutSize: p.layout_size,
          heelHeight: p.heel_height`;
const newAdminMap = `          layoutSize: p.layout_size,
          heelHeight: p.heel_height,
          colorVariants: p.color_variants || []`;
adminCode = adminCode.replace(oldAdminMap, newAdminMap);
fs.writeFileSync(adminPath, adminCode);

// 2. ManageProductsPage.jsx
const managePath = 'src/pages/admin/ManageProductsPage.jsx';
let manageCode = fs.readFileSync(managePath, 'utf8');

const oldManagePayload = `      hardware: payload.hardware,
      heel_height: payload.heelHeight,
      tags: payload.highlight || []
    };`;
const newManagePayload = `      hardware: payload.hardware,
      heel_height: payload.heelHeight,
      tags: payload.highlight || [],
      color_variants: payload.colorVariants || []
    };`;
manageCode = manageCode.replace(oldManagePayload, newManagePayload);
fs.writeFileSync(managePath, manageCode);

