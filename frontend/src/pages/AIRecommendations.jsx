import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Sparkles, Loader } from 'lucide-react';

const AIRecommendations = () => {
  const [employees, setEmployees] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
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
    fetchEmployees();
  }, []);

  const handleGenerateAI = async () => {
    if (employees.length === 0) return;
    setAnalyzing(true);
    setError('');
    try {
      const { data } = await api.post('/ai/recommend', { employees });
      setRecommendations(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate AI insights');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-gradient" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={28} /> AI Insights
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Generate intelligent recommendations for promotions and training.</p>
        </div>
        <button 
          onClick={handleGenerateAI} 
          disabled={analyzing || employees.length === 0}
          className="btn btn-primary"
        >
          {analyzing ? <><Loader className="animate-spin" size={18} /> Analyzing Data...</> : <><Sparkles size={18} /> Generate Insights</>}
        </button>
      </div>

      {error && <div className="error-text mb-6">{error}</div>}

      {recommendations.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {recommendations.map((rec, index) => (
            <div key={index} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{rec.employeeName}</h3>
                <span className="badge" style={{ background: 'var(--primary)' }}>Rank: {rec.rank}</span>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Promotion Recommendation</h4>
                <p style={{ fontSize: '0.95rem' }}>{rec.promotionRecommendation}</p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--success)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Training Suggestions</h4>
                <p style={{ fontSize: '0.95rem' }}>{rec.trainingSuggestions}</p>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>AI Feedback</h4>
                <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{rec.feedback}"</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <Sparkles size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Insights Yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Click the Generate Insights button above to analyze employee data using AI.</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
