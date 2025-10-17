import { useEffect, useState, useCallback } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import NewLogo from "../../Graphics/Badge/Badge.png";
import RguktLogo from "../../Graphics/rgukt_logo.png";
import { useAuth } from "@/components/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// -----------------------------
// Navigation model (outside component to avoid re-creation)
// -----------------------------

const NAVIGATION = [
  { name: "Home", href: "/" },
  {
    name: "Programs",
    dropdown: [
      { name: "Schedule", href: "/schedule" },
      { name: "Workshops", href: "/workshops" },
      { name: "Hackathon", href: "/hackathon" },
      { name: "Ambassadors", href: "/ambassadors" },
      { name: "Apply as Ambassador", href: "/ambassador" },
      { name: "Guest Speaker", href: "/guest-speaker" },
    ],
  },
  {
    name: "Resources",
    dropdown: [
      { name: "Speakers", href: "/speakers" },
      { name: "Materials", href: "/materials" },
    ],
  },
  { name: "Sponsors", href: "/sponsors" },
  { name: "Our Team", href: "/team" },
  { name: "Supporters", href: "/supporters" },
  { name: "Refer", href: "/refer" },
  {
    name: "About Us",
    dropdown: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

// Utility check
const hasDropdown = (item) => item && item.dropdown !== undefined;

// -----------------------------
// Component
// -----------------------------

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  const location = useLocation();
  const { user, signOut } = useAuth();

  // Scroll state (for blurred background with border)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileDropdown(null);
    setOpenDesktopDropdown(null);
  }, [location.pathname]);

  // Close any open dropdowns with Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenDesktopDropdown(null);
        setOpenMobileDropdown(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  const headerClasses =
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300" +
    (isScrolled
      ? " bg-background/80 shadow-lg backdrop-blur-md border-b border-white/10"
      : " bg-transparent");

  // Animation presets
  const ddMotion = {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 },
    transition: { duration: 0.16 },
  };

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logos */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.rgukt.in"
              className="flex items-center space-x-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RGUKT official website"
            >
              <img src={RguktLogo} alt="RGUKT logo" className="h-10 w-auto" />
            </a>
            <a
              href="/"
              className="flex items-center space-x-2"
              rel="noopener noreferrer"
              aria-label="RGUKT official website"
            >
              <img
                src={NewLogo}
                alt="Qiskit Fall Fest logo"
                className="h-10 w-auto"
              />

              <span className="text-lg font-bold">Qiskit Fall Fest '25</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-8"
            aria-label="Main navigation"
          >
            {NAVIGATION.map((item) =>
              hasDropdown(item) ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setOpenDesktopDropdown(item.name)}
                  onMouseLeave={() => setOpenDesktopDropdown(null)}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={openDesktopDropdown === item.name}
                    onClick={() =>
                      setOpenDesktopDropdown((prev) =>
                        prev === item.name ? null : item.name
                      )
                    }
                    className="flex items-center gap-1 text-sm font-medium text-white hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md px-1 py-0.5"
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openDesktopDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDesktopDropdown === item.name && (
                      <motion.div
                        {...ddMotion}
                        role="menu"
                        aria-label={`${item.name} submenu`}
                        className="absolute left-0 mt-2 min-w-[220px] bg-white/10 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-50 pt-2"
                      >
                        {item.dropdown.map((sub) => (
                          <NavLink
                            key={sub.name}
                            to={sub.href}
                            onClick={() => setOpenDesktopDropdown(null)}
                            className={({ isActive }) =>
                              `block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary ${
                                isActive ? "text-primary" : "text-white"
                              }`
                            }
                            role="menuitem"
                          >
                            {sub.name}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `text-sm font-medium ${
                      isActive
                        ? "text-primary"
                        : "text-white hover:text-primary"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              )
            )}
          </nav>

          {/* Actions (desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/register"
              className="btn-quantum px-4 py-2 text-primary-foreground rounded-lg shadow-md relative group animate-pulse-glow"
            >
              <span className="relative z-10">Register</span>
              <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="btn-quantum px-4 py-2 text-primary-foreground rounded-lg shadow-md relative group animate-pulse-glow flex items-center gap-2"
                    aria-label="Account menu"
                  >
                    <User className="h-4 w-4" />
                    <span className="relative z-10">Account</span>
                    <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="btn-quantum px-4 py-2 text-primary-foreground rounded-lg shadow-md relative group animate-pulse-glow"
              >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 rounded-full glass-card border border-white/20 hover:border-primary/50 shadow-md relative group"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <span className="relative z-10 text-primary">
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </span>
            <span className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-30 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-background border-t border-white/10 shadow-lg"
          >
            <nav
              className="flex flex-col space-y-4 p-4"
              aria-label="Mobile navigation"
            >
              {NAVIGATION.map((item) =>
                hasDropdown(item) ? (
                  <div key={item.name} className="relative">
                    <button
                      onClick={() =>
                        setOpenMobileDropdown((prev) =>
                          prev === item.name ? null : item.name
                        )
                      }
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary"
                      aria-expanded={openMobileDropdown === item.name}
                      aria-controls={`mobile-dd-${item.name}`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openMobileDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {openMobileDropdown === item.name && (
                        <motion.div
                          id={`mobile-dd-${item.name}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-4"
                        >
                          {item.dropdown.map((sub) => (
                            <NavLink
                              key={sub.name}
                              to={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className={({ isActive }) =>
                                `block px-3 py-2 text-sm hover:bg-primary/10 hover:text-primary ${
                                  isActive
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`
                              }
                            >
                              {sub.name}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm font-medium ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                )
              )}

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full btn-quantum px-3 py-2 text-primary-foreground rounded-lg shadow-md relative group animate-pulse-glow text-center"
              >
                <span className="relative z-10">Register</span>
                <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>

              {user ? (
                <div className="space-y-2">
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:bg-primary/10 hover:text-primary rounded-lg">
                      <User className="h-4 w-4" />
                      My Profile
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full btn-quantum px-3 py-2 text-primary-foreground rounded-lg shadow-md relative group animate-pulse-glow text-center"
                >
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
