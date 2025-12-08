/**
 * scripts/fetch-live-data.js
 * Runs via GitHub Actions to fetch data and save it to a JSON file.
 */
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// THE NEW ENDPOINT YOU FOUND
const FIFA_API_URL = 'https://api.prod.rock-palisade-352518.com/marketplace/v2/listings/search';

const OUTPUT_FILE = path.join(__dirname, '../data/live-listings.json');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function run() {
    try {
        console.log('⚽ Fetching data from FIFA Collect (Rock Palisade API)...');
        
        // We use the exact parameters found in your URL
        const response = await axios.get(FIFA_API_URL, {
            params: {
                generalClubs: 'All',
                language: 'en-UK',
                listingStatus: 'active',
                page: 1,
                pageSize: 100, // I increased this from 30 to 100 so you get more results
                priceHigh: 10000000,
                priceLow: 0,
                sortBy: 'latestCreatedAt',
                sortDirection: 'desc'
            },
            headers: {
                'User-Agent': USER_AGENT,
                'Origin': 'https://collect.fifa.com',
                'Referer': 'https://collect.fifa.com/'
            }
        });

        const data = response.data;
        
        // Ensure the directory exists
        const dir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        // Save to file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
        
        // Log success details
        const itemCount = data.items ? data.items.length : (Array.isArray(data) ? data.length : 0);
        console.log(`✅ Success! Data saved to ${OUTPUT_FILE} (${itemCount} items found)`);

    } catch (error) {
        console.error('❌ Error fetching data:', error.message);
        if (error.response) {
            console.error('Status Code:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1); 
    }
}

run();
