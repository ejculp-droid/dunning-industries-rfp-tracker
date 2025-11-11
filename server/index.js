const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

const API_KEY = process.env.SAM_API_KEY;
if (!API_KEY) {
  console.warn('Warning: SAM_API_KEY not set. Set environment variable before starting.');
}

// Load live SAM.gov data for demo mode
let liveDataCache = null;
try {
  const dataPath = path.join(__dirname, '..', 'sam-live-data.json');
  if (fs.existsSync(dataPath)) {
    liveDataCache = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`📦 Loaded ${liveDataCache.landscape.length + liveDataCache.stone.length + liveDataCache.gravel.length} cached SAM.gov records for demo mode`);
  }
} catch (err) {
  console.warn('Could not load sam-live-data.json, using fallback demo data');
}

// Demo RFP data for when SAM.gov is rate-limited
function getDemoData(keywords = '') {
  // If we have live cached data, use it
  if (liveDataCache) {
    const kw = keywords.toLowerCase();
    let dataSet = [];
    
    if (kw.includes('landscap') || kw.includes('ground') || kw.includes('tree') || kw.includes('mow') || kw.includes('arborist') || kw.includes('lawn') || kw.includes('turf')) {
      dataSet = liveDataCache.landscape;
    } else if (kw.includes('stone') || kw.includes('hardscape') || kw.includes('mason') || kw.includes('paver') || kw.includes('retain')) {
      dataSet = liveDataCache.stone;
    } else if (kw.includes('sand') || kw.includes('gravel') || kw.includes('excavat') || kw.includes('quarry') || kw.includes('aggregat') || kw.includes('crush')) {
      dataSet = liveDataCache.gravel;
      } else {
        // No specific keyword - return all records for general searches
        dataSet = [...liveDataCache.landscape, ...liveDataCache.stone, ...liveDataCache.gravel];
      }
    
    return {
      totalRecords: dataSet.length,
      opportunitiesData: dataSet
    };
  }
  
  // Fallback to hardcoded data if file not available
  const kw = keywords.toLowerCase();
  const isLandscaping = kw.includes('landscape') || kw.includes('ground') || kw.includes('tree') || kw.includes('mowing') || kw.includes('arborist');
  const isStone = kw.includes('stone') || kw.includes('hardscape') || kw.includes('masonry') || kw.includes('aggregate');
  const isGravel = kw.includes('sand') || kw.includes('gravel') || kw.includes('excavation') || kw.includes('quarry');
  
  const allOpps = [
    // Landscaping opportunities
    { noticeId: 'DEMO-LAND-001', title: 'Grounds Maintenance Services - VA Hospital Hartford', type: 'Solicitation', solicitationNumber: 'VA-24-001', postedDate: '2024-11-01', responseDeadLine: '2024-12-15', fullParentPathName: 'Department of Veterans Affairs', placeOfPerformance: { city: { name: 'Hartford' }, state: { code: 'CT' }}, naicsCode: '561730', description: 'Comprehensive grounds maintenance including mowing, tree care, and landscaping for VA Medical Center Hartford campus.', estimatedValue: 250000, active: 'Yes', award: null },
    { noticeId: 'DEMO-LAND-002', title: 'Tree Removal and Arborist Services - National Guard', type: 'Solicitation', solicitationNumber: 'NG-CT-2024-15', postedDate: '2024-10-28', responseDeadLine: '2024-12-01', fullParentPathName: 'Department of Defense - National Guard Bureau', placeOfPerformance: { city: { name: 'Windsor Locks' }, state: { code: 'CT' }}, naicsCode: '561730', description: 'Emergency tree removal, pruning, and ongoing arborist services for Connecticut National Guard facilities statewide.', estimatedValue: 180000, active: 'Yes', award: null },
    { noticeId: 'DEMO-LAND-003', title: 'Park Maintenance and Landscaping - NPS', type: 'Award Notice', solicitationNumber: 'NPS-2023-442', postedDate: '2023-08-15', responseDeadLine: '2023-09-30', fullParentPathName: 'Department of the Interior - National Park Service', placeOfPerformance: { city: { name: 'West Hartford' }, state: { code: 'CT' }}, naicsCode: '561730', description: 'Awarded contract for landscape maintenance at Talcott Mountain State Park including trail maintenance and grounds keeping.', estimatedValue: 320000, active: 'No', award: { date: '2023-10-15', awardee: { name: 'GreenScape Professionals LLC', location: { city: { name: 'Hartford' }, state: { code: 'CT' }}}}},
    
    // Stone/Hardscape opportunities
    { noticeId: 'DEMO-STONE-001', title: 'Hardscape Installation - Federal Courthouse', type: 'Solicitation', solicitationNumber: 'GSA-NE-24-088', postedDate: '2024-10-20', responseDeadLine: '2024-12-10', fullParentPathName: 'General Services Administration', placeOfPerformance: { city: { name: 'New Haven' }, state: { code: 'CT' }}, naicsCode: '238910', description: 'Installation of stone pavers, retaining walls, and hardscape improvements at Federal Courthouse plaza.', estimatedValue: 420000, active: 'Yes', award: null },
    { noticeId: 'DEMO-STONE-002', title: 'Masonry Restoration - Historic Post Office', type: 'Award Notice', solicitationNumber: 'GSA-2023-225', postedDate: '2023-06-10', responseDeadLine: '2023-07-25', fullParentPathName: 'General Services Administration', placeOfPerformance: { city: { name: 'Stamford' }, state: { code: 'CT' }}, naicsCode: '238140', description: 'Awarded contract for stone and masonry restoration of historic post office building exterior.', estimatedValue: 580000, active: 'No', award: { date: '2023-08-15', awardee: { name: 'Heritage Stone & Masonry Inc', location: { city: { name: 'Danbury' }, state: { code: 'CT' }}}}},
    
    // Gravel/Aggregate opportunities  
    { noticeId: 'DEMO-GRAV-001', title: 'Aggregate Materials Supply - Highway Construction', type: 'Solicitation', solicitationNumber: 'FHWA-CT-2024-33', postedDate: '2024-11-05', responseDeadLine: '2024-12-20', fullParentPathName: 'Department of Transportation - Federal Highway Administration', placeOfPerformance: { city: { name: 'Hartford' }, state: { code: 'CT' }}, naicsCode: '212321', description: 'Supply of crushed stone, sand, and gravel aggregates for I-84 reconstruction project.', estimatedValue: 1200000, active: 'Yes', award: null },
    { noticeId: 'DEMO-GRAV-002', title: 'Sand and Gravel Delivery - Corps of Engineers', type: 'Solicitation', solicitationNumber: 'USACE-NAE-24-152', postedDate: '2024-10-15', responseDeadLine: '2024-11-30', fullParentPathName: 'Department of Defense - Army Corps of Engineers', placeOfPerformance: { city: { name: 'Middletown' }, state: { code: 'CT' }}, naicsCode: '212321', description: 'Delivery of construction-grade sand and gravel for flood control infrastructure improvements.', estimatedValue: 350000, active: 'Yes', award: null },
    { noticeId: 'DEMO-GRAV-003', title: 'Quarry Materials - Military Base Construction', type: 'Award Notice', solicitationNumber: 'DOD-2023-889', postedDate: '2023-05-20', responseDeadLine: '2023-07-01', fullParentPathName: 'Department of Defense', placeOfPerformance: { city: { name: 'Groton' }, state: { code: 'CT' }}, naicsCode: '212319', description: 'Awarded contract for quarried stone and aggregate materials for Naval Submarine Base infrastructure upgrades.', estimatedValue: 890000, active: 'No', award: { date: '2023-07-20', awardee: { name: 'Connecticut Aggregates Corp', location: { city: { name: 'New London' }, state: { code: 'CT' }}}}}
  ];
  
  // Filter based on keywords
  let filtered = allOpps;
  if (isLandscaping) filtered = allOpps.filter(o => o.naicsCode === '561730');
  else if (isStone) filtered = allOpps.filter(o => ['238910', '238140'].includes(o.naicsCode));
  else if (isGravel) filtered = allOpps.filter(o => ['212321', '212319'].includes(o.naicsCode));
  
  return {
    totalRecords: filtered.length,
    opportunitiesData: filtered
  };
}

