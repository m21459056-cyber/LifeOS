import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import {
  Search,
  Sliders,
  Cpu,
  Zap,
  Bell,
  HardDrive,
  Sparkles,
  Terminal,
  X,
  CheckCircle2,
  Code2,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    systemStats,
    activeProject,
    isSerialConnected,
    selectedPort,
    setIsCommandPaletteOpen,
    setIsSetupWizardOpen,
    notifications,
    dismissNotification,
    getAccentClasses,
    setActiveTab,
    activeTab,
  } = useLifeOS();

  const [showNotifications, setShowNotifications] = useState(false);
  const accent = getAccentClasses();

  return (
    <header id="lifeos-header" className="h-16 border-b border-slate-800/50 bg-[#050608]/80 backdrop-blur-md px-6 lg:px-8 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Quick status & Active project badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
          <span className="text-slate-500 font-mono text-[10px] uppercase">PROJE:</span>
          <button
            onClick={() => setActiveTab("projects")}
            className="text-slate-200 hover:text-blue-400 font-semibold transition-colors flex items-center gap-1"
          >
            {activeProject.name}
          </button>
        </div>

        {/* Hardware Status Pill */}
        <button
          id="btn-header-hardware"
          onClick={() => setActiveTab("hardware")}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            isSerialConnected
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
              : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700"
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${isSerialConnected ? "text-emerald-400" : "text-slate-500"}`} />
          <span>{isSerialConnected ? `${selectedPort} Bağlı` : "Donanım Çevrimdışı"}</span>
        </button>

        {/* Ecosystem Quick Switcher */}
        <button
          id="btn-header-ecosystem-toggle"
          onClick={() => setActiveTab(activeTab === "lifecode" ? "dashboard" : "lifecode")}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            activeTab === "lifecode"
              ? "bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-[0_0_10px_rgba(37,99,235,0.2)]"
              : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:text-blue-400 hover:border-slate-700"
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          <span>{activeTab === "lifecode" ? "LifeOS Command" : "LifeCode IDE"}</span>
        </button>
      </div>

      {/* Center: Global Search Bar / Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          id="btn-global-search-trigger"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 hover:border-blue-500/30 text-xs text-slate-400 transition-all group shadow-[0_0_10px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span className="truncate">Projeler, dosyalar, notlar, cihazlar ara...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800/80 text-slate-400 rounded border border-slate-700">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Telemetry mini stats, notifications, wizard */}
      <div className="flex items-center gap-3">
        {/* Live Mini Gauges & Uptime */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800/70 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400 text-[11px]">CPU</span>
            <span className="font-semibold text-white">{systemStats.cpu.usagePercent}%</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 text-[11px]">RAM</span>
            <span className="font-semibold text-white">{systemStats.ram.usagePercent}%</span>
          </div>
        </div>

        {/* Uptime Badge from Immersive UI */}
        <div className="text-right hidden sm:block px-2">
          <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">Uptime</p>
          <p className="text-xs font-mono text-blue-400">
            {Math.floor(systemStats.uptime / 3600)}:{String(Math.floor((systemStats.uptime % 3600) / 60)).padStart(2, "0")}:{String(systemStats.uptime % 60).padStart(2, "0")}
          </p>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-slate-300 relative transition-colors"
            title="Bildirimler"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Bildirimler ({notifications.length})
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-4">Yeni bildirim yok</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-start justify-between gap-2"
                    >
                      <div>
                        <p className="font-medium text-slate-200">{n.title}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <button
                        onClick={() => dismissNotification(n.id)}
                        className="text-slate-500 hover:text-slate-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Setup Wizard Button */}
        <button
          id="btn-open-wizard"
          onClick={() => setIsSetupWizardOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          title="Kurulum Sihirbazı"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sihirbaz</span>
        </button>

        {/* Settings Shortcut */}
        <button
          id="btn-open-settings"
          onClick={() => setActiveTab("settings")}
          className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Ayarlar"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* User Identity Avatar from Immersive UI */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] cursor-pointer">
          Ω
        </div>
      </div>
    </header>
  );
};
