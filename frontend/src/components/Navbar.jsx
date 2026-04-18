import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { Menu, X, User, LogOut, LayoutDashboard, Calendar } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useQueue();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="glass-card" style={{
      margin: '1rem',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: '1rem',
      zIndex: 1000,
      borderRadius: '1.25rem'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'var(--primary)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>Q</div>
        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)' }}>QueueSmart</span>
      </Link>

      {/* Desktop Nav */}
      <div className="desktop-nav" style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/booking" className="nav-link">Book Now</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
            <div style={{ width: '1px', height: '24px', background: 'var(--surface-border)' }} />
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
            Login / Register
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        className="mobile-menu-btn"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'none', color: 'var(--text)' }}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="glass-card animate-fade" style={{
          position: 'absolute',
          top: '110%',
          right: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.5rem'
        }}>
          <Link to="/" onClick={() => setIsOpen(false)} style={mobileLinkStyle}><LayoutDashboard size={18} /> Home</Link>
          <Link to="/booking" onClick={() => setIsOpen(false)} style={mobileLinkStyle}><Calendar size={18} /> Book Now</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} style={mobileLinkStyle}><User size={18} /> My Dashboard</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)} style={mobileLinkStyle}><LayoutDashboard size={18} /> Admin</Link>}
              <button onClick={handleLogout} className="btn-secondary" style={{ justifyContent: 'center' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="btn-primary" style={{ justifyContent: 'center' }}>
              Login / Register
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        .nav-link {
          font-weight: 600;
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--primary); }
      `}</style>
    </nav>
  );
};

const mobileLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem',
  borderRadius: '0.5rem',
  background: 'var(--glass-bg)',
  fontWeight: 600
};

export default Navbar;
