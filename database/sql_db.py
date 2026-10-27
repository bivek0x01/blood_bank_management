"""
MySQL Database Connection and Transaction Utility
Symbiosis Institute of Technology, Pune - DCDS Lab ESE Mini-Project
"""

import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()

def get_mysql_connection():
    """Create and return a MySQL database connection using environment variables."""
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", 3306)),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", os.getenv("nitin0x01", "")),
            database=os.getenv("DB_NAME", "blood_bank_management"),
            autocommit=False
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None

def execute_query(query, params=None, fetch=True):
    """Execute a read query (SELECT) and return results."""
    conn = get_mysql_connection()
    if not conn:
        return None
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, params or ())
        result = cursor.fetchall() if fetch else None
        return result
    except Error as e:
        print(f"Database query error: {e}")
        return None
    finally:
        cursor.close()
        conn.close()

def execute_transaction(queries_with_params):
    """
    Execute multiple queries in a single ACID transaction.
    queries_with_params is a list of tuples: (query_string, params_tuple)
    """
    conn = get_mysql_connection()
    if not conn:
        return False, "Database connection failed"
    
    cursor = conn.cursor()
    try:
        for query, params in queries_with_params:
            cursor.execute(query, params or ())
        conn.commit()
        return True, "Transaction completed successfully"
    except Error as e:
        conn.rollback()
        print(f"Transaction rolled back due to error: {e}")
        return False, str(e)
    finally:
        cursor.close()
        conn.close()