'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { reels } from '@/content/reels';

const ReelCard = ({ index }: { index: number }) => {
  const reel = reels[index];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const captionId = useId();
  const videoId = useId();
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting || entry.intersectionRatio > 0);
        if (isVisible) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '120px',
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    video.preload = 'metadata';
    video.load();
  }, [shouldLoad]);

  const handleTogglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        video.controls = true;
        await video.play();
        setIsPlaying(true);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <figure
      ref={cardRef}
      className="group rounded-3xl border border-slate-200/80 bg-white/95 shadow-lg transition hover:border-emerald-400/60 hover:shadow-emerald-500/20"
    >
      <div className="relative aspect-video overflow-hidden rounded-t-3xl bg-slate-900">
        <video
          ref={videoRef}
          id={videoId}
          className="h-full w-full object-cover"
          poster={reel.poster}
          preload={shouldLoad ? 'metadata' : 'none'}
          playsInline
          controls={isPlaying}
          onEnded={handleEnded}
          aria-label={`${reel.title} reel`}
          aria-describedby={captionId}
        >
          <source src={reel.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button
          type="button"
          onClick={handleTogglePlayback}
          className={`absolute flex items-center justify-center text-sm font-semibold uppercase tracking-wide text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 ${
            isPlaying
              ? 'bottom-4 left-4 right-auto top-auto rounded-full bg-emerald-500 px-4 py-2 shadow-lg hover:bg-emerald-400'
              : 'inset-0 rounded-none bg-black/70 text-base backdrop-blur-sm hover:bg-black/60'
          }`}
          aria-controls={videoId}
          aria-label={isPlaying ? `Pause ${reel.title}` : `Play ${reel.title}`}
          aria-pressed={isPlaying}
        >
          <span
            className={`flex items-center gap-2 rounded-full ${
              isPlaying
                ? 'bg-transparent text-white'
                : 'bg-emerald-500 px-4 py-2 text-sm shadow-lg group-hover:bg-emerald-400'
            }`}
          >
            {isPlaying ? (
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 4.5h2.5v11H6zm5.5 0H14v11h-2.5z" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.5 3.5v13l11-6.5-11-6.5z" />
              </svg>
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </span>
        </button>
      </div>
      <figcaption id={captionId} className="space-y-2 px-6 pb-6 pt-4 text-left">
        <h3 className="text-lg font-semibold text-slate-900">{reel.title}</h3>
        <p className="text-sm text-slate-600">{reel.description}</p>
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
    <section
      aria-labelledby="reels-heading"
      className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-800 px-6 py-10 text-white"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="space-y-3 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">Exclusive Highlights</p>
          <h2 id="reels-heading" className="text-3xl font-extrabold">
            Matchday Reels
          </h2>
          <p className="text-base text-emerald-100">
            Tap into curated FIFA Collect clips capturing the energy of the road to 2026.
          </p>
        </div>
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
