"""
LifeOS SQLite Database Connection & Initialization
"""
import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base, Project, Task, Note, ActivityLog, Device

DB_DIR = Path.home() / ".lifeos" / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DB_DIR / "lifeos.db"

DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    # Seed default data if empty
    session = SessionLocal()
    try:
        if session.query(Project).count() == 0:
            demo_project = Project(
                name="ESP32 Robot",
                path=r"D:\Projects\Robot" if os.name == "nt" else str(Path.home() / "Projects" / "Robot"),
                description="Autonomous obstacle avoidance robot with ESP32 and camera vision.",
                progress=78,
                is_active=True
            )
            session.add(demo_project)
            session.flush()

            # Add tasks
            session.add(Task(title="Calibrate motor PWM duty cycle", completed=True, priority="High", project_id=demo_project.id))
            session.add(Task(title="Test I2C ultrasonic distance sensor", completed=True, priority="Medium", project_id=demo_project.id))
            session.add(Task(title="Fix OpenCV camera frame rate drop", completed=False, priority="High", project_id=demo_project.id, due_date="Tomorrow"))
            session.add(Task(title="Implement serial command parser", completed=False, priority="Medium", project_id=demo_project.id, due_date="Next Week"))

            # Add notes
            session.add(Note(
                title="ESP32 Pinout & Motor Driver",
                content="GPIO 16: Motor A IN1\nGPIO 17: Motor A IN2\nGPIO 18: PWM Speed\nBaud: 115200",
                tags="ESP32,Arduino,Hardware",
                project_id=demo_project.id
            ))
            session.add(Note(
                title="OpenCV VideoCapture on Windows",
                content="Always use cv2.CAP_DSHOW to prevent initial 5s camera lag on Windows.",
                tags="Python,OpenCV",
                project_id=demo_project.id
            ))

            # Add initial activities
            session.add(ActivityLog(action_type="file_edit", description="robot.py değiştirildi"))
            session.add(ActivityLog(action_type="device_connect", description="ESP32 COM3 portuna bağlandı"))
            session.add(ActivityLog(action_type="note_create", description="2 yeni not oluşturuldu"))
            session.add(ActivityLog(action_type="ai_chat", description="AI ile motor kontrolü hakkında konuşma yapıldı"))

            # Add devices
            session.add(Device(port="COM3", name="ESP32 Dev Module", baud_rate=115200, is_connected=True))
            session.add(Device(port="COM5", name="Arduino Uno R3", baud_rate=9600, is_connected=False))

            session.commit()
    finally:
        session.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
