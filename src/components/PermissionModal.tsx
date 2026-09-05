import React from "react";
import { useLifeOS } from "../context/LifeOSContext";
import { ShieldAlert, Terminal, Cpu, FileCode2, Check, X, AlertTriangle } from "lucide-react";

export const PermissionModal: React.FC = () => {
  const { pendingPermission, handlePermissionResponse } = useLifeOS();

  if (!pendingPermission) return null;

  const isHardware = pendingPermission.type === "hardware";
  const isDiff = pendingPermission.type === "file_diff";
  const isShell = pendingPermission.type === "shell";

  return (
    <div className="fixed inset-0 bg-[#050608]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_25px_rgba(37,99,235,0.25)] overflow-hidden p-6 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3.5 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              {isHardware ? "Donanım Komutu İzin Talebi" : isDiff ? "Dosya Değişikliği Onayı" : "Komut Çalıştırma Talebi"}
            </h3>
            <p className="text-xs text-slate-400">LifeOS Güvenlik ve İzin Sandbox Sistemi</p>
          </div>
        </div>

        {/* Body content */}
        <div className="py-4 space-y-3.5 text-xs">
          <p className="text-slate-300 font-medium">
            AI asistanı sisteminizde aşağıdaki işlemi gerçekleştirmek istiyor:
          </p>

          {isHardware && (
            <div className="p-3.5 rounded-xl bg-[#08090d] border border-slate-800/80 font-mono space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  Hedef Cihaz: {pendingPermission.target}
                </span>
                <span className="text-amber-400 font-medium">Onay Bekliyor</span>
              </div>
              <div className="text-blue-300 text-sm font-bold bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                {pendingPermission.command}
              </div>
              <p className="text-[11px] text-slate-400">{pendingPermission.description}</p>
            </div>
          )}

          {isDiff && (
            <div className="p-3.5 rounded-xl bg-[#08090d] border border-slate-800/80 font-mono space-y-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                Hedef Dosya: <span className="text-white font-semibold">{pendingPermission.target}</span>
              </div>
              <div className="text-[11px] text-slate-300 max-h-36 overflow-y-auto bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 whitespace-pre">
                {pendingPermission.diff}
              </div>
              <p className="text-[11px] text-slate-400">{pendingPermission.description}</p>
            </div>
          )}

          {isShell && (
            <div className="p-3.5 rounded-xl bg-[#08090d] border border-slate-800/80 font-mono space-y-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Shell Komutu:
              </div>
              <div className="text-white text-xs font-bold bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                {pendingPermission.target}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Kullanıcı onayı olmadan donanıma veya dosyalara doğrudan müdahale edilmez.</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            id="btn-permission-deny"
            onClick={() => handlePermissionResponse(false)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-1.5 transition-colors font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reddet (Cancel)</span>
          </button>

          <button
            id="btn-permission-allow-once"
            onClick={() => handlePermissionResponse(true, false)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isHardware ? "Komutu Gönder (Send)" : isDiff ? "Değişikliği Uygula (Apply)" : "Bir Kez İzin Ver"}</span>
          </button>

          {!isDiff && (
            <button
              id="btn-permission-always-allow"
              onClick={() => handlePermissionResponse(true, true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Her Zaman İzin Ver
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
