const fs = require('fs');
const path = 'src/pages/admin/components/ProductEditorDrawer.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldState = `coverImage: '', hoverImage: '', galleryImages: []`;
const newState = `coverImage: '', hoverImage: '', galleryImages: [], colorVariants: []`;
code = code.replace(oldState, newState);

const oldInit = `galleryImages: gallImgs
      });`;
const newInit = `galleryImages: gallImgs,
        colorVariants: Array.isArray(initialData.colorVariants) ? initialData.colorVariants : []
      });`;
code = code.replace(oldInit, newInit);

fs.writeFileSync(path, code);
