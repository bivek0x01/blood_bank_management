-- =========================================================================
-- Useful SQL Queries for Blood Bank Management System
-- Symbiosis Institute of Technology, Pune - DCDS Lab ESE Mini-Project
-- =========================================================================

USE blood_bank_management;

-- 1. Blood-Group-Wise Eligible Available Stock Summary
SELECT 
    blood_group,
    component_type,
    COUNT(unit_id) AS available_units_count,
    MIN(expiry_date) as earliest_expiry_date
FROM blood_units
WHERE status = 'AVAILABLE' AND expiry_date >= CURDATE()
GROUP BY blood_group, component_type
ORDER BY blood_group;

-- 2. Near-Expiry Blood Units (Expiring within next 30 days)
SELECT 
    bu.unit_code,
    bu.blood_group,
    bu.component_type,
    bu.collection_date,
    bu.expiry_date,
    DATEDIFF(bu.expiry_date, CURDATE()) AS days_remaining,
    bu.storage_location,
    d.full_name AS donor_name,
    d.phone AS donor_phone
FROM blood_units bu
JOIN donations don ON bu.donation_id = don.donation_id
JOIN donors d ON don.donor_id = d.donor_id
WHERE bu.status = 'AVAILABLE' 
  AND bu.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY bu.expiry_date ASC;

-- 3. Expired Inventory Report (Units that expired and need disposal)
SELECT 
    unit_code,
    blood_group,
    component_type,
    collection_date,
    expiry_date,
    storage_location,
    DATEDIFF(CURDATE(), expiry_date) AS days_expired
FROM blood_units
WHERE status = 'EXPIRED' OR (status = 'AVAILABLE' AND expiry_date < CURDATE())
ORDER BY expiry_date DESC;

-- 4. Hospital Blood Requests Fulfillment Summary
SELECT 
    br.request_code,
    h.hospital_name,
    h.city,
    br.blood_group,
    br.component_type,
    br.quantity_requested,
    br.quantity_allocated,
    br.priority,
    br.request_status,
    br.required_by_date
FROM blood_requests br
JOIN hospitals h ON br.hospital_id = h.hospital_id
ORDER BY br.request_date DESC;

-- 5. Complete Donation History with Donor Details
SELECT 
    don.donation_code,
    d.donor_code,
    d.full_name AS donor_name,
    d.blood_group,
    d.phone,
    don.donation_date,
    don.quantity_ml,
    don.screening_status,
    don.collected_by
FROM donations don
JOIN donors d ON don.donor_id = d.donor_id
ORDER BY don.donation_date DESC;

-- 6. Donor Donation Count & Last Donation Date Aggregate
SELECT 
    d.donor_code,
    d.full_name,
    d.blood_group,
    d.city,
    COUNT(don.donation_id) AS total_donations_made,
    MAX(don.donation_date) AS most_recent_donation
FROM donors d
LEFT JOIN donations don ON d.donor_id = don.donor_id AND don.screening_status = 'APPROVED'
GROUP BY d.donor_id, d.donor_code, d.full_name, d.blood_group, d.city
ORDER BY total_donations_made DESC;

-- 7. Transactional Stock Allocation Query Example (Used in Request Fulfillment)
-- Note: Wrapped in transaction in application code
START TRANSACTION;

-- Check available stock for requested blood group
SELECT unit_id FROM blood_units 
WHERE blood_group = 'O+' AND status = 'AVAILABLE' AND expiry_date >= CURDATE()
LIMIT 1 FOR UPDATE;

-- Update unit status to RESERVED / ISSUED
UPDATE blood_units SET status = 'ISSUED' WHERE unit_id = 1;

-- Insert into request allocations
INSERT INTO request_allocations (request_id, unit_id, allocated_by) 
VALUES (1, 1, 'Dr. Rajesh Sharma');

-- Update request allocated quantity
UPDATE blood_requests 
SET quantity_allocated = quantity_allocated + 1,
    request_status = CASE 
        WHEN quantity_allocated + 1 >= quantity_requested THEN 'FULFILLED'
        ELSE 'PARTIALLY_FULFILLED'
    END
WHERE request_id = 1;

COMMIT;
-- ROLLBACK; -- if error occurs
