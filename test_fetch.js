import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envFile = fs.readFileSync('.env', 'utf8')
const url = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1].trim()
const key = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim()

const supabase = createClient(url, key)

async function test() {
  const { data, error } = await supabase.from('homepage_grid_items').select('*')
  if (error) console.error(error)
  else console.log(JSON.stringify(data.slice(0, 3), null, 2))
}
test()
