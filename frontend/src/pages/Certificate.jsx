import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Download, ShieldCheck, ArrowLeft } from "lucide-react";
import api from "../api/client";
import Navbar from "../components/Navbar";

export default function Certificate() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Profilni olish
    api
      .get("/auth/me/")
      .then((r) => setProfile(r.data.profile))
      .catch(() => {});

    // Sertifikat olish
    api
      .post(`/test/certificate/${uuid}/`)
      .then((r) => setData(r.data))
      .catch((e) => {
        const detail = e?.response?.data?.detail || "Sertifikat olinmadi.";
        setError(detail);
        if (e?.response?.data?.requires_subscription) {
          // 3 soniyadan keyin pricingga yo'naltirish
          setTimeout(() => navigate("/pricing"), 3000);
        }
      })
      .finally(() => setLoading(false));
  }, [uuid, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="animate-pulse">Sertifikat tayyorlanmoqda…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-8">
            <h1 className="text-xl font-bold text-rose-300">Sertifikat olinmadi</h1>
            <p className="mt-3 text-sm text-slate-300">{error}</p>
            <button
              onClick={() => navigate("/pricing")}
              className="btn-primary mt-6"
            >
              Tariflarni ko‘rish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Orqaga */}
        <button
          onClick={() => navigate(-1)}
          className="no-print mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </button>

        {/* Sertifikat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border-4 border-indigo-500/30 bg-white p-10 text-slate-900 shadow-2xl"
        >
          {/* Sarlavha */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              SERTIFIKAT
            </h1>
            <p className="mt-2 text-xs uppercase tracking-widest text-indigo-600">
              CogniTest — Kognitiv Baholash
            </p>
          </div>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

          {/* F.I.SH */}
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-slate-500">
              Sertifikat egasi
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {profile?.full_name || "—"}
            </div>
          </div>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

          {/* Natija */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-slate-500">
                IQ darajasi
              </div>
              <div className="mt-2 bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text text-7xl font-black text-transparent">
                {data.iq_score}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Aholining {data.percentile}% dan yuqori
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <Row label="Pasport" value={profile?.passport_series} />
              <Row label="Telefon" value={profile?.phone_number} />
              <Row
                label="Berilgan sana"
                value={new Date(data.issued_at).toLocaleDateString("uz-UZ")}
              />
              <Row label="Tarif" value={profile?.plan?.toUpperCase()} />
            </div>
          </div>

          <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

          {/* Tekshirish + PDF */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-mono break-all">
                {data.certificate_uuid}
              </span>
            </div>
            <button
              onClick={() => window.print()}
              className="no-print flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
            >
              <Download className="h-4 w-4" />
              PDF sifatida yuklash
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Ushbu sertifikatni tekshirish: <strong>cognitest.uz/verify/{data.certificate_uuid}</strong>
          </p>
        </motion.div>
      </main>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-200 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold">{value || "—"}</span>
    </div>
  );
}