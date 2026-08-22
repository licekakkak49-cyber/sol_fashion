const fs = require('fs');
const path = 'src/components/SizeGuideDrawer.module.css';
let css = fs.readFileSync(path, 'utf8');

// Title
css = css.replace(/font-size: 15px;/g, 'font-size: 14px;');
css = css.replace(/\.title {\s*font-family[^}]*font-weight: 500;/g, match => match.replace('font-weight: 500;', 'font-weight: 400;'));

// TabBtn
css = css.replace(/\.tabBtn {\s*background[^}]*font-size: 13px;/g, match => match.replace('font-size: 13px;', 'font-size: 14px;'));
css = css.replace(/\.activeTab {\s*color: #111;\s*font-weight: 500;/g, match => match.replace('font-weight: 500;', 'font-weight: 400;'));

// Table
css = css.replace(/font-size: 13px;/g, 'font-size: 14px;'); // catches td, th, footerNote if any
css = css.replace(/font-weight: 500;/g, 'font-weight: 400;'); // catches th, first-child

// footerNote
css = css.replace(/\.footerNote {\s*font-family[^}]*font-size: 12px;/g, match => match.replace('font-size: 12px;', 'font-size: 14px;'));

fs.writeFileSync(path, css);
