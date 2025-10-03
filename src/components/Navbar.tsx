import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

/**
 * Minimal responsive Navbar
 * - Keeps your original linkClass and links unchanged
 * - Adds a small hamburger (mobile) that toggles a vertical dropdown
 * - Does not modify App.tsx
 */

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // close on Escape or route change (simple listener)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-purple-500/30"
    }`;

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          SolanaFun
        </Link>

        {/* Desktop links (original layout) */}
        <div className="hidden md:flex gap-2">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/tipjar" className={linkClass}>Tip Jar</NavLink>
          <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </div>

        {/* Mobile hamburger (keeps original links intact) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {open ? (
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown: minimal markup, same classes for links so styling remains identical */}
      <div
        className={`md:hidden transition-max-h duration-200 ease-in-out overflow-hidden ${
          open ? "max-h-screen" : "max-h-0"
        }`}
        aria-hidden={!open}
      >
        <div className="bg-black/60 backdrop-blur-md border-t border-white/10">
          <div className="flex flex-col px-4 py-3 space-y-2">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/tipjar" className={linkClass} onClick={() => setOpen(false)}>Tip Jar</NavLink>
            <NavLink to="/leaderboard" className={linkClass} onClick={() => setOpen(false)}>Leaderboard</NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
