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

const ARTICLE_ID = '1'; // Blue & Beyond Experience

const newModules = [
  {
    id: 'bb-1',
    article_id: ARTICLE_ID,
    type: 'center-text',
    is_visible: true,
    sort_order: 0,
    data: {
      heading: 'THE PERFECT COMBINATION OF STYLE AND TECHNOLOGY',
      paragraph: 'Kering Eyewear expands its product range with the launch of the new Blue & Beyond project including a curated assortment of blue light and photochromic UV protection glasses signed by Gucci, Cartier, Saint Laurent, Montblanc, Chloé and dunhill.\n\nIntroduced for the first time in the luxury eyewear industry, the Blue & Beyond project consists in the combination of high-end iconic frames with qualitative dual-innovation lenses that are specifically conceived to relieve intense eyestrain both indoors and outdoors.\n\nThe double benefit of the product derives from the pioneering combination of distinctive styles with smart lenses characterised by a blue-light-filtering treatment with photochromic technology, which allows to reduce the impact of high-energy light from laptops and digital devices, while also protecting the eyes by darkening the colour when exposed to sunlight.',
      showHeading: true,
      showParagraph: true,
      image: ''
    }
  },
  {
    id: 'bb-2',
    article_id: ARTICLE_ID,
    type: 'full-image',
    is_visible: true,
    sort_order: 1,
    data: {
      heading: '',
      paragraph: '',
      showHeading: false,
      showParagraph: false,
      image: 'https://images.unsplash.com/photo-1593214451196-37e0651f8ef2?q=80&w=1920&auto=format&fit=crop'
    }
  },
  {
    id: 'bb-3',
    article_id: ARTICLE_ID,
    type: 'split-left-image',
    is_visible: true,
    sort_order: 2,
    data: {
      heading: 'BLUE LIGHT REDUCTION COATING',
      paragraph: 'INDOOR - At clear state, it guarantees Blue Light reduction for a total absorption of Blue Light (380-500nm) from 26% to 45%.\n\nOUTDOOR - At dark state, it boosts the Blue Light reduction powered by the photochromic technology reaching at least 70%.\n\nThis improved solution is now transferred to an exclusive assortment of ready-to-wear styles for some of the most coveted brands within Kering Eyewear’s portfolio.',
      showHeading: true,
      showParagraph: true,
      image: 'https://images.unsplash.com/photo-1559124434-6014452140bb?q=80&w=1000&auto=format&fit=crop'
    }
  },
  {
    id: 'bb-4',
    article_id: ARTICLE_ID,
    type: 'split-right-image',
    is_visible: true,
    sort_order: 3,
    data: {
      heading: 'GUCCI',
      paragraph: 'Gucci’s Blue & Beyond selection includes men’s and women’s designs crafted from subtle metal and bold acetate. The smart photochromic lenses change from clear to burgundy for her, and clear to brown for him, playing with feminine cat-eye silhouettes and classic square and rectangular constructions.',
      showHeading: true,
      showParagraph: true,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop'
    }
  },
  {
    id: 'bb-5',
    article_id: ARTICLE_ID,
    type: 'split-left-image',
    is_visible: true,
    sort_order: 4,
    data: {
      heading: 'CARTIER',
      paragraph: 'Cartier applies this advanced technology to its emblematic shapes in subtle metal and mixed materials. Styles are integrated with clear to burgundy and clear to blue lenses that elevate the unisex pilot and round frames adding an elegant cat-eye silhouette to the women’s range, which is enhanced with the Maison’s most feminine codes including the Panthère de Cartier.',
      showHeading: true,
      showParagraph: true,
      image: 'https://images.unsplash.com/photo-1577227448839-86cb7301c23a?q=80&w=1000&auto=format&fit=crop'
    }
  },
  {
    id: 'bb-6',
    article_id: ARTICLE_ID,
    type: 'split-right-image',
    is_visible: true,
    sort_order: 5,
    data: {
      heading: 'SAINT LAURENT',
      paragraph: 'Saint Laurent implements the concept on its iconic eyewear shapes for men and women, all coming with statement profiles in acetate and metal. Bold cat-eye, square and heart-shaped silhouettes for her, and streamlined, versatile styles for him feature clear to grey lenses that perfectly align with the Maison’s vision of distinctive sophistication.',
      showHeading: true,
      showParagraph: true,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop'
    }
  },
  {
    id: 'bb-7',
    article_id: ARTICLE_ID,
    type: 'split-left-image',
    is_visible: true,
    sort_order: 6,
    data: {
      heading: 'MONTBLANC',
      paragraph: 'Montblanc applies the Blue & Beyond innovation to its signature masculine frames in acetate, metal and in lightweight mixes of different materials. The full rim structures balance classic allure and bold design hosting smart lenses changing in color from clear to blue.',
      showHeading: true,
      showParagraph: true,
      image: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=1000&auto=format&fit=crop'
    }
  },
  {
    id: 'bb-8',
    article_id: ARTICLE_ID,
    type: 'split-right-image',
    is_visible: true,
    sort_order: 7,
    data: {
      heading: 'CHLOÉ',
      paragraph: 'The newly added frames from Chloé reflect the natural femininity of the brand combining soft gradient colors with delicate gold metal finishes. The bio-based acetate frames featuring waved-temples and the iconic geometrical metal shapes are integrated with clear to warm brown lenses that convey the brand’s innate passion for earthy and natural nuances.',
      showHeading: true,
      showParagraph: true,
      image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1000&auto=format&fit=crop'
    }
  },
  {
    id: 'bb-9',
    article_id: ARTICLE_ID,
    type: 'split-left-image',
    is_visible: true,
    sort_order: 8,
    data: {
      heading: 'DUNHILL',
      paragraph: 'The dunhill frames combine clear to grey lenses with acetate, to clear to warm brown lenses with metal. The masculine looks blend classic appeal and modern edge enriching each meticulously engineered construction with the House’s signature details inspired by the Engine Turn pattern and the Rollagas code.',
      showHeading: true,
      showParagraph: true,
      image: 'https://images.unsplash.com/photo-1614715838608-dd527c46231d?q=80&w=1000&auto=format&fit=crop'
    }
  },
  {
    id: 'bb-10',
    article_id: ARTICLE_ID,
    type: 'product-grid',
    is_visible: true,
    sort_order: 9,
    data: {
      heading: 'DISCOVER THE COLLECTION'
    }
  }
];

async function updateBlueBeyond() {
  console.log("Deleting old modules for article 1...");
  const { error: delErr } = await supabase.from('content_modules').delete().eq('article_id', ARTICLE_ID);
  
  if (delErr) {
    console.error("Error deleting old modules:", delErr);
    return;
  }

  console.log("Inserting new Blue & Beyond modules...");
  const { error: insErr } = await supabase.from('content_modules').insert(newModules);
  
  if (insErr) {
    console.error("Error inserting modules:", insErr);
  } else {
    console.log("Successfully rebuilt Blue & Beyond page!");
  }
}

updateBlueBeyond();
