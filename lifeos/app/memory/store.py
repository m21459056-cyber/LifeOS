"""
LifeOS Memory System & Knowledge Search
Provides full-text search across notes, past discussions, and project metadata.
"""
from sqlalchemy import or_
from ..database.connection import SessionLocal
from ..database.models import Note, Message, Task, Project

class MemoryStore:
    def search_all(self, query_str: str, limit: int = 15):
        if not query_str.strip():
            return []

        term = f"%{query_str}%"
        results = []
        session = SessionLocal()
        try:
            # 1. Notes search
            notes = session.query(Note).filter(
                or_(Note.title.ilike(term), Note.content.ilike(term), Note.tags.ilike(term))
            ).limit(limit).all()
            for n in notes:
                results.append({
                    "category": "note",
                    "id": n.id,
                    "title": n.title,
                    "snippet": n.content[:140] + ("..." if len(n.content) > 140 else ""),
                    "tags": n.tags,
                    "date": n.created_at.strftime("%Y-%m-%d")
                })

            # 2. Tasks search
            tasks = session.query(Task).filter(Task.title.ilike(term)).limit(limit).all()
            for t in tasks:
                results.append({
                    "category": "task",
                    "id": t.id,
                    "title": t.title,
                    "snippet": f"Priority: {t.priority} | Completed: {t.completed}",
                    "tags": t.priority,
                    "date": t.created_at.strftime("%Y-%m-%d")
                })

            # 3. Past conversations
            messages = session.query(Message).filter(Message.content.ilike(term)).limit(limit).all()
            for m in messages:
                results.append({
                    "category": "chat",
                    "id": m.id,
                    "title": f"Chat ({m.role})",
                    "snippet": m.content[:140] + ("..." if len(m.content) > 140 else ""),
                    "tags": m.role,
                    "date": m.timestamp.strftime("%Y-%m-%d")
                })

            return results
        finally:
            session.close()

    def get_project_context(self, project_name: str) -> str:
        session = SessionLocal()
        try:
            proj = session.query(Project).filter(Project.name.ilike(f"%{project_name}%")).first()
            if not proj:
                return "No matching project."
            notes = session.query(Note).filter(Note.project_id == proj.id).all()
            notes_text = "\n".join([f"- [{n.title}]: {n.content[:100]}" for n in notes])
            return f"Project: {proj.name} ({proj.path})\nNotes:\n{notes_text}"
        finally:
            session.close()

memory_store = MemoryStore()
