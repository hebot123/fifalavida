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

    init: () => {
        if(!document.getElementById('groups-container')) return;
        
        BracketApp.loadGroups();
        BracketApp.renderGroups();
        
        // Restore ID
        BracketApp.uid = localStorage.getItem('fifa_bracket_uid') || BracketApp.generateUID();
        
        // Check if we have saved data to restore state
        const savedData = localStorage.getItem('fifa_bracket_data');
        if(savedData) {
            const parsed = JSON.parse(savedData);
            BracketApp.state = { ...BracketApp.state, ...parsed };
            // Restore visuals based on phase
            if(BracketApp.state.phase >= 2) BracketApp.lockPhase1(true);
            if(BracketApp.state.phase >= 3) BracketApp.lockPhase2(true);
        }

        if(typeof lucide !== 'undefined') lucide.createIcons();
    },

    generateUID: () => 'BRK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),

    // --- HELPER: Get Flag ---
    getFlag: (teamName) => {
        if(window.getFlagHTML) return window.getFlagHTML(teamName);
        return ''; // Fallback if index.html logic isn't loaded
    },

    // --- PHASE 1: GROUPS ---
    
    loadGroups: () => {
        if(Object.keys(BracketApp.state.groups).length > 0) return; // Don't overwrite if state loaded

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
            
            // Header
            card.innerHTML = `
                <div class="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                    <span class="font-bold text-emerald-400 text-lg font-oswald">Group ${groupLetter}</span>
                    ${!isLocked ? '<i data-lucide="grip-vertical" class="w-4 h-4 text-gray-600"></i>' : '<i data-lucide="lock" class="w-3 h-3 text-gray-500"></i>'}
                </div>
                <ul class="space-y-1" id="group-${groupLetter}">
                    ${teams.map((t, i) => {
                        const flag = BracketApp.getFlag(t);
                        // Visual logic for qualification
                        let rowClass = "border-white/5 bg-black/40 text-gray-500"; // Default (4th)
                        let badge = "";
                        
                        if(i === 0) { // 1st
                            rowClass = "border-emerald-500/40 bg-emerald-500/10 text-white";
                            badge = '<span class="text-[10px] font-bold bg-emerald-500 text-black px-1 rounded ml-auto">1st</span>';
                        } else if (i === 1) { // 2nd
                            rowClass = "border-emerald-500/20 bg-emerald-500/5 text-white";
                            badge = '<span class="text-[10px] font-bold bg-emerald-500/50 text-white px-1 rounded ml-auto">2nd</span>';
                        } else if (i === 2) { // 3rd
                            rowClass = "border-yellow-500/20 bg-yellow-500/5 text-yellow-200";
                            badge = '<span class="text-[10px] font-bold text-yellow-500/50 ml-auto">?</span>';
                        }

                        return `
                        <li class="${rowClass} border p-2 rounded flex items-center gap-3 transition relative ${!isLocked ? 'cursor-move hover:bg-white/5' : ''}" 
                            ${!isLocked ? 'draggable="true"' : ''} data-team="${t}">
                            <span class="text-[10px] font-mono opacity-50 w-3">${i+1}</span>
                            <div class="flex items-center gap-2">
                                ${flag}
                                <span class="font-semibold text-sm">${t}</span>
                            </div>
                            ${badge}
                        </li>
                    `}).join('')}
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
        BracketApp.renderGroups(); // Re-render to update colors/numbers
    },

    autoSimulateGroups: () => {
        if(BracketApp.state.phase > 1) return;
        Object.keys(BracketApp.state.groups).forEach(g => BracketApp.state.groups[g].sort(() => Math.random() - 0.5));
        BracketApp.renderGroups();
    },

    lockPhase1: (isRestore = false) => {
        // Visual Lock
        document.getElementById('phase-1-container').classList.add('phase-locked');
        document.querySelector('#phase-1-container button').classList.add('hidden'); // Hide lock button
        
        // Calculate 3rd place candidates
        const candidates = [];
        Object.keys(BracketApp.state.groups).forEach(g => {
            candidates.push({ team: BracketApp.state.groups[g][2], group: g });
        });
        BracketApp.state.thirdPlaceCandidates = candidates;

        // Show Phase 2
        const p2 = document.getElementById('phase-2-container');
        p2.classList.remove('hidden');
        setTimeout(() => p2.classList.remove('opacity-0'), 100); // Fade in
        
        // Update State
        if(!isRestore) {
            BracketApp.state.phase = 2;
            BracketApp.renderGroups(); // Re-render groups as locked
            document.getElementById('phase-2-container').scrollIntoView({behavior: 'smooth'});
        }
        
        BracketApp.renderThirdPlacePicker();
    },

    // --- PHASE 2: 3RD PLACE ---

    renderThirdPlacePicker: () => {
        const container = document.getElementById('third-place-container');
        const counter = document.getElementById('third-place-counter');
        const lockBtn = document.getElementById('btn-lock-phase-2');
        const isLocked = BracketApp.state.phase > 2;

        container.innerHTML = BracketApp.state.thirdPlaceCandidates.map(c => {
            const isSelected = BracketApp.state.selectedThirds.includes(c.team);
            const flag = BracketApp.getFlag(c.team);
            
            let classes = isSelected 
                ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                : 'bg-black/40 border-white/10 opacity-70 hover:opacity-100 hover:bg-white/5';
                
            if(isLocked && !isSelected) classes = 'bg-black/20 border-white/5 opacity-20 grayscale';

            return `
            <div onclick="${!isLocked ? `BracketApp.toggleThirdPlace('${c.team}')` : ''}" 
                 class="cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 relative group transform ${isSelected ? 'scale-105' : 'scale-100'} ${classes}">
                 
                 <div class="absolute top-2 left-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Group ${c.group}</div>
                 ${isSelected ? '<div class="absolute top-2 right-2 text-yellow-400 bg-yellow-900/50 rounded-full p-0.5"><i data-lucide="check" class="w-3 h-3"></i></div>' : ''}
                 
                 <div class="mt-4 transform scale-150 shadow-lg">${flag}</div>
                 <div class="font-bold text-sm text-center leading-tight ${isSelected ? 'text-white' : 'text-gray-400'}">${c.team}</div>
            </div>
            `;
        }).join('');

        // Update Counter
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
            lockBtn.classList.remove('bg-white', 'text-black', 'hover:bg-emerald-400');
            lockBtn.disabled = true;
        }
        
        lucide.createIcons();
    },

    toggleThirdPlace: (team) => {
        const idx = BracketApp.state.selectedThirds.indexOf(team);
        if (idx > -1) {
            BracketApp.state.selectedThirds.splice(idx, 1);
        } else {
            if(BracketApp.state.selectedThirds.length >= 8) return; // Max 8
            BracketApp.state.selectedThirds.push(team);
        }
        BracketApp.renderThirdPlacePicker();
    },

    lockPhase2: (isRestore = false) => {
        // Visual Lock
        document.getElementById('phase-2-container').classList.add('phase-locked');
        document.getElementById('btn-lock-phase-2').classList.add('hidden');
        
        // Show Phase 3
        const p3 = document.getElementById('phase-3-container');
        p3.classList.remove('hidden');
        setTimeout(() => p3.classList.remove('opacity-0'), 100);

        if(!isRestore) {
            BracketApp.state.phase = 3;
            BracketApp.renderThirdPlacePicker(); // Render locked state
            document.getElementById('phase-3-container').scrollIntoView({behavior: 'smooth'});
        }
        
        BracketApp.renderTree();
    },

    // --- PHASE 3: BRACKET ---

    renderTree: () => {
        const container = document.getElementById('bracket-tree');
        container.innerHTML = '';
        const stages = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];
        
        // Simple mapping to populate R32 slots
        const g = BracketApp.state.groups;
        const thirds = BracketApp.state.selectedThirds;
        
        // This is a simplified pairing logic for 48 teams
        // In reality, it depends on WHICH 3rd places qualify, but we'll fill slots sequentially for the demo
        const matchups = [
            [g.A[1], g.B[1]], [g.K[0], g.L[1]], [g.H[0], g.J[1]], [g.D[0], thirds[0]||'3rd Group'],
            [g.E[0], g.I[1]], [g.F[0], g.C[1]], [g.G[0], thirds[1]||'3rd Group'], [g.C[0], g.F[1]],
            [g.B[0], thirds[2]||'3rd Group'], [g.I[0], g.G[1]], [g.E[1], g.A[0]], [g.L[0], thirds[3]||'3rd Group'],
            [g.J[0], g.H[1]], [g.D[1], g.K[1]], [g.F[1], thirds[4]||'3rd Group'], [g.G[1], thirds[5]||'3rd Group']
        ]; // Only 16 matches needed for R32

        stages.forEach((stage, stageIndex) => {
            const col = document.createElement('div');
            col.className = "flex flex-col justify-around relative z-10 py-4";
            
            const matchCount = 16 / Math.pow(2, stageIndex);
            
            for(let i=0; i<matchCount; i++) {
                const matchId = `${stageIndex}-${i}`;
                
                // Connector Logic
                let connectorHtml = '';
                if(stageIndex < stages.length - 1) {
                    connectorHtml += `<div class="connector-right"></div>`;
                    if (i % 2 === 0) connectorHtml += `<div class="connector-vertical-bottom"></div>`;
                    else connectorHtml += `<div class="connector-vertical-top"></div>`;
                }

                // Determine Teams
                let teamA = "TBD", teamB = "TBD";
                if(stageIndex === 0 && matchups[i]) {
                    teamA = matchups[i][0] || "TBD";
                    teamB = matchups[i][1] || "TBD";
                }

                const matchDiv = document.createElement('div');
                matchDiv.className = "match-node bg-[#151515] border border-white/10 rounded-lg mb-4 w-64 relative group shadow-lg";
                
                // Team HTML Helper
                const renderTeam = (t, slot) => {
                    const flag = BracketApp.getFlag(t);
                    return `
                        <div class="p-2 bg-white/5 rounded flex items-center justify-between cursor-pointer hover:bg-emerald-500/20 transition team-slot" 
                             onclick="BracketApp.advanceTeam(this, '${matchId}', ${stageIndex})">
                            <div class="flex items-center gap-3">
                                <div class="scale-110">${flag}</div>
                                <span class="text-sm font-bold text-gray-200">${t}</span>
                            </div>
                        </div>
                    `;
                };

                matchDiv.innerHTML = `
                    <div class="text-[9px] text-gray-500 px-3 py-1.5 bg-black/40 border-b border-white/5 uppercase tracking-wider flex justify-between rounded-t-lg">
                        <span>Match ${i+1}</span>
                        <span>${stage}</span>
                    </div>
                    <div class="p-2 space-y-1">
                        ${renderTeam(teamA, 0)}
                        ${renderTeam(teamB, 1)}
                    </div>
                    ${connectorHtml}
                `;
                col.appendChild(matchDiv);
            }
            container.appendChild(col);
        });
    },

    advanceTeam: (el, matchId, stageIndex) => {
        // Simple visual advancement logic for demo
        // In a full app, you'd calculate the 'next' match ID and populate it
        
        const parent = el.closest('.match-node');
        parent.querySelectorAll('.team-slot').forEach(d => {
            d.classList.remove('bg-emerald-500', 'text-black');
            d.querySelector('span').classList.remove('text-black');
        });
        
        el.classList.add('bg-emerald-500');
        el.querySelector('span').classList.add('text-black');
        
        const winnerName = el.querySelector('span').innerText;
        const winnerFlag = el.querySelector('img')?.outerHTML || '';

        // Final Logic
        if(stageIndex === 4) {
            BracketApp.declareWinner(winnerName, winnerFlag);
        } else {
            // Find next match node (Simplified: purely visual for now as logic is complex)
            // To make this real, we'd need a full tree state in BracketApp.state.knockout
        }
    },

    declareWinner: (name, flagHtml) => {
        const winSection = document.getElementById('winner-section');
        winSection.classList.remove('hidden');
        document.getElementById('champion-display').innerHTML = `${flagHtml} <span>${name}</span>`;
        BracketApp.state.champion = name;
        setTimeout(() => winSection.scrollIntoView({behavior:'smooth'}), 200);
        BracketApp.savePicks();
    },
    
    // --- UTILS ---
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