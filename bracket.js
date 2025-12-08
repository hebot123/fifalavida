const BracketApp = {
    state: {
        phase: 1, // 1=Setup (Groups/3rd), 3=Knockout
        groups: {}, 
        thirdPlaceCandidates: [],
        selectedThirds: [],
        knockout: {}, 
        champion: null,
        uid: null
    },

    // OFFICIAL 2026 SCHEDULE
    schedule: {
        74: { date: "Jun 29", venue: "Boston", p1: "1E", p2: "3rd A/B/C/D/F", next: 89, slot: 0 },
        77: { date: "Jun 30", venue: "NY/NJ", p1: "1I", p2: "3rd C/D/F/G/H", next: 89, slot: 1 },
        73: { date: "Jun 28", venue: "Los Angeles", p1: "2A", p2: "2B", next: 90, slot: 0 },
        75: { date: "Jun 29", venue: "Monterrey", p1: "1F", p2: "2C", next: 90, slot: 1 },
        83: { date: "Jul 2", venue: "Toronto", p1: "2K", p2: "2L", next: 93, slot: 0 },
        84: { date: "Jul 2", venue: "Los Angeles", p1: "1H", p2: "2J", next: 93, slot: 1 },
        81: { date: "Jul 1", venue: "San Francisco", p1: "1D", p2: "3rd B/E/F/I/J", next: 94, slot: 0 },
        82: { date: "Jul 1", venue: "Seattle", p1: "1G", p2: "3rd A/E/H/I/J", next: 94, slot: 1 },
        76: { date: "Jun 29", venue: "Houston", p1: "1C", p2: "2F", next: 91, slot: 0 },
        78: { date: "Jun 30", venue: "Dallas", p1: "2E", p2: "2I", next: 91, slot: 1 },
        79: { date: "Jun 30", venue: "Mexico City", p1: "1A", p2: "3rd C/E/F/H/I", next: 92, slot: 0 },
        80: { date: "Jul 1", venue: "Atlanta", p1: "1L", p2: "3rd E/H/I/J/K", next: 92, slot: 1 },
        86: { date: "Jul 3", venue: "Miami", p1: "1J", p2: "2H", next: 95, slot: 0 },
        88: { date: "Jul 3", venue: "Dallas", p1: "2D", p2: "2G", next: 95, slot: 1 },
        85: { date: "Jul 2", venue: "Vancouver", p1: "1B", p2: "3rd E/F/G/I/J", next: 96, slot: 0 },
        87: { date: "Jul 3", venue: "Kansas City", p1: "1K", p2: "3rd D/E/I/J/L", next: 96, slot: 1 },
        89: { date: "Jul 4", venue: "Philadelphia", next: 97, slot: 0 },
        90: { date: "Jul 4", venue: "Houston", next: 97, slot: 1 },
        93: { date: "Jul 6", venue: "Dallas", next: 98, slot: 0 },
        94: { date: "Jul 6", venue: "Seattle", next: 98, slot: 1 },
        91: { date: "Jul 5", venue: "NY/NJ", next: 99, slot: 0 },
        92: { date: "Jul 5", venue: "Mexico City", next: 99, slot: 1 },
        95: { date: "Jul 7", venue: "Atlanta", next: 100, slot: 0 },
        96: { date: "Jul 7", venue: "Vancouver", next: 100, slot: 1 },
        97: { date: "Jul 9", venue: "Boston", next: 101, slot: 0 },
        98: { date: "Jul 10", venue: "Los Angeles", next: 101, slot: 1 },
        99: { date: "Jul 11", venue: "Miami", next: 102, slot: 0 },
        100: { date: "Jul 11", venue: "Kansas City", next: 102, slot: 1 },
        101: { date: "Jul 14", venue: "Dallas", next: 104, slot: 0 },
        102: { date: "Jul 15", venue: "Atlanta", next: 104, slot: 1 },
        103: { date: "Jul 18", venue: "Miami", label: "Bronze" },
        104: { date: "Jul 19", venue: "NY/NJ", label: "Final" }
    },

    orderedMatches: {
        0: [74, 77, 73, 75, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87], 
        1: [89, 90, 93, 94, 91, 92, 95, 96],
        2: [97, 98, 99, 100],
        3: [101, 102],
        4: [104]
    },

    init: () => {
        if(!document.getElementById('groups-container')) return;
        
        BracketApp.uid = localStorage.getItem('fifa_bracket_uid') || BracketApp.generateUID();
        
        const savedData = localStorage.getItem('fifa_bracket_data');
        if(savedData) {
            const parsed = JSON.parse(savedData);
            BracketApp.state = { ...BracketApp.state, ...parsed };
        } else {
            BracketApp.loadGroups();
        }

        BracketApp.renderGroups();
        BracketApp.updateThirdPlaceLogic();
        BracketApp.renderThirdPlacePicker();

        if(BracketApp.state.phase === 3 && BracketApp.state.selectedThirds.length === 8) {
            BracketApp.switchToBracketView();
        } else {
            BracketApp.state.phase = 1;
            document.getElementById('setup-view').classList.remove('hidden');
            // FIX: Target knockout-stage instead of bracket-view to avoid index.html ID conflict
            document.getElementById('knockout-stage').classList.add('hidden');
        }

        if(typeof lucide !== 'undefined') lucide.createIcons();
    },

    generateUID: () => 'BRK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    getFlag: (t) => window.getFlagHTML ? window.getFlagHTML(t) : '',

    loadGroups: () => {
        if(Object.keys(BracketApp.state.groups).length > 0) return;
        ['A','B','C','D','E','F','G','H','I','J','K','L'].forEach(g => {
             if(typeof MatchEngine !== 'undefined' && MatchEngine.potMapping && MatchEngine.potMapping[g]) {
                 BracketApp.state.groups[g] = Object.values(MatchEngine.potMapping[g]);
             } else { BracketApp.state.groups[g] = [`Team ${g}1`, `Team ${g}2`, `Team ${g}3`, `Team ${g}4`]; }
        });
    },
    renderGroups: () => {
        const c = document.getElementById('groups-container'); if(!c) return; c.innerHTML = '';
        Object.keys(BracketApp.state.groups).forEach(g => {
            const t = BracketApp.state.groups[g];
            c.innerHTML += `<div class="glass-panel p-4 rounded-xl relative group transition hover:border-emerald-500/30">
                <div class="flex justify-between items-center mb-3 border-b border-white/5 pb-2"><span class="font-bold text-emerald-400 text-lg font-oswald">Group ${g}</span><i data-lucide="grip-vertical" class="w-4 h-4 text-gray-600"></i></div>
                <ul class="space-y-1" id="group-${g}">
                    ${t.map((team,i)=>`<li class="${i===0?'border-emerald-500/40 bg-emerald-500/10 text-white':i===1?'border-emerald-500/20 bg-emerald-500/5 text-white':i===2?'border-yellow-500/20 bg-yellow-500/5 text-yellow-200':'border-white/5 bg-black/40 text-gray-500'} border p-2 rounded flex items-center gap-3 transition relative cursor-move hover:bg-white/5" draggable="true" data-team="${team}">
                        <span class="text-[10px] font-mono opacity-50 w-3">${i+1}</span><div class="flex items-center gap-2">${BracketApp.getFlag(team)}<span class="font-semibold text-sm">${team}</span></div>
                    </li>`).join('')}
                </ul></div>`;
        });
        Object.keys(BracketApp.state.groups).forEach(g => BracketApp.enableDragDrop(g));
        BracketApp.updateThirdPlaceLogic();
        BracketApp.renderThirdPlacePicker();
        lucide.createIcons();
    },
    enableDragDrop: (group) => {
        const list = document.getElementById(`group-${group}`);
        let draggedItem = null;
        list.querySelectorAll('li').forEach(item => {
            item.addEventListener('dragstart', () => { draggedItem = item; item.classList.add('opacity-50'); });
            item.addEventListener('dragend', () => { draggedItem = null; item.classList.remove('opacity-50'); BracketApp.updateGroupOrder(group); });
            item.addEventListener('dragover', e => e.preventDefault());
            item.addEventListener('drop', e => { e.preventDefault(); if (draggedItem && draggedItem !== item) { const all = [...list.querySelectorAll('li')]; if (all.indexOf(item) < all.indexOf(draggedItem)) list.insertBefore(draggedItem, item); else list.insertBefore(draggedItem, item.nextSibling); }});
        });
    },
    updateGroupOrder: (group) => {
        const list = document.getElementById(`group-${group}`);
        BracketApp.state.groups[group] = [...list.querySelectorAll('li')].map(li => li.getAttribute('data-team'));
        BracketApp.renderGroups(); 
    },
    autoSimulateGroups: () => {
        Object.keys(BracketApp.state.groups).forEach(g => BracketApp.state.groups[g].sort(() => Math.random() - 0.5));
        BracketApp.renderGroups();
    },

    updateThirdPlaceLogic: () => {
        const candidates = [];
        Object.keys(BracketApp.state.groups).forEach(g => candidates.push({ team: BracketApp.state.groups[g][2], group: g }));
        BracketApp.state.thirdPlaceCandidates = candidates;
        BracketApp.state.selectedThirds = BracketApp.state.selectedThirds.filter(t => candidates.find(c => c.team === t));
    },
    renderThirdPlacePicker: () => {
        const c = document.getElementById('third-place-container');
        const counter = document.getElementById('third-place-counter');
        const lockBtn = document.getElementById('btn-generate-bracket');
        
        c.innerHTML = BracketApp.state.thirdPlaceCandidates.map(k => {
            const sel = BracketApp.state.selectedThirds.includes(k.team);
            let cls = sel ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-black/40 border-white/10 opacity-70 hover:opacity-100 hover:bg-white/5';
            
            return `<div onclick="BracketApp.toggleThirdPlace('${k.team.replace(/'/g, "\\'")}')" class="cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 relative group transform ${sel?'scale-105':'scale-100'} ${cls}">
                <div class="absolute top-2 left-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Group ${k.group}</div>
                ${sel?'<div class="absolute top-2 right-2 text-yellow-400 bg-yellow-900/50 rounded-full p-0.5"><i data-lucide="check" class="w-3 h-3"></i></div>':''}
                <div class="mt-4 transform scale-150 shadow-lg">${BracketApp.getFlag(k.team)}</div>
                <div class="font-bold text-sm text-center leading-tight ${sel?'text-white':'text-gray-400'}">${k.team}</div>
            </div>`;
        }).join('');
        
        const count = BracketApp.state.selectedThirds.length;
        counter.innerText = count;
        
        if(count === 8) { 
            counter.classList.add('text-emerald-400'); 
            lockBtn.classList.remove('bg-gray-700','text-gray-400','cursor-not-allowed'); 
            lockBtn.classList.add('bg-white','text-black','hover:bg-emerald-400'); 
            lockBtn.disabled = false; 
        } else { 
            counter.classList.remove('text-emerald-400'); 
            lockBtn.classList.add('bg-gray-700','text-gray-400','cursor-not-allowed'); 
            lockBtn.classList.remove('bg-white','text-black','hover:bg-emerald-400'); 
            lockBtn.disabled = true; 
        }
        lucide.createIcons();
    },
    toggleThirdPlace: (team) => {
        const idx = BracketApp.state.selectedThirds.indexOf(team);
        if(idx > -1) BracketApp.state.selectedThirds.splice(idx, 1);
        else { if(BracketApp.state.selectedThirds.length >= 8) return; BracketApp.state.selectedThirds.push(team); }
        BracketApp.renderThirdPlacePicker();
    },

    lockSetupAndGo: () => {
        if(BracketApp.state.selectedThirds.length !== 8) return;
        BracketApp.state.phase = 3;
        BracketApp.savePicks();
        BracketApp.switchToBracketView();
    },
    unlockSetup: () => {
        if(!confirm("Going back will allow you to change groups/3rd place, but might invalidate existing knockout picks. Continue?")) return;
        BracketApp.state.phase = 1;
        // FIX: Target knockout-stage instead of bracket-view
        document.getElementById('knockout-stage').classList.add('hidden');
        document.getElementById('setup-view').classList.remove('hidden');
        window.scrollTo({top:0, behavior:'smooth'});
        BracketApp.savePicks();
    },
    switchToBracketView: () => {
        document.getElementById('setup-view').classList.add('hidden');
        // FIX: Target knockout-stage instead of bracket-view
        document.getElementById('knockout-stage').classList.remove('hidden');
        window.scrollTo({top:0, behavior:'smooth'});
        BracketApp.renderTree();
    },
    resetBracket: () => {
        if(!confirm("Clear all knockout predictions?")) return;
        BracketApp.state.knockout = {};
        BracketApp.state.champion = null;
        document.getElementById('winner-section').classList.add('hidden');
        BracketApp.renderTree();
        BracketApp.savePicks();
    },

    renderTree: () => {
        const container = document.getElementById('bracket-tree');
        container.innerHTML = '';
        const stages = ['Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final'];
        
        const resolveTeam = (code) => {
            if(!code || code.includes('Winner') || code.includes('Runner') || code.includes('Loser')) return "TBD";
            const gMatch = code.match(/^([12])([A-L])$/);
            if(gMatch) return BracketApp.state.groups[gMatch[2]][parseInt(gMatch[1])-1] || code;
            if(code.includes('3rd')) {
                const allowed = code.replace("3rd ", "").split("/");
                const found = BracketApp.state.thirdPlaceCandidates.find(c => allowed.includes(c.group) && BracketApp.state.selectedThirds.includes(c.team));
                return found ? found.team : "3rd Place";
            }
            return code;
        };

        stages.forEach((stage, stageIndex) => {
            const col = document.createElement('div');
            col.className = "bracket-column";
            
            const matchIds = BracketApp.orderedMatches[stageIndex];
            
            for(let i = 0; i < matchIds.length; i += (stageIndex < 4 ? 2 : 1)) {
                
                if(stageIndex === 4) {
                    const id = matchIds[0];
                    const m = BracketApp.schedule[id];
                    let tA = BracketApp.state.knockout[`${id}-0`] || resolveTeam(m.p1);
                    let tB = BracketApp.state.knockout[`${id}-1`] || resolveTeam(m.p2);
                    if(BracketApp.state.knockout[101]) tA = BracketApp.state.knockout[101];
                    if(BracketApp.state.knockout[102]) tB = BracketApp.state.knockout[102];

                    const finalStack = document.createElement('div');
                    finalStack.className = "final-stack";
                    finalStack.innerHTML = BracketApp.renderMatchNodeHTML(id, m, tA, tB, false);
                    
                    const bId = 103; const bM = BracketApp.schedule[bId];
                    let bA = "Loser M101", bB = "Loser M102";
                    if(BracketApp.state.knockout[101]) {
                        const w = BracketApp.state.knockout[101];
                        const prevNode = document.querySelector(`.match-node[data-id="101"]`);
                        if(prevNode) { bA = (prevNode.querySelector('.team-slot[data-slot="0"]')?.dataset.team === w) ? prevNode.querySelector('.team-slot[data-slot="1"]')?.dataset.team : prevNode.querySelector('.team-slot[data-slot="0"]')?.dataset.team; }
                    }
                    if(BracketApp.state.knockout[102]) {
                        const w = BracketApp.state.knockout[102];
                        const prevNode = document.querySelector(`.match-node[data-id="102"]`);
                        if(prevNode) { bB = (prevNode.querySelector('.team-slot[data-slot="0"]')?.dataset.team === w) ? prevNode.querySelector('.team-slot[data-slot="1"]')?.dataset.team : prevNode.querySelector('.team-slot[data-slot="0"]')?.dataset.team; }
                    }
                    
                    finalStack.innerHTML += `
                        <div class="match-node bg-[#151515] border border-yellow-900/30 rounded-lg w-64 relative group shadow-lg bronze-node" data-id="103">
                            <div class="bronze-label">Bronze Match</div>
                            <div class="text-[9px] text-yellow-600 px-3 py-1.5 bg-black/40 border-b border-yellow-900/10 uppercase tracking-wider flex justify-between rounded-t-lg"><span>M103 • ${bM.date}</span><span>${bM.venue}</span></div>
                            <div class="p-2 space-y-1">
                                <div class="p-2 bg-white/5 rounded flex items-center justify-between cursor-pointer hover:bg-yellow-500/20 transition team-slot" onclick="BracketApp.advanceTeam(this, 103, 0)" data-team="${bA}" data-slot="0"><div class="flex items-center gap-3"><div class="scale-110 flag-box">${BracketApp.getFlag(bA)}</div><span class="text-sm font-bold text-gray-400 truncate">${bA}</span></div></div>
                                <div class="p-2 bg-white/5 rounded flex items-center justify-between cursor-pointer hover:bg-yellow-500/20 transition team-slot" onclick="BracketApp.advanceTeam(this, 103, 1)" data-team="${bB}" data-slot="1"><div class="flex items-center gap-3"><div class="scale-110 flag-box">${BracketApp.getFlag(bB)}</div><span class="text-sm font-bold text-gray-400 truncate">${bB}</span></div></div>
                            </div>
                        </div>`;
                    col.appendChild(finalStack);
                    continue;
                }

                const id1 = matchIds[i];
                const id2 = matchIds[i+1];
                
                const pairDiv = document.createElement('div');
                pairDiv.className = "match-pair";
                pairDiv.dataset.pairId = `${id1}-${id2}`;

                const m1 = BracketApp.schedule[id1];
                let t1A = BracketApp.state.knockout[`${id1}-0`] || resolveTeam(m1.p1);
                let t1B = BracketApp.state.knockout[`${id1}-1`] || resolveTeam(m1.p2);
                if(stageIndex > 0) {
                     const feedA = Object.keys(BracketApp.schedule).find(k=>BracketApp.schedule[k].next==id1 && BracketApp.schedule[k].slot==0);
                     const feedB = Object.keys(BracketApp.schedule).find(k=>BracketApp.schedule[k].next==id1 && BracketApp.schedule[k].slot==1);
                     if(feedA && BracketApp.state.knockout[feedA]) t1A = BracketApp.state.knockout[feedA];
                     if(feedB && BracketApp.state.knockout[feedB]) t1B = BracketApp.state.knockout[feedB];
                }
                pairDiv.innerHTML += BracketApp.renderMatchNodeHTML(id1, m1, t1A, t1B, true);

                const m2 = BracketApp.schedule[id2];
                let t2A = BracketApp.state.knockout[`${id2}-0`] || resolveTeam(m2.p1);
                let t2B = BracketApp.state.knockout[`${id2}-1`] || resolveTeam(m2.p2);
                if(stageIndex > 0) {
                     const feedA = Object.keys(BracketApp.schedule).find(k=>BracketApp.schedule[k].next==id2 && BracketApp.schedule[k].slot==0);
                     const feedB = Object.keys(BracketApp.schedule).find(k=>BracketApp.schedule[k].next==id2 && BracketApp.schedule[k].slot==1);
                     if(feedA && BracketApp.state.knockout[feedA]) t2A = BracketApp.state.knockout[feedA];
                     if(feedB && BracketApp.state.knockout[feedB]) t2B = BracketApp.state.knockout[feedB];
                }
                pairDiv.innerHTML += BracketApp.renderMatchNodeHTML(id2, m2, t2A, t2B, true);

                pairDiv.innerHTML += `<div class="line-fork" id="fork-${id1}-${id2}"></div><div class="line-stem" id="stem-${id1}-${id2}"></div>`;
                col.appendChild(pairDiv);
            }
            container.appendChild(col);
        });
        
        BracketApp.updateTracers();
        lucide.createIcons();
    },

    renderMatchNodeHTML: (id, m, tA, tB, hasNext) => {
        return `
        <div class="match-node" data-id="${id}">
            <div class="text-[9px] text-gray-500 px-3 py-1.5 bg-black/40 border-b border-white/5 uppercase tracking-wider flex justify-between rounded-t-lg">
                <span>M${id} • ${m.date}</span><span>${m.venue}</span>
            </div>
            <div class="p-2 space-y-1">
                <div class="p-2 bg-white/5 rounded flex items-center justify-between cursor-pointer hover:bg-emerald-500/20 transition team-slot" onclick="BracketApp.advanceTeam(this, ${id}, 0)" data-team="${tA}" data-slot="0">
                    <div class="flex items-center gap-3"><div class="scale-110 flag-box">${BracketApp.getFlag(tA)}</div><span class="text-sm font-bold text-gray-200 truncate">${tA}</span></div>
                </div>
                <div class="p-2 bg-white/5 rounded flex items-center justify-between cursor-pointer hover:bg-emerald-500/20 transition team-slot" onclick="BracketApp.advanceTeam(this, ${id}, 1)" data-team="${tB}" data-slot="1">
                    <div class="flex items-center gap-3"><div class="scale-110 flag-box">${BracketApp.getFlag(tB)}</div><span class="text-sm font-bold text-gray-200 truncate">${tB}</span></div>
                </div>
            </div>
        </div>`;
    },

    advanceTeam: (el, matchId, slotIdx) => {
        const team = el.dataset.team;
        if(!team || team.includes('TBD') || team.includes('Loser') || team.includes('3rd')) return;

        const node = el.closest('.match-node');
        node.querySelectorAll('.team-slot').forEach(s => { s.classList.remove('bg-emerald-500','text-black'); s.querySelector('span').classList.remove('text-black'); });
        if(matchId===103) el.classList.add('bg-yellow-500'); else el.classList.add('bg-emerald-500');
        el.querySelector('span').classList.add('text-black');

        BracketApp.state.knockout[matchId] = team;
        BracketApp.savePicks();

        const m = BracketApp.schedule[matchId];
        if(matchId === 101 || matchId === 102) { BracketApp.renderTree(); }
        else if(m.next) {
            const nextNode = document.querySelector(`.match-node[data-id="${m.next}"]`);
            if(nextNode) {
                const slot = nextNode.querySelectorAll('.team-slot')[m.slot];
                if(slot) {
                    slot.dataset.team = team;
                    slot.querySelector('span').innerText = team;
                    slot.querySelector('.flag-box').innerHTML = BracketApp.getFlag(team);
                    nextNode.querySelectorAll('.team-slot').forEach(s => { s.classList.remove('bg-emerald-500','text-black'); s.querySelector('span').classList.remove('text-black'); });
                }
            }
        } else if(matchId === 104) { BracketApp.declareWinner(team, BracketApp.getFlag(team)); }
        
        BracketApp.updateTracers();
    },

    updateTracers: () => {
        const pairs = document.querySelectorAll('.match-pair');
        pairs.forEach(pair => {
            const [id1, id2] = pair.dataset.pairId.split('-');
            const fork = pair.querySelector('.line-fork');
            const stem = pair.querySelector('.line-stem');
            
            if(BracketApp.state.knockout[id1]) fork.classList.add('active-top'); else fork.classList.remove('active-top');
            if(BracketApp.state.knockout[id2]) fork.classList.add('active-bottom'); else fork.classList.remove('active-bottom');
            if(BracketApp.state.knockout[id1] || BracketApp.state.knockout[id2]) { fork.classList.add('active-stem'); stem.classList.add('active'); } 
            else { fork.classList.remove('active-stem'); stem.classList.remove('active'); }
        });
        
        Object.keys(BracketApp.state.knockout).forEach(mid => {
            const winner = BracketApp.state.knockout[mid];
            const node = document.querySelector(`.match-node[data-id="${mid}"]`);
            if(node) {
                const slot = node.querySelector(`.team-slot[data-team="${winner}"]`);
                if(slot) {
                    slot.classList.add(mid==='103'?'bg-yellow-500':'bg-emerald-500');
                    slot.querySelector('span').classList.add('text-black');
                }
            }
        });
    },

    declareWinner: (n,f) => { document.getElementById('winner-section').classList.remove('hidden'); document.getElementById('champion-display').innerHTML=`${f} <span>${n}</span>`; document.getElementById('winner-section').scrollIntoView({behavior:'smooth'}); },
    generateNanoBadge: () => {
        const btn = document.querySelector('#winner-section button'); const img = document.getElementById('generated-badge'); const winner = BracketApp.state.champion; 
        btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Designing Badge...`; btn.disabled = true;
        setTimeout(() => { img.src = `https://placehold.co/400x400/000/34D399?text=${BracketApp.state.knockout[104]}+Champion`; img.classList.remove('hidden'); btn.innerHTML = `<i data-lucide="check"></i> Badge Created`; btn.classList.add('bg-gray-700', 'cursor-default'); }, 1500);
    },
    savePicks: () => { localStorage.setItem('fifa_bracket_data', JSON.stringify(BracketApp.state)); const btn = document.getElementById('save-btn'); if(btn) { const og=btn.innerText; btn.innerText="Saved!"; btn.classList.add('text-emerald-400'); setTimeout(()=>{btn.innerText=og;btn.classList.remove('text-emerald-400');},2000); } },
    shareBracket: () => { 
        document.getElementById('share-modal')?.classList.remove('hidden');
    },
    downloadImage: () => { html2canvas(document.getElementById('bracket-capture-area')).then(c => { const l = document.createElement('a'); l.download = `fifa-bracket-${BracketApp.uid}.png`; l.href = c.toDataURL(); l.click(); }); }
};
if (typeof window !== 'undefined') window.BracketApp = BracketApp;