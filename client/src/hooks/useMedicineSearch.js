import { useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export function useMedicineSearch() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const search = useCallback(async (query) => {
    if (!query || !query.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await api.get(`/medicine/search?q=${encodeURIComponent(query.trim())}`);
      setData(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to fetch price data. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setData(null); setError(null); }, []);

  return { data, loading, error, search, reset };
}
