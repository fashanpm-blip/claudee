import { useEffect, useRef, useState } from "react";
import SiteNav from "../components/site/SiteNav";
import SiteFooter from "../components/site/SiteFooter";
import { STYLIST_SYSTEM_PROMPT } from "../data/stylistPrompt";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type SampleFn = (
  input: { role: "user" | "assistant"; content: string }[],
  options?: {
    modelTier?: "default" | "complex" | "quick";
    cache?: boolean;
    signal?: AbortSignal;
    onText?: (update: { text: string; delta: string }) => void;
  }
) => Promise<{ text: string; truncated: boolean }>;

const SAMPLE_ERROR_COPY: Record<string, string> = {
  not_granted:
    "Щоб отримати відповідь тут, дозволь цій сторінці використовувати Claude (з'явиться запит доступу).",
  rate_limited: "Забагато запитів поспіль. Спробуй, будь ласка, за хвилину.",
  refused: "Стиліст не зміг відповісти на це. Спробуй переформулювати запит.",
  empty_completion: "Стиліст не зміг сформувати відповідь. Спробуй запитати інакше.",
};

const WELCOME: Message = {
  role: "assistant",
  content:
    "Привіт! Я AI-стиліст PRMPT. Розкажи, для якого приводу підбираємо образ — робота, побачення, оновлення гардеробу чи щось інше — і я підкажу конкретні речі та поясню, чому вони підійдуть.",
};

const QUICK_PROMPTS = [
  "Підібрати образ на роботу",
  "Що вдягнути на побачення",
  "Оновити гардероб",
];

const VALUE_PROPS = [
  {
    title: "Без осуду",
    text: "Жодних коментарів про вагу чи фігуру — лише про одяг і привід.",
  },
  {
    title: "Конкретні поради",
    text: "2-4 чіткі рекомендації з поясненням, чому саме вони підходять.",
  },
  {
    title: "Твоєю мовою",
    text: "Стиліст відповідає тією мовою, якою ти йому пишеш.",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sampleRef = useRef<SampleFn | null>(null);

  useEffect(() => {
    let cancelled = false;
    const w = window as unknown as { claude?: { use: (name: string) => Promise<unknown> } };
    if (w.claude) {
      w.claude
        .use("sample")
        .then((fn) => {
          if (!cancelled) sampleRef.current = (fn as SampleFn) ?? null;
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, streamingText]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);
    setStreamingText(null);

    // In-artifact path: ask Claude directly via the viewer's own sample
    // capability, no backend needed.
    if (sampleRef.current) {
      try {
        const turns = [
          { role: "user" as const, content: STYLIST_SYSTEM_PROMPT },
          ...nextMessages.slice(1).map((m) => ({ role: m.role, content: m.content })),
        ];
        const { text: reply } = await sampleRef.current(turns, {
          cache: false,
          onText: ({ text }) => setStreamingText(text),
        });
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch (e) {
        const code = (e as { code?: string })?.code ?? "";
        setError(
          SAMPLE_ERROR_COPY[code] ??
            "Стиліст зараз недоступний. Спробуй, будь ласка, ще раз за хвилину."
        );
      } finally {
        setStreamingText(null);
        setLoading(false);
      }
      return;
    }

    // Deployed-site path: a real backend proxying to the Anthropic API.
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
      setError("Стиліст зараз недоступний. Спробуй, будь ласка, ще раз за хвилину.");
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
          {loading && streamingText && (
            <div className="flex justify-start">
              <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-[#f1ece2] px-4 py-3 text-sm leading-relaxed text-black">
                {streamingText}
              </div>
            </div>
          )}
          {loading && !streamingText && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl bg-[#f1ece2] px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-black/40"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
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

        <div className="mt-10 grid grid-cols-1 gap-4 border-t border-black/10 pt-10 sm:grid-cols-3">
          {VALUE_PROPS.map((v) => (
            <div key={v.title}>
              <h3 className="text-sm font-semibold text-black">{v.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-black/50">{v.text}</p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
