import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      fetchEmployees();
      return;
    }
    try {
      const { data } = await api.get(`/employees/search?department=${search}`);
      setEmployees(data);
    } catch (err) {
      setError('Search failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-gradient" style={{ fontSize: '2rem' }}>Employee Directory</h2>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Search by Department..." 
            className="form-input" 
            style={{ width: '250px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            <Search size={18} />
          </button>
        </form>
      </div>

      {error && <div className="error-text mb-6">{error}</div>}

      <div className="glass table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Score</th>
              <th>Experience</th>
              <th>Skills</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr key={emp._id}>
                  <td style={{ fontWeight: 500 }}>
                    {emp.name}<br/>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.email}</span>
                  </td>
                  <td>{emp.department}</td>
                  <td>
                    <span className="badge" style={{ background: emp.performanceScore >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: emp.performanceScore >= 80 ? 'var(--success)' : 'var(--danger)' }}>
                      {emp.performanceScore}/100
                    </span>
                  </td>
                  <td>{emp.experience} yrs</td>
                  <td>
                    {emp.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="badge badge-skill">{skill}</span>
                    ))}
                    {emp.skills.length > 3 && <span className="badge" style={{ color: 'var(--text-muted)' }}>+{emp.skills.length - 3}</span>}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(emp._id)} className="btn btn-danger" style={{ padding: '0.4rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
