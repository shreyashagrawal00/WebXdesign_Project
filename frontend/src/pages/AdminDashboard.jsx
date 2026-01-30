import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Users, UserPlus, Play, SkipForward, CheckCircle, Ban, TrendingUp } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { servingToken, nextPatient, token, user } = useQueue();
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

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

  // Group by slot
  const slotsMap = activeAppointments.reduce((acc, curr) => {
    const slotId = curr.slotId?._id;
    if (!acc[slotId]) acc[slotId] = { slot: curr.slotId, appts: [] };
    acc[slotId].appts.push(curr);
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Control Center</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage live queues and patient flow across departments.</p>
      </div>

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
            {/* Add more admin tools here if needed */}
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
    </div>
  );
};

export default AdminDashboard;
