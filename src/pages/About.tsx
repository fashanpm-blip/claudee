import { Link } from "react-router-dom";
import SiteNav from "../components/site/SiteNav";
import SiteFooter from "../components/site/SiteFooter";
import StoriesSection from "../components/site/StoriesSection";
import PortraitSilhouette from "../components/site/PortraitSilhouette";

const PRINCIPLES = [
  {
    title: "Посадка важливіша за бренд",
    text: "Річ, що сидить по фігурі, завжди виглядає дорожче за велику чи затісну — незалежно від цінника. Перш ніж купувати нове, перевір, чи можна підшити те, що вже є.",
  },
  {
    title: "Три кольори — вже гардероб",
    text: "Обери один нейтральний (чорний, бежевий, сірий), один темний акцент і один яскравий. Усе, що ти купуєш, має поєднуватись хоча б із двома з них.",
  },
  {
    title: "Якість там, де контакт із тілом",
    text: "Взуття, верхній одяг і базова білизна — місця, де економити варто в останню чергу. Футболка на один сезон — це нормально, черевики на один сезон — ні.",
  },
  {
    title: "Один акцент, не п'ять",
    text: "Яскравий образ — це один сміливий елемент (колір, аксесуар, крій) на фоні спокійної бази. Коли яскраво все одразу, увага розсіюється.",
  },
];

const TODAY_ACTIONS = [
  "Зроби фото трьох улюблених образів — знайди спільний колір чи силует, це твоя база.",
  "Прибери з шафи все, що не носив рік. Не викидай — просто онови погляд на те, що лишилось.",
  "Підшив одну річ, яка давно велика чи завелика в талії. Різниця відчутна одразу.",
  "Додай один аксесуар (ремінь, шарф, годинник) до звичного образу — і подивись, як зміниться враження.",
  "Напиши AI-стилісту одне речення про свій найближчий привід — почни з малого запиту, не з ідеального.",
];

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf7f2]">
      <SiteNav />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-16 sm:px-8">
        <h1
          className="text-4xl font-semibold text-black"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Про PRMPT
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/70">
          PRMPT — це архівна колекція одягу, поєднана з AI-стилістом, який
          допомагає зібрати образ під будь-який привід. Ми віримо, що
          впевненість починається не з великого гардеробу, а з правильних
          рішень: кілька точних речей важать більше, ніж шафа, повна
          випадкових покупок.
        </p>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-black/70">
          Наш AI-стиліст ставить уточнюючі питання про привід, сезон і
          бюджет, а потім дає конкретні поради з поясненням «чому це
          підходить» — без осуду зовнішності чи ваги, без медичних порад,
          мовою, якою ти пишеш.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/chat"
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
          >
            Почати підбір стилю
          </Link>
          <Link
            to="/lookbook"
            className="rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-black"
          >
            Переглянути Lookbook
          </Link>
        </div>

        {/* Як одягаються стильні люди */}
        <section className="mt-20 border-t border-black/10 pt-16">
          <h2
            className="text-2xl font-semibold text-black sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Як одягаються люди, яким довіряють
          </h2>
          <p className="mt-2 max-w-2xl text-black/60">
            Стиль — це не кількість речей, а кілька принципів, які працюють
            завжди. Ось чотири, з яких ми будуємо кожну рекомендацію.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="text-base font-semibold text-black">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/60">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Що змінити вже сьогодні */}
        <section className="mt-20 border-t border-black/10 pt-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1fr_260px]">
            <div>
              <h2
                className="text-2xl font-semibold text-black sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Що можна змінити вже сьогодні
              </h2>
              <p className="mt-2 max-w-xl text-black/60">
                Не потрібен новий гардероб, щоб виглядати і почуватися інакше.
                Досить одного кроку зі списку — і завтра вранці рішення буде
                легшим.
              </p>
              <ol className="mt-6 space-y-3">
                {TODAY_ACTIONS.map((action, i) => (
                  <li key={action} className="flex gap-3 text-sm leading-relaxed text-black/70">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-black text-[11px] font-medium text-white">
                      {i + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ol>
            </div>
            <PortraitSilhouette index={4} className="hidden h-full w-full rounded-2xl sm:block" />
          </div>
        </section>

        {/* Про впевненість */}
        <section className="mt-20 border-t border-black/10 pt-16">
          <h2
            className="text-2xl font-semibold text-black sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Про впевненість у собі
          </h2>
          <div className="mt-4 max-w-2xl space-y-4 text-black/70">
            <p className="leading-relaxed">
              Впевненість не з'являється від «ідеальної» фігури чи дорогого
              одягу — вона з'являється, коли те, що на тобі, відповідає тому,
              як ти себе відчуваєш і куди йдеш. Одяг — це один з небагатьох
              інструментів, який можна змінити сьогодні, не чекаючи «колись».
            </p>
            <p className="leading-relaxed">
              Тому AI-стиліст PRMPT ніколи не почне з коментарів про вагу чи
              зовнішність — лише з питань про привід, контекст і те, як ти
              хочеш почуватися. Стиль підлаштовується під тебе, а не навпаки.
            </p>
            <ul className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              <li className="rounded-xl bg-white p-4 text-sm">
                <span className="font-medium text-black">Малі кроки.</span>{" "}
                Одна нова деталь за раз — впевненіше, ніж повна заміна
                гардеробу за вихідні.
              </li>
              <li className="rounded-xl bg-white p-4 text-sm">
                <span className="font-medium text-black">Без порівнянь.</span>{" "}
                Орієнтир — не чужий образ, а те, як ти почуваєшся у своєму.
              </li>
              <li className="rounded-xl bg-white p-4 text-sm">
                <span className="font-medium text-black">Послідовність.</span>{" "}
                Стиль, який повторюється, читається як впевненість, навіть
                якщо він простий.
              </li>
            </ul>
          </div>
        </section>

        {/* Історії */}
        <div className="mt-20 border-t border-black/10 pt-16">
          <StoriesSection />
        </div>

        <div className="mt-16 flex flex-wrap gap-4 border-t border-black/10 pt-16">
          <Link
            to="/chat"
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
          >
            Розкажи AI-стилісту про себе
          </Link>
          <Link
            to="/lookbook"
            className="rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-black"
          >
            Переглянути Lookbook
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
