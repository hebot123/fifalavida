/**
 * scripts/fetch-live-data.js
 * Runs via GitHub Actions to fetch ALL pages of data and save to a JSON file.
 */
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// THE NEW ENDPOINT (Rock Palisade API)
const FIFA_API_URL = 'https://api.prod.rock-palisade-352518.com/marketplace/v2/listings/search';

const OUTPUT_FILE = path.join(__dirname, '../data/live-listings.json');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function run() {
    try {
        console.log('⚽ Fetching ALL "Right to Ticket" data from FIFA Collect...');
        
        let allListings = [];
        let page = 1;
        let hasMore = true;
        let totalItems = 0;

        // Loop until we have fetched all active listings
        while (hasMore) {
            process.stdout.write(`   ... fetching page ${page} `);
            
            const response = await axios.get(FIFA_API_URL, {
                params: {
                    generalClubs: 'All',
                    language: 'en-UK',
                    listingStatus: 'active',
                    page: page,
                    pageSize: 100,
                    priceHigh: 10000000,
                    priceLow: 0,
                    sortBy: 'latestCreatedAt',
                    sortDirection: 'desc',
                    // STRICTER SEARCH: Only find actual ticket rights
                    text: 'Right To Ticket' 
                },
                headers: {
                    'User-Agent': USER_AGENT,
                    'Origin': 'https://collect.fifa.com',
                    'Referer': 'https://collect.fifa.com/'
                }
            });

            const data = response.data;
            const pageListings = data.listings || [];
            totalItems = data.total || 0;

            if (pageListings.length === 0) {
                console.log('(No more items)');
                hasMore = false;
            } else {
                allListings = allListings.concat(pageListings);
                console.log(`(Got ${pageListings.length} items) - Total so far: ${allListings.length}`);
                
                // Stop if we have fetched all available items
                if (allListings.length >= totalItems) {
                    hasMore = false;
                } else {
                    page++;
                    await new Promise(resolve => setTimeout(resolve, 200)); // Be polite to API
                }
            }
        }

        const finalData = {
            total: allListings.length,
            listings: allListings
        };
        
        const dir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
        console.log(`✅ Success! Saved ${allListings.length} listings to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('\n❌ Error fetching data:', error.message);
        if (error.response) {
            console.error('Status Code:', error.response.status);
        }
        process.exit(1); 
    }
}

run();