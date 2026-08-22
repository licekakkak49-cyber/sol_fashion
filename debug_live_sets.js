import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read config to get supabase url and key
const config = JSON.parse(fs.readFileSync('.env.json', 'utf8') || '{}');
// Wait, I can just use the credentials if they are hardcoded somewhere or I can use the existing config.
