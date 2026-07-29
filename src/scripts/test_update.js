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

async function testUpdate() {
  const dbUpdate = {
    name: 'LINDBERG TEST',
    description: 'Test description',
    banner_url: 'https://images.unsplash.com/photo-1577227448839-86cb7301c23a'
  };
  
  console.log("Attempting to update LINDBERG...");
  const { data, error } = await supabase.from('brands').update(dbUpdate).eq('id', 'lindberg').select();
  
  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Success! Data:", data);
  }
}

testUpdate();
