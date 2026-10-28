-- =========================================================================
-- Blood Bank Management System - Complete MySQL 8.0 Setup Script
-- Institute: Symbiosis Institute of Technology, Pune
-- Course: B.Tech Computer Science and Engineering (DCDS Lab ESE Mini-Project)
-- Admin: Bivek sah
-- =========================================================================

CREATE DATABASE IF NOT EXISTS blood_bank_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE blood_bank_management;

-- Drop existing tables in correct order to respect foreign key constraints
DROP TABLE IF EXISTS request_allocations;
DROP TABLE IF EXISTS blood_requests;
DROP TABLE IF EXISTS blood_units;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS donors;
DROP TABLE IF EXISTS hospitals;
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS screening_logs;
DROP TABLE IF EXISTS audit_logs;

-- 1. Admin Users Table
CREATE TABLE admin_users (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('SUPER_ADMIN', 'STAFF', 'VIEWER') DEFAULT 'STAFF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Donors Table
CREATE TABLE donors (
    donor_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL CHECK (age >= 18 AND age <= 65),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    city VARCHAR(50) NOT NULL,
    address TEXT,
    last_donation_date DATE DEFAULT NULL,
    consent_for_contact BOOLEAN DEFAULT TRUE,
    is_eligible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_blood_group (blood_group),
    INDEX idx_city (city),
    INDEX idx_donor_code (donor_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Donations Table
CREATE TABLE donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_code VARCHAR(20) NOT NULL UNIQUE,
    donor_id INT NOT NULL,
    donation_date DATE NOT NULL,
    quantity_ml INT DEFAULT 350 CHECK (quantity_ml >= 200 AND quantity_ml <= 500),
    screening_status ENUM('PENDING', 'APPROVED', 'DEFERRED') DEFAULT 'PENDING',
    deferral_reason TEXT DEFAULT NULL,
    collected_by VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id) ON DELETE CASCADE,
    INDEX idx_screening_status (screening_status),
    INDEX idx_donation_date (donation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Blood Units Table
CREATE TABLE blood_units (
    unit_id INT AUTO_INCREMENT PRIMARY KEY,
    unit_code VARCHAR(30) NOT NULL UNIQUE,
    donation_id INT NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    component_type ENUM('Whole Blood', 'Packed RBC', 'Platelets', 'Plasma', 'Cryoprecipitate') DEFAULT 'Whole Blood',
    collection_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('AVAILABLE', 'RESERVED', 'ISSUED', 'EXPIRED', 'QUARANTINED', 'DISCARDED') DEFAULT 'AVAILABLE',
    storage_location VARCHAR(50) DEFAULT 'Main Refrigeration Unit A1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id) ON DELETE CASCADE,
    INDEX idx_unit_blood_group (blood_group),
    INDEX idx_unit_status (status),
    INDEX idx_expiry_date (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Hospitals Table
CREATE TABLE hospitals (
    hospital_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_code VARCHAR(20) NOT NULL UNIQUE,
    hospital_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hospital_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Blood Requests Table
CREATE TABLE blood_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    request_code VARCHAR(20) NOT NULL UNIQUE,
    hospital_id INT NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    component_type ENUM('Whole Blood', 'Packed RBC', 'Platelets', 'Plasma', 'Cryoprecipitate') DEFAULT 'Packed RBC',
    quantity_requested INT NOT NULL CHECK (quantity_requested > 0),
    quantity_allocated INT DEFAULT 0 CHECK (quantity_allocated >= 0),
    priority ENUM('ROUTINE', 'URGENT', 'EMERGENCY') DEFAULT 'ROUTINE',
    request_status ENUM('PENDING', 'PARTIALLY_FULFILLED', 'FULFILLED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    required_by_date DATE NOT NULL,
    approved_by VARCHAR(100) DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE CASCADE,
    INDEX idx_request_status (request_status),
    INDEX idx_req_blood_group (blood_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Request Allocations Table
CREATE TABLE request_allocations (
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    unit_id INT NOT NULL,
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    allocated_by VARCHAR(100) NOT NULL,
    FOREIGN KEY (request_id) REFERENCES blood_requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES blood_units(unit_id) ON DELETE CASCADE,
    UNIQUE KEY uk_request_unit (request_id, unit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Screening Logs Table
CREATE TABLE screening_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_code VARCHAR(20) NOT NULL,
    donation_code VARCHAR(20) NOT NULL,
    hemoglobin DECIMAL(4,2) NOT NULL,
    bp VARCHAR(20) NOT NULL,
    pulse INT NOT NULL,
    weight_kg INT NOT NULL,
    screening_result ENUM('APPROVED', 'DEFERRED', 'PENDING') NOT NULL,
    notes TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Audit Logs Table
CREATE TABLE audit_logs (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================================
-- SEED DATA
-- =========================================================================

-- 1. Admin Users
INSERT INTO admin_users (username, password_hash, full_name, email, role) VALUES
('bivek', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Bivek sah', 'bivek.sah@sitpune.edu.in', 'SUPER_ADMIN'),
('nitin', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'Nitin Kumar', 'nitin.kumar@sitpune.edu.in', 'STAFF');

-- 2. Donors
INSERT INTO donors (donor_code, full_name, age, gender, blood_group, phone, email, city, address, last_donation_date, consent_for_contact, is_eligible) VALUES
('DNR-1001', 'Rahul', 26, 'Male', 'O+', '+919822012345', 'rahul@example.com', 'Pune', 'Kothrud, Pune - 411038', '2026-01-15', TRUE, TRUE),
('DNR-1002', 'Saurav paudel', 25, 'Male', 'A+', '+919855023456', 'saurav.p@example.com', 'Pune', 'Shivajinagar, Pune - 411005', '2025-11-20', TRUE, TRUE),
('DNR-1003', 'Muthmari', 28, 'Male', 'B-', '+919765034567', 'muthmari@example.com', 'Mumbai', 'Andheri West, Mumbai - 400053', '2025-10-10', TRUE, TRUE),
('DNR-1004', 'Alok yadav', 27, 'Male', 'AB+', '+919921045678', 'alok.y@example.com', 'Pune', 'Viman Nagar, Pune - 411014', '2026-02-01', TRUE, TRUE),
('DNR-1005', 'Ayush karn', 24, 'Male', 'O-', '+919890056789', 'ayush.k@example.com', 'Pune', 'Baner, Pune - 411045', '2025-08-15', TRUE, TRUE),
('DNR-1006', 'Rahul Sharma', 29, 'Male', 'B+', '+919823067890', 'rahul.s@example.com', 'Pune', 'Hadapsar, Pune - 411028', NULL, TRUE, FALSE);

-- 3. Donations
INSERT INTO donations (donation_code, donor_id, donation_date, quantity_ml, screening_status, deferral_reason, collected_by, notes) VALUES
('DON-501', 1, '2026-01-15', 350, 'APPROVED', NULL, 'Nitin Kumar', 'Healthy donor, good hemoglobin levels (14.2 g/dL)'),
('DON-502', 2, '2025-11-20', 350, 'APPROVED', NULL, 'Bivek sah', 'Regular donor, no adverse reactions'),
('DON-503', 3, '2025-10-10', 400, 'APPROVED', NULL, 'Nitin Kumar', 'Good collection, pulse and BP normal'),
('DON-504', 4, '2026-02-01', 350, 'APPROVED', NULL, 'Bivek sah', 'First time donor camp at SIT Pune'),
('DON-505', 5, '2025-08-15', 450, 'APPROVED', NULL, 'Nitin Kumar', 'Rare O- universal donor'),
('DON-506', 6, '2026-03-01', 350, 'DEFERRED', 'Low Hemoglobin (11.0 g/dL)', 'Bivek sah', 'Deferred for 3 months with iron supplements advised');

-- 4. Blood Units
INSERT INTO blood_units (unit_code, donation_id, blood_group, component_type, collection_date, expiry_date, status, storage_location) VALUES
('UNT-901', 1, 'O+', 'Packed RBC', '2026-01-15', '2026-11-15', 'AVAILABLE', 'Cold Storage Unit A-1'),
('UNT-902', 2, 'A+', 'Whole Blood', '2025-11-20', '2025-12-20', 'EXPIRED', 'Disposal Box B'),
('UNT-903', 3, 'B-', 'Plasma', '2025-10-10', '2026-12-10', 'AVAILABLE', 'Deep Freezer F-3'),
('UNT-904', 4, 'AB+', 'Platelets', '2026-02-01', '2026-11-10', 'ISSUED', 'Platelet Agitator P-2'),
('UNT-905', 5, 'O-', 'Packed RBC', '2025-08-15', '2025-11-15', 'EXPIRED', 'Disposal Box B');

-- 5. Hospitals
INSERT INTO hospitals (hospital_code, hospital_name, contact_person, phone, email, city, address) VALUES
('HSP-301', 'Ruby Hall Clinic', 'Dr. Anand Deshpande', '+912026163399', 'bloodbank@rubyhall.com', 'Pune', 'Sasoon Road, Pune - 411001'),
('HSP-302', 'Jehangir Hospital', 'Dr. Meena Swaminathan', '+912066811000', 'transfusion@jehangirhospital.com', 'Pune', '32 Sassoon Road, Pune - 411001'),
('HSP-303', 'Sassoon General Hospital', 'Dr. Vijay Jadhav', '+912026128000', 'bloodbank@sassoonhospital.org', 'Pune', 'Near Pune Railway Station, Pune - 411001');

-- 6. Blood Requests
INSERT INTO blood_requests (request_code, hospital_id, blood_group, component_type, quantity_requested, quantity_allocated, priority, request_status, required_by_date, approved_by, notes) VALUES
('REQ-701', 1, 'O+', 'Packed RBC', 3, 1, 'URGENT', 'PARTIALLY_FULFILLED', '2026-11-10', 'Bivek sah', 'Required for emergency trauma surgery'),
('REQ-702', 2, 'B-', 'Plasma', 2, 1, 'EMERGENCY', 'PARTIALLY_FULFILLED', '2026-11-05', 'Bivek sah', 'Required for burn unit patient'),
('REQ-703', 3, 'AB+', 'Platelets', 2, 1, 'ROUTINE', 'PARTIALLY_FULFILLED', '2026-11-12', 'Nitin Kumar', 'Dengue patient platelet transfusion');

-- 7. Request Allocations
INSERT INTO request_allocations (request_id, unit_id, allocated_by) VALUES
(1, 1, 'Bivek sah'),
(2, 3, 'Bivek sah'),
(3, 4, 'Nitin Kumar');


-- =========================================================================
-- ADDITIONAL SAMPLE DATA
-- Existing tables, columns, relationships, and original records are unchanged.
-- The records below extend the sample dataset for testing and screenshots.
-- =========================================================================

-- Additional Admin Users
INSERT INTO admin_users (username, password_hash, full_name, email, role) VALUES
('staff_pune', '7ac4fca0787ec431e7130624246714365df80a48ca087e2a2355897ff5ebfd10', 'Pune Blood Bank Staff', 'staff.pune@example.com', 'STAFF'),
('viewer_audit', 'dcf899db2a9ef071f8af6e8a2d788e343cac23bdab10131d347391a92ee0b058', 'Audit Viewer', 'viewer.audit@example.com', 'VIEWER'),
('staff_inventory', '4ed747f5068bf198f582ec88cda31df7af1a8a4d8b23f3144fdd3375c1351a43', 'Inventory Staff', 'inventory.staff@example.com', 'STAFF');

-- Additional Donors (donor_id values 7-16)
INSERT INTO donors
(donor_id, donor_code, full_name, age, gender, blood_group, phone, email, city, address, last_donation_date, consent_for_contact, is_eligible)
VALUES
(7, 'DNR-1007', 'Anjali Patil', 23, 'Female', 'A+', '+919876100007', 'anjali.patil@example.com', 'Pune', 'Aundh, Pune - 411007', '2026-05-10', TRUE, TRUE),
(8, 'DNR-1008', 'Rohan Deshmukh', 31, 'Male', 'O+', '+919876100008', 'rohan.d@example.com', 'Pune', 'Wakad, Pune - 411057', '2026-04-18', TRUE, TRUE),
(9, 'DNR-1009', 'Sneha Joshi', 22, 'Female', 'B+', '+919876100009', 'sneha.j@example.com', 'Mumbai', 'Powai, Mumbai - 400076', NULL, TRUE, TRUE),
(10, 'DNR-1010', 'Vikram Thapa', 27, 'Male', 'O-', '+919876100010', 'vikram.t@example.com', 'Pune', 'Kharadi, Pune - 411014', '2026-03-21', TRUE, TRUE),
(11, 'DNR-1011', 'Meera Kulkarni', 35, 'Female', 'AB+', '+919876100011', 'meera.k@example.com', 'Nashik', 'College Road, Nashik - 422005', '2025-12-12', TRUE, TRUE),
(12, 'DNR-1012', 'Arjun Shrestha', 29, 'Male', 'A-', '+919876100012', 'arjun.s@example.com', 'Pune', 'Pimple Saudagar, Pune - 411027', NULL, TRUE, TRUE),
(13, 'DNR-1013', 'Pooja More', 26, 'Female', 'B-', '+919876100013', 'pooja.more@example.com', 'Mumbai', 'Borivali, Mumbai - 400092', '2026-02-14', TRUE, TRUE),
(14, 'DNR-1014', 'Kunal Shah', 40, 'Male', 'AB-', '+919876100014', 'kunal.shah@example.com', 'Pune', 'Kondhwa, Pune - 411048', NULL, TRUE, TRUE),
(15, 'DNR-1015', 'Divya Nair', 24, 'Female', 'O+', '+919876100015', 'divya.nair@example.com', 'Nashik', 'Gangapur Road, Nashik - 422013', '2026-06-05', TRUE, TRUE),
(16, 'DNR-1016', 'Sanjay Yadav', 33, 'Male', 'A+', '+919876100016', 'sanjay.y@example.com', 'Pune', 'Dhanori, Pune - 411015', NULL, TRUE, FALSE);

-- Additional Donations (donation_id values 7-16)
INSERT INTO donations
(donation_id, donation_code, donor_id, donation_date, quantity_ml, screening_status, deferral_reason, collected_by, notes)
VALUES
(7, 'DON-507', 7, '2026-05-10', 350, 'APPROVED', NULL, 'Nitin Kumar', 'Routine donation; screening approved'),
(8, 'DON-508', 8, '2026-04-18', 400, 'APPROVED', NULL, 'Bivek sah', 'Donor vitals recorded as normal'),
(9, 'DON-509', 9, '2026-10-02', 350, 'APPROVED', NULL, 'Nitin Kumar', 'First recorded donation'),
(10, 'DON-510', 10, '2026-03-21', 350, 'APPROVED', NULL, 'Bivek sah', 'O-negative donation'),
(11, 'DON-511', 11, '2025-12-12', 450, 'APPROVED', NULL, 'Nitin Kumar', 'Donation completed successfully'),
(12, 'DON-512', 12, '2026-10-12', 350, 'PENDING', NULL, 'Bivek sah', 'Awaiting final screening review'),
(13, 'DON-513', 13, '2026-02-14', 350, 'APPROVED', NULL, 'Nitin Kumar', 'Donation approved after screening'),
(14, 'DON-514', 14, '2026-10-20', 350, 'PENDING', NULL, 'Bivek sah', 'Screening review pending'),
(15, 'DON-515', 15, '2026-06-05', 400, 'APPROVED', NULL, 'Nitin Kumar', 'Donation completed successfully'),
(16, 'DON-516', 16, '2026-10-22', 350, 'DEFERRED', 'Eligibility review required', 'Bivek sah', 'Donation deferred after preliminary screening');

-- Additional Blood Units (unit_id values 6-15)
INSERT INTO blood_units
(unit_id, unit_code, donation_id, blood_group, component_type, collection_date, expiry_date, status, storage_location)
VALUES
(6, 'UNT-906', 7, 'A+', 'Packed RBC', '2026-05-10', '2026-11-06', 'AVAILABLE', 'Cold Storage Unit A-2'),
(7, 'UNT-907', 8, 'O+', 'Whole Blood', '2026-04-18', '2026-05-18', 'EXPIRED', 'Disposal Box C'),
(8, 'UNT-908', 9, 'B+', 'Platelets', '2026-10-02', '2026-10-09', 'EXPIRED', 'Disposal Box C'),
(9, 'UNT-909', 10, 'O-', 'Packed RBC', '2026-03-21', '2026-09-18', 'EXPIRED', 'Disposal Box B'),
(10, 'UNT-910', 11, 'AB+', 'Plasma', '2025-12-12', '2027-12-12', 'AVAILABLE', 'Deep Freezer F-4'),
(11, 'UNT-911', 12, 'A-', 'Whole Blood', '2026-10-12', '2026-11-11', 'QUARANTINED', 'Quarantine Refrigerator Q-1'),
(12, 'UNT-912', 13, 'B-', 'Packed RBC', '2026-02-14', '2026-08-14', 'EXPIRED', 'Disposal Box D'),
(13, 'UNT-913', 14, 'AB-', 'Plasma', '2026-10-20', '2028-10-20', 'QUARANTINED', 'Deep Freezer F-5'),
(14, 'UNT-914', 15, 'O+', 'Platelets', '2026-06-05', '2026-06-12', 'EXPIRED', 'Disposal Box C'),
(15, 'UNT-915', 16, 'A+', 'Whole Blood', '2026-10-22', '2026-11-21', 'QUARANTINED', 'Quarantine Refrigerator Q-2');

-- Additional Hospitals (hospital_id values 4-10)
INSERT INTO hospitals
(hospital_id, hospital_code, hospital_name, contact_person, phone, email, city, address)
VALUES
(4, 'HSP-304', 'Deenanath Mangeshkar Hospital', 'Dr. Kavita Rao', '+912040100100', 'bloodbank@example.com', 'Pune', 'Erandwane, Pune - 411004'),
(5, 'HSP-305', 'Sahyadri Hospital', 'Dr. Amit Kulkarni', '+912067200200', 'transfusion@example.com', 'Pune', 'Deccan Gymkhana, Pune - 411004'),
(6, 'HSP-306', 'KEM Hospital', 'Dr. R. Desai', '+912224100300', 'blooddesk@example.com', 'Mumbai', 'Parel, Mumbai - 400012'),
(7, 'HSP-307', 'Nanavati Max Hospital', 'Dr. Neha Shah', '+912226200400', 'bloodservices@example.com', 'Mumbai', 'Vile Parle, Mumbai - 400056'),
(8, 'HSP-308', 'Civil Hospital Nashik', 'Dr. S. Patil', '+912532500500', 'bloodbank.nashik@example.com', 'Nashik', 'Trimbak Road, Nashik - 422002'),
(9, 'HSP-309', 'Aditya Birla Memorial Hospital', 'Dr. P. Nair', '+912067700600', 'transfusion.pune@example.com', 'Pune', 'Thergaon, Pune - 411033'),
(10, 'HSP-310', 'Jupiter Hospital', 'Dr. M. Joshi', '+912267300700', 'blooddesk.thane@example.com', 'Thane', 'Eastern Express Highway, Thane - 400601');

-- Additional Blood Requests (request_id values 4-10)
INSERT INTO blood_requests
(request_id, request_code, hospital_id, blood_group, component_type, quantity_requested, quantity_allocated, priority, request_status, required_by_date, approved_by, notes)
VALUES
(4, 'REQ-704', 4, 'A+', 'Packed RBC', 2, 1, 'URGENT', 'PARTIALLY_FULFILLED', '2026-11-02', 'Bivek sah', 'Surgery support request'),
(5, 'REQ-705', 5, 'O-', 'Packed RBC', 1, 0, 'EMERGENCY', 'PENDING', '2026-10-30', NULL, 'Emergency request awaiting allocation'),
(6, 'REQ-706', 6, 'B+', 'Platelets', 4, 0, 'URGENT', 'PENDING', '2026-11-01', NULL, 'Platelet support requested'),
(7, 'REQ-707', 7, 'AB+', 'Plasma', 2, 1, 'ROUTINE', 'PARTIALLY_FULFILLED', '2026-11-08', 'Nitin Kumar', 'Plasma request'),
(8, 'REQ-708', 8, 'A-', 'Whole Blood', 2, 0, 'URGENT', 'PENDING', '2026-11-03', NULL, 'Awaiting compatible units'),
(9, 'REQ-709', 9, 'B-', 'Packed RBC', 3, 0, 'EMERGENCY', 'PENDING', '2026-10-29', NULL, 'Emergency transfusion request'),
(10, 'REQ-710', 10, 'O+', 'Whole Blood', 2, 0, 'ROUTINE', 'PENDING', '2026-11-15', NULL, 'Routine hospital stock request');

-- Additional Request Allocations (new request/unit combinations)
INSERT INTO request_allocations (request_id, unit_id, allocated_by) VALUES
(4, 6, 'Bivek sah'),
(7, 10, 'Nitin Kumar');

-- Additional Screening Logs
INSERT INTO screening_logs
(donor_code, donation_code, hemoglobin, bp, pulse, weight_kg, screening_result, notes)
VALUES
('DNR-1007', 'DON-507', 13.80, '120/80', 72, 58, 'APPROVED', 'All screening values recorded'),
('DNR-1008', 'DON-508', 15.10, '118/78', 70, 74, 'APPROVED', 'Routine donor screening'),
('DNR-1009', 'DON-509', 12.90, '116/76', 76, 55, 'APPROVED', 'Screening completed'),
('DNR-1010', 'DON-510', 14.50, '122/80', 74, 68, 'APPROVED', 'Screening completed'),
('DNR-1011', 'DON-511', 13.20, '120/82', 78, 62, 'APPROVED', 'Screening completed'),
('DNR-1012', 'DON-512', 12.50, '110/70', 80, 59, 'PENDING', 'Awaiting review'),
('DNR-1013', 'DON-513', 13.60, '118/80', 72, 61, 'APPROVED', 'Screening completed'),
('DNR-1014', 'DON-514', 14.00, '124/82', 75, 76, 'PENDING', 'Awaiting review'),
('DNR-1015', 'DON-515', 12.80, '116/78', 73, 57, 'APPROVED', 'Screening completed'),
('DNR-1016', 'DON-516', 10.90, '108/68', 82, 64, 'DEFERRED', 'Hemoglobin below configured threshold');

-- Additional Audit Logs
INSERT INTO audit_logs (user_name, action, target_entity, details) VALUES
('bivek', 'INSERT', 'donors', 'Added donor DNR-1007'),
('nitin', 'INSERT', 'donations', 'Recorded donation DON-507'),
('bivek', 'UPDATE', 'blood_units', 'Updated status for UNT-906'),
('nitin', 'INSERT', 'hospitals', 'Added hospital HSP-304'),
('bivek', 'INSERT', 'blood_requests', 'Created request REQ-704'),
('nitin', 'INSERT', 'screening_logs', 'Recorded screening for DNR-1007'),
('bivek', 'UPDATE', 'blood_requests', 'Reviewed request REQ-705'),
('nitin', 'INSERT', 'request_allocations', 'Allocated unit UNT-910 to request REQ-707'),
('bivek', 'UPDATE', 'donors', 'Updated eligibility review for DNR-1016'),
('nitin', 'SELECT', 'blood_units', 'Reviewed blood inventory');

-- =========================================================================
-- END OF ADDITIONAL SAMPLE DATA
-- =========================================================================
