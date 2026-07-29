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

const mockups = [
  {
    category: 'bespoke',
    title: 'BLUE & BEYOND',
    excerpt: 'Smart dual-innovation lenses: crystal-clear blue light filtering indoors, and instant UV protection outdoors.',
    cover_image_url: 'https://images.unsplash.com/photo-1608243136637-48b0924bfc9f?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-12-01T00:00:00Z',
    is_pinned: true
  },
  {
    category: 'bespoke',
    title: 'SUSTAINABILITY',
    excerpt: 'Learn more about our commitment to Sustainability through three pillars: Care, Collaborate and Create.',
    cover_image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-11-01T00:00:00Z',
    is_pinned: true
  },
  {
    category: 'bespoke',
    title: 'PREMIUM CRAFTSMANSHIP',
    excerpt: 'The final masterpiece: your custom lenses precisely fitted into luxurious frames, ready to redefine how you see the world.',
    cover_image_url: 'https://images.unsplash.com/photo-1716809178831-82b231c279fa?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-10-15T00:00:00Z',
    is_pinned: false
  },
  {
    category: 'bespoke',
    title: 'BESPOKE CONSULTATION',
    excerpt: 'Sit down with our specialists for a comprehensive lifestyle assessment to craft a visual solution uniquely tailored to your daily needs.',
    cover_image_url: 'https://plus.unsplash.com/premium_photo-1661587272603-ec1d6420767b?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-09-10T00:00:00Z',
    is_pinned: false
  },
  {
    category: 'bespoke',
    title: 'PEDIATRIC CARE',
    excerpt: 'We provide specialized, gentle care for our youngest clients, ensuring their visual development is nurtured with the best tools available.',
    cover_image_url: 'https://images.unsplash.com/photo-1539036776273-021ec1d78bec?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-08-05T00:00:00Z',
    is_pinned: false
  },
  {
    category: 'bespoke',
    title: 'EXECUTIVE ELEGANCE',
    excerpt: 'For the discerning individual, we offer eyewear that balances professional sophistication with uncompromising optical performance.',
    cover_image_url: 'https://images.unsplash.com/photo-1506667527953-22eca67dd919?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-07-20T00:00:00Z',
    is_pinned: false
  },
  {
    category: 'bespoke',
    title: 'CURATED SELECTION',
    excerpt: 'Discover frames that perfectly complement your facial features and personal style, guided by our expert optical stylists.',
    cover_image_url: 'https://images.unsplash.com/photo-1545922161-ddbd53e0f89f?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-06-15T00:00:00Z',
    is_pinned: false
  },
  {
    category: 'bespoke',
    title: 'PRECISION DIAGNOSTICS',
    excerpt: 'Our journey begins with state-of-the-art diagnostic technology, ensuring every aspect of your vision is measured with absolute accuracy.',
    cover_image_url: 'https://images.unsplash.com/photo-1616163477138-508df4131a38?w=1920&auto=format&fit=crop&q=80',
    status: 'Published',
    publish_date: '2024-05-10T00:00:00Z',
    is_pinned: false
  }
];

async function seed() {
  console.log('Clearing existing bespoke mockups...');
  // Optional: delete existing bespoke if they are mockups? We'll just insert new ones.

  for (const item of mockups) {
    const articleId = crypto.randomUUID();
    const { data: article, error } = await supabase
      .from('content_articles')
      .insert({ ...item, id: articleId })
      .select()
      .single();

    if (error) {
      console.error(`Error inserting ${item.title}:`, error);
      continue;
    }

    console.log(`Inserted ${item.title} (${article.id})`);

    // Add some default modules to make the detail page not empty
    const modules = [
      {
        id: crypto.randomUUID(),
        article_id: article.id,
        type: 'split-left-image',
        sort_order: 1,
        is_visible: true,
        data: {
          heading: item.title + " Detail",
          showHeading: true,
          paragraph: item.excerpt + "\\n\\nHere is some detailed expanded text to showcase the module system.",
          showParagraph: true,
          image: item.cover_image_url
        }
      }
    ];

    const { error: modError } = await supabase
      .from('content_modules')
      .insert(modules);

    if (modError) {
      console.error(`Error inserting modules for ${item.title}:`, modError);
    }
  }

  console.log('Seeding complete!');
}

seed();
