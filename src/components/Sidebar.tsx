import React from "react";
import { useLifeOS } from "../context/LifeOSContext";
import {
  LayoutDashboard,
  Bot,
  FolderGit2,
  StickyNote,
  CheckSquare,
  Cpu,
  Eye,
  Database,
  Code2,
  Settings,
  ShieldCheck,
  Terminal,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, tasks, notes, isSerialConnected, getAccentClasses } = useLifeOS();
  const accent = getAccentClasses();

  const openTasksCount = tasks.filter((t) => !t.completed).length;

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
      desc: "Komuta Merkezi",
    },
    {
      id: "ai",
      label: "AI Asistanı",
      icon: Bot,
      badge: "Local AI",
      desc: "Ollama / Gemini",
    },
    {
      id: "projects",
      label: "Projeler & Dosyalar",
      icon: FolderGit2,
      badge: null,
      desc: "Git & Kod Ağacı",
    },
    {
      id: "notes",
      label: "Notlar & Bellek",
      icon: StickyNote,
      badge: notes.length > 0 ? String(notes.length) : null,
      desc: "Hızlı Etiketli Notlar",
    },
    {
      id: "tasks",
      label: "Görevler",
      icon: CheckSquare,
      badge: openTasksCount > 0 ? String(openTasksCount) : null,
      desc: "Todo Yönetimi",
    },
    {
      id: "hardware",
      label: "Donanım (ESP32/Arduino)",
      icon: Cpu,
      badge: isSerialConnected ? "COM3" : null,
      desc: "Serial Monitor",
    },
    {
      id: "screen",
      label: "Ekran Analizi",
      icon: Eye,
      badge: null,
      desc: "Hata Görsel Denetim",
    },
    {
      id: "memory",
      label: "Semantik Hafıza",
      icon: Database,
      badge: null,
      desc: "SQLite Full-Text",
    },
    {
      id: "python",
      label: "Python Masaüstü Kodu",
      icon: Code2,
      badge: "PySide6",
      desc: "Masaüstü Kaynak Kodları",
    },
    {
      id: "settings",
      label: "Ayarlar & Güvenlik",
      icon: Settings,
      badge: null,
      desc: "İzinler & Loglar",
    },
  ];

  return (
    <aside id="lifeos-sidebar" className="w-64 border-r border-slate-800/50 bg-[#0a0c10] flex flex-col justify-between select-none shrink-0 z-20">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white font-bold text-sm">
              Ω
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-base text-white tracking-tight">LifeOS</h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-500/30 font-bold">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">Digital Command Center</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group border ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border-blue-500/20 shadow-[0_0_12px_rgba(37,99,235,0.08)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${
                      isActive
                        ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
                        : "bg-slate-800/80 border-slate-700/60 text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Local AI Status Card */}
      <div className="p-3 border-t border-slate-800/50">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Local AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          </div>
          <p className="text-xs font-semibold text-slate-300">Ollama: Qwen / Llama-3</p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Sandbox Active • Local-First</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
