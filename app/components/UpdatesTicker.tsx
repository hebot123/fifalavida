"use client";
import { useEffect, useState } from 'react';

interface UpdateItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export default function UpdatesTicker() {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/updates');
        if (res.ok) {
          const data = await res.json();
          setUpdates(data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to fetch updates', err);
      }
    }
    load();
  }, []);
  return (
    <div className="bg-white border rounded-md p-4 shadow-sm">
      {updates.length === 0 && <p className="text-sm text-gray-500">Loading updates...</p>}
      <ul className="space-y-2">
        {updates.map((item, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-xs text-gray-400 mr-2">•</span>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}