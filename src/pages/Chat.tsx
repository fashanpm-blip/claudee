import { useEffect, useRef, useState } from "react";
import SiteNav from "../components/site/SiteNav";
import SiteFooter from "../components/site/SiteFooter";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME: Message = {
  role: "assistant",
  content:
    "Привіт! Я AI-стиліст PRMPT. Розкажи, для якого приводу підбираємо образ — робота, побачення, оновлення гардеробу чи щось інше — і я підкажу конкретні речі та поясню, чому вони підійдуть.",
};

const QUICK_PROMPTS = [
  "Подобрать образ на работу",
  "Что носить на свидание",
  "Обновить гардероб",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
    } catch {
      setError(
        "Не вдалося зв'язатися зі стилістом. Перевір, що заданий ANTHROPIC_API_KEY і запущений сервер (npm run server)."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#faf7f2]">
      <SiteNav />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
        <div className="mb-4">
          <h1
            className="text-2xl font-semibold text-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI-стиліст
          </h1>
          <p className="text-sm text-black/50">
            Розкажи про повід, сезон і бюджет — отримай конкретні поради.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-black/10 bg-white p-4 sm:p-6"
          style={{ minHeight: "50vh", maxHeight: "60vh" }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-black text-white"
                    : "bg-[#f1ece2] text-black"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-[#f1ece2] px-4 py-3 text-sm text-black/50">
                стиліст друкує…
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-[#b5502e]/30 bg-[#b5502e]/10 px-4 py-3 text-sm text-[#b5502e]">
              {error}
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => sendMessage(p)}
                className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/70 transition-colors hover:border-black hover:text-black"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="mt-4 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Напиши стилісту…"
            className="flex-1 rounded-full border border-black/15 bg-white px-5 py-3 text-sm outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-opacity disabled:opacity-40"
          >
            Надіслати
          </button>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
