import React from "react";
import MatchCard from "./MatchCard";

/**
 * Dummy matches to populate the Matches section.
 * In a real app, data would come from an API or CMS.
 */
const matches = [
  {
    homeTeam: "USA",
    awayTeam: "Brazil",
    homeScore: 2,
    awayScore: 1,
    date: "October 10, 2025",
  },
  {
    homeTeam: "Germany",
    awayTeam: "Argentina",
    homeScore: 1,
    awayScore: 1,
    date: "October 9, 2025",
  },
  {
    homeTeam: "Spain",
    awayTeam: "France",
    homeScore: 3,
    awayScore: 2,
    date: "October 8, 2025",
  },
];

/**
 * MatchSection displays a list of recent matches.
 */
export default function MatchSection() {
  return (
    <section className="py-12 px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Latest Matches<span className="text-[#00FF66]">.</span>
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match, index) => (
          <MatchCard key={index} match={match} />
        ))}
      </div>
    </section>
  );
}
