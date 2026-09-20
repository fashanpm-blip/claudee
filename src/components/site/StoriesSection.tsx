import PortraitSilhouette from "./PortraitSilhouette";
import { STORIES } from "../../data/stories";

export default function StoriesSection() {
  return (
    <section>
      <h2
        className="text-2xl font-semibold text-black sm:text-3xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Історії стилю
      </h2>
      <p className="mt-2 max-w-2xl text-black/60">
        Типові запити людей, які працювали з AI-стилістом PRMPT: що вони
        хотіли змінити і яке рішення допомогло. Портрети — авторські
        ілюстрації студії PRMPT, історії — узагальнені кейси наших
        користувачів.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STORIES.map((story, i) => (
          <article
            key={story.name}
            className="overflow-hidden rounded-2xl border border-black/10 bg-white"
          >
            <PortraitSilhouette index={i} className="h-56 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <h3 className="text-base font-semibold text-black">{story.name}</h3>
                <span className="text-xs uppercase tracking-wide text-black/40">
                  {story.role}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-black/60">
                <span className="font-medium text-black/80">Хотіли змінити: </span>
                {story.wantedToChange}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/60">
                <span className="font-medium text-black/80">Що допомогло: </span>
                {story.whatChanged}
              </p>
              <p className="mt-3 rounded-lg bg-[#faf7f2] px-3 py-2 text-xs leading-relaxed text-black/70">
                {story.tip}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
