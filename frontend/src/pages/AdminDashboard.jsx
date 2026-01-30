import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Users, UserPlus, Play, SkipForward, CheckCircle, Ban, TrendingUp, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { servingToken, nextPatient, token, user } = useQueue();
  const [allAppointments, setAllAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSlotManager, setShowSlotManager] = useState(false); // Toggle for the new section

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
      fetchServices();
      fetchSlots();
    }
  }, [user]);

  const fetchSlots = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/slots', {
        headers: { 'x-auth-token': token }
      });
      setSlots(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/services');
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/admin/appointments/all', {
        headers: { 'x-auth-token': token }
      });
      setAllAppointments(res.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeAppointments = allAppointments.filter(a => a.status === 'waiting');

  // Group appointments by slot
  const slotsMap = allAppointments.reduce((acc, app) => {
    if (!app.slotId || !app.slotId._id) return acc; // Skip invalid/orphaned appointments
    const slotId = app.slotId._id;
    if (!acc[slotId]) {
      acc[slotId] = {
        slot: app.slotId,
        appts: []
      };
    }
    acc[slotId].appts.push(app);
    return acc;
  }, {});

  const handleNext = async (slotId) => {
    try {
      await nextPatient(slotId);
      // Refresh data to show updated tokens
      fetchAdminData();
    } catch (err) {
      alert('Failed to advance queue');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Access Denied. Admin only.</div>;
  }

  return (
    <div className="container animate-fade" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage live queues and patient flow across departments.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowSlotManager(!showSlotManager)}
          style={{ background: showSlotManager ? 'var(--text-muted)' : 'var(--primary)' }}
        >
          {showSlotManager ? 'Close Slot Manager' : 'Manage Slot Timings'}
        </button>
      </div>

      {/* Slot Management Section (Toggleable) */}
      {showSlotManager && (
        <div className="glass-card animate-fade" style={{ marginBottom: '2.5rem', padding: '1.5rem', border: '1px solid var(--primary)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} /> Manage Service Timings
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {services.map(service => {
              const serviceSlots = slots.filter(s => s.serviceId?._id === service._id || s.serviceId === service._id);

              return (
                <div key={service._id} style={{ padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem', border: '1px solid var(--surface-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 700, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>{service.name}</h3>

                  {/* Existing Slots List */}
                  <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {serviceSlots.length === 0 ? <p style={{ fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>No active slots found.</p> : serviceSlots.map(slot => (
                      <div key={slot._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={14} color="#94a3b8" />
                          <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500 }}>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <button
                          onClick={async () => {
                            if (!window.confirm('Delete this slot?')) return;
                            try {
                              await axios.post(`http://localhost:5001/api/admin/slots/delete/${slot._id}`, {}, { headers: { 'x-auth-token': token } });
                              fetchSlots(); // Refresh list
                            } catch (err) { alert('Failed to delete'); }
                          }}
                          style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#fca5a5', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Slot Form */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Add New Slot</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input
                          id={`start-${service._id}`}
                          placeholder="Start (09:00 AM)"
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: 'white', fontSize: '0.85rem' }}
                        />
                        <input
                          id={`end-${service._id}`}
                          placeholder="End (12:00 PM)"
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: 'white', fontSize: '0.85rem' }}
                        />
                      </div>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.6rem', fontSize: '0.875rem', justifyContent: 'center', background: 'var(--primary)' }}
                        onClick={async () => {
                          const start = document.getElementById(`start-${service._id}`).value;
                          const end = document.getElementById(`end-${service._id}`).value;
                          if (!start || !end) return alert('Please enter both times');

                          try {
                            await axios.post('http://localhost:5001/api/admin/slots/add', {
                              serviceId: service._id,
                              startTime: start,
                              endTime: end
                            }, { headers: { 'x-auth-token': token } });

                            // Clear inputs
                            document.getElementById(`start-${service._id}`).value = '';
                            document.getElementById(`end-${service._id}`).value = '';

                            fetchSlots(); // Refresh
                          } catch (err) { alert('Failed: ' + err.message); }
                        }}
                      >
                        + Add Slot
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div >
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Queue Management by Slot */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Active Queues</h2>
          {Object.keys(slotsMap).length === 0 ? <p className="glass-card">No active queues at the moment.</p> :
            Object.values(slotsMap).map(({ slot, appts }) => (
              <div key={slot._id} className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{slot.serviceId?.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{slot.startTime} - {slot.endTime} • Currently Serving: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>#{slot.currentToken}</span></p>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--success)' }}
                    onClick={() => handleNext(slot._id)}
                  >
                    <SkipForward size={16} /> Next Patient
                  </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.5rem 0' }}>Token</th>
                      <th>Patient</th>
                      <th>Action</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appts.sort((a, b) => a.tokenNumber - b.tokenNumber).map(app => (
                      <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>#{app.tokenNumber}</td>
                        <td>{app.userId?.name}</td>
                        <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{app.action}</td>
                        <td>
                          <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '1rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid currentColor' }}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>

      </div>

      {/* Master Appointment List & Controls */}
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Admin Tools & Master List</h2>

        <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button onClick={fetchAdminData} className="glass-card" style={{ width: '100%', fontSize: '0.875rem', justifyContent: 'center' }}>
              Refresh Data
            </button>
            <button
              className="glass-card"
              style={{ width: '100%', fontSize: '0.875rem', justifyContent: 'center', background: 'var(--surface)' }}
              onClick={async () => {
                // Simple Prompt-based UI for Quick Editing
                const serviceName = prompt("Enter Service Name to update (e.g., 'Aadhaar Service' or 'PAN Card'):\n(Must match exactly)");
                if (!serviceName) return;

                // Find service ID from local data
                // Warning: accessing 'allAppointments' to find slots might not cover all services if empty.
                // Better to fetch services or use what we have visible.
                // For hackathon, we'll try to find it in the visible slots map first.

                let serviceId = null;
                const foundSlot = Object.values(slotsMap).find(({ slot }) => slot.serviceId?.name === serviceName);

                if (foundSlot) {
                  serviceId = foundSlot.slot.serviceId._id;
                } else {
                  // Try to find in all appointments array logic or alert
                  alert("Service not found in active queues. Please ensure there is at least one active slot.");
                  return;
                }

                const newStart = prompt("Enter new Start Time (e.g., 08:00 AM):", "08:00 AM");
                if (!newStart) return;

                const newEnd = prompt("Enter new End Time (e.g., 11:00 AM):", "11:00 AM");
                if (!newEnd) return;

                try {
                  await axios.post('http://localhost:5001/api/admin/slots/update', {
                    serviceId,
                    startTime: newStart,
                    endTime: newEnd
                  }, { headers: { 'x-auth-token': token } });

                  alert("Success! Timings updated. Refreshing...");
                  fetchAdminData();
                } catch (err) {
                  alert("Failed to update: " + err.message);
                }
              }}
            >
              Change Slot Timings
            </button>
          </div>
        </div>

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>All User Appointments</h2>
        <div className="glass-card" style={{ padding: '1.5rem', maxHeight: '500px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--surface-border)' }}>
                <th style={{ padding: '0.5rem 0' }}>User</th>
                <th>Service</th>
                <th>Status</th>
                <th>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {allAppointments.map(app => (
                <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem 0' }}>
                    <div style={{ fontWeight: 600 }}>{app.userId?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.userId?.email}</div>
                  </td>
                  <td>
                    <div>{app.slotId?.serviceId?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.action}</div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '1rem',
                      background: app.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: app.status === 'cancelled' ? 'var(--danger)' : 'var(--warning)',
                      border: '1px solid currentColor'
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    {app.status !== 'cancelled' && (
                      <button
                        className="btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--danger)', marginRight: '0.5rem' }}
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to cancel this appointment?')) {
                            try {
                              await axios.post(`http://localhost:5001/api/admin/appointment/${app._id}/cancel`, {}, { headers: { 'x-auth-token': token } });
                              fetchAdminData();
                            } catch (err) { alert('Failed to cancel'); }
                          }
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    {/* Placeholder for Edit Slot functionality - would require a slot picker modal */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

export default AdminDashboard;
