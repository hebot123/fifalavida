const Chatbot = {
    isOpen: false,
    
    // Icons
    icons: {
        bot: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M4 11v-1a6 6 0 0 1 6-6 6 6 0 0 1 6 6v1"/><path d="M12 22a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4z"/><path d="M12 18v-5"/><path d="M8 13h8"/><path d="M9 13v-2"/><path d="M15 13v-2"/></svg>`,
        send: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    },

    init: () => {
        Chatbot.injectStyles();
        Chatbot.createWidget();
        Chatbot.addMessage("bot", "Hola! I'm your World Cup concierge. Ask me about <strong>Matches (e.g. M44)</strong>, hotels, or attractions!");
    },

    // Helper to simulate a user asking a question (used by suggestion chips)
    ask: (text) => {
        Chatbot.addMessage('user', text);
        // Simulate thinking delay
        setTimeout(() => {
            const response = Chatbot.generateResponse(text);
            Chatbot.addMessage('bot', response);
        }, 600);
    },

    injectStyles: () => {
        const style = document.createElement('style');
        style.innerHTML = `
            #fifa-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Inter', sans-serif; }
            #chat-toggle { background: #34D399; color: black; border: none; width: 60px; height: 60px; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 12px rgba(52, 211, 153, 0.4); display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
            #chat-toggle:hover { transform: scale(1.05); }
            #chat-window { position: absolute; bottom: 80px; right: 0; width: 350px; height: 500px; background: #111; border: 1px solid #333; border-radius: 12px; display: none; flex-direction: column; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            #chat-header { background: #000; padding: 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
            #chat-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
            .msg { max-width: 85%; padding: 12px 14px; border-radius: 12px; font-size: 14px; line-height: 1.4; word-wrap: break-word; }
            .msg.bot { background: #222; color: #e5e5e5; align-self: flex-start; border-bottom-left-radius: 2px; }
            .msg.user { background: #34D399; color: #000; align-self: flex-end; border-bottom-right-radius: 2px; font-weight: 500; }
            #chat-input-area { padding: 15px; border-top: 1px solid #333; display: flex; gap: 10px; background: #000; }
            #chat-input { flex: 1; background: #222; border: 1px solid #333; color: white; padding: 10px; border-radius: 20px; outline: none; font-size: 14px; }
            #chat-input:focus { border-color: #34D399; }
            #chat-send { background: transparent; border: none; color: #34D399; cursor: pointer; padding: 5px; }
            .suggestion-chip { display: inline-block; background: #333; color: #ccc; padding: 4px 10px; border-radius: 15px; font-size: 11px; margin: 5px 5px 0 0; cursor: pointer; transition: background 0.2s; border: 1px solid #444; }
            .suggestion-chip:hover { background: #34D399; color: black; border-color: #34D399; }
        `;
        document.head.appendChild(style);
    },

    createWidget: () => {
        const div = document.createElement('div');
        div.id = 'fifa-chat-widget';
        div.innerHTML = `
            <div id="chat-window">
                <div id="chat-header">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span class="font-bold text-white text-sm uppercase tracking-wider">Concierge AI</span>
                    </div>
                    <button onclick="Chatbot.toggle()" class="text-gray-400 hover:text-white">${Chatbot.icons.close}</button>
                </div>
                <div id="chat-messages"></div>
                <div id="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Ask about matches or cities..." onkeypress="if(event.key==='Enter') Chatbot.handleSend()">
                    <button id="chat-send" onclick="Chatbot.handleSend()">${Chatbot.icons.send}</button>
                </div>
            </div>
            <button id="chat-toggle" onclick="Chatbot.toggle()">${Chatbot.icons.bot}</button>
        `;
        document.body.appendChild(div);
    },

    toggle: () => {
        Chatbot.isOpen = !Chatbot.isOpen;
        const win = document.getElementById('chat-window');
        win.style.display = Chatbot.isOpen ? 'flex' : 'none';
        if(Chatbot.isOpen) document.getElementById('chat-input').focus();
    },

    addMessage: (type, text) => {
        const msgs = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `msg ${type}`;
        div.innerHTML = text; // Allow HTML for lists and styling
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    },

    handleSend: () => {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if(!text) return;
        
        // Use the ask helper
        Chatbot.ask(text);
        input.value = '';
    },

    generateResponse: (input) => {
        const lowerInput = input.toLowerCase();

        // --- 1. MATCH DETECTION ---
        // Regex looks for "M44", "Match 44", "Game 12", etc.
        const matchRegex = /\b(?:m|match|game)\s*#?(\d{1,3})\b/i;
        const matchMatch = lowerInput.match(matchRegex);

        if (matchMatch) {
            const matchId = parseInt(matchMatch[1]);
            
            // Ensure MatchEngine matches are generated
            if (typeof MatchEngine !== 'undefined') {
                if (!MatchEngine.matches || MatchEngine.matches.length === 0) {
                    MatchEngine.generateMatches();
                }
                
                const match = MatchEngine.matches.find(m => m.id === matchId);
                
                if (match) {
                    // Try to find the city in venueData using the stadium name
                    const stadiumRaw = match.stadium || "";
                    const cityMatch = venueData.find(v => 
                        stadiumRaw.includes(v.city) || 
                        v.city.includes(stadiumRaw) ||
                        (stadiumRaw.includes("Jersey") && v.city.includes("New York")) ||
                        (stadiumRaw.includes("Azteca") && v.city.includes("Mexico"))
                    );

                    let response = `
                        <div class="font-bold text-emerald-400 mb-1 border-b border-white/10 pb-1">MATCH ${match.id}</div>
                        <div class="text-xs text-gray-400 mb-2 uppercase tracking-widest">${match.date} • ${match.stadium}</div>
                        <div class="mb-3 text-lg font-bold">${match.teamA} <span class="text-gray-500 text-sm font-normal">vs</span> ${match.teamB}</div>
                    `;

                    if (cityMatch) {
                        response += `
                            <div class="text-sm bg-white/5 p-2 rounded mt-2">
                                <div class="mb-1 text-gray-400">Taking place in <strong>${cityMatch.city}</strong></div>
                                <div class="flex gap-1 flex-wrap">
                                    <span class="suggestion-chip" onclick="Chatbot.ask('Hotels in ${cityMatch.city}')">Find Hotels</span>
                                    <span class="suggestion-chip" onclick="Chatbot.ask('Attractions in ${cityMatch.city}')">Things to Do</span>
                                </div>
                            </div>
                        `;
                    } else {
                        response += `<div class="text-sm mt-2 text-gray-400">Stadium: <strong>${match.stadium}</strong>. I don't have specific tourist info for this venue yet.</div>`;
                    }
                    
                    return response;
                }
            }
            return "I couldn't find details for that match number. Try checking the official bracket.";
        }
        
        // --- 2. CITY DETECTION ---
        const cityMatch = venueData.find(v => 
            lowerInput.includes(v.city.toLowerCase()) || 
            (v.country === 'mx' && lowerInput.includes('mexico')) ||
            (v.country === 'ca' && lowerInput.includes('canada'))
        );

        if (!cityMatch) {
            return "I can help with <strong>Matches</strong> (e.g., 'M44', 'Match 12') or <strong>Host Cities</strong>. Try asking: <br>• 'Who plays in Match 53?'<br>• 'Hotels in Dallas'<br>• 'Stadium info for Toronto'";
        }

        // --- 3. INTENT DETECTION ---
        const isHotel = lowerInput.includes('hotel') || lowerInput.includes('stay') || lowerInput.includes('sleep') || lowerInput.includes('accommodation');
        const isAttraction = lowerInput.includes('do') || lowerInput.includes('see') || lowerInput.includes('attraction') || lowerInput.includes('visit');
        const isStadium = lowerInput.includes('stadium') || lowerInput.includes('arena') || lowerInput.includes('capacity');

        if (isHotel) {
            return `Here are top places to stay in <strong>${cityMatch.city}</strong>:<br><ul class="list-disc pl-4 mt-2 text-gray-300">${cityMatch.hotels.map(h => `<li>${h}</li>`).join('')}</ul>`;
        }
        
        if (isAttraction) {
            return `Top things to do in <strong>${cityMatch.city}</strong>:<br><ul class="list-disc pl-4 mt-2 text-gray-300">${cityMatch.attractions.map(a => `<li>${a}</li>`).join('')}</ul>`;
        }

        if (isStadium) {
            return `<strong>${cityMatch.stadium}</strong><br>Capacity: ${cityMatch.cap}<br>Matches hosted: ${cityMatch.matches}`;
        }

        // Default response for city found
        return `I found <strong>${cityMatch.city}</strong>! What would you like to know?<br>
        <div class="flex gap-1 mt-2">
            <span class="suggestion-chip" onclick="Chatbot.ask('Hotels in ${cityMatch.city}')">Hotels</span>
            <span class="suggestion-chip" onclick="Chatbot.ask('Attractions in ${cityMatch.city}')">Attractions</span>
            <span class="suggestion-chip" onclick="Chatbot.ask('Stadium info for ${cityMatch.city}')">Stadium Info</span>
        </div>`;
    }
};

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Delay slightly to let other assets load
    setTimeout(Chatbot.init, 1000);
});
