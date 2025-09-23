import React from "react";


/**
 * Type for a news item.
 */
type NewsItem = {
  title: string;
  description: string;
  image: string;
  date: string;
  url?: string;
};

/**
 * NewsCard component displays a single news item.
 */
export default function NewsCard({ news }: { news: NewsItem }) {
  return (
    <div className="bg-gray-900 border border-[#00FF66] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-48">
 <i<img src={news.image} alt={news.title} className="object-cover w-full h-48" />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400">{news.date}</p>
        <h3 className="text-lg font-semibold text-white mb-2">
          {news.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4">{news.description}</p>
        <a
          href={news.url ?? '#'}
          className="inline-block px-3 py-1 bg-[#00FF66] text-black font-semibold rounded hover:bg-green-400 transition-colors"
        >
          Read More
        </a>
      </div>
    </div>
  );
}
