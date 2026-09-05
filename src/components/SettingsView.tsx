import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import { AccentColor } from "../types";
import {
  Sliders,
  Palette,
  Bot,
  Cpu,
  Shield,
  FileText,
  Check,
  RefreshCw,
  Trash2,
  Lock,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, getAccentClasses } = useLifeOS();
  const [activeSection, setActiveSection] = useState<
    "general" | "appearance" | "ai" | "hardware" | "privacy" | "logs"
  >("appearance");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const accent = getAccentClasses();

  const handleTestOllama = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const resp = await fetch("/api/ai/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: settings.ai.ollamaUrl }),
      });
      const data = await resp.json();
      setTestResult(data.message || (data.connected ? "Bağlantı başarılı!" : "Ollama servisine ulaşılamadı."));
    } catch {
      setTestResult("Ollama yerel servisine bağlanılamadı. 'ollama serve' çalıştığından emin olun.");
    } finally {
      setIsTesting(false);
    }
  };

  const accentColors: Array<{ id: AccentColor; label: string; class: string }> = [
    { id: "cyan", label: "Neon Cyan", class: "bg-cyan-500" },
    { id: "emerald", label: "Cyber Emerald", class: "bg-emerald-500" },
    { id: "violet", label: "Deep Violet", class: "bg-violet-500" },
    { id: "amber", label: "Solar Amber", class: "bg-amber-500" },
    { id: "rose", label: "Pulse Rose", class: "bg-rose-500" },
    { id: "blue", label: "Cobalt Blue", class: "bg-blue-500" },
  ];

  return (
    <div id="settings-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          <span>AYARLAR & GÜVENLİK MERKEZİ</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          LifeOS yerel davranışını, renk paletini, AI modellerini ve izin politikalarını yönetin
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs (1 col) */}
        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md space-y-1 h-fit">
          {[
            { id: "appearance", label: "Görünüm & Tema", icon: Palette },
            { id: "ai", label: "AI & Model Seçimi", icon: Bot },
            { id: "hardware", label: "Donanım & Portlar", icon: Cpu },
            { id: "privacy", label: "Gizlilik & İzinler", icon: Shield },
            { id: "general", label: "Genel Sistem", icon: Sliders },
            { id: "logs", label: "Sistem Günlükleri (Logs)", icon: FileText },
          ].map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                  isSelected
                    ? "bg-blue-600/20 text-blue-300 font-semibold shadow-[0_0_10px_rgba(37,99,235,0.2)] border border-blue-500/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-blue-400" : "text-slate-500"}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Setting Content (3 cols) */}
        <div className="md:col-span-3 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md shadow-2xl space-y-6">
          {/* 1. Appearance */}
          {activeSection === "appearance" && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white">Vurgu Rengi (Accent Color)</h3>
                <p className="text-xs text-slate-400">
                  Arayüzdeki butonlar, sayaçlar ve simgelerin rengini belirleyin.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {accentColors.map((c) => {
                  const isSelected = settings.appearance.accentColor === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() =>
                        updateSettings({
                          appearance: { ...settings.appearance, accentColor: c.id },
                        })
                      }
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-[#08090d] border-blue-500/60 ring-1 ring-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-full ${c.class}`} />
                        <span className="text-xs text-slate-200 font-medium">{c.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-xs font-medium text-slate-200">Akıcı Animasyonlar</p>
                    <p className="text-[11px] text-slate-500">Panel geçişlerinde yumuşak animasyonları aç</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.appearance.animations}
                    onChange={(e) =>
                      updateSettings({
                        appearance: { ...settings.appearance, animations: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* 2. AI Engine */}
          {activeSection === "ai" && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white">AI Motoru ve Model Tercihleri</h3>
                <p className="text-xs text-slate-400">
                  Yerel Ollama modelleri veya Google AI Studio bulut entegrasyonunu yapılandırın.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">AI Sağlayıcı</label>
                  <select
                    value={settings.ai.provider}
                    onChange={(e) =>
                      updateSettings({
                        ai: { ...settings.ai, provider: e.target.value as any },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none"
                  >
                    <option value="ollama">Ollama (Yerel & Local-First)</option>
                    <option value="gemini">Google Gemini 2.5 (Cloud AI)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Ollama Base URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.ai.ollamaUrl}
                      onChange={(e) =>
                        updateSettings({
                          ai: { ...settings.ai, ollamaUrl: e.target.value },
                        })
                      }
                      className="flex-1 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 outline-none"
                    />
                    <button
                      onClick={handleTestOllama}
                      disabled={isTesting}
                      className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-1.5 transition-colors font-medium"
                    >
                      {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Test Et</span>
                    </button>
                  </div>
                  {testResult && (
                    <p className="text-[11px] font-mono mt-1 text-blue-400">{testResult}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Varsayılan Model</label>
                  <select
                    value={settings.ai.model}
                    onChange={(e) =>
                      updateSettings({
                        ai: { ...settings.ai, model: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 outline-none"
                  >
                    <option value="qwen2.5:coder">qwen2.5:coder (Önerilen)</option>
                    <option value="llama3.3">llama3.3 (Meta)</option>
                    <option value="deepseek-r1">deepseek-r1 (Reasoning)</option>
                    <option value="gemma2">gemma2 (Google)</option>
                    <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. Hardware */}
          {activeSection === "hardware" && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white">Donanım ve Seri Port Yapılandırması</h3>
                <p className="text-xs text-slate-400">
                  ESP32 ve Arduino için varsayılan haberleşme parametreleri.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Varsayılan Baud Rate</label>
                  <select
                    value={settings.hardware.defaultBaud}
                    onChange={(e) =>
                      updateSettings({
                        hardware: { ...settings.hardware, defaultBaud: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 outline-none"
                  >
                    {[9600, 19200, 38400, 57600, 115200, 230400, 921600].map((b) => (
                      <option key={b} value={b}>
                        {b} baud
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center justify-between cursor-pointer pt-2">
                  <div>
                    <p className="text-xs font-medium text-slate-200">Otomatik Port Taraması</p>
                    <p className="text-[11px] text-slate-500">USB takıldığında ESP32'yi otomatik algıla</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.hardware.autoDetect}
                    onChange={(e) =>
                      updateSettings({
                        hardware: { ...settings.hardware, autoDetect: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* 4. Privacy & Sandbox */}
          {activeSection === "privacy" && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white">Güvenlik, İzinler ve Sandbox</h3>
                <p className="text-xs text-slate-400">
                  AI ve sistem izin sınırlarını belirleyin.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#08090d] border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      Komut ve Donanım İzin Gatekeeper
                    </p>
                    <p className="text-[11px] text-slate-500">
                      AI'ın motor veya shell komutları göndermeden önce onay istemesi zorunludur.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Zorunlu Aktif
                  </span>
                </div>

                <label className="flex items-center justify-between cursor-pointer p-2">
                  <div>
                    <p className="text-xs font-medium text-slate-200">Görsel Ekran Analizi İzni</p>
                    <p className="text-[11px] text-slate-500">Ekrandaki hata ve kodların yerel OCR ile taranması</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.screenAnalysis}
                    onChange={(e) =>
                      updateSettings({
                        privacy: { ...settings.privacy, screenAnalysis: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-2">
                  <div>
                    <p className="text-xs font-medium text-slate-200">Semantik Hafıza Kaydı</p>
                    <p className="text-[11px] text-slate-500">Geçmiş konuşmaların yerel SQLite tablosunda saklanması</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.aiMemory}
                    onChange={(e) =>
                      updateSettings({
                        privacy: { ...settings.privacy, aiMemory: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* 5. General */}
          {activeSection === "general" && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-white">Genel Sistem Tercihleri</h3>
                <p className="text-xs text-slate-400">
                  Uygulama dili ve başlangıç ayarları.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Arayüz Dili</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) =>
                      updateSettings({
                        general: { ...settings.general, language: e.target.value as any },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none"
                  >
                    <option value="tr">Türkçe (Varsayılan)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <label className="flex items-center justify-between cursor-pointer pt-2">
                  <div>
                    <p className="text-xs font-medium text-slate-200">Masaüstü Bildirimleri</p>
                    <p className="text-[11px] text-slate-500">Cihaz bağlandığında veya görev tamamlandığında bildir</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.general.notificationsEnabled}
                    onChange={(e) =>
                      updateSettings({
                        general: { ...settings.general, notificationsEnabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* 6. Logs */}
          {activeSection === "logs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-white">Sistem Log Dosyaları</h3>
                  <p className="text-xs text-slate-400">app.log, ai.log ve hardware.log çıktıları</p>
                </div>
                <button className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" />
                  <span>Logları Temizle</span>
                </button>
              </div>

              <div className="h-64 rounded-xl bg-[#08090d] border border-slate-800/80 p-3 font-mono text-[11px] text-slate-400 overflow-y-auto space-y-1">
                <p className="text-emerald-400">[2026-09-05 18:40:01] [INFO] LifeOS SQLite database initialized.</p>
                <p className="text-slate-400">[2026-09-05 18:40:02] [INFO] SystemMonitor thread started (psutil).</p>
                <p className="text-blue-400">[2026-09-05 18:40:03] [INFO] SerialManager scanning COM ports...</p>
                <p className="text-slate-400">[2026-09-05 18:40:04] [INFO] Connected to COM3 (ESP32 Dev Module) @ 115200 baud.</p>
                <p className="text-slate-400">[2026-09-05 18:40:15] [INFO] Active project set to 'ESP32 Robot'.</p>
                <p className="text-amber-400">[2026-09-05 18:41:20] [AUTH] Permission requested for 'MOTOR 120'. Waiting for user...</p>
                <p className="text-emerald-400">[2026-09-05 18:41:22] [AUTH] User approved 'MOTOR 120'. Command dispatched.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
