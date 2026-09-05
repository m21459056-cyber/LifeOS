import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import { Eye, Camera, Upload, Bot, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

export const ScreenAssistantView: React.FC = () => {
  const { setActiveTab, sendChatMessage, getAccentClasses } = useLifeOS();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const accent = getAccentClasses();

  const handleCaptureScreen = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);

    // Simulate screen inspection with OpenCV/Stacktrace OCR detection
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult(
        `**[LifeOS Screen Inspector Raporu]**\n\n🔍 **Tespit Edilen Hata (OpenCV VideoCapture):**\n\`\`\`python\n[ WARN:0] global cap_msmf.cpp:468 cv::VideoCapture_MSMF::open\\nCan't grab frame from camera 0!\\n\`\`\`\n\n✅ **Önerilen Çözüm:**\nWindows Media Foundation (MSMF) bazen harici web kameralarında zaman aşımına uğrar. \`src/robot.py\` içinde doğrudan **DirectShow (DSHOW)** sürücüsünü hedefleyin:\n\`\`\`python\nimport cv2\ncap = cv2.VideoCapture(0, cv2.CAP_DSHOW)\n\`\`\`\nBu değişiklik gecikmeyi ortalama 140ms'den 22ms'ye düşürecektir.`
      );
    }, 1200);
  };

  const handleSendToAIChat = () => {
    if (!analysisResult) return;
    setActiveTab("ai");
    sendChatMessage(
      `Ekran analizinde tespit edilen OpenCV hatası için kod dosyasını otomatik düzenle:\n${analysisResult}`
    );
  };

  return (
    <div id="screen-assistant-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span>GÖRSEL EKRAN ASİSTANI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ekran görüntüsü alarak terminal hatalarını, şemaları ve kod pencerelerini AI ile analiz edin
          </p>
        </div>

        <button
          onClick={handleCaptureScreen}
          disabled={analyzing}
          className={`px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-all ${
            analyzing
              ? "bg-slate-800 text-slate-500"
              : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          }`}
        >
          {analyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Ekran İnceleniyor...</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5" />
              <span>Ekranı Yakala & Hataları Tara</span>
            </>
          )}
        </button>
      </div>

      {/* Screen Frame Mockup & Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Screen Preview Canvas */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="font-semibold text-white">Ekran Görüntüsü Önizlemesi</span>
            <span className="text-[10px] font-mono text-slate-500">1920x1080 (Masaüstü)</span>
          </div>

          <div className="h-72 rounded-2xl bg-[#08090d] border border-slate-800/80 p-4 font-mono text-xs flex flex-col justify-between relative overflow-hidden shadow-xl">
            {/* Terminal mock error */}
            <div className="space-y-1.5 text-slate-400">
              <p className="text-blue-400 font-bold">$ python src/main.py</p>
              <p className="text-slate-300">[LifeOS] Starting hardware loop...</p>
              <p className="text-amber-400">[WARN] Camera 0 initialization failed with MSMF backend.</p>
              <p className="text-rose-400 font-semibold">
                cv2.error: OpenCV(4.9.0) :-1: error: (-5:Bad argument) in function 'grab'
              </p>
              <p className="text-slate-500">Traceback (most recent call last):</p>
              <p className="text-slate-500"> File "D:\Projects\Robot\src\robot.py", line 42, in run</p>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80 z-10">
              <span>Hedef Pencere: VS Code & PowerShell</span>
              <span className="text-amber-400 font-medium">Hata Vurgulandı</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Ekran görüntüsü yerel bellekte işlenir ve dışarıya aktarılmaz.</span>
          </div>
        </div>

        {/* Right: AI OCR & Analysis Diagnostic */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3 text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-blue-400" />
                AI Teşhis & Kod Çözüm Raporu
              </span>
              {analysisResult && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Analiz Tamamlandı
                </span>
              )}
            </div>

            {analysisResult ? (
              <div className="p-4 rounded-xl bg-[#08090d] border border-slate-800/80 text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto">
                {analysisResult}
              </div>
            ) : (
              <div className="text-center py-20 text-xs text-slate-500 space-y-2">
                <p>Henüz bir ekran yakalanmadı.</p>
                <p className="text-[11px]">
                  "Ekranı Yakala & Hataları Tara" butonuna tıklayarak terminal veya IDE'nizdeki hatayı tespit edin.
                </p>
              </div>
            )}
          </div>

          {analysisResult && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={handleSendToAIChat}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Bu Çözümü AI Asistanında Aç</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
