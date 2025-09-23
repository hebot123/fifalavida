import React from "react";

/**
 * Match type representing a football match.
 */
type Match = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
};

/**
 * MatchCard component renders a single match with teams, score, and date.
 * Styled with dark card and neon green accents.
 */
export default function MatchCard({ match }: { match: Match }) {
  return (
    <div className="p-4 bg-gradient-to-b from-gray-900 via-black to-gray-900 border border-[#00FF66] rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          {match.homeTeam} vs {match.awayTeam}
        </h3>
        <span className="text-2xl font-bold text-[#00FF66]">
          {match.homeScore} - {match.awayScore}
        </span>
      </div>
      <p className="text-gray-400 text-sm mt-2">{match.date}</p>
    </div>
  );
}
