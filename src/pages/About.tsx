import { Link } from "react-router-dom";
import SiteNav from "../components/site/SiteNav";
import SiteFooter from "../components/site/SiteFooter";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf7f2]">
      <SiteNav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
        <h1
          className="text-4xl font-semibold text-black"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Про PRMPT
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-black/70">
          PRMPT — це архівна колекція одягу, поєднана з AI-стилістом, який
          допомагає зібрати образ під будь-який привід. Ми віримо, що
          впевненість починається не з великого гардеробу, а з правильних
          рішень: кілька точних речей важать більше, ніж шафа, повна
          випадкових покупок.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-black/70">
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
      </main>

      <SiteFooter />
    </div>
  );
}
