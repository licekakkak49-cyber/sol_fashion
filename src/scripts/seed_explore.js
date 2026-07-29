import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const exploreMockups = [
  {
    category: 'explore',
    title: 'THE SUMMER EDIT',
    excerpt: 'Discover our curated selection of sunglasses designed for the sunniest days, featuring bold frames and vibrant tints.',
    thumbnail_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2025-01-01T00:00:00Z',
    is_pinned: true
  },
  {
    category: 'explore',
    title: 'MINIMALIST ESSENTIALS',
    excerpt: 'Sleek, lightweight titanium frames that offer maximum comfort without compromising on contemporary style.',
    thumbnail_url: 'https://images.unsplash.com/photo-1483412468200-72182dbbc544?w=800&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1483412468200-72182dbbc544?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-12-15T00:00:00Z',
    is_pinned: false
  },
  {
    category: 'explore',
    title: 'VINTAGE REVIVAL',
    excerpt: 'Retro silhouettes reimagined with modern materials. Step back in time with our vintage-inspired collection.',
    thumbnail_url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-11-20T00:00:00Z',
    is_pinned: false
  },
  {
    category: 'explore',
    title: 'SPORTS & PERFORMANCE',
    excerpt: 'Engineered for athletes. High-contrast lenses and wrap-around frames that stay secure during intense activities.',
    thumbnail_url: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=800&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-10-05T00:00:00Z',
    is_pinned: false
  },
  {
    category: 'explore',
    title: 'THE ART OF ACETATE',
    excerpt: 'Hand-polished frames crafted from premium Italian acetate, featuring unique tortoiseshell patterns and rich colors.',
    thumbnail_url: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-09-12T00:00:00Z',
    is_pinned: false
  },
  {
    category: 'explore',
    title: 'NIGHT VISION CLARITY',
    excerpt: 'Advanced anti-reflective coatings and yellow-tinted lenses designed to reduce glare and improve contrast for night driving.',
    thumbnail_url: 'https://images.unsplash.com/photo-1598516047230-67c00eecbb67?w=800&auto=format&fit=crop&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1598516047230-67c00eecbb67?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-08-25T00:00:00Z',
    is_pinned: false
  }
];

async function run() {
  console.log("Seeding Explore Articles...");
  
  for (const item of exploreMockups) {
    const articleId = crypto.randomUUID();
    
    // Insert Article
    const { error: articleError } = await supabase
      .from('content_articles')
      .insert({
        id: articleId,
        category: item.category,
        title: item.title,
        excerpt: item.excerpt,
        cover_image_url: item.cover_image_url,
        thumbnail_image_url: item.thumbnail_url,
        status: item.status,
        publish_date: item.publish_date,
        is_pinned: item.is_pinned,
        cover_settings: {
          isVisible: true,
          showTitle: true
        }
      });
      
    if (articleError) {
      console.error(`Error inserting article ${item.title}:`, articleError);
      continue;
    }

    // Add some default modules to make them look complete
    const modules = [
      {
        id: crypto.randomUUID(),
        article_id: articleId,
        type: 'center-text',
        sort_order: 1,
        is_visible: true,
        data: {
          heading: item.title,
          paragraph: item.excerpt,
          showHeading: true,
          showParagraph: true
        }
      },
      {
        id: crypto.randomUUID(),
        article_id: articleId,
        type: 'product-grid',
        sort_order: 2,
        is_visible: true,
        data: {
          productIds: []
        }
      },
      {
        id: crypto.randomUUID(),
        article_id: articleId,
        type: 'chat-button',
        sort_order: 3,
        is_visible: true,
        data: {
          text: 'CHAT WITH STYLIST'
        }
      }
    ];

    const { error: modError } = await supabase
      .from('content_modules')
      .insert(modules);
      
    if (modError) {
      console.error(`Error inserting modules for ${item.title}:`, modError);
    } else {
      console.log(`Inserted: ${item.title}`);
    }
  }
  
  console.log("Done seeding explore articles!");
}

run();
