import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold tracking-wide text-blue-600">
            FIFA La Vida
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm">
            <Link href="/updates" className="hover:text-blue-600">
              Updates
            </Link>
            <Link href="/blog" className="hover:text-blue-600">
              Blog
            </Link>
            <Link href="/about" className="hover:text-blue-600">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://collect.fifa.com/?referrer=fifalavida"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Start Collecting
          </a>
        </div>
      </div>
    </header>
  );
}