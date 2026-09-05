import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import {
  Cpu,
  HardDrive,
  Activity,
  FolderGit2,
  CheckSquare,
  Zap,
  Plus,
  ArrowUpRight,
  Clock,
  Flame,
  Radio,
  FileCode,
  Terminal,
  ShieldAlert,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    systemStats,
    activeProject,
    tasks,
    toggleTask,
    addTask,
    deleteTask,
    activities,
    serialLogs,
    isSerialConnected,
    selectedPort,
    sendSerialCommand,
    setActiveTab,
    getAccentClasses,
    notes,
  } = useLifeOS();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const accent = getAccentClasses();

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      projectId: activeProject.id,
      dueDate: "Bu Hafta",
    });
    setNewTaskTitle("");
    setIsAddingTask(false);
  };

  return (
    <div id="dashboard-view" className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* 1. Greeting & Command Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">
            GOOD EVENING, ARCHITECT
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            System Diagnostics & Multi-Node Hardware Command Active
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("ai")}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2"
          >
            <span>AI Asistanına Danış</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Live System Status Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* CPU */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">CPU</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-light text-white font-mono">
              {systemStats.cpu.usagePercent}%
            </span>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-amber-400" />
              {systemStats.cpu.tempC}°C
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                systemStats.cpu.usagePercent > 80 ? "bg-rose-500" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              }`}
              style={{ width: `${systemStats.cpu.usagePercent}%` }}
            />
          </div>
        </div>

        {/* RAM */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">RAM</span>
            <HardDrive className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-light text-white font-mono">
              {systemStats.ram.usagePercent}%
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {(systemStats.ram.usedBytes / 1024 ** 3).toFixed(1)}GB
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500 rounded-full"
              style={{ width: `${systemStats.ram.usagePercent}%` }}
            />
          </div>
        </div>

        {/* GPU */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">GPU</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-light text-white font-mono">
              {systemStats.gpu.usagePercent}%
            </span>
            <span className="text-[10px] text-emerald-400/80 font-mono">{systemStats.gpu.tempC}°C</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500 rounded-full"
              style={{ width: `${systemStats.gpu.usagePercent}%` }}
            />
          </div>
        </div>

        {/* DISK */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">DISK</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-light text-white font-mono">
              {systemStats.disk.usagePercent}%
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{systemStats.disk.freeGB}GB Boş</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-500 rounded-full"
              style={{ width: `${systemStats.disk.usagePercent}%` }}
            />
          </div>
        </div>

        {/* NETWORK */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">AĞ (I/O)</span>
            <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">↓ {systemStats.network.downloadMbps}</span>
              <span className="text-slate-500">Mbps</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">↑ {systemStats.network.uploadMbps}</span>
              <span className="text-slate-500">Mbps</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] w-3/4 rounded-full" />
          </div>
        </div>

        {/* UPTIME */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl backdrop-blur-sm space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">UPTIME</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-light text-white font-mono">
              {Math.floor(systemStats.uptime / 3600)}h {Math.floor((systemStats.uptime % 3600) / 60)}m
            </span>
          </div>
          <div className="text-[10px] text-slate-500 truncate font-mono">
            {systemStats.hostname}
          </div>
        </div>
      </div>

      {/* 3. Middle Grid: Active Project Card + Hardware Quick Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Project Card (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-md space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-500/30 font-semibold">
                  AKTİF PROJE
                </span>
                <span className="text-xs text-slate-400 font-mono">{activeProject.path}</span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-blue-400" />
                {activeProject.name}
              </h3>
              <p className="text-xs text-slate-400">{activeProject.description}</p>
            </div>

            <button
              onClick={() => setActiveTab("projects")}
              className="text-xs font-medium text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <span>Detaylar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">İlerleme Durumu</span>
              <span className="font-mono text-blue-400 font-bold">{activeProject.progress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
              <div
                className="h-full rounded-full transition-all duration-700 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${activeProject.progress}%` }}
              />
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono uppercase">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                Son Dosya
              </div>
              <p className="font-medium text-slate-200 mt-1 truncate">{activeProject.lastModifiedFile}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono uppercase">
                <Radio className="w-3.5 h-3.5 text-indigo-400" />
                Git Durumu
              </div>
              <p className="font-medium text-slate-200 mt-1 truncate">
                {activeProject.git.branch} ({activeProject.git.changedFiles} mod)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono uppercase">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                Açık Görevler
              </div>
              <p className="font-medium text-slate-200 mt-1 font-mono">
                {tasks.filter((t) => !t.completed && t.projectId === activeProject.id).length} Görev
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono uppercase">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Donanım
              </div>
              <p className="font-medium text-slate-200 mt-1 truncate">
                {isSerialConnected ? `${selectedPort} Aktif` : "Bağlı Değil"}
              </p>
            </div>
          </div>
        </div>

        {/* ESP32 / Hardware Quick Monitor (1 col) */}
        <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-md flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shadow-[0_0_6px_#10b981]" />
              <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
                Donanım Akışı (ESP32)
              </h4>
            </div>
            <button
              onClick={() => setActiveTab("hardware")}
              className="text-[11px] text-blue-400 hover:underline"
            >
              Tam Ekran
            </button>
          </div>

          {/* Mini Live Terminal */}
          <div className="h-44 rounded-xl bg-[#08090d] border border-slate-800/80 p-3 font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1">
            {serialLogs.slice(-6).map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes(">>>")
                    ? "text-blue-400 font-bold"
                    : log.includes("connected")
                    ? "text-emerald-400"
                    : "text-slate-400"
                }
              >
                {log}
              </div>
            ))}
          </div>

          {/* Quick Hardware Controls */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Hızlı Komutlar</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => sendSerialCommand("LED ON")}
                className="px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono text-slate-200 border border-slate-700/80 transition-colors"
              >
                LED ON
              </button>
              <button
                onClick={() => sendSerialCommand("MOTOR 120")}
                className="px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono text-slate-200 border border-slate-700/80 transition-colors"
              >
                MOTOR 120
              </button>
              <button
                onClick={() => sendSerialCommand("STATUS")}
                className="px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono text-slate-200 border border-slate-700/80 transition-colors"
              >
                STATUS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Tasks / Todo System + Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Todo Tasks (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-400" />
              <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
                Görevler & Yapılacaklar ({tasks.filter((t) => !t.completed).length})
              </h4>
            </div>

            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs text-blue-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Görev</span>
            </button>
          </div>

          {/* Inline Add Task Form */}
          {isAddingTask && (
            <form onSubmit={handleCreateTask} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <input
                type="text"
                autoFocus
                placeholder="Görev başlığı girin..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-100 outline-none placeholder-slate-500"
              />
              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 text-[11px]">Öncelik:</span>
                  {(["Low", "Medium", "High"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono border ${
                        newTaskPriority === p
                          ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                          : "border-slate-800 text-slate-500"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Task Items List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  task.completed
                    ? "bg-slate-950/40 border-slate-800/40 text-slate-500 line-through"
                    : "bg-slate-900/40 border-slate-800/60 text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-xs font-medium">{task.title}</p>
                    {task.dueDate && (
                      <span className="text-[10px] text-slate-500 font-mono">Son Tarih: {task.dueDate}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed (1 col) */}
        <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
                Son Aktiviteler
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Canlı Günlük</span>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{act.text}</p>
                  <span className="text-[10px] text-slate-500">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
