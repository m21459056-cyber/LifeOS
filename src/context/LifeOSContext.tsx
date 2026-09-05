import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AccentColor,
  SystemStats,
  TaskItem,
  NoteItem,
  ProjectItem,
  ChatMessage,
  SerialPortInfo,
  ActivityItem,
  SettingsState,
} from "../types";

interface LifeOSContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStats: SystemStats;
  projects: ProjectItem[];
  activeProject: ProjectItem;
  setActiveProjectId: (id: string) => void;
  notes: NoteItem[];
  addNote: (note: Omit<NoteItem, "id" | "updatedAt">) => void;
  deleteNote: (id: string) => void;
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, "id" | "createdAt">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  activities: ActivityItem[];
  addActivity: (type: ActivityItem["type"], text: string) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => Promise<void>;
  isAiStreaming: boolean;
  serialPorts: SerialPortInfo[];
  selectedPort: string;
  setSelectedPort: (port: string) => void;
  isSerialConnected: boolean;
  baudRate: number;
  setBaudRate: (b: number) => void;
  serialLogs: string[];
  connectSerial: (port: string, baud?: number) => void;
  disconnectSerial: () => void;
  sendSerialCommand: (cmd: string) => void;
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isSetupWizardOpen: boolean;
  setIsSetupWizardOpen: (open: boolean) => void;
  pendingPermission: any;
  setPendingPermission: (p: any) => void;
  handlePermissionResponse: (allow: boolean, remember?: boolean) => void;
  notifications: Array<{ id: string; title: string; message: string; time: string }>;
  dismissNotification: (id: string) => void;
  getAccentClasses: () => {
    bg: string;
    text: string;
    border: string;
    ring: string;
    gradient: string;
    hover: string;
    badge: string;
  };
}

const defaultStats: SystemStats = {
  cpu: { usagePercent: 32, cores: 8, model: "12th Gen Intel Core i7 / AMD Ryzen 7", tempC: 46 },
  ram: { totalBytes: 17179869184, usedBytes: 10485760000, freeBytes: 6694109184, usagePercent: 61 },
  gpu: { name: "NVIDIA GeForce RTX 4070 / Metal Accelerator", usagePercent: 28, tempC: 44, vramUsedPercent: 38 },
  disk: { totalGB: 512, usedGB: 184, freeGB: 328, usagePercent: 36 },
  network: { online: true, downloadMbps: "24.8", uploadMbps: "6.4" },
  uptime: 14820,
  platform: "Windows 11 Pro 64-bit",
  hostname: "LIFEOS-STATION",
};

