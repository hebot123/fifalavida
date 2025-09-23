"use client";
import CollectableCard, { Collectable } from "./CollectableCard";

const collectables: Collectable[] = [
  {
    id: 1,
    name: "World Cup Ball",
    description: "Official match ball from the latest World Cup.",
    image: "https://images.unsplash.com/photo-1607473121811-11a45f0c89fe?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Legendary Player Card",
    description: "Limited edition card of a legendary player.",
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Team Jersey",
    description: "Signed national team jersey.",
    image: "https://images.unsplash.com/photo-1547332189-1af63e279145?auto=format&fit=crop&w=400&q=80",
  },
];

export default function CollectablesSection() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
          <span className="text-[#00FF66]">C</span>ollectables
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {collectables.map((item) => (
            <CollectableCard key={item.id} collectable={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
