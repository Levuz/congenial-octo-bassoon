import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  BookOpen,
  Youtube,
  Lightbulb,
  ArrowLeft,
  Bot,
  User as UserIcon,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { findGuide, DEFAULT_GUIDE } from "../data/examGuides";

const SUGGESTIONS = [
  "IELTS",
  "CEFR",
  "Full Stack Developer",
  "Python",
  "Frontend",
  "SAT",
];

export default function AIAdvisor() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Salom! 👋 Men CogniTest AI yordamchisiman.\n\nQaysi imtihon yoki kasb bo'yicha maslahat olishni xohlaysiz? Masalan:\n\n• IELTS\n• CEFR\n• Full Stack Developer\n• Python\n• SAT\n\nYozing — men sizga maslahat, kitoblar va YouTube havolalarini topib beraman.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  // Pastga scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const query = (text || input).trim();
    if (!query) return;

    // Foydalanuvchi xabari
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setInput("");
    setThinking(true);

    // "AI o'ylayapti" simulyatsiyasi
    await new Promise((r) => setTimeout(r, 800));

    // Qo'llanmani topish
    const guide = findGuide(query) || DEFAULT_GUIDE;

    setThinking(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Mana **${guide.title}** bo'yicha to'liq qo'llanma! 👇`,
        guide,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Orqaga */}
        <button
          onClick={() => navigate("/home")}
          className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Bosh sahifaga qaytish
        </button>

        {/* Sarlavha */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Yordamchi</h1>
            <p className="text-xs text-slate-400">
              Imtihon va kasblar bo‘yicha maslahat
            </p>
          </div>
        </div>

        {/* Chat oynasi */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:p-6">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}

            {thinking && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
                  <Bot className="h-4 w-4 text-violet-400" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                      className="h-2 w-2 rounded-full bg-violet-400"
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Takliflar */}
          {messages.length <= 1 && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-1.5 text-xs font-medium text-violet-300 transition hover:bg-violet-400/20"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Kirish maydoni */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Imtihon yoki kasb nomini yozing..."
            className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white transition hover:brightness-110 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-slate-500">
          💡 AI yordamchi maslahat beradi, lekin rasmiy manbalarni tekshirishni unutmang.
        </p>
      </main>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
          isUser ? "bg-indigo-500/20" : "bg-violet-500/20"
        }`}
      >
        {isUser ? (
          <UserIcon className="h-4 w-4 text-indigo-400" />
        ) : (
          <Bot className="h-4 w-4 text-violet-400" />
        )}
      </div>

      <div className={`max-w-[85%] flex-1 ${isUser ? "text-right" : ""}`}>
        {message.content && (
          <div
            className={`inline-block rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
              isUser
                ? "border-indigo-400/30 bg-indigo-500/10 text-indigo-100"
                : "border-white/10 bg-white/5 text-slate-200"
            }`}
            style={{ whiteSpace: "pre-line" }}
          >
            {message.content}
          </div>
        )}

        {message.guide && <GuideCard guide={message.guide} />}
      </div>
    </div>
  );
}

function GuideCard({ guide }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 space-y-4 text-left"
    >
      {/* Sarlavha */}
      <div className="rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-5">
        <h3 className="text-lg font-bold text-white">{guide.title}</h3>
        <p className="mt-1 text-xs text-violet-300">{guide.fullName}</p>
        <p className="mt-2 text-sm text-slate-300">{guide.description}</p>
      </div>

      {/* Bo'limlar */}
      {guide.sections && guide.sections.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Clock className="h-4 w-4 text-indigo-400" />
            Imtihon tuzilishi
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {guide.sections.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/5 bg-white/5 p-3"
              >
                <div className="text-sm font-medium text-white">
                  {s.name || s.level}
                </div>
                {s.duration && (
                  <div className="text-xs text-slate-400">
                    ⏱ {s.duration}
                  </div>
                )}
                {s.score && (
                  <div className="text-xs text-slate-400">🎯 {s.score}</div>
                )}
                {s.tech && (
                  <div className="text-xs text-slate-400">{s.tech}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kitoblar */}
      {guide.books && guide.books.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            Tavsiya etilgan kitoblar
          </div>
          <div className="space-y-2">
            {guide.books.map((book, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {book.title}
                  </div>
                  <div className="text-xs text-slate-400">{book.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* YouTube */}
      {guide.channels && guide.channels.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Youtube className="h-4 w-4 text-rose-400" />
            YouTube kanallar
          </div>
          <div className="space-y-2">
            {guide.channels.map((ch, i) => (
              <a
                key={i}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-3 transition hover:border-rose-400/40 hover:bg-white/10"
              >
                <div>
                  <div className="text-sm font-medium text-white">
                    {ch.title}
                  </div>
                  <div className="text-xs text-slate-400">{ch.desc}</div>
                </div>
                <Youtube className="h-4 w-4 shrink-0 text-rose-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Maslahatlar */}
      {guide.tips && guide.tips.length > 0 && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-300">
            <Lightbulb className="h-4 w-4" />
            Muhim maslahatlar
          </div>
          <ul className="space-y-2">
            {guide.tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}