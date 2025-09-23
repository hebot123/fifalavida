import React from "react";
import NewsCard from "./NewsCard";

/**
 * Sample news data for the top stories section.
 */
const newsItems = [
  {
    title: "Rivalries ignite: USA defeats Brazil in epic showdown",
    description:
      "In an electrifying match, USA overcame Brazil with a last-minute goal to secure the win. Fans around the world are buzzing about this early World Cup preview.",
    image:
      "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=800&q=80",
    date: "October 12, 2025",
    url: "#",
  },
  {
    title: "Germany and Argentina draw in thriller",
    description:
      "An intense back-and-forth match saw both teams scoring spectacular goals, ending in a deserved draw that keeps both squads at the top of their groups.",
    image:
      "https://images.unsplash.com/photo-1521556949372-42728296c2c7?auto=format&fit=crop&w=800&q=80",
    date: "October 11, 2025",
    url: "#",
  },
  {
    title: "Spain edges France in five-goal spectacle",
    description:
      "Spain narrowly beat France in a high-scoring game full of attacking flair, leaving fans thrilled and eager for what’s next.",
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
    date: "October 10, 2025",
    url: "#",
  },
];

/**
 * NewsSection component renders a grid of news stories.
 */
export default function NewsSection() {
  return (
    <section className="py-12 px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Top Stories<span className="text-[#00FF66]">.</span>
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item, index) => (
          <NewsCard key={index} news={item} />
        ))}
      </div>
    </section>
  );
}
