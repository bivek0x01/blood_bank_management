"""
Flask Backend Application for Blood Bank Management System
Symbiosis Institute of Technology, Pune - B.Tech CSE DCDS Lab ESE Mini-Project
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

from database.sql_db import execute_query
from database.mongodb import mongo_db
from backend.services.donor_service import DonorService
from backend.services.donation_service import DonationService
from backend.services.inventory_service import InventoryService
from backend.services.request_service import RequestService
from backend.utils.validation import validate_donor_data, validate_donation_data, validate_request_data

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "institute": "Symbiosis Institute of Technology, Pune",
        "project": "Blood Bank Management System",
        "mongodb_connected": mongo_db.is_connected
    })

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_stats():
    try:
        total_donors = execute_query("SELECT COUNT(*) as count FROM donors")[0]['count']
        total_donations = execute_query("SELECT COUNT(*) as count FROM donations WHERE screening_status = 'APPROVED'")[0]['count']
        available_units = execute_query("SELECT COUNT(*) as count FROM blood_units WHERE status = 'AVAILABLE' AND expiry_date >= CURDATE()")[0]['count']
        pending_requests = execute_query("SELECT COUNT(*) as count FROM blood_requests WHERE request_status IN ('PENDING', 'PARTIALLY_FULFILLED')")[0]['count']
        near_expiry = execute_query("SELECT COUNT(*) as count FROM blood_units WHERE status = 'AVAILABLE' AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)")[0]['count']
        
        stock_by_group = InventoryService.get_stock_summary()
        recent_donations = DonationService.get_all_donations()[:5]
        recent_requests = RequestService.get_all_requests()[:5]
        
        return jsonify({
            "total_donors": total_donors,
            "total_donations": total_donations,
            "available_units": available_units,
            "pending_requests": pending_requests,
            "near_expiry_units": near_expiry,
            "stock_by_group": stock_by_group,
            "recent_donations": recent_donations,
            "recent_requests": recent_requests
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/donors', methods=['GET', 'POST'])
def handle_donors():
    if request.method == 'GET':
        search = request.args.get('search')
        blood_group = request.args.get('blood_group')
        city = request.args.get('city')
        donors = DonorService.get_all_donors(search, blood_group, city)
        return jsonify(donors)
    elif request.method == 'POST':
        data = request.json
        errors = validate_donor_data(data)
        if errors:
            return jsonify({"errors": errors}), 400
        success, res = DonorService.create_donor(data)
        if success:
            return jsonify({"message": "Donor created successfully", "donor_code": res}), 201
        return jsonify({"error": res}), 400

@app.route('/api/donors/<int:donor_id>', methods=['PUT'])
def update_donor(donor_id):
    data = request.json
    errors = validate_donor_data(data)
    if errors:
        return jsonify({"errors": errors}), 400
    success, msg = DonorService.update_donor(donor_id, data)
    if success:
        return jsonify({"message": msg}), 200
    return jsonify({"error": msg}), 400

@app.route('/api/donations', methods=['GET', 'POST'])
def handle_donations():
    if request.method == 'GET':
        donations = DonationService.get_all_donations()
        return jsonify(donations)
    elif request.method == 'POST':
        data = request.json
        errors = validate_donation_data(data)
        if errors:
            return jsonify({"errors": errors}), 400
        success, res = DonationService.create_donation(data)
        if success:
            return jsonify({"message": "Donation recorded successfully", "donation_code": res}), 201
        return jsonify({"error": res}), 400

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    blood_group = request.args.get('blood_group')
    status = request.args.get('status')
    units = InventoryService.get_inventory(blood_group, status)
    return jsonify(units)

@app.route('/api/inventory/<int:unit_id>/status', methods=['PUT'])
def update_inventory_status(unit_id):
    data = request.json
    new_status = data.get('status')
    success, msg = InventoryService.update_unit_status(unit_id, new_status)
    if success:
        return jsonify({"message": msg}), 200
    return jsonify({"error": msg}), 400

@app.route('/api/hospitals', methods=['GET', 'POST'])
def handle_hospitals():
    if request.method == 'GET':
        hospitals = execute_query("SELECT * FROM hospitals ORDER BY hospital_name ASC")
        return jsonify(hospitals)
    elif request.method == 'POST':
        data = request.json
        hospital_code = f"HSP-{int(execute_query('SELECT COUNT(*) as cnt FROM hospitals')[0]['cnt']) + 301}"
        query = """
            INSERT INTO hospitals (hospital_code, hospital_name, contact_person, phone, email, city, address)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            hospital_code,
            data.get('hospital_name'),
            data.get('contact_person'),
            data.get('phone'),
            data.get('email'),
            data.get('city'),
            data.get('address')
        )
        from database.sql_db import execute_transaction
        success, msg = execute_transaction([(query, params)])
        if success:
            mongo_db.log_audit_trail("Admin Staff", "CREATE", "HOSPITAL", f"Added hospital {hospital_code} - {data.get('hospital_name')}")
            return jsonify({"message": "Hospital added successfully", "hospital_code": hospital_code}), 201
        return jsonify({"error": msg}), 400

