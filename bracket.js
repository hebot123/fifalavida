const BracketApp = {
    state: {
        phase: 1, // 1=Groups, 2=3rd Place, 3=Bracket
        groups: {}, 
        thirdPlaceCandidates: [],
        selectedThirds: [],
        knockout: {}, 
        champion: null,
        uid: null
    },

    // OFFICIAL FIFA 2026 SCHEDULE & PATHWAYS
    schedule: {
        // --- ROUND OF 32 ---
        // Block 1 (Feeds M89 & M90 -> QF M97)
        74: { date: "June 29", venue: "Boston", p1: "1E", p2: "3rd A/B/C/D/F", next: 89, slot: 0 },
        77: { date: "June 30", venue: "New York/NJ", p1: "1I", p2: "3rd C/D/F/G/H", next: 89, slot: 1 },
        73: { date: "June 28", venue: "Los Angeles", p1: "2A", p2: "2B", next: 90, slot: 0 },
        75: { date: "June 29", venue: "Monterrey", p1: "1F", p2: "2C", next: 90, slot: 1 },
        
        // Block 2 (Feeds M93 & M94 -> QF M98)
        83: { date: "July 2", venue: "Toronto", p1: "2K", p2: "2L", next: 93, slot: 0 },
        84: { date: "July 2", venue: "Los Angeles", p1: "1H", p2: "2J", next: 93, slot: 1 },
        81: { date: "July 1", venue: "San Francisco", p1: "1D", p2: "3rd B/E/F/I/J", next: 94, slot: 0 },
        82: { date: "July 1", venue: "Seattle", p1: "1G", p2: "3rd A/E/H/I/J", next: 94, slot: 1 },

        // Block 3 (Feeds M91 & M92 -> QF M99)
        76: { date: "June 29", venue: "Houston", p1: "1C", p2: "2F", next: 91, slot: 0 },
        78: { date: "June 30", venue: "Dallas", p1: "2E", p2: "2I", next: 91, slot: 1 },
        79: { date: "June 30", venue: "Mexico City", p1: "1A", p2: "3rd C/E/F/H/I", next: 92, slot: 0 },
        80: { date: "July 1", venue: "Atlanta", p1: "1L", p2: "3rd E/H/I/J/K", next: 92, slot: 1 },

        // Block 4 (Feeds M95 & M96 -> QF M100)
        86: { date: "July 3", venue: "Miami", p1: "1J", p2: "2H", next: 95, slot: 0 },
        88: { date: "July 3", venue: "Dallas", p1: "2D", p2: "2G", next: 95, slot: 1 },
        85: { date: "July 2", venue: "Vancouver", p1: "1B", p2: "3rd E/F/G/I/J", next: 96, slot: 0 },
        87: { date: "July 3", venue: "Kansas City", p1: "1K", p2: "3rd D/E/I/J/L", next: 96, slot: 1 },

        // --- ROUND OF 16 ---
        89: { date: "July 4", venue: "Philadelphia", next: 97, slot: 0 },
        90: { date: "July 4", venue: "Houston", next: 97, slot: 1 },
        93: { date: "July 6", venue: "Dallas", next: 98, slot: 0 },
        94: { date: "July 6", venue: "Seattle", next: 98, slot: 1 },
        91: { date: "July 5", venue: "New York/NJ", next: 99, slot: 0 },
        92: { date: "July 5", venue: "Mexico City", next: 99, slot: 1 },
        95: { date: "July 7", venue: "Atlanta", next: 100, slot: 0 },
        96: { date: "July 7", venue: "Vancouver", next: 100, slot: 1 },

        // --- QUARTERFINALS ---
        97: { date: "July 9", venue: "Boston", next: 101, slot: 0 },
        98: { date: "July 10", venue: "Los Angeles", next: 101, slot: 1 },
        99: { date: "July 11", venue: "Miami", next: 102, slot: 0 },
        100: { date: "July 11", venue: "Kansas City", next: 102, slot: 1 },

        // --- SEMIFINALS ---
        101: { date: "July 14", venue: "Dallas", next: 104, slot: 0, loser: 103, loserSlot: 0 },
        102: { date: "July 15", venue: "Atlanta", next: 104, slot: 1, loser: 103, loserSlot: 1 },

        // --- FINALS ---
        103: { date: "July 18", venue: "Miami", label: "Bronze Final" },
        104: { date: "July 19", venue: "New York/NJ", label: "World Cup Final" }
    },

    // VISUAL ORDERING TO KEEP BRACKET CONNECTED
    orderedMatches: {
        0: [74, 77, 73, 75, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87], // R32
        1: [89, 90, 93, 94, 91, 92, 95, 96],                                 // R16
        2: [97, 98, 99, 100],                                                // QF
        3: [101, 102],                                                       // SF
        4: [104]                                                             // Final
    },

    init: () => {
        if(!document.getElementById('groups-container')) return;
        
        BracketApp.loadGroups();
        BracketApp.renderGroups();
        
        BracketApp.uid = localStorage.getItem('fifa_bracket_uid') || BracketApp.generateUID();
        
        const savedData = localStorage.getItem('fifa_bracket_data');
        if(savedData) {
            const parsed = JSON.parse(savedData);
            BracketApp.state = { ...BracketApp.state, ...parsed };
            if(BracketApp.state.phase >= 2) BracketApp.lockPhase1(true);
            if(BracketApp.state.phase >= 3) {
                BracketApp.lockPhase2(true);
                setTimeout(BracketApp.restoreBracketState, 500); 
            }
        }

        if(typeof lucide !== 'undefined') lucide.createIcons();
    },

    generateUID: () => 'BRK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    getFlag: (t) => window.getFlagHTML ? window.getFlagHTML(t) : '',

    // --- PHASE 1: GROUPS ---
    loadGroups: () => {
        if(Object.keys(BracketApp.state.groups).length > 0) return;
        const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];
        groups.forEach(g => {
             if(typeof MatchEngine !== 'undefined' && MatchEngine.potMapping && MatchEngine.potMapping[g]) {
                 BracketApp.state.groups[g] = Object.values(MatchEngine.potMapping[g]);
             } else {
                 BracketApp.state.groups[g] = [`Team ${g}1`, `Team ${g}2`, `Team ${g}3`, `Team ${g}4`];
             }
        });
    },

    renderGroups: () => {
        const container = document.getElementById('groups-container');
        if(!container) return; 
        container.innerHTML = '';
        const isLocked = BracketApp.state.phase > 1;

        Object.keys(BracketApp.state.groups).forEach(groupLetter => {
            const teams = BracketApp.state.groups[groupLetter];
            const card = document.createElement('div');
            card.className = "glass-panel p-4 rounded-xl relative group transition hover:border-emerald-500/30";
            
            card.innerHTML = `
                <div class="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                    <span class="font-bold text-emerald-400 text-lg font-oswald">Group ${groupLetter}</span>
                    ${!isLocked ? '<i data-lucide="grip-vertical" class="w-4 h-4 text-gray-600"></i>' : '<i data-lucide="lock" class="w-3 h-3 text-gray-500"></i>'}
                </div>
                <ul class="space-y-1" id="group-${groupLetter}">
                    ${teams.map((t, i) => {
                        let rowClass = "border-white/5 bg-black/40 text-gray-500"; 
                        let badge = "";
                        if(i === 0) { rowClass = "border-emerald-500/40 bg-emerald-500/10 text-white"; badge = '<span class="text-[10px] font-bold bg-emerald-500 text-black px-1 rounded ml-auto">1st</span>'; }
                        else if (i === 1) { rowClass = "border-emerald-500/20 bg-emerald-500/5 text-white"; badge = '<span class="text-[10px] font-bold bg-emerald-500/50 text-white px-1 rounded ml-auto">2nd</span>'; }
                        else if (i === 2) { rowClass = "border-yellow-500/20 bg-yellow-500/5 text-yellow-200"; badge = '<span class="text-[10px] font-bold text-yellow-500/50 ml-auto">?</span>'; }

                        return `<li class="${rowClass} border p-2 rounded flex items-center gap-3 transition relative ${!isLocked ? 'cursor-move hover:bg-white/5' : ''}" ${!isLocked ? 'draggable="true"' : ''} data-team="${t}">
                            <span class="text-[10px] font-mono opacity-50 w-3">${i+1}</span>
                            <div class="flex items-center gap-2">${BracketApp.getFlag(t)}<span class="font-semibold text-sm">${t}</span></div>
                            ${badge}
                        </li>`;
                    }).join('')}
                </ul>
            `;
            container.appendChild(card);
            if(!isLocked) BracketApp.enableDragDrop(groupLetter);
        });
        lucide.createIcons();
    },

    enableDragDrop: (group) => {
        const list = document.getElementById(`group-${group}`);
        let draggedItem = null;
        list.querySelectorAll('li').forEach(item => {
            item.addEventListener('dragstart', () => { draggedItem = item; item.classList.add('opacity-50'); });
            item.addEventListener('dragend', () => { draggedItem = null; item.classList.remove('opacity-50'); BracketApp.updateGroupOrder(group); });
            item.addEventListener('dragover', e => e.preventDefault());
            item.addEventListener('drop', e => {
                e.preventDefault();
                if (draggedItem && draggedItem !== item) {
                    const all = [...list.querySelectorAll('li')];
                    if (all.indexOf(item) < all.indexOf(draggedItem)) list.insertBefore(draggedItem, item);
                    else list.insertBefore(draggedItem, item.nextSibling);
                }
            });
        });
    },

    updateGroupOrder: (group) => {
        const list = document.getElementById(`group-${group}`);
        BracketApp.state.groups[group] = [...list.querySelectorAll('li')].map(li => li.getAttribute('data-team'));
        BracketApp.renderGroups(); 
    },

    autoSimulateGroups: () => {
        if(BracketApp.state.phase > 1) return;
        Object.keys(BracketApp.state.groups).forEach(g => BracketApp.state.groups[g].sort(() => Math.random() - 0.5));
        BracketApp.renderGroups();
    },

    lockPhase1: (isRestore = false) => {
        document.getElementById('phase-1-container').classList.add('phase-locked');
        document.getElementById('lock-p1-btn').classList.add('hidden');
        document.getElementById('unlock-p1').classList.remove('hidden');

        const candidates = [];
        Object.keys(BracketApp.state.groups).forEach(g => candidates.push({ team: BracketApp.state.groups[g][2], group: g }));
        BracketApp.state.thirdPlaceCandidates = candidates;

        const p2 = document.getElementById('phase-2-container');
        p2.classList.remove('hidden');
        setTimeout(() => p2.classList.remove('opacity-0'), 100);
        
        if(!isRestore) {
            BracketApp.state.phase = 2;
            BracketApp.renderGroups();
            p2.scrollIntoView({behavior: 'smooth'});
        }
        BracketApp.renderThirdPlacePicker();
    },
    
    unlockPhase: (phaseToUnlock) => {
        if(phaseToUnlock === 1) {
            BracketApp.state.phase = 1;
            document.getElementById('phase-1-container').classList.remove('phase-locked');
            document.getElementById('lock-p1-btn').classList.remove('hidden');
            document.getElementById('unlock-p1').classList.add('hidden');
            document.getElementById('phase-2-container').classList.add('hidden', 'opacity-0');
            document.getElementById('phase-3-container').classList.add('hidden', 'opacity-0');
            BracketApp.renderGroups();
        } 
        else if (phaseToUnlock === 2) {
            BracketApp.state.phase = 2;
            document.getElementById('phase-2-container').classList.remove('phase-locked');
            document.getElementById('btn-lock-phase-2').classList.remove('hidden');
            document.getElementById('unlock-p2').classList.add('hidden');
            document.getElementById('phase-3-container').classList.add('hidden', 'opacity-0');
            BracketApp.renderThirdPlacePicker();
        }
    },

    // --- PHASE 2: 3RD PLACE ---
    renderThirdPlacePicker: () => {
        const container = document.getElementById('third-place-container');
        const counter = document.getElementById('third-place-counter');
        const lockBtn = document.getElementById('btn-lock-phase-2');
        const isLocked = BracketApp.state.phase > 2;

        container.innerHTML = BracketApp.state.thirdPlaceCandidates.map(c => {
            const isSelected = BracketApp.state.selectedThirds.includes(c.team);
            let classes = isSelected 
                ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                : 'bg-black/40 border-white/10 opacity-70 hover:opacity-100 hover:bg-white/5';
            if(isLocked && !isSelected) classes = 'bg-black/20 border-white/5 opacity-20 grayscale';

            return `
            <div onclick="${!isLocked ? `BracketApp.toggleThirdPlace('${c.team}')` : ''}" 
                 class="cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 relative group transform ${isSelected ? 'scale-105' : 'scale-100'} ${classes}">
                 <div class="absolute top-2 left-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Group ${c.group}</div>
                 ${isSelected ? '<div class="absolute top-2 right-2 text-yellow-400 bg-yellow-900/50 rounded-full p-0.5"><i data-lucide="check" class="w-3 h-3"></i></div>' : ''}
                 <div class="mt-4 transform scale-150 shadow-lg">${BracketApp.getFlag(c.team)}</div>
                 <div class="font-bold text-sm text-center leading-tight ${isSelected ? 'text-white' : 'text-gray-400'}">${c.team}</div>
            </div>`;
        }).join('');

        const count = BracketApp.state.selectedThirds.length;
        counter.innerText = count;
        if (count === 8) {
            counter.classList.add('text-emerald-400');
            lockBtn.classList.remove('bg-gray-700', 'text-gray-400', 'cursor-not-allowed');
            lockBtn.classList.add('bg-white', 'text-black', 'hover:bg-emerald-400');
            lockBtn.disabled = false;
        } else {
            counter.classList.remove('text-emerald-400');
            lockBtn.classList.add('bg-gray-700', 'text-gray-400', 'cursor-not-allowed');
            lockBtn.disabled = true;
        }
        lucide.createIcons();
    },

    toggleThirdPlace: (team) => {
        const idx = BracketApp.state.selectedThirds.indexOf(team);
        if (idx > -1) BracketApp.state.selectedThirds.splice(idx, 1);
        else {
            if(BracketApp.state.selectedThirds.length >= 8) return;
            BracketApp.state.selectedThirds.push(team);
        }
        BracketApp.renderThirdPlacePicker();
    },

    lockPhase2: (isRestore = false) => {
        document.getElementById('phase-2-container').classList.add('phase-locked');
        document.getElementById('btn-lock-phase-2').classList.add('hidden');
        document.getElementById('unlock-p2').classList.remove('hidden');
        const p3 = document.getElementById('phase-3-container');
        p3.classList.remove('hidden');
        setTimeout(() => p3.classList.remove('opacity-0'), 100);

        if(!isRestore) {
            BracketApp.state.phase = 3;
            BracketApp.renderThirdPlacePicker();
            p3.scrollIntoView({behavior: 'smooth'});
        }
        BracketApp.renderTree();
    },

    // --- PHASE 3: BRACKET ---
    renderTree: () => {
        const container = document.getElementById('bracket-tree');
        container.innerHTML = '';
        const stages = ['Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final'];
        
        // Helper to resolve Team Names from Codes (e.g. "1A" -> "Mexico")
        const resolveTeam = (code) => {
            if (!code) return "TBD";
            if (code.includes('Winner') || code.includes('Runner-up')) return "TBD";
            
            const gMatch = code.match(/^([12])([A-L])$/);
            if (gMatch) {
                const [_, pos, g] = gMatch;
                return BracketApp.state.groups[g][parseInt(pos)-1] || code;
            }
            if (code.includes('3rd')) {
                // Simplified 3rd place logic for demo: First valid team
                const allowedGroups = code.replace("3rd ", "").split("/"); 
                const found = BracketApp.state.thirdPlaceCandidates.find(c => 
                    allowedGroups.includes(c.group) && BracketApp.state.selectedThirds.includes(c.team)
                );
                return found ? found.team : "3rd Place";
            }
            return code;
        };

        stages.forEach((stage, stageIndex) => {
            const col = document.createElement('div');
            col.className = "flex flex-col justify-around relative z-10 py-4";
            
            const matchIds = BracketApp.orderedMatches[stageIndex];

            matchIds.forEach((id, idx) => {
                const matchData = BracketApp.schedule[id];
                if(!matchData) return;

                // Resolve Teams
                let teamA = BracketApp.state.knockout[`${id}-0`] || resolveTeam(matchData.p1);
                let teamB = BracketApp.state.knockout[`${id}-1`] || resolveTeam(matchData.p2);
                
                if(stageIndex > 0) {
                    const feederA = Object.keys(BracketApp.schedule).find(k => BracketApp.schedule[k].next === id && BracketApp.schedule[k].slot === 0);
                    const feederB = Object.keys(BracketApp.schedule).find(k => BracketApp.schedule[k].next === id && BracketApp.schedule[k].slot === 1);
                    
                    if(feederA && BracketApp.state.knockout[feederA]) teamA = BracketApp.state.knockout[feederA];
                    if(feederB && BracketApp.state.knockout[feederB]) teamB = BracketApp.state.knockout[feederB];
                }

                const connectorHtml = (stageIndex < 4) ? 
                    `<div class="connector-right"></div>` + 
                    ((idx % 2 === 0) ? `<div class="connector-vertical-bottom"></div>` : `<div class="connector-vertical-top"></div>`) 
                    : '';

                const matchDiv = document.createElement('div');
                matchDiv.className = "match-node bg-[#151515] border border-white/10 rounded-lg mb-4 w-64 relative group shadow-lg";
                matchDiv.dataset.id = id;
                
                if (id === 101 || id === 102) {
                    connectorHtml += `<div class="connector-bronze"></div>`;
                }

                matchDiv.innerHTML = `
                    <div class="text-[9px] text-gray-500 px-3 py-1.5 bg-black/40 border-b border-white/5 uppercase tracking-wider flex justify-between rounded-t-lg">
                        <span>M${id} • ${matchData.date}</span>
                        <span>${matchData.venue}</span>
                    </div>
                    <div class="p-2 space-y-1">
                        <div class="p-2 bg-white/5 rounded flex items-center justify-between cursor-pointer hover:bg-emerald-500/20 transition team-slot" 
                             onclick="BracketApp.advanceTeam(this, ${id}, 0)" data-team="${teamA}">
                            <div class="flex items-center gap-3">
                                <div class="scale-110 flag-box">${BracketApp.getFlag(teamA)}</div>
                                <span class="text-sm font-bold text-gray-200 truncate">${teamA}</span>
                            </div>
                        </div>
                        <div class="p-2 bg-white/5 rounded flex items-center justify-between cursor-pointer hover:bg-emerald-500/20 transition team-slot" 
                             onclick="BracketApp.advanceTeam(this, ${id}, 1)" data-team="${teamB}">
                            <div class="flex items-center gap-3">
                                <div class="scale-110 flag-box">${BracketApp.getFlag(teamB)}</div>
                                <span class="text-sm font-bold text-gray-200 truncate">${teamB}</span>
                            </div>
                        </div>
                    </div>
                    ${connectorHtml}
                `;
                col.appendChild(matchDiv);
            });
            container.appendChild(col);
        });

        // FINAL & BRONZE MATCH CONTAINER
        const finalColumn = document.querySelector('#bracket-tree > div:last-child');
        const finalMatchNode = finalColumn.querySelector('.match-node[data-id="104"]');
        
        const finalContainer = document.createElement('div');
        finalContainer.className = "final-matches-container";

        const bMatch = BracketApp.schedule[103];
        let bTeamA = "Loser M101", bTeamB = "Loser M102";
        const winner101 = BracketApp.state.knockout[101];
        if(winner101) {
            const t1 = document.querySelector(`.match-node[data-id="101"] .team-slot:nth-child(1)`)?.getAttribute('data-team');
            const t2 = document.querySelector(`.match-node[data-id="101"] .team-slot:nth-child(2)`)?.getAttribute('data-team');
            bTeamA = (t1 === winner101) ? (t2 || "Loser M101") : (t1 || "Loser M101");
        }
        const winner102 = BracketApp.state.knockout[102];
        if(winner102) {
            const t1 = document.querySelector(`.match-node[data-id="102"] .team-slot:nth-child(1)`)?.getAttribute('data-team');
            const t2 = document.querySelector(`.match-node[data-id="102"] .team-slot:nth-child(2)`)?.getAttribute('data-team');
            bTeamB = (t1 === winner102) ? (t2 || "Loser M102") : (t1 || "Loser M102");
        }

        const bronzeMatchHTML = `
            <div class="match-node bg-[#151515] border border-yellow-900/30 rounded-lg w-64 relative group shadow-lg bronze-match" data-id="103">
                <div class="text-[9px] text-yellow-600 px-3 py-1.5 bg-black/40 border-b border-yellow-900/10 uppercase tracking-wider flex justify-between rounded-t-lg">
                    <span>M103 • ${bMatch.date}</span>
                    <span>${bMatch.venue}</span>
                </div>
                <div class="p-2 space-y-1">
                    <div class="p-2 bg-white/5 rounded flex items-center justify-between cursor-pointer hover:bg-yellow-500/20 transition team-slot" onclick="BracketApp.advanceTeam(this, 103, 0)" data-team="${bTeamA}">
                        <div class="flex items-center gap-3"><div class="scale-110 flag-box">${BracketApp.getFlag(bTeamA)}</div><span class="text-sm font-bold text-gray-400 truncate">${bTeamA}</span></div>
                    </div>
                    <div class="p-2 bg-white/5 rounded flex items-center justify-between cursor-pointer hover:bg-yellow-500/20 transition team-slot" onclick="BracketApp.advanceTeam(this, 103, 1)" data-team="${bTeamB}">
                        <div class="flex items-center gap-3"><div class="scale-110 flag-box">${BracketApp.getFlag(bTeamB)}</div><span class="text-sm font-bold text-gray-400 truncate">${bTeamB}</span></div>
                    </div>
                </div>
                <div class="absolute -top-6 left-0 w-full text-center text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Bronze Match</div>
            </div>
        `;
        
        finalContainer.appendChild(finalMatchNode.cloneNode(true));
        finalContainer.innerHTML += bronzeMatchHTML;
        finalColumn.innerHTML = '';
        finalColumn.appendChild(finalContainer);
    },

    advanceTeam: (el, matchId, slotIdx) => {
        const teamName = el.getAttribute('data-team');
        if(!teamName || teamName.includes('TBD') || teamName.includes('Loser') || teamName.includes('3rd')) return;

        // Visual Highlight
        const parent = el.closest('.match-node');
        parent.querySelectorAll('.team-slot').forEach(d => {
            d.classList.remove('bg-emerald-500', 'text-black', 'bg-yellow-500');
            d.querySelector('span').classList.remove('text-black');
        });
        
        if(matchId === 103) el.classList.add('bg-yellow-500');
        else el.classList.add('bg-emerald-500');
        el.querySelector('span').classList.add('text-black');

        BracketApp.state.knockout[matchId] = teamName;
        BracketApp.savePicks();

        // Update Next Round Logic
        const currentMatch = BracketApp.schedule[matchId];
        
        if(matchId === 101 || matchId === 102) {
            BracketApp.renderTree(); 
            setTimeout(BracketApp.restoreBracketState, 50);
        }

        if(currentMatch && currentMatch.next) {
            const nextMatchId = currentMatch.next;
            const nextSlot = currentMatch.slot;
            
            const nextNode = document.querySelector(`.match-node[data-id="${nextMatchId}"]`);
            if(nextNode) {
                const targetSlot = nextNode.querySelectorAll('.team-slot')[nextSlot];
                if(targetSlot) {
                    targetSlot.setAttribute('data-team', teamName);
                    targetSlot.querySelector('span').innerText = teamName;
                    targetSlot.querySelector('.flag-box').innerHTML = BracketApp.getFlag(teamName);
                    
                    // Clear invalid future selections
                    nextNode.querySelectorAll('.team-slot').forEach(d => {
                        d.classList.remove('bg-emerald-500', 'text-black');
                        d.querySelector('span').classList.remove('text-black');
                    });
                }
            }
        } 
        
        if(matchId === 104) BracketApp.declareWinner(teamName, BracketApp.getFlag(teamName));
    },

    restoreBracketState: () => {
        Object.keys(BracketApp.state.knockout).forEach(matchId => {
            const winner = BracketApp.state.knockout[matchId];
            const node = document.querySelector(`.match-node[data-id="${matchId}"]`);
            if(node) {
                const slots = node.querySelectorAll('.team-slot');
                slots.forEach(s => {
                    if(s.getAttribute('data-team') === winner) {
                        s.classList.add(matchId === '103' ? 'bg-yellow-500' : 'bg-emerald-500');
                        s.querySelector('span').classList.add('text-black');
                    }
                });
            }
        });
    },

    declareWinner: (name, flagHtml) => {
        const winSection = document.getElementById('winner-section');
        winSection.classList.remove('hidden');
        document.getElementById('champion-display').innerHTML = `${flagHtml} <span>${name}</span>`;
        BracketApp.state.champion = name;
        setTimeout(() => winSection.scrollIntoView({behavior:'smooth'}), 200);
    },
    
    generateNanoBadge: () => {
        const btn = document.querySelector('#winner-section button');
        const img = document.getElementById('generated-badge');
        const winner = BracketApp.state.champion;
        if(!winner) return;
        btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Designing Badge...`;
        btn.disabled = true;
        setTimeout(() => {
            img.src = `https://placehold.co/400x400/000/34D399?text=${winner}+Champion`; 
            img.classList.remove('hidden');
            btn.innerHTML = `<i data-lucide="check"></i> Badge Created`;
            btn.classList.add('bg-gray-700', 'cursor-default');
        }, 2500);
    },
    savePicks: () => {
        localStorage.setItem('fifa_bracket_data', JSON.stringify(BracketApp.state));
        const btn = document.getElementById('save-btn');
        if(btn) {
            const og = btn.innerText;
            btn.innerText = "Saved!";
            btn.classList.add('text-emerald-400');
            setTimeout(() => { btn.innerText = og; btn.classList.remove('text-emerald-400'); }, 2000);
        }
    },
    shareBracket: () => document.getElementById('share-modal')?.classList.remove('hidden'),
    downloadImage: () => {
        html2canvas(document.getElementById('bracket-capture-area')).then(canvas => {
            const link = document.createElement('a');
            link.download = `fifa-bracket-${BracketApp.uid}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    }
};

if (typeof window !== 'undefined') window.BracketApp = BracketApp;