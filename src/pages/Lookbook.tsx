import { useMemo, useState } from "react";
import SiteNav from "../components/site/SiteNav";
import SiteFooter from "../components/site/SiteFooter";
import { GALLERY_IMAGES } from "../components/landing/GalleryPanel";
import PortraitSilhouette from "../components/site/PortraitSilhouette";

type Category = "casual" | "business" | "evening";
type Season = "summer" | "winter" | "demi";
type Budget = "$" | "$$" | "$$$";

type Look = {
  id: number;
  src: string;
  title: string;
  category: Category;
  season: Season;
  budget: Budget;
  tip: string;
};

const CATEGORIES: Category[] = ["casual", "business", "evening"];
const SEASONS: Season[] = ["summer", "winter", "demi"];
const BUDGETS: Budget[] = ["$", "$$", "$$$"];

const TIPS = [
  "Нейтральна база + один акцентний шар зверху — працює для будь-якої фігури.",
  "Структурований верх урівноважує вільний низ — і навпаки.",
  "Один темний та один світлий тон поруч додають образу глибини без зусиль.",
  "Аксесуар одного кольору з взуттям візуально «закриває» образ.",
  "Шар, який можна зняти — це гнучкість для перепадів температури і настрою.",
  "Фактура (трикотаж, шкіра, вовна) додає інтересу навіть монохромному образу.",
  "Довжина рукава чи низу, підігнана під зріст, змінює сприйняття сильніше за колір.",
  "Один яскравий елемент читається як стиль, три — як випадковість.",
  "Класичний крій + сучасна деталь (взуття, сумка) — образ одразу не застарілий.",
  "Пряма лінія плеча дисциплінує будь-який вільний силует знизу.",
];

const LOOKS: Look[] = GALLERY_IMAGES.map((src, i) => ({
  id: i,
  src,
  title: `Look ${String(i + 1).padStart(2, "0")}`,
  category: CATEGORIES[i % CATEGORIES.length],
  season: SEASONS[Math.floor(i / 3) % SEASONS.length],
  budget: BUDGETS[i % BUDGETS.length],
  tip: TIPS[i % TIPS.length],
}));

const CATEGORY_LABEL: Record<Category, string> = {
  casual: "Повсякденне",
  business: "Ділове",
  evening: "Вечірнє",
};

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  labels,
}: {
  label: string;
  options: T[];
  value: T | "all";
  onChange: (v: T | "all") => void;
  labels?: Record<T, string>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wide text-black/40">{label}</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
            value === "all"
              ? "border-black bg-black text-white"
              : "border-black/15 text-black/60 hover:border-black"
          }`}
        >
          Усі
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              value === opt
                ? "border-black bg-black text-white"
                : "border-black/15 text-black/60 hover:border-black"
            }`}
          >
            {labels ? labels[opt] : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Lookbook() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [season, setSeason] = useState<Season | "all">("all");
  const [budget, setBudget] = useState<Budget | "all">("all");

  const filtered = useMemo(
    () =>
      LOOKS.filter(
        (l) =>
          (category === "all" || l.category === category) &&
          (season === "all" || l.season === season) &&
          (budget === "all" || l.budget === budget)
      ),
    [category, season, budget]
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#faf7f2]">
      <SiteNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
        <h1
          className="text-3xl font-semibold text-black"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Lookbook
        </h1>
        <p className="mt-2 max-w-xl text-black/60">
          Архівна колекція образів. Кожен лук — з поясненням, чому саме ця
          комбінація працює. Фільтруй за поводом, сезоном та бюджетом — або
          опиши свій запит AI-стилісту у чаті.
        </p>

        <div className="mt-8 flex flex-wrap gap-8 border-b border-black/10 pb-8">
          <FilterGroup
            label="Привід"
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
            labels={CATEGORY_LABEL}
          />
          <FilterGroup label="Сезон" options={SEASONS} value={season} onChange={setSeason} />
          <FilterGroup label="Бюджет" options={BUDGETS} value={budget} onChange={setBudget} />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((look) => (
            <div key={look.id} className="group">
              <div
                className="relative overflow-hidden rounded-xl bg-black/5"
                style={{ aspectRatio: "2 / 3" }}
              >
                <PortraitSilhouette
                  index={look.id}
                  className="absolute inset-0 h-full w-full"
                />
                <img
                  src={look.src}
                  alt={look.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-medium text-black">{look.title}</span>
                <span className="text-black/40">{look.budget}</span>
              </div>
              <span className="text-xs text-black/40">
                {CATEGORY_LABEL[look.category]} · {look.season}
              </span>
              <p className="mt-1 text-xs leading-relaxed text-black/50">{look.tip}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-16 text-center text-black/40">
              Нічого не знайдено — спробуй інші фільтри.
            </p>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
