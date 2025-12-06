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

        teamMatches.forEach(match => {
            const opponent = clean(match.teamA).includes(teamName) ? clean(match.teamB) : clean(match.teamA);
            steps.push({
                stage: `Match ${match.id} (vs ${opponent})`,
                dates: match.date,
                loc: match.stadium,
                desc: `Group stage clash against ${opponent} to earn crucial points.`
            });
        });

        // 2. Determine potential knockout path
        const group = teamMatches[0].group;
        const r32_1st_match = Object.entries(MatchEngine.knockoutMapping).find(([id, data]) => data[0] === `Group ${group} Winner`);
        const r32_2nd_match = Object.entries(MatchEngine.knockoutMapping).find(([id, data]) => data[0] === `Group ${group} 2nd`);

        let r32_desc = "The knockout journey begins. Win the group to play one path, or finish second for another.";
        if (r32_1st_match && r32_2nd_match) {
            const [id1, data1] = r32_1st_match;
            const [id2, data2] = r32_2nd_match;
            const loc1 = MatchEngine.officialVenues[id1] || 'TBD';
            const loc2 = MatchEngine.officialVenues[id2] || 'TBD';
            r32_desc = `The knockout journey begins. Finishing 1st in Group ${group} leads to a match in ${loc1} (M${id1}). Finishing 2nd leads to ${loc2} (M${id2}).`;
        }

        steps.push({
            stage: "Round of 32",
            dates: "June 28 - July 3",
            loc: "TBD",
            desc: r32_desc
        });

        // 3. Add generic subsequent knockout rounds
        steps.push({
            stage: "Round of 16",
            dates: "July 4 - 7",
            loc: "TBD",
            desc: "Win the Round of 32 to advance to the final 16 teams in the tournament."
        });
        steps.push({
            stage: "Quarter-Final",
            dates: "July 9 - 11",
            loc: "TBD",
            desc: "A victory here secures a spot in the semi-finals, just two wins from the final."
        });
        steps.push({
            stage: "Semi-Final",
            dates: "July 14 - 15",
            loc: "TBD",
            desc: "The final hurdle before the World Cup Final, played in either Dallas or Atlanta."
        });

        return steps;
    },

    /**
     * Renders the path to glory timeline for a selected team.
     */
    render: () => {
        const team = document.getElementById('path-team-select').value;
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
    }
};