import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Clock, Users, Calendar, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

const spinStyle = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .animate-spin { animation: spin 1s linear infinite; }
`;

const UserDashboard = () => {
  const { appointments, servingToken, user, api, fetchInitialData } = useQueue();
  const [isSyncing, setIsSyncing] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const handleSync = async () => {
    setIsSyncing(true);
    try { await fetchInitialData(); } finally { setIsSyncing(false); }
  };

  if (!user) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Please log in to view your dashboard.</div>;

  const userAppointments = appointments.filter(a => a.status !== 'cancelled').reverse();
  const activeAppt = userAppointments.find(a => a.status === 'waiting');

  return (
    <div className="container animate-fade" style={{ paddingTop: '2rem' }}>
      <style>{spinStyle}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem' }}>My Appointments</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.name}</p>
          <button className="glass-card" onClick={handleSync} disabled={isSyncing} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            {isSyncing ? 'Syncing...' : 'Sync Status'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Live Status Card */}
        {activeAppt && (
          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(14, 165, 233, 0.1))',
            border: '1px solid var(--primary)',
            gridColumn: '1 / -1'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertCircle color="var(--primary)" />
                  Live Queue Tracker
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>{activeAppt.slotId?.serviceId?.name} • Today</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  background: 'var(--success)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  IN PROGRESS
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem', textAlign: 'center' }}>
              <div className="glass-card" style={{ background: 'var(--surface)' }} role="status" aria-live="polite">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Now Serving</p>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>#{activeAppt.slotId?.currentToken || servingToken}</h3>
              </div>
              <div className="glass-card" style={{ background: 'var(--surface)', border: '1px solid var(--primary)' }} role="status" aria-live="polite">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your Token</p>
                <h3 style={{ fontSize: '2rem' }}>#{activeAppt.tokenNumber}</h3>
              </div>
              <div className="glass-card" style={{ background: 'var(--surface)' }} role="status" aria-live="polite">
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Est. Wait</p>
                <h3 style={{ fontSize: '2rem' }}>{Math.max(0, (activeAppt.tokenNumber - (activeAppt.slotId?.currentToken || servingToken)) * 10)}m</h3>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '8px', background: 'var(--surface-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, ((activeAppt.slotId?.currentToken || servingToken) / activeAppt.tokenNumber) * 100)}%`,
                  height: '100%',
                  background: 'var(--primary)',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {Math.max(0, activeAppt.tokenNumber - (activeAppt.slotId?.currentToken || servingToken))} people ahead of you
              </p>
            </div>
          </div>
        )}

        {/* History / All Appointments */}
        <div style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>All Appointments</h2>
          {userAppointments.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
              <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>No appointments found. Book one to see it here.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {userAppointments.map(app => (
                <div key={app._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'var(--glass-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.25rem'
                    }}>
                      #{app.tokenNumber}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem' }}>{app.slotId?.serviceId?.name} - <span style={{ color: 'var(--primary)' }}>{app.action}</span></h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        {app.slotId?.date} • {app.slotId?.startTime} - {app.slotId?.endTime}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      background: app.status === 'waiting' ? 'rgba(245, 158, 11, 0.1)' : (app.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                      color: app.status === 'waiting' ? 'var(--warning)' : (app.status === 'cancelled' ? 'var(--danger)' : 'var(--success)'),
                      border: '1px solid currentColor',
                      textTransform: 'uppercase'
                    }}>
                      {app.status}
                    </span>

                    {app.status === 'waiting' && (
                      <button
                        className="btn-primary"
                        disabled={cancellingId === app._id}
                        style={{ padding: '0.5rem 1rem', background: 'var(--danger)', fontSize: '0.75rem', minWidth: '100px', justifyContent: 'center' }}
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to cancel this appointment?')) {
                            setCancellingId(app._id);
                            try { await api.post(`/appointments/cancel/${app._id}`); await fetchInitialData(); }
                            catch (err) { alert(`Error: ${err.response?.data?.message || 'Failed to cancel'}`); }
                            finally { setCancellingId(null); }
                          }
                        }}
                      >
                        {cancellingId === app._id ? <Loader2 size={14} className="animate-spin" /> : null}
                        {cancellingId === app._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
