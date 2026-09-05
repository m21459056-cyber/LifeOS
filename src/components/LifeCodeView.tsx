import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import {
  Code2,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Trophy,
  Users,
  Terminal,
  Send,
  CheckCircle2,
  Heart,
  GitFork,
  ArrowRight,
  ExternalLink,
  Laptop,
  Check,
  Copy,
  Lightbulb,
  Cpu,
} from "lucide-react";
import { LifeCodeLesson, LifeCodeChallenge, LifeCodeCommunityProject } from "../types";

const INITIAL_CODE = `# LifeCode Interactive Python IDE
# LIFE Ekosistemi - Kodla, Öğren ve Paylaş

def sensor_veri_analizi(degerler):
    """ESP32 ve IoT sensörlerinden gelen verileri analiz eder."""
    if not degerler:
        return {"ortalama": 0, "durum": "Veri Yok"}
    
    ortalama = sum(degerler) / len(degerler)
    maksimum = max(degerler)
    minimum = min(degerler)
    
    durum = "Normal"
    if ortalama > 35.0:
        durum = "Yüksek Sıcaklık Uyarısı!"
    elif ortalama < 10.0:
        durum = "Düşük Sıcaklık Uyarısı!"
        
    return {
        "ornek_sayisi": len(degerler),
        "ortalama": round(ortalama, 2),
        "maksimum": maksimum,
        "minimum": minimum,
        "durum": durum
    }

# Test verisi
sensor_okumalari = [24.5, 25.1, 26.0, 25.8, 27.2, 26.5]
sonuc = sensor_veri_analizi(sensor_okumalari)

print("=== SENSÖR ANALİZ RAPORU ===")
for anahtar, deger in sonuc.items():
    print(f"• {anahtar.capitalize()}: {deger}")
`;

const SAMPLE_LESSONS: LifeCodeLesson[] = [
  {
    id: "l1",
    title: "1. Python Değişkenleri ve Veri Tipleri",
    level: "Başlangıç",
    duration: "15 dk",
    category: "Temeller",
    description: "Sayılar, metinler (string), boolean ve dinamik tip atamalarını kavrayın.",
    completed: true,
    codeSnippet: `isim = "LifeCode Öğrencisi"\nyas = 22\naktif_mi = True\nprint(f"Kullanıcı: {isim}, Yaş: {yas}, Durum: {aktif_mi}")`,
  },
  {
    id: "l2",
    title: "2. Fonksiyonlar ve Kapsam Mantığı",
    level: "Başlangıç",
    duration: "25 dk",
    category: "Fonksiyonlar",
    description: "Yeniden kullanılabilir kod blokları tanımlama ve argüman geçişleri.",
    completed: false,
    codeSnippet: `def selamla(kullanici, unvan="Geliştirici"):\n    return f"Hoş geldin {kullanici} ({unvan})!"\n\nprint(selamla("Murat", "Sistem Mimarı"))`,
  },
  {
    id: "l3",
    title: "3. Listeler, Sözlükler ve Filtreleme",
    level: "Orta",
    duration: "30 dk",
    category: "Veri Yapıları",
    description: "Veri koleksiyonlarını list comprehension ve lambda ile filtreleyin.",
    completed: false,
    codeSnippet: `sayilar = [12, 45, 67, 88, 23, 90, 34]\nciftler = [s for s in sayilar if s % 2 == 0]\nprint(f"Çift sayılar: {ciftler}")`,
  },
  {
    id: "l4",
    title: "4. Donanım & ESP32 MicroPython Temelleri",
    level: "Orta",
    duration: "40 dk",
    category: "IoT & Donanım",
    description: "GPIO pin kontrolü, PWM motor sinyalleri ve analog sensör okuma mantığı.",
    completed: false,
    codeSnippet: `# MicroPython ESP32 Simülasyonu\nimport time\n\ndef pin_toggle(pin, durum):\n    print(f"[GPIO {pin}] Durum: {'HIGH (1)' if durum else 'LOW (0)'}")\n\npin_toggle(2, True)  # LED ON\ntime.sleep(0.5)\npin_toggle(2, False) # LED OFF`,
  },
];

