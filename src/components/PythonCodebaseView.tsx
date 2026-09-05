import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import { Code2, Copy, Check, Terminal, FileCode, Download, Folder, Play } from "lucide-react";

export const PythonCodebaseView: React.FC = () => {
  const { getAccentClasses } = useLifeOS();
  const [copied, setCopied] = useState<string | null>(null);

  const pythonFiles = [
    {
      name: "run.bat",
      path: "lifeos/run.bat",
      type: "script",
      desc: "Windows Tek Tıkla Başlatma Scripti (Venv, pip install, main.py)",
      code: `@echo off
title LifeOS Desktop Command Center
echo ========================================================
echo         L I F E O S   C O M M A N D   C E N T E R
echo ========================================================
if not exist "venv" (
    echo [1/3] Python sanal ortami (venv) olusturuluyor...
    python -m venv venv
)
echo [2/3] Bagimliliklar kontrol ediliyor...
call venv\\Scripts\\activate.bat
pip install -r requirements.txt --quiet
echo [3/3] LifeOS PySide6 Masaustu Baslatiliyor...
python main.py
pause`,
    },
    {
      name: "main.py",
      path: "lifeos/main.py",
      type: "python",
      desc: "PySide6 & SQLite Desktop Ana Giriş Noktası",
      code: `import sys
import os
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).parent))

from app.database.connection import init_db
from app.core.config import config_manager
from app.system.monitor import system_monitor

def main():
    print("=" * 60)
    print("      L I F E O S   C O M M A N D   C E N T E R")
    print("=" * 60)
    print("1. Initializing SQLite Database & Schema...")
    init_db()

    print("2. Loading configuration...")
    cfg = config_manager.load()
    accent = cfg.get("appearance", {}).get("accent_color", "#06b6d4")
    print(f"   Theme: Dark | Accent: {accent}")

    print("3. Starting Non-blocking System Telemetry Worker...")
    system_monitor.start(interval=1.5)

    try:
        from PySide6.QtWidgets import QApplication
        from ui.main_window import MainWindow

        app = QApplication(sys.argv)
        app.setApplicationName("LifeOS")
        app.setStyle("Fusion")

        window = MainWindow()
        window.show()
        sys.exit(app.exec())
    except ImportError:
        print("[Notice] PySide6 not installed. Run: pip install -r requirements.txt")

if __name__ == "__main__":
    main()`,
    },
    {
      name: "models.py",
      path: "lifeos/app/database/models.py",
      type: "python",
      desc: "SQLAlchemy Veritabanı Modelleri (Project, Note, Task, Hardware, Chat)",
      code: `from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import declarative_base, relationship
import datetime

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), nullable=False)
    path = Column(String(255), nullable=False)
    description = Column(Text, default="")
    progress = Column(Integer, default=0)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    title = Column(String(255), nullable=False)
    completed = Column(Boolean, default=False)
    priority = Column(String(50), default="Medium")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)`,
    },
    {
      name: "monitor.py",
      path: "lifeos/app/system/monitor.py",
      type: "python",
      desc: "psutil Tabanlı Arka Plan Telemetri Servisi (Non-blocking Thread)",
      code: `import psutil
import threading
import time
import platform

class SystemMonitor:
    def __init__(self):
        self._running = False
        self._thread = None
        self.stats = {
            "cpu_percent": 0.0,
            "cpu_freq_current": 0.0,
            "cpu_temp": 45.0,
            "ram_percent": 0.0,
            "ram_used_gb": 0.0,
            "ram_total_gb": 0.0,
            "disk_percent": 0.0,
            "disk_free_gb": 0.0,
            "net_sent_mb": 0.0,
            "net_recv_mb": 0.0,
            "boot_time": psutil.boot_time(),
            "uptime_seconds": 0,
            "hostname": platform.node(),
            "platform": platform.platform()
        }

    def start(self, interval=1.5):
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._monitor_loop, args=(interval,), daemon=True)
        self._thread.start()

    def _monitor_loop(self, interval):
        while self._running:
            try:
                self.stats["cpu_percent"] = psutil.cpu_percent(interval=None)
                ram = psutil.virtual_memory()
                self.stats["ram_percent"] = ram.percent
                self.stats["ram_used_gb"] = round(ram.used / (1024**3), 2)
                self.stats["ram_total_gb"] = round(ram.total / (1024**3), 2)
            except Exception:
                pass
            time.sleep(interval)

system_monitor = SystemMonitor()`,
    },
    {
      name: "serial_manager.py",
      path: "lifeos/app/hardware/serial_manager.py",
      type: "python",
      desc: "pyserial Donanım Yöneticisi (ESP32 / Arduino Auto-Detect & Threaded Reader)",
      code: `import serial
import serial.tools.list_ports
import threading
import time

class SerialManager:
    def __init__(self):
        self.serial_conn = None
        self.connected_port = None
        self.baud_rate = 115200
        self.is_connected = False
        self._reader_thread = None
        self.log_history = []

    def scan_ports(self):
        ports = serial.tools.list_ports.comports()
        result = []
        for p in ports:
            result.append({
                "device": p.device,
                "description": p.description,
                "hwid": p.hwid,
                "is_esp": "cp210" in p.description.lower() or "ch340" in p.description.lower()
            })
        return result

    def send_command(self, cmd: str) -> bool:
        if not self.is_connected or not self.serial_conn:
            return False
        clean_cmd = cmd.strip() + "\\n"
        self.serial_conn.write(clean_cmd.encode("utf-8"))
        return True

serial_manager = SerialManager()`,
    },
    {
      name: "permissions.py",
      path: "lifeos/app/security/permissions.py",
      type: "python",
      desc: "Güvenlik ve Onay Gatekeeper (AI Donanım ve Shell İzinleri)",
      code: `class PermissionGatekeeper:
    def __init__(self):
        self.whitelisted_actions = set()
        self.audit_log = []

    def request_permission(self, action_type: str, target: str, details: str) -> bool:
        key = f"{action_type}:{target}"
        if key in self.whitelisted_actions:
            self._log_audit(action_type, target, "ALLOW_CACHED")
            return True
        return False

    def authorize(self, action_type: str, target: str, scope: str = "once"):
        key = f"{action_type}:{target}"
        if scope == "always":
            self.whitelisted_actions.add(key)
        self._log_audit(action_type, target, f"ALLOWED_{scope.upper()}")

permission_gatekeeper = PermissionGatekeeper()`,
    },
    {
      name: "requirements.txt",
      path: "lifeos/requirements.txt",
      type: "text",
      desc: "Python Kütüphaneleri Listesi",
      code: `PySide6>=6.6.0
SQLAlchemy>=2.0.25
psutil>=5.9.8
opencv-python>=4.9.0.80
pyserial>=3.5
watchdog>=4.0.0
requests>=2.31.0`,
    },
  ];

  const [activeFile, setActiveFile] = useState(pythonFiles[0]);
  const accent = getAccentClasses();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div id="python-codebase-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <span>PYTHON PYSIDE6 MASAÜSTÜ KOD TABANI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Bilgisayarınızda yerel çalışacak modüler Python 3.12+ & PySide6 mimarisi ve dosyaları
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy("cd lifeos && run.bat", "run-cmd")}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-mono text-blue-300 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>{copied === "run-cmd" ? "Kopyalandı!" : "run.bat Başlat"}</span>
          </button>
        </div>
      </div>

      {/* Windows / Linux Run Guide Card */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>Yerel Bilgisayarınızda Başlatma Adımları</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#08090d] border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-blue-400 font-bold">1. ADIM (Depo)</span>
            <p className="text-slate-300">cd lifeos</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#08090d] border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-indigo-400 font-bold">2. ADIM (Windows)</span>
            <p className="text-slate-300">run.bat</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#08090d] border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold">3. ADIM (Mac/Linux)</span>
            <p className="text-slate-300">pip install -r requirements.txt && python main.py</p>
          </div>
        </div>
      </div>

      {/* File Viewer Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[540px]">
        {/* File Tree Selector (1 col) */}
        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-1 overflow-y-auto">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block px-2 pb-1 border-b border-slate-800">
              lifeos/ Dizin Yapısı
            </span>
            {pythonFiles.map((file) => {
              const isSelected = activeFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/40 shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode
                      className={`w-3.5 h-3.5 shrink-0 ${
                        file.name.endsWith(".py")
                          ? "text-amber-400"
                          : file.name.endsWith(".bat")
                          ? "text-emerald-400"
                          : "text-blue-400"
                      }`}
                    />
                    <span className="truncate">{file.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Area (3 cols) */}
        <div className="md:col-span-3 rounded-2xl bg-[#08090d] border border-slate-800/80 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="h-11 px-4 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>{activeFile.path}</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">— {activeFile.desc}</span>
            </div>

            <button
              onClick={() => handleCopy(activeFile.code, activeFile.name)}
              className="px-3 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs text-blue-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied === activeFile.name ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied === activeFile.name ? "Kopyalandı!" : "Kopyala"}</span>
            </button>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-y-auto leading-relaxed bg-[#08090d]">
            <pre className="whitespace-pre">
              {activeFile.code.split("\n").map((line, idx) => (
                <div key={idx} className="table-row">
                  <span className="table-cell pr-4 text-slate-600 select-none text-right font-mono text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))}
            </pre>
          </div>

          {/* Footer status */}
          <div className="h-8 px-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Python 3.12+ • PySide6 Fusion UI</span>
            <span>Production Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
