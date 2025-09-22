import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="container mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <p className="font-semibold mb-2">FIFA La Vida</p>
          <p className="max-w-xs">
            A fan-run hub celebrating FIFA moments and NFTs. Not affiliated with FIFA or any official organisation.
          </p>
        </div>
        <div className="mb-4 md:mb-0 space-y-2">
          <Link href="/updates" className="block hover:text-blue-600">
            Updates
          </Link>
          <Link href="/blog" className="block hover:text-blue-600">
            Blog
          </Link>
          <Link href="/about" className="block hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="block hover:text-blue-600">
            Contact
          </Link>
          <Link href="/privacy" className="block hover:text-blue-600">
            Privacy
          </Link>
          <Link href="/disclaimer" className="block hover:text-blue-600">
            Disclaimer
          </Link>
        </div>
        <div>
          <p className="font-semibold mb-2">Stay Connected</p>
          <div className="flex space-x-3">
            <a href="https://www.instagram.com/fifalavida.x" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              Instagram
            </a>
            {/* YouTube placeholder for future integration */}
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">YouTube</span>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-4 border-t">
        &copy; {new Date().getFullYear()} FIFA La Vida. All rights reserved.
      </div>
    </footer>
  );
}