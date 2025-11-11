// Quick script to fetch and save SAM.gov data for demo mode
const fetch = require('node-fetch');
const fs = require('fs');

async function fetchAndSave() {
  console.log('Fetching live SAM.gov data...');
  
  const baseUrl = 'http://localhost:3000/proxy/search';
  
  const landscape = await fetch(`${baseUrl}?keywords=landscaping&limit=100`).then(r => r.json());
  console.log(`Fetched ${landscape.opportunitiesData.length} landscape records`);
  
  const stone = await fetch(`${baseUrl}?keywords=stone&limit=100`).then(r => r.json());
  console.log(`Fetched ${stone.opportunitiesData.length} stone records`);
  
  const gravel = await fetch(`${baseUrl}?keywords=gravel&limit=100`).then(r => r.json());
  console.log(`Fetched ${gravel.opportunitiesData.length} gravel records`);
  
  const data = {
    landscape: landscape.opportunitiesData,
    stone: stone.opportunitiesData,
    gravel: gravel.opportunitiesData,
    fetchDate: new Date().toISOString()
  };
  
  fs.writeFileSync('sam-live-data.json', JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n✅ Saved ${data.landscape.length + data.stone.length + data.gravel.length} records to sam-live-data.json`);
}

fetchAndSave().catch(console.error);
