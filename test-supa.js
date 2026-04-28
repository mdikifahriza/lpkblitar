const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://nvompuwaowyexmprxext.supabase.co', 'sb_publishable_5VwQBuHMOSslFciX4HG5iA_8smPoMwA');

async function test() {
  const { data: res } = await supabase.rpc('get_tables_and_columns_test_fake');
  // Since we can't do RPC, let's query typical table names for a law firm portfolio or use the existing ones:
  const tablesToTry = ['site_settings', 'services', 'articles', 'faqs', 'inquiries', 'team_members', 'testimonials', 'blogs', 'posts', 'team', 'faq', 'portofolio', 'contact'];
  for (const table of tablesToTry) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
       console.log(`Table '${table}' exists. Columns:`, Object.keys(data[0] || {}));
    } else {
       console.log(`Table '${table}' error:`, error.message);
    }
  }
}
test();
