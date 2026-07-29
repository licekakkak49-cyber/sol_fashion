import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root
dotenv.config({ path: resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const INITIAL_BRANDS = [
  { id: 'lindberg', name: 'LINDBERG', slug: 'lindberg' },
  { id: 'gucci', name: 'GUCCI', slug: 'gucci', description: 'Italian luxury fashion house', banner_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000' },
  { id: 'cartier', name: 'CARTIER', slug: 'cartier' },
  { id: 'saint-laurent', name: 'SAINT LAURENT', slug: 'saint-laurent' },
  { id: 'gentle-monster', name: 'GENTLE MONSTER', slug: 'gentle-monster', banner_url: 'https://images.unsplash.com/photo-1577227448839-86cb7301c23a?auto=format&fit=crop&q=80&w=2000' }
];

const INITIAL_PRODUCTS = [
  { id: '1', name: "Aden 02", brand_id: 'gucci', price: 10400, sku: "GC-AD02-BLK", stock: 15, is_polarized: "Yes", gender: "Unisex", image_url: "https://www.keringeyewear.com/dam/jcr:5bf188d9-23ab-4f6a-b304-94d5b7a40f2c/KeringEyewear_Website_Thumbnails_blok_4251_10%20(1).jpg", frame_color: "Black", lens_color: "Black", material: "Acetate", shape: "Square", status: "In Stock", highlight: ["Best Seller"], upload_date: "2026-07-01T10:00:00Z" },
  { id: '2', name: "Mod 02", brand_id: 'cartier', price: 15900, sku: "CT-MD02-SLV", stock: 2, is_polarized: "No", gender: "Women", status: "To be restocked", image_url: "https://www.keringeyewear.com/dam/jcr:7950e987-62e3-42a2-ad5b-315c0d897664/KeringEyewear_Website_Thumbnails_now_6665_C04_10%20(1).jpg", frame_color: "Silver", lens_color: "Gray", material: "Metal", shape: "Oval", highlight: ["New Arrival"], upload_date: "2026-07-05T12:00:00Z" },
  { id: '3', name: "Vert 02", brand_id: 'lindberg', price: 18500, sku: "LB-VT02-BRN", stock: 0, is_polarized: "Yes", gender: "Men", image_url: "https://www.keringeyewear.com/dam/jcr:1b521430-17e7-4319-b734-ff8d48428ccd/KeringEyewear_Website_Thumbnails_thintanium_5350_K292_PGT%20(1).jpg", frame_color: "Brown", lens_color: "Brown", material: "Acetate", shape: "Round", status: "In Stock", highlight: [], upload_date: "2026-06-20T14:00:00Z" },
  { id: '4', name: "Red 02", brand_id: 'saint-laurent', price: 12500, sku: "SL-RD02-CLR", stock: 8, is_polarized: "No", gender: "Unisex", image_url: "https://www.keringeyewear.com/dam/jcr:cb990dd9-9732-4075-a5a2-52757c778132/KeringEyewear_Website_Thumbnails_rim_82028_SL112_10%20(1).jpg", frame_color: "Clear", lens_color: "Blue", material: "Nylon", shape: "Cat-eye", status: "In Stock", highlight: [], upload_date: "2026-06-15T09:00:00Z" },
];

const INITIAL_BESPOKE_MODULES = [
  { id: 'block-1', type: 'split-left-image', is_visible: true, data: { image: '/images/blue_beyond.png', heading: 'BRAND IDENTITY', paragraph: '- Much closer to each brand\'s DNA\n- Fully reflect brands\' identities and new trends\n- Enable a closer collaboration between the Design teams', showHeading: true, showParagraph: true } },
  { id: 'block-2', type: 'split-right-image', is_visible: true, data: { image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&auto=format&fit=crop&q=80', heading: 'QUALITY', paragraph: '- An unparalleled and unseen level of quality\n- Leverage on a network of carefully selected suppliers\n- Choose the best materials and manufacturers', showHeading: true, showParagraph: true } },
  { id: 'block-3', type: 'product-grid', is_visible: true, data: {} }
];

const INITIAL_CONTENT_ARTICLES = [
  { id: '1', title: 'Blue & Beyond Experience', excerpt: 'An unparalleled and unseen level of quality, much closer to each brand\'s DNA', publish_date: new Date().toISOString(), is_pinned: true, status: 'Published', category: 'bespoke', cover_image_url: '/images/blue_beyond.png', cover_settings: { isVisible: true, showTitle: true }, thumbnail_image_url: '', modules: INITIAL_BESPOKE_MODULES },
  { id: '2', title: 'The Art of Precision Lenses', excerpt: 'Discover how we craft lenses for perfect clarity.', publish_date: new Date().toISOString(), is_pinned: true, status: 'Published', category: 'lenses', cover_image_url: '', cover_settings: { isVisible: true, showTitle: true }, thumbnail_image_url: '', modules: [] },
  { id: '3', title: 'The Art of Craftsmanship: Our Heritage', excerpt: 'Explore the roots of our craftsmanship, where tradition meets modern innovation to create the perfect eyewear.', publish_date: new Date().toISOString(), is_pinned: false, status: 'Published', category: 'explore', cover_image_url: 'https://www.keringeyewear.com/dam/jcr:1b521430-17e7-4319-b734-ff8d48428ccd/KeringEyewear_Website_Thumbnails_thintanium_5350_K292_PGT%20(1).jpg', cover_settings: { isVisible: true, showTitle: true }, thumbnail_image_url: '', modules: [
    { id: 'mock-2', type: 'center-text', is_visible: true, data: { image: '', heading: 'A LEGACY OF EXCELLENCE', paragraph: 'For over a century, our artisans have dedicated their lives to the pursuit of perfection...', showHeading: true, showParagraph: true } },
    { id: 'mock-3', type: 'split-left-image', is_visible: true, data: { image: 'https://www.keringeyewear.com/dam/jcr:5bf188d9-23ab-4f6a-b304-94d5b7a40f2c/KeringEyewear_Website_Thumbnails_blok_4251_10%20(1).jpg', heading: 'PRECISION IN EVERY CURVE', paragraph: 'From the initial sketch to the final polish...', showHeading: true, showParagraph: true } },
    { id: 'mock-4', type: 'split-right-image', is_visible: true, data: { image: 'https://www.keringeyewear.com/dam/jcr:7950e987-62e3-42a2-ad5b-315c0d897664/KeringEyewear_Website_Thumbnails_now_6665_C04_10%20(1).jpg', heading: 'SUSTAINABLE INNOVATION', paragraph: 'We are pioneering new ways to create luxury eyewear...', showHeading: true, showParagraph: true } },
    { id: 'mock-5', type: 'product-grid', is_visible: true, data: {} }
  ] }
];

async function seed() {
  console.log("Seeding Brands...");
  const { error: brandErr } = await supabase.from('brands').upsert(INITIAL_BRANDS);
  if (brandErr) console.error("Error seeding brands:", brandErr);

  console.log("Seeding Products...");
  const { error: prodErr } = await supabase.from('products').upsert(INITIAL_PRODUCTS);
  if (prodErr) console.error("Error seeding products:", prodErr);

  console.log("Seeding Content Articles...");
  for (const article of INITIAL_CONTENT_ARTICLES) {
    const { modules, ...articleData } = article;
    const { error: artErr } = await supabase.from('content_articles').upsert([articleData]);
    if (artErr) {
      console.error("Error seeding article:", artErr);
      continue;
    }

    if (modules && modules.length > 0) {
      const formattedModules = modules.map((m, index) => ({
        id: m.id,
        article_id: article.id,
        type: m.type,
        is_visible: m.is_visible,
        sort_order: index,
        data: m.data
      }));
      const { error: modErr } = await supabase.from('content_modules').upsert(formattedModules);
      if (modErr) console.error("Error seeding modules for article:", article.id, modErr);
    }
  }

  console.log("Seeding Complete!");
}

seed().catch(console.error);
