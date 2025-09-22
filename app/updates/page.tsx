import { fetchUpdates } from '@/lib/updates';
import { formatDistanceToNow } from 'date-fns';

export default async function UpdatesPage() {
  const updates = await fetchUpdates();
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">FIFA Updates</h1>
      <p className="text-gray-600">The latest news and announcements from FIFA and the football world, updated every few hours.</p>
      <ul className="space-y-4">
        {updates.map((item, idx) => (
          <li key={idx} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-blue-700">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h3>
              <span className="text-xs text-gray-400">{item.source}</span>
            </div>
            <p className="text-xs text-gray-500">
              {item.pubDate ? formatDistanceToNow(new Date(item.pubDate), { addSuffix: true }) : ''}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}