app.get('/proxy/search', async (req, res) => {
  try {
    // DEMO MODE ONLY - Uncomment the block below to re-enable live SAM.gov queries
    /*
    if (!API_KEY) {
      console.log('  No API key - returning demo data');
      return res.json(getDemoData(req.query.keywords || ''));
    }

    const params = new URLSearchParams();
    Object.entries(req.query).forEach(([k, v]) => {
      if (k === 'api_key') return;
      params.append(k, v);
    });
    
    // SAM.gov requires date range in MM/dd/yyyy format - add defaults if missing
    if (!req.query.postedFrom) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const month = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0');
      const day = String(thirtyDaysAgo.getDate()).padStart(2, '0');
      const year = thirtyDaysAgo.getFullYear();
      params.append('postedFrom', `${month}/${day}/${year}`);
    }
    if (!req.query.postedTo) {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      params.append('postedTo', `${month}/${day}/${year}`);
    }
    
    params.append('api_key', API_KEY);

    const url = `https://api.sam.gov/opportunities/v2/search?${params.toString()}`;
    console.log('Fetching from SAM.gov...');
    const r = await fetch(url);
    const data = await r.json();

    // If rate limited (429) or service error (500), return demo data
    if (r.status === 429 || r.status === 500) {
      console.log(`  SAM.gov ${r.status === 429 ? 'rate limited' : 'service error'} - returning demo data`);
      return res.json(getDemoData(req.query.keywords || ''));
    }

    console.log(`Response status: ${r.status}, Results: ${data.opportunitiesData ? data.opportunitiesData.length : 0}`);

    if (!r.ok) {
      console.error(`SAM.gov API error: ${r.status} ${r.statusText}`);
      return res.status(r.status).json({ error: `SAM.gov API error: ${r.status}`, details: data });
    }

    res.json(data);
    */
    
    // DEMO MODE ACTIVE - Always return cached data
    console.log('🎭 Demo mode: returning cached data');
    return res.json(getDemoData(req.query.keywords || ''));
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`📂 Serving index.html from public folder`);
  console.log(`🔑 SAM API Key: ${API_KEY ? 'Set' : 'NOT SET'}`);
  console.log(`🎭 Demo mode: Enabled (activates on rate limit)`);
});
