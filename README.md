# Blood Bank Management System

**Symbiosis Institute of Technology, Pune**  
**B.Tech Computer Science and Engineering**  
**DCDS Lab ESE Mini-Project**

---

## Project Overview
The **Blood Bank Management System** is a full-stack enterprise web application designed to manage blood bank operations, donors, donations, blood inventory stock, hospital requests, transactional allocations, expiry alerts, screening logs, and audit logs.

---

## Technology Stack
- **Backend:** Python (Flask REST API)
- **Primary Database:** MySQL 8.0 (Relational tables with ACID transactions, foreign keys, and indexes)
- **NoSQL Database:** MongoDB (Screening logs, donation camp events, and system audit logs)
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Architecture:** Modular Service-Oriented Architecture with robust input validation and ACID safety.

---

## Project Directory Structure
```text
blood-bank-management/
│
├── backend/
│   ├── app.py                      # Flask REST API endpoints
│   ├── services/
│   │   ├── donor_service.py        # Donor CRUD logic
│   │   ├── donation_service.py     # Donation screening & auto-unit creation
│   │   ├── inventory_service.py    # Blood inventory stock queries
│   │   └── request_service.py      # Hospital requests & ACID allocation
│   └── utils/
│       └── validation.py           # Input validation checks
│
├── database/
│   ├── schema.sql                  # MySQL 8.0 DDL schema
│   ├── seed.sql                    # Synthetic seed data
│   ├── queries.sql                 # Useful analytical SQL queries
│   ├── sql_db.py                   # MySQL connector & transaction handler
│   └── mongodb.py                  # PyMongo manager for logs & audit trail
│
├── src/                            # React Frontend Source Code
├── .env.example                    # Environment variables template
├── requirements.txt                # Python dependencies
└── README.md                       # Installation & setup guide
```

---

## Exact Windows Installation & Execution Steps

### Prerequisites
1. **Python 3.10+** installed and added to Windows PATH.
2. **MySQL Server 8.0+** installed (with MySQL Workbench).
3. **MongoDB Community Server** installed and running on `mongodb://localhost:27017/`.
4. **Node.js & npm** installed (for frontend development server).

### Step 1: Database Setup in MySQL Workbench
1. Open **MySQL Workbench** and connect to your local MySQL server.
2. Open the file `database/schema.sql` and execute it to create the `blood_bank_management` database and all relational tables (`donors`, `donations`, `blood_units`, `hospitals`, `blood_requests`, `request_allocations`, `admin_users`).
3. Open the file `database/seed.sql` and execute it to seed synthetic demo records.

### Step 2: Configure Environment Variables
1. Copy `.env.example` and save as `.env` in the root directory.
2. Update your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=blood_bank_management
   MONGO_URI=mongodb://localhost:27017/
   MONGO_DB_NAME=blood_bank_nosql
   PORT=5000
   ```

### Step 3: Install Python Dependencies & Run Flask Backend
Open Command Prompt (cmd) or PowerShell in the project root:
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python backend/app.py
```
The Flask REST API will start on `http://localhost:5000`.

### Step 4: Run React Frontend
In a separate terminal window:
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## Default Admin Credentials
- **Username:** `admin` | **Password:** `admin123` (Role: Super Admin)
- **Username:** `staff` | **Password:** `staff123` (Role: Staff)