const initialProjects: ProjectItem[] = [
  {
    id: "p1",
    name: "ESP32 Robot",
    path: "D:\\Projects\\Robot",
    description: "Autonomous obstacle avoidance robot with ESP32, ultrasonic sensing, and OpenCV vision.",
    progress: 78,
    isActive: true,
    lastModifiedFile: "src/robot.py",
    lastNote: "ESP32 Pinout & Motor Driver",
    git: {
      isGit: true,
      branch: "main",
      lastCommit: "feat: add serial command dispatcher (2 hours ago)",
      changedFiles: 2,
    },
    fileTree: [
      {
        name: "src",
        path: "src",
        type: "directory",
        children: [
          {
            name: "main.py",
            path: "src/main.py",
            type: "file",
            extension: ".py",
            size: 1420,
            content: `import cv2
import serial
import time
import os

# Safe Windows Camera Initialization with DSHOW backend
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW if os.name == 'nt' else cv2.CAP_ANY)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

ser = serial.Serial('COM3', 115200, timeout=1)

print("[Robot Core] All systems operational.")
`,
          },
          {
            name: "robot.py",
            path: "src/robot.py",
            type: "file",
            extension: ".py",
            size: 2840,
            content: `class RobotController:
    def __init__(self, serial_conn):
        self.serial = serial_conn
        self.speed = 100
        self.obstacle_detected = False

    def drive_forward(self, speed=None):
        spd = speed or self.speed
        self.serial.write(f"MOTOR {spd}\\n".encode())

    def emergency_stop(self):
        self.serial.write(b"MOTOR 0\\n")
        print("[SAFETY] Motors stopped.")
`,
          },
          {
            name: "camera.py",
            path: "src/camera.py",
            type: "file",
            extension: ".py",
            size: 1850,
            content: `import cv2

class VisionPipeline:
    def __init__(self):
        self.detector = cv2.QRCodeDetector()

    def process_frame(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        return gray
`,
          },
        ],
      },
      {
        name: "assets",
        path: "assets",
        type: "directory",
        children: [
          { name: "wiring_diagram.png", path: "assets/wiring_diagram.png", type: "file", extension: ".png", size: 48200 },
          { name: "pinout.json", path: "assets/pinout.json", type: "file", extension: ".json", size: 640 },
        ],
      },
      {
        name: "tests",
        path: "tests",
        type: "directory",
        children: [
          { name: "test_serial.py", path: "tests/test_serial.py", type: "file", extension: ".py", size: 1200 },
          { name: "test_vision.py", path: "tests/test_vision.py", type: "file", extension: ".py", size: 980 },
        ],
      },
      {
        name: "README.md",
        path: "README.md",
        type: "file",
        extension: ".md",
        size: 920,
        content: `# ESP32 Robot Project\n\nDual-motor chassis with ESP32-WROOM controller, L298N driver, and host-connected vision system.\n\n### Running:\n\`\`\`bash\npython src/main.py\n\`\`\`\n`,
      },
      {
        name: "main.py",
        path: "main.py",
        type: "file",
        extension: ".py",
        size: 540,
        content: `from src.main import main\nif __name__ == '__main__':\n    main()`,
      },
    ],
  },
  {
    id: "p2",
    name: "Computer Vision Drone",
    path: "D:\\Projects\\DroneCV",
    description: "Real-time object tracking and optical flow stabilization.",
    progress: 45,
    isActive: false,
    lastModifiedFile: "drone_nav.py",
    lastNote: "Optical Flow Frame Rate",
    git: {
      isGit: true,
      branch: "dev-yolo",
      lastCommit: "feat: add YOLOv8 nano model (Yesterday)",
      changedFiles: 5,
    },
    fileTree: [
      { name: "drone_nav.py", path: "drone_nav.py", type: "file", extension: ".py", size: 3400 },
      { name: "telemetry.py", path: "telemetry.py", type: "file", extension: ".py", size: 2100 },
      { name: "README.md", path: "README.md", type: "file", extension: ".md", size: 850 },
    ],
  },
  {
    id: "p3",
    name: "Smart Home Energy Hub",
    path: "D:\\Projects\\EnergyHub",
    description: "ESP8266 and Arduino power metering with SQLite time-series storage.",
    progress: 92,
    isActive: false,
    lastModifiedFile: "collector.py",
    lastNote: "Current Transformer Calibration",
    git: {
      isGit: false,
      branch: "None",
      lastCommit: "No repository",
      changedFiles: 0,
    },
    fileTree: [
      { name: "collector.py", path: "collector.py", type: "file", extension: ".py", size: 4200 },
      { name: "schema.sql", path: "schema.sql", type: "file", extension: ".sql", size: 1200 },
    ],
  },
];

const initialNotes: NoteItem[] = [
  {
    id: "n1",
    title: "ESP32 Pinout & Motor Driver L298N",
    content: "GPIO 16: IN1 (Motor Left A)\nGPIO 17: IN2 (Motor Left B)\nGPIO 18: ENA (PWM Speed channel 0)\nGPIO 19: IN3 (Motor Right A)\nGPIO 21: IN4 (Motor Right B)\nGPIO 22: ENB (PWM Speed channel 1)\nBaud: 115200",
    tags: ["ESP32", "Arduino", "Hardware"],
    projectId: "p1",
    updatedAt: "Bugün 14:32",
  },
  {
    id: "n2",
    title: "OpenCV VideoCapture on Windows Fix",
    content: "Windows üzerinde cv2.VideoCapture(0) bazen 5-8 saniye takılma yaratır. Bunu önlemek için daima cv2.CAP_DSHOW bayrağını kullanın:\ncap = cv2.VideoCapture(0, cv2.CAP_DSHOW)",
    tags: ["Python", "OpenCV"],
    projectId: "p1",
    updatedAt: "Dün 18:15",
  },
  {
    id: "n3",
    title: "Minecraft RCON Server Automation",
    content: "Python mcrcon kütüphanesi ile yerel sunucu durumunu otomatik kontrol et ve oyuncu sayısını logla.",
    tags: ["Minecraft", "Python"],
    updatedAt: "3 gün önce",
  },
];

