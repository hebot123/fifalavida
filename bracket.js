const BracketApp = {
    state: {
        groups: {}, 
        knockout: {},
        champion: null,
        uid: null,
        league: null
    },

    // Initialize the app
    init: () => {
        // Guard clause: ensure we are on the bracket page
        if(!document.getElementById('groups-container')) return;

        BracketApp.loadGroups();
        BracketApp.renderGroups();
        
        // Restore ID or generate new
        BracketApp.uid = localStorage.getItem('fifa_bracket_uid') || BracketApp.generateUID();
        
        // Restore League if exists
        const savedLeague = localStorage.getItem('fifa_bracket_league');
        if(savedLeague) {
            BracketApp.state.league = JSON.parse(savedLeague);
            BracketApp.updateLeagueUI();
        } else {
            // Reset UI if no league
            BracketApp.resetLeagueUI();
        }

        const idDisplay = document.getElementById('current-bracket-id');
        if(idDisplay) idDisplay.innerText = BracketApp.uid;
        
        BracketApp.startCountdown();
        
        // Re-init icons
        if(typeof lucide !== 'undefined') lucide.createIcons();
    },

    generateUID: () => {
        const id = 'BRK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        localStorage.setItem('fifa_bracket_uid', id);
        return id;
    },

    // --- LEAGUE LOGIC ---

    toggleLeagueModal: (show) => {
        const modal = document.getElementById('league-modal');
        if(!modal) return;
        
        if(show) {
            modal.classList.remove('hidden');
            const input = document.getElementById('league-name-input');
            if(input) input.focus();
        } else {
            modal.classList.add('hidden');
        }
    },

    confirmCreateLeague: () => {
        const nameInput = document.getElementById('league-name-input');
        const name = nameInput.value.trim();
        
        if(!name) return alert("Please enter a league name");

        // Save to state
        BracketApp.state.league = {
            name: name,
            id: 'LG-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            members: 1, // You
            created: new Date().toISOString()
        };

        // Persist to Local Storage
        localStorage.setItem('fifa_bracket_league', JSON.stringify(BracketApp.state.league));

        // Update UI
        BracketApp.updateLeagueUI();
        BracketApp.toggleLeagueModal(false);
        
        // Visual Success Feedback
        const btn = document.querySelector('button[onclick="BracketApp.confirmCreateLeague()"]');
        const ogText = btn.innerText;
        btn.innerText = "League Created!";
        setTimeout(() => btn.innerText = ogText, 2000);
    },

    updateLeagueUI: () => {
        const container = document.getElementById('league-control-area');
        if(container && BracketApp.state.league) {
            container.innerHTML = `
                <div class="glass-panel px-6 py-3 rounded flex items-center gap-4 border border-emerald-500/50">
                    <div class="text-left">
                        <div class="text-[10px] text-gray-400 uppercase tracking-wider">Current League</div>
                        <div class="text-emerald-400 font-bold font-oswald text-xl">${BracketApp.state.league.name}</div>
                    </div>
                    <div class="h-8 w-px bg-white/10"></div>
                    <div class="text-center">
                        <div class="text-[10px] text-gray-400 uppercase">Rank</div>
                        <div class="text-white font-bold">1st</div>
                    </div>
                </div>
            `;
        }
    },

    resetLeagueUI: () => {
        const container = document.getElementById('league-control-area');
        if(container) {
            container.innerHTML = `
                <button onclick="BracketApp.toggleLeagueModal(true)" class="glass-panel px-6 py-3 rounded hover:bg-white/10 transition text-sm font-bold uppercase flex items-center gap-2">
                    <i data-lucide="users"></i> Create League
                </button>
                <div id="user-id-display" class="hidden glass-panel px-6 py-3 rounded text-emerald-400 font-mono text-sm">
                    ID: <span id="current-bracket-id">---</span>
                </div>
            `;
            lucide.createIcons();
        }
    },

    createLeague: () => {
        BracketApp.toggleLeagueModal(true);
    },

    // --- GROUP STAGE LOGIC ---
    
    loadGroups: () => {
        const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'];
        groups.forEach(g => {
             // Pull from MatchEngine if available, else placeholders
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

        Object.keys(BracketApp.state.groups).forEach(groupLetter => {
            const teams = BracketApp.state.groups[groupLetter];
            
            const card = document.createElement('div');
            card.className = "glass-panel p-4 rounded-xl relative group";
            card.innerHTML = `
                <div class="flex justify-between items-center mb-3">
                    <span class="font-bold text-emerald-400 text-lg font-oswald">Group ${groupLetter}</span>
                    <i data-lucide="arrow-down-up" class="w-4 h-4 text-gray-600"></i>
                </div>
                <ul class="space-y-2" id="group-${groupLetter}">
                    ${teams.map((t, i) => `
                        <li class="bg-black/40 border border-white/5 p-2 rounded cursor-move flex items-center justify-between hover:border-emerald-500/30 transition text-sm" draggable="true" data-team="${t}">
                            <div class="flex items-center gap-3">
                                <span class="text-[10px] text-gray-500 font-mono w-3">${i+1}</span>
                                <span class="font-semibold text-gray-200">${t}</span>
                            </div>
                            <i data-lucide="grip-horizontal" class="w-3 h-3 text-gray-700"></i>
                        </li>
                    `).join('')}
                </ul>
            `;
            container.appendChild(card);
            BracketApp.enableDragDrop(groupLetter);
        });
        
        lucide.createIcons();
    },

    enableDragDrop: (group) => {
        const list = document.getElementById(`group-${group}`);
        let draggedItem = null;

        list.querySelectorAll('li').forEach(item => {
            item.addEventListener('dragstart', () => { 
                draggedItem = item; 
                item.classList.add('opacity-50', 'border-emerald-500'); 
            });
            item.addEventListener('dragend', () => { 
                draggedItem = null; 
                item.classList.remove('opacity-50', 'border-emerald-500'); 
                BracketApp.updateGroupOrder(group); 
            });
            item.addEventListener('dragover', e => e.preventDefault());
            item.addEventListener('drop', e => {
                e.preventDefault();
                if (draggedItem && draggedItem !== item) {
                    const all = [...list.querySelectorAll('li')];
                    const curPos = all.indexOf(item);
                    const dragPos = all.indexOf(draggedItem);
                    if (curPos < dragPos) list.insertBefore(draggedItem, item);
                    else list.insertBefore(draggedItem, item.nextSibling);
                }
            });
        });
    },

    updateGroupOrder: (group) => {
        const list = document.getElementById(`group-${group}`);
        // Re-number visuals
        list.querySelectorAll('li').forEach((li, i) => {
            li.querySelector('.font-mono').innerText = i + 1;
        });
        
        // Update State
        const newOrder = [...list.querySelectorAll('li')].map(li => li.getAttribute('data-team'));
        BracketApp.state.groups[group] = newOrder;

        // Trigger Knockout Update
        BracketApp.calculateBracket();
    },

    autoSimulateGroups: () => {
        Object.keys(BracketApp.state.groups).forEach(g => {
            BracketApp.state.groups[g].sort(() => Math.random() - 0.5);
        });
        BracketApp.renderGroups();
        BracketApp.calculateBracket();
    },

    // --- KNOCKOUT LOGIC ---

    calculateBracket: () => {
        // Only render if container exists
        if(!document.getElementById('bracket-tree')) return;
        
        // In a real app, calculate matches based on Group positions (A1 vs B2)
        // For this demo, we just ensure the tree is rendered
        BracketApp.renderTree();
    },

    renderTree: () => {
        const container = document.getElementById('bracket-tree');
        if(container.innerHTML !== '') return; 
        
        const stages = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];
        
        stages.forEach((stage, stageIndex) => {
            const col = document.createElement('div');
            col.className = "flex flex-col justify-around px-4 min-w-[200px] relative z-10 py-4";
            
            const matchCount = 16 / Math.pow(2, stageIndex);
            
            for(let i=0; i<matchCount; i++) {
                const matchDiv = document.createElement('div');
                matchDiv.className = "bg-[#111] border border-white/10 rounded mb-4 p-2 w-48 relative group hover:border-emerald-500/30 transition";
                
                matchDiv.innerHTML = `
                    <div class="text-[9px] text-gray-600 mb-1 uppercase tracking-wider flex justify-between">
                        <span>M${stageIndex+1}-${i+1}</span>
                    </div>
                    <div class="space-y-1">
                        <div class="p-1.5 bg-white/5 rounded flex justify-between cursor-pointer hover:bg-emerald-500/20 transition" onclick="BracketApp.advanceTeam(this, '${stageIndex}-${i}')">
                            <span class="text-xs font-bold text-gray-300">TBD</span>
                        </div>
                        <div class="p-1.5 bg-white/5 rounded flex justify-between cursor-pointer hover:bg-emerald-500/20 transition" onclick="BracketApp.advanceTeam(this, '${stageIndex}-${i}')">
                            <span class="text-xs font-bold text-gray-300">TBD</span>
                        </div>
                    </div>
                `;
                col.appendChild(matchDiv);
            }
            container.appendChild(col);
        });
    },

    advanceTeam: (el, matchId) => {
        // Visual selection logic
        const parent = el.parentElement;
        parent.querySelectorAll('div').forEach(d => d.classList.remove('bg-emerald-500', 'text-black'));
        el.classList.add('bg-emerald-500', 'text-black');
        
        // If it's the final, declare winner
        if(matchId.startsWith('4-')) {
            BracketApp.declareWinner(el.innerText);
        }
    },

    declareWinner: (name) => {
        const winSection = document.getElementById('winner-section');
        if(winSection) {
            winSection.classList.remove('hidden');
            document.getElementById('champion-display').innerText = name;
            BracketApp.state.champion = name;
            setTimeout(() => winSection.scrollIntoView({behavior:'smooth'}), 200);
        }
    },
    
    // --- NANO BANANA / IMAGE GEN ---
    
    generateNanoBadge: () => {
        const btn = document.querySelector('#winner-section button');
        const img = document.getElementById('generated-badge');
        const winner = BracketApp.state.champion;

        if(!winner || winner === 'TBD') return alert("Select a champion first!");

        btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Designing Badge...`;
        btn.disabled = true;

        // Simulating API Delay
        setTimeout(() => {
            img.src = `https://placehold.co/400x400/000/34D399?text=${winner}+Winner`; 
            img.classList.remove('hidden');
            btn.innerHTML = `<i data-lucide="check"></i> Badge Created`;
            btn.classList.add('bg-gray-700', 'cursor-default');
        }, 2500);
    },

    // --- UTILS ---

    startCountdown: () => {
        const el = document.getElementById('countdown-timer');
        if(!el) return;
        const d = new Date('June 11, 2026 12:00:00').getTime();
        setInterval(() => {
            const now = new Date().getTime();
            const days = Math.floor((d - now) / (1000 * 60 * 60 * 24));
            el.innerText = `Closing in ${days} Days`;
        }, 1000);
    },
    
    savePicks: () => {
        localStorage.setItem('fifa_bracket_data', JSON.stringify(BracketApp.state));
        const btn = document.getElementById('save-btn');
        if(btn) {
            const ogText = btn.innerText;
            btn.innerText = "Saved!";
            btn.classList.add('text-emerald-400');
            setTimeout(() => {
                btn.innerText = ogText;
                btn.classList.remove('text-emerald-400');
            }, 2000);
        }
    },
    
    shareBracket: () => {
        const modal = document.getElementById('share-modal');
        if(modal) modal.classList.remove('hidden');
        
        // Render preview
        const tree = document.querySelector("#bracket-tree");
        if(tree) {
            html2canvas(tree).then(canvas => {
                const preview = document.getElementById('share-preview-area');
                preview.innerHTML = '';
                canvas.style.width = "100%";
                canvas.style.height = "100%";
                canvas.style.objectFit = "contain";
                preview.appendChild(canvas);
            });
        }
    },

    downloadImage: () => {
        const target = document.getElementById('bracket-capture-area');
        html2canvas(target).then(canvas => {
            const link = document.createElement('a');
            link.download = `fifa-bracket-${BracketApp.uid}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    }
};

// Force Init if loaded via script injection
if (typeof window !== 'undefined') {
    window.BracketApp = BracketApp;
}