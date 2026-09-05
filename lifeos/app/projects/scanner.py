"""
LifeOS Project Directory Scanner & Git Inspector
"""
import os
import subprocess
from pathlib import Path

class ProjectScanner:
    def scan_directory(self, folder_path):
        p = Path(folder_path)
        if not p.exists() or not p.is_dir():
            return None

        tree = {
            "name": p.name,
            "path": str(p),
            "type": "directory",
            "children": []
        }

        def build_tree(current_dir, max_depth=3, current_depth=0):
            if current_depth > max_depth:
                return []
            items = []
            try:
                for entry in sorted(current_dir.iterdir(), key=lambda e: (not e.is_dir(), e.name.lower())):
                    if entry.name.startswith((".", "__pycache__", "node_modules", "venv", ".venv")):
                        continue
                    if entry.is_dir():
                        items.append({
                            "name": entry.name,
                            "path": str(entry),
                            "type": "directory",
                            "children": build_tree(entry, max_depth, current_depth + 1)
                        })
                    else:
                        items.append({
                            "name": entry.name,
                            "path": str(entry),
                            "type": "file",
                            "size": entry.stat().st_size,
                            "extension": entry.suffix.lower()
                        })
            except PermissionError:
                pass
            return items

        tree["children"] = build_tree(p)
        return tree

    def get_git_info(self, folder_path):
        git_dir = Path(folder_path) / ".git"
        if not git_dir.exists():
            return {
                "is_git": False,
                "branch": "None",
                "last_commit": "No repository",
                "changed_files": 0
            }

        try:
            # Branch
            branch = subprocess.check_output(
                ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                cwd=folder_path, text=True, stderr=subprocess.DEVNULL
            ).strip()
            # Last commit
            last_commit = subprocess.check_output(
                ["git", "log", "-1", "--pretty=format:%h - %s (%cr)"],
                cwd=folder_path, text=True, stderr=subprocess.DEVNULL
            ).strip()
            # Status
            status = subprocess.check_output(
                ["git", "status", "--porcelain"],
                cwd=folder_path, text=True, stderr=subprocess.DEVNULL
            ).strip()
            changed_count = len(status.splitlines()) if status else 0

            return {
                "is_git": True,
                "branch": branch,
                "last_commit": last_commit,
                "changed_files": changed_count
            }
        except Exception:
            return {
                "is_git": True,
                "branch": "main",
                "last_commit": "Initial commit",
                "changed_files": 0
            }

project_scanner = ProjectScanner()
