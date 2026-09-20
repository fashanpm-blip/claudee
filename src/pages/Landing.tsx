import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useViewport } from "../hooks/useViewport";
import { LogoMark, HamburgerIcon, CursorGlyph } from "../components/landing/icons";
import { VideoCanvas } from "../components/landing/VideoCanvas";
import { GalleryPanel } from "../components/landing/GalleryPanel";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const SYMBOLS = ["8", "$", "^^", "%", "/"];

export default function Landing() {
  const { isMobile, isTablet, isDesktop, cols } = useViewport();

  const spacerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const outroInfoRef = useRef<HTMLDivElement>(null);
  const outroBuyRef = useRef<HTMLAnchorElement>(null);
  const outroOverlayRef = useRef<HTMLDivElement>(null);
  const outroFooterRef = useRef<HTMLDivElement>(null);
  const circleSymbolRef = useRef<HTMLSpanElement>(null);
  const cardMapRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const [circleSymbol, setCircleSymbol] = useState("8");

  const registerCard = (key: string, el: HTMLDivElement | null) => {
    if (el) cardMapRef.current.set(key, el);
    else cardMapRef.current.delete(key);
  };

  const outroOffset = isMobile ? 132 : 166;
  const [menuOpen, setMenuOpen] = useState(false);

  // Custom cursor (desktop only)
  useEffect(() => {
    if (!isDesktop) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    const onMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isDesktop]);

  // Circle symbol randomizer on scroll, throttled 80ms
  useEffect(() => {
    let lastTime = 0;
    const onScroll = () => {
      const now = performance.now();
      if (now - lastTime < 80) return;
      lastTime = now;
      setCircleSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Spacer height calculation
  useEffect(() => {
    const setSpacerHeight = () => {
      const vh = window.innerHeight;
      const wrapper = wrapperRef.current;
      if (!spacerRef.current || !wrapper) return;
      const wrapScrollHeight = wrapper.scrollHeight;
      const maxScroll = Math.max(0, wrapScrollHeight - vh);
      spacerRef.current.style.height = `${vh + maxScroll + 2 * vh}px`;
    };
    setSpacerHeight();
    const ro = new ResizeObserver(setSpacerHeight);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener("resize", setSpacerHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setSpacerHeight);
    };
  }, [cols]);

  // Master RAF scroll loop: panel slide, card scale, outro phase
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const wrapper = wrapperRef.current;
      const panel = panelRef.current;
      if (!wrapper || !panel) return;

      const wrapScrollHeight = wrapper.scrollHeight;
      const maxScroll = Math.max(0, wrapScrollHeight - vh);

      // Phase 1 vs Phase 2: panel slide + inner wrapper scroll
      if (scrollY <= vh) {
        const panelOffset = vh - scrollY;
        panel.style.transform = `translateY(${panelOffset}px)`;
        wrapper.style.transform = "translateY(0px)";
      } else {
        panel.style.transform = "translateY(0px)";
        const innerScroll = Math.min(scrollY - vh, maxScroll);
        wrapper.style.transform = `translateY(${-innerScroll}px)`;
      }

      // Card scale based on real viewport position
      cardMapRef.current.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= vh) {
          card.style.transform = "scale(0)";
          return;
        }
        const enter = Math.min(1, (vh - rect.top) / (vh * 0.6));
        const exit = Math.min(1, rect.bottom / (vh * 0.4));
        const scale = Math.max(0, Math.min(enter, exit));
        card.style.transform = `scale(${scale})`;
      });

      // Video canvas visibility
      if (canvasRef.current) {
        canvasRef.current.style.visibility =
          scrollY > vh ? "hidden" : "visible";
      }

      // Outro phase
      const outroStart = vh + maxScroll;
      if (scrollY > outroStart) {
        const progress = Math.max(
          0,
          Math.min(1, (scrollY - outroStart) / (vh - 100))
        );
        if (outroOverlayRef.current) {
          outroOverlayRef.current.style.opacity = `${progress}`;
        }
        if (outroInfoRef.current) {
          outroInfoRef.current.style.transform = `translateY(${
            -outroOffset * progress
          }px)`;
        }
        if (outroBuyRef.current) {
          outroBuyRef.current.style.transform = `scale(${progress})`;
        }
        if (outroFooterRef.current) {
          outroFooterRef.current.style.opacity = `${progress}`;
        }
      } else {
        if (outroOverlayRef.current) outroOverlayRef.current.style.opacity = "0";
        if (outroInfoRef.current) outroInfoRef.current.style.transform = "translateY(0px)";
        if (outroBuyRef.current) outroBuyRef.current.style.transform = "scale(0)";
        if (outroFooterRef.current) outroFooterRef.current.style.opacity = "0";
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [outroOffset, cols]);

  return (
    <div
      id="scroll-spacer"
      ref={spacerRef}
      style={{
        position: "relative",
        userSelect: "none",
        background: "#fff",
        height: "500vh",
        cursor: isDesktop ? "none" : "auto",
      }}
    >
      {/* Custom cursor */}
      {isDesktop && (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed z-50"
          style={{
            left: 0,
            top: 0,
            transform: "translate(-50%, -50%)",
            mixBlendMode: "exclusion",
          }}
        >
          <CursorGlyph />
        </div>
      )}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0 }}
        className="pointer-events-none fixed z-20"
        style={{
          mixBlendMode: "exclusion",
          top: isMobile ? 16 : 32,
          left: isMobile ? 16 : 32,
          width: isMobile ? 124 : isTablet ? 266 : 355,
        }}
      >
        <LogoMark className="w-full" />
      </motion.div>

      {/* Header nav */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        className="pointer-events-none fixed z-20 flex items-center justify-between"
        style={{
          mixBlendMode: "exclusion",
          top: isMobile ? 16 : 32,
          right: isMobile ? 16 : 32,
          width: isMobile ? "auto" : 330,
          height: 30,
        }}
      >
        {!isMobile && (
          <Link
            to="/about"
            className="pointer-events-auto"
            style={{
              fontFamily: "var(--font-tight)",
              fontWeight: 500,
              fontSize: 15,
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            ABOUT
          </Link>
        )}
        <div
          className="flex items-center"
          style={{ gap: isMobile ? 20 : 50 }}
        >
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="pointer-events-auto cursor-pointer border-0 bg-transparent p-0"
            aria-label="Menu"
          >
            <HamburgerIcon
              className={isMobile ? "h-6 w-6" : "h-[30px] w-[30px]"}
            />
          </button>
          <Link
            to="/lookbook"
            className="pointer-events-auto"
            style={{
              fontFamily: "var(--font-tight)",
              fontWeight: 500,
              fontSize: isMobile ? 13 : 15,
              color: "#fff",
            }}
          >
            [ CART ]
          </Link>
        </div>
      </motion.div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-black/95"
          onClick={() => setMenuOpen(false)}
        >
          {[
            { to: "/", label: "Home" },
            { to: "/chat", label: "AI Stylist Chat" },
            { to: "/lookbook", label: "Lookbook" },
            { to: "/about", label: "About" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-3xl uppercase tracking-tight text-white"
              style={{ fontFamily: "var(--font-tight)", fontWeight: 500 }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
        className="pointer-events-none fixed z-20"
        style={{
          mixBlendMode: "exclusion",
          left: isMobile ? 16 : 32,
          top: isMobile ? 118 : isTablet ? 180 : 244,
          width: isMobile
            ? "calc(100vw - 32px)"
            : isTablet
            ? "calc(50vw - 48px)"
            : 692,
          fontFamily: "var(--font-tight)",
          fontWeight: 500,
          fontSize: 12,
          lineHeight: "140%",
          letterSpacing: "-0.04em",
          color: "#fff",
        }}
      >
        When switching between videos near the center, do not reset
        currentTime to 0 abruptly. Add a small dead zone: if cursor is
        within +/-50px of center, keep both videos at currentTime = 0 and
        show whichever was last active.
      </motion.div>

      {/* Video canvas */}
      <VideoCanvas ref={canvasRef} isDesktop={isDesktop} isMobile={isMobile} />

      {/* Product info (bottom right / bottom center mobile) */}
      <motion.div
        ref={outroInfoRef}
        id="outro-info"
        data-outro-offset={outroOffset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
        className="pointer-events-none fixed z-20 flex flex-col items-center"
        style={
          isMobile
            ? {
                mixBlendMode: "exclusion",
                left: 0,
                right: 0,
                bottom: 48,
              }
            : {
                mixBlendMode: "exclusion",
                right: 32,
                bottom: 80,
                width: 330,
              }
        }
      >
        <div
          className="flex flex-col items-start"
          style={{
            width: isMobile ? 252 : "100%",
            marginBottom: isMobile ? 12 : 32,
          }}
        >
          <div
            className="relative flex items-center justify-center"
            style={{ width: isMobile ? 20 : 30, height: isMobile ? 20 : 30 }}
          >
            <svg
              viewBox="0 0 40 40"
              className="absolute inset-0 h-full w-full"
            >
              <circle
                cx="20"
                cy="20"
                r="18.75"
                stroke="#fff"
                strokeWidth={isMobile ? 2 : 2.5}
                fill="none"
              />
            </svg>
            <span
              id="circle-symbol"
              ref={circleSymbolRef}
              style={{
                fontFamily: "var(--font-tight)",
                fontWeight: 500,
                fontSize: isMobile ? 10 : 15,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              {circleSymbol}
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-tight)",
              fontWeight: 500,
              fontSize: isMobile ? 20 : 30,
              lineHeight: "100%",
              textAlign: "center",
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            ARCHIVE COLLECTION
            <br />
            &quot;PROMPT&quot;
          </div>
        </div>
        <div
          style={{
            fontFamily: "var(--font-tight)",
            fontWeight: 500,
            fontSize: isMobile ? 60 : 80,
            lineHeight: "100%",
            textAlign: "center",
            letterSpacing: "-0.04em",
            color: "#fff",
          }}
        >
          $97,33
        </div>
      </motion.div>

      {/* View button */}
      <Link
        to="/lookbook"
        ref={outroBuyRef}
        id="outro-buy"
        className="pointer-events-auto fixed z-20 flex items-center justify-center"
        style={
          isMobile
            ? {
                mixBlendMode: "exclusion",
                left: 16,
                right: 16,
                bottom: 60,
                height: 100,
                transformOrigin: "right bottom",
                transform: "scale(0)",
                background: "#fff",
                borderRadius: 1335,
              }
            : {
                mixBlendMode: "exclusion",
                right: 32,
                bottom: 32,
                width: 330,
                height: 174,
                transformOrigin: "right bottom",
                transform: "scale(0)",
                background: "#fff",
                borderRadius: 1335,
              }
        }
      >
        <span
          style={{
            fontFamily: "var(--font-tight)",
            fontWeight: 500,
            fontSize: isMobile ? 72 : 110,
            letterSpacing: "-0.04em",
            color: "#fff",
            mixBlendMode: "exclusion",
          }}
        >
          view
        </span>
      </Link>

      {/* White overlay */}
      <div
        ref={outroOverlayRef}
        id="outro-overlay"
        className="pointer-events-none fixed inset-0 z-[12]"
        style={{ background: "#fff", opacity: 0 }}
      />

      {/* Footer */}
      <div
        ref={outroFooterRef}
        id="outro-footer"
        className="pointer-events-none fixed flex"
        style={{
          left: 16,
          bottom: isMobile ? 24 : 32,
          mixBlendMode: "exclusion",
          opacity: 0,
          gap: isMobile ? undefined : 80,
          justifyContent: isMobile ? "space-between" : undefined,
          width: isMobile ? "calc(100vw - 32px)" : undefined,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-tight)",
            fontWeight: 500,
            fontSize: isMobile ? 11 : 13,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "#fff",
          }}
        >
          PRMPT (R) 2026
        </span>
        <span
          style={{
            fontFamily: "var(--font-tight)",
            fontWeight: 500,
            fontSize: isMobile ? 11 : 13,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "#fff",
          }}
        >
          PRIVACY POLICY
        </span>
      </div>

      {/* Black gallery panel */}
      <GalleryPanel
        ref={panelRef}
        cols={cols}
        wrapperRef={wrapperRef}
        registerCard={registerCard}
      />

    </div>
  );
}
