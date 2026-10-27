/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Droplet, Users, HeartHandshake, Building2, FileText, BarChart3, 
  ShieldAlert, Database, Search, Plus, CheckCircle2, AlertTriangle, 
  XCircle, RefreshCw, Download, Lock, UserCheck, Calendar, MapPin, 
  Phone, Mail, Check, AlertCircle, Award, Terminal, Eye, Edit3
} from 'lucide-react';

// --- INITIAL SEED DATA FOR DEMO & FULL INTERACTIVITY ---
const INITIAL_DONORS = [
  { donor_id: 1, donor_code: 'DNR-1001', full_name: 'Rahul', age: 26, gender: 'Male', blood_group: 'O+', phone: '+919822012345', email: 'rahul@example.com', city: 'Pune', address: 'Kothrud, Pune - 411038', last_donation_date: '2026-01-15', consent_for_contact: true, is_eligible: true },
  { donor_id: 2, donor_code: 'DNR-1002', full_name: 'Saurav paudel', age: 25, gender: 'Male', blood_group: 'A+', phone: '+919855023456', email: 'saurav.p@example.com', city: 'Pune', address: 'Shivajinagar, Pune - 411005', last_donation_date: '2025-11-20', consent_for_contact: true, is_eligible: true },
  { donor_id: 3, donor_code: 'DNR-1003', full_name: 'Muthmari', age: 28, gender: 'Male', blood_group: 'B-', phone: '+919765034567', email: 'muthmari@example.com', city: 'Mumbai', address: 'Andheri West, Mumbai - 400053', last_donation_date: '2025-10-10', consent_for_contact: true, is_eligible: true },
  { donor_id: 4, donor_code: 'DNR-1004', full_name: 'Alok yadav', age: 27, gender: 'Male', blood_group: 'AB+', phone: '+919921045678', email: 'alok.y@example.com', city: 'Pune', address: 'Viman Nagar, Pune - 411014', last_donation_date: '2026-02-01', consent_for_contact: true, is_eligible: true },
  { donor_id: 5, donor_code: 'DNR-1005', full_name: 'Ayush karn', age: 24, gender: 'Male', blood_group: 'O-', phone: '+919890056789', email: 'ayush.k@example.com', city: 'Pune', address: 'Baner, Pune - 411045', last_donation_date: '2025-08-15', consent_for_contact: true, is_eligible: true },
  { donor_id: 6, donor_code: 'DNR-1006', full_name: 'Rahul Sharma', age: 29, gender: 'Male', blood_group: 'B+', phone: '+919823067890', email: 'rahul.s@example.com', city: 'Pune', address: 'Hadapsar, Pune - 411028', last_donation_date: null, consent_for_contact: true, is_eligible: false }
];

const INITIAL_DONATIONS = [
  { donation_id: 1, donation_code: 'DON-501', donor_id: 1, donor_name: 'Rahul', blood_group: 'O+', donation_date: '2026-01-15', quantity_ml: 350, screening_status: 'APPROVED', deferral_reason: null, collected_by: 'Nitin Kumar', notes: 'Healthy donor, good hemoglobin levels (14.2 g/dL)' },
  { donation_id: 2, donation_code: 'DON-502', donor_id: 2, donor_name: 'Saurav paudel', blood_group: 'A+', donation_date: '2025-11-20', quantity_ml: 350, screening_status: 'APPROVED', deferral_reason: null, collected_by: 'Bivek sah', notes: 'Regular donor, no adverse reactions' },
  { donation_id: 3, donation_code: 'DON-503', donor_id: 3, donor_name: 'Muthmari', blood_group: 'B-', donation_date: '2025-10-10', quantity_ml: 400, screening_status: 'APPROVED', deferral_reason: null, collected_by: 'Nitin Kumar', notes: 'Good collection, pulse and BP normal' },
  { donation_id: 4, donation_code: 'DON-504', donor_id: 4, donor_name: 'Alok yadav', blood_group: 'AB+', donation_date: '2026-02-01', quantity_ml: 350, screening_status: 'APPROVED', deferral_reason: null, collected_by: 'Bivek sah', notes: 'First time donor camp at SIT Pune' },
  { donation_id: 5, donation_code: 'DON-505', donor_id: 5, donor_name: 'Ayush karn', blood_group: 'O-', donation_date: '2025-08-15', quantity_ml: 450, screening_status: 'APPROVED', deferral_reason: null, collected_by: 'Nitin Kumar', notes: 'Rare O- universal donor' },
  { donation_id: 6, donation_code: 'DON-506', donor_id: 6, donor_name: 'Rahul Sharma', blood_group: 'B+', donation_date: '2026-03-01', quantity_ml: 350, screening_status: 'DEFERRED', deferral_reason: 'Low Hemoglobin (11.0 g/dL)', collected_by: 'Bivek sah', notes: 'Deferred for 3 months with iron supplements advised' }
];

