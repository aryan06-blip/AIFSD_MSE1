import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users, LogOut, PlusCircle, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Users size={24} className="text-gradient" />
        <h2 style={{ margin: 0 }} className="text-gradient">AI Analytics</h2>
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)' }}>Dashboard</Link>
        <Link to="/add" style={{ textDecoration: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <PlusCircle size={18} /> Add Employee
        </Link>
        <Link to="/ai" style={{ textDecoration: 'none', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
          <Sparkles size={18} /> AI Insights
        </Link>
        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