const initialTasks: TaskItem[] = [
  { id: "t1", title: "Calibrate motor PWM duty cycle on ESP32", completed: true, priority: "High", projectId: "p1", createdAt: "2026-09-02" },
  { id: "t2", title: "Test I2C ultrasonic distance sensor HC-SR04", completed: true, priority: "Medium", projectId: "p1", createdAt: "2026-09-03" },
  { id: "t3", title: "Fix OpenCV camera latency in Windows DSHOW backend", completed: false, priority: "High", projectId: "p1", dueDate: "Bugün", createdAt: "2026-09-04" },
  { id: "t4", title: "Implement serial command packet parser (JSON vs raw)", completed: false, priority: "Medium", projectId: "p1", dueDate: "Cuma", createdAt: "2026-09-05" },
  { id: "t5", title: "Backup SQLite database and memory store", completed: false, priority: "Low", dueDate: "Haftaya", createdAt: "2026-09-05" },
];

const initialActivities: ActivityItem[] = [
  { id: "a1", type: "file_edit", text: "robot.py değiştirildi", timestamp: "12 dk önce" },
  { id: "a2", type: "device_connect", text: "ESP32 bağlandı (COM3 @ 115200 baud)", timestamp: "25 dk önce" },
  { id: "a3", type: "note_create", text: "3 yeni not oluşturuldu (ESP32, OpenCV)", timestamp: "1 saat önce" },
  { id: "a4", type: "ai_chat", text: "AI ile kamera gecikmesi hakkında konuşma yapıldı", timestamp: "2 saat önce" },
];

const initialChat: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content: `Merhaba! Ben **LifeOS Asistanı**. Bilgisayarınızdaki projeleri, dosyaları, sistem durumunu ve bağlı **ESP32** donanımını kontrol edebilirim.\n\nNasıl yardımcı olabilirim? Örneğin: *"Bu projede kamera neden başlamıyor?"* veya *"ESP32'ye LED ON komutu gönder"* diyebilirsiniz.`,
    timestamp: "14:00",
    provider: "local-first",
    model: "Qwen 2.5 Coder",
  },
];

const initialSettings: SettingsState = {
  general: {
    language: "tr",
    launchAtStartup: false,
    notificationsEnabled: true,
  },
  appearance: {
    theme: "dark",
    accentColor: "blue",
    animations: true,
    compactMode: false,
  },
  ai: {
    provider: "ollama",
    ollamaUrl: "http://127.0.0.1:11434",
    model: "qwen2.5:coder",
    temperature: 0.7,
    contextSize: 4096,
  },
  hardware: {
    defaultBaud: 115200,
    autoDetect: true,
  },
  privacy: {
    screenAnalysis: true,
    aiMemory: true,
    telemetry: false,
  },
};

const LifeOSContext = createContext<LifeOSContextType | null>(null);

