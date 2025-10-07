import Link from 'next/link';

import CountdownTimer from '@/app/components/CountdownTimer';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700 md:text-5xl">
          Countdown to FIFA World Cup 2026
        </h1>
        <p className="mt-3 text-base text-slate-600 md:text-lg">until FIFA World Cup 2026</p>
      </header>

      <section className="mt-10">
        <CountdownTimer />
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <Link
          href="/updates"
          className="group rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          <h2 className="text-xl font-semibold text-emerald-700">Latest Updates →</h2>
          <p className="mt-2 text-sm text-slate-600">
            Match news, releases, and site updates.
          </p>
        </Link>
        <Link
          href="/blog"
          className="group rounded-2xl border border-blue-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <h2 className="text-xl font-semibold text-blue-700">From the Blog →</h2>
          <p className="mt-2 text-sm text-slate-600">
            Articles on FIFA Collect and more.
          </p>
        </Link>
      </section>
    </main>
  );
}
