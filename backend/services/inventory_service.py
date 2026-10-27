"""
Blood Inventory Business Logic Service
Symbiosis Institute of Technology, Pune - DCDS Lab ESE Mini-Project
"""

from database.sql_db import execute_query, execute_transaction
from database.mongodb import mongo_db

class InventoryService:
    @staticmethod
    def get_inventory(blood_group=None, status=None):
        query = """
            SELECT bu.*, d.full_name AS donor_name, d.phone AS donor_phone 
            FROM blood_units bu
            JOIN donations don ON bu.donation_id = don.donation_id
            JOIN donors d ON don.donor_id = d.donor_id
            WHERE 1=1
        """
        params = []
        if blood_group and blood_group != 'ALL':
            query += " AND bu.blood_group = %s"
            params.append(blood_group)
        if status and status != 'ALL':
            query += " AND bu.status = %s"
            params.append(status)
        query += " ORDER BY bu.expiry_date ASC"
        return execute_query(query, tuple(params))

    @staticmethod
    def get_stock_summary():
        query = """
            SELECT 
                blood_group,
                component_type,
                COUNT(unit_id) AS available_count,
                MIN(expiry_date) AS earliest_expiry
            FROM blood_units
            WHERE status = 'AVAILABLE' AND expiry_date >= CURDATE()
            GROUP BY blood_group, component_type
            ORDER BY blood_group
        """
        return execute_query(query)

    @staticmethod
    def update_unit_status(unit_id, new_status):
        query = "UPDATE blood_units SET status = %s WHERE unit_id = %s"
        success, msg = execute_transaction([(query, (new_status, unit_id))])
        if success:
            mongo_db.log_audit_trail("Admin Staff", "UPDATE", "INVENTORY", f"Updated blood unit ID {unit_id} status to {new_status}")
            return True, "Inventory status updated"
        return False, msg
