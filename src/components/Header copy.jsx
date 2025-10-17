import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import NewLogo from "../../Graphics/Badge/Badge.png";
import RguktLogo from "../../Graphics/rgukt_logo.png";
import { useAuth } from "@/components/AuthProvider";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDesktopDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Schedule", href: "/schedule" },
    {
      name: "About Us",
      dropdown: [
        { name: "About Qiskit", href: "/about" },
        { name: "Our Team", href: "/team" },
      ],
    },

    {
      name: "Programs",
      dropdown: [
        { name: "About Qiskit", href: "/workshops" },
        { name: "Our Team", href: "/hackathon" },
      ],
    },
    {
      name: "Events",
      dropdown: [
        { name: "Workshops", href: "/workshops" },
        { name: "Hackathon", href: "/hackathon" },
      ],
    },
    { name: "Speakers", href: "/speakers" },

    { name: "Materials", href: "/materials" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Contact", href: "/contact" },
    { name: "Team", href: "/team" },
    { name: "Supportors", href: "/supportors" },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 shadow-lg backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={RguktLogo}
              alt="Qiskit Fall Fest Logo"
              className="h-10 w-auto"
            />
            <img
              src={NewLogo}
              alt="Qiskit Fall Fest Logo"
              className="h-10 w-auto"
            />
            <span className="text-lg font-bold">Qiskit Fall Fest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDesktopDropdownOpen((prev) => !prev)}
                    className="text-sm font-medium hover:text-primary focus:outline-none"
                  >
                    {item.name}
                  </button>
                  {isDesktopDropdownOpen && (
                    <div className="absolute left-0 mt-2 bg-background border border-white/10 rounded-lg shadow-lg">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          onClick={() => setIsDesktopDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/register">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Register
              </button>
            </Link>
            {user ? (
              <button
                onClick={signOut}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/90"
              >
                Sign Out
              </button>
            ) : (
              <Link to="/login">
                {/* <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/90">
                  Sign In
                </button> */}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-background hover:bg-background/90"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden bg-background border-t border-white/10 shadow-lg"
        >
          <nav className="flex flex-col space-y-4 p-4">
            {navigation.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="relative">
                  <button
                    onClick={() =>
                      setIsDropdownOpen((prev) =>
                        prev === item.name ? null : item.name
                      )
                    }
                    className="text-left w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary"
                  >
                    {item.name}
                  </button>
                  {isDropdownOpen === item.name && (
                    <div className="pl-4">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Register
              </button>
            </Link>
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/90"
              >
                Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/90">
                  Sign In
                </button>
              </Link>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
