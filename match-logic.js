// MATCH LOGIC ENGINE (VISUALS: BORDERS & FLAGS)
const MatchEngine = {
    matches: [],
    filter: 'all',
    venueFilter: null,

    // --- CONFIGURATION ---
    officialVenues: { 1: "Azteca, Mexico City", 2: "Guadalajara", 3: "Toronto", 4: "Los Angeles", 5: "Boston", 6: "Vancouver", 7: "New York/New Jersey", 8: "San Francisco", 9: "Philadelphia", 10: "Houston", 11: "Dallas", 12: "Monterrey", 13: "Miami", 14: "Atlanta", 15: "Los Angeles", 16: "Seattle", 17: "New York/New Jersey", 18: "Boston", 19: "Kansas City", 20: "San Francisco", 21: "Toronto", 22: "Dallas", 23: "Houston", 24: "Azteca, Mexico City", 25: "Atlanta", 26: "Los Angeles", 27: "Vancouver", 28: "Guadalajara", 29: "Philadelphia", 30: "Boston", 31: "San Francisco", 32: "Seattle", 33: "Toronto", 34: "Kansas City", 35: "Houston", 36: "Monterrey", 37: "Miami", 38: "Atlanta", 39: "Los Angeles", 40: "Vancouver", 41: "New York/New Jersey", 42: "Philadelphia", 43: "Dallas", 44: "San Francisco", 45: "Boston", 46: "Toronto", 47: "Houston", 48: "Guadalajara", 49: "Miami", 50: "Atlanta", 51: "Vancouver", 52: "Seattle", 53: "Azteca, Mexico City", 54: "Monterrey", 55: "Philadelphia", 56: "New York/New Jersey", 57: "Dallas", 58: "Kansas City", 59: "Los Angeles", 60: "San Francisco", 61: "Boston", 62: "Toronto", 63: "Seattle", 64: "Vancouver", 65: "Houston", 66: "Guadalajara", 67: "New York/New Jersey", 68: "Philadelphia", 69: "Kansas City", 70: "Dallas", 71: "Miami", 72: "Atlanta", 73: "Los Angeles", 74: "Boston", 75: "Monterrey", 76: "Houston", 77: "New York/New Jersey", 78: "Dallas", 79: "Azteca, Mexico City", 80: "Atlanta", 81: "San Francisco", 82: "Seattle", 83: "Toronto", 84: "Los Angeles", 85: "Vancouver", 86: "Miami", 87: "Kansas City", 88: "Dallas", 89: "Philadelphia", 90: "Houston", 91: "New York/New Jersey", 92: "Azteca, Mexico City", 93: "Dallas", 94: "Seattle", 95: "Atlanta", 96: "Vancouver", 97: "Boston", 98: "Los Angeles", 99: "Miami", 100: "Kansas City", 101: "Dallas", 102: "Atlanta", 103: "Miami", 104: "New York/New Jersey" },
    
    officialGroups: { 1: 'A', 2: 'A', 25: 'A', 28: 'A', 53: 'A', 54: 'A', 3: 'B', 8: 'B', 26: 'B', 27: 'B', 51: 'B', 52: 'B', 5: 'C', 7: 'C', 29: 'C', 30: 'C', 49: 'C', 50: 'C', 4: 'D', 6: 'D', 31: 'D', 32: 'D', 59: 'D', 60: 'D', 9: 'E', 10: 'E', 33: 'E', 34: 'E', 55: 'E', 56: 'E', 11: 'F', 12: 'F', 35: 'F', 36: 'F', 57: 'F', 58: 'F', 15: 'G', 16: 'G', 39: 'G', 40: 'G', 63: 'G', 64: 'G', 13: 'H', 14: 'H', 37: 'H', 38: 'H', 65: 'H', 66: 'H', 17: 'I', 18: 'I', 41: 'I', 42: 'I', 61: 'I', 62: 'I', 19: 'J', 20: 'J', 43: 'J', 44: 'J', 69: 'J', 70: 'J', 23: 'K', 24: 'K', 47: 'K', 48: 'K', 71: 'K', 72: 'K', 21: 'L', 22: 'L', 45: 'L', 46: 'L', 67: 'L', 68: 'L' },
    
    // FULL MATRIX EXTRACTION
    confirmedMatchups: {
        1: ["Mexico (A1)", "A2"], 2: ["A3", "A4"],
        3: ["Canada (B1)", "B2"], 4: ["USA (D1)", "D2"],
        5: ["C1", "C2"], 6: ["D3", "D4"],
        7: ["C3", "C4"], 8: ["B3", "B4"],
        9: ["E1", "E2"], 10: ["E3", "E4"],
        11: ["F1", "F2"], 12: ["F3", "F4"],
        13: ["H1", "H2"], 14: ["H3", "H4"],
        15: ["G1", "G2"], 16: ["G3", "G4"],
        17: ["I1", "I2"], 18: ["I3", "I4"],
        19: ["J1", "J2"], 20: ["J3", "J4"],
        21: ["L1", "L2"], 22: ["L3", "L4"],
        23: ["K1", "K2"], 24: ["K3", "K4"],
        25: ["A2", "A4"], 26: ["B2", "B4"],
        27: ["Canada (B1)", "B3"], 28: ["Mexico (A1)", "A3"],
        29: ["C2", "C4"], 30: ["C1", "C3"],
        31: ["D2", "D4"], 32: ["USA (D1)", "D3"],
        33: ["E2", "E4"], 34: ["E1", "E3"],
        35: ["F2", "F4"], 36: ["F1", "F3"],
        37: ["H2", "H4"], 38: ["H1", "H3"],
        39: ["G2", "G4"], 40: ["G1", "G3"],
        41: ["I2", "I4"], 42: ["I1", "I3"],
        43: ["J2", "J4"], 44: ["J1", "J3"],
        45: ["L2", "L4"], 46: ["L1", "L3"],
        47: ["K2", "K4"], 48: ["K1", "K3"],
        49: ["C1", "C4"], 50: ["C2", "C3"],
        51: ["Canada (B1)", "B4"], 52: ["B2", "B3"],
        53: ["Mexico (A1)", "A4"], 54: ["A2", "A3"],
        55: ["E1", "E4"], 56: ["E2", "E3"],
        57: ["F1", "F4"], 58: ["F2", "F3"],
        59: ["USA (D1)", "D4"], 60: ["D2", "D3"],
        61: ["I1", "I4"], 62: ["I2", "I3"],
        63: ["G1", "G4"], 64: ["G2", "G3"],
        65: ["H1", "H4"], 66: ["H2", "H3"],
        67: ["L1", "L4"], 68: ["L2", "L3"],
        69: ["J1", "J4"], 70: ["J2", "J3"],
        71: ["K1", "K4"], 72: ["K2", "K3"]
    },

    knockoutMapping: { 73: ["Group A 2nd", "Group B 2nd", "June 28"], 74: ["Group E Winner", "Group A/B/C/D/F 3rd", "June 29"], 75: ["Group F Winner", "Group C 2nd", "June 29"], 76: ["Group C Winner", "Group F 2nd", "June 29"], 77: ["Group I Winner", "Group C/D/F/G/H 3rd", "June 30"], 78: ["Group E 2nd", "Group I 2nd", "June 30"], 79: ["Group A Winner", "Group C/E/F/H/I 3rd", "June 30"], 80: ["Group L Winner", "Group E/H/I/J/K 3rd", "July 1"], 81: ["Group D Winner", "Group B/E/F/I/J 3rd", "July 1"], 82: ["Group G Winner", "Group A/E/H/I/J 3rd", "July 1"], 83: ["Group K 2nd", "Group L 2nd", "July 2"], 84: ["Group H Winner", "Group J 2nd", "July 2"], 85: ["Group B Winner", "Group E/F/G/I/J 3rd", "July 2"], 86: ["Group J Winner", "Group H 2nd", "July 3"], 87: ["Group K Winner", "Group D/E/I/J/L 3rd", "July 3"], 88: ["Group D 2nd", "Group G 2nd", "July 3"], 89: ["Winner Match 74", "Winner Match 77", "July 4"], 90: ["Winner Match 73", "Winner Match 75", "July 4"], 91: ["Winner Match 76", "Winner Match 78", "July 5"], 92: ["Winner Match 79", "Winner Match 80", "July 5"], 93: ["Winner Match 83", "Winner Match 84", "July 6"], 94: ["Winner Match 81", "Winner Match 82", "July 6"], 95: ["Winner Match 86", "Winner Match 88", "July 7"], 96: ["Winner Match 85", "Winner Match 87", "July 7"], 97: ["Winner Match 89", "Winner Match 90", "July 9"], 98: ["Winner Match 93", "Winner Match 94", "July 10"], 99: ["Winner Match 91", "Winner Match 92", "July 11"], 100: ["Winner Match 95", "Winner Match 96", "July 11"], 101: ["Winner Match 97", "Winner Match 98", "July 14"], 102: ["Winner Match 99", "Winner Match 100", "July 15"], 103: ["Loser Match 101", "Loser Match 102", "July 18"], 104: ["Winner Match 101", "Winner Match 102", "July 19"] },

    getMatchDate: (id) => {
        if (id === 1 || id === 2) return "June 11";
        if (id === 3 || id === 4) return "June 12";
        if (id >= 5 && id <= 8) return "June 13";
        if (id >= 9 && id <= 12) return "June 14";
        if (id >= 13 && id <= 16) return "June 15";
        if (id >= 17 && id <= 20) return "June 16";
        if (id >= 21 && id <= 24) return "June 17";
        if (id >= 25 && id <= 28) return "June 18";
        if (id >= 29 && id <= 32) return "June 19";
        if (id >= 33 && id <= 36) return "June 20";
        if (id >= 37 && id <= 40) return "June 21";
        if (id === 41 || id === 43 || id === 44 || id === 46) return "June 22";
        if (id === 42 || id === 45 || id === 47 || id === 48) return "June 23";
        if (id >= 49 && id <= 54) return "June 24";
        if (id >= 55 && id <= 60) return "June 25";
        if (id >= 61 && id <= 66) return "June 26";
        if (id >= 67 && id <= 72) return "June 27";
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

    setVenue: (venueName) => {
        const canonical = MatchEngine.normalizeVenueName(venueName ? String(venueName).trim() : null);
        MatchEngine.venueFilter = canonical || null;
        MatchEngine.setFilter('calendar');
    },

    clearVenue: () => { MatchEngine.venueFilter = null; MatchEngine.setFilter('all'); },

    generateMatches: () => {
        MatchEngine.matches = [];
        
        // Helper: Check if a Team Name is "Pot 1" (Seeds 1, or Hosts)
        // Matches "X1" but avoids "X10", "X11" etc. Includes specific host names.
        const checkIsPot1 = (name) => {
            if (!name) return false;
            return (name.includes("1") && !name.includes("10") && !name.includes("11") && !name.includes("12") && !name.includes("21")) || 
                   name.includes("Mexico") || name.includes("USA") || name.includes("Canada");
        };

        const formatPot = (pots) => `TBD <span class="text-gray-600 font-normal text-[10px] ml-1">(${pots})</span>`;
        
        const formatPot1 = (name) => {
            const isPot1 = checkIsPot1(name);
            return isPot1 ? `<span class="text-emerald-400 font-bold">${name}</span>` : `<span class="text-gray-200 font-bold">${name}</span>`;
        };

        // Group Stage (1-72)
        for(let i=1; i<=72; i++) {
            const d = MatchEngine.getMatchDate(i);
            const stadium = MatchEngine.officialVenues[i] || "TBD";
            const group = MatchEngine.officialGroups[i] || 'A';
            let teamA, teamB;
            let isPremium = false; // Flag for Pot 1 Border

            if (MatchEngine.confirmedMatchups[i]) {
                const m = MatchEngine.confirmedMatchups[i];
                teamA = formatPot1(m[0]);
                teamB = formatPot1(m[1]);
                // Set Premium Flag if either team is Pot 1
                if(checkIsPot1(m[0]) || checkIsPot1(m[1])) {
                    isPremium = true;
                }
            } else {
                teamA = formatPot("Group " + group);
                teamB = formatPot("Group " + group);
            }

            MatchEngine.matches.push({
                id: i, 
                stage: "Group Stage", 
                group: group, 
                teamA: teamA, 
                teamB: teamB, 
                date: d, 
                stadium: stadium,
                isPremium: isPremium // Store the flag
            });
        }

        // Knockout Stage
        for(let i=73; i<=104; i++) {
            const d = MatchEngine.knockoutMapping[i];
            let sn = "Round of 32";
            if(i>88) sn="Round of 16"; if(i>96) sn="Quarter-Final"; if(i>100) sn="Semi-Final"; if(i===103) sn="Bronze Final"; if(i===104) sn="FINAL";
            MatchEngine.matches.push({id:i, stage:sn, teamA:d[0], teamB:d[1], date:d[2], stadium:MatchEngine.officialVenues[i]||"TBD", isPremium:false});
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

        if(MatchEngine.filter === 'calendar') {
            container.className = "flex flex-col gap-8 max-w-4xl mx-auto";
            const dates = [...new Set(data.map(m => m.date))];
            dates.forEach(date => {
                const dayMatches = data.filter(m => m.date === date);
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

        if(window.lucide) window.lucide.createIcons();
    },

    getCardHTML: (match) => {
        // 1. Determine Border Class (Emerald if Premium/Pot1, standard otherwise)
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
        
        // 2. Updated Flag Logic for Known Countries
        const getFlag = (htmlStr) => { 
            // htmlStr comes in as "<span class...>Mexico (A1)</span>" or plain text
            // Strip HTML to get raw name
            const raw = htmlStr.replace(/<[^>]*>?/gm, ''); 
            
            if (raw.includes("USA")) return "🇺🇸 ";
            if (raw.includes("Mexico")) return "🇲🇽 ";
            if (raw.includes("Canada")) return "🇨🇦 ";
            
            // Fallback for others (optional window hook)
            if(typeof window.getFlagHTML === 'function') return window.getFlagHTML(raw); 
            return ''; 
        };

        const clean = (n) => n.replace(/<[^>]*>?/gm, '').trim();
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`FIFA World Cup 2026 Match ${match.id} ${clean(match.teamA)} vs ${clean(match.teamB)} tickets`)}`;
        
        return `<div class="${borderClass} border rounded p-4 hover:bg-white/10 transition group relative overflow-hidden"><div class="flex justify-between items-center mb-4 text-xs uppercase tracking-wider"><div class="flex items-center text-gray-500 font-bold">Match ${match.id} ${groupBadge} ${stageLabel}</div><span class="text-gray-400">${match.date}</span></div><div class="space-y-3 mb-4"><div class="flex items-center">${getFlag(match.teamA)}<span class="font-bold text-gray-200 text-sm md:text-base ml-1">${match.teamA}</span></div><div class="flex items-center">${getFlag(match.teamB)}<span class="font-bold text-gray-200 text-sm md:text-base ml-1">${match.teamB}</span></div></div><div class="border-t border-white/10 pt-3 flex justify-between items-center text-xs text-gray-500"><div class="truncate max-w-[50%] flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> ${match.stadium}</div><a href="${searchUrl}" target="_blank" class="text-emerald-400 hover:text-white transition font-bold uppercase flex items-center gap-1 hover:bg-emerald-500/20 px-2 py-1 rounded">Find Tickets <i data-lucide="external-link" class="w-3 h-3"></i></a></div></div>`;
    }
};
