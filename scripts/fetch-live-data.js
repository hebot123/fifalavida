/**
 * scripts/fetch-live-data.js
 * Runs via GitHub Actions to fetch data and save it to a JSON file.
 */
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Configuration
const FIFA_API_URL = 'https://collect.fifa.com/api/marketplace/search';
const OUTPUT_FILE = path.join(__dirname, '../data/live-listings.json');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function run() {
    try {
        console.log('⚽ Fetching data from FIFA Collect...');
        
        // Fetch page 1 (100 items) - You can loop this if you want more
        const response = await axios.get(FIFA_API_URL, {
            params: { language: 'en-US', page: 1, pageSize: 100 },
            headers: {
                'User-Agent': USER_AGENT,
                'Origin': 'https://collect.fifa.com',
                'Referer': 'https://collect.fifa.com/marketplace'
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
        console.log(`✅ Success! Data saved to ${OUTPUT_FILE} (${data.items ? data.items.length : 0} items)`);

    } catch (error) {
        console.error('❌ Error fetching data:', error.message);
        process.exit(1); // Fail the action if fetch fails
    }
}

run();
