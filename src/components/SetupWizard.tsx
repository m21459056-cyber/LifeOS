import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import { Sparkles, Bot, FolderPlus, CheckCircle2, ArrowRight, X } from "lucide-react";

export const SetupWizard: React.FC = () => {
  const { isSetupWizardOpen, setIsSetupWizardOpen, settings, updateSettings, activeProject } = useLifeOS();
  const [step, setStep] = useState<number>(1);
  const [selectedProvider, setSelectedProvider] = useState<"ollama" | "gemini">(settings.ai.provider);
  const [selectedModel, setSelectedModel] = useState<string>(settings.ai.model);

  if (!isSetupWizardOpen) return null;

  const handleFinish = () => {
    updateSettings({
      ai: {
        ...settings.ai,
        provider: selectedProvider,
        model: selectedModel,
      },
    });
    setIsSetupWizardOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-[#050608]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_25px_rgba(37,99,235,0.25)] overflow-hidden p-6 backdrop-blur-xl">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Welcome to LifeOS</h3>
              <p className="text-xs text-slate-400">Hızlı Başlangıç Kurulum Sihirbazı</p>
            </div>
          </div>
          <button
            onClick={() => setIsSetupWizardOpen(false)}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between my-5 px-2">
          {[
            { num: 1, label: "AI Sağlayıcı" },
            { num: 2, label: "Model Seçimi" },
            { num: 3, label: "İlk Proje" },
            { num: 4, label: "Hazır!" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)] ring-2 ring-blue-400/40"
                    : step > s.num
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span className="text-[10px] text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step Contents */}
        <div className="py-3 min-h-[160px] text-xs">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-slate-300">
                LifeOS local-first ve gizlilik odaklı çalışır. Tercih ettiğiniz AI motorunu seçin:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProvider("ollama")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedProvider === "ollama"
                      ? "bg-blue-600/15 border-blue-500/60 text-white ring-1 ring-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                      : "bg-[#08090d] border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <p className="font-semibold text-sm">Ollama (Local-First)</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tamamen yerel, internetsiz, Qwen/DeepSeek/Llama modelleri.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProvider("gemini")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedProvider === "gemini"
                      ? "bg-blue-600/15 border-blue-500/60 text-white ring-1 ring-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                      : "bg-[#08090d] border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <p className="font-semibold text-sm">Gemini Cloud AI</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Google AI Studio ile yüksek akıl yürütme ve multimodal analiz.
                  </p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-slate-300">Varsayılan asistan modelini belirleyin:</p>
              <div className="space-y-2">
                {[
                  { id: "qwen2.5:coder", label: "Qwen 2.5 Coder (Tavsiye Edilen)", desc: "Mükemmel kod analizi ve Python desteği" },
                  { id: "llama3", label: "Llama 3.3 (Genel Amaçlı)", desc: "Geniş bilgi birikimi ve akıcı Türkçe diyalog" },
                  { id: "deepseek-r1", label: "DeepSeek R1 (Muhakeme & Düşünme)", desc: "Karmaşık mantık ve hata analizi" },
                  { id: "gemma2", label: "Google Gemma 2", desc: "Hızlı, hafif ve etkili yerel model" },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedModel === m.id
                        ? "bg-blue-600/15 border-blue-500/50 text-white"
                        : "bg-[#08090d] border-slate-800 text-slate-300 hover:bg-slate-800/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="model"
                      checked={selectedModel === m.id}
                      onChange={() => setSelectedModel(m.id)}
                      className="mt-1 accent-blue-600"
                    />
                    <div>
                      <p className="font-semibold text-xs text-white">{m.label}</p>
                      <p className="text-[11px] text-slate-400">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-slate-300">İlk projeniz otomatik olarak bağlandı:</p>
              <div className="p-4 rounded-xl bg-[#08090d] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                  <FolderPlus className="w-4 h-4" />
                  <span>{activeProject.name}</span>
                </div>
                <p className="text-slate-400 text-xs font-mono">{activeProject.path}</p>
                <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-800 flex gap-4">
                  <span>Git: {activeProject.git.branch}</span>
                  <span>İlerleme: {activeProject.progress}%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                İstediğiniz zaman Projeler sekmesinden bilgisayarınızdaki başka klasörleri ekleyebilirsiniz.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">LifeOS Kullanıma Hazır!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bilgisayarınız, donanım cihazlarınız ve projeleriniz tek bir komuta merkezinde birleşti.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setIsSetupWizardOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Kurulumu Atla (Skip)
          </button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-300 transition-colors"
              >
                Geri
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
              >
                <span>İleri</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                LifeOS'u Başlat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
