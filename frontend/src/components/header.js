import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../pages/assets/image.png"; 
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow bg-white/90 backdrop-blur" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo + Titre */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo Djezzy" className="h-8 w-auto" />
            <Link to="/" className="text-[#E20010] text-2xl font-bold">
              Djezzy KPI
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-[#E20010] hover:text-red-700 transition">
                <span>Monitoring</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link to="/kpi" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  KPI
                </Link>
              </div>
            </div>

            <Link to="/alerts" className="text-[#E20010] hover:text-red-700">Alertes</Link>
            <Link to="/report" className="text-[#E20010] hover:text-red-700">Rapports</Link>
            <Link to="/profile" className="bg-[#E20010] text-white px-4 py-2 rounded hover:bg-red-700 font-semibold">
              Mon Espace
            </Link>
          </div>

          {/* Menu Mobile */}
          <button
            className="text-[#E20010] md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Navigation Mobile */}
        {isOpen && (
          <div className="bg-white rounded shadow mt-4 md:hidden">
            <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
            <Link to="/kpi" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">KPI</Link>
            <Link to="/alerts" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Alertes</Link>
            <Link to="/report" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Rapports</Link>
            <Link to="/profile" className="block px-4 py-2 text-[#E20010] font-semibold hover:bg-gray-100">Mon Espace</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;