import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const brandUpdates = [
  {
    name: 'LINDBERG',
    slug: 'lindberg',
    description: 'LINDBERG eyewear tells the world you subscribe to a different way of thinking, and have a connoisseur’s appreciation of exceptional design and high-quality materials. Every frame is a statement about aesthetics, technical innovation and impeccable craftsmanship. Handcrafted in Denmark, their ultra-lightweight titanium designs eliminate screws, rivets, and welds for unparalleled comfort.',
    banner_url: 'https://images.unsplash.com/photo-1621213568892-db4f2e51920b?q=80&w=1920&auto=format&fit=crop'
  },
  {
    name: 'GUCCI',
    slug: 'gucci',
    description: 'Gucci’s eclectic, contemporary and romantic approach to design is perfectly translated into their eyewear collections. Characterized by bold shapes, vibrant colors, and iconic house motifs, Gucci eyewear is crafted for those who embrace fashion without limits. Under visionary direction, the brand continues to redefine luxury for the 21st century.',
    banner_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop'
  },
  {
    name: 'CARTIER',
    slug: 'cartier',
    description: 'Cartier eyewear is a testament to the Maison’s legacy of exceptional craftsmanship and timeless elegance. Drawing inspiration from their iconic jewelry collections—such as the Panthère and Santos—each frame is meticulously crafted with precious materials, including gold finishes and genuine wood, to create authentic optical masterpieces.',
    banner_url: 'https://images.unsplash.com/photo-1577227448839-86cb7301c23a?q=80&w=1920&auto=format&fit=crop'
  },
  {
    name: 'SAINT LAURENT',
    slug: 'saint-laurent',
    description: 'Saint Laurent’s eyewear collection reflects the house’s signature Parisian edge—sleek, sharp, and uncompromisingly modern. With a focus on distinct, structural silhouettes and understated luxury, these frames are designed to exude effortless sophistication and rebellious elegance.',
    banner_url: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=1920&auto=format&fit=crop'
  },
  {
    name: 'GENTLE MONSTER',
    slug: 'gentle-monster',
    description: 'Gentle Monster continuously redefines the boundaries of eyewear through its disruptive, avant-garde designs and highly experimental visual approach. Their frames are bold statement pieces that blend contemporary art, futuristic aesthetics, and high-end fashion, creating an entirely unique eyewear experience.',
    banner_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1920&auto=format&fit=crop'
  }
];

async function updateBrands() {
  console.log('Updating brands with descriptions and banners...');
  
  for (const brand of brandUpdates) {
    // Upsert based on slug
    const { data, error } = await supabase
      .from('brands')
      .update({ 
        description: brand.description,
        banner_url: brand.banner_url
      })
      .eq('slug', brand.slug)
      .select();

    if (error) {
      console.error(`Error updating ${brand.name}:`, error);
    } else {
      console.log(`Updated ${brand.name}`);
    }
  }

  console.log('Finished updating brands.');
}

updateBrands();
