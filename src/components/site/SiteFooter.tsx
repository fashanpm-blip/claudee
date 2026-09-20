import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#faf7f2]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div>
          <div
            className="text-lg font-semibold tracking-tight text-black"
            style={{ fontFamily: "var(--font-tight)", letterSpacing: "-0.03em" }}
          >
            PRMPT
          </div>
          <p className="mt-2 max-w-xs text-sm text-black/60">
            AI style assistant &amp; archive fashion collection.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <span className="text-black/40 uppercase tracking-wide">Site</span>
            <Link to="/" className="text-black/70 hover:text-black">Home</Link>
            <Link to="/chat" className="text-black/70 hover:text-black">AI Stylist</Link>
            <Link to="/lookbook" className="text-black/70 hover:text-black">Lookbook</Link>
            <Link to="/about" className="text-black/70 hover:text-black">About</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-black/40 uppercase tracking-wide">Contact</span>
            <a href="mailto:hello@prmpt.style" className="text-black/70 hover:text-black">
              hello@prmpt.style
            </a>
            <a href="#" className="text-black/70 hover:text-black">Instagram</a>
            <a href="#" className="text-black/70 hover:text-black">TikTok</a>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10 px-5 py-4 text-center text-xs text-black/40 sm:px-8">
        PRMPT (R) 2026 — All rights reserved
      </div>
    </footer>
  );
}
