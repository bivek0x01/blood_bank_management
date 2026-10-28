# BLOOD BANK MANAGEMENT SYSTEM
## DCDS LAB ESE MINI-PROJECT REPORT
**Symbiosis Institute of Technology, Pune**  
**Department of Computer Science and Engineering**  
**Course:** Database Concepts for Data Science Lab (B.Tech CSE, SY / Semester III, Batch 2025–29, Division AIML-A)  

### Project Team Members:
1. **Bivek Sah** (PRN: 25070126052)
2. **Alok Yadav** (PRN: 25070126022)
3. **Ayush Kumar Yadav** (PRN: 25070126048)

**Submission Date:** October 2026

---

## Abstract and Project Overview
The **Blood Bank Management System** is a database-driven enterprise application designed to organize donor details, donation records, blood-unit stock, and hospital requests in a centralized platform. The system addresses the challenges of fragmented record-keeping by maintaining traceable donation and request records, monitoring blood stock eligibility, and highlighting inventory nearing expiry. Structured entities such as donors, hospitals, donations, blood units, requests, and allocations are stored in a normalized relational **MySQL 8.0** database. Supplementary audit trails and screening logs are stored in supporting database tables.

Python (Flask) connects the database layer with application workflows. SQL supports multi-table joins, filtering, grouping, and aggregate reporting; Python functions and classes manage input validation and business rules. The design emphasizes data integrity, transaction safety (ACID compliance), careful handling of personal information, and clear status transitions.

---

## 1. Problem Statement and Motivation
Blood banks coordinate several critical activities: registering donors, recording donations, checking eligibility, tracking collected units, and responding to urgent hospital blood requests. Managing these through disconnected spreadsheets or paper records introduces risks of stock discrepancies, inaccurate availability counts, and delayed emergency allocations.

### 1.1 Formal Problem Statement
To design and implement a Python-Flask and MySQL-based database application that maintains donor, donation, blood-stock, hospital, and request records; enforces ACID transaction safety; and provides validated workflows and summaries for blood availability, expiry monitoring, and hospital request fulfillment.

### 1.2 Problems Addressed & System Response
| Problem | Possible Consequence | System Response |
| :--- | :--- | :--- |
| **Fragmented records** | Staff must search multiple records to answer routine questions. | Centralized dashboard, donor, donation, stock, and request views. |
| **Unclear availability** | Total stock numbers include unavailable or expired units. | Track unit status (`AVAILABLE`, `ISSUED`, `EXPIRED`, `RESERVED`) separately. |
| **Expiry exposure** | Units approach expiry without notification. | Calculate days remaining, flag near-expiry inventory. |
| **Urgent hospital request** | Blood group verification takes excessive time. | Filter eligible available stock instantly by blood group and status. |
| **Weak traceability** | Difficulty determining who updated a record. | Maintain audit logs capturing user actions and timestamps. |
| **Inconsistent data** | Invalid quantities or missing details corrupt reports. | Enforce strict input validation on both frontend and backend. |

---

## 2. Overall System Pipeline
The system architecture follows a clean 3-tier structure:
1. **Data Capture Layer:** React frontend collects donor, hospital, donation, and request data with real-time validation.
2. **Application Service Layer:** Python Flask backend processes business logic, authorization, and workflow validation.
3. **Database Layer:** MySQL 8.0 relational database with normalized tables, foreign key constraints, and transactional query execution.

```text
User Interface (React + Tailwind CSS)
    ↓ (REST API / JSON)
Python Flask Backend Service Layer (Validation & Business Rules)
    ↓ (Parameterized SQL Queries & ACID Transactions)
MySQL 8.0 Relational Database (donors, donations, blood_units, hospitals, requests)
```

---

## 3. Relational Database Design: MySQL 8.0
The database `blood_bank_management` consists of normalized tables connected by foreign key constraints to eliminate data redundancy and ensure relational integrity.