const SAMPLE_CHALLENGES: LifeCodeChallenge[] = [
  {
    id: "c1",
    title: "Sensör Verisi Gürültü Filtresi",
    difficulty: "Kolay",
    points: 150,
    description: "Gelen ham sayı dizisindeki aşırı uç değerleri (0'dan küçük veya 100'den büyük) ayıklayan bir fonksiyon yazın.",
    initialCode: `def filtrele(ham_veri):\n    # Kodunuzu buraya yazın\n    pass\n\n# Test:\nprint(filtrele([-5, 23, 45, 120, 67]))`,
    testPrompt: "Beklenen Çıktı: [23, 45, 67]",
  },
  {
    id: "c2",
    title: "Asal Çarpanlara Ayırıcı",
    difficulty: "Orta",
    points: 300,
    description: "Verilen bir pozitif tamsayının tüm asal çarpanlarını liste halinde döndüren optimize algoritmayı kurun.",
    initialCode: `def asal_carpanlar(n):\n    # Kodunuzu buraya yazın\n    pass\n\nprint(asal_carpanlar(84)) # [2, 2, 3, 7]`,
    testPrompt: "Beklenen Çıktı: [2, 2, 3, 7]",
  },
  {
    id: "c3",
    title: "İki Nokta Arası Mesafe (GPS/Robot)",
    difficulty: "Orta",
    points: 250,
    description: "İki koordinat (x1, y1) ve (x2, y2) arasındaki Öklid mesafesini hesaplayan fonksiyonu yazın.",
    initialCode: `import math\n\ndef mesafe_hesapla(p1, p2):\n    return math.sqrt((p2[0]-p1[0])**2 + (p2[1]-p1[1])**2)\n\nprint(mesafe_hesapla((0,0), (3,4)))`,
    testPrompt: "Beklenen Çıktı: 5.0",
  },
];

const SAMPLE_COMMUNITY_PROJECTS: LifeCodeCommunityProject[] = [
  {
    id: "cp1",
    title: "ESP32 Hava İstasyonu & MQTT Publisher",
    author: "can_dev",
    avatar: "CD",
    likes: 142,
    forks: 38,
    tags: ["IoT", "MicroPython", "MQTT"],
    description: "DHT22 sıcaklık sensöründen okunan verileri yerel MQTT broker'a yayımlayan script.",
    code: `# ESP32 Weather MQTT\nimport time\nprint("[MQTT] Broker bağlantısı kuruldu -> broker.hivemq.com")\nprint("[DHT22] Okuma: 24.8°C %48 Nem")`,
  },
  {
    id: "cp2",
    title: "Mini Neural Network (NumPy Olmadan)",
    author: "zeynep_ai",
    avatar: "ZA",
    likes: 289,
    forks: 74,
    tags: ["AI", "YapayZeka", "Algoritma"],
    description: "Sıfırdan saf Python ile yazılmış XOR problemini çözen 2 katmanlı yapay sinir ağı.",
    code: `# Saf Python ile Basit Algılayıcı\nimport math\ndef sigmoid(x): return 1 / (1 + math.exp(-x))\nprint("Perceptron aktivasyon testi: ", sigmoid(1.5))`,
  },
  {
    id: "cp3",
    title: "Kişisel Bütçe & Harcama Görselleştirici",
    author: "mert_data",
    avatar: "MD",
    likes: 95,
    forks: 19,
    tags: ["Data", "Finans", "Terminal"],
    description: "Harcamaları kategorize edip ASCII histogram grafiği çizen terminal aracı.",
    code: `kategoriler = {"Gıda": 1200, "Kitap": 450, "Sunucu": 300}\nfor k, v in kategoriler.items():\n    bar = "█" * (v // 100)\n    print(f"{k.ljust(8)} | {bar} ({v} TL)")`,
  },
];

