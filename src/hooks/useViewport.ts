import { useEffect, useState } from "react";

export type Viewport = {
  width: number;
  isMobile: boolean; // < 640
  isTablet: boolean; // 640 - 1024
  isDesktop: boolean; // >= 1024
  cols: number;
};

function computeViewport(): Viewport {
  const width = typeof window === "undefined" ? 1280 : window.innerWidth;
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;
  const cols = isMobile ? 2 : isTablet ? 3 : 4;
  return { width, isMobile, isTablet, isDesktop, cols };
}

export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(computeViewport);

  useEffect(() => {
    const onResize = () => setViewport(computeViewport());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return viewport;
}

export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const touch =
      "ontouchstart" in window || (navigator.maxTouchPoints ?? 0) > 0;
    setIsTouch(touch);
  }, []);
  return isTouch;
}
