import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Save } from 'lucide-react';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };
      await api.post('/employees', payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '600px' }}>
        <h2 className="text-gradient mb-6" style={{ fontSize: '1.8rem' }}>Add New Employee</h2>
        
        {error && <div className="error-text mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Department</label>
            <input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Skills (comma separated)</label>
            <input type="text" name="skills" className="form-input" placeholder="e.g. React, Node.js, MongoDB" value={formData.skills} onChange={handleChange} required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Performance Score (0-100)</label>
              <input type="number" name="performanceScore" min="0" max="100" className="form-input" value={formData.performanceScore} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Experience (Years)</label>
              <input type="number" name="experience" min="0" className="form-input" value={formData.experience} onChange={handleChange} required />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <Save size={18} /> Save Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
