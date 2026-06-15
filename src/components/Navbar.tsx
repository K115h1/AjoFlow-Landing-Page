import { useEffect, useState } from "react";
import { Link } from "react-router";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg shadow-black/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-black/80 to-purple-400 flex items-center justify-center shadow-md shadow--300/40 group-hover:scale-110 transition-transform duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 3C7 3 4 6 4 10C4 13.31 6.69 16 10 16C11.32 16 12.55 15.56 13.54 14.83L19.41 20.7L20.83 19.29L14.96 13.42C15.61 12.48 16 11.29 16 10C16 6 13 3 13 3H7Z"
                fill="white"
              />
              <circle cx="10" cy="10" r="3" fill="rgba(255,150,50,0.6)" />
            </svg>
          </div>
          <span
            className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            Code<span className="text--400">Canvas</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-medium transition-colors duration-300 hover:text--400 ${
                scrolled ? "text-gray-600" : "text-white/80"
              }`}
            >
              {item.label}
            </a>
            
          ))}
          <Link to="/contact">
          <a
              key={"contact"}
              href={"#"}
              className={`text-sm font-medium transition-colors duration-300 hover:text--400 ${
                scrolled ? "text-gray-600" : "text-white/80"
              }`}
            >
              Contact
            </a></Link>
        </nav>

        {/* CTA Buttons */}
        

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
              scrolled ? "bg-gray-800" : "bg-white"
            } ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
              scrolled ? "bg-gray-800" : "bg-white"
            } ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
              scrolled ? "bg-gray-800" : "bg-white"
            } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 font-medium py-2 border-b border-gray-100 hover:text--500 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <a
              href="#login"
              className="text-center text-gray-700 font-medium py-2.5 rounded-full border border-gray-200 hover:border--300 transition-all"
            >
              Log In
            </a>
            <a
              href="#signup"
              className="text-center font-semibold py-2.5 rounded-full bg-linear-to-r from-black/80 to-purple-400 text-white shadow-md"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
