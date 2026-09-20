import { forwardRef } from "react";
import PortraitSilhouette from "../site/PortraitSilhouette";

export const GALLERY_IMAGES = [
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png&w=1920&q=85",
];

type Cell = { imgIndex: number } | null;

export function buildLayout(count: number, cols: number): Cell[] {
  const cells: Cell[] = [];
  let placed = 0;
  let r = 0;
  while (placed < count) {
    const row: Cell[] = new Array(cols).fill(null);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = { imgIndex: placed };
    placed++;
    if (placed < count && r % 3 === 0) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      if (row[b] === null) {
        row[b] = { imgIndex: placed };
        placed++;
      }
    }
    cells.push(...row);
    r++;
    if (r > count * 4) break; // safety guard
  }
  return cells;
}

type GalleryPanelProps = {
  cols: number;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  registerCard: (key: string, el: HTMLDivElement | null) => void;
};

export const GalleryPanel = forwardRef<HTMLDivElement, GalleryPanelProps>(
  function GalleryPanel({ cols, wrapperRef, registerCard }, panelRef) {
    const cells = buildLayout(GALLERY_IMAGES.length, cols);

    return (
      <div
        ref={panelRef}
        className="fixed inset-0 z-10 bg-black"
        style={{ transform: "translateY(100vh)" }}
      >
        <div
          ref={wrapperRef}
          className="w-full"
          style={{ paddingTop: "min(400px, 40vh)", paddingBottom: "10vh" }}
        >
          <div
            key={cols}
            className="grid gap-3 px-3 sm:gap-4 sm:px-6"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {cells.map((cell, i) => {
              const col = i % cols;
              const origin = col < cols / 2 ? "right bottom" : "left bottom";
              if (!cell) {
                return <div key={i} style={{ aspectRatio: "2 / 3" }} />;
              }
              const src = GALLERY_IMAGES[cell.imgIndex % GALLERY_IMAGES.length];
              return (
                <div
                  key={i}
                  ref={(el) => registerCard(`${cols}-${i}`, el)}
                  className="bp-card relative overflow-hidden"
                  style={{
                    aspectRatio: "2 / 3",
                    transform: "scale(0)",
                    transformOrigin: origin,
                  }}
                >
                  <PortraitSilhouette
                    index={cell.imgIndex}
                    className="absolute inset-0 h-full w-full"
                  />
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);