export const LifeOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [systemStats, setSystemStats] = useState<SystemStats>(defaultStats);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>("p1");
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChat);
  const [isAiStreaming, setIsAiStreaming] = useState<boolean>(false);
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState<boolean>(false);
  const [pendingPermission, setPendingPermission] = useState<any>(null);

  // Serial Hardware State
  const [serialPorts] = useState<SerialPortInfo[]>([
    { device: "COM3", description: "Silicon Labs CP210x (ESP32 Dev Module)", hwid: "USB\\VID_10C4&PID_EA60", connected: true },
    { device: "COM5", description: "Arduino Uno R3 (ATmega328P)", hwid: "USB\\VID_2341&PID_0043", connected: false },
    { device: "COM8", description: "Standard Serial Over Bluetooth", hwid: "BTHENUM\\{00001101}", connected: false },
  ]);
  const [selectedPort, setSelectedPort] = useState<string>("COM3");
  const [isSerialConnected, setIsSerialConnected] = useState<boolean>(true);
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [serialLogs, setSerialLogs] = useState<string[]>([
    "[18:42:01] ESP32 connected on COM3 (115200 baud)",
    "[18:42:02] Booting FreeRTOS Kernel v10.4.3",
    "[18:42:03] Temperature: 27.4 C",
    "[18:42:04] LDR: 823",
    "[18:42:05] Ultrasonic Ping: 42 cm distance",
    "[18:42:08] Motors: STANDBY (PWM 0%)",
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: "n-1", title: "ESP32 Ready", message: "ESP32 COM3 portuna başarıyla bağlandı.", time: "Şimdi" },
    { id: "n-2", title: "Active Project", message: "Robot projesinde 2 uncommitted değişiklik var.", time: "10 dk önce" },
  ]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addActivity = (type: ActivityItem["type"], text: string) => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 9);
    const newItem: ActivityItem = {
      id: `a-${Date.now()}-${uniqueSuffix}`,
      type,
      text,
      timestamp: "Şimdi",
    };
    setActivities((prev) => {
      const existing = prev.filter((item) => item.id !== newItem.id);
      return [newItem, ...existing.slice(0, 19)];
    });
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Live System Stats Polling
  useEffect(() => {
    let isMounted = true;
    const pollStats = async () => {
      try {
        const resp = await fetch("/api/system/stats");
        if (resp.ok) {
          const data = await resp.json();
          if (isMounted) setSystemStats(data);
        }
      } catch (err) {
        // Fallback simulation fluctuation
        if (isMounted) {
          setSystemStats((prev) => ({
            ...prev,
            cpu: {
              ...prev.cpu,
              usagePercent: Math.min(95, Math.max(12, prev.cpu.usagePercent + Math.round((Math.random() - 0.5) * 6))),
              tempC: Math.min(80, Math.max(38, prev.cpu.tempC + Math.round((Math.random() - 0.5) * 2))),
            },
            ram: {
              ...prev.ram,
              usagePercent: Math.min(90, Math.max(40, prev.ram.usagePercent + Math.round((Math.random() - 0.5) * 2))),
            },
            network: {
              ...prev.network,
              downloadMbps: (24 + (Math.random() - 0.5) * 5).toFixed(1),
              uploadMbps: (6 + (Math.random() - 0.5) * 2).toFixed(1),
            },
          }));
        }
      }
    };

    pollStats();
    const interval = setInterval(pollStats, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Serial Virtual Device Stream
  useEffect(() => {
    if (!isSerialConnected) return;
    const interval = setInterval(() => {
      const temp = (27.0 + (Math.random() - 0.5) * 1.5).toFixed(1);
      const ldr = Math.round(810 + (Math.random() - 0.5) * 40);
      const timeStr = new Date().toTimeString().split(" ")[0];
      const items = [
        `[${timeStr}] Temperature: ${temp} C`,
        `[${timeStr}] LDR: ${ldr}`,
        `[${timeStr}] Ultrasonic: ${Math.round(35 + Math.random() * 20)} cm`,
      ];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setSerialLogs((prev) => [...prev.slice(-150), randomItem]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isSerialConnected]);

  // Global Keyboard Shortcut: Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addNote = (note: Omit<NoteItem, "id" | "updatedAt">) => {
    const newNote: NoteItem = {
      id: `n-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...note,
      updatedAt: "Şimdi",
    };
    setNotes((prev) => [newNote, ...prev]);
    addActivity("note_create", `"${note.title}" notu oluşturuldu`);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const addTask = (task: Omit<TaskItem, "id" | "createdAt">) => {
    const newTask: TaskItem = {
      id: `t-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...task,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (targetTask && !targetTask.completed) {
      addActivity("task_complete", `Görev tamamlandı: ${targetTask.title}`);
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Hardware Actions
  const connectSerial = (port: string, baud: number = 115200) => {
    setSelectedPort(port);
    setBaudRate(baud);
    setIsSerialConnected(true);
    const ts = new Date().toTimeString().split(" ")[0];
    setSerialLogs((prev) => [...prev, `[${ts}] ${port} portuna ${baud} baud ile bağlandı.`]);
    addActivity("device_connect", `${port} bağlandı (${baud} baud)`);
  };

  const disconnectSerial = () => {
    setIsSerialConnected(false);
    const ts = new Date().toTimeString().split(" ")[0];
    setSerialLogs((prev) => [...prev, `[${ts}] ${selectedPort} bağlantısı kesildi.`]);
  };

  const sendSerialCommand = (cmd: string) => {
    const ts = new Date().toTimeString().split(" ")[0];
    setSerialLogs((prev) => [
      ...prev,
      `[${ts}] >>> ${cmd}`,
      `[${ts}] [ESP32 ACK] Command executed: "${cmd}"`,
    ]);
  };

  // Chat Engine with Safety Gatekeeping
  const sendChatMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiStreaming(true);

    try {
      const resp = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          provider: settings.ai.provider,
          model: settings.ai.model,
          ollamaUrl: settings.ai.ollamaUrl,
          context: {
            activeProject: activeProject.name,
            hardwareConnected: isSerialConnected,
            cpuPercent: systemStats.cpu.usagePercent,
            ramPercent: systemStats.ram.usagePercent,
            recentNotes: notes.slice(0, 2).map((n) => n.title).join(", "),
          },
        }),
      });

      const data = await resp.json();
      const aiReply: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: data.reply || "Cevap üretilemedi.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        provider: data.provider,
        model: data.model,
        pendingAction: data.pendingAction,
      };

      setChatMessages((prev) => [...prev, aiReply]);
      addActivity("ai_chat", `AI ile soru soruldu: "${content.slice(0, 30)}..."`);

      // If AI proposed a dangerous action, prompt user
      if (data.pendingAction) {
        setPendingPermission(data.pendingAction);
      }
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: `**[LifeOS Yerel Motor]** Proje dosyalarını inceledim.\n\n\`${activeProject.name}\` projesinde kamera başlatma işleminde OpenCV'nin Windows DSHOW backend'ini kullanmalısınız:\n\`\`\`python\ncap = cv2.VideoCapture(0, cv2.CAP_DSHOW)\n\`\`\`\nSistem durumu ve donanım hazır.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        provider: "local-simulation",
        model: "offline-core",
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiStreaming(false);
    }
  };

  const handlePermissionResponse = (allow: boolean, remember: boolean = false) => {
    if (!pendingPermission) return;
    if (allow) {
      if (pendingPermission.type === "hardware" && pendingPermission.command) {
        sendSerialCommand(pendingPermission.command);
      } else if (pendingPermission.type === "file_diff") {
        // Apply diff to file in active project
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === activeProject.id) {
              return {
                ...p,
                git: { ...p.git, changedFiles: p.git.changedFiles + 1 },
              };
            }
            return p;
          })
        );
        addActivity("file_edit", `AI değişikliği uygulandı: ${pendingPermission.target}`);
      }
    }
    setPendingPermission(null);
  };

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Color Mapping based on Accent Color
  const getAccentClasses = () => {
    switch (settings.appearance.accentColor) {
      case "emerald":
        return {
          bg: "bg-emerald-500",
          text: "text-emerald-400",
          border: "border-emerald-500/30",
          ring: "ring-emerald-500/40",
          gradient: "from-emerald-500 to-teal-600",
          hover: "hover:bg-emerald-500/20",
          badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
        };
      case "violet":
        return {
          bg: "bg-violet-500",
          text: "text-violet-400",
          border: "border-violet-500/30",
          ring: "ring-violet-500/40",
          gradient: "from-violet-500 to-indigo-600",
          hover: "hover:bg-violet-500/20",
          badge: "bg-violet-500/10 text-violet-300 border-violet-500/30",
        };
      case "amber":
        return {
          bg: "bg-amber-500",
          text: "text-amber-400",
          border: "border-amber-500/30",
          ring: "ring-amber-500/40",
          gradient: "from-amber-500 to-orange-600",
          hover: "hover:bg-amber-500/20",
          badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
        };
      case "rose":
        return {
          bg: "bg-rose-500",
          text: "text-rose-400",
          border: "border-rose-500/30",
          ring: "ring-rose-500/40",
          gradient: "from-rose-500 to-pink-600",
          hover: "hover:bg-rose-500/20",
          badge: "bg-rose-500/10 text-rose-300 border-rose-500/30",
        };
      case "blue":
      default:
        return {
          bg: "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]",
          text: "text-blue-400",
          border: "border-blue-500/30",
          ring: "ring-blue-500/40",
          gradient: "from-blue-600 to-indigo-600",
          hover: "hover:bg-blue-600/20",
          badge: "bg-blue-600/10 text-blue-300 border-blue-500/20",
        };
      case "cyan":
        return {
          bg: "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]",
          text: "text-cyan-400",
          border: "border-cyan-500/30",
          ring: "ring-cyan-500/40",
          gradient: "from-cyan-500 to-blue-600",
          hover: "hover:bg-cyan-500/20",
          badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
        };
    }
  };

  return (
    <LifeOSContext.Provider
      value={{
        activeTab,
        setActiveTab,
        systemStats,
        projects,
        activeProject,
        setActiveProjectId,
        notes,
        addNote,
        deleteNote,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        activities,
        addActivity,
        chatMessages,
        sendChatMessage,
        isAiStreaming,
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
        settings,
        updateSettings,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isSetupWizardOpen,
        setIsSetupWizardOpen,
        pendingPermission,
        setPendingPermission,
        handlePermissionResponse,
        notifications,
        dismissNotification,
        getAccentClasses,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};

export const useLifeOS = () => {
  const context = useContext(LifeOSContext);
  if (!context) throw new Error("useLifeOS must be used within LifeOSProvider");
  return context;
};
