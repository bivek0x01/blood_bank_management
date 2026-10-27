"""
Input Validation Utilities
Symbiosis Institute of Technology, Pune - DCDS Lab ESE Mini-Project
"""

import re

def validate_donor_data(data):
    """Validate donor creation/update data."""
    errors = {}
    
    if not data.get('full_name') or len(data.get('full_name').strip()) < 2:
        errors['full_name'] = 'Full name must be at least 2 characters.'
        
    age = data.get('age')
    try:
        age_int = int(age)
        if not (18 <= age_int <= 65):
            errors['age'] = 'Donor age must be between 18 and 65 years.'
    except (TypeError, ValueError):
        errors['age'] = 'Valid age is required.'
        
    blood_group = data.get('blood_group')
    valid_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    if blood_group not in valid_groups:
        errors['blood_group'] = 'Invalid blood group selected.'
        
    phone = data.get('phone')
    if not phone or not re.match(r'^\+?[0-9]{10,15}$', phone):
        errors['phone'] = 'Valid phone number (10-15 digits) is required.'
        
    city = data.get('city')
    if not city or len(city.strip()) < 2:
        errors['city'] = 'City is required.'
        
    return errors

def validate_donation_data(data):
    """Validate donation entry data."""
    errors = {}
    if not data.get('donor_id'):
        errors['donor_id'] = 'Donor ID is required.'
    
    qty = data.get('quantity_ml', 350)
    try:
        qty_int = int(qty)
        if not (200 <= qty_int <= 500):
            errors['quantity_ml'] = 'Donation quantity must be between 200ml and 500ml.'
    except (TypeError, ValueError):
        errors['quantity_ml'] = 'Valid quantity in ml is required.'
        
    status = data.get('screening_status', 'PENDING')
    if status not in ['PENDING', 'APPROVED', 'DEFERRED']:
        errors['screening_status'] = 'Invalid screening status.'
        
    return errors

def validate_request_data(data):
    """Validate hospital blood request data."""
    errors = {}
    if not data.get('hospital_id'):
        errors['hospital_id'] = 'Hospital ID is required.'
        
    blood_group = data.get('blood_group')
    valid_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    if blood_group not in valid_groups:
        errors['blood_group'] = 'Invalid blood group.'
        
    qty = data.get('quantity_requested')
    try:
        qty_int = int(qty)
        if qty_int <= 0:
            errors['quantity_requested'] = 'Quantity requested must be greater than 0.'
    except (TypeError, ValueError):
        errors['quantity_requested'] = 'Valid requested quantity is required.'
        
    return errors