const INITIAL_INVENTORY = [
  { unit_id: 1, unit_code: 'UNT-901', donor_name: 'Rahul', blood_group: 'O+', component_type: 'Packed RBC', collection_date: '2026-01-15', expiry_date: '2026-11-30', status: 'AVAILABLE', storage_location: 'Cold Storage Unit A-1' },
  { unit_id: 2, unit_code: 'UNT-902', donor_name: 'Saurav paudel', blood_group: 'A+', component_type: 'Whole Blood', collection_date: '2025-11-20', expiry_date: '2025-12-20', status: 'EXPIRED', storage_location: 'Disposal Box B' },
  { unit_id: 3, unit_code: 'UNT-903', donor_name: 'Muthmari', blood_group: 'B-', component_type: 'Plasma', collection_date: '2025-10-10', expiry_date: '2026-12-10', status: 'AVAILABLE', storage_location: 'Deep Freezer F-3' },
  { unit_id: 4, unit_code: 'UNT-904', donor_name: 'Alok yadav', blood_group: 'AB+', component_type: 'Platelets', collection_date: '2026-02-01', expiry_date: '2026-11-10', status: 'ISSUED', storage_location: 'Platelet Agitator P-2' },
  { unit_id: 5, unit_code: 'UNT-905', donor_name: 'Ayush karn', blood_group: 'O-', component_type: 'Packed RBC', collection_date: '2025-08-15', expiry_date: '2025-11-15', status: 'EXPIRED', storage_location: 'Disposal Box B' }
];

const INITIAL_HOSPITALS = [
  { hospital_id: 1, hospital_code: 'HSP-301', hospital_name: 'Ruby Hall Clinic', contact_person: 'Dr. Anand Deshpande', phone: '+912026163399', email: 'bloodbank@rubyhall.com', city: 'Pune', address: 'Sasoon Road, Pune - 411001' },
  { hospital_id: 2, hospital_code: 'HSP-302', hospital_name: 'Jehangir Hospital', contact_person: 'Dr. Meena Swaminathan', phone: '+912066811000', email: 'transfusion@jehangirhospital.com', city: 'Pune', address: '32 Sassoon Road, Pune - 411001' },
  { hospital_id: 3, hospital_code: 'HSP-303', hospital_name: 'Sassoon General Hospital', contact_person: 'Dr. Vijay Jadhav', phone: '+912026128000', email: 'bloodbank@sassoonhospital.org', city: 'Pune', address: 'Near Pune Railway Station, Pune - 411001' }
];

const INITIAL_REQUESTS = [
  { request_id: 1, request_code: 'REQ-701', hospital_name: 'Ruby Hall Clinic', blood_group: 'O+', component_type: 'Packed RBC', quantity_requested: 3, quantity_allocated: 1, priority: 'URGENT', request_status: 'PARTIALLY_FULFILLED', required_by_date: '2026-11-10', notes: 'Required for emergency trauma surgery' },
  { request_id: 2, request_code: 'REQ-702', hospital_name: 'Jehangir Hospital', blood_group: 'B-', component_type: 'Plasma', quantity_requested: 2, quantity_allocated: 1, priority: 'EMERGENCY', request_status: 'PARTIALLY_FULFILLED', required_by_date: '2026-11-05', notes: 'Required for burn unit patient' },
  { request_id: 3, request_code: 'REQ-703', hospital_name: 'Sassoon General Hospital', blood_group: 'AB+', component_type: 'Platelets', quantity_requested: 2, quantity_allocated: 1, priority: 'ROUTINE', request_status: 'PARTIALLY_FULFILLED', required_by_date: '2026-11-12', notes: 'Dengue patient platelet transfusion' }
];

const MONGODB_SCREENING_LOGS = [
  { donor_code: 'DNR-1001', donation_code: 'DON-501', vitals: { hemoglobin: 14.2, bp: '120/80', pulse: 76, weight_kg: 68 }, screening_result: 'APPROVED', notes: 'All parameters normal', timestamp: '2026-01-15 09:30:00' },
  { donor_code: 'DNR-1002', donation_code: 'DON-502', vitals: { hemoglobin: 13.5, bp: '118/78', pulse: 72, weight_kg: 58 }, screening_result: 'APPROVED', notes: 'Fit for donation', timestamp: '2025-11-20 10:15:00' },
  { donor_code: 'DNR-1006', donation_code: 'DON-506', vitals: { hemoglobin: 11.0, bp: '110/70', pulse: 80, weight_kg: 54 }, screening_result: 'DEFERRED', notes: 'Low hemoglobin count', timestamp: '2026-03-01 11:45:00' }
];

