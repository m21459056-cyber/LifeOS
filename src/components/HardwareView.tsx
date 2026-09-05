import React, { useState, useRef, useEffect } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import {
  Cpu,
  Zap,
  Power,
  RefreshCw,
  Send,
  Trash2,
  Copy,
  Check,
  Bot,
  ShieldAlert,
  Terminal,
  Activity,
  Sliders,
} from "lucide-react";

export const HardwareView: React.FC = () => {
  const {
    serialPorts,
    selectedPort,
    setSelectedPort,
    isSerialConnected,
    baudRate,
    setBaudRate,
    serialLogs,
    connectSerial,
    disconnectSerial,
    sendSerialCommand,
    setActiveTab,
    sendChatMessage,
    getAccentClasses,
    setPendingPermission,
  } = useLifeOS();

  const [inputCmd, setInputCmd] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const accent = getAccentClasses();

  useEffect(() => {
    if (autoScroll) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [serialLogs, autoScroll]);

  const handleSendCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    const clean = cmd.trim();

    // Check if command is safety-critical (e.g. MOTOR command)
    if (clean.toUpperCase().startsWith("MOTOR") && clean !== "MOTOR 0") {
      setPendingPermission({
        type: "hardware",
        target: `${selectedPort} (ESP32)`,
        command: clean,
        description: `Motor hız ve yön kontrol komutu (${clean}). Çevresel güvenliği teyit edin.`,
      });
      setInputCmd("");
      return;
    }

    sendSerialCommand(clean);
    setInputCmd("");
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(serialLogs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAIAnalyzeLogs = () => {
    setActiveTab("ai");
    sendChatMessage(
      `Aşağıdaki ESP32 seri port loglarını analiz et. Sıcaklık dalgalanmaları veya motor durumunda anormal bir durum var mı?\n\`\`\`\n${serialLogs
        .slice(-15)
        .join("\n")}\n\`\`\``
    );
  };

  return (
    <div id="hardware-view" className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Top Configuration Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">ESP32 & Arduino Donanım Laboratuvarı</h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                  isSerialConnected
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSerialConnected ? "bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" : "bg-slate-500"
                  }`}
                />
                {isSerialConnected ? "SERİ PORT BAĞLI" : "BAĞLANTI YOK"}
              </span>
            </div>
            <p className="text-xs text-slate-400">Gerçek zamanlı pyserial ve Web Serial denetimi</p>
          </div>
        </div>

        {/* Port & Baud Selectors + Connect Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 font-mono">PORT:</span>
            <select
              value={selectedPort}
              onChange={(e) => setSelectedPort(e.target.value)}
              disabled={isSerialConnected}
              className="bg-transparent text-slate-200 font-mono outline-none cursor-pointer"
            >
              {serialPorts.map((p) => (
                <option key={p.device} value={p.device} className="bg-slate-900">
                  {p.device} ({p.description.slice(0, 20)}...)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 font-mono">BAUD:</span>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              disabled={isSerialConnected}
              className="bg-transparent text-slate-200 font-mono outline-none cursor-pointer"
            >
              {[9600, 19200, 38400, 57600, 115200, 230400, 921600].map((b) => (
                <option key={b} value={b} className="bg-slate-900">
                  {b}
                </option>
              ))}
            </select>
          </div>

          {isSerialConnected ? (
            <button
              onClick={disconnectSerial}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Bağlantıyı Kes</span>
            </button>
          ) : (
            <button
              onClick={() => connectSerial(selectedPort, baudRate)}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Cihaza Bağlan</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="rounded-2xl bg-[#08090d] border border-slate-800/80 flex flex-col justify-between overflow-hidden shadow-2xl h-[520px]">
        {/* Terminal Header */}
        <div className="h-11 px-4 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Serial Monitor Output ({selectedPort} @ {baudRate} baud)</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600"
              />
              <span>Otomatik Kaydır</span>
            </label>

            <button
              onClick={handleAIAnalyzeLogs}
              className="px-3 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-1.5 transition-colors font-medium"
              title="AI ile bu logları analiz et"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Log Analizi</span>
            </button>

            <button
              onClick={handleCopyLogs}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Logları Kopyala"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Terminal Logs Scroll Area */}
        <div className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-y-auto space-y-1 bg-[#08090d] selection:bg-blue-900 selection:text-blue-100">
          {serialLogs.map((log, idx) => (
            <div
              key={idx}
              className={
                log.includes(">>>")
                  ? "text-blue-400 font-bold bg-slate-900/40 px-2 py-0.5 rounded"
                  : log.includes("ACK")
                  ? "text-emerald-400 font-semibold"
                  : log.includes("SAFETY") || log.includes("Error")
                  ? "text-rose-400"
                  : log.includes("Temperature")
                  ? "text-amber-300"
                  : "text-slate-400"
              }
            >
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Quick Command Chips */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
            Hızlı Komutlar:
          </span>
          <button
            onClick={() => handleSendCommand("LED ON")}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors shrink-0"
          >
            LED ON
          </button>
          <button
            onClick={() => handleSendCommand("LED OFF")}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors shrink-0"
          >
            LED OFF
          </button>
          <button
            onClick={() => handleSendCommand("MOTOR 120")}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[11px] transition-colors shrink-0 flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>MOTOR 120 (Güvenlik Onaylı)</span>
          </button>
          <button
            onClick={() => handleSendCommand("MOTOR 0")}
            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-mono text-[11px] transition-colors shrink-0"
          >
            ACİL STOP (MOTOR 0)
          </button>
          <button
            onClick={() => handleSendCommand("STATUS")}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors shrink-0"
          >
            STATUS
          </button>
          <button
            onClick={() => handleSendCommand("RESET")}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors shrink-0"
          >
            RESET
          </button>
        </div>

        {/* Command Input Sender Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendCommand(inputCmd);
          }}
          className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2"
        >
          <span className="text-blue-400 font-mono font-bold text-sm pl-2">&gt;</span>
          <input
            type="text"
            placeholder="Seri port komutu yazın (ör: 'MOTOR 120', 'LED ON', 'PING')..."
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            disabled={!isSerialConnected}
            className="flex-1 bg-transparent px-2 py-1 text-xs font-mono text-slate-100 placeholder-slate-500 outline-none"
          />
          <button
            type="submit"
            disabled={!inputCmd.trim() || !isSerialConnected}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1 transition-all ${
              !inputCmd.trim() || !isSerialConnected
                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gönder</span>
          </button>
        </form>
      </div>
    </div>
  );
};
