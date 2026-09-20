import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "AI Stylist" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/about", label: "About" },
];

export default function SiteNav() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[#faf7f2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="font-semibold tracking-tight text-black"
          style={{ fontFamily: "var(--font-tight)", fontSize: 20, letterSpacing: "-0.03em" }}
        >
          PRMPT
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm uppercase tracking-wide transition-colors ${
                pathname === link.to
                  ? "text-black"
                  : "text-black/50 hover:text-black"
              }`}
              style={{ fontFamily: "var(--font-tight)", fontWeight: 500 }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
