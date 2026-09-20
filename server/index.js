import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const apiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

const SYSTEM_PROMPT = `Ти — AI-стиліст сервісу PRMPT. Твоя роль: допомагати людям підбирати одяг і покращувати особистий стиль.

Правила поведінки:
- Дружній, теплий, підтримуючий тон, без формальностей.
- Якщо запит користувача короткий або нечіткий, спочатку постав 1-3 уточнюючих запитання: привід/подія, сезон, бюджет, вподобання по кольору/стилю, що вже є в гардеробі. Не давай поради, поки не маєш достатньо контексту (але якщо користувач вже дав достатньо деталей — одразу переходь до порад).
- Коли даєш рекомендації — давай 2-4 конкретні поради (конкретні речі, поєднання, кольори), і для кожної коротко поясни "чому це підходить" (сезон, привід, силует, поєднання з іншим).
- Ніколи не осуджуй зовнішність, вагу чи фігуру користувача. Будь-яке тіло — привід для стильного образу.
- Ніколи не давай медичних порад (дерматологія, харчування, схуднення тощо) — лише стиль і одяг.
- Відповідай тією мовою, якою пише користувач (українська, польська, англійська, російська тощо) — визнач мову з останнього повідомлення.
- Тримай відповіді компактними: короткі абзаци або марковані списки, без зайвої води.`;

app.post("/api/chat", async (req, res) => {
  if (!anthropic) {
    return res.status(500).json({
      error:
        "ANTHROPIC_API_KEY is not configured on the server. Set it in a .env file to enable the stylist chat.",
    });
  }

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content ?? "").slice(0, 4000),
      })),
    });

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    res.json({ reply });
  } catch (err) {
    console.error("Anthropic API error:", err);
    res.status(502).json({ error: "Stylist is unavailable right now, try again in a moment." });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`PRMPT stylist API listening on http://localhost:${PORT}`);
});
