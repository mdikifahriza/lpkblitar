const https = require('https');
const url = 'https://nvompuwaowyexmprxext.supabase.co/rest/v1/?apikey=sb_publishable_5VwQBuHMOSslFciX4HG5iA_8smPoMwA';

https.get(url, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const json = JSON.parse(data);
    const tables = Object.keys(json.definitions || {}).filter(k => !k.endsWith('_mutation') && !k.endsWith('_response') && !k.endsWith('_insert') && !k.endsWith('_update'));
    console.log("Tables in Supabase:", tables.join(", "));
    
    // Also print columns for site_settings
    if (json.definitions && json.definitions.site_settings) {
       console.log("site_settings columns:", Object.keys(json.definitions.site_settings.properties));
    }
  });
}).on('error', (e) => console.error(e));
