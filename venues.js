const venueData = [
    { 
        city: "Mexico City", 
        stadium: "Estadio Azteca", 
        cap: "87,523", 
        country: "mx", 
        matches: 5,
        attractions: ["Museo Frida Kahlo (Coyoacán)", "Xochimilco Floating Gardens", "Zócalo & Historic Center", "Museo Nacional de Antropología"],
        hotels: ["Royal Pedregal (Near Stadium)", "Gran Hotel Ciudad de México (Center)", "Camino Real Polanco"]
    },
    { 
        city: "New York/NJ", 
        stadium: "MetLife Stadium", 
        cap: "82,500", 
        country: "us", 
        matches: 8,
        attractions: ["American Dream Mall (Next to Stadium)", "Times Square & Broadway", "Statue of Liberty", "Central Park"],
        hotels: ["Renaissance Meadowlands (NJ)", "The Park Hotel (NJ)", "New York Marriott Marquis (NYC)"]
    },
    { 
        city: "Dallas", 
        stadium: "AT&T Stadium", 
        cap: "80,000", 
        country: "us", 
        matches: 9,
        attractions: ["Texas Live! (Entertainment District)", "Six Flags Over Texas", "The Sixth Floor Museum", "Fort Worth Stockyards"],
        hotels: ["Live! by Loews (Arlington)", "Sheraton Arlington Hotel", "Omni Dallas Hotel"]
    },
    { 
        city: "Kansas City", 
        stadium: "Arrowhead Stadium", 
        cap: "76,416", 
        country: "us", 
        matches: 6,
        attractions: ["National WWI Museum", "Joe's Kansas City Bar-B-Que", "Country Club Plaza", "Power & Light District"],
        hotels: ["Loews Kansas City Hotel", "Hotel Kansas City", "Four Seasons Hotel (near Plaza)"]
    },
    { 
        city: "Houston", 
        stadium: "NRG Stadium", 
        cap: "72,220", 
        country: "us", 
        matches: 7,
        attractions: ["Space Center Houston", "The Galleria", "Houston Museum of Natural Science", "Hermann Park"],
        hotels: ["Hotel ZaZa (Museum District)", "Marriott Marquis Houston", "Blossom Hotel Houston (Near Stadium)"]
    },
    { 
        city: "Atlanta", 
        stadium: "Mercedes-Benz Stadium", 
        cap: "71,000", 
        country: "us", 
        matches: 8,
        attractions: ["Georgia Aquarium", "World of Coca-Cola", "Centennial Olympic Park", "Martin Luther King Jr. NHP"],
        hotels: ["Omni Atlanta Hotel (at CNN Center)", "The Westin Peachtree Plaza", "Hyatt Regency Atlanta"]
    },
    { 
        city: "Los Angeles", 
        stadium: "SoFi Stadium", 
        cap: "70,240", 
        country: "us", 
        matches: 8,
        attractions: ["Santa Monica Pier", "Griffith Observatory", "Hollywood Walk of Fame", "The Getty Center"],
        hotels: ["Corkbag Hotel (Classic LA)", "Sonder Lüm (Inglewood)", "The Hollywood Roosevelt"]
    },
    { 
        city: "Philadelphia", 
        stadium: "Lincoln Financial Field", 
        cap: "69,796", 
        country: "us", 
        matches: 6,
        attractions: ["Liberty Bell & Independence Hall", "Reading Terminal Market", "Philadelphia Museum of Art (Rocky Steps)", "Eastern State Penitentiary"],
        hotels: ["Live! Casino & Hotel (Stadium District)", "The Ritz-Carlton Philadelphia", "Loews Philadelphia Hotel"]
    },
    { 
        city: "Seattle", 
        stadium: "Lumen Field", 
        cap: "69,000", 
        country: "us", 
        matches: 6,
        attractions: ["Pike Place Market", "Space Needle & Chihuly Garden", "Seattle Waterfront", "Museum of Pop Culture (MoPOP)"],
        hotels: ["Silver Cloud Hotel (Stadium)", "The Edgewater Hotel", "Embassy Suites Pioneer Square"]
    },
    { 
        city: "San Francisco", 
        stadium: "Levi's Stadium", 
        cap: "68,500", 
        country: "us", 
        matches: 6,
        attractions: ["Golden Gate Bridge", "Alcatraz Island", "Fisherman's Wharf", "California's Great America (Near Stadium)"],
        hotels: ["Hyatt Regency Santa Clara (Near Stadium)", "Hilton Santa Clara", "Fairmont San Francisco (City)"]
    },
    { 
        city: "Boston", 
        stadium: "Gillette Stadium", 
        cap: "65,878", 
        country: "us", 
        matches: 7,
        attractions: ["Freedom Trail", "Fenway Park", "Faneuil Hall Marketplace", "Patriot Place (Next to Stadium)"],
        hotels: ["Renaissance Boston Patriot Place", "Hilton Garden Inn Foxborough", "Omni Parker House (City)"]
    },
    { 
        city: "Miami", 
        stadium: "Hard Rock Stadium", 
        cap: "64,767", 
        country: "us", 
        matches: 7,
        attractions: ["South Beach & Art Deco District", "Wynwood Walls", "Vizcaya Museum", "Little Havana"],
        hotels: ["Seminole Hard Rock Hotel & Casino", "Fontainebleau Miami Beach", "Stadium Hotel (Miami Gardens)"]
    },
    { 
        city: "Vancouver", 
        stadium: "BC Place", 
        cap: "54,500", 
        country: "ca", 
        matches: 7,
        attractions: ["Stanley Park", "Granville Island Public Market", "Capilano Suspension Bridge", "Gastown Steam Clock"],
        hotels: ["Parq Vancouver (Next to Stadium)", "Georgian Court Hotel", "Fairmont Pacific Rim"]
    },
    { 
        city: "Monterrey", 
        stadium: "Estadio BBVA", 
        cap: "53,500", 
        country: "mx", 
        matches: 4,
        attractions: ["Parque Fundidora", "Paseo Santa Lucía", "Macroplaza", "Chipinque Ecological Park"],
        hotels: ["Grand Fiesta Americana Monterrey Valle", "Live Aqua Urban Resort", "Safi Royal Luxury Towers"]
    },
    { 
        city: "Guadalajara", 
        stadium: "Estadio Akron", 
        cap: "49,850", 
        country: "mx", 
        matches: 4,
        attractions: ["Hospicio Cabañas", "Catedral de Guadalajara", "Tlaquepaque Historic Center", "Tequila Express Train"],
        hotels: ["Hard Rock Hotel Guadalajara", "Hyatt Regency Andares", "Fiesta Inn Guadalajara Poniente"]
    },
    { 
        city: "Toronto", 
        stadium: "BMO Field", 
        cap: "45,736", 
        country: "ca", 
        matches: 6,
        attractions: ["CN Tower", "Ripley's Aquarium", "Distillery District", "Royal Ontario Museum"],
        hotels: ["Hotel X Toronto (On Exhibition Grounds)", "The Drake Hotel", "Fairmont Royal York"]
    }
];