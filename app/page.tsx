import React from "react";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Countdown to FIFA World Cup 2026</h1>
      <p className="mt-2 text-gray-600">until FIFA World Cup 2026</p>

      <section className="mt-8">
        {/* TODO: Replace with the project’s actual countdown component */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Countdown</h2>
          <p className="mt-2 text-gray-600">
            Placeholder timer. Wire up the real component later.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <a href="/updates" className="rounded-lg border p-6 hover:bg-gray-50">
          <h3 className="text-lg font-semibold">Latest Updates →</h3>
          <p className="mt-2 text-gray-600">Match news and site updates.</p>
        </a>
        <a href="/blog" className="rounded-lg border p-6 hover:bg-gray-50">
          <h3 className="text-lg font-semibold">From the Blog →</h3>
          <p className="mt-2 text-gray-600">Articles on FIFA Collect and more.</p>
        </a>
      </section>
    </main>
  );
}
