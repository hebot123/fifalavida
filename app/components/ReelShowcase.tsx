'use client';

import { useMemo, useRef, useState } from 'react';
import { reels } from '@/content/reels';

type ReelState = {
  isPlaying: boolean;
};

const ReelCard = ({ index }: { index: number }) => {
  const reel = reels[index];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<ReelState>({ isPlaying: false });

  const handleTogglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setState({ isPlaying: true });
      } catch (error) {
        video.controls = true;
        await video.play();
        setState({ isPlaying: true });
      }
    } else {
      video.pause();
      setState({ isPlaying: false });
    }
  };

  const handleEnded = () => {
    setState({ isPlaying: false });
  };

  return (
    <figure className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          poster={reel.poster}
          preload="none"
          playsInline
          controls={state.isPlaying}
          onEnded={handleEnded}
          aria-label={`${reel.title} reel`}
        >
          <source src={reel.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button
          type="button"
          onClick={handleTogglePlayback}
          className={`absolute inset-0 flex items-center justify-center text-sm font-medium transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
            state.isPlaying
              ? 'pointer-events-none opacity-0'
              : 'bg-black/50 text-white opacity-100 hover:bg-black/60'
          }`}
          aria-label={state.isPlaying ? `Pause ${reel.title}` : `Play ${reel.title}`}
        >
          <span className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4.5 3.5v13l11-6.5-11-6.5z" />
            </svg>
            Play
          </span>
        </button>
      </div>
      <figcaption className="p-4 text-left">
        <h3 className="text-lg font-semibold text-gray-900">{reel.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{reel.description}</p>
      </figcaption>
    </figure>
  );
};

const ReelShowcase = () => {
  const reelIndices = useMemo(() => reels.map((_, index) => index), []);

  if (reelIndices.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="reels-heading">
      <div className="mx-auto max-w-5xl">
        <h2 id="reels-heading" className="text-2xl font-bold mb-6">
          Reel
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {reelIndices.map((index) => (
            <ReelCard key={reels[index].title} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReelShowcase;
