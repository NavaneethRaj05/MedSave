import { useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export function useAIAdvisor() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const analyse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/ai/advisor');
      setData(res.data.data);
      toast.success('Analysis complete!', { style: { background: '#0D9488', color: '#fff' } });
    } catch (err) {
      const msg = err.response?.data?.error || 'AI analysis failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, analyse };
}
