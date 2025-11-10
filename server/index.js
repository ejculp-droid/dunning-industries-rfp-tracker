const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (optional) if you put index.html in /public
app.use(express.static(path.join(__dirname, '..', 'public')));

const API_KEY = process.env.SAM_API_KEY;
if (!API_KEY) console.warn('Warning: SAM_API_KEY not set. Set environment variable before starting.');

app.get('/proxy/search', async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: 'SAM_API_KEY not set on server' });

    const params = new URLSearchParams();
    Object.entries(req.query).forEach(([k, v]) => {
      if (k === 'api_key') return;
      params.append(k, v);
    });
    params.append('api_key', API_KEY);

    const url = `https://api.sam.gov/opportunities/v2/search?${params.toString()}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
