import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const env = dotenv.parse(fs.readFileSync('.env'));
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function clean() {
    const { data, error } = await supabase.from('sets').delete().is('main_category', null);
    console.log("Deleted null category sets");
}

clean();
