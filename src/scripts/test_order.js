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

async function testUpdateCreatedAt() {
  const { data: brand } = await supabase.from('brands').select('*').eq('id', 'lindberg').single();
  console.log("Original created_at:", brand.created_at);
  
  const newDate = new Date(Date.now() - 1000000).toISOString();
  
  const { data, error } = await supabase.from('brands').update({ created_at: newDate }).eq('id', 'lindberg').select();
  
  if (error) {
    console.error("Update failed:", error);
  } else {
    console.log("Updated created_at successfully:", data[0].created_at);
  }
}

testUpdateCreatedAt();
