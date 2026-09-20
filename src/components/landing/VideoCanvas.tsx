import { forwardRef, useEffect, useRef, useState } from "react";

const LEFT_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4";
const RIGHT_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4";

type VideoCanvasProps = {
  isDesktop: boolean;
  isMobile: boolean;
};

export const VideoCanvas = forwardRef<HTMLDivElement, VideoCanvasProps>(
  function VideoCanvas({ isDesktop, isMobile }, containerRef) {
    const leftRef = useRef<HTMLVideoElement>(null);
    const rightRef = useRef<HTMLVideoElement>(null);
    const [loadedLeft, setLoadedLeft] = useState(false);
    const [loadedRight, setLoadedRight] = useState(false);
    const activeSideRef = useRef<"left" | "right">("right");
    const mouseXRef = useRef<number | null>(null);
    const rafRef = useRef<number>(0);

    const bothLoaded = loadedLeft && loadedRight;

    // Desktop: cursor-driven scrubbing
    useEffect(() => {
      if (!isDesktop) return;
      const onMove = (e: MouseEvent) => {
        mouseXRef.current = e.clientX;
      };
      window.addEventListener("mousemove", onMove);

      const tick = () => {
        rafRef.current = requestAnimationFrame(tick);
        const container = (containerRef as React.RefObject<HTMLDivElement>)
          ?.current;
        const left = leftRef.current;
        const right = rightRef.current;
        if (!container || !left || !right || mouseXRef.current === null)
          return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const deadZone = Math.max(30, rect.width * 0.05);
        const mouseX = mouseXRef.current;
        const dx = mouseX - centerX;

        if (Math.abs(dx) <= deadZone) {
          const activeVideo =
            activeSideRef.current === "left" ? left : right;
          if (!activeVideo.seeking && activeVideo.currentTime !== 0) {
            activeVideo.currentTime = 0;
          }
        } else if (dx < -deadZone) {
          activeSideRef.current = "right";
          const edge = centerX - deadZone;
          const available = Math.max(1, edge - rect.left);
          const dist = edge - mouseX;
          const progress = Math.min(1, Math.max(0, dist / available));
          if (right.duration && !right.seeking) {
            right.currentTime = progress * right.duration;
          }
        } else {
          activeSideRef.current = "left";
          const edge = centerX + deadZone;
          const available = Math.max(1, rect.right - edge);
          const dist = mouseX - edge;
          const progress = Math.min(1, Math.max(0, dist / available));
          if (left.duration && !left.seeking) {
            left.currentTime = progress * left.duration;
          }
        }

        left.style.display = activeSideRef.current === "left" ? "block" : "none";
        right.style.display = activeSideRef.current === "right" ? "block" : "none";
      };
      rafRef.current = requestAnimationFrame(tick);

      return () => {
        window.removeEventListener("mousemove", onMove);
        cancelAnimationFrame(rafRef.current);
      };
    }, [isDesktop, containerRef]);

    // Touch: alternating autoplay
    useEffect(() => {
      if (isDesktop) return;
      const left = leftRef.current;
      const right = rightRef.current;
      if (!left || !right) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      left.style.display = "none";
      right.style.display = "block";
      activeSideRef.current = "right";

      if (reducedMotion) return;

      const playRight = () => {
        activeSideRef.current = "right";
        right.style.display = "block";
        left.style.display = "none";
        right.currentTime = 0;
        right.play().catch(() => {});
      };
      const playLeft = () => {
        activeSideRef.current = "left";
        left.style.display = "block";
        right.style.display = "none";
        left.currentTime = 0;
        left.play().catch(() => {});
      };

      const onRightEnded = () => playLeft();
      const onLeftEnded = () => playRight();

      right.addEventListener("ended", onRightEnded);
      left.addEventListener("ended", onLeftEnded);
      right.play().catch(() => {});

      return () => {
        right.removeEventListener("ended", onRightEnded);
        left.removeEventListener("ended", onLeftEnded);
      };
    }, [isDesktop]);

    return (
      <div
        id="main-canvas"
        ref={containerRef}
        className="pointer-events-none fixed overflow-hidden"
        style={
          isMobile
            ? {
                left: 0,
                top: 220,
                width: "100vw",
                height: "calc(100vh - 220px)",
                zIndex: 0,
                opacity: bothLoaded ? 1 : 0,
                transition: "opacity 0.3s ease",
              }
            : {
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                opacity: bothLoaded ? 1 : 0,
                transition: "opacity 0.3s ease",
              }
        }
      >
        <video
          ref={leftRef}
          src={LEFT_SRC}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setLoadedLeft(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ display: "none" }}
        />
        <video
          ref={rightRef}
          src={RIGHT_SRC}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setLoadedRight(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ display: "block" }}
        />
      </div>
    );
  }
);
