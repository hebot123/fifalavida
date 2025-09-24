'use client';

import nftVideos from '@/lib/nftVideos';

export default function NftReel() {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">FIFA Collect NFTs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nftVideos.map((video, idx) => (
          <div key={idx} className="w-full">
            <video
              className="w-full h-auto rounded-lg"
              src={video.link}
              preload="metadata"
              controls
              title={video.Description}
            />
            <p className="mt-2 text-sm text-gray-700">
              {video.Description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
