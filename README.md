# 🏗️ Dunning Industries RFP Tracker

Multi-Division Government Contract Opportunities Tracker for Dunning Industries (Tree & Landscape, Stone & Supply, Sand & Gravel divisions).

## Features

- 🔍 Search SAM.gov for government contract opportunities
- 🏢 Filter by division (Tree & Landscape, Stone & Supply, Sand & Gravel)
- 📊 View statistics (total opportunities, contract values, high-value contracts)
- 🗺️ Filter by state (CT, NY, MA, RI, and more)
- 💰 Filter by minimum contract value
- 📁 Export results to CSV
- 🔐 Secure API key handling via proxy server

## Setup Instructions

### 1. Install Dependencies

Open PowerShell in the project folder and run:

```powershell
npm install
```

### 2. Set Your SAM.gov API Key

Before starting the server, set your SAM.gov API key as an environment variable:

```powershell
$env:SAM_API_KEY = "YOUR_SAM_API_KEY_HERE"
```

Replace `YOUR_SAM_API_KEY_HERE` with your actual SAM.gov API key.

### 3. Start the Server

```powershell
npm start
```

The server will start on http://localhost:3000

### 4. Open in Browser

Open your browser and go to:

```
http://localhost:3000
```

## How to Use

1. **Select a Division**: Click on one of the division buttons (All, Tree & Landscape, Stone & Supply, Sand & Gravel)
2. **Set Filters** (optional):
   - Enter keywords to search for
   - Select a state
   - Set minimum contract value
3. **Click "Search Opportunities"**: Results will load from SAM.gov
4. **View Results**: Browse through RFP cards showing details like agency, deadline, and estimated value
5. **Export to CSV**: Click the "Export CSV" button to download results

## Project Structure

```
dunning-rfp-tracker/
├── server/
│   └── index.js          # Express proxy server
├── public/
│   └── index.html        # Client-side interface
├── package.json          # Node.js dependencies
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Important Notes

- **API Key Security**: Never commit your SAM.gov API key to Git. It's stored as an environment variable.
- **CORS**: The proxy server handles CORS issues when communicating with SAM.gov
- **Local Development Only**: This setup is for local development. For production deployment, consider hosting the proxy on a cloud service (Heroku, Render, Vercel, etc.)

## Troubleshooting

**Server won't start:**
- Make sure you set the SAM_API_KEY environment variable
- Check that port 3000 is not already in use

**No results showing:**
- Check the browser console (F12) for errors
- Verify your SAM.gov API key is valid
- Try different search terms or remove filters

**CORS errors:**
- Make sure you're accessing the page through the proxy server (http://localhost:3000) not directly opening the HTML file

## License

ISC
