export type AccentColor = "cyan" | "emerald" | "violet" | "amber" | "rose" | "blue";

export interface SystemStats {
  cpu: {
    usagePercent: number;
    cores: number;
    model: string;
    tempC: number;
  };
  ram: {
    totalBytes: number;
    usedBytes: number;
    freeBytes: number;
    usagePercent: number;
  };
  gpu: {
    name: string;
    usagePercent: number;
    tempC: number;
    vramUsedPercent: number;
  };
  disk: {
    totalGB: number;
    usedGB: number;
    freeGB: number;
    usagePercent: number;
  };
  network: {
    online: boolean;
    downloadMbps: string;
    uploadMbps: string;
  };
  uptime: number;
  platform: string;
  hostname: string;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High" | "Critical";
  projectId?: string;
  dueDate?: string;
  createdAt: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  projectId?: string;
  updatedAt: string;
}

export interface ProjectFileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  extension?: string;
  children?: ProjectFileItem[];
  content?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  path: string;
  description: string;
  progress: number;
  isActive: boolean;
  lastModifiedFile: string;
  lastNote: string;
  git: {
    isGit: boolean;
    branch: string;
    lastCommit: string;
    changedFiles: number;
  };
  fileTree: ProjectFileItem[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  provider?: string;
  model?: string;
  pendingAction?: {
    type: "hardware" | "file_diff" | "shell";
    target: string;
    command?: string;
    diff?: string;
    description: string;
  };
}

export interface SerialPortInfo {
  device: string;
  description: string;
  hwid: string;
  connected?: boolean;
}

export interface ActivityItem {
  id: string;
  type: "file_edit" | "device_connect" | "note_create" | "ai_chat" | "task_complete";
  text: string;
  timestamp: string;
}

export interface SettingsState {
  general: {
    language: "tr" | "en";
    launchAtStartup: boolean;
    notificationsEnabled: boolean;
  };
  appearance: {
    theme: "dark" | "midnight";
    accentColor: AccentColor;
    animations: boolean;
    compactMode: boolean;
  };
  ai: {
    provider: "ollama" | "gemini";
    ollamaUrl: string;
    model: string;
    temperature: number;
    contextSize: number;
  };
  hardware: {
    defaultBaud: number;
    autoDetect: boolean;
  };
  privacy: {
    screenAnalysis: boolean;
    aiMemory: boolean;
    telemetry: boolean;
  };
}
