"use client";
import { useState } from 'react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: integrate with newsletter provider API (e.g. beehiiv, mailchimp)
    // For now, simply clear the form and show a confirmation message
    setSubmitted(true);
    setEmail('');
  };
  return (
    <div className="bg-indigo-600 text-white rounded-lg p-8 shadow-md">
      <h2 className="text-2xl font-bold mb-4">Subscribe to FIFA Collect Weekly</h2>
      <p className="mb-4 text-sm text-indigo-100">Get curated updates on FIFA Collect drops, guides and market insights straight to your inbox.</p>
      {submitted ? (
        <p className="font-semibold">Thanks for subscribing! Please check your inbox to confirm.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md text-gray-900"
          />
          <button type="submit" className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold hover:bg-indigo-50">
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}