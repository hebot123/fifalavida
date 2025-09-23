'use client';
//import Image from "next/image";

export interface Collectable {
  id: number;
  name: string;
  description: string;
  image: string; // image url
}

export default function CollectableCard({ collectable }: { collectable: Collectable }) {
  return (
    <div className="bg-[#121212] border border-[#00FF66] rounded-lg p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
    <iimg       src={collectable.image}
        alt={collectable.name}
        width={200}
        height={300}
        className="object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-bold text-white mb-2">{collectable.name}</h3>
      <p className="text-gray-300 mb-4">{collectable.description}</p>
      <button className="bg-[#00FF66] text-black px-4 py-2 rounded-full font-semibold hover:bg-[#00e656] transition-colors">
        Collect Now
      </button>
    </div>
  );
}