export const LifeCodeView: React.FC = () => {
  const { setActiveTab, addNote, activeProject } = useLifeOS();

  const [activeSubTab, setActiveSubTab] = useState<"ide" | "lessons" | "challenges" | "community" | "teacher">("ide");
  const [code, setCode] = useState(INITIAL_CODE);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // AI Teacher State
  const [teacherChat, setTeacherChat] = useState<Array<{ role: "user" | "teacher"; text: string }>>([
    {
      role: "teacher",
      text: "Merhaba! Ben LifeCode AI Öğretmeniyim. Python sözdizimi, hata ayıklama veya algoritmalar hakkında ne öğrenmek istersin?",
    },
  ]);
  const [teacherInput, setTeacherInput] = useState("");
  const [isTeacherTyping, setIsTeacherTyping] = useState(false);

  // Run Code Simulation
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Kod çalıştırılıyor (LifeCode Python Sandbox)...");

    setTimeout(() => {
      try {
        let simulatedOut = "";
        if (code.includes("sensor_veri_analizi")) {
          simulatedOut = `=== SENSÖR ANALİZ RAPORU ===\n• Ornek_sayisi: 6\n• Ortalama: 25.77\n• Maksimum: 27.2\n• Minimum: 24.5\n• Durum: Normal\n\n[İşlem Tamamlandı - Çıkış Kodu: 0 | Süre: 14ms | RAM: 12.4 MB]`;
        } else {
          // General output parser simulation
          const printMatches = code.match(/print\((.*?)\)/g);
          if (printMatches && printMatches.length > 0) {
            simulatedOut = printMatches
              .map((m) => {
                const inner = m.replace(/print\(|\)/g, "").replace(/["']/g, "");
                return inner.startsWith("f") ? inner.substring(1) : inner;
              })
              .join("\n");
            simulatedOut += `\n\n[Çıkış Kodu: 0 | Süre: 9ms]`;
          } else {
            simulatedOut = `Program başarıyla çalıştırıldı (Çıktı üretilmedi).\n[Çıkış Kodu: 0]`;
          }
        }
        setOutput(simulatedOut);
      } catch (err: any) {
        setOutput(`Traceback (most recent call last):\n  File "main.py", line 12\nSyntaxError: ${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 450);
  };

  const handleExportToLifeOS = () => {
    addNote({
      title: `LifeCode Snippet: ${new Date().toLocaleTimeString()}`,
      content: code,
      tags: ["lifecode", "python", "snippet"],
      projectId: activeProject.id,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTeacherMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherInput.trim()) return;

    const userMsg = teacherInput.trim();
    setTeacherChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setTeacherInput("");
    setIsTeacherTyping(true);

    setTimeout(() => {
      let reply = "";
      const lower = userMsg.toLowerCase();
      if (lower.includes("hata") || lower.includes("syntax") || lower.includes("error")) {
        reply = `Python'da en sık karşılaşılan hatalar:\n1. 'IndentationError': Girintileme (tab yerine 4 boşluk standardı).\n2. 'NameError': Tanımlanmamış değişken adı.\n3. 'TypeError': Uyumsuz veri tipleri (örneğin str ile int toplamaya çalışmak).\n\nMevcut kodundaki hatayı çözmek için IDE'deki hata satırına odaklanabiliriz.`;
      } else if (lower.includes("açıkla") || lower.includes("kod")) {
        reply = `Yazdığın kod 'sensor_veri_analizi' fonksiyonuyla ham sayı dizisinden ortalama, min/max değerleri çıkarıyor ve 35 derecenin üzerindeyse eşik uyarısı veriyor. Bu, ESP32 gibi donanımlardan gelen IoT telemetrisinde sıkça kullanılan bir filtreleme tekniğidir.`;
      } else if (lower.includes("ipucu") || lower.includes("challenge") || lower.includes("soru")) {
        reply = `Harika bir ipucu: Sayı dizilerini filtrelerken 'for' döngüsü yerine List Comprehension kullanmak kodu 2 kat daha hızlı ve okunaklı yapar!\nÖrnek: [x for x in liste if x > 0]`;
      } else {
        reply = `'${userMsg}' konulu sorun için pratik bir örnek hazırlayabilirim. İstersen bu konuyu doğrudan Browser IDE üzerinde çalıştırarak birlikte inceleyelim.`;
      }

      setTeacherChat((prev) => [...prev, { role: "teacher", text: reply }]);
      setIsTeacherTyping(false);
    }, 700);
  };

  return (
    <div id="lifecode-view" className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Ecosystem Brand Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-950/40 border border-blue-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] shrink-0">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">LifeCode</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-semibold">
                LIFE EKOSİSTEMİ
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Python Öğren • Browser IDE • Kod Topluluğu • AI Teacher
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/80 flex items-center gap-2 transition-all"
          >
            <Laptop className="w-3.5 h-3.5 text-blue-400" />
            <span>LifeOS Command Center'a Dön</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
        <button
          id="btn-tab-lifecode-ide"
          onClick={() => setActiveSubTab("ide")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === "ide"
              ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Browser IDE</span>
        </button>

        <button
          id="btn-tab-lifecode-lessons"
          onClick={() => setActiveSubTab("lessons")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === "lessons"
              ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Dersler & Egzersizler</span>
        </button>

        <button
          id="btn-tab-lifecode-challenges"
          onClick={() => setActiveSubTab("challenges")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === "challenges"
              ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Meydan Okumalar</span>
        </button>

        <button
          id="btn-tab-lifecode-teacher"
          onClick={() => setActiveSubTab("teacher")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === "teacher"
              ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          <span>AI Teacher</span>
        </button>

        <button
          id="btn-tab-lifecode-community"
          onClick={() => setActiveSubTab("community")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === "community"
              ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Topluluk & Projeler</span>
        </button>
      </div>

      {/* 1. BROWSER IDE TAB */}
      {activeSubTab === "ide" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Editor Area (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden flex flex-col">
            {/* Editor Toolbar */}
            <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-300 font-semibold">main.py</span>
                <span className="text-[10px] text-slate-500 font-mono">Python 3.12 (Interactive Sandbox)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(INITIAL_CODE)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                  title="Kodu Sıfırla"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sıfırla</span>
                </button>

                <button
                  id="btn-export-to-lifeos"
                  onClick={handleExportToLifeOS}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-blue-300 border border-blue-500/30 flex items-center gap-1.5 transition-colors font-medium"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "LifeOS Notlarına Kaydedildi!" : "LifeOS'a Aktar"}</span>
                </button>

                <button
                  id="btn-run-python-code"
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? "Çalışıyor..." : "Kodu Çalıştır"}</span>
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="p-4 bg-[#08090d] flex-1 min-h-[380px] font-mono text-xs">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[380px] bg-transparent text-slate-200 outline-none resize-none leading-relaxed font-mono selection:bg-blue-600/40"
              />
            </div>
          </div>

          {/* Output Console & Presets (4 cols) */}
          <div className="lg:col-span-4 space-y-4 flex flex-col">
            {/* Terminal Output */}
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden flex-1 flex flex-col">
              <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-300">Terminal Çıktısı</span>
                </div>
                {output && (
                  <button
                    onClick={() => setOutput("")}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    Temizle
                  </button>
                )}
              </div>

              <div className="p-3.5 bg-[#050608] flex-1 min-h-[220px] font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {output ? (
                  <span>{output}</span>
                ) : (
                  <span className="text-slate-600 italic">
                    Kodu çalıştırmak için 'Kodu Çalıştır' butonuna basın...
                  </span>
                )}
              </div>
            </div>

            {/* Quick Starter Templates */}
            <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800/60 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Hazır Şablonlar
              </span>
              <div className="space-y-1.5">
                {[
                  {
                    title: "IoT Sensör Veri Filtresi",
                    action: () => setCode(INITIAL_CODE),
                  },
                  {
                    title: "MicroPython ESP32 Blink LED",
                    action: () =>
                      setCode(
                        `# MicroPython ESP32 LED Denetimi\nimport time\n\ndef led_yak_sondur(dongu_sayisi=3):\n    for i in range(1, dongu_sayisi + 1):\n        print(f"[Döngü {i}] LED AÇIK (Pin 2: HIGH)")\n        time.sleep(0.3)\n        print(f"[Döngü {i}] LED KAPALI (Pin 2: LOW)")\n        time.sleep(0.3)\n\nled_yak_sondur()\nprint("Donanım testi tamamlandı!")`
                      ),
                  },
                  {
                    title: "Fibonacci & Asal Sayı Bulucu",
                    action: () =>
                      setCode(
                        `# Fibonacci Serisi\ndef fibonacci(n):\n    seri = [0, 1]\n    while len(seri) < n:\n        seri.append(seri[-1] + seri[-2])\n    return seri\n\nprint("İlk 10 Fibonacci sayısı:", fibonacci(10))`
                      ),
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full text-left p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between transition-colors"
                  >
                    <span>{item.title}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LESSONS TAB */}
      {activeSubTab === "lessons" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_LESSONS.map((lesson) => (
            <div
              key={lesson.id}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-950 text-blue-400 border border-blue-500/30 font-semibold">
                    {lesson.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>{lesson.duration}</span>
                    <span>•</span>
                    <span className="text-amber-400">{lesson.level}</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white">{lesson.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{lesson.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#08090d] border border-slate-800/80 font-mono text-[11px] text-slate-300 whitespace-pre overflow-x-auto">
                {lesson.codeSnippet}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  {lesson.completed ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tamamlandı
                    </span>
                  ) : (
                    <span className="text-slate-500">Henüz tamamlanmadı</span>
                  )}
                </span>

                <button
                  onClick={() => {
                    setCode(lesson.codeSnippet);
                    setActiveSubTab("ide");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>IDE'de Dene</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. CHALLENGES TAB */}
      {activeSubTab === "challenges" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAMPLE_CHALLENGES.map((ch) => (
            <div
              key={ch.id}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${
                      ch.difficulty === "Kolay"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {ch.difficulty}
                  </span>
                  <span className="text-xs font-mono text-blue-400 font-bold">+{ch.points} Puan</span>
                </div>

                <h4 className="font-bold text-sm text-white">{ch.title}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{ch.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#08090d] border border-slate-800/80 text-[11px] font-mono text-slate-400">
                <span className="text-blue-400">{ch.testPrompt}</span>
              </div>

              <button
                onClick={() => {
                  setCode(ch.initialCode);
                  setActiveSubTab("ide");
                }}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all"
              >
                <span>Meydan Okumayı Çöz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. AI TEACHER TAB */}
      {activeSubTab === "teacher" && (
        <div className="max-w-3xl mx-auto rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md overflow-hidden flex flex-col h-[560px]">
          {/* Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">LifeCode AI Teacher</h4>
                <p className="text-[10px] text-slate-400">Eğitsel Python & Kodlama Danışmanı</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Çevrimiçi</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3.5">
            {teacherChat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-950/90 border border-slate-800/80 text-slate-200 rounded-bl-none whitespace-pre-wrap font-sans"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTeacherTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span>AI Teacher yanıt hazırlıyor...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Presets */}
          <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono text-slate-500 shrink-0">Hızlı Sorular:</span>
            {[
              "Mevcut kodumdaki mantığı açıkla",
              "Python'da List Comprehension nedir?",
              "ESP32 pin okuma hatası nasıl çözülür?",
              "Fonksiyonlarda *args ve **kwargs ne işe yarar?",
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => setTeacherInput(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 shrink-0 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendTeacherMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={teacherInput}
              onChange={(e) => setTeacherInput(e.target.value)}
              placeholder="Python hakkında soru sorun, kod incelemesi veya ipucu isteyin..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/50"
            />
            <button
              type="submit"
              disabled={!teacherInput.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all shadow-[0_0_10px_rgba(37,99,235,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 5. COMMUNITY TAB */}
      {activeSubTab === "community" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">Topluluk Paylaşımları & Vitrin</h3>
              <p className="text-xs text-slate-400">Diğer Life geliştiricilerinin oluşturduğu açık kaynak Python betikleri</p>
            </div>
            <button
              onClick={() => {
                alert("Mevcut Browser IDE kodunuz LifeCode topluluk vitrinine taslak olarak eklendi!");
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] transition-all"
            >
              Kendi Projeni Paylaş
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SAMPLE_COMMUNITY_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-[10px] font-bold text-blue-300">
                        {proj.avatar}
                      </div>
                      <span className="text-xs text-slate-300 font-mono">@{proj.author}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
                        <Heart className="w-3.5 h-3.5" /> {proj.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5" /> {proj.forks}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-white">{proj.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-[#08090d] border border-slate-800 font-mono text-[10px] text-slate-400 truncate">
                  {proj.code.split("\n")[0]}
                </div>

                <button
                  onClick={() => {
                    setCode(proj.code);
                    setActiveSubTab("ide");
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700/80 flex items-center justify-center gap-2 transition-colors"
                >
                  <GitFork className="w-3.5 h-3.5 text-blue-400" />
                  <span>Kodu Klonla & IDE'de Aç</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
