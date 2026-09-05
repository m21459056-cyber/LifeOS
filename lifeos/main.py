"""
LifeOS — Desktop Entry Point
Initializes PySide6 application, database, and main window.
"""
import sys
import os
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).parent))

from app.database.connection import init_db
from app.core.config import config_manager
from app.system.monitor import system_monitor

def main():
    print("=" * 60)
    print("      L I F E O S   C O M M A N D   C E N T E R")
    print("=" * 60)
    print("1. Initializing SQLite Database & Schema...")
    init_db()

    print("2. Loading configuration...")
    cfg = config_manager.load()
    accent = cfg.get("appearance", {}).get("accent_color", "#06b6d4")
    print(f"   Theme: Dark | Accent: {accent}")

    print("3. Starting Non-blocking System Telemetry Worker...")
    system_monitor.start(interval=1.5)

    # Check for PySide6 GUI environment
    try:
        from PySide6.QtWidgets import QApplication
        from PySide6.QtCore import Qt
        from ui.main_window import MainWindow

        app = QApplication(sys.argv)
        app.setApplicationName("LifeOS")
        app.setStyle("Fusion")

        window = MainWindow()
        window.show()
        print("LifeOS GUI launched successfully.")
        sys.exit(app.exec())
    except ImportError:
        print("[Notice] PySide6 not installed in current environment.")
        print("Run: pip install -r requirements.txt")
        print("Then run: python main.py")
        print("LifeOS core services validated and ready.")

if __name__ == "__main__":
    main()
