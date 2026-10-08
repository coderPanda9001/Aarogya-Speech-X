import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
try:
    from .database import Base
except ImportError:
    from database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="child")  # child, parent, therapist, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ChildModel(Base):
    __tablename__ = "children"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    hindi_name = Column(String, nullable=False)
    age = Column(Integer, default=6)
    avatar = Column(String, default="🧒")
    target_sound = Column(String, default="र")
    level = Column(String, default="Words")
    progress = Column(Integer, default=0)
    streak_days = Column(Integer, default=1)
    therapist_id = Column(String, nullable=True)
    parent_id = Column(String, nullable=True)
    needs_review = Column(Boolean, default=False)
    sessions_this_week = Column(Integer, default=0)
    weekly_goal = Column(Integer, default=6)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ParentModel(Base):
    __tablename__ = "parents"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)

class TherapistModel(Base):
    __tablename__ = "therapists"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    qualification = Column(String, nullable=False)
    city = Column(String, nullable=False)
    active_children = Column(Integer, default=0)

class SpeechSessionModel(Base):
    __tablename__ = "speech_sessions"

    id = Column(String, primary_key=True, index=True)
    child_id = Column(String, ForeignKey("children.id"), nullable=False)
    word = Column(String, nullable=False)
    target_phoneme = Column(String, nullable=False)
    observed_phoneme = Column(String, nullable=False)
    spoken_text = Column(String, nullable=True)
    error_type = Column(String, nullable=False)  # match, substitution, omission, distortion
    confidence = Column(Float, nullable=False)
    needs_therapist_review = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PhonemeObservationModel(Base):
    __tablename__ = "phoneme_observations"

    id = Column(String, primary_key=True, index=True)
    child_id = Column(String, ForeignKey("children.id"), nullable=False)
    expected = Column(String, nullable=False)
    observed = Column(String, nullable=False)
    error_type = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    word = Column(String, nullable=False)
    position = Column(String, default="Initial")
    date = Column(DateTime, default=datetime.datetime.utcnow)
    needs_therapist_review = Column(Boolean, default=True)

class TherapyMaterialModel(Base):
    __tablename__ = "therapy_materials"

    id = Column(String, primary_key=True, index=True)
    word = Column(String, nullable=False)
    meaning = Column(String, nullable=False)
    emoji = Column(String, nullable=False)
    target_sound = Column(String, nullable=False)
    position = Column(String, nullable=False)  # Initial, Medial, Final
    difficulty = Column(String, nullable=False) # Easy, Medium, Hard
    category = Column(String, nullable=False)
    level = Column(String, nullable=False)

class AppointmentModel(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, index=True)
    child_id = Column(String, ForeignKey("children.id"), nullable=False)
    therapist_id = Column(String, ForeignKey("therapists.id"), nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    mode = Column(String, default="Video")  # Video, In-clinic, Home visit
    status = Column(String, default="Confirmed")  # Confirmed, Pending, Completed
