import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Lock } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/client";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "abadiy",
    icon: Star,
    color: "slate",
    description: "Boshlash uchun",
    features: [
      { text: "40 ta savol testi", included: true },
      { text: "Asosiy IQ natijasi", included: true },
      { text: "Kategoriya bo‘yicha tahlil", included: true },
      { text: "Tavsiyalar (kitob/video)", included: true },
      { text: "Sertifikat olish", included: false },
      { text: "Batafsil statistikalar", included: false },
      { text: "PDF hisobot", included: false },
      { text: "Reklama yo‘q", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "49 000",
    period: "so‘m/oy",
    icon: Zap,
    color: "indigo",
    popular: true,
    description: "Jiddiy o‘rganuvchilar uchun",
    features: [
      { text: "40 ta savol testi", included: true },
      { text: "Asosiy IQ natijasi", included: true },
      { text: "Kategoriya bo‘yicha tahlil", included: true },
      { text: "Tavsiyalar (kitob/video)", included: true },
      { text: "✅ Sertifikat olish", included: true },
      { text: "✅ Batafsil statistikalar", included: true },
      { text: "✅ PDF hisobot", included: true },
      { text: "Reklama yo‘q", included: false },
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: "149 000",
    period: "so‘m/3 oy",
    icon: Crown,
    color: "amber",
    description: "Maksimal imkoniyatlar",
    features: [
      { text: "40 ta savol testi", included: true },
      { text: "Asosiy IQ natijasi", included: true },
      { text: "Kategoriya bo‘yicha tahlil", included: true },
      { text: "Tavsiyalar (kitob/video)", included: true },
      { text: "✅ Sertifikat olish", included: true },
      { text: "✅ Batafsil statistikalar", included: true },
      { text: "✅ PDF hisobot", included: true },
      { text: "✅ Reklama yo‘q", included: true },
    ],
  },
];

const COLOR_MAP = {
  slate: {
    border: "border-white/10",
    bg: "bg-white/5",
    badge: "bg-slate-500/20 text-slate-300",
  },
  indigo: {
    border: "border-indigo-400/40",
    bg: "bg-indigo-500/10",
    badge: "bg-indigo-500/20 text-indigo-300",
  },
  amber: {
    border: "border-amber-400/40",
    bg: "bg-amber-500/10",
    badge: "bg-amber-500/20 text-amber-300",
  },
};

export default function Pricing() {
  const navigate = useNavigate();

  const handleSubscribe = async (planId) => {
    if (planId === "free") {
      navigate("/home");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/auth/subscribe/", { plan: planId });
      alert(`${planId.toUpperCase()} tarif faollashtirildi!`);
      navigate("/home");
    } catch (err) {
      alert("Xatolik: " + (err?.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-4xl font-black text-transparent md:text-5xl"
          >
            Tarif rejalar
          </motion.h1>
          <p className="mt-4 text-slate-400">
            Sizga mos rejani tanlang. Istalgan vaqtda o‘zgartirish mumkin.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan, idx) => {
            const Icon = plan.icon;
            const colors = COLOR_MAP[plan.color];
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-3xl border ${colors.border} ${colors.bg} p-8 backdrop-blur-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                    ENG MASHHUR
                  </div>
                )}

                <div className="mb-6 text-center">
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${colors.badge}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2 text-sm ${
                        f.included ? "text-slate-200" : "text-slate-500"
                      }`}
                    >
                      {f.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      ) : (
                        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                      )}
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:brightness-110"
                      : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {plan.id === "free" ? "Boshlash" : "Obuna bo‘lish"}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-sm text-slate-300">
            <strong className="text-white">Eslatma:</strong> To‘lov tizimi
            hozircha demo rejimida ishlaydi.
          </p>
        </div>
      </main>
    </div>
  );
}