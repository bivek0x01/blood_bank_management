"""
Donor Business Logic Service
Symbiosis Institute of Technology, Pune - DCDS Lab ESE Mini-Project
"""

from database.sql_db import execute_query, execute_transaction
from database.mongodb import mongo_db

class DonorService:
    @staticmethod
    def get_all_donors(search=None, blood_group=None, city=None):
        query = "SELECT * FROM donors WHERE 1=1"
        params = []
        
        if search:
            query += " AND (full_name LIKE %s OR donor_code LIKE %s OR phone LIKE %s)"
            search_term = f"%{search}%"
            params.extend([search_term, search_term, search_term])
            
        if blood_group and blood_group != 'ALL':
            query += " AND blood_group = %s"
            params.append(blood_group)
            
        if city and city != 'ALL':
            query += " AND city = %s"
            params.append(city)
            
        query += " ORDER BY created_at DESC"
        return execute_query(query, tuple(params))

    @staticmethod
    def get_donor_by_id(donor_id):
        query = "SELECT * FROM donors WHERE donor_id = %s"
        res = execute_query(query, (donor_id,))
        return res[0] if res else None

    @staticmethod
    def create_donor(data):
        donor_code = f"DNR-{int(execute_query('SELECT COUNT(*) as cnt FROM donors')[0]['cnt']) + 1001}"
        query = """
            INSERT INTO donors (donor_code, full_name, age, gender, blood_group, phone, email, city, address, consent_for_contact, is_eligible)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            donor_code,
            data.get('full_name'),
            int(data.get('age')),
            data.get('gender'),
            data.get('blood_group'),
            data.get('phone'),
            data.get('email', ''),
            data.get('city'),
            data.get('address', ''),
            data.get('consent_for_contact', True),
            data.get('is_eligible', True)
        )
        success, msg = execute_transaction([(query, params)])
        if success:
            mongo_db.log_audit_trail("System Admin", "CREATE", "DONOR", f"Created donor {donor_code} - {data.get('full_name')}")
            return True, donor_code
        return False, msg

    @staticmethod
    def update_donor(donor_id, data):
        query = """
            UPDATE donors 
            SET full_name = %s, age = %s, gender = %s, blood_group = %s, phone = %s, email = %s, city = %s, address = %s, consent_for_contact = %s, is_eligible = %s
            WHERE donor_id = %s
        """
        params = (
            data.get('full_name'),
            int(data.get('age')),
            data.get('gender'),
            data.get('blood_group'),
            data.get('phone'),
            data.get('email', ''),
            data.get('city'),
            data.get('address', ''),
            data.get('consent_for_contact', True),
            data.get('is_eligible', True),
            donor_id
        )
        success, msg = execute_transaction([(query, params)])
        if success:
            mongo_db.log_audit_trail("System Admin", "UPDATE", "DONOR", f"Updated donor ID {donor_id}")
            return True, "Donor updated successfully"
        return False, msg
