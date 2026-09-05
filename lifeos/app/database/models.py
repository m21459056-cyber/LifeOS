"""
LifeOS SQLAlchemy Database Models
SQLite schema with foreign keys and relationships.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), nullable=False)
    path = Column(String(500), nullable=False, unique=True)
    description = Column(Text, default="")
    progress = Column(Integer, default=0)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    files = relationship("ProjectFile", back_populates="project", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="project")
    tasks = relationship("Task", back_populates="project")

class ProjectFile(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    relative_path = Column(String(500), nullable=False)
    file_type = Column(String(50), default="text")
    size_bytes = Column(Integer, default=0)
    last_modified = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="files")

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(String(255), default="")  # e.g. "ESP32,Arduino,Python"
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="notes")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    completed = Column(Boolean, default=False)
    priority = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    due_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="tasks")

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), default="New Conversation")
    provider = Column(String(50), default="ollama")
    model = Column(String(100), default="llama3")
    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, autoincrement=True)
    port = Column(String(50), nullable=False)  # e.g. COM3 or /dev/ttyUSB0
    name = Column(String(120), nullable=False)  # e.g. ESP32, Arduino Uno
    baud_rate = Column(Integer, default=115200)
    is_connected = Column(Boolean, default=False)
    last_seen = Column(DateTime, default=datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = "activity_log"
    id = Column(Integer, primary_key=True, autoincrement=True)
    action_type = Column(String(50), nullable=False)  # file_edit, device_connect, note_create, ai_chat
    description = Column(String(500), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    action_type = Column(String(50), nullable=False)  # shell_exec, file_modify, hardware_cmd
    target = Column(String(255), nullable=False)
    allowed = Column(Boolean, default=False)
    scope = Column(String(20), default="once")  # once, always, denied
    timestamp = Column(DateTime, default=datetime.utcnow)
