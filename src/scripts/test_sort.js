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

async function testSort() {
  const baseDate = new Date('2000-01-01T00:00:00Z');
  const sortOrder = 5;
  const newDate = new Date(baseDate.getTime() + sortOrder * 1000);
  
  console.log("Setting to:", newDate.toISOString());
  
  const { data, error } = await supabase.from('brands').update({ created_at: newDate.toISOString() }).eq('id', 'lindberg').select();
  
  if (error) {
    console.error("Update failed:", error);
  } else {
    console.log("Success! Data:", data[0].created_at);
  }
}

testSort();
