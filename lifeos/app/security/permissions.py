"""
LifeOS Security & Permission Gatekeeper
Ensures AI cannot execute arbitrary shell commands, delete files, or send hardware commands without explicit confirmation.
"""
from dataclasses import dataclass
from typing import Optional, Callable

@dataclass
class PermissionRequest:
    action_type: str  # 'shell_exec', 'file_modify', 'hardware_cmd'
    target: str       # e.g., 'python test.py', 'src/main.py', 'MOTOR 120'
    details: str
    callback: Optional[Callable[[bool], None]] = None

class PermissionGatekeeper:
    def __init__(self):
        self.whitelisted_actions = set()
        self.audit_log = []

    def request_permission(self, action_type: str, target: str, details: str) -> bool:
        key = f"{action_type}:{target}"
        if key in self.whitelisted_actions:
            self._log_audit(action_type, target, "ALLOW_CACHED")
            return True

        # In interactive UI, this triggers the Permission Dialog
        return False

    def authorize(self, action_type: str, target: str, scope: str = "once"):
        key = f"{action_type}:{target}"
        if scope == "always":
            self.whitelisted_actions.add(key)
        self._log_audit(action_type, target, f"ALLOWED_{scope.upper()}")

    def deny(self, action_type: str, target: str):
        self._log_audit(action_type, target, "DENIED")

    def _log_audit(self, action_type: str, target: str, result: str):
        self.audit_log.append({
            "action_type": action_type,
            "target": target,
            "result": result
        })

permission_gatekeeper = PermissionGatekeeper()
