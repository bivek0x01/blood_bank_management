"""
Donation & Screening Business Logic Service
Symbiosis Institute of Technology, Pune - DCDS Lab ESE Mini-Project
"""

from database.sql_db import execute_query, execute_transaction
from database.mongodb import mongo_db
from datetime import datetime, timedelta

class DonationService:
    @staticmethod
    def get_all_donations():
        query = """
            SELECT don.*, d.full_name AS donor_name, d.donor_code, d.blood_group 
            FROM donations don
            JOIN donors d ON don.donor_id = d.donor_id
            ORDER BY don.donation_date DESC
        """
        return execute_query(query)

    @staticmethod
    def create_donation(data):
        donation_code = f"DON-{int(execute_query('SELECT COUNT(*) as cnt FROM donations')[0]['cnt']) + 501}"
        donor_id = data.get('donor_id')
        donation_date = data.get('donation_date', datetime.now().strftime('%Y-%m-%d'))
        quantity_ml = int(data.get('quantity_ml', 350))
        screening_status = data.get('screening_status', 'PENDING')
        deferral_reason = data.get('deferral_reason', None)
        collected_by = data.get('collected_by', 'Staff Nurse')
        notes = data.get('notes', '')

        queries = [
            ("""
                INSERT INTO donations (donation_code, donor_id, donation_date, quantity_ml, screening_status, deferral_reason, collected_by, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (donation_code, donor_id, donation_date, quantity_ml, screening_status, deferral_reason, collected_by, notes))
        ]

        success, msg = execute_transaction(queries)
        if success:
            # If screening status is APPROVED, automatically generate blood unit record
            if screening_status == 'APPROVED':
                # Get donor blood group
                donor_res = execute_query("SELECT blood_group, donor_code FROM donors WHERE donor_id = %s", (donor_id,))
                if donor_res:
                    blood_group = donor_res[0]['blood_group']
                    donor_code = donor_res[0]['donor_code']
                    
                    # Find donation_id
                    don_res = execute_query("SELECT donation_id FROM donations WHERE donation_code = %s", (donation_code,))
                    if don_res:
                        donation_id = don_res[0]['donation_id']
                        unit_code = f"UNT-{int(execute_query('SELECT COUNT(*) as cnt FROM blood_units')[0]['cnt']) + 901}"
                        collection_dt = datetime.strptime(donation_date, '%Y-%m-%d')
                        expiry_dt = collection_dt + timedelta(days=42) # 42 days standard whole blood/RBC shelf life
                        
                        unit_query = """
                            INSERT INTO blood_units (unit_code, donation_id, blood_group, component_type, collection_date, expiry_date, status, storage_location)
                            VALUES (%s, %s, %s, %s, %s, %s, 'AVAILABLE', 'Main Cold Storage A1')
                        """
                        execute_transaction([(unit_query, (unit_code, donation_id, blood_group, data.get('component_type', 'Whole Blood'), donation_date, expiry_dt.strftime('%Y-%m-%d')))])

            # Log screening in MongoDB
            mongo_db.log_screening(
                donor_code=donor_res[0]['donor_code'] if 'donor_res' in locals() and donor_res else 'DNR-UNKNOWN',
                donation_code=donation_code,
                vitals={"hemoglobin": data.get('hemoglobin', 14.0), "bp": data.get('bp', '120/80'), "pulse": 74},
                result=screening_status,
                notes=notes
            )
            mongo_db.log_audit_trail("System Staff", "CREATE", "DONATION", f"Recorded donation {donation_code} with status {screening_status}")
            return True, donation_code
        return False, msg