@app.route('/api/requests', methods=['GET', 'POST'])
def handle_requests():
    if request.method == 'GET':
        requests = RequestService.get_all_requests()
        return jsonify(requests)
    elif request.method == 'POST':
        data = request.json
        errors = validate_request_data(data)
        if errors:
            return jsonify({"errors": errors}), 400
        success, res = RequestService.create_request(data)
        if success:
            return jsonify({"message": "Blood request created successfully", "request_code": res}), 201
        return jsonify({"error": res}), 400

@app.route('/api/requests/<int:request_id>/allocate', methods=['POST'])
def allocate_request(request_id):
    data = request.json
    unit_id = data.get('unit_id')
    staff_name = data.get('staff_name', 'Dr. Rajesh Sharma')
    success, msg = RequestService.allocate_unit_to_request(request_id, unit_id, staff_name)
    if success:
        return jsonify({"message": msg}), 200
    return jsonify({"error": msg}), 400

@app.route('/api/reports/analytics', methods=['GET'])
def get_reports_analytics():
    try:
        stock_summary = InventoryService.get_stock_summary()
        near_expiry = execute_query("""
            SELECT bu.*, d.full_name AS donor_name, d.phone 
            FROM blood_units bu
            JOIN donations don ON bu.donation_id = don.donation_id
            JOIN donors d ON don.donor_id = d.donor_id
            WHERE bu.status = 'AVAILABLE' AND bu.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        """)
        expired_units = execute_query("""
            SELECT * FROM blood_units WHERE status = 'EXPIRED' OR (status = 'AVAILABLE' AND expiry_date < CURDATE())
        """)
        fulfillment_summary = execute_query("""
            SELECT request_status, COUNT(*) AS count FROM blood_requests GROUP BY request_status
        """)
        screening_logs = list(mongo_db.db.screening_logs.find({}, {'_id': False}).sort('timestamp', -1).limit(50)) if mongo_db.is_connected else []
        audit_logs = list(mongo_db.db.audit_logs.find({}, {'_id': False}).sort('timestamp', -1).limit(50)) if mongo_db.is_connected else []
        
        return jsonify({
            "stock_summary": stock_summary,
            "near_expiry_units": near_expiry,
            "expired_units": expired_units,
            "fulfillment_summary": fulfillment_summary,
            "screening_logs": screening_logs,
            "audit_logs": audit_logs
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    # Demo check
    if username == 'admin' and password == 'admin123':
        return jsonify({"token": "sit_jwt_token_secret_9988", "role": "SUPER_ADMIN", "name": "Dr. Rajesh Sharma"})
    elif username == 'staff' and password == 'staff123':
        return jsonify({"token": "sit_jwt_token_secret_1122", "role": "STAFF", "name": "Priya Kulkarni"})
    return jsonify({"error": "Invalid username or password"}), 401

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
