import React, { useState } from "react";
import { useLifeOS } from "../context/LifeOSContext";
import {
  FolderGit2,
  Folder,
  FileCode,
  FileText,
  ChevronRight,
  ChevronDown,
  GitBranch,
  GitCommit,
  Copy,
  Check,
  Bot,
  Plus,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { ProjectFileItem } from "../types";

export const ProjectsView: React.FC = () => {
  const {
    projects,
    activeProject,
    setActiveProjectId,
    setActiveTab,
    sendChatMessage,
    getAccentClasses,
  } = useLifeOS();

  const [selectedFile, setSelectedFile] = useState<ProjectFileItem | null>(
    activeProject.fileTree[0]?.children?.[0] || activeProject.fileTree[0]
  );
  const [copied, setCopied] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    src: true,
    assets: false,
    tests: false,
  });

  const accent = getAccentClasses();

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAIAboutFile = () => {
    if (!selectedFile) return;
    setActiveTab("ai");
    sendChatMessage(
      `Lütfen \`${selectedFile.path}\` dosyasını analiz et ve mimarisini açıkla. İçerik:\n\`\`\`python\n${
        selectedFile.content || "# Empty file"
      }\n\`\`\``
    );
  };

  // Render tree recursively
  const renderTree = (items: ProjectFileItem[], depth = 0) => {
    return items.map((item) => {
      const isDir = item.type === "directory";
      const isExpanded = !!expandedFolders[item.path];
      const isSelected = selectedFile?.path === item.path;

      if (isDir) {
        return (
          <div key={item.path}>
            <button
              onClick={() => toggleFolder(item.path)}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              className="w-full flex items-center gap-1.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded transition-colors text-left"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
              <Folder className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium">{item.name}</span>
            </button>
            {isExpanded && item.children && renderTree(item.children, depth + 1)}
          </div>
        );
      }

      return (
        <button
          key={item.path}
          onClick={() => setSelectedFile(item)}
          style={{ paddingLeft: `${depth * 12 + 22}px` }}
          className={`w-full flex items-center gap-1.5 py-1 text-xs rounded transition-colors text-left ${
            isSelected
              ? "bg-slate-800 text-cyan-300 font-semibold"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
          }`}
        >
          {item.extension === ".py" ? (
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className="truncate">{item.name}</span>
        </button>
      );
    });
  };

  return (
    <div id="projects-view" className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Project Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          {projects.map((p) => {
            const isActive = p.id === activeProject.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProjectId(p.id);
                  setSelectedFile(p.fileTree[0]?.children?.[0] || p.fileTree[0]);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600/20 border border-blue-500/40 text-blue-300 shadow-[0_0_12px_rgba(37,99,235,0.25)]"
                    : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <FolderGit2 className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                <span>{p.name}</span>
                <span className="text-[10px] font-mono text-slate-500">{p.progress}%</span>
              </button>
            );
          })}
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors">
          <Plus className="w-3.5 h-3.5 text-blue-400" />
          <span>Yeni Proje Klasörü Ekle</span>
        </button>
      </div>

      {/* Git & Project Info Strip */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
            <GitBranch className="w-4 h-4 text-blue-400" />
            <span className="text-slate-500">Branch:</span>
            <span className="font-semibold text-white">{activeProject.git.branch}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
            <GitCommit className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-500">Son Commit:</span>
            <span className="truncate max-w-xs">{activeProject.git.lastCommit}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
            {activeProject.git.changedFiles} Değişen Dosya
          </span>
          <span className="text-[11px] font-mono text-slate-400">{activeProject.path}</span>
        </div>
      </div>

      {/* Explorer & Code Viewer Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[560px]">
        {/* Left: Directory Tree (1 col) */}
        <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Dosya Gezgini
              </span>
              <span className="text-[10px] font-mono text-blue-400">{activeProject.name}</span>
            </div>
            <div className="space-y-0.5 overflow-y-auto max-h-[460px]">
              {renderTree(activeProject.fileTree)}
            </div>
          </div>
        </div>

        {/* Right: Code Viewer (3 cols) */}
        <div className="md:col-span-3 rounded-2xl bg-[#08090d] border border-slate-800/80 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* File Header */}
          <div className="h-11 px-4 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>{selectedFile?.path || "Dosya seçilmedi"}</span>
              {selectedFile?.size && (
                <span className="text-[10px] text-slate-500">({selectedFile.size} bayt)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAskAIAboutFile}
                className="px-3 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs text-blue-300 font-medium flex items-center gap-1.5 transition-colors"
                title="AI ile bu dosyayı incele"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI'a Sor</span>
              </button>

              <button
                onClick={() => handleCopy(selectedFile?.content || "")}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                title="Kodu Kopyala"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-y-auto leading-relaxed bg-[#08090d]">
            {selectedFile?.content ? (
              <pre className="whitespace-pre">
                {selectedFile.content.split("\n").map((line, idx) => (
                  <div key={idx} className="table-row">
                    <span className="table-cell pr-4 text-slate-600 select-none text-right font-mono text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="table-cell">{line}</span>
                  </div>
                ))}
              </pre>
            ) : (
              <div className="text-center py-20 text-slate-500">
                Bu dosya için metin içeriği yüklenmedi veya dosya ikili (binary).
              </div>
            )}
          </div>

          {/* Footer bar */}
          <div className="h-8 px-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>UTF-8 • Python / Text</span>
            <span>Local-First Workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
};
