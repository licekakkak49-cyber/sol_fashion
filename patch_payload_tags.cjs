const fs = require('fs');
const path = 'src/pages/admin/ManageProductsPage.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldPayload = `    const dbPayload = {
      name: payload.name,
      price: payload.price,
      main_category: payload.mainCategory,
      sub_category: payload.subCategory,
      cover_image_url: payload.coverImage,
      hover_image_url: payload.hoverImage,
      gallery_images_urls: payload.galleryImages,
      description: payload.description,
      status: payload.status,
      layout_size: payload.layoutSize,
      stock: payload.stock,
      size: payload.size,
      fit: payload.fit,
      hardware: payload.hardware,
      heel_height: payload.heelHeight
    };`;

const newPayload = `    const dbPayload = {
      name: payload.name,
      price: payload.price,
      main_category: payload.mainCategory,
      sub_category: payload.subCategory,
      cover_image_url: payload.coverImage,
      hover_image_url: payload.hoverImage,
      gallery_images_urls: payload.galleryImages,
      description: payload.description,
      status: payload.status,
      layout_size: payload.layoutSize,
      stock: payload.stock,
      size: payload.size,
      fit: payload.fit,
      hardware: payload.hardware,
      heel_height: payload.heelHeight,
      tags: payload.highlight || []
    };`;

code = code.replace(oldPayload, newPayload);
fs.writeFileSync(path, code);
