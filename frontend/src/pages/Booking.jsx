import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import axios from 'axios';

const Booking = () => {
  const { departments, bookAppointment, token } = useQueue();
  const navigate = useNavigate();
  const location = useLocation();

  const initialDeptName = location.state?.initialDepartment || '';
  const initialDept = departments.find(d => d.name === initialDeptName);

  const [step, setStep] = useState(initialDept ? 2 : 1);
  const [formData, setFormData] = useState({
    serviceId: initialDept?._id || '',
    departmentName: initialDeptName,
    action: '',
    date: new Date().toISOString().split('T')[0],
    slotId: '',
    slotTime: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInstantService, setShowInstantService] = useState(false);
  const [verificationData, setVerificationData] = useState({ contact: '', otp: '' });

  const currentService = departments.find(d => d._id === formData.serviceId);

  useEffect(() => {
    if (formData.serviceId) {
      fetchSlots(formData.serviceId);
    }
  }, [formData.serviceId]);

  const fetchSlots = async (serviceId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/services/${serviceId}/slots`);
      setAvailableSlots(res.data);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await bookAppointment({
        slotId: formData.slotId,
        action: formData.action
      });
      navigate('/dashboard');
    } catch (err) {
      alert('Booking failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const steps = [
    { n: 1, label: 'Service' },
    { n: 2, label: 'Action' },
    { n: 3, label: 'Time Slot' },
    { n: 4, label: 'Confirm' }
  ];

  return (
    <div className="container animate-fade" style={{ maxWidth: '800px', padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Book an Appointment</h1>
        <p style={{ color: 'var(--text-muted)' }}>Follow the steps to secure your slot and get your token.</p>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        {/* Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
          {steps.map((s) => (
            <div key={s.n} style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: step >= s.n ? 'var(--primary)' : 'var(--glass-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              zIndex: 2,
              transition: 'all 0.3s ease',
              position: 'relative'
            }}>
              {step > s.n ? <CheckCircle size={20} /> : s.n}
              <span style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontSize: '0.65rem',
                marginTop: '0.5rem',
                color: step >= s.n ? 'var(--text)' : 'var(--text-muted)'
              }}>{s.label}</span>
            </div>
          ))}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: 0,
            right: 0,
            height: '2px',
            background: 'var(--glass-bg)',
            zIndex: 1
          }}>
            <div style={{
              width: `${((step - 1) / (steps.length - 1)) * 100}%`,
              height: '100%',
              background: 'var(--primary)',
              transition: 'all 0.3s ease'
            }} />
          </div>
        </div>

        {/* Step 1: Department */}
        {step === 1 && (
          <div className="animate-fade">
            <h2 style={{ marginBottom: '1.5rem' }}>Select Service</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {departments.map((dept) => (
                <div
                  key={dept._id}
                  onClick={() => { setFormData({ ...formData, serviceId: dept._id, departmentName: dept.name }); setStep(2); }}
                  className="glass-card"
                  style={{
                    cursor: 'pointer',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: formData.serviceId === dept._id ? '1px solid var(--primary)' : '1px solid var(--surface-border)',
                    background: formData.serviceId === dept._id ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{dept.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{dept.department}</p>
                  </div>
                  <MapPin size={20} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Action Selection */}
        {step === 2 && !showInstantService && (
          <div className="animate-fade">
            <h2 style={{ marginBottom: '1.5rem' }}>What do you need help with?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {currentService?.actions?.map((action) => {
                // Action descriptions
                const getActionDescription = (actionName) => {
                  const descriptions = {
                    // Aadhaar
                    'Verify Aadhaar Number': 'Verify if the Aadhaar number is valid and not deactivated',
                    'Lock/Unlock Biometrics': 'Secure biometric authentication by locking/unlocking biometrics',
                    'Update Aadhaar': 'Update your Aadhaar details and information',
                    'Get E-Aadhaar': 'Download your E-Aadhaar card online',

                    // PAN
                    'Verify PAN Status': 'Check the validity and status of your Permanent Account Number',
                    'Download E-PAN': 'Get a digital copy of your PAN card instantly',
                    'Correction in PAN': 'Apply for changes or corrections in PAN details',
                    'New PAN Application': 'Apply for a new Permanent Account Number',

                    // Passport
                    'Track Application Status': 'Track the current status of your passport application',
                    'Appointment Availability': 'Check available appointment slots at Passport Seva Kendras',
                    'Re-issue Passport': 'Apply for re-issue of passport due to expiry/changes',
                    'Fresh Passport Application': 'Apply for a new passport for the first time',

                    // Driving License
                    'Know Your DL Status': 'Check the current status of your driving license',
                    'Download Digital DL': 'Download a soft copy of your driving license',
                    'DL Renewal': 'Apply for renewal of your expired driving license',
                    'New Driving License': 'Apply for a permanent driving license'
                  };
                  return descriptions[actionName] || '';
                };

                const isInstantService = [
                  'Verify Aadhaar Number', 'Get E-Aadhaar',
                  'Verify PAN Status', 'Download E-PAN',
                  'Track Application Status', 'Appointment Availability',
                  'Know Your DL Status', 'Download Digital DL'
                ].includes(action);

                return (
                  <div
                    key={action}
                    onClick={() => {
                      setFormData({ ...formData, action });
                      if (isInstantService) {
                        setShowInstantService(true);
                      } else {
                        setStep(3);
                      }
                    }}
                    className="glass-card"
                    style={{
                      cursor: 'pointer',
                      padding: '1.5rem',
                      textAlign: 'left',
                      border: formData.action === action ? '1px solid var(--primary)' : '1px solid var(--surface-border)',
                      background: formData.action === action ? 'rgba(255, 107, 53, 0.1)' : 'var(--glass-bg)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{action}</h3>
                    {getActionDescription(action) && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {getActionDescription(action)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
              <button className="glass-card" style={{ flex: 1, padding: '0.75rem' }} onClick={() => setStep(1)}>Back</button>
            </div>
          </div>
        )}

        {/* Instant Service Verification (for Verify Aadhaar & Get E-Aadhaar) */}
        {showInstantService && (
          <div className="animate-fade">
            <h2 style={{ marginBottom: '1.5rem' }}>{formData.action}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              {formData.action.includes('Download') || formData.action.includes('Get')
                ? 'Enter your mobile number or email to download your document'
                : 'Enter your mobile number or email to verify status'}
            </p>

            <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Mobile Number / Email
                </label>
                <input
                  type="text"
                  placeholder="Enter mobile number or email"
                  value={verificationData.contact}
                  onChange={(e) => setVerificationData({ ...verificationData, contact: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--surface-border)',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}
                disabled={loading}
                onClick={async () => {
                  if (!verificationData.contact) {
                    alert('Please enter a mobile number or email');
                    return;
                  }
                  setLoading(true);
                  try {
                    const res = await axios.post('http://localhost:5001/api/auth/send-otp', { contact: verificationData.contact });
                    const otp = res.data.debugOtp;
                    alert(`OTP sent to ${verificationData.contact}.\n\nDEV MODE OTP: ${otp}\n\n(Since we don't have a real SMS gateway, use this code)`);
                  } catch (err) {
                    alert('Failed to send OTP: ' + (err.response?.data?.message || err.message));
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={verificationData.otp}
                  onChange={(e) => setVerificationData({ ...verificationData, otp: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--surface-border)',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', background: 'var(--success)' }}
                disabled={loading}
                onClick={async () => {
                  if (!verificationData.otp) {
                    alert('Please enter OTP');
                    return;
                  }
                  setLoading(true);
                  try {
                    await axios.post('http://localhost:5001/api/auth/verify-otp', {
                      contact: verificationData.contact,
                      otp: verificationData.otp
                    });

                    alert(`${formData.action} successful!\n\nAccess granted.`);
                    setShowInstantService(false);
                    // navigate to a success page or show document logic here
                  } catch (err) {
                    alert('Verification failed: ' + (err.response?.data?.message || err.message));
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? 'Verifying...' : (
                  formData.action.includes('Download') || formData.action.includes('Get') ? 'Download Now' : 'Check Status'
                )}
              </button>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                className="glass-card"
                style={{ padding: '0.75rem 2rem' }}
                onClick={() => { setShowInstantService(false); setVerificationData({ contact: '', otp: '' }); }}
              >
                Back to Actions
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Date & Slot */}
        {step === 3 && !showInstantService && (
          <div className="animate-fade">
            <h2 style={{ marginBottom: '1.5rem' }}>Choose Time Slot</h2>
            {loading ? <p>Loading available slots...</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {availableSlots.length === 0 ? <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>No slots available for this service.</p> :
                  availableSlots.map((slot) => (
                    <div
                      key={slot._id}
                      onClick={() => setFormData({ ...formData, slotId: slot._id, slotTime: `${slot.startTime} - ${slot.endTime}` })}
                      style={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: formData.slotId === slot._id ? 'var(--primary)' : 'var(--glass-bg)',
                        border: '1px solid var(--surface-border)',
                        transition: 'all 0.2s',
                        fontSize: '0.875rem'
                      }}
                    >
                      <div>{slot.startTime} - {slot.endTime}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{slot.maxCapacity - slot.bookedCount} left</div>
                    </div>
                  ))}
              </div>
            )}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button className="glass-card" style={{ flex: 1, padding: '0.75rem' }} onClick={() => setStep(2)}>Back</button>
              <button
                className="btn-primary"
                style={{ flex: 2 }}
                disabled={!formData.slotId}
                onClick={() => setStep(4)}
              >
                Review & Confirm
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="animate-fade" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Confirm Booking</h2>
            <div className="glass-card" style={{ textAlign: 'left', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <MapPin color="var(--primary)" size={18} />
                <span>{formData.departmentName} - <strong>{formData.action}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <CalendarIcon color="var(--primary)" size={18} />
                <span>{formData.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Clock color="var(--primary)" size={18} />
                <span>{formData.slotTime}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="glass-card" style={{ flex: 1, padding: '0.75rem' }} onClick={() => setStep(3)}>Back</button>
              <button
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={handleBook}
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
