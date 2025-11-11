const fs = require('fs');

// Generate 203+ realistic demo records across all divisions
const agencies = [
  'Department of Veterans Affairs', 'Department of Defense', 'General Services Administration',
  'Department of Transportation', 'Army Corps of Engineers', 'Department of Interior',
  'Department of Agriculture', 'National Park Service', 'Bureau of Land Management',
  'US Forest Service', 'Department of Homeland Security', 'Federal Aviation Administration'
];

const ctCities = [
  'Hartford', 'New Haven', 'Stamford', 'Bridgeport', 'Waterbury', 'Norwalk', 
  'Danbury', 'New Britain', 'West Hartford', 'Greenwich', 'Hamden', 'Meriden',
  'Bristol', 'Manchester', 'West Haven', 'Milford', 'Stratford', 'East Hartford',
  'Middletown', 'Wallingford', 'Norwich', 'Shelton', 'Torrington', 'Trumbull',
  'Ansonia', 'Derby', 'Groton', 'New London', 'Windsor', 'Enfield'
];

const states = ['CT', 'MA', 'NY', 'RI', 'NJ', 'NH', 'VT', 'PA'];

function randomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function randomFutureDate(daysOut = 60) {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysOut) + 15);
  return date.toISOString().split('T')[0];
}

function randomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Landscaping opportunities (70 records)
const landscapingTitles = [
  'Grounds Maintenance Services', 'Landscape Installation and Maintenance', 
  'Tree Removal and Pruning Services', 'Arborist Services',
  'Lawn Care and Mowing', 'Athletic Field Maintenance', 'Park Grounds Maintenance',
  'Cemetery Grounds Keeping', 'Campus Landscape Services', 'Turf Management',
  'Irrigation System Installation', 'Snow Removal and Ice Management',
  'Vegetation Management', 'Erosion Control Services', 'Native Planting Services'
];

const landscapeRecords = [];
for (let i = 0; i < 70; i++) {
  const isActive = Math.random() > 0.3;
  landscapeRecords.push({
    noticeId: `LAND-2024-${String(i + 1).padStart(3, '0')}`,
    title: `${landscapingTitles[i % landscapingTitles.length]} - ${agencies[i % agencies.length]}`,
    type: isActive ? 'Solicitation' : 'Award Notice',
    solicitationNumber: `${['VA', 'DOD', 'GSA', 'DOT', 'USACE'][i % 5]}-${2024 - (isActive ? 0 : 1)}-${String(100 + i).padStart(3, '0')}`,
    postedDate: randomDate(new Date('2024-01-01'), new Date('2024-11-10')),
    responseDeadLine: isActive ? randomFutureDate() : randomDate(new Date('2023-01-01'), new Date('2024-06-01')),
    fullParentPathName: agencies[i % agencies.length],
    placeOfPerformance: {
      city: { name: ctCities[i % ctCities.length] },
      state: { code: states[i % states.length] }
    },
    naicsCode: '561730',
    description: `${isActive ? 'Seeking contractor for' : 'Awarded contract for'} comprehensive ${landscapingTitles[i % landscapingTitles.length].toLowerCase()} including maintenance, care, and related services.`,
    estimatedValue: randomValue(50000, 800000),
    active: isActive ? 'Yes' : 'No',
    award: isActive ? null : {
      date: randomDate(new Date('2023-06-01'), new Date('2024-09-01')),
      awardee: {
        name: `${['Green', 'Landscape', 'Premier', 'Professional', 'Elite'][i % 5]} ${['Services', 'Solutions', 'Contractors', 'Group', 'Corp'][Math.floor(i / 5) % 5]} LLC`,
        location: {
          city: { name: ctCities[(i + 3) % ctCities.length] },
          state: { code: 'CT' }
        }
      }
    }
  });
}

// Stone/Hardscape opportunities (70 records)
const stoneTitles = [
  'Hardscape Installation', 'Stone Paver Installation', 'Retaining Wall Construction',
  'Masonry Restoration', 'Stone Veneer Installation', 'Concrete Paving',
  'Decorative Stone Work', 'Plaza Reconstruction', 'Walkway Installation',
  'Parking Lot Construction', 'Building Facade Restoration', 'Monument Installation',
  'Outdoor Kitchen Construction', 'Fire Pit Installation', 'Stone Stairway Construction'
];

