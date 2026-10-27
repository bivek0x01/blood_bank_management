"""
Hospital Blood Request & Transactional Allocation Service
Symbiosis Institute of Technology, Pune - DCDS Lab ESE Mini-Project
"""

from database.sql_db import execute_query, execute_transaction
from database.mongodb import mongo_db

class RequestService:
    @staticmethod
    def get_all_requests():
        query = """
            SELECT br.*, h.hospital_name, h.city, h.phone AS hospital_phone 
            FROM blood_requests br
            JOIN hospitals h ON br.hospital_id = h.hospital_id
            ORDER BY br.request_date DESC
        """
        return execute_query(query)

    @staticmethod
    def create_request(data):
        request_code = f"REQ-{int(execute_query('SELECT COUNT(*) as cnt FROM blood_requests')[0]['cnt']) + 701}"
        query = """
            INSERT INTO blood_requests (request_code, hospital_id, blood_group, component_type, quantity_requested, priority, required_by_date, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            request_code,
            data.get('hospital_id'),
            data.get('blood_group'),
            data.get('component_type', 'Packed RBC'),
            int(data.get('quantity_requested')),
            data.get('priority', 'ROUTINE'),
            data.get('required_by_date'),
            data.get('notes', '')
        )
        success, msg = execute_transaction([(query, params)])
        if success:
            mongo_db.log_audit_trail("Hospital Coordinator", "CREATE", "REQUEST", f"Created blood request {request_code}")
            return True, request_code
        return False, msg

    @staticmethod
    def allocate_unit_to_request(request_id, unit_id, staff_name="Dr. Rajesh Sharma"):
        """
        Perform transactional unit allocation to prevent duplicate allocation
        and ensure ACID consistency.
        """
        # 1. Verify unit is AVAILABLE and not expired
        unit_check = execute_query(
            "SELECT blood_group, status, expiry_date FROM blood_units WHERE unit_id = %s", 
            (unit_id,)
        )
        if not unit_check:
            return False, "Blood unit not found"
        
        unit = unit_check[0]
        if unit['status'] != 'AVAILABLE':
            return False, f"Unit is not available (Current status: {unit['status']})"

        # 2. Verify request exists and needs units
        req_check = execute_query(
            "SELECT blood_group, quantity_requested, quantity_allocated, request_status FROM blood_requests WHERE request_id = %s",
            (request_id,)
        )
        if not req_check:
            return False, "Blood request not found"
        
        req = req_check[0]
        if req['blood_group'] != unit['blood_group']:
            return False, f"Blood group mismatch! Request is for {req['blood_group']}, but unit is {unit['blood_group']}"

        if req['quantity_allocated'] >= req['quantity_requested']:
            return False, "Request is already fully fulfilled"

        new_allocated = req['quantity_allocated'] + 1
        new_status = 'FULFILLED' if new_allocated >= req['quantity_requested'] else 'PARTIALLY_FULFILLED'

        queries = [
            ("UPDATE blood_units SET status = 'ISSUED' WHERE unit_id = %s", (unit_id,)),
            ("INSERT INTO request_allocations (request_id, unit_id, allocated_by) VALUES (%s, %s, %s)", (request_id, unit_id, staff_name)),
            ("UPDATE blood_requests SET quantity_allocated = %s, request_status = %s WHERE request_id = %s", (new_allocated, new_status, request_id))
        ]

        success, msg = execute_transaction(queries)
        if success:
            mongo_db.log_audit_trail(staff_name, "ALLOCATE", "REQUEST", f"Allocated unit ID {unit_id} to request ID {request_id}")
            return True, "Unit successfully allocated in transaction"
        return False, msg
