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

const BASE_PRODUCTS = [
  { name: "Aden", image_url: "https://www.keringeyewear.com/dam/jcr:5bf188d9-23ab-4f6a-b304-94d5b7a40f2c/KeringEyewear_Website_Thumbnails_blok_4251_10%20(1).jpg" },
  { name: "Mod", image_url: "https://www.keringeyewear.com/dam/jcr:7950e987-62e3-42a2-ad5b-315c0d897664/KeringEyewear_Website_Thumbnails_now_6665_C04_10%20(1).jpg" },
  { name: "Vert", image_url: "https://www.keringeyewear.com/dam/jcr:1b521430-17e7-4319-b734-ff8d48428ccd/KeringEyewear_Website_Thumbnails_thintanium_5350_K292_PGT%20(1).jpg" },
  { name: "Red", image_url: "https://www.keringeyewear.com/dam/jcr:cb990dd9-9732-4075-a5a2-52757c778132/KeringEyewear_Website_Thumbnails_rim_82028_SL112_10%20(1).jpg" }
];

const BRANDS = ['gucci', 'cartier', 'lindberg', 'saint-laurent', 'gentle-monster'];
const FRAME_COLORS = ['Black', 'Silver', 'Gold', 'Brown', 'Clear', 'Tortoise', 'White', 'Blue', 'Red'];
const LENS_COLORS = ['Black', 'Gray', 'Brown', 'Blue', 'Green', 'Clear', 'Yellow'];
const MATERIALS = ['Acetate', 'Metal', 'Titanium', 'Nylon', 'Mixed'];
const SHAPES = ['Square', 'Round', 'Oval', 'Cat-eye', 'Aviator', 'Rectangle', 'Geometric'];
const GENDERS = ['Unisex', 'Men', 'Women'];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMockProducts(count) {
  const products = [];
  
  for (let i = 0; i < count; i++) {
    const base = randomChoice(BASE_PRODUCTS);
    const brand_id = randomChoice(BRANDS);
    const frame_color = randomChoice(FRAME_COLORS);
    const lens_color = randomChoice(LENS_COLORS);
    const material = randomChoice(MATERIALS);
    const shape = randomChoice(SHAPES);
    const gender = randomChoice(GENDERS);
    
    // Generate some random dates within the last 2 years
    const uploadDate = new Date();
    uploadDate.setDate(uploadDate.getDate() - Math.floor(Math.random() * 730));

    products.push({
      id: `mock-${Date.now()}-${i}`,
      name: `${base.name} ${Math.floor(Math.random() * 99) + 1}`,
      brand_id,
      price: Math.floor(Math.random() * 25000) + 5000, // Price between 5000 and 30000
      sku: `${brand_id.substring(0,2).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
      stock: Math.floor(Math.random() * 50),
      is_polarized: Math.random() > 0.5 ? "Yes" : "No",
      gender,
      image_url: base.image_url,
      frame_color,
      lens_color,
      material,
      shape,
      status: Math.random() > 0.8 ? "To be restocked" : "In Stock",
      highlight: Math.random() > 0.9 ? ["Best Seller"] : Math.random() > 0.8 ? ["New Arrival"] : [],
      upload_date: uploadDate.toISOString()
    });
  }
  return products;
}

async function seedMore() {
  console.log("Generating 50 new mock products...");
  const newProducts = generateMockProducts(50);
  
  console.log("Inserting into Supabase...");
  const { error } = await supabase.from('products').upsert(newProducts);
  
  if (error) {
    console.error("Error inserting products:", error);
  } else {
    console.log("Successfully inserted 50 products!");
  }
}

seedMore().catch(console.error);