### 3.1 Core Relational Tables
1. **`admin_users`**: Stores administrator credentials and role-based permissions (`SUPER_ADMIN`, `STAFF`).
2. **`donors`**: Stores donor master records (`donor_id`, `donor_code`, `full_name`, `age`, `gender`, `blood_group`, `phone`, `city`, `is_eligible`).
3. **`donations`**: Records donation events (`donation_id`, `donation_code`, `donor_id`, `donation_date`, `quantity_ml`, `screening_status`).
4. **`blood_units`**: Tracks unit-level inventory (`unit_id`, `unit_code`, `donation_id`, `blood_group`, `component_type`, `collection_date`, `expiry_date`, `status`, `storage_location`).
5. **`hospitals`**: Stores affiliated hospital details (`hospital_id`, `hospital_code`, `hospital_name`, `contact_person`, `phone`, `email`, `city`, `address`).
6. **`blood_requests`**: Records hospital blood demands (`request_id`, `request_code`, `hospital_id`, `blood_group`, `component_type`, `quantity_requested`, `quantity_allocated`, `priority`, `request_status`, `required_by_date`).
7. **`request_allocations`**: Many-to-many mapping table linking issued units to specific hospital requests within a transaction.

---

## 4. SQL Operations and Data Retrieval
The application utilizes advanced SQL queries including `JOIN`, `GROUP BY`, `COUNT`, `SUM`, and date filtering.

### 4.1 Stock Summary Query (`GROUP BY`)
```sql
SELECT 
    blood_group,
    component_type,
    COUNT(unit_id) AS available_units_count,
    MIN(expiry_date) AS earliest_expiry_date
FROM blood_units
WHERE status = 'AVAILABLE' AND expiry_date >= CURDATE()
GROUP BY blood_group, component_type
ORDER BY blood_group;
```

### 4.2 Multi-Table JOIN Query
```sql
SELECT 
    bu.unit_code,
    bu.blood_group,
    bu.component_type,
    bu.expiry_date,
    bu.status,
    d.full_name AS donor_name,
    d.phone AS donor_phone
FROM blood_units bu
JOIN donations don ON bu.donation_id = don.donation_id
JOIN donors d ON don.donor_id = d.donor_id
WHERE bu.status = 'AVAILABLE';
```

---

## 5. Hospital Request and Transactional Allocation Workflow
When a hospital requests blood units, the application ensures that allocation occurs inside an **ACID Transaction** to prevent race conditions or duplicate unit issuances.

### Transactional Steps:
1. Verify requested blood group matches available units.
2. Check unit status is `AVAILABLE` and not expired (`FOR UPDATE` row locking).
3. Update unit status to `ISSUED`.
4. Insert mapping into `request_allocations`.
5. Increment `quantity_allocated` in `blood_requests` and update status (`FULFILLED` or `PARTIALLY_FULFILLED`).
6. **Commit** transaction (or **Rollback** on any error).

---

## 6. Testing, Verification and Rubric Coverage
- **Schema Validation:** Verified in MySQL Workbench using `database/complete_setup.sql`.
- **Backend API Testing:** Tested via Flask server endpoints (`/api/dashboard`, `/api/donors`, `/api/inventory`, `/api/requests`).
- **Frontend UI Testing:** Verified React application build and responsiveness.

### Rubric Mapping:
| Criterion | Marks | Evidence in Project |
| :--- | :--- | :--- |
| **Application design & functionality** | 2 | Fully functional React dashboard, donor, donation, inventory & request workflows. |
| **Python programming** | 2 | Modular Flask backend, service classes, validation, and exception handling. |
| **SQL integration** | 2 | Normalized MySQL tables, parameterized queries, joins, aggregates, and transactions. |
| **Advanced querying** | 2 | Blood-group stock grouping, near-expiry classification, and request fulfillment summaries. |
| **Code quality / documentation** | 1 | Clean architecture, well-commented code, and complete project report. |
| **Testing & validation** | 1 | Robust input validation and transactional rollback protection. |

---

## 7. Conclusion
The **Blood Bank Management System** successfully demonstrates the integration of relational database concepts (MySQL), backend application orchestration (Python Flask), and modern web user interfaces (React & Tailwind CSS). Built by Bivek sah, Alok Yadav, and Ayush Kumar Yadav, the project fulfills all academic requirements of the Symbiosis Institute of Technology DCDS Lab ESE Mini-Project.
