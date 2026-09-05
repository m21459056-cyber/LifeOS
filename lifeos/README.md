# LifeOS — Personal Digital Command Center

LifeOS is an offline-first, modern desktop command center built with Python 3.12+, PySide6, SQLite, and local-first AI (Ollama). It integrates your workstation telemetry, active software and hardware projects, project files, notes, tasks, and ESP32/Arduino serial devices into a unified, secure interface.

---

## Key Features

1. **System Telemetry & Health Dashboard**
   - Live real-time CPU, RAM, GPU, Disk, Network throughput, CPU temperature, and system uptime.
   - Non-blocking background monitoring using `psutil`.

2. **Modular Local-First AI Assistant**
   - Powered by local Ollama (Llama 3, Qwen 2.5, DeepSeek R1, Gemma 2) or OpenAI-compatible / Gemini cloud APIs.
   - Streaming responses with Markdown and syntax highlighting.
   - Workspace-aware context: projects, notes, file structures, and serial logs.

3. **Active Projects & File Explorer**
   - Attach any directory on your computer (e.g., `D:\Projects\Robot`).
   - Interactive tree view with automatic file type detection.
   - Automatic Git repository detection (branch, commits, uncommitted changes).
   - Safe Diff Review before AI file modification.

4. **ESP32 & Arduino Hardware Lab**
   - Serial device autodetect (`COM3 — ESP32`, `COM5 — Arduino Uno`).
   - Live Serial Monitor with timestamped logging.
   - Command terminal with safety gatekeeping (AI cannot send hardware commands like `MOTOR 120` without explicit user permission dialog).

5. **Local-First SQLite Knowledge Memory & Notes**
   - Fast tagging system (`ESP32`, `Arduino`, `Minecraft`, `Python`).
   - SQLite full-text search across past chats, notes, and task archives.

6. **Safety & Permission Protocol**
   - AI actions (shell commands, file alterations, motor/pin triggers) require explicit user approval (`[Allow Once] [Always Allow] [Deny]`).

---

## Requirements & Installation

### Prerequisites
- Windows 10/11, macOS, or Linux
- Python 3.12 or newer
- (Optional) [Ollama](https://ollama.com) installed and running locally (`ollama run qwen2.5:coder` or `ollama run llama3`)

### Quick Start (Windows)
Simply double-click `run.bat` or run:

```bash
# 1. Clone repository
git clone https://github.com/user/lifeos.git
cd lifeos

# 2. Setup virtual environment
python -m venv .venv
source .venv/bin/activate  # on Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Launch LifeOS
python main.py
```

### PyInstaller Standalone Executable (.exe)
To package LifeOS into a single Windows executable:

```bash
pip install pyinstaller
pyinstaller --name="LifeOS" --windowed --noconfirm --onedir main.py
```
The executable will be located in `dist/LifeOS/LifeOS.exe`.

---

## Architecture Overview

```text
lifeos/
├── main.py                     # Application entry point & Qt loop
├── requirements.txt
├── run.bat
├── README.md
├── app/
│   ├── core/config.py          # Settings manager & JSON storage
│   ├── database/models.py      # SQLAlchemy SQLite schemas
│   ├── database/connection.py  # Session factory & SQLite initialization
│   ├── ai/provider.py          # Abstract AI provider & router
│   ├── ai/ollama_client.py     # Local Ollama client with streaming
│   ├── ai/gemini_client.py     # Cloud Gemini fallback
│   ├── ai/agent.py             # Context synthesis & safety parser
│   ├── hardware/serial_manager.py # PySerial background scanner & monitor
│   ├── system/monitor.py       # Psutil background thread
│   ├── projects/scanner.py     # Project directory indexer
│   ├── projects/git_helper.py  # Git repository inspection
│   ├── memory/store.py         # Full-text SQLite memory search
│   └── security/permissions.py # User authorization gatekeeper
├── ui/
│   ├── main_window.py          # PySide6 modern frameless / tabbed layout
│   ├── theme.py                # Dark mode styles & customizable accent colors
│   ├── dashboard/dashboard_view.py
│   ├── chat/chat_view.py
│   ├── projects/projects_view.py
│   ├── notes/notes_view.py
│   ├── tasks/tasks_view.py
│   ├── hardware/hardware_view.py
│   └── settings/settings_view.py
└── tests/                      # Automated unit test suite
```