const MONGODB_AUDIT_LOGS = [
  { user: 'Dr. Rajesh Sharma', action: 'CREATE', target_entity: 'DONOR', details: 'Created donor DNR-1001 - Amit Deshmukh', timestamp: '2026-01-15 09:00:00' },
  { user: 'Priya Kulkarni', action: 'ALLOCATE', target_entity: 'REQUEST', details: 'Allocated unit UNT-901 to request REQ-701', timestamp: '2026-01-16 14:20:00' },
  { user: 'Dr. Rajesh Sharma', action: 'UPDATE', target_entity: 'INVENTORY', details: 'Marked unit UNT-902 as EXPIRED', timestamp: '2025-12-21 08:10:00' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [donors, setDonors] = useState(INITIAL_DONORS);
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  
  // Modal / Form States
  const [showAddDonorModal, setShowAddDonorModal] = useState(false);
  const [showAddDonationModal, setShowAddDonationModal] = useState(false);
  const [showAddHospitalModal, setShowAddHospitalModal] = useState(false);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('ALL');
  const [filterCity, setFilterCity] = useState('ALL');
  
  // Form input states
  const [newDonor, setNewDonor] = useState({ full_name: '', age: '', gender: 'Male', blood_group: 'O+', phone: '', email: '', city: 'Pune', address: '' });
  const [newDonation, setNewDonation] = useState({ donor_id: 1, quantity_ml: 350, screening_status: 'APPROVED', deferral_reason: '', collected_by: 'Nurse Sunita', component_type: 'Whole Blood', notes: '' });
  const [newHospital, setNewHospital] = useState({ hospital_name: '', contact_person: '', phone: '', email: '', city: 'Pune', address: '' });
  const [newRequest, setNewRequest] = useState({ hospital_id: 1, blood_group: 'O+', component_type: 'Packed RBC', quantity_requested: 2, priority: 'ROUTINE', required_by_date: '2026-11-20', notes: '' });
  
  // Notification banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handlers for CRUD
  const handleCreateDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonor.full_name || !newDonor.age || !newDonor.phone) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    const created = {
      donor_id: donors.length + 1,
      donor_code: `DNR-${donors.length + 1001}`,
      ...newDonor,
      age: Number(newDonor.age),
      last_donation_date: null,
      consent_for_contact: true,
      is_eligible: true
    };
    setDonors([created, ...donors]);
    setShowAddDonorModal(false);
    setNewDonor({ full_name: '', age: '', gender: 'Male', blood_group: 'O+', phone: '', email: '', city: 'Pune', address: '' });
    showNotification(`Donor ${created.donor_code} successfully registered!`);
  };

  const handleCreateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const donor = donors.find(d => d.donor_id === Number(newDonation.donor_id));
    if (!donor) return;

    const createdDonation = {
      donation_id: donations.length + 1,
      donation_code: `DON-${donations.length + 501}`,
      donor_id: donor.donor_id,
      donor_name: donor.full_name,
      blood_group: donor.blood_group,
      donation_date: new Date().toISOString().split('T')[0],
      ...newDonation,
      quantity_ml: Number(newDonation.quantity_ml)
    };
    setDonations([createdDonation, ...donations]);

    // If approved, create blood unit
    if (newDonation.screening_status === 'APPROVED') {
      const newUnit = {
        unit_id: inventory.length + 1,
        unit_code: `UNT-${inventory.length + 901}`,
        donor_name: donor.full_name,
        blood_group: donor.blood_group,
        component_type: newDonation.component_type,
        collection_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'AVAILABLE',
        storage_location: 'Main Cold Storage Unit A1'
      };
      setInventory([newUnit, ...inventory]);
    }

    setShowAddDonationModal(false);
    showNotification(`Donation ${createdDonation.donation_code} recorded successfully!`);
  };

  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      hospital_id: hospitals.length + 1,
      hospital_code: `HSP-${hospitals.length + 301}`,
      ...newHospital
    };
    setHospitals([...hospitals, created]);
    setShowAddHospitalModal(false);
    setNewHospital({ hospital_name: '', contact_person: '', phone: '', email: '', city: 'Pune', address: '' });
    showNotification(`Hospital ${created.hospital_name} added successfully!`);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const hospital = hospitals.find(h => h.hospital_id === Number(newRequest.hospital_id));
    if (!hospital) return;

    const created = {
      request_id: requests.length + 1,
      request_code: `REQ-${requests.length + 701}`,
      hospital_name: hospital.hospital_name,
      ...newRequest,
      quantity_requested: Number(newRequest.quantity_requested),
      quantity_allocated: 0,
      request_status: 'PENDING'
    };
    setRequests([created, ...requests]);
    setShowAddRequestModal(false);
    showNotification(`Blood request ${created.request_code} created successfully!`);
  };

  const handleAllocateUnit = (unitId: number) => {
    if (!selectedRequest) return;
    const unit = inventory.find(u => u.unit_id === unitId);
    if (!unit) return;

    if (unit.blood_group !== selectedRequest.blood_group) {
      showNotification(`Blood group mismatch! Request needs ${selectedRequest.blood_group}, unit is ${unit.blood_group}`, 'error');
      return;
    }

    if (unit.status !== 'AVAILABLE') {
      showNotification(`Unit is not available (status: ${unit.status})`, 'error');
      return;
    }

    // Update unit status to ISSUED
    setInventory(inventory.map(u => u.unit_id === unitId ? { ...u, status: 'ISSUED' } : u));

    // Update request
    const newAllocated = selectedRequest.quantity_allocated + 1;
    const newStatus = newAllocated >= selectedRequest.quantity_requested ? 'FULFILLED' : 'PARTIALLY_FULFILLED';
    
    setRequests(requests.map(r => r.request_id === selectedRequest.request_id ? {
      ...r,
      quantity_allocated: newAllocated,
      request_status: newStatus
    } : r));

    setShowAllocateModal(false);
    showNotification(`Successfully allocated unit ${unit.unit_code} to ${selectedRequest.request_code}!`);
  };

  // CSV Export helper
  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] ?? '')).join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
    showNotification(`Successfully exported ${filename}!`);
  };

  // Dashboard Stats Calculations
  const totalDonors = donors.length;
  const totalDonations = donations.filter(d => d.screening_status === 'APPROVED').length;
  const availableUnits = inventory.filter(u => u.status === 'AVAILABLE').length;
  const pendingRequests = requests.filter(r => r.request_status === 'PENDING' || r.request_status === 'PARTIALLY_FULFILLED').length;
  const nearExpiryUnits = inventory.filter(u => u.status === 'AVAILABLE').length; // sample threshold

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-red-950 text-stone-100 flex flex-col shadow-xl">
        <div className="p-6 border-b border-red-900 flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl text-white shadow-md">
            <Droplet className="w-7 h-7 fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide">Blood Bank</h1>
            <p className="text-xs text-red-300 font-medium">SIT Pune • DCDS Mini-Project</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'donors', label: 'Donor Management', icon: Users },
            { id: 'donations', label: 'Donation & Screening', icon: HeartHandshake },
            { id: 'inventory', label: 'Blood Inventory', icon: Droplet },
            { id: 'hospitals', label: 'Hospital Directory', icon: Building2 },
            { id: 'requests', label: 'Hospital Requests', icon: FileText },
            { id: 'reports', label: 'Reports & Analytics', icon: ShieldAlert },
            { id: 'database', label: 'Database & Python Code', icon: Database },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-red-700 text-white shadow-lg shadow-red-900/50 translate-x-1' 
                    : 'text-stone-300 hover:bg-red-900/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-red-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-red-900 bg-red-950/80 text-xs text-red-300 flex items-center justify-between">
          <div>
            <p className="font-semibold text-stone-200">MySQL 8.0 Database</p>
            <p className="text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Connected
            </p>
          </div>
          <span className="bg-red-900 px-2 py-1 rounded text-stone-200 font-mono">ESE v2.4</span>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP HEADER */}
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-stone-900 capitalize">
              {activeTab === 'database' ? 'Database Schema & Python Backend' : activeTab.replace('-', ' ')}
            </h2>
            <p className="text-xs text-stone-500">Symbiosis Institute of Technology, Pune • B.Tech CSE Mini-Project</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-xs font-semibold text-red-800">
              <UserCheck className="w-4 h-4 text-red-700" />
              <span>Bivek sah (Admin)</span>
            </div>
          </div>
        </header>

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className={`mx-8 mt-4 p-4 rounded-xl flex items-center justify-between shadow-md transition-all ${
            notification.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
              <span className="font-medium text-sm">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-stone-400 hover:text-stone-600 font-bold">&times;</button>
          </div>
        )}

        {/* TAB CONTENTS */}
        <div className="p-8 space-y-8 flex-1">

          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { label: 'Total Donors', value: totalDonors, icon: Users, color: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
                  { label: 'Total Donations', value: totalDonations, icon: HeartHandshake, color: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  { label: 'Available Stock', value: availableUnits, icon: Droplet, color: 'bg-red-600', bg: 'bg-red-50 text-red-700 border-red-200' },
                  { label: 'Pending Requests', value: pendingRequests, icon: FileText, color: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
                  { label: 'Near Expiry Units', value: nearExpiryUnits, icon: ShieldAlert, color: 'bg-purple-500', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className={`p-6 rounded-2xl border shadow-xs flex items-center justify-between ${stat.bg}`}>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{stat.label}</p>
                        <h3 className="text-3xl font-extrabold mt-1">{stat.value}</h3>
                      </div>
                      <div className={`p-3 rounded-xl text-white shadow-md ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BLOOD GROUP STOCK BREAKDOWN GRID */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-red-600" /> Blood-Group-Wise Eligible Available Stock
                  </h3>
                  <button onClick={() => setActiveTab('inventory')} className="text-xs font-semibold text-red-700 hover:underline">
                    View Full Inventory &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => {
                    const count = inventory.filter(u => u.blood_group === bg && u.status === 'AVAILABLE').length;
                    return (
                      <div key={bg} className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 text-center flex flex-col items-center justify-center">
                        <span className="w-10 h-10 rounded-full bg-red-100 text-red-800 font-extrabold flex items-center justify-center text-sm shadow-xs mb-2">
                          {bg}
                        </span>
                        <span className="text-2xl font-bold text-stone-900">{count}</span>
                        <span className="text-xs text-stone-500 font-medium">Units Ready</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RECENT DONATIONS & HOSPITAL REQUESTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Recent Donations */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-stone-900 text-base">Recent Blood Donations</h3>
                    <button onClick={() => setActiveTab('donations')} className="text-xs text-red-700 font-semibold hover:underline">View All</button>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {donations.slice(0, 4).map(don => (
                      <div key={don.donation_id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-stone-900">{don.donor_name} <span className="text-xs font-mono text-red-600 font-bold ml-1">({don.blood_group})</span></p>
                          <p className="text-xs text-stone-500">{don.donation_code} • {don.donation_date}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          don.screening_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          don.screening_status === 'DEFERRED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {don.screening_status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Hospital Requests */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-stone-900 text-base">Recent Hospital Blood Requests</h3>
                    <button onClick={() => setActiveTab('requests')} className="text-xs text-red-700 font-semibold hover:underline">View All</button>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {requests.slice(0, 4).map(req => (
                      <div key={req.request_id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-stone-900">{req.hospital_name} <span className="text-xs font-mono text-red-600 font-bold ml-1">({req.blood_group})</span></p>
                          <p className="text-xs text-stone-500">{req.request_code} • Requested: {req.quantity_requested} | Allocated: {req.quantity_allocated}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          req.request_status === 'FULFILLED' ? 'bg-emerald-100 text-emerald-800' :
                          req.request_status === 'PARTIALLY_FULFILLED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.request_status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. DONOR MANAGEMENT VIEW */}
          {activeTab === 'donors' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search by name, code or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <select
                    value={filterBloodGroup}
                    onChange={(e) => setFilterBloodGroup(e.target.value)}
                    className="py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium"
                  >
                    <option value="ALL">All Blood Groups</option>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => exportToCSV(donors, 'donors_export.csv')}
                    className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-all"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                  <button
                    onClick={() => setShowAddDonorModal(true)}
                    className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-800 transition-all shadow-md shadow-red-700/30"
                  >
                    <Plus className="w-4 h-4" /> Add Donor
                  </button>
                </div>
              </div>

              {/* Donors Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider">
                      <th className="p-4">Donor Code</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Blood Group</th>
                      <th className="p-4">Age / Gender</th>
                      <th className="p-4">Phone / City</th>
                      <th className="p-4">Last Donation</th>
                      <th className="p-4 text-center">Eligibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {donors
                      .filter(d => 
                        (filterBloodGroup === 'ALL' || d.blood_group === filterBloodGroup) &&
                        (d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || d.donor_code.toLowerCase().includes(searchTerm.toLowerCase()) || d.phone.includes(searchTerm))
                      )
                      .map(donor => (
                        <tr key={donor.donor_id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-4 font-mono font-bold text-red-800">{donor.donor_code}</td>
                          <td className="p-4 font-semibold text-stone-900">{donor.full_name}</td>
                          <td className="p-4">
                            <span className="bg-red-100 text-red-900 px-2.5 py-1 rounded-lg font-bold text-xs">
                              {donor.blood_group}
                            </span>
                          </td>
                          <td className="p-4 text-stone-600">{donor.age} yrs, {donor.gender}</td>
                          <td className="p-4 text-stone-600">
                            <p className="font-medium">{donor.phone}</p>
                            <p className="text-xs text-stone-400">{donor.city}</p>
                          </td>
                          <td className="p-4 text-stone-600">{donor.last_donation_date || 'Never'}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              donor.is_eligible ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {donor.is_eligible ? 'Eligible' : 'Deferred'}
                            </span>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. DONATION MANAGEMENT VIEW */}
          {activeTab === 'donations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Donation Records & Screening Workflow</h3>
                  <p className="text-xs text-stone-500">Record blood donations and evaluate screening statuses (Approved units automatically populate blood inventory).</p>
                </div>
                <button
                  onClick={() => setShowAddDonationModal(true)}
                  className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-800 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" /> Record Donation
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider">
                      <th className="p-4">Donation Code</th>
                      <th className="p-4">Donor Name</th>
                      <th className="p-4">Blood Group</th>
                      <th className="p-4">Date & Qty</th>
                      <th className="p-4">Screening Status</th>
                      <th className="p-4">Collected By</th>
                      <th className="p-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {donations.map(don => (
                      <tr key={don.donation_id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-red-800">{don.donation_code}</td>
                        <td className="p-4 font-semibold text-stone-900">{don.donor_name}</td>
                        <td className="p-4">
                          <span className="bg-red-100 text-red-900 px-2.5 py-1 rounded-lg font-bold text-xs">{don.blood_group}</span>
                        </td>
                        <td className="p-4 text-stone-600">
                          <p className="font-medium">{don.donation_date}</p>
                          <p className="text-xs text-stone-400">{don.quantity_ml} ml</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            don.screening_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            don.screening_status === 'DEFERRED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {don.screening_status}
                          </span>
                          {don.deferral_reason && <p className="text-xs text-red-600 mt-1">Reason: {don.deferral_reason}</p>}
                        </td>
                        <td className="p-4 text-stone-600">{don.collected_by}</td>
                        <td className="p-4 text-stone-500 text-xs">{don.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. BLOOD INVENTORY VIEW */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Blood Inventory Stock & Storage</h3>
                  <p className="text-xs text-stone-500">Filter by blood group and unit status. Expired and issued units are isolated from available stock.</p>
                </div>
                <button
                  onClick={() => exportToCSV(inventory, 'blood_inventory_export.csv')}
                  className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  <Download className="w-4 h-4" /> Export Inventory CSV
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider">
                      <th className="p-4">Unit Code</th>
                      <th className="p-4">Blood Group & Component</th>
                      <th className="p-4">Donor Name</th>
                      <th className="p-4">Collection Date</th>
                      <th className="p-4">Expiry Date</th>
                      <th className="p-4">Storage Location</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {inventory.map(unit => (
                      <tr key={unit.unit_id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-red-800">{unit.unit_code}</td>
                        <td className="p-4">
                          <span className="font-bold text-stone-900">{unit.blood_group}</span>
                          <span className="text-xs text-stone-500 block">{unit.component_type}</span>
                        </td>
                        <td className="p-4 text-stone-700">{unit.donor_name}</td>
                        <td className="p-4 text-stone-600">{unit.collection_date}</td>
                        <td className="p-4 font-semibold text-stone-900">{unit.expiry_date}</td>
                        <td className="p-4 text-stone-600 text-xs font-mono">{unit.storage_location}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            unit.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                            unit.status === 'ISSUED' ? 'bg-blue-100 text-blue-800' :
                            unit.status === 'EXPIRED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {unit.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. HOSPITAL MANAGEMENT VIEW */}
          {activeTab === 'hospitals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Affiliated Hospital Directory</h3>
                  <p className="text-xs text-stone-500">Manage hospitals registered to request blood units from this blood bank.</p>
                </div>
                <button
                  onClick={() => setShowAddHospitalModal(true)}
                  className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-800 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Hospital
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map(hosp => (
                  <div key={hosp.hospital_id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">{hosp.hospital_code}</span>
                        <span className="text-xs font-semibold text-stone-500">{hosp.city}</span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-lg mt-3">{hosp.hospital_name}</h4>
                      <p className="text-xs text-stone-600 mt-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-stone-400" /> {hosp.address}</p>
                      
                      <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                        <p className="flex items-center gap-2"><UserCheck className="w-3.5 h-3.5 text-red-700" /> Contact: <span className="font-semibold text-stone-900">{hosp.contact_person}</span></p>
                        <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-red-700" /> {hosp.phone}</p>
                        <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-red-700" /> {hosp.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. BLOOD REQUESTS VIEW */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Hospital Blood Requests & ACID Allocation</h3>
                  <p className="text-xs text-stone-500">Create requests and allocate available blood units using transactional safeguards.</p>
                </div>
                <button
                  onClick={() => setShowAddRequestModal(true)}
                  className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-800 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" /> Create Request
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider">
                      <th className="p-4">Request Code</th>
                      <th className="p-4">Hospital Name</th>
                      <th className="p-4">Blood Group & Component</th>
                      <th className="p-4">Requested / Allocated</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {requests.map(req => (
                      <tr key={req.request_id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-red-800">{req.request_code}</td>
                        <td className="p-4 font-semibold text-stone-900">{req.hospital_name}</td>
                        <td className="p-4">
                          <span className="font-bold text-stone-900">{req.blood_group}</span>
                          <span className="text-xs text-stone-500 block">{req.component_type}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-extrabold text-stone-900">{req.quantity_allocated} / {req.quantity_requested}</span>
                          <span className="text-xs text-stone-500 block">Required by: {req.required_by_date}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            req.priority === 'EMERGENCY' ? 'bg-red-100 text-red-900' :
                            req.priority === 'URGENT' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-800'
                          }`}>
                            {req.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            req.request_status === 'FULFILLED' ? 'bg-emerald-100 text-emerald-800' :
                            req.request_status === 'PARTIALLY_FULFILLED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.request_status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {req.request_status !== 'FULFILLED' && (
                            <button
                              onClick={() => { setSelectedRequest(req); setShowAllocateModal(true); }}
                              className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                            >
                              Allocate Unit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. REPORTS & ANALYTICS VIEW */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Reports & Analytical Summaries</h3>
                  <p className="text-xs text-stone-500">Aggregated insights, expiration audits, and request fulfillment reports.</p>
                </div>
                <button
                  onClick={() => exportToCSV(requests, 'hospital_requests_report.csv')}
                  className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-800 shadow-md"
                >
                  <Download className="w-4 h-4" /> Export Report CSV
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <h4 className="font-bold text-stone-900 text-base">MongoDB Screening Logs</h4>
                  <div className="divide-y divide-stone-100 text-xs">
                    {MONGODB_SCREENING_LOGS.map((log, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-mono font-bold text-stone-900">{log.donor_code} ({log.donation_code})</p>
                          <p className="text-stone-500">Hb: {log.vitals.hemoglobin} g/dL | BP: {log.vitals.bp}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-bold ${log.screening_result === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {log.screening_result}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <h4 className="font-bold text-stone-900 text-base">System Audit Trail (MongoDB)</h4>
                  <div className="divide-y divide-stone-100 text-xs">
                    {MONGODB_AUDIT_LOGS.map((audit, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-stone-900">{audit.user} <span className="text-red-700 font-mono">[{audit.action}]</span></p>
                          <p className="text-stone-500">{audit.details}</p>
                        </div>
                        <span className="text-stone-400 font-mono">{audit.timestamp.split(' ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. DATABASE & PYTHON CODE VIEW */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-red-600" /> MySQL 8.0 & Python Backend Architecture
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Symbiosis Institute of Technology, Pune • B.Tech CSE DCDS Lab ESE Mini-Project Deliverables.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-stone-900 text-stone-200 p-6 rounded-2xl font-mono text-xs shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <span className="font-bold text-red-400">database/schema.sql (MySQL 8.0 DDL)</span>
                    <span className="text-stone-500">InnoDB Engine</span>
                  </div>
                  <pre className="overflow-x-auto text-stone-300 leading-relaxed">
{`CREATE DATABASE IF NOT EXISTS blood_bank_management;
USE blood_bank_management;

CREATE TABLE donors (
    donor_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 18 AND age <= 65),
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    phone VARCHAR(15) NOT NULL,
    city VARCHAR(50) NOT NULL,
    is_eligible BOOLEAN DEFAULT TRUE
);

CREATE TABLE blood_units (
    unit_id INT AUTO_INCREMENT PRIMARY KEY,
    unit_code VARCHAR(30) NOT NULL UNIQUE,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    status ENUM('AVAILABLE', 'ISSUED', 'EXPIRED') DEFAULT 'AVAILABLE'
);`}
                  </pre>
                </div>

                <div className="bg-stone-900 text-stone-200 p-6 rounded-2xl font-mono text-xs shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <span className="font-bold text-red-400">backend/app.py (Flask REST API)</span>
                    <span className="text-stone-500">Python 3.10</span>
                  </div>
                  <pre className="overflow-x-auto text-stone-300 leading-relaxed">
{`from flask import Flask, jsonify, request
from flask_cors import CORS
from database.sql_db import execute_query

app = Flask(__name__)
CORS(app)

@app.route('/api/donors', methods=['GET'])
def get_donors():
    data = execute_query("SELECT * FROM donors")
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=5000, debug=True)`}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- MODALS --- */}

      {/* ADD DONOR MODAL */}
      {showAddDonorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-lg text-stone-900">Register New Donor</h3>
              <button onClick={() => setShowAddDonorModal(false)} className="text-stone-400 hover:text-stone-600 font-bold">&times;</button>
            </div>
            <form onSubmit={handleCreateDonor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newDonor.full_name}
                  onChange={(e) => setNewDonor({ ...newDonor, full_name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  placeholder="Enter donor full name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Age (18 - 65)</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    required
                    value={newDonor.age}
                    onChange={(e) => setNewDonor({ ...newDonor, age: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Blood Group</label>
                  <select
                    value={newDonor.blood_group}
                    onChange={(e) => setNewDonor({ ...newDonor, blood_group: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-red-800"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Gender</label>
                  <select
                    value={newDonor.gender}
                    onChange={(e) => setNewDonor({ ...newDonor, gender: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newDonor.phone}
                    onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                    placeholder="+919822012345"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newDonor.city}
                  onChange={(e) => setNewDonor({ ...newDonor, city: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  placeholder="Pune"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddDonorModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 text-white rounded-xl text-sm font-semibold hover:bg-red-800 shadow-md"
                >
                  Save Donor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD DONATION MODAL */}
      {showAddDonationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-lg text-stone-900">Record Blood Donation & Screening</h3>
              <button onClick={() => setShowAddDonationModal(false)} className="text-stone-400 hover:text-stone-600 font-bold">&times;</button>
            </div>
            <form onSubmit={handleCreateDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Select Donor</label>
                <select
                  value={newDonation.donor_id}
                  onChange={(e) => setNewDonation({ ...newDonation, donor_id: Number(e.target.value) })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium"
                >
                  {donors.map(d => (
                    <option key={d.donor_id} value={d.donor_id}>{d.donor_code} - {d.full_name} ({d.blood_group})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Quantity (ml)</label>
                  <input
                    type="number"
                    min="200"
                    max="500"
                    value={newDonation.quantity_ml}
                    onChange={(e) => setNewDonation({ ...newDonation, quantity_ml: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Screening Status</label>
                  <select
                    value={newDonation.screening_status}
                    onChange={(e) => setNewDonation({ ...newDonation, screening_status: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-emerald-800"
                  >
                    <option value="APPROVED">APPROVED (Generates Unit)</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DEFERRED">DEFERRED</option>
                  </select>
                </div>
              </div>
              {newDonation.screening_status === 'DEFERRED' && (
                <div>
                  <label className="block text-xs font-bold text-red-700 uppercase mb-1">Deferral Reason</label>
                  <input
                    type="text"
                    required
                    value={newDonation.deferral_reason}
                    onChange={(e) => setNewDonation({ ...newDonation, deferral_reason: e.target.value })}
                    className="w-full p-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-900"
                    placeholder="e.g., Low Hemoglobin"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Component Type</label>
                <select
                  value={newDonation.component_type}
                  onChange={(e) => setNewDonation({ ...newDonation, component_type: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                >
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Packed RBC">Packed RBC</option>
                  <option value="Plasma">Plasma</option>
                  <option value="Platelets">Platelets</option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Collected By</label>
                <input
                  type="text"
                  value={newDonation.collected_by}
                  onChange={(e) => setNewDonation({ ...newDonation, collected_by: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddDonationModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 text-white rounded-xl text-sm font-semibold hover:bg-red-800 shadow-md"
                >
                  Record Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALLOCATE UNIT MODAL */}
      {showAllocateModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-stone-900">Allocate Blood Unit to {selectedRequest.request_code}</h3>
                <p className="text-xs text-stone-500">Hospital: {selectedRequest.hospital_name} | Required Group: <strong className="text-red-700">{selectedRequest.blood_group}</strong></p>
              </div>
              <button onClick={() => setShowAllocateModal(false)} className="text-stone-400 hover:text-stone-600 font-bold">&times;</button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-700 uppercase">Available Units for Blood Group {selectedRequest.blood_group}:</p>
              <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-stone-100 border border-stone-200 rounded-xl p-3 bg-stone-50">
                {inventory.filter(u => u.blood_group === selectedRequest.blood_group && u.status === 'AVAILABLE').length === 0 ? (
                  <p className="text-sm text-stone-500 text-center py-4">No available units matching blood group {selectedRequest.blood_group}.</p>
                ) : (
                  inventory
                    .filter(u => u.blood_group === selectedRequest.blood_group && u.status === 'AVAILABLE')
                    .map(unit => (
                      <div key={unit.unit_id} className="pt-2.5 first:pt-0 flex items-center justify-between">
                        <div>
                          <p className="font-mono font-bold text-sm text-red-800">{unit.unit_code} <span className="text-xs font-sans text-stone-600 font-normal">({unit.component_type})</span></p>
                          <p className="text-xs text-stone-500">Expires: {unit.expiry_date} | {unit.storage_location}</p>
                        </div>
                        <button
                          onClick={() => handleAllocateUnit(unit.unit_id)}
                          className="bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-800 shadow-xs"
                        >
                          Select & Allocate
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowAllocateModal(false)}
                className="px-4 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD HOSPITAL MODAL */}
      {showAddHospitalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-lg text-stone-900">Add Affiliated Hospital</h3>
              <button onClick={() => setShowAddHospitalModal(false)} className="text-stone-400 hover:text-stone-600 font-bold">&times;</button>
            </div>
            <form onSubmit={handleCreateHospital} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Hospital Name</label>
                <input
                  type="text"
                  required
                  value={newHospital.hospital_name}
                  onChange={(e) => setNewHospital({ ...newHospital, hospital_name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  placeholder="Ruby Hall Clinic"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={newHospital.contact_person}
                    onChange={(e) => setNewHospital({ ...newHospital, contact_person: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                    placeholder="Dr. Anand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newHospital.phone}
                    onChange={(e) => setNewHospital({ ...newHospital, phone: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                    placeholder="+9120..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newHospital.city}
                    onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                    placeholder="Pune"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newHospital.email}
                    onChange={(e) => setNewHospital({ ...newHospital, email: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                    placeholder="bloodbank@hospital.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Address</label>
                <textarea
                  required
                  rows={2}
                  value={newHospital.address}
                  onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  placeholder="Full hospital address"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddHospitalModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 text-white rounded-xl text-sm font-semibold hover:bg-red-800 shadow-md"
                >
                  Save Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE REQUEST MODAL */}
      {showAddRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-lg text-stone-900">Create Blood Request</h3>
              <button onClick={() => setShowAddRequestModal(false)} className="text-stone-400 hover:text-stone-600 font-bold">&times;</button>
            </div>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Hospital</label>
                <select
                  value={newRequest.hospital_id}
                  onChange={(e) => setNewRequest({ ...newRequest, hospital_id: Number(e.target.value) })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                >
                  {hospitals.map(h => (
                    <option key={h.hospital_id} value={h.hospital_id}>{h.hospital_code} - {h.hospital_name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Blood Group</label>
                  <select
                    value={newRequest.blood_group}
                    onChange={(e) => setNewRequest({ ...newRequest, blood_group: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-red-800"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Component</label>
                  <select
                    value={newRequest.component_type}
                    onChange={(e) => setNewRequest({ ...newRequest, component_type: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  >
                    <option value="Packed RBC">Packed RBC</option>
                    <option value="Whole Blood">Whole Blood</option>
                    <option value="Plasma">Plasma</option>
                    <option value="Platelets">Platelets</option>
                    <option value="Cryoprecipitate">Cryoprecipitate</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Quantity Requested</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newRequest.quantity_requested}
                    onChange={(e) => setNewRequest({ ...newRequest, quantity_requested: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Priority</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-amber-800"
                  >
                    <option value="ROUTINE">ROUTINE</option>
                    <option value="URGENT">URGENT</option>
                    <option value="EMERGENCY">EMERGENCY</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Required By Date</label>
                <input
                  type="date"
                  required
                  value={newRequest.required_by_date}
                  onChange={(e) => setNewRequest({ ...newRequest, required_by_date: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddRequestModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 text-white rounded-xl text-sm font-semibold hover:bg-red-800 shadow-md"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
