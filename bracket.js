const BracketApp = {
    state: {
        phase: 1, // 1=Setup, 3=Knockout
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
        if (!document.getElementById('groups-container')) return;

        BracketApp.uid = localStorage.getItem('fifa_bracket_uid') || BracketApp.generateUID();

        const savedData = localStorage.getItem('fifa_bracket_data');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            BracketApp.state = { ...BracketApp.state, ...parsed };
        } else {
            BracketApp.loadGroups();
        }

        BracketApp.renderGroups();
        BracketApp.updateThirdPlaceLogic();
        BracketApp.renderThirdPlacePicker();

        if (BracketApp.state.phase === 3 && BracketApp.state.selectedThirds.length === 8) {
            BracketApp.switchToBracketView();
        } else {
            BracketApp.state.phase = 1;
            document.getElementById('setup-view').classList.remove('hidden');
            document.getElementById('knockout-stage').classList.add('hidden');
        }
    },

    generateUID: () => 'BRK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    
    getFlag: (team) => {
        // Use the site's existing flag system if available
        if (typeof window.getFlagHTML === 'function') {
            return window.getFlagHTML(team);
        }
        
        // Comprehensive emoji flag fallback
        const flagMap = {
            'Mexico': '🇲🇽', 'Canada': '🇨🇦', 'USA': '🇺🇸',
            'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'Germany': '🇩🇪',
            'Spain': '🇪🇸', 'France': '🇫🇷', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
            'Portugal': '🇵🇹', 'Belgium': '🇧🇪', 'Netherlands': '🇳🇱',
            'South Africa': '🇿🇦', 'Korea Republic': '🇰🇷', 'Morocco': '🇲🇦',
            'Haiti': '🇭🇹', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Paraguay': '🇵🇾',
            'Australia': '🇦🇺', 'Qatar': '🇶🇦', 'Switzerland': '🇨🇭',
            'Curaçao': '🇨🇼', 'Côte d\'Ivoire': '🇨🇮', 'Ecuador': '🇪🇨',
            'Japan': '🇯🇵', 'Tunisia': '🇹🇳', 'Egypt': '🇪🇬',
            'IR Iran': '🇮🇷', 'New Zealand': '🇳🇿', 'Cabo Verde': '🇨🇻',
            'Saudi Arabia': '🇸🇦', 'Uruguay': '🇺🇾', 'Senegal': '🇸🇳',
            'Norway': '🇳🇴', 'Algeria': '🇩🇿', 'Austria': '🇦🇹',
            'Jordan': '🇯🇴', 'Uzbekistan': '🇺🇿', 'Colombia': '🇨🇴',
            'Croatia': '🇭🇷', 'Ghana': '🇬🇭', 'Panama': '🇵🇦'
        };
        
        return flagMap[team] || '⚽';
    },

    // Official Pot Mapping from 2026 World Cup
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

    loadGroups: () => {
        if (Object.keys(BracketApp.state.groups).length > 0) return;
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].forEach(g => {
            // Check if MatchEngine is available first
            if (typeof MatchEngine !== 'undefined' && MatchEngine.potMapping && MatchEngine.potMapping[g]) {
                BracketApp.state.groups[g] = Object.values(MatchEngine.potMapping[g]);
            } 
            // Fallback to BracketApp's own potMapping
            else if (BracketApp.potMapping && BracketApp.potMapping[g]) {
                BracketApp.state.groups[g] = Object.values(BracketApp.potMapping[g]);
            } 
            // Last resort fallback
            else {
                BracketApp.state.groups[g] = [`Team ${g}1`, `Team ${g}2`, `Team ${g}3`, `Team ${g}4`];
            }
        });
    },

    renderGroups: () => {
        const container = document.getElementById('groups-container');
        if (!container) return;
        container.innerHTML = '';

        Object.keys(BracketApp.state.groups).forEach(group => {
            const teams = BracketApp.state.groups[group];
            const groupCard = document.createElement('div');
            groupCard.className = 'group-card';
            groupCard.innerHTML = `
                <div class="group-header">Group ${group}</div>
                <div class="group-teams" id="group-${group}">
                    ${teams.map((team, i) => `
                        <div class="group-team position-${i + 1}" draggable="true" data-team="${team}">
                            <span style="font-size: 0.75rem; color: #6b7280; width: 1rem;">${i + 1}</span>
                            <span class="team-flag">${BracketApp.getFlag(team)}</span>
                            <span class="team-name">${team}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(groupCard);
        });

        Object.keys(BracketApp.state.groups).forEach(g => BracketApp.enableDragDrop(g));
        BracketApp.updateThirdPlaceLogic();
        BracketApp.renderThirdPlacePicker();
    },

    enableDragDrop: (group) => {
        const list = document.getElementById(`group-${group}`);
        let draggedItem = null;

        list.querySelectorAll('.group-team').forEach(item => {
            item.addEventListener('dragstart', () => {
                draggedItem = item;
                item.style.opacity = '0.5';
            });

            item.addEventListener('dragend', () => {
                draggedItem = null;
                item.style.opacity = '1';
                BracketApp.updateGroupOrder(group);
            });

            item.addEventListener('dragover', e => e.preventDefault());

            item.addEventListener('drop', e => {
                e.preventDefault();
                if (draggedItem && draggedItem !== item) {
                    const all = [...list.querySelectorAll('.group-team')];
                    if (all.indexOf(item) < all.indexOf(draggedItem)) {
                        list.insertBefore(draggedItem, item);
                    } else {
                        list.insertBefore(draggedItem, item.nextSibling);
                    }
                }
            });
        });
    },

    updateGroupOrder: (group) => {
        const list = document.getElementById(`group-${group}`);
        BracketApp.state.groups[group] = [...list.querySelectorAll('.group-team')].map(el => el.getAttribute('data-team'));
        BracketApp.renderGroups();
    },

    autoSimulateGroups: () => {
        Object.keys(BracketApp.state.groups).forEach(g => {
            BracketApp.state.groups[g].sort(() => Math.random() - 0.5);
        });
        BracketApp.renderGroups();
    },

    updateThirdPlaceLogic: () => {
        const candidates = [];
        Object.keys(BracketApp.state.groups).forEach(g => {
            candidates.push({ team: BracketApp.state.groups[g][2], group: g });
        });
        BracketApp.state.thirdPlaceCandidates = candidates;
        BracketApp.state.selectedThirds = BracketApp.state.selectedThirds.filter(t =>
            candidates.find(c => c.team === t)
        );
    },

    renderThirdPlacePicker: () => {
        const container = document.getElementById('third-place-container');
        const counter = document.getElementById('third-place-counter');
        const lockBtn = document.getElementById('btn-generate-bracket');

        container.innerHTML = BracketApp.state.thirdPlaceCandidates.map(candidate => {
            const isSelected = BracketApp.state.selectedThirds.includes(candidate.team);
            return `
                <div onclick="BracketApp.toggleThirdPlace('${candidate.team.replace(/'/g, "\\'")}')" 
                     class="third-place-card ${isSelected ? 'selected' : ''}">
                    <div style="font-size: 0.65rem; color: #6b7280; text-transform: uppercase; margin-bottom: 0.5rem;">
                        Group ${candidate.group}
                    </div>
                    <div style="font-size: 2rem; margin: 1rem 0;">
                        ${BracketApp.getFlag(candidate.team)}
                    </div>
                    <div style="font-weight: 600; font-size: 0.875rem; color: ${isSelected ? '#fff' : '#9ca3af'};">
                        ${candidate.team}
                    </div>
                    ${isSelected ? '<div style="margin-top: 0.5rem; color: #f59e0b;">✓</div>' : ''}
                </div>
            `;
        }).join('');

        const count = BracketApp.state.selectedThirds.length;
        counter.innerText = count;
        lockBtn.disabled = count !== 8;
    },

    toggleThirdPlace: (team) => {
        const idx = BracketApp.state.selectedThirds.indexOf(team);
        if (idx > -1) {
            BracketApp.state.selectedThirds.splice(idx, 1);
        } else {
            if (BracketApp.state.selectedThirds.length >= 8) return;
            BracketApp.state.selectedThirds.push(team);
        }
        BracketApp.renderThirdPlacePicker();
    },

    lockSetupAndGo: () => {
        if (BracketApp.state.selectedThirds.length !== 8) return;
        BracketApp.state.phase = 3;
        BracketApp.savePicks();
        BracketApp.switchToBracketView();
    },

    unlockSetup: () => {
        if (!confirm("Going back will allow you to change groups/3rd place teams. This might invalidate existing knockout picks. Continue?")) return;
        BracketApp.state.phase = 1;
        document.getElementById('knockout-stage').classList.add('hidden');
        document.getElementById('setup-view').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        BracketApp.savePicks();
    },

    switchToBracketView: () => {
        document.getElementById('setup-view').classList.add('hidden');
        document.getElementById('knockout-stage').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        BracketApp.renderTree();
    },

    resetBracket: () => {
        if (!confirm("Clear all knockout predictions?")) return;
        BracketApp.state.knockout = {};
        BracketApp.state.champion = null;
        document.getElementById('winner-section').classList.add('hidden');
        BracketApp.renderTree();
        BracketApp.savePicks();
    },

    renderTree: () => {
        const container = document.getElementById('bracket-tree');
        container.innerHTML = '';

        const rounds = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];

        const resolveTeam = (code) => {
            if (!code || code.includes('Winner') || code.includes('Runner') || code.includes('Loser')) return "TBD";
            const gMatch = code.match(/^([12])([A-L])$/);
            if (gMatch) return BracketApp.state.groups[gMatch[2]][parseInt(gMatch[1]) - 1] || code;
            if (code.includes('3rd')) {
                const allowed = code.replace("3rd ", "").split("/");
                const found = BracketApp.state.thirdPlaceCandidates.find(c =>
                    allowed.includes(c.group) && BracketApp.state.selectedThirds.includes(c.team)
                );
                return found ? found.team : "3rd Place";
            }
            return code;
        };

        rounds.forEach((roundName, roundIndex) => {
            const roundDiv = document.createElement('div');
            roundDiv.className = `bracket-round ${roundIndex === 4 ? 'final-round' : ''}`;
            
            // Round header
            const header = document.createElement('div');
            header.className = 'round-header';
            header.textContent = roundName;
            roundDiv.appendChild(header);

            const matchIds = BracketApp.orderedMatches[roundIndex];

            if (roundIndex === 4) {
                // Final round - special layout
                const finalMatch = BracketApp.schedule[104];
                let teamA = resolveTeam(finalMatch.p1);
                let teamB = resolveTeam(finalMatch.p2);

                if (BracketApp.state.knockout[101]) teamA = BracketApp.state.knockout[101];
                if (BracketApp.state.knockout[102]) teamB = BracketApp.state.knockout[102];

                const finalCard = BracketApp.renderMatchCard(104, finalMatch, teamA, teamB);
                roundDiv.innerHTML += `
                    <div style="position: relative;">
                        ${finalCard}
                    </div>
                `;

                // Bronze match
                const bronzeMatch = BracketApp.schedule[103];
                let bronzeA = "Loser M101";
                let bronzeB = "Loser M102";

                if (BracketApp.state.knockout[101] && BracketApp.state.knockout[102]) {
                    const semi1Node = document.querySelector(`.match-card[data-id="101"]`);
                    const semi2Node = document.querySelector(`.match-card[data-id="102"]`);
                    
                    if (semi1Node) {
                        const winner = BracketApp.state.knockout[101];
                        const slots = semi1Node.querySelectorAll('.team-slot');
                        bronzeA = slots[0].dataset.team === winner ? slots[1].dataset.team : slots[0].dataset.team;
                    }
                    if (semi2Node) {
                        const winner = BracketApp.state.knockout[102];
                        const slots = semi2Node.querySelectorAll('.team-slot');
                        bronzeB = slots[0].dataset.team === winner ? slots[1].dataset.team : slots[0].dataset.team;
                    }
                }

                roundDiv.innerHTML += BracketApp.renderMatchCard(103, bronzeMatch, bronzeA, bronzeB, true);

            } else {
                // Regular rounds
                for (let i = 0; i < matchIds.length; i += 2) {
                    const match1Id = matchIds[i];
                    const match2Id = matchIds[i + 1];

                    const pairDiv = document.createElement('div');
                    pairDiv.className = 'match-pair';

                    // First match
                    const match1 = BracketApp.schedule[match1Id];
                    let team1A = BracketApp.state.knockout[`${match1Id}-0`] || resolveTeam(match1.p1);
                    let team1B = BracketApp.state.knockout[`${match1Id}-1`] || resolveTeam(match1.p2);

                    if (roundIndex > 0) {
                        const feedA = Object.keys(BracketApp.schedule).find(k =>
                            BracketApp.schedule[k].next == match1Id && BracketApp.schedule[k].slot == 0
                        );
                        const feedB = Object.keys(BracketApp.schedule).find(k =>
                            BracketApp.schedule[k].next == match1Id && BracketApp.schedule[k].slot == 1
                        );
                        if (feedA && BracketApp.state.knockout[feedA]) team1A = BracketApp.state.knockout[feedA];
                        if (feedB && BracketApp.state.knockout[feedB]) team1B = BracketApp.state.knockout[feedB];
                    }

                    pairDiv.innerHTML += BracketApp.renderMatchCard(match1Id, match1, team1A, team1B);

                    // Second match
                    const match2 = BracketApp.schedule[match2Id];
                    let team2A = BracketApp.state.knockout[`${match2Id}-0`] || resolveTeam(match2.p1);
                    let team2B = BracketApp.state.knockout[`${match2Id}-1`] || resolveTeam(match2.p2);

                    if (roundIndex > 0) {
                        const feedA = Object.keys(BracketApp.schedule).find(k =>
                            BracketApp.schedule[k].next == match2Id && BracketApp.schedule[k].slot == 0
                        );
                        const feedB = Object.keys(BracketApp.schedule).find(k =>
                            BracketApp.schedule[k].next == match2Id && BracketApp.schedule[k].slot == 1
                        );
                        if (feedA && BracketApp.state.knockout[feedA]) team2A = BracketApp.state.knockout[feedA];
                        if (feedB && BracketApp.state.knockout[feedB]) team2B = BracketApp.state.knockout[feedB];
                    }

                    pairDiv.innerHTML += BracketApp.renderMatchCard(match2Id, match2, team2A, team2B);

                    // Add connector lines for this pair
                    pairDiv.innerHTML += BracketApp.renderConnectors(match1Id, match2Id);

                    roundDiv.appendChild(pairDiv);
                }
            }

            container.appendChild(roundDiv);
        });

        BracketApp.updateSelections();
    },

    renderMatchCard: (matchId, match, teamA, teamB, isBronze = false) => {
        return `
            <div class="match-card ${isBronze ? 'bronze' : ''}" data-id="${matchId}">
                <div class="match-header">
                    <span>M${matchId} • ${match.date}</span>
                    <span>${match.venue}</span>
                </div>
                <div class="match-teams">
                    <div class="team-slot" onclick="BracketApp.advanceTeam(this, ${matchId}, 0)" data-team="${teamA}" data-slot="0">
                        <span class="team-flag">${BracketApp.getFlag(teamA)}</span>
                        <span class="team-name">${teamA}</span>
                    </div>
                    <div class="team-slot" onclick="BracketApp.advanceTeam(this, ${matchId}, 1)" data-team="${teamB}" data-slot="1">
                        <span class="team-flag">${BracketApp.getFlag(teamB)}</span>
                        <span class="team-name">${teamB}</span>
                    </div>
                </div>
                <div class="connector-h"></div>
            </div>
        `;
    },

    renderConnectors: (match1Id, match2Id) => {
        return `
            <div class="connector-corner top" data-match="${match1Id}"></div>
            <div class="connector-corner bottom" data-match="${match2Id}"></div>
            <div class="connector-h-main" data-pair="${match1Id}-${match2Id}"></div>
        `;
    },

    advanceTeam: (el, matchId, slotIdx) => {
        const team = el.dataset.team;
        if (!team || team.includes('TBD') || team.includes('Loser') || team.includes('3rd')) return;

        const matchCard = el.closest('.match-card');
        matchCard.querySelectorAll('.team-slot').forEach(slot => slot.classList.remove('selected'));
        el.classList.add('selected');

        BracketApp.state.knockout[matchId] = team;
        BracketApp.savePicks();

        const match = BracketApp.schedule[matchId];

        if (matchId === 101 || matchId === 102) {
            BracketApp.renderTree();
        } else if (match.next) {
            const nextCard = document.querySelector(`.match-card[data-id="${match.next}"]`);
            if (nextCard) {
                const targetSlot = nextCard.querySelectorAll('.team-slot')[match.slot];
                if (targetSlot) {
                    targetSlot.dataset.team = team;
                    targetSlot.querySelector('.team-name').textContent = team;
                    targetSlot.querySelector('.team-flag').innerHTML = BracketApp.getFlag(team);
                }
            }
        } else if (matchId === 104) {
            BracketApp.declareWinner(team);
        }

        BracketApp.updateSelections();
    },

    updateSelections: () => {
        // First, reset all connector states
        document.querySelectorAll('.connector-h, .connector-corner, .connector-h-main').forEach(el => {
            el.classList.remove('active');
        });

        // Activate connectors based on knockout state
        Object.keys(BracketApp.state.knockout).forEach(matchId => {
            const winner = BracketApp.state.knockout[matchId];
            const matchCard = document.querySelector(`.match-card[data-id="${matchId}"]`);
            
            if (matchCard) {
                // Highlight the winning team
                const slot = matchCard.querySelector(`.team-slot[data-team="${winner}"]`);
                if (slot) slot.classList.add('selected');

                // Activate the horizontal connector from this match
                const connector = matchCard.querySelector('.connector-h');
                if (connector) connector.classList.add('active');

                // Find and activate the pair connectors
                const pair = matchCard.closest('.match-pair');
                if (pair) {
                    const pairMatches = pair.querySelectorAll('.match-card');
                    const bothComplete = Array.from(pairMatches).every(card => {
                        const cardId = card.dataset.id;
                        return BracketApp.state.knockout[cardId];
                    });

                    if (bothComplete) {
                        // Activate corner connectors
                        pair.querySelectorAll('.connector-corner').forEach(corner => {
                            corner.classList.add('active');
                        });
                        // Activate main horizontal line to next round
                        const mainConnector = pair.querySelector('.connector-h-main');
                        if (mainConnector) mainConnector.classList.add('active');
                    } else {
                        // Partial activation - only the corner for the completed match
                        const matchIndex = Array.from(pairMatches).indexOf(matchCard);
                        const corner = pair.querySelector(`.connector-corner.${matchIndex === 0 ? 'top' : 'bottom'}`);
                        if (corner) corner.classList.add('active');
                    }
                }
            }
        });
    },

    declareWinner: (team) => {
        BracketApp.state.champion = team;
        const winnerSection = document.getElementById('winner-section');
        const championDisplay = document.getElementById('champion-display');
        
        championDisplay.innerHTML = `
            <span style="font-size: 4rem;">${BracketApp.getFlag(team)}</span>
            <span>${team}</span>
        `;
        
        winnerSection.classList.remove('hidden');
        winnerSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    generateNanoBadge: () => {
        const btn = event.target;
        const container = document.getElementById('ai-badge-container');
        const img = document.getElementById('generated-badge');
        const champion = BracketApp.state.knockout[104];

        btn.innerHTML = '⏳ Designing Badge...';
        btn.disabled = true;

        setTimeout(() => {
            img.src = `https://placehold.co/400x400/10B981/000000?text=${encodeURIComponent(champion)}+Champion&font=oswald`;
            container.style.display = 'block';
            btn.innerHTML = '✓ Badge Created';
            btn.classList.add('btn-secondary');
            btn.style.cursor = 'default';
        }, 1500);
    },

    savePicks: () => {
        localStorage.setItem('fifa_bracket_data', JSON.stringify(BracketApp.state));
        localStorage.setItem('fifa_bracket_uid', BracketApp.uid);
    },

    shareBracket: () => {
        document.getElementById('share-modal')?.classList.remove('hidden');
    },

    downloadImage: () => {
        if (typeof html2canvas !== 'undefined') {
            html2canvas(document.getElementById('bracket-tree')).then(canvas => {
                const link = document.createElement('a');
                link.download = `fifa-bracket-${BracketApp.uid}.png`;
                link.href = canvas.toDataURL();
                link.click();
            });
        } else {
            alert('Screenshot feature requires html2canvas library. Add it to your page.');
        }
    }
};

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.BracketApp = BracketApp;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', BracketApp.init);
    } else {
        BracketApp.init();
    }
}