const stoneRecords = [];
for (let i = 0; i < 70; i++) {
  const isActive = Math.random() > 0.35;
  stoneRecords.push({
    noticeId: `STONE-2024-${String(i + 1).padStart(3, '0')}`,
    title: `${stoneTitles[i % stoneTitles.length]} - ${agencies[(i + 2) % agencies.length]}`,
    type: isActive ? 'Solicitation' : 'Award Notice',
    solicitationNumber: `${['GSA', 'DOD', 'VA', 'DOI', 'USDA'][i % 5]}-${2024 - (isActive ? 0 : 1)}-${String(200 + i).padStart(3, '0')}`,
    postedDate: randomDate(new Date('2024-01-01'), new Date('2024-11-10')),
    responseDeadLine: isActive ? randomFutureDate() : randomDate(new Date('2023-01-01'), new Date('2024-06-01')),
    fullParentPathName: agencies[(i + 2) % agencies.length],
    placeOfPerformance: {
      city: { name: ctCities[(i + 5) % ctCities.length] },
      state: { code: states[(i + 1) % states.length] }
    },
    naicsCode: ['238910', '238140'][i % 2],
    description: `${isActive ? 'Seeking contractor for' : 'Awarded contract for'} professional ${stoneTitles[i % stoneTitles.length].toLowerCase()} services including materials and installation.`,
    estimatedValue: randomValue(100000, 1200000),
    active: isActive ? 'Yes' : 'No',
    award: isActive ? null : {
      date: randomDate(new Date('2023-06-01'), new Date('2024-09-01')),
      awardee: {
        name: `${['Heritage', 'Precision', 'Master', 'Quality', 'Superior'][i % 5]} ${['Stone', 'Masonry', 'Hardscape', 'Construction', 'Builders'][Math.floor(i / 5) % 5]} Inc`,
        location: {
          city: { name: ctCities[(i + 7) % ctCities.length] },
          state: { code: 'CT' }
        }
      }
    }
  });
}

// Gravel/Aggregate opportunities (70 records)
const gravelTitles = [
  'Aggregate Materials Supply', 'Sand and Gravel Delivery', 'Crushed Stone Supply',
  'Construction Aggregate', 'Base Course Materials', 'Road Construction Materials',
  'Quarry Materials Supply', 'Fill Dirt and Topsoil', 'Drainage Stone Supply',
  'Concrete Aggregates', 'Asphalt Aggregates', 'Railroad Ballast',
  'Riprap and Erosion Stone', 'Decorative Rock Supply', 'Bulk Material Delivery'
];

const gravelRecords = [];
for (let i = 0; i < 70; i++) {
  const isActive = Math.random() > 0.3;
  gravelRecords.push({
    noticeId: `GRAV-2024-${String(i + 1).padStart(3, '0')}`,
    title: `${gravelTitles[i % gravelTitles.length]} - ${agencies[(i + 4) % agencies.length]}`,
    type: isActive ? 'Solicitation' : 'Award Notice',
    solicitationNumber: `${['DOT', 'USACE', 'DOD', 'GSA', 'FAA'][i % 5]}-${2024 - (isActive ? 0 : 1)}-${String(300 + i).padStart(3, '0')}`,
    postedDate: randomDate(new Date('2024-01-01'), new Date('2024-11-10')),
    responseDeadLine: isActive ? randomFutureDate() : randomDate(new Date('2023-01-01'), new Date('2024-06-01')),
    fullParentPathName: agencies[(i + 4) % agencies.length],
    placeOfPerformance: {
      city: { name: ctCities[(i + 10) % ctCities.length] },
      state: { code: states[(i + 2) % states.length] }
    },
    naicsCode: ['212321', '212319', '423320'][i % 3],
    description: `${isActive ? 'Seeking supplier for' : 'Awarded contract for'} ${gravelTitles[i % gravelTitles.length].toLowerCase()} for construction and infrastructure projects.`,
    estimatedValue: randomValue(150000, 2000000),
    active: isActive ? 'Yes' : 'No',
    award: isActive ? null : {
      date: randomDate(new Date('2023-06-01'), new Date('2024-09-01')),
      awardee: {
        name: `${['Connecticut', 'Northeast', 'Regional', 'Premier', 'Atlantic'][i % 5]} ${['Aggregates', 'Materials', 'Quarry', 'Supply', 'Stone'][Math.floor(i / 5) % 5]} Corp`,
        location: {
          city: { name: ctCities[(i + 12) % ctCities.length] },
          state: { code: 'CT' }
        }
      }
    }
  });
}

const allData = {
  landscape: landscapeRecords,
  stone: stoneRecords,
  gravel: gravelRecords
};

fs.writeFileSync('sam-live-data.json', JSON.stringify(allData, null, 2), 'utf8');
console.log(`✅ Generated ${landscapeRecords.length + stoneRecords.length + gravelRecords.length} demo records`);
console.log(`   Landscaping: ${landscapeRecords.length}`);
console.log(`   Stone/Hardscape: ${stoneRecords.length}`);
console.log(`   Gravel/Aggregate: ${gravelRecords.length}`);
