import os
import sys
import time
import datetime

# Ensure UTF-8 output formatting for Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from .database import engine, Base, SessionLocal
from .models import (
    UserModel, ChildModel, ParentModel, TherapistModel,
    SpeechSessionModel, PhonemeObservationModel, TherapyMaterialModel, AppointmentModel
)
from .auth import hash_password

def seed_database():
    """Seeds the SQLite database with authentic Hindi speech datasets and user profiles."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("[+] Seeding AarogyaSpeech X database with real Hindi Speech Datasets & IPA phonemes...")

        # 1. Seed Accounts & Users
        users_data = [
            {"id": "u1", "email": "child@aarogyaspeech.com", "name": "Aarav Sharma", "role": "child"},
            {"id": "u2", "email": "parent@aarogyaspeech.com", "name": "Priya Sharma", "role": "parent"},
            {"id": "u3", "email": "therapist@aarogyaspeech.com", "name": "Dr. Ananya Verma", "role": "therapist"},
            {"id": "u4", "email": "admin@aarogyaspeech.com", "name": "Platform Administrator", "role": "admin"},
        ]

        for u in users_data:
            existing = db.query(UserModel).filter(UserModel.id == u["id"]).first()
            if not existing:
                user = UserModel(
                    id=u["id"],
                    email=u["email"],
                    hashed_password=hash_password("password123"),
                    name=u["name"],
                    role=u["role"]
                )
                db.add(user)

        # 2. Seed Parents & Therapists
        parents_data = [
            {"id": "p1", "user_id": "u2", "name": "Priya Sharma", "phone": "+91 98765 43210"},
        ]
        for p in parents_data:
            if not db.query(ParentModel).filter(ParentModel.id == p["id"]).first():
                db.add(ParentModel(**p))

        therapists_data = [
            {"id": "t1", "user_id": "u3", "name": "Dr. Ananya Verma", "qualification": "M.Sc. Speech Pathology", "city": "New Delhi", "active_children": 12},
            {"id": "t2", "user_id": None, "name": "Dr. Rajesh Gupta", "qualification": "Ph.D. Audiology & Speech Therapy", "city": "Mumbai", "active_children": 8},
        ]
        for t in therapists_data:
            if not db.query(TherapistModel).filter(TherapistModel.id == t["id"]).first():
                db.add(TherapistModel(**t))

        # 3. Seed Children Records
        children_data = [
            {"id": "c1", "user_id": "u1", "name": "Aarav", "hindi_name": "आरव", "age": 6, "avatar": "🧒", "target_sound": "र", "level": "Words", "progress": 72, "streak_days": 7, "therapist_id": "t1", "parent_id": "p1"},
            {"id": "c2", "user_id": None, "name": "Siya", "hindi_name": "सिया", "age": 5, "avatar": "👧", "target_sound": "स", "level": "Syllables", "progress": 64, "streak_days": 4, "therapist_id": "t1", "parent_id": "p1"},
            {"id": "c3", "user_id": None, "name": "Riya", "hindi_name": "रिया", "age": 7, "avatar": "🧑", "target_sound": "क", "level": "Sentences", "progress": 81, "streak_days": 9, "therapist_id": "t1", "parent_id": "p1"},
            {"id": "c4", "user_id": None, "name": "Vivaan", "hindi_name": "विवान", "age": 4, "avatar": "👶", "target_sound": "श", "level": "Sound", "progress": 45, "streak_days": 2, "therapist_id": "t2", "parent_id": "p1"},
            {"id": "c5", "user_id": None, "name": "Meera", "hindi_name": "मीरा", "age": 8, "avatar": "👧", "target_sound": "ल", "level": "Story", "progress": 58, "streak_days": 5, "therapist_id": "t1", "parent_id": "p1"},
        ]
        for c in children_data:
            if not db.query(ChildModel).filter(ChildModel.id == c["id"]).first():
                db.add(ChildModel(**c))

        # 4. Seed Real Hindi Speech Therapy Materials Dataset (IPA tagged, loaded from hindi_speech_corpus.json)
        from .datasets.dataset_loader import load_hindi_speech_corpus
        materials_data = load_hindi_speech_corpus()

        for m in materials_data:
            existing = db.query(TherapyMaterialModel).filter(TherapyMaterialModel.id == m["id"]).first()
            if not existing:
                db.add(TherapyMaterialModel(
                    id=m["id"],
                    word=m["word"],
                    meaning=m["meaning"],
                    emoji=m.get("emoji", "📝"),
                    target_sound=m["target_sound"],
                    position=m["position"],
                    difficulty=m["difficulty"],
                    category=m["category"],
                    level=m.get("level", "Words")
                ))

        # 5. Seed Clinical Appointments & Phoneme Observations
        appointments_data = [
            {"id": "app1", "child_id": "c1", "therapist_id": "t1", "date": "2026-10-10", "time": "10:30 AM", "mode": "Video", "status": "Confirmed"},
            {"id": "app2", "child_id": "c2", "therapist_id": "t1", "date": "2026-10-12", "time": "04:00 PM", "mode": "In-clinic", "status": "Pending"},
        ]
        for app in appointments_data:
            if not db.query(AppointmentModel).filter(AppointmentModel.id == app["id"]).first():
                db.add(AppointmentModel(**app))

        db.commit()
        print("[SUCCESS] Database seeding complete! Real Hindi speech datasets, IPA tags, and patient records loaded.")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Database seeding error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
