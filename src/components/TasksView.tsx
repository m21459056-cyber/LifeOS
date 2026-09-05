import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import { CheckSquare, Plus, Trash2, Calendar, FolderGit2, Bot, Check, AlertCircle } from "lucide-react";

export const TasksView: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, activeProject, setActiveTab, sendChatMessage, getAccentClasses } =
    useLifeOS();

  const [filter, setFilter] = useState<"all" | "active" | "completed" | "high">("all");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [dueDate, setDueDate] = useState("Bugün");
  const [isAdding, setIsAdding] = useState(false);

  const accent = getAccentClasses();

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    if (filter === "high") return t.priority === "High" && !t.completed;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      completed: false,
      priority,
      projectId: activeProject.id,
      dueDate,
    });
    setTitle("");
    setIsAdding(false);
  };

  const handlePlanWithAI = () => {
    setActiveTab("ai");
    sendChatMessage(
      `Aktif projemiz olan \`${activeProject.name}\` için sonraki 3 teknik adımı ve görev planını maddeler halinde hazırla.`
    );
  };

  return (
    <div id="tasks-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <span>GÖREVLER & YOL HARİTASI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Projelerinizi hedefe ulaştıracak teknik görev ve aksiyon listesi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePlanWithAI}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI ile Görev Planla</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Görev</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md w-fit text-xs">
        {[
          { id: "all", label: `Tümü (${tasks.length})` },
          { id: "active", label: `Bekleyen (${tasks.filter((t) => !t.completed).length})` },
          { id: "high", label: `Yüksek Öncelik (${tasks.filter((t) => t.priority === "High" && !t.completed).length})` },
          { id: "completed", label: `Tamamlanan (${tasks.filter((t) => t.completed).length})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filter === f.id
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_8px_rgba(37,99,235,0.2)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Inline Create Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/40 shadow-2xl backdrop-blur-xl space-y-3 animate-in fade-in duration-100"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-white">Yeni Görev Tanımla</span>
            <span className="text-[11px] text-slate-400 font-mono">Proje: {activeProject.name}</span>
          </div>

          <input
            type="text"
            placeholder="Görev tanımı (ör: ESP32 I2C haberleşme zamanlamasını kontrol et)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-100 outline-none focus:border-blue-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Öncelik:</span>
                {(["Low", "Medium", "High"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono border ${
                      priority === p
                        ? "bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-[0_0_8px_rgba(37,99,235,0.2)]"
                        : "border-slate-800 text-slate-500"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Tarih:</span>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px] text-slate-300 font-mono outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Görevi Kaydet
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
            Bu filtrede görev bulunmuyor.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 backdrop-blur-md ${
                task.completed
                  ? "bg-slate-950/40 border-slate-800/40 text-slate-500 line-through"
                  : "bg-slate-900/30 border-slate-800/50 hover:border-blue-500/30 text-slate-200 hover:shadow-[0_0_12px_rgba(37,99,235,0.1)]"
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    task.completed
                      ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                      : "border-slate-700 bg-slate-950 hover:border-blue-500"
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div>
                  <p className={`text-xs font-medium ${task.completed ? "text-slate-500" : "text-white"}`}>{task.title}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-0.5">
                    {task.dueDate && <span>Son Tarih: {task.dueDate}</span>}
                    <span>•</span>
                    <span>{task.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    task.priority === "High"
                      ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                      : task.priority === "Medium"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {task.priority}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                  title="Görevi Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
