"""
MongoDB Integration Utility for Screening Logs, Camp Events, and Audit Logs
Symbiosis Institute of Technology, Pune - DCDS Lab ESE Mini-Project
"""

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

class MongoManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.is_connected = False
        try:
            mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
            db_name = os.getenv("MONGO_DB_NAME", "blood_bank_nosql")
            self.client = MongoClient(mongo_uri, serverSelectionTimeoutMS=3000)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[db_name]
            self.is_connected = True
        except (ConnectionFailure, Exception) as e:
            print(f"Warning: MongoDB connection unavailable ({e}). Operating in fallback memory mode.")
            self.is_connected = False

    def log_screening(self, donor_code, donation_code, vitals, result, notes):
        """Log donor screening results into MongoDB."""
        log_doc = {
            "donor_code": donor_code,
            "donation_code": donation_code,
            "vitals": vitals, # e.g., {"hemoglobin": 14.2, "bp": "120/80", "pulse": 76, "weight_kg": 68}
            "screening_result": result, # APPROVED, DEFERRED, PENDING
            "notes": notes,
            "timestamp": datetime.utcnow()
        }
        if self.is_connected:
            try:
                return str(self.db.screening_logs.insert_one(log_doc).inserted_id)
            except Exception as e:
                print(f"MongoDB insert error: {e}")
                return None
        return "fallback_id_screening"

    def add_camp_event(self, camp_name, venue, date, target_units, organizer):
        """Log blood donation camp events."""
        camp_doc = {
            "camp_name": camp_name,
            "venue": venue,
            "date": date,
            "target_units": target_units,
            "organizer": organizer,
            "status": "UPCOMING",
            "created_at": datetime.utcnow()
        }
        if self.is_connected:
            try:
                return str(self.db.camp_events.insert_one(camp_doc).inserted_id)
            except Exception as e:
                print(f"MongoDB camp insert error: {e}")
                return None
        return "fallback_id_camp"

    def log_audit_trail(self, user, action, target_entity, details):
        """Record system audit logs for security and tracking."""
        audit_doc = {
            "user": user,
            "action": action, # CREATE, UPDATE, DELETE, ALLOCATE
            "target_entity": target_entity, # DONOR, INVENTORY, REQUEST
            "details": details,
            "timestamp": datetime.utcnow()
        }
        if self.is_connected:
            try:
                return str(self.db.audit_logs.insert_one(audit_doc).inserted_id)
            except Exception as e:
                print(f"MongoDB audit insert error: {e}")
                return None
        return "fallback_id_audit"

# Global instance
mongo_db = MongoManager()
