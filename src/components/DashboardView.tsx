import React, { useState, useEffect } from "react";
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
  Radio,
  FileCode,
  Terminal,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Code2,
  BookOpen,
  Wifi,
  ExternalLink,
  Layers,
  Sparkles,
  Server,
} from "lucide-react";

// Realistic Circular Gauge (Matching aaPanel / Control Panel style in user's image)
const CircularGauge: React.FC<{
  value: number;
  label: string;
  sublabel: string;
  color?: "emerald" | "blue" | "indigo" | "amber" | "rose";
  unit?: string;
}> = ({ value, label, sublabel, color = "emerald", unit = "%" }) => {
  const percent = Math.min(Math.max(value, 0), 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const colorStyles = {
    emerald: { stroke: "#10b981", glow: "rgba(16,185,129,0.3)" },
    blue: { stroke: "#3b82f6", glow: "rgba(59,130,246,0.3)" },
    indigo: { stroke: "#6366f1", glow: "rgba(99,102,241,0.3)" },
    amber: { stroke: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
    rose: { stroke: "#f43f5e", glow: "rgba(244,63,94,0.3)" },
  }[color];

  return (
    <div className="flex flex-col items-center justify-center p-2 text-center select-none">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-800/80"
            strokeWidth="7"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={colorStyles.stroke}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${colorStyles.glow})` }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-sm font-bold font-mono text-white">
            {percent.toFixed(1)}
            <span className="text-[10px] text-slate-400 font-normal">{unit}</span>
          </span>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-200 mt-1">{label}</span>
      <span className="text-[10px] text-slate-400 truncate max-w-[130px]">{sublabel}</span>
    </div>
  );
};

export const DashboardView: React.FC = () => {
  const {
    systemStats,
    activeProject,
    tasks,
    toggleTask,
    addTask,
    activities,
    serialLogs,
    isSerialConnected,
    selectedPort,
    sendSerialCommand,
    setActiveTab,
    notes,
    addActivity,
  } = useLifeOS();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [activeTrafficTab, setActiveTrafficTab] = useState<"traffic" | "disk">("traffic");

  // Real-time Traffic Wave Simulation Points (Matching the screenshot's dual wave area chart)
  const [trafficHistory, setTrafficHistory] = useState<Array<{ time: string; up: number; down: number }>>([
    { time: "10:40:10", up: 320, down: 110 },
    { time: "10:40:15", up: 410, down: 140 },
    { time: "10:40:20", up: 280, down: 90 },
    { time: "10:40:25", up: 520, down: 210 },
    { time: "10:40:30", up: 390, down: 160 },
    { time: "10:40:35", up: 440, down: 130 },
    { time: "10:40:40", up: 380, down: 180 },
    { time: "10:40:45", up: 600, down: 240 },
    { time: "10:40:50", up: 420, down: 150 },
    { time: "10:40:55", up: 405, down: 128 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const baseUp = parseFloat(systemStats.network.uploadMbps || "1.2") * 180 + Math.random() * 80;
      const baseDown = parseFloat(systemStats.network.downloadMbps || "3.4") * 40 + Math.random() * 40;

      setTrafficHistory((prev) => [
        ...prev.slice(1),
        { time: timeStr, up: Math.round(baseUp), down: Math.round(baseDown) },
      ]);
    }, 2500);
    return () => clearInterval(timer);
  }, [systemStats.network]);

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

  // RAM calculations
  const ramUsedGB = (systemStats.ram.usedBytes / 1024 ** 3).toFixed(1);
  const ramTotalGB = (systemStats.ram.totalBytes / 1024 ** 3).toFixed(1);

  return (
    <div id="dashboard-view" className="p-5 lg:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* 1. TOP SYSTEM STATUS RIBBON (aaPanel / Familiar Server Control Panel Header) */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-400 font-semibold">System:</span>
            <span className="text-white font-medium">LifeOS x86_64 (Python 3.12.3)</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1 font-mono text-slate-400">
            <span>Uptime:</span>
            <span className="text-blue-400 font-semibold">
              {Math.floor(systemStats.uptime / 86400)} Gün {Math.floor((systemStats.uptime % 86400) / 3600)} Saat
            </span>
          </div>
          <span className="text-slate-700 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <span>Kernel:</span>
            <span className="text-slate-300">6.1.0-lts</span>
          </div>
        </div>

        {/* Quick Diagnostic Controls */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-medium">
            RENEW: 75 d
          </span>
          <button
            onClick={() => addActivity("file_edit", "Sistem servisleri yenilendi ve cache temizlendi.")}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3 text-blue-400" />
            <span>Yenile</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition-colors"
          >
            Onar / Fix
          </button>
          <button
            onClick={() => setActiveTab("lifecode")}
            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-[0_0_12px_rgba(37,99,235,0.4)] text-[11px] transition-all flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>LifeCode IDE</span>
          </button>
        </div>
      </div>

      {/* 2. CIRCULAR GAUGES ROW (Status Section from uploaded screenshot) */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-white">Status / Sistem Durumu</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {systemStats.cpu.cores} Çekirdek Aktif • {systemStats.cpu.model.split(" ")[0]}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 justify-items-center">
          {/* Gauge 1: Load Status */}
          <CircularGauge
            value={Math.max(systemStats.cpu.usagePercent * 0.7, 6.5)}
            label="Load status"
            sublabel="Running smoothly (Stabil)"
            color="emerald"
            unit="%"
          />

          {/* Gauge 2: CPU Usage */}
          <CircularGauge
            value={systemStats.cpu.usagePercent}
            label="CPU usage"
            sublabel={`${systemStats.cpu.cores} Core(s) - ${systemStats.cpu.tempC}°C`}
            color={systemStats.cpu.usagePercent > 80 ? "rose" : "emerald"}
            unit="%"
          />

          {/* Gauge 3: RAM Usage */}
          <CircularGauge
            value={systemStats.ram.usagePercent}
            label="RAM usage"
            sublabel={`${ramUsedGB} GB / ${ramTotalGB} GB`}
            color={systemStats.ram.usagePercent > 85 ? "rose" : "blue"}
            unit="%"
          />

          {/* Gauge 4: Disk (/) Partition */}
          <CircularGauge
            value={systemStats.disk.usagePercent}
            label="Disk ( / )"
            sublabel={`${systemStats.disk.freeGB} GB Boş Alan`}
            color="amber"
            unit="%"
          />

          {/* Gauge 5: Hardware Link / ESP32 */}
          <CircularGauge
            value={isSerialConnected ? 99.4 : 0}
            label={isSerialConnected ? `ESP32 (${selectedPort})` : "Donanım Portu"}
            sublabel={isSerialConnected ? "115200 Baud Aktif" : "Cihaz Bekleniyor"}
            color={isSerialConnected ? "indigo" : "amber"}
            unit="%"
          />
        </div>
      </div>

      {/* 3. OVERVIEW METRICS STRIP (Overview row like Site:10, FTP:2, DB:5 in user image) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setActiveTab("projects")}
          className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
              Aktif Projeler
            </span>
            <p className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-blue-400 transition-colors">
              3
            </p>
            <span className="text-[10px] text-slate-500 font-mono">{activeProject.name}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab("hardware")}
          className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
              COM Donanım
            </span>
            <p className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-emerald-400 transition-colors">
              {isSerialConnected ? "1" : "0"}
            </p>
            <span className="text-[10px] text-slate-500 font-mono">
              {isSerialConnected ? `${selectedPort} (ESP32)` : "Çevrimdışı"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab("tasks")}
          className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
              Açık Görevler
            </span>
            <p className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-indigo-400 transition-colors">
              {tasks.filter((t) => !t.completed).length}
            </p>
            <span className="text-[10px] text-slate-500 font-mono">Toplam {tasks.length} Görev</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab("memory")}
          className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider">
              Hafıza & Notlar
            </span>
            <p className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-amber-400 transition-colors">
              {notes.length}
            </p>
            <span className="text-[10px] text-slate-500 font-mono">SQLite FTS5 Bellek</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. REAL-TIME TRAFFIC WAVE CHART + RUNNING PROCESSES/CONTAINERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Real-time Traffic Area Wave Chart (7 cols) - Inspired directly by bottom-right of user image */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTrafficTab("traffic")}
                  className={`text-xs font-semibold pb-1 border-b-2 transition-all ${
                    activeTrafficTab === "traffic"
                      ? "border-blue-500 text-white"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Traffic (Ağ Trafiği)
                </button>
                <button
                  onClick={() => setActiveTrafficTab("disk")}
                  className={`text-xs font-semibold pb-1 border-b-2 transition-all ${
                    activeTrafficTab === "disk"
                      ? "border-blue-500 text-white"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Disk I/O
                </button>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Upstream: 405.52 KB/s
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Downstream: 127.80 KB/s
                </span>
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-[11px] font-mono text-slate-400">
              <div>
                <span className="text-slate-500 text-[10px] block">Unit:</span>
                <span className="text-slate-200 font-semibold">KB/s</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Total Sent:</span>
                <span className="text-slate-200 font-semibold">187.34 GB</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Total Received:</span>
                <span className="text-slate-200 font-semibold">68.12 GB</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Packet Rate:</span>
                <span className="text-emerald-400 font-semibold">1,420 p/s</span>
              </div>
            </div>
          </div>

          {/* Smooth SVG Area Wave Graphic */}
          <div className="py-4">
            <svg viewBox="0 0 500 130" className="w-full h-32 overflow-visible">
              <defs>
                <linearGradient id="upGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="downGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Upstream Area & Path (Orange) */}
              <path
                d={`M 0,120 ${trafficHistory
                  .map((pt, idx) => `L ${(idx * 500) / 9},${120 - (pt.up / 700) * 100}`)
                  .join(" ")} L 500,120 Z`}
                fill="url(#upGrad)"
              />
              <path
                d={`M 0,${120 - (trafficHistory[0].up / 700) * 100} ${trafficHistory
                  .map((pt, idx) => `L ${(idx * 500) / 9},${120 - (pt.up / 700) * 100}`)
                  .join(" ")}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />

              {/* Downstream Area & Path (Blue) */}
              <path
                d={`M 0,120 ${trafficHistory
                  .map((pt, idx) => `L ${(idx * 500) / 9},${120 - (pt.down / 700) * 100}`)
                  .join(" ")} L 500,120 Z`}
                fill="url(#downGrad)"
              />
              <path
                d={`M 0,${120 - (trafficHistory[0].down / 700) * 100} ${trafficHistory
                  .map((pt, idx) => `L ${(idx * 500) / 9},${120 - (pt.down / 700) * 100}`)
                  .join(" ")}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            </svg>

            {/* X-axis timeline */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
              {trafficHistory.slice(0, 5).map((t, idx) => (
                <span key={idx}>{t.time}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Running Containers & Hardware Nodes (5 cols) - Inspired directly by overlay in user image */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                Çalışan Süreçler & Donanım
              </h4>
              <p className="text-[10px] text-slate-400">Running nodes & containers</p>
            </div>
            <button
              onClick={() => addActivity("file_edit", "Süreçler ve donanım düğümleri yenilendi.")}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-mono transition-colors"
            >
              Yenile
            </button>
          </div>

          {/* Overall Usage Meters */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">CPU usage</span>
                <span className="text-emerald-400 font-bold">1.5 %</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[15%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Memory usage</span>
                <span className="text-blue-400 font-bold">25.8 %</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[26%]" />
              </div>
            </div>
          </div>

          {/* Individual Process Cards */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {[
              {
                id: "p1",
                name: "esp32-serial-driver",
                tag: "COM3 (115200)",
                status: isSerialConnected ? "Canlı Akış" : "Bağlı Değil",
                cpu: isSerialConnected ? "0.4%" : "0.0%",
                ram: "18.2 MB",
                color: "emerald",
              },
              {
                id: "p2",
                name: "ollama-local-ai",
                tag: "qwen2.5:7b",
                status: "Dinlemede",
                cpu: "3.2%",
                ram: "1,420 MB",
                color: "blue",
              },
              {
                id: "p3",
                name: "lifeos-telemetry-daemon",
                tag: "daemon:v2.4",
                status: "Aktif",
                cpu: "0.2%",
                ram: "34.5 MB",
                color: "indigo",
              },
              {
                id: "p4",
                name: "screen-analyzer-engine",
                tag: "vision:gemini",
                status: "Hazır",
                cpu: "0.1%",
                ram: "58.0 MB",
                color: "amber",
              },
            ].map((node) => (
              <div
                key={node.id}
                className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-200 text-[11px]">{node.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {node.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {node.status}
                  </span>
                </div>

                <div className="text-right font-mono text-[10px] text-slate-400 space-y-0.5">
                  <div>CPU: <span className="text-slate-200">{node.cpu}</span></div>
                  <div>RAM: <span className="text-slate-200">{node.ram}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. ACTIVE PROJECT & HARDWARE REAL-TIME CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Project Card (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-500/30 font-semibold">
                  AKTİF PROJE
                </span>
                <span className="text-xs text-slate-400 font-mono">{activeProject.path}</span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-blue-400" />
                {activeProject.name}
              </h3>
              <p className="text-xs text-slate-400">{activeProject.description}</p>
            </div>

            <button
              onClick={() => setActiveTab("projects")}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>Detaylar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Geliştirme İlerlemesi</span>
              <span className="font-mono text-blue-400 font-bold">{activeProject.progress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-700 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${activeProject.progress}%` }}
              />
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono uppercase">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                Son Dosya
              </div>
              <p className="font-medium text-slate-200 mt-1 truncate">{activeProject.lastModifiedFile}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono uppercase">
                <Radio className="w-3.5 h-3.5 text-indigo-400" />
                Git Durumu
              </div>
              <p className="font-medium text-slate-200 mt-1 truncate">
                {activeProject.git.branch} ({activeProject.git.changedFiles} mod)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono uppercase">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                Açık Görevler
              </div>
              <p className="font-medium text-slate-200 mt-1 font-mono">
                {tasks.filter((t) => !t.completed && t.projectId === activeProject.id).length} Görev
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
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

        {/* ESP32 Hardware Quick Terminal (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                Donanım Akışı (ESP32)
              </h4>
            </div>
            <button
              onClick={() => setActiveTab("hardware")}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Tam Ekran
            </button>
          </div>

          {/* Mini Live Terminal */}
          <div className="h-40 rounded-xl bg-[#08090d] border border-slate-800/80 p-3 font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1">
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
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Hızlı Komutlar</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => sendSerialCommand("LED ON")}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-200 border border-slate-700 transition-colors"
              >
                LED ON
              </button>
              <button
                onClick={() => sendSerialCommand("MOTOR 120")}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-200 border border-slate-700 transition-colors"
              >
                MOTOR 120
              </button>
              <button
                onClick={() => sendSerialCommand("STATUS")}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-200 border border-slate-700 transition-colors"
              >
                STATUS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM ROW: TASKS TODO & RECENT ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Todo Tasks (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-400" />
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                Görevler & Yapılacaklar ({tasks.filter((t) => !t.completed).length})
              </h4>
            </div>

            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs text-blue-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Görev</span>
            </button>
          </div>

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
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
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

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
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
            ))}
          </div>
        </div>

        {/* Recent Activity Feed (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                Son Aktiviteler
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Canlı Günlük</span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {activities.map((act, idx) => (
              <div key={`${act.id}-${idx}`} className="flex items-start gap-2.5 text-xs">
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
