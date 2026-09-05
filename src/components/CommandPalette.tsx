import React, { useState, useEffect } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import {
  Search,
  FolderGit2,
  StickyNote,
  CheckSquare,
  Bot,
  Cpu,
  Sliders,
  Code2,
  ArrowRight,
  Zap,
} from "lucide-react";

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveTab,
    projects,
    setActiveProjectId,
    notes,
    tasks,
    connectSerial,
  } = useLifeOS();

  const [query, setQuery] = useState("");

  if (!isCommandPaletteOpen) return null;

  const handleSelect = (action: () => void) => {
    action();
    setIsCommandPaletteOpen(false);
    setQuery("");
  };

  const actions = [
    {
      title: "Open ESP32 Robot Project",
      category: "Projects",
      icon: FolderGit2,
      run: () => {
        setActiveProjectId("p1");
        setActiveTab("projects");
      },
    },
    {
      title: "Open Computer Vision Drone",
      category: "Projects",
      icon: FolderGit2,
      run: () => {
        setActiveProjectId("p2");
        setActiveTab("projects");
      },
    },
    {
      title: "Connect ESP32 (COM3 @ 115200 baud)",
      category: "Hardware",
      icon: Zap,
      run: () => {
        connectSerial("COM3", 115200);
        setActiveTab("hardware");
      },
    },
    {
      title: "Ask AI Assistant",
      category: "AI",
      icon: Bot,
      run: () => setActiveTab("ai"),
    },
    {
      title: "View System Telemetry & Monitor",
      category: "System",
      icon: Cpu,
      run: () => setActiveTab("dashboard"),
    },
    {
      title: "Browse Python PySide6 Source Code",
      category: "Code",
      icon: Code2,
      run: () => setActiveTab("python"),
    },
    {
      title: "Open Settings & Security Permissions",
      category: "Settings",
      icon: Sliders,
      run: () => setActiveTab("settings"),
    },
  ];

  // Also include matching notes
  const matchingNotes = notes
    .filter((n) => n.title.toLowerCase().includes(query.toLowerCase()) || n.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
    .slice(0, 3)
    .map((n) => ({
      title: `Note: ${n.title}`,
      category: "Notes",
      icon: StickyNote,
      run: () => setActiveTab("notes"),
    }));

  // Also include matching tasks
  const matchingTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .map((t) => ({
      title: `Task: ${t.title}`,
      category: "Tasks",
      icon: CheckSquare,
      run: () => setActiveTab("tasks"),
    }));

  const allItems = [...actions, ...matchingNotes, ...matchingTasks].filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#050608]/80 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_25px_rgba(37,99,235,0.25)] overflow-hidden backdrop-blur-xl">
        {/* Search input */}
        <div className="p-3.5 border-b border-slate-800/80 flex items-center gap-3">
          <Search className="w-4 h-4 text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Bir komut yazın veya arama yapın (ör: 'Robot', 'ESP32', 'Notlar')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsCommandPaletteOpen(false);
              if (e.key === "Enter" && allItems[0]) handleSelect(allItems[0].run);
            }}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800/80 text-slate-400 rounded-md border border-slate-700/60">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">Eşleşen sonuç bulunamadı.</div>
          ) : (
            allItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.run)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-blue-600/15 text-xs text-slate-200 group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <span>{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-3.5 py-2.5 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
          <span>
            Gezinmek için <kbd className="font-mono text-slate-400">↑</kbd> <kbd className="font-mono text-slate-400">↓</kbd>, seçmek için <kbd className="font-mono text-slate-400">Enter</kbd>
          </span>
          <span className="font-mono text-blue-400/80">LifeOS Command Center</span>
        </div>
      </div>
    </div>
  );
};
