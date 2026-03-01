import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const Navbar = () => {
  const { user, logout } = useQueue();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="glass-card" style={{
      margin: '1rem',
      borderRadius: '2rem',
      padding: '0.75rem 2rem',
      position: 'sticky',
      top: '1rem',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
          <img src="/assets/indian-flag-custom.png" alt="India Flag" style={{ height: '40px', objectFit: 'contain', borderRadius: '4px' }} />
          <span>eSeva India</span>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
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

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          style={{ background: 'none', color: 'var(--text)' }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="mobile-menu" style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--surface-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <Link to="/booking" className="nav-link" onClick={() => setIsMenuOpen(false)}>Book Now</Link>
          <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Status</Link>
          {user?.role === 'admin' && <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>}

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>Signed in as {user.name}</span>
              <button onClick={handleLogout} className="glass-card" style={{ padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" onClick={() => setIsMenuOpen(false)} style={{ justifyContent: 'center' }}>
              <User size={18} />
              Login
            </Link>
          )}
        </div>
      )}

      <style jsx="true">{`
        .nav-link {
          font-weight: 500;
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--text);
        }
        .mobile-menu-btn {
          display: none;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
