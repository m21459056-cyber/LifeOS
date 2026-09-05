import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import { StickyNote, Plus, Search, Tag, Trash2, Bot, Calendar, Sparkles } from "lucide-react";

export const NotesView: React.FC = () => {
  const { notes, addNote, deleteNote, activeProject, sendChatMessage, setActiveTab, getAccentClasses } = useLifeOS();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");

  const accent = getAccentClasses();

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? n.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addNote({
      title: title.trim(),
      content: content.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ["General"],
      projectId: activeProject.id,
    });

    setTitle("");
    setContent("");
    setTagInput("");
    setIsCreating(false);
  };

  const handleAskAIAboutNotes = () => {
    setActiveTab("ai");
    sendChatMessage(
      `Tüm kayıtlı LifeOS notlarımı incele ve aralarındaki bağlantıları özetle:\n${notes
        .map((n) => `- [${n.title} (${n.tags.join(",")})]: ${n.content}`)
        .join("\n")}`
    );
  };

  return (
    <div id="notes-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-blue-400" />
            <span>NOTLAR & BİLGİ BELLEĞİ</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Projeleriniz, donanım pinout şemalarınız ve teknik püf noktalarınız
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAskAIAboutNotes}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Bellek Analizi</span>
          </button>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Not Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter & Tag Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md">
        <div className="flex items-center gap-2 flex-1 max-w-sm bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Notlarda ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-slate-200 outline-none placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              selectedTag === null
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_8px_rgba(37,99,235,0.2)]"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            Tümü ({notes.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                selectedTag === tag
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_8px_rgba(37,99,235,0.2)]"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Tag className="w-2.5 h-2.5" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inline Create Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/40 shadow-2xl backdrop-blur-xl space-y-3 animate-in fade-in duration-100"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-white">Yeni Teknik Not Oluştur</span>
            <span className="text-[11px] text-slate-500 font-mono">Proje: {activeProject.name}</span>
          </div>

          <input
            type="text"
            placeholder="Not Başlığı (ör: ESP32 I2C Adresleri & Hata Çözümü)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-100 outline-none focus:border-blue-500"
          />

          <textarea
            placeholder="Not içeriği, kod parçacıkları veya şema notları..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full bg-[#08090d] p-3 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono outline-none focus:border-blue-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <input
              type="text"
              placeholder="Etiketler (virgülle ayırın: ESP32, Python, OpenCV)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 max-w-sm bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 outline-none"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Notu Kaydet
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:border-blue-500/40 backdrop-blur-md hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors">
                  {note.title}
                </h4>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#08090d] border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                {note.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex flex-wrap gap-1">
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-[10px] font-mono text-blue-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <span className="text-slate-500 font-mono text-[10px]">{note.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
