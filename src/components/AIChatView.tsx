import React, { useState, useRef, useEffect } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Play,
  Cpu,
  FolderGit2,
  Zap,
  Radio,
  Layers,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export const AIChatView: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    isAiStreaming,
    activeProject,
    isSerialConnected,
    selectedPort,
    systemStats,
    settings,
    updateSettings,
    getAccentClasses,
  } = useLifeOS();

  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const accent = getAccentClasses();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiStreaming]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAiStreaming) return;
    const text = input.trim();
    setInput("");
    await sendChatMessage(text);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    "Bu projede kamera neden başlamıyor?",
    "ESP32 motor kontrol kodu yaz",
    "ESP32'ye LED ON komutu gönder",
    "Mevcut sistem durumunu özetle",
  ];

  return (
    <div id="ai-chat-view" className="h-[calc(100vh-3.5rem)] flex flex-col justify-between max-w-5xl mx-auto p-4 md:p-6">
      {/* Top Bar: Model Selector, Provider Status, Context Pill */}
      <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-white">LifeOS Local AI Engine</span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
                {settings.ai.provider === "ollama" ? "Ollama Online" : "Gemini Online"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Local-first • Proje ve donanım bağlamı aktif
            </p>
          </div>
        </div>

        {/* Model Picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium hidden sm:inline">Model:</label>
          <select
            value={settings.ai.model}
            onChange={(e) => updateSettings({ ai: { ...settings.ai, model: e.target.value } })}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-blue-500 transition-colors"
          >
            <option value="qwen2.5:coder">Qwen 2.5 Coder (Default)</option>
            <option value="llama3.3">Llama 3.3 (Meta)</option>
            <option value="deepseek-r1">DeepSeek R1 (Reasoning)</option>
            <option value="gemma2">Google Gemma 2</option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
          </select>
        </div>
      </div>

      {/* Context Banner */}
      <div className="flex items-center gap-3 px-3.5 py-2 my-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 overflow-x-auto">
        <span className="text-slate-500 font-mono text-[10px] uppercase">ENJEKTE EDİLEN BAĞLAM:</span>
        <span className="flex items-center gap-1 font-mono text-slate-300">
          <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
          {activeProject.name}
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1 font-mono text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          CPU {systemStats.cpu.usagePercent}%
        </span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1 font-mono text-slate-300">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          {isSerialConnected ? `${selectedPort} Aktif` : "Donanım Yok"}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 my-2 pr-2">
        {chatMessages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 space-y-2.5 shadow-md ${
                  isUser
                    ? "bg-blue-600 text-white font-medium rounded-br-none shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                    : "bg-slate-900/60 border border-slate-800/80 text-slate-200 rounded-bl-none backdrop-blur-md"
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-70 pb-1 border-b border-white/10 font-mono">
                  <span>{isUser ? "Siz" : `LifeOS AI (${msg.model || "Local"})`}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Content */}
                <div className="space-y-2 whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Message Action Toolbar */}
                {!isUser && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                      title="Kopyala"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? "Kopyalandı" : "Kopyala"}</span>
                    </button>
                    <button
                      onClick={() => sendChatMessage("Lütfen cevabı detaylandır ve devam et.")}
                      className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Yeniden Üret</span>
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                  U
                </div>
              )}
            </div>
          );
        })}

        {isAiStreaming && (
          <div className="flex gap-3 text-xs justify-start animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#3b82f6] animate-bounce" />
              <span>Düşünülüyor & kod analizi yapılıyor...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="space-y-3 pt-2">
        {/* Quick prompt suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(qp);
              }}
              className="px-3 py-1 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white shrink-0 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-2 rounded-2xl bg-slate-900/50 border border-slate-800 focus-within:border-blue-500/50 shadow-2xl backdrop-blur-xl flex items-center gap-2 transition-colors"
        >
          <input
            type="text"
            placeholder="Projeleriniz, kodlarınız veya ESP32 donanımınız hakkında bir şey sorun..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAiStreaming}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isAiStreaming}
            className={`p-2.5 rounded-xl text-white transition-all ${
              !input.trim() || isAiStreaming
                ? "bg-slate-800/60 text-slate-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
