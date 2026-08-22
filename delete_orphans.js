import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpxkmjupcwgmyjhbdexz.supabase.co';
const supabaseKey = 'sb_publishable_Noe5B4vtVOdYsohh8ZHOTA_DUIOsUnK';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: sets, error: e1 } = await supabase.from('sets').select('items');
  if (e1) console.error("Sets error:", e1);
  
  const assignedIds = new Set();
  (sets || []).forEach(s => {
    (s.items || []).forEach(item => {
      if (!item.isPlaceholder && item.productId) {
        assignedIds.add(item.productId);
      }
    });
  });
  
  const { data: products, error: e2 } = await supabase.from('products').select('id, name');
  if (e2) console.error("Products error:", e2);
  
  const orphans = (products || []).filter(p => !assignedIds.has(p.id));
  console.log("Found orphans:", orphans.map(o => o.name));
  
  if (orphans.length > 0) {
    const orphanIds = orphans.map(p => p.id);
    const { error } = await supabase.from('products').delete().in('id', orphanIds);
    if (error) {
      console.error("Error deleting:", error);
    } else {
      console.log("Deleted", orphans.length, "orphaned products.");
    }
  } else {
    console.log("No orphans found.");
  }
}

run();
