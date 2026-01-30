import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const Navbar = () => {
  const { user, logout } = useQueue();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-card" style={{
      margin: '1rem',
      borderRadius: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 2rem',
      position: 'sticky',
      top: '1rem',
      zIndex: 1000
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
        <img src="/assets/indian-flag-custom.png" alt="India Flag" style={{ height: '40px', objectFit: 'contain', borderRadius: '4px' }} />
        <span>eSeva India</span>
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/booking" className="nav-link">Book Now</Link>
        <Link to="/dashboard" className="nav-link">My Status</Link>
        {user?.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}

        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="glass-card" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
            <User size={18} />
            Login
          </Link>
        )}
      </div>

      <style jsx="true">{`
        .nav-link {
          font-weight: 500;
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--text);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
