"use client";
import { useEffect } from 'react';

/**
 * InstagramFeed embeds the Instagram profile feed using the Instagram embed script.
 * See https://developers.facebook.com/docs/instagram/oembed/ for details. In order
 * to render the feed, the Instagram oEmbed script must be loaded. We insert it
 * when the component mounts. Fallback content is provided for users with JS
 * disabled.
 */
export default function InstagramFeed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className="w-full">
      {/* Replace with your own Instagram embed code. The following block
         creates a single post embed for demonstration purposes. To embed
         multiple posts or your feed, consider using a third‑party embed
         service. */}
      <blockquote
        className="instagram-media"
        data-instgrm-permalink="https://www.instagram.com/p/Cb_ybH-PobQ/"
        data-instgrm-version="14"
        style={{ background: '#FFF', border: 0, margin: 0, padding: 0 }}
      >
        <a href="https://www.instagram.com/fifalavida.x" className="text-blue-600 underline">
          View our Instagram
        </a>
      </blockquote>
    </div>
  );
}