"""
LifeOS AI Orchestrator & Context Synthesizer
Pre-retrieves notes, project status, and serial device context before generation.
Extracts proposed hardware/shell/file actions to require user approval.
"""
import re
from typing import Dict, Any, Tuple, Optional
from ..memory.store import memory_store
from ..hardware.serial_manager import serial_manager
from ..system.monitor import system_monitor

class AIAgent:
    def __init__(self, ollama_client):
        self.ollama = ollama_client

    def prepare_prompt_context(self, user_query: str, active_project_name: str = "ESP32 Robot") -> str:
        # 1. Search notes and memory for relevant snippets
        memory_results = memory_store.search_all(user_query[:30], limit=3)
        memory_context = "\n".join([f"- [{r['category'].upper()}] {r['title']}: {r['snippet']}" for r in memory_results])

        # 2. Hardware status
        hw_status = f"Port: {serial_manager.connected_port or 'Disconnected'}"
        if serial_manager.connected_port and serial_manager.log_history:
            recent_logs = "\n".join(serial_manager.log_history[-4:])
            hw_status += f"\nRecent Serial Output:\n{recent_logs}"

        # 3. System stats
        stats = system_monitor.get_current_stats()
        sys_info = f"CPU: {stats.get('cpu_percent')}% | RAM: {stats.get('ram_percent')}% | Temp: {stats.get('cpu_temp')}°C"

        context = f"""
[SYSTEM CONTEXT]
Active Project: {active_project_name}
System Telemetry: {sys_info}
Hardware Telemetry: {hw_status}
Related Memory/Notes:
{memory_context if memory_context else 'None'}
"""
        return context

    def detect_action(self, text: str) -> Optional[Dict[str, Any]]:
        """
        Detects if AI suggested dangerous commands or changes:
        e.g. MOTOR 120, LED ON, python test.py, file modifications
        """
        lower = text.lower()
        if "motor" in lower or "led on" in lower or "led off" in lower:
            # Extract serial command
            cmd_match = re.search(r"(MOTOR\s+\d+|LED\s+(?:ON|OFF)|STATUS)", text, re.IGNORECASE)
            cmd = cmd_match.group(1).upper() if cmd_match else "MOTOR 120"
            return {
                "action_type": "hardware_cmd",
                "target": cmd,
                "description": f"AI wants to send hardware command: {cmd}"
            }
        if "python " in lower and ".py" in lower:
            cmd_match = re.search(r"(python\s+[\w\-./\\]+\.py)", text, re.IGNORECASE)
            cmd = cmd_match.group(1) if cmd_match else "python script.py"
            return {
                "action_type": "shell_exec",
                "target": cmd,
                "description": f"AI wants to execute command: {cmd}"
            }
        return None
