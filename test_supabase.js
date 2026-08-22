import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://dpxkmjupcwgmyjhbdexz.supabase.co", "sb_publishable_Noe5B4vtVOdYsohh8ZHOTA_DUIOsUnK");

async function test() {
    const { data, error } = await supabase.from('sets').insert({
        id: Date.now().toString(),
        name: 'Test Set',
        items: []
    });
    console.log("Error:", error);
}

test();
