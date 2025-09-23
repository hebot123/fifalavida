import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-black">
            <span className="text-[#00FF66]">🔥</span> FIFA La Vida
          </span>
        </div>
        <div className="hidden md:flex space-x-6 text-lg">
          <Link href="#matches" className="hover:text-[#00FF66] transition-colors">Matches</Link>
          <Link href="#news" className="hover:text-[#00FF66] transition-colors">News</Link>
          <Link href="#collectables" className="hover:text-[#00FF66] transition-colors">Collectables</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
