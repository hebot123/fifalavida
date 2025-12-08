// MATCH LOGIC ENGINE (UPDATED: Official Schedule Fixes M55/M56)
const MatchEngine = {
    matches: [],
    filter: 'all',
    venueFilter: null,
    teamFilter: null,

    // --- CONFIGURATION ---
    // Venues Mapped to Match IDs (Corrected M55/M56)
    officialVenues: { 
        1: "Azteca, Mexico City", 2: "Guadalajara", 3: "Toronto", 4: "Los Angeles", 5: "New York/New Jersey", 6: "Vancouver", 7: "Boston", 8: "San Francisco", 9: "Philadelphia", 10: "Houston", 
        11: "Dallas", 12: "Monterrey", 13: "Miami", 14: "Atlanta", 15: "Los Angeles", 16: "Seattle", 17: "New York/New Jersey", 18: "Boston", 19: "Kansas City", 20: "San Francisco", 
        21: "Toronto", 22: "Dallas", 23: "Houston", 24: "Azteca, Mexico City", 25: "Atlanta", 26: "Los Angeles", 27: "Vancouver", 28: "Guadalajara", 29: "Boston", 30: "Philadelphia", 
        31: "San Francisco", 32: "Seattle", 33: "Toronto", 34: "Kansas City", 35: "Houston", 36: "Monterrey", 37: "Miami", 38: "Atlanta", 39: "Los Angeles", 40: "Vancouver", 
        41: "Philadelphia", 42: "New York/New Jersey", 43: "Dallas", 44: "San Francisco", 45: "Boston", 46: "Toronto", 47: "Houston", 48: "Guadalajara", 49: "Miami", 50: "Atlanta", 
        51: "Vancouver", 52: "Seattle", 53: "Azteca, Mexico City", 54: "Monterrey", 
        55: "Philadelphia", // Corrected from NY/NJ
        56: "New York/New Jersey", // Corrected from Philadelphia
        57: "Dallas", 58: "Kansas City", 59: "Los Angeles", 60: "San Francisco", 
        61: "Boston", 62: "Toronto", 63: "Seattle", 64: "Vancouver", 65: "Houston", 66: "Guadalajara", 67: "New York/New Jersey", 68: "Philadelphia", 69: "Kansas City", 70: "Dallas", 
        71: "Miami", 72: "Atlanta", 73: "Los Angeles", 74: "Boston", 75: "Monterrey", 76: "Houston", 77: "New York/New Jersey", 78: "Dallas", 79: "Azteca, Mexico City", 80: "Atlanta", 
        81: "San Francisco", 82: "Seattle", 83: "Toronto", 84: "Los Angeles", 85: "Vancouver", 86: "Miami", 87: "Kansas City", 88: "Dallas", 89: "Philadelphia", 90: "Houston", 
        91: "New York/New Jersey", 92: "Azteca, Mexico City", 93: "Dallas", 94: "Seattle", 95: "Atlanta", 96: "Vancouver", 97: "Boston", 98: "Los Angeles", 99: "Miami", 100: "Kansas City", 
        101: "Dallas", 102: "Atlanta", 103: "Miami", 104: "New York/New Jersey" 
    },
    
    officialGroups: { 
        1: 'A', 2: 'A', 25: 'A', 28: 'A', 53: 'A', 54: 'A', 
        3: 'B', 8: 'B', 26: 'B', 27: 'B', 51: 'B', 52: 'B', 
        5: 'C', 7: 'C', 29: 'C', 30: 'C', 49: 'C', 50: 'C', 
        4: 'D', 6: 'D', 31: 'D', 32: 'D', 59: 'D', 60: 'D', 
        9: 'E', 10: 'E', 33: 'E', 34: 'E', 55: 'E', 56: 'E', 
        11: 'F', 12: 'F', 35: 'F', 36: 'F', 57: 'F', 58: 'F', 
        15: 'G', 16: 'G', 39: 'G', 40: 'G', 63: 'G', 64: 'G', 
        13: 'H', 14: 'H', 37: 'H', 38: 'H', 65: 'H', 66: 'H', 
        17: 'I', 18: 'I', 41: 'I', 42: 'I', 61: 'I', 62: 'I', 
        19: 'J', 20: 'J', 43: 'J', 44: 'J', 69: 'J', 70: 'J', 
        23: 'K', 24: 'K', 47: 'K', 48: 'K', 71: 'K', 72: 'K', 
        21: 'L', 22: 'L', 45: 'L', 46: 'L', 67: 'L', 68: 'L' 
    },
    
    // Pot Mapping
    potMapping: {
        'A': { 1: 'Mexico', 2: 'South Africa', 3: 'Korea Republic', 4: 'Winner Play-off D' },
        'B': { 1: 'Canada', 2: 'Winner Play-off A', 3: 'Qatar', 4: 'Switzerland' },
        'C': { 1: 'Brazil', 2: 'Morocco', 3: 'Haiti', 4: 'Scotland' },
        'D': { 1: 'USA', 2: 'Paraguay', 3: 'Australia', 4: 'Winner Play-off C' },
        'E': { 1: 'Germany', 2: 'Curaçao', 3: 'Côte d\'Ivoire', 4: 'Ecuador' },
        'F': { 1: 'Netherlands', 2: 'Japan', 3: 'Winner Play-off B', 4: 'Tunisia' },
        'G': { 1: 'Belgium', 2: 'Egypt', 3: 'IR Iran', 4: 'New Zealand' },
        'H': { 1: 'Spain', 2: 'Cabo Verde', 3: 'Saudi Arabia', 4: 'Uruguay' },
        'I': { 1: 'France', 2: 'Senegal', 3: 'Winner Play-off 2', 4: 'Norway' },
        'J': { 1: 'Argentina', 2: 'Algeria', 3: 'Austria', 4: 'Jordan' },
        'K': { 1: 'Portugal', 2: 'Winner Play-off 1', 3: 'Uzbekistan', 4: 'Colombia' },
        'L': { 1: 'England', 2: 'Croatia', 3: 'Ghana', 4: 'Panama' }
    },

    // SPECIFIC MATCH SCHEDULE (Overrides automated generation)
    // Format: [TeamA, TeamB, Time (Local approx)]
    specificSchedule: {
        // GROUP A
        1: ["Mexico", "South Africa", "15:00"],
        2: ["Korea Republic", "Winner Play-off D", "22:00"],
        25: ["Winner Play-off D", "South Africa", "12:00"],
        28: ["Mexico", "Korea Republic", "21:00"],
        53: ["Winner Play-off D", "Mexico", "21:00"],
        54: ["South Africa", "Korea Republic", "21:00"],

        // GROUP B
        3: ["Canada", "Winner Play-off A", "15:00"],
        8: ["Qatar", "Switzerland", "15:00"],
        26: ["Switzerland", "Winner Play-off A", "15:00"],
        27: ["Canada", "Qatar", "18:00"],
        51: ["Switzerland", "Canada", "15:00"],
        52: ["Winner Play-off A", "Qatar", "15:00"],

        // GROUP C
        5: ["Brazil", "Morocco", "18:00"], 
        7: ["Haiti", "Scotland", "21:00"], 
        29: ["Scotland", "Morocco", "18:00"], 
        30: ["Brazil", "Haiti", "21:00"],
        49: ["Scotland", "Brazil", "18:00"], 
        50: ["Morocco", "Haiti", "18:00"],

        // GROUP D
        4: ["USA", "Paraguay", "21:00"],
        6: ["Australia", "Winner Play-off C", "00:00"],
        31: ["Winner Play-off C", "Paraguay", "00:00"],
        32: ["USA", "Australia", "15:00"],
        59: ["Winner Play-off C", "USA", "22:00"],
        60: ["Paraguay", "Australia", "22:00"],

        // GROUP E (FIXED)
        9: ["Côte d'Ivoire", "Ecuador", "19:00"],
        10: ["Germany", "Curaçao", "13:00"],
        33: ["Germany", "Côte d'Ivoire", "16:00"],
        34: ["Ecuador", "Curaçao", "20:00"],
        // Match 55 is Philadelphia -> Curacao vs Ivory Coast
        55: ["Curaçao", "Côte d'Ivoire", "16:00"],
        // Match 56 is NY/NJ -> Ecuador vs Germany
        56: ["Ecuador", "Germany", "16:00"],

        // GROUP F (FIXED)
        11: ["Netherlands", "Japan", "16:00"],
        12: ["Winner Play-off B", "Tunisia", "22:00"],
        35: ["Netherlands", "Winner Play-off B", "13:00"],
        36: ["Tunisia", "Japan", "00:00"],
        // Match 57 is Dallas -> Tunisia vs Netherlands
        57: ["Tunisia", "Netherlands", "19:00"],
        // Match 58 is Kansas City -> Japan vs Winner B
        58: ["Japan", "Winner Play-off B", "19:00"],

        // GROUP G
        15: ["IR Iran", "New Zealand", "21:00"],
        16: ["Belgium", "Egypt", "15:00"],
        39: ["Belgium", "IR Iran", "15:00"],
        40: ["New Zealand", "Egypt", "21:00"],
        63: ["Egypt", "IR Iran", "23:00"],
        64: ["New Zealand", "Belgium", "23:00"],

        // GROUP H
        13: ["Saudi Arabia", "Uruguay", "18:00"],
        14: ["Spain", "Cabo Verde", "12:00"],
        37: ["Uruguay", "Cabo Verde", "18:00"],
        38: ["Spain", "Saudi Arabia", "12:00"],
        65: ["Cabo Verde", "Saudi Arabia", "20:00"],
        66: ["Uruguay", "Spain", "20:00"],

        // GROUP I
        17: ["France", "Senegal", "15:00"],
        18: ["Winner Play-off 2", "Norway", "18:00"],
        41: ["France", "Winner Play-off 2", "17:00"],
        42: ["Norway", "Senegal", "20:00"],
        61: ["Norway", "France", "15:00"],
        62: ["Senegal", "Winner Play-off 2", "15:00"],

        // GROUP J
        19: ["Argentina", "Algeria", "21:00"],
        20: ["Austria", "Jordan", "00:00"],
        43: ["Argentina", "Austria", "13:00"],
        44: ["Jordan", "Algeria", "23:00"],
        69: ["Algeria", "Austria", "22:00"],
        70: ["Jordan", "Argentina", "22:00"],

        // GROUP K
        23: ["Portugal", "Winner Play-off 1", "13:00"],
        24: ["Uzbekistan", "Colombia", "22:00"],
        47: ["Portugal", "Uzbekistan", "13:00"],
        48: ["Colombia", "Winner Play-off 1", "22:00"],
        71: ["Colombia", "Portugal", "19:30"],
        72: ["Winner Play-off 1", "Uzbekistan", "19:30"],

        // GROUP L
        21: ["Ghana", "Panama", "19:00"],
        22: ["England", "Croatia", "16:00"],
        45: ["England", "Ghana", "16:00"],
        46: ["Panama", "Croatia", "19:00"],
        67: ["Panama", "England", "17:00"],
        68: ["Croatia", "Ghana", "17:00"]
    },

    // Default Fallback
    confirmedMatchups: {
        1: ["A1", "A2"], 2: ["A3", "A4"],
        3: ["B1", "B2"], 4: ["D1", "D2"],
        6: ["D3", "D4"], 8: ["B3", "B4"],
        25: ["A2", "A4"], 26: ["B2", "B4"],
        27: ["B1", "B3"], 28: ["A1", "A3"],
        31: ["D2", "D4"], 32: ["D1", "D3"],
        51: ["B1", "B4"], 52: ["B2", "B3"],
        53: ["A1", "A4"], 54: ["A2", "A3"],
        59: ["D1", "D4"], 60: ["D2", "D3"],
    },

    knockoutMapping: { 73: ["Group A 2nd", "Group B 2nd", "June 28"], 74: ["Group E Winner", "Group A/B/C/D/F 3rd", "June 29"], 75: ["Group F Winner", "Group C 2nd", "June 29"], 76: ["Group C Winner", "Group F 2nd", "June 29"], 77: ["Group I Winner", "Group C/D/F/G/H 3rd", "June 30"], 78: ["Group E 2nd", "Group I 2nd", "June 30"], 79: ["Group A Winner", "Group C/E/F/H/I 3rd", "June 30"], 80: ["Group L Winner", "Group E/H/I/J/K 3rd", "July 1"], 81: ["Group D Winner", "Group B/E/F/I/J 3rd", "July 1"], 82: ["Group G Winner", "Group A/E/H/I/J 3rd", "July 1"], 83: ["Group K 2nd", "Group L 2nd", "July 2"], 84: ["Group H Winner", "Group J 2nd", "July 2"], 85: ["Group B Winner", "Group E/F/G/I/J 3rd", "July 2"], 86: ["Group J Winner", "Group H 2nd", "July 3"], 87: ["Group K Winner", "Group D/E/I/J/L 3rd", "July 3"], 88: ["Group D 2nd", "Group G 2nd", "July 3"], 89: ["Winner Match 74", "Winner Match 77", "July 4"], 90: ["Winner Match 73", "Winner Match 75", "July 4"], 91: ["Winner Match 76", "Winner Match 78", "July 5"], 92: ["Winner Match 79", "Winner Match 80", "July 5"], 93: ["Winner Match 83", "Winner Match 84", "July 6"], 94: ["Winner Match 81", "Winner Match 82", "July 6"], 95: ["Winner Match 86", "Winner Match 88", "July 7"], 96: ["Winner Match 85", "Winner Match 87", "July 7"], 97: ["Winner Match 89", "Winner Match 90", "July 9"], 98: ["Winner Match 93", "Winner Match 94", "July 10"], 99: ["Winner Match 91", "Winner Match 92", "July 11"], 100: ["Winner Match 95", "Winner Match 96", "July 11"], 101: ["Winner Match 97", "Winner Match 98", "July 14"], 102: ["Winner Match 99", "Winner Match 100", "July 15"], 103: ["Loser Match 101", "Loser Match 102", "July 18"], 104: ["Winner Match 101", "Winner Match 102", "July 19"] },

    getMatchDate: (id) => {
        if (id <= 2) return "June 11";
        if (id <= 4) return "June 12";
        if (id <= 8) return "June 13";
        if (id <= 12) return "June 14";
        if (id <= 16) return "June 15";
        if (id <= 20) return "June 16";
        if (id <= 24) return "June 17";
        if (id <= 28) return "June 18";
        if (id <= 32) return "June 19";
        if (id <= 36) return "June 20";
        if (id <= 40) return "June 21";
        if ([41,43,44,46].includes(id)) return "June 22";
        if ([42,45,47,48].includes(id)) return "June 23";
        if (id <= 54) return "June 24";
        if (id <= 60) return "June 25";
        if (id <= 66) return "June 26";
        if (id <= 72) return "June 27";
        return "TBD";
    },

    normalizeVenueName: (name) => {
        if(!name) return name;
        const s = String(name).trim();
        const aliases = {
            'New York/NJ': 'New York/New Jersey',
            'New York / NJ': 'New York/New Jersey',
            'NY/NJ': 'New York/New Jersey',
            'NYC/NJ': 'New York/New Jersey'
        };
        if(aliases[s]) return aliases[s];
        if(/new york/i.test(s) && /nj|jersey/i.test(s)) return 'New York/New Jersey';
        return s;
    },

    init: () => {
        MatchEngine.generateMatches();
        MatchEngine.render();
        MatchEngine.populateVenueSelect();
        MatchEngine.populateTeamSelect();
    },

    populateVenueSelect: () => {
        try {
            const select = document.getElementById('venue-filter-select');
            if(!select) return;
            select.innerHTML = '<option value="">All Venues</option>';
            const vd = (typeof venueData !== 'undefined' ? venueData : (window.venueData || null));
            if(vd && Array.isArray(vd) && vd.length) {
                const cities = vd.map(v => (typeof v === 'string') ? v : (v.city || '')).filter(Boolean).sort((a,b) => a.localeCompare(b));
                cities.forEach(city => {
                    const opt = document.createElement('option'); opt.value = city; opt.text = city; select.appendChild(opt);
                });
            } else if(MatchEngine.matches && MatchEngine.matches.length) {
                const seen = new Set();
                const list = [];
                MatchEngine.matches.forEach(m => {
                    const s = (m.stadium||'').split(',').pop().trim();
                    if(s && !seen.has(s)) { seen.add(s); list.push(s); }
                });
                list.sort((a,b) => a.localeCompare(b)).forEach(s => { const opt = document.createElement('option'); opt.value = s; opt.text = s; select.appendChild(opt); });
            }
            if(MatchEngine.venueFilter) {
                const vf = MatchEngine.venueFilter.toLowerCase();
                for(const o of select.options) {
                    const ov = (o.value||'').toLowerCase();
                    const norm = (MatchEngine.normalizeVenueName ? MatchEngine.normalizeVenueName(o.value).toLowerCase() : ov);
                    if(ov.includes(vf) || norm.includes(vf)) { select.value = o.value; break; }
                }
            } else {
                select.value = '';
            }
            select.onchange = function(){ const v = this.value; if(!v) MatchEngine.clearVenue(); else MatchEngine.setVenue(v); };
        } catch(e) { }
    },

    populateTeamSelect: () => {
        try {
            const select = document.getElementById('team-filter-select');
            if(!select) return;
            select.innerHTML = '<option value="">All Teams</option>';
            
            const teams = new Set();
            // Add teams from potMapping
            Object.values(MatchEngine.potMapping).forEach(group => {
                Object.values(group).forEach(teamName => {
                    const cleanName = teamName.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '').trim();
                    teams.add(cleanName);
                });
            });
            // Add teams from specificSchedule to ensure all are covered
            Object.values(MatchEngine.specificSchedule).forEach(match => {
                teams.add(match[0]);
                teams.add(match[1]);
            });

            const sortedTeams = Array.from(teams).sort();
            sortedTeams.forEach(team => {
                const opt = document.createElement('option');
                opt.value = team;
                opt.text = team;
                select.appendChild(opt);
            });

            select.value = MatchEngine.teamFilter || '';
            select.onchange = function() {
                const v = this.value;
                if (!v) MatchEngine.clearTeamFilter();
                else MatchEngine.setTeam(v);
            };
        } catch (e) {
            console.error("Failed to populate team select:", e);
        }
    },

    setVenue: (venueName) => {
        const canonical = MatchEngine.normalizeVenueName(venueName ? String(venueName).trim() : null);
        MatchEngine.venueFilter = canonical || null;
        MatchEngine.teamFilter = null;
        MatchEngine.setFilter('calendar');
    },

    setTeam: (teamName) => { MatchEngine.teamFilter = teamName; MatchEngine.venueFilter = null; MatchEngine.setFilter('all'); },
    clearVenue: () => { MatchEngine.venueFilter = null; MatchEngine.setFilter('all'); },
    clearTeamFilter: () => { MatchEngine.teamFilter = null; MatchEngine.setFilter('all'); },

    generateMatches: () => {
        MatchEngine.matches = [];
        
        // Helper to extract Team from Group + Position
        const getTeamLabel = (code) => {
            let raw = code.replace(/<[^>]*>?/gm, '').trim();
            let group, pos;
            
            const match = raw.match(/([A-L])(\d)/);
            if(match) {
                group = match[1];
                pos = parseInt(match[2]);
            } else {
                return code;
            }

            if(MatchEngine.potMapping[group] && MatchEngine.potMapping[group][pos]) {
                return MatchEngine.potMapping[group][pos];
            }
            return code;
        };

        const checkIsPot1 = (teamName, code) => {
            // Check if name matches a Pot 1 team or if code is Position 1
            const pot1Teams = ['Mexico', 'Canada', 'USA', 'Brazil', 'Germany', 'Netherlands', 'Belgium', 'Spain', 'France', 'Argentina', 'Portugal', 'England'];
            if(pot1Teams.includes(teamName)) return true;

            let raw = code ? code.replace(/<[^>]*>?/gm, '').trim() : '';
            const match = raw.match(/([A-L])(\d)/);
            if(match) {
                return parseInt(match[2]) === 1;
            }
            return false;
        };

        const formatTeam = (label, code) => {
             const isP1 = checkIsPot1(label, code);
             return isP1 ? `<span class="text-emerald-400 font-bold">${label}</span>` : `<span class="text-gray-200 font-bold">${label}</span>`;
        };

        // Group Stage
        for(let i=1; i<=72; i++) {
            const d = MatchEngine.getMatchDate(i);
            const stadium = MatchEngine.officialVenues[i] || "TBD";
            const group = MatchEngine.officialGroups[i] || 'A';
            let teamA, teamB, time = "";
            let isPremium = false;

            // Find country
            let country = null;
            if (stadium !== "TBD" && typeof venueData !== 'undefined') {
                const venueCity = stadium.split(',').pop().trim();
                const venueInfo = venueData.find(v => v.city === venueCity || (v.city === 'New York/NJ' && stadium.includes('New York')));
                if (venueInfo) { country = venueInfo.country; }
            }

            // Check Specific Schedule First
            if (MatchEngine.specificSchedule[i]) {
                const spec = MatchEngine.specificSchedule[i];
                teamA = formatTeam(spec[0], null);
                teamB = formatTeam(spec[1], null);
                time = spec[2] ? ` <span class="text-emerald-500 font-mono ml-2 text-[10px] border border-emerald-500/30 px-1 rounded">${spec[2]}</span>` : '';
                if(checkIsPot1(spec[0], null) || checkIsPot1(spec[1], null)) isPremium = true;
            } else if (MatchEngine.confirmedMatchups[i]) {
                // Fallback to algorithmic pot mapping
                const m = MatchEngine.confirmedMatchups[i];
                const labelA = getTeamLabel(m[0]);
                const labelB = getTeamLabel(m[1]);
                teamA = formatTeam(labelA, m[0]);
                teamB = formatTeam(labelB, m[1]);
                if(checkIsPot1(labelA, m[0]) || checkIsPot1(labelB, m[1])) isPremium = true;
            } else {
                teamA = "TBD"; teamB = "TBD";
            }

            MatchEngine.matches.push({
                id: i, 
                stage: "Group Stage", 
                group: group, 
                teamA: teamA, 
                teamB: teamB, 
                date: d + time, 
                stadium: stadium,
                isPremium: isPremium,
                country: country
            });
        }

        // Knockout Stage
        for(let i=73; i<=104; i++) {
            const d = MatchEngine.knockoutMapping[i];
            const stadium = MatchEngine.officialVenues[i] || "TBD";
            let sn = "Round of 32";
            let country = null;
            if (stadium !== "TBD" && typeof venueData !== 'undefined') {
                const venueCity = stadium.split(',').pop().trim();
                const venueInfo = venueData.find(v => v.city === venueCity || (v.city === 'New York/NJ' && stadium.includes('New York')));
                if (venueInfo) { country = venueInfo.country; }
            }

            if(i>88) sn="Round of 16"; if(i>96) sn="Quarter-Final"; if(i>100) sn="Semi-Final"; if(i===103) sn="Bronze Final"; if(i===104) sn="FINAL";
            MatchEngine.matches.push({id:i, stage:sn, teamA:d[0], teamB:d[1], date:d[2], stadium:stadium, isPremium:false, country: country});
        }
    },

    setFilter: (type) => {
        MatchEngine.filter = type;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if(btn.id === `btn-${type}`) {
                btn.classList.remove('text-gray-500', 'hover:text-white');
                btn.classList.add('bg-white', 'text-black', 'shadow-[0_0_15px_rgba(255,255,255,0.2)]');
            } else {
                btn.classList.add('text-gray-500', 'hover:text-white');
                btn.classList.remove('bg-white', 'text-black', 'shadow-[0_0_15px_rgba(255,255,255,0.2)]');
            }
        });
        MatchEngine.render();
    },

    render: () => {
        const container = document.getElementById('matches-container');
        if(!container) return;
        container.innerHTML = '';
        let data = MatchEngine.matches;
        if(MatchEngine.filter === 'group') data = data.filter(m => m.id <= 72);
        if(MatchEngine.filter === 'knockout') data = data.filter(m => m.id > 72);

        if(MatchEngine.venueFilter) {
            const vf = MatchEngine.venueFilter.toLowerCase();
            data = data.filter(m => (m.stadium||'').toLowerCase().includes(vf));
        }

        if(MatchEngine.teamFilter) {
            const tf = MatchEngine.teamFilter.toLowerCase();
            const clean = (n) => n.replace(/<[^>]*>?/gm, '').trim().toLowerCase();
            data = data.filter(m => clean(m.teamA).includes(tf) || clean(m.teamB).includes(tf));
        }

        if(MatchEngine.filter === 'calendar') {
            container.className = "flex flex-col gap-8 max-w-4xl mx-auto";
            // Extract just the date part for grouping (ignoring time)
            const getDateOnly = (dStr) => dStr.split('<')[0].trim();
            const dates = [...new Set(data.map(m => getDateOnly(m.date)))];
            
            dates.forEach(date => {
                const dayMatches = data.filter(m => getDateOnly(m.date) === date);
                if(dayMatches.length === 0) return;
                const section = document.createElement('div');
                section.className = "pl-6 border-l border-white/20 relative pb-8";
                section.innerHTML = `<div class="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-emerald-500 rounded-full"></div><h3 class="text-xl font-bold mb-4 text-emerald-400 font-mono uppercase">${date}</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${dayMatches.map(m => MatchEngine.getCardHTML(m)).join('')}</div>`;
                container.appendChild(section);
            });
        } else {
            container.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
            data.forEach(m => container.innerHTML += MatchEngine.getCardHTML(m));
        }
        try { if(typeof window.updateVenueSelectFromEngine === 'function') window.updateVenueSelectFromEngine(); } catch(e) { }
        try { if(typeof MatchEngine.populateTeamSelect === 'function') MatchEngine.populateTeamSelect(); } catch(e) { }

        if(window.lucide) window.lucide.createIcons();
    },

    getCardHTML: (match) => {
        const borderClass = match.isPremium 
            ? "border-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.1)] bg-emerald-900/10" 
            : "border-white/10 bg-white/5";

        const groupBadge = match.stage === 'Group Stage' ? `<span class="bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded ml-2 border border-emerald-500/20">GRP ${match.group}</span>` : '';
        const formatStageLabel = (s) => {
            if(!s) return '';
            if(/FINAL$/i.test(s) && s === 'FINAL') return 'World Cup Final';
            if(/Quarter/i.test(s)) return 'Quarter Finals';
            if(/Semi/i.test(s)) return 'Semi Finals';
            return s;
        };
        const stageLabel = match.stage && match.stage !== 'Group Stage' ? `<span class="bg-white/5 text-gray-300 text-[10px] px-2 py-0.5 rounded ml-2 uppercase">${formatStageLabel(match.stage)}</span>` : '';
        
        const getFlag = (htmlStr) => { 
            const raw = htmlStr.replace(/<[^>]*>?/gm, ''); 
            if(typeof window.getFlagHTML === 'function') return window.getFlagHTML(raw); 
            return '';
        };

        const viagogoUrl = "https://viagogo.prf.hn/click/camref:1110ltZ7y/[p_id:1110l23734]/destination:https%3A%2F%2Fwww.viagogo.com%2FSports-Tickets%2FSoccer%2FSoccer-Tournament%2FSoccer-World-Cup-Tickets%3Fagqi%3D5ff4c7ee-562d-42dc-8b3d-90428039fcb0%26agi%3Dstubhub%26agut%3Dd0fd2010-cb9f-4d0f-b13c-553113c1bfed";
        const fifaCollectUrl = `https://collect.fifa.com/marketplace?tags=rtt-m${match.id}&referrer=fifalavida`;
        
        return `<div class="${borderClass} border rounded p-4 hover:bg-white/10 transition group relative overflow-hidden"><div class="flex justify-between items-center mb-4 text-xs uppercase tracking-wider"><div class="flex items-center text-gray-500 font-bold">Match ${match.id} ${groupBadge} ${stageLabel}</div><span class="text-gray-400">${match.date}</span></div><div class="space-y-3 mb-4"><div class="flex items-center">${getFlag(match.teamA)}<span class="font-bold text-gray-200 text-sm md:text-base ml-1">${match.teamA}</span></div><div class="flex items-center">${getFlag(match.teamB)}<span class="font-bold text-gray-200 text-sm md:text-base ml-1">${match.teamB}</span></div></div><div class="border-t border-white/10 pt-3 text-xs text-gray-500 space-y-2"><div class="truncate flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> ${match.stadium}</div><div class="flex items-center gap-2"><span class="font-bold uppercase">Find Tickets</span><a href="${fifaCollectUrl}" target="_blank" rel="nofollow" class="text-blue-400 hover:text-white transition font-bold uppercase flex items-center gap-1 hover:bg-blue-500/20 px-2 py-1 rounded text-[10px]">FIFA Collect <i data-lucide="gem" class="w-3 h-3"></i></a><a href="${viagogoUrl}" target="_blank" rel="nofollow" class="text-emerald-400 hover:text-white transition font-bold uppercase flex items-center gap-1 hover:bg-emerald-500/20 px-2 py-1 rounded text-[10px]">viagogo <i data-lucide="external-link" class="w-3 h-3"></i></a></div></div></div>`;
    }
};

if (typeof window !== 'undefined') window.MatchEngine = MatchEngine;