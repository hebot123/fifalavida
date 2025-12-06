const PathToGlory = {
    /**
     * Generates the path to glory for a given team using MatchEngine data.
     * @param {string} teamName - The name of the team.
     * @returns {Array} - An array of step objects for the timeline.
     */
    generatePathForTeam: (teamName) => {
        if (!teamName || typeof MatchEngine === 'undefined') {
            return [{ stage: "Select a Team", dates: "TBD", loc: "---", desc: "Please select a team to see their potential path to the final." }];
        }

        const steps = [];
        const clean = (str) => str.replace(/<[^>]*>?/gm, '').replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '').trim();

        // 1. Find the team's group stage matches
        const teamMatches = MatchEngine.matches.filter(m =>
            m.stage === 'Group Stage' &&
            (clean(m.teamA).includes(teamName) || clean(m.teamB).includes(teamName))
        ).sort((a, b) => a.id - b.id);

        if (teamMatches.length === 0) {
            return [{ stage: "Group Stage", dates: "June 11-27", loc: "Various Cities", desc: `The path for ${teamName} will be revealed after the final draw.` }];
        }

        // Add Group Stage Steps
        teamMatches.forEach(match => {
            const opponent = clean(match.teamA).includes(teamName) ? clean(match.teamB) : clean(match.teamA);
            steps.push({
                stage: `Match ${match.id} (vs ${opponent})`,
                dates: match.date,
                loc: match.stadium,
                desc: `Group stage clash against ${opponent} in Group ${match.group}.`
            });
        });

        // 2. Calculate Knockout Path (Assuming Group Winner)
        const group = teamMatches[0].group;
        const groupWinnerLabel = `Group ${group} Winner`;
        const groupRunnerUpLabel = `Group ${group} 2nd`;

        // Helper to find a knockout match based on criteria (e.g., "Group A Winner" or "Winner Match 74")
        const findNextMatch = (criteria) => {
            return Object.entries(MatchEngine.knockoutMapping).find(([id, data]) => {
                // Check both Home (0) and Away (1) slots for the criteria
                return data[0] === criteria || data[1] === criteria;
            });
        };

        // Find R32 Match for Group Winner
        const r32WinnerEntry = findNextMatch(groupWinnerLabel);
        const r32RunnerUpEntry = findNextMatch(groupRunnerUpLabel);

        if (r32WinnerEntry) {
            const [r32Id, r32Data] = r32WinnerEntry;
            const r32Loc = MatchEngine.officialVenues[r32Id] || 'TBD';
            
            // Build description mentioning the alternative path
            let r32Desc = `If ${teamName} wins Group ${group}, they play here (M${r32Id}).`;
            if (r32RunnerUpEntry) {
                const [r32RunId, r32RunData] = r32RunnerUpEntry;
                const r32RunLoc = MatchEngine.officialVenues[r32RunId] || 'TBD';
                r32Desc += ` If they finish 2nd, they travel to ${r32RunLoc} (M${r32RunId}).`;
            }

            steps.push({
                stage: "Round of 32",
                dates: r32Data[2] || "June 28-July 3",
                loc: r32Loc,
                desc: r32Desc
            });

            // 3. Trace the "Winner's Path" deep into the bracket
            let currentMatchId = r32Id;
            
            // We need to trace: R32 -> R16 -> QF -> SF
            // Logic: Find the match where "Winner Match [currentMatchId]" is playing
            while (currentMatchId < 101) { // Stop before Final/3rd Place
                const nextMatchEntry = findNextMatch(`Winner Match ${currentMatchId}`);
                if (!nextMatchEntry) break;

                const [nextId, nextData] = nextMatchEntry;
                const nextLoc = MatchEngine.officialVenues[nextId] || 'TBD';
                
                // Determine stage name based on Match ID ranges or iteration
                let stageName = "Knockout Stage";
                if (nextId > 88 && nextId <= 96) stageName = "Round of 16";
                if (nextId > 96 && nextId <= 100) stageName = "Quarter-Final";
                if (nextId > 100 && nextId <= 102) stageName = "Semi-Final";

                steps.push({
                    stage: `${stageName} (M${nextId})`,
                    dates: nextData[2],
                    loc: nextLoc,
                    desc: `Potential ${stageName} match if they continue winning.`
                });

                currentMatchId = nextId;
            }
        }

        return steps;
    },

    /**
     * Renders the path to glory timeline for a selected team.
     */
    render: () => {
        // Ensure dropdown is populated (Fix for incomplete list)
        PathToGlory.populateTeamSelect();

        const select = document.getElementById('path-team-select');
        if (!select) return;
        
        const team = select.value;
        const container = document.getElementById('path-timeline');
        const ticketContainer = document.getElementById('path-ticket-link');

        if (!container) return;

        // Generate the steps dynamically for the selected team
        const steps = PathToGlory.generatePathForTeam(team);

        // Generate the HTML for each step in the timeline
        const timelineHTML = steps.map((s, i) => `
            <div class="flex gap-6 group">
                <div class="flex flex-col items-center">
                    <div class="w-4 h-4 rounded-full bg-emerald-500 border-4 border-emerald-900 shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10 relative"></div>
                    ${i !== steps.length - 1 ? '<div class="w-0.5 h-20 bg-white/10 group-hover:bg-emerald-500/50 transition duration-500"></div>' : ''}
                </div>
                <div class="pb-8">
                    <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest">${s.dates}</span>
                    <h3 class="text-2xl font-bold text-white mb-1">${s.stage}</h3>
                    <div class="flex items-center gap-2 text-sm text-gray-400 mb-2"><i data-lucide="map-pin" class="w-3 h-3"></i> ${s.loc}</div>
                    <p class="text-gray-500 text-sm leading-relaxed max-w-md">${s.desc}</p>
                </div>
            </div>
        `).join('');

        // Add the final match at the end
        const finalHTML = `
            <div class="flex gap-6 mt-2 opacity-50 group hover:opacity-100 transition">
                <div class="flex flex-col items-center"><div class="w-4 h-4 rounded-full bg-yellow-500 border-4 border-yellow-900 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div></div>
                <div><span class="text-xs font-bold text-yellow-500 uppercase tracking-widest">July 19, 2026</span><h3 class="text-2xl font-bold text-white">World Cup Final (M104)</h3><div class="text-sm text-gray-400">New York / New Jersey</div></div>
            </div>`;

        container.innerHTML = timelineHTML + finalHTML;

        // Show the ticket link
        if (ticketContainer) {
            ticketContainer.classList.remove('hidden');
        }

        // Re-initialize icons if they exist in the new HTML
        if (window.lucide) {
            lucide.createIcons();
        }
    },

    /**
     * Populates the team select dropdown with all teams found in MatchEngine.
     * Guaranteed to fix missing countries.
     */
    populateTeamSelect: () => {
        const optGroup = document.getElementById('path-team-options');
        // Prevent re-populating if already done (check if children > 0)
        if (!optGroup || optGroup.children.length > 0) return;

        const teams = new Set();
        // Use potMapping from MatchEngine as the source of truth
        if (typeof MatchEngine !== 'undefined' && MatchEngine.potMapping) {
            Object.values(MatchEngine.potMapping).forEach(group => {
                Object.values(group).forEach(teamName => {
                    if (!teamName.toLowerCase().includes('winner')) teams.add(teamName);
                });
            });
        }

        const sortedTeams = Array.from(teams).sort();
        // The Hosts (Mexico, Canada, USA) are usually hardcoded in the HTML, 
        // so we filter them out to avoid duplicates in the Contenders group.
        const hosts = ['Mexico', 'Canada', 'USA'];

        sortedTeams.forEach(team => {
            if(!hosts.includes(team)) {
                const opt = document.createElement('option');
                opt.value = team;
                opt.text = team;
                optGroup.appendChild(opt);
            }
        });
    }
};