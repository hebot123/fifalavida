"use client";
import nftVideos, { NftVideo } from "@/lib/nftVideos";
import { useEffect, useState } from "react";

export default function NftReel() {
  const [videos, setVideos] = useState<NftVideo[]>([]);

  useEffect(() => {
    // Use the imported array directly instead of calling it as a function
    setVideos(nftVideos);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="aspect-w-16 aspect-h-9">
            <video
              src={video.videoUrl}
              preload="metadata"
              controls
              title={video.description}
            />
          </div>
          <div className="p-4">
            <p className="mt-2 text-sm text-gray-700">
              {video.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
