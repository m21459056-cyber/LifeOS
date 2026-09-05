import React from "react";
import { LifeOSProvider, useLifeOS } from "./context/LifeOSContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { CommandPalette } from "./components/CommandPalette";
import { PermissionModal } from "./components/PermissionModal";
import { SetupWizard } from "./components/SetupWizard";

import { DashboardView } from "./components/DashboardView";
import { AIChatView } from "./components/AIChatView";
import { ProjectsView } from "./components/ProjectsView";
import { NotesView } from "./components/NotesView";
import { TasksView } from "./components/TasksView";
import { HardwareView } from "./components/HardwareView";
import { ScreenAssistantView } from "./components/ScreenAssistantView";
import { MemorySearchView } from "./components/MemorySearchView";
import { PythonCodebaseView } from "./components/PythonCodebaseView";
import { SettingsView } from "./components/SettingsView";

const AppContent: React.FC = () => {
  const { activeTab } = useLifeOS();

  return (
    <div className="h-screen w-screen bg-[#050608] text-slate-200 flex overflow-hidden font-sans selection:bg-blue-600/30 selection:text-blue-200 relative">
      {/* Immersive UI Ambient Blur Highlights */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#050608]/40 relative z-10">
        <Header />

        <main className="flex-1 overflow-y-auto relative">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "ai" && <AIChatView />}
          {activeTab === "projects" && <ProjectsView />}
          {activeTab === "notes" && <NotesView />}
          {activeTab === "tasks" && <TasksView />}
          {activeTab === "hardware" && <HardwareView />}
          {activeTab === "screen" && <ScreenAssistantView />}
          {activeTab === "memory" && <MemorySearchView />}
          {activeTab === "python" && <PythonCodebaseView />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <CommandPalette />
      <PermissionModal />
      <SetupWizard />
    </div>
  );
};

export default function App() {
  return (
    <LifeOSProvider>
      <AppContent />
    </LifeOSProvider>
  );
}
