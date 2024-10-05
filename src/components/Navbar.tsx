import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-xl font-bold text-gray-800">
              VotreLogo
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="#features" className="text-gray-800 hover:text-blue-500">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="text-gray-800 hover:text-blue-500">
              Tarifs
            </Link>
            <Link href="#contact" className="text-gray-800 hover:text-blue-500">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;