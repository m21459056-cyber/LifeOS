import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import { Database, Search, StickyNote, CheckSquare, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

export const MemorySearchView: React.FC = () => {
  const { notes, tasks, chatMessages, setActiveTab, getAccentClasses } = useLifeOS();
  const [query, setQuery] = useState("");
  const accent = getAccentClasses();

  const searchLower = query.toLowerCase();

  const matchingNotes = notes
    .filter((n) => !query || n.title.toLowerCase().includes(searchLower) || n.content.toLowerCase().includes(searchLower))
    .map((n) => ({
      type: "note" as const,
      id: n.id,
      title: n.title,
      snippet: n.content.slice(0, 140) + "...",
      badge: n.tags.join(", "),
      date: n.updatedAt,
    }));

  const matchingTasks = tasks
    .filter((t) => !query || t.title.toLowerCase().includes(searchLower))
    .map((t) => ({
      type: "task" as const,
      id: t.id,
      title: t.title,
      snippet: `Öncelik: ${t.priority} • Durum: ${t.completed ? "Tamamlandı" : "Bekliyor"}`,
      badge: t.priority,
      date: t.dueDate || "Belirtilmedi",
    }));

  const matchingChats = chatMessages
    .filter((c) => !query || c.content.toLowerCase().includes(searchLower))
    .map((c) => ({
      type: "chat" as const,
      id: c.id,
      title: `Konuşma (${c.role === "user" ? "Kullanıcı" : "AI Asistanı"})`,
      snippet: c.content.slice(0, 140) + "...",
      badge: c.model || "Local",
      date: c.timestamp,
    }));

  const allResults = [...matchingNotes, ...matchingTasks, ...matchingChats];

  return (
    <div id="memory-search-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <span>SEMANTİK HAFIZA & TAM METİN ARAMA</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geçmiş konuşmalar, notlar, görevler ve kodlar arasında SQLite tabanlı hızlı arama
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800/80 backdrop-blur-md">
          SQLite FTS5 Aktif • {allResults.length} Kayıt
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md shadow-xl flex items-center gap-3">
        <Search className="w-4 h-4 text-blue-400 shrink-0" />
        <input
          type="text"
          placeholder="Hafızada ara (ör: 'ESP32 pin', 'kamera', 'PWM duty cycle', 'OpenCV')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-slate-500 hover:text-slate-300 font-mono"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {allResults.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:border-blue-500/40 backdrop-blur-md hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all flex items-start justify-between gap-4 group"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  item.type === "note"
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/30"
                    : item.type === "task"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                }`}
              >
                {item.type === "note" ? (
                  <StickyNote className="w-4 h-4" />
                ) : item.type === "task" ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-xs text-white group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400">
                    {item.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono line-clamp-2 leading-relaxed">
                  {item.snippet}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono pt-1">
                  <span>{item.date}</span>
                  {item.badge && (
                    <>
                      <span>•</span>
                      <span className="text-blue-400">{item.badge}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab(item.type === "note" ? "notes" : item.type === "task" ? "tasks" : "ai")}
              className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/40 transition-all shrink-0"
              title="Aç"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
