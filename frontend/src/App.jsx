import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import { QueueProvider, useQueue } from './context/QueueContext'
import Booking from './pages/Booking'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import './index.css'

const Home = () => {
  const { departments } = useQueue();

  const officialDocs = departments.filter(d => d.department === 'Official Identity Documents');
  const healthcare = departments.filter(d => d.department === 'Healthcare');

  const renderServiceCard = (dept) => {
    const isHealthcare = dept.department === 'Healthcare';
    return (
      <Link
        key={dept._id}
        to="/booking"
        state={{ initialDepartment: dept.name }}
        className="glass-card"
        style={{
          padding: '2rem',
          textAlign: 'center',
          transition: 'transform 0.3s ease, border-color 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-10px)';
          e.currentTarget.style.borderColor = isHealthcare ? 'var(--secondary)' : 'var(--primary)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--surface-border)';
        }}
      >
        <div style={{
          width: dept.name.includes('Aadhaar') ? '120px' : '60px',
          height: dept.name.includes('Aadhaar') ? '70px' : '60px',
          borderRadius: '15px',
          background: isHealthcare ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 107, 53, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isHealthcare ? 'var(--secondary)' : 'var(--primary)',
          overflow: 'hidden',
          padding: dept.name.includes('Aadhaar') ? '0.5rem' : '0'
        }}>
          {dept.name.includes('Aadhaar') && <img src="/assets/aadhaar-logo.png" alt="Aadhaar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
          {dept.name.includes('PAN') && <span style={{ fontSize: '2rem' }}>💳</span>}
          {dept.name.includes('Passport') && <span style={{ fontSize: '2rem' }}>🛂</span>}
          {dept.name.includes('Driving') && <span style={{ fontSize: '2rem' }}>🚗</span>}
          {dept.name.includes('Hospital') && <span style={{ fontSize: '2rem' }}>🏥</span>}
          {dept.name.includes('Diagnosis') && <span style={{ fontSize: '2rem' }}>🧪</span>}
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{dept.name}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{dept.description}</p>
        </div>
        <button
          className={isHealthcare ? "btn-secondary" : "btn-primary"}
          style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', padding: '0.5rem' }}
        >
          Book Now
        </button>
      </Link>
    );
  };

  return (
    <div className="container animate-fade" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      {/* Government of India Logo */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
        <img
          src="/assets/govt-logo.png"
          alt="Government of India"
          style={{ height: '150px', objectFit: 'contain' }}
        />
      </div>

      <h1 className="hero-title">
        Skip the Line, <br />Save Your Time.
      </h1>
      <p className="hero-text">
        Select a service below to book your appointment instantly and track your turn live.
      </p>

      {/* Official Identity Documents Section */}
      <div style={{ marginBottom: '5rem' }}>
        <h2 className="section-title" style={{ borderLeft: '4px solid var(--primary)' }}>
          Official Identity Documents
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {officialDocs.length === 0 ? <p>Loading services...</p> : officialDocs.map(renderServiceCard)}
        </div>
      </div>

      {/* Healthcare Section */}
      <div style={{ marginBottom: '5rem' }}>
        <h2 className="section-title" style={{ borderLeft: '4px solid var(--secondary)' }}>
          Healthcare & Wellness
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {healthcare.length === 0 ? <p>Loading services...</p> : healthcare.map(renderServiceCard)}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueueProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 120px)' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>

          <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            &copy; 2026 QueueSmart System. All rights reserved.
          </footer>
        </div>
      </Router>
    </QueueProvider>
  )
}

export default App
