/**
 * TICKET ENGINE (LIVE PROXY MODE)
 * Connects to your local proxy server to fetch real FIFA Collect data.
 */
const TicketEngine = {
    listings: [],
    // Point this to your new Proxy Server
    apiEndpoint: 'http://localhost:3000/api/tickets', 
    
    state: {
        loading: false,
        error: null,
        filter: {
            country: '',
            city: '',
            team: '',
            round: '',
            category: ''
        },
        sort: 'matchNo',
    },

    init: async () => {
        await TicketEngine.fetchListings();
        TicketEngine.populateFilters();
        TicketEngine.render();
        
        document.querySelectorAll('.ticket-filter').forEach(select => {
            select.addEventListener('change', (e) => {
                TicketEngine.state.filter[e.target.dataset.filterType] = e.target.value;
                TicketEngine.render();
            });
        });

        const sortSelect = document.getElementById('ticket-sort-select');
        if(sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                TicketEngine.state.sort = e.target.value;
                TicketEngine.render();
            });
        }
    },

    fetchListings: async () => {
        TicketEngine.state.loading = true;
        TicketEngine.renderLoadingState();

        try {
            // Fetch from your Proxy Server
            const response = await fetch(TicketEngine.apiEndpoint);
            if (!response.ok) throw new Error(`Proxy Error: ${response.status}`);
            
            const rawData = await response.json();
            
            // Map the API response fields to your internal data model
            // Note: You may need to adjust these field names ('price', 'title', etc.) 
            // once you see the exact JSON structure from the real API.
            TicketEngine.listings = (rawData.items || rawData).map(item => ({
                id: item.id || Math.random().toString(36),
                matchNo: item.matchNumber || parseInt(item.title.match(/M(\d+)/)?.[1]) || 0,
                matchLabel: item.title || "Unknown Match",
                date: item.matchDate || "TBD", // You might need to format this
                city: item.city || "TBD",
                stadium: item.stadium || "TBD",
                country: item.country || "TBD",
                round: item.stage || "Group Stage",
                category: item.category || "General",
                faceValue: item.faceValue || 0,
                volumeUsd: item.volume || 0,
                volumeSales: item.salesCount || 0,
                lastSale: item.lastSalePrice || 0,
                lastSaleDate: item.lastSaleDate || "N/A",
                startingPrice: item.price || item.lowestAsk || 0,
                teams: item.teams || [], // Ensure this array exists or parse from title
                fifaCollectUrl: `https://collect.fifa.com/marketplace/${item.id}`
            }));

            console.log("TicketEngine: Loaded live data via proxy.");

        } catch (error) {
            console.warn("TicketEngine: Proxy failed, using demo data.", error);
            TicketEngine.state.error = "Live feed disconnected. Showing demo data.";
            TicketEngine.generateMockData(); // Keep fallback so site doesn't break
        } finally {
            TicketEngine.state.loading = false;
            TicketEngine.render();
        }
    },

    generateMockData: () => {
        // ... (Keep your existing mock generator here as a safety net) ...
        // [Existing mock data code]
        const teams = ["Mexico", "USA", "Canada", "Brazil", "France"];
        const venues = [{ city: "Mexico City", stadium: "Estadio Azteca", country: "Mexico" }];
        // ... etc (rest of your previous mock function)
        // Only adding one mock item for brevity in this snippet
        TicketEngine.listings = Array.from({length: 10}, (_, i) => ({
            id: `mock-${i}`,
            matchNo: i + 1,
            matchLabel: "Mock Match vs Mock Team",
            startingPrice: 100 + i * 10,
            city: "Mexico City",
            stadium: "Estadio Azteca",
            country: "Mexico",
            round: "Group Stage",
            category: "Cat 1",
            faceValue: 200,
            volumeUsd: 5000,
            volumeSales: 20,
            lastSale: 120,
            lastSaleDate: "1h ago",
            teams: ["Mexico", "USA"],
            fifaCollectUrl: "#"
        }));
    },

    // ... (Rest of your render/filter logic remains exactly the same) ...
    renderLoadingState: () => {
        const tbody = document.getElementById('ticket-table-body');
        if(tbody) tbody.innerHTML = `<tr><td colspan="9" class="p-12 text-center text-emerald-400 animate-pulse font-mono uppercase">Connecting to FIFA Proxy...</td></tr>`;
    },
    
    populateFilters: () => { /* ... existing code ... */ },
    render: () => { /* ... existing code ... */ }
};