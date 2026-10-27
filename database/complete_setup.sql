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

-- 8. Screening Logs Table (MySQL replacement for MongoDB screening logs)
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

-- 9. Audit Logs Table (MySQL replacement for MongoDB audit logs)
CREATE TABLE audit_logs (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================================
-- SEED DATA WITH REQUESTED NAMES
-- Admin: Bivek sah
-- Donors/Staff: Rahul, Nitin Kumar, Saurav paudel, Muthmari, Alok yadav, Ayush karn
-- =========================================================================

-- 1. Admin Users
INSERT INTO admin_users (username, password_hash, full_name, email, role) VALUES
('bivek', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Bivek sah', 'bivek.sah@sitpune.edu.in', 'SUPER_ADMIN'),
('nitin', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'Nitin Kumar', 'nitin.kumar@sitpune.edu.in', 'STAFF');

-- 2. Donors (Using requested names: Rahul, Saurav paudel, Muthmari, Alok yadav, Ayush karn)
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

-- 8. Screening Logs
INSERT INTO screening_logs (donor_code, donation_code, hemoglobin, bp, pulse, weight_kg, screening_result, notes) VALUES
('DNR-1001', 'DON-501', 14.2, '120/80', 76, 68, 'APPROVED', 'All parameters normal'),
('DNR-1002', 'DON-502', 13.5, '118/78', 72, 65, 'APPROVED', 'Fit for donation'),
('DNR-1006', 'DON-506', 11.0, '110/70', 80, 54, 'DEFERRED', 'Low hemoglobin count');

-- 9. Audit Logs
INSERT INTO audit_logs (user_name, action, target_entity, details) VALUES
('Bivek sah', 'CREATE', 'DONOR', 'Created donor DNR-1001 - Rahul'),
('Nitin Kumar', 'ALLOCATE', 'REQUEST', 'Allocated unit UNT-901 to request REQ-701'),
('Bivek sah', 'UPDATE', 'INVENTORY', 'Marked unit UNT-902 as EXPIRED');
