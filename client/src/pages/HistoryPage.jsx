import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchHistory from '../components/history/SearchHistory';
import Spinner from '../components/ui/Spinner';
import api from '../api/axios';

export default function HistoryPage() {
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate                = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/history');
        setHistory(res.data.data || []);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = (id) => setHistory((prev) => prev.filter((h) => h._id !== id));
  const handleSearch = (q)  => navigate(`/compare?q=${encodeURIComponent(q)}`);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
        🕐 Search History
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Your last 20 medicine searches
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spinner size={40} />
        </div>
      ) : (
        <SearchHistory items={history} onDelete={handleDelete} onSearch={handleSearch} />
      )}
    </div>
  );
}
