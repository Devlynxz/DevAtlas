import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  Moon,
  PenSquare,
  Search,
  Sun,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Logo from "./Logo";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/articles", label: "Articles" },
  { to: "/categories", label: "Categories" },
  { to: "/authors", label: "Authors" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim()) {
      navigate(`/articles?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue("");
      setMobileOpen(false);
    }
  };

  const linkClass = ({ isActive }) =>
    `group relative py-1 text-sm font-medium transition ${
      isActive
        ? "text-primary-600 dark:text-primary-400"
        : "text-ink-secondary hover:text-ink-primary dark:text-slate-300 dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo size={32} className="text-xl" />

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-primary-600 transition-transform duration-200 group-hover:scale-x-100 dark:bg-primary-400 ${
                      isActive ? "scale-x-100" : ""
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onBlur={() => !searchValue && setSearchOpen(false)}
                  placeholder="Search articles..."
                  className="w-48 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            <>
              <Button as={Link} to="/new-post" size="sm" className="hidden sm:inline-flex">
                <PenSquare className="h-3.5 w-3.5" /> Write
              </Button>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-label="User menu"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <Avatar src={user?.profile} name={user?.name} size="sm" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-ink-secondary hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-posts"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-ink-secondary hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      My Posts
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                        navigate("/");
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button as={Link} to="/register" size="sm">
                <User className="h-3.5 w-3.5" /> Register
              </Button>
            </div>
          )}

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 px-6 py-4 lg:hidden dark:border-slate-800">
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSearchSubmit} className="relative sm:hidden">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-full border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900"
              />
            </form>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Button as={Link} to="/login" variant="outline" size="sm" className="flex-1">
                  Login
                </Button>
                <Button as={Link} to="/register" size="sm" className="flex-1">
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
