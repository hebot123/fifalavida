import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#00FF66] mt-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">FIFA La Vida</h3>
          <p className="text-sm">
            A fan-run hub celebrating FIFA moments and collectables. Not affiliated with FIFA or any official organisation.
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-white mb-2">Explore</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/updates" className="hover:text-[#00FF66]">
                Updates
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[#00FF66]">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#00FF66]">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#00FF66]">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-white mb-2">Legal</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/privacy" className="hover:text-[#00FF66]">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="hover:text-[#00FF66]">
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <p className="text-center text-xs py-4 text-gray-500">
          &copy; {new Date().getFullYear()} FIFA La Vida. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
