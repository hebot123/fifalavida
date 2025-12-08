const BracketApp = {
    state: {
        phase: 1, // 1=Groups, 2=3rd Place, 3=Bracket
        groups: {}, 
        thirdPlaceCandidates: [],
        selectedThirds: [],
        knockout: {}, // Stores winner data: { "0-0": "Mexico", ... }
        champion: null,
        uid: null
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
            if(BracketApp.state.phase >= 3) BracketApp.lockPhase2(true);
            // Re-apply bracket selections
            if(BracketApp.state.phase >= 3) BracketApp.restoreBracketState();
        }

        if(typeof lucide !== 'undefined') lucide.createIcons();
    },

    generateUID: () => 'BRK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    getFlag: (teamName) => window.getFlagHTML ? window.getFlagHTML(teamName) : '',

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
            
            // Hide Phase 2 & 3
            document.getElementById('phase-2-container').classList.add('hidden', 'opacity-0');
            document.getElementById('phase-3-container').classList.add('hidden', 'opacity-0');
            BracketApp.renderGroups(); // Re-enable drag
        } 
        else if (phaseToUnlock === 2) {
            BracketApp.state.phase = 2;
            document.getElementById('phase-2-container').classList.remove('phase-locked');
            document.getElementById('btn-lock-phase-2').classList.remove('hidden');
            document.getElementById('unlock-p2').classList.add('hidden');
            
            // Hide Phase 3
            document.getElementById('phase-3-container').classList.add('hidden', 'opacity-0');
            BracketApp.renderThirdPlacePicker(); // Re-enable clicks
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
        const stages = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];
        const g = BracketApp.state.groups;
        const thirds = BracketApp.state.selectedThirds;
        
        // R32 Pairings (Approximation)
        const matchups = [
            [g.A[1], g.B[1]], [g.K[0], g.L[1]], [g.H[0], g.J[1]], [g.D[0], thirds[0]||'3rd Place'],
            [g.E[0], g.I[1]], [g.F[0], g.C[1]], [g.G[0], thirds[1]||'3rd Place'], [g.C[0], g.F[1]],
            [g.B[0], thirds[2]||'3rd Place'], [g.I[0], g.G[1]], [g.E[1], g.A[0]], [g.L[0], thirds[3]||'3rd Place'],
            [g.J[0], g.H[1]], [g.D[1], g.K[1]], [g.F[1], thirds[4]||'3rd Place'], [g.G[1], thirds[5]||'3rd Place']
        ];

        stages.forEach((stage, stageIndex) => {
            const col = document.createElement('div');
            col.className = "flex flex-col justify-around relative z-10 py-4";
            const matchCount = 16 / Math.pow(2, stageIndex);
            
            for(let i=0; i<matchCount; i++) {
                const matchId = `${stageIndex}-${i}`;
                let teamA = "TBD", teamB = "TBD";
                
                // If Round 1, populate from groups/thirds
                if(stageIndex === 0 && matchups[i]) {
                    teamA = matchups[i][0] || "TBD";
                    teamB = matchups[i][1] || "TBD";
                } 
                // If later round, check State for saved winner
                else {
                    // This logic would pull from state.knockout if implemented fully for restore
                }

                // Connector Logic
                let connectorHtml = '';
                if(stageIndex < stages.length - 1) {
                    connectorHtml += `<div class="connector-right"></div>`;
                    if (i % 2 === 0) connectorHtml += `<div class="connector-vertical-bottom"></div>`;
                    else connectorHtml += `<div class="connector-vertical-top"></div>`;
                }

                const matchDiv = document.createElement('div');
                matchDiv.className = "match-node bg-[#151515] border border-white/10 rounded-lg mb-4 w-64 relative group shadow-lg";
                matchDiv.dataset.id = matchId;

                const renderTeam = (t, slot) => `
                    <div class="p-2 bg-white/5 rounded flex items-center justify-between cursor-pointer hover:bg-emerald-500/20 transition team-slot" 
                         onclick="BracketApp.advanceTeam(this, '${matchId}', ${stageIndex}, ${slot})" data-team="${t}" data-slot="${slot}">
                        <div class="flex items-center gap-3">
                            <div class="scale-110">${BracketApp.getFlag(t)}</div>
                            <span class="text-sm font-bold text-gray-200">${t}</span>
                        </div>
                    </div>`;

                matchDiv.innerHTML = `
                    <div class="text-[9px] text-gray-500 px-3 py-1.5 bg-black/40 border-b border-white/5 uppercase tracking-wider flex justify-between rounded-t-lg">
                        <span>Match ${i+1}</span><span>${stage}</span>
                    </div>
                    <div class="p-2 space-y-1">${renderTeam(teamA, 0)}${renderTeam(teamB, 1)}</div>
                    ${connectorHtml}
                `;
                col.appendChild(matchDiv);
            }
            container.appendChild(col);
        });
    },

    advanceTeam: (el, matchId, stageIndex, slot) => {
        const teamName = el.getAttribute('data-team');
        if(teamName === 'TBD' || teamName === '3rd Place') return;

        // 1. Highlight Selection
        const parent = el.closest('.match-node');
        parent.querySelectorAll('.team-slot').forEach(d => {
            d.classList.remove('bg-emerald-500', 'text-black');
            d.querySelector('span').classList.remove('text-black');
        });
        el.classList.add('bg-emerald-500');
        el.querySelector('span').classList.add('text-black');

        // 2. Save to State
        BracketApp.state.knockout[matchId] = teamName;
        BracketApp.savePicks();

        // 3. Advance to Next Round
        // Logic: Round S, Match M -> Round S+1, Match floor(M/2). Slot = M % 2.
        const [currStage, currMatch] = matchId.split('-').map(Number);
        
        if (currStage < 4) {
            const nextStage = currStage + 1;
            const nextMatch = Math.floor(currMatch / 2);
            const nextSlot = currMatch % 2;
            const nextId = `${nextStage}-${nextMatch}`;
            
            // Find Target DOM Element
            const targetNode = document.querySelector(`.match-node[data-id="${nextId}"]`);
            if(targetNode) {
                const targetSlot = targetNode.querySelector(`.team-slot[data-slot="${nextSlot}"]`);
                if(targetSlot) {
                    // Update Text & Flag
                    targetSlot.setAttribute('data-team', teamName);
                    targetSlot.querySelector('span').innerText = teamName;
                    const flagContainer = targetSlot.querySelector('.scale-110');
                    flagContainer.innerHTML = BracketApp.getFlag(teamName);
                    
                    // Clear any previous selection in the NEXT node if we changed the outcome here
                    targetNode.querySelectorAll('.team-slot').forEach(d => {
                        d.classList.remove('bg-emerald-500', 'text-black');
                        d.querySelector('span').classList.remove('text-black');
                    });
                }
            }
        } else {
            // Final Winner
            BracketApp.declareWinner(teamName, BracketApp.getFlag(teamName));
        }
    },
    
    restoreBracketState: () => {
        // Iterate through saved winners and apply them visually
        Object.keys(BracketApp.state.knockout).forEach(matchId => {
            const winner = BracketApp.state.knockout[matchId];
            const node = document.querySelector(`.match-node[data-id="${matchId}"]`);
            if(node) {
                const slot = node.querySelector(`.team-slot[data-team="${winner}"]`);
                if(slot) slot.click(); // Simulate click to propagate advancement
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
    
    // ... rest of utils (savePicks, share, generateNanoBadge)
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