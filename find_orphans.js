import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = JSON.parse(fs.readFileSync('.env.json', 'utf8') || '{}');
// Wait, I can just write a sql script to find them!
