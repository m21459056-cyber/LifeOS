"""
Unit tests for LifeOS database, memory store, and permission gatekeeper.
"""
import unittest
from app.database.connection import init_db, SessionLocal
from app.database.models import Project, Note, Task
from app.memory.store import memory_store
from app.security.permissions import permission_gatekeeper

class TestLifeOSCore(unittest.TestCase):
    def setUp(self):
        init_db()

    def test_database_seeding(self):
        session = SessionLocal()
        try:
            projects = session.query(Project).all()
            self.assertGreater(len(projects), 0)
            p = projects[0]
            self.assertEqual(p.name, "ESP32 Robot")

            tasks = session.query(Task).filter(Task.project_id == p.id).all()
            self.assertGreater(len(tasks), 0)
        finally:
            session.close()

    def test_memory_search(self):
        results = memory_store.search_all("ESP32")
        self.assertIsInstance(results, list)
        self.assertGreater(len(results), 0)

    def test_permission_gatekeeper(self):
        # By default not allowed
        allowed = permission_gatekeeper.request_permission("hardware_cmd", "MOTOR 120", "Turn motor")
        self.assertFalse(allowed)

        # After authorize
        permission_gatekeeper.authorize("hardware_cmd", "MOTOR 120", scope="always")
        allowed_after = permission_gatekeeper.request_permission("hardware_cmd", "MOTOR 120", "Turn motor")
        self.assertTrue(allowed_after)

if __name__ == "__main__":
    unittest.main()
