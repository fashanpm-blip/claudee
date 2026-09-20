import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "AI Stylist" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/about", label: "About" },
];

export default function SiteNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[#faf7f2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="font-semibold tracking-tight text-black"
          style={{ fontFamily: "var(--font-tight)", fontSize: 20, letterSpacing: "-0.03em" }}
          onClick={() => setOpen(false)}
        >
          PRMPT
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`whitespace-nowrap text-sm uppercase tracking-wide transition-colors ${
                pathname === link.to ? "text-black" : "text-black/50 hover:text-black"
              }`}
              style={{ fontFamily: "var(--font-tight)", fontWeight: 500 }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden"
          aria-label="Меню"
          aria-expanded={open}
        >
          <span
            className="h-px w-5 bg-black transition-transform"
            style={open ? { transform: "translateY(3px) rotate(45deg)" } : undefined}
          />
          <span
            className="h-px w-5 bg-black transition-transform"
            style={open ? { transform: "translateY(-3px) rotate(-45deg)" } : undefined}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-black/10 bg-[#faf7f2] px-5 py-3 sm:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`py-2.5 text-sm uppercase tracking-wide ${
                pathname === link.to ? "text-black" : "text-black/50"
              }`}
              style={{ fontFamily: "var(--font-tight)", fontWeight: 500 }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
