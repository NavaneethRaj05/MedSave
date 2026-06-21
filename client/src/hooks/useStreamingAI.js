import { useState, useCallback, useRef } from 'react';

export function useStreamingAI() {
  const [text, setText]               = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const sourceRef                     = useRef(null);

  const startStream = useCallback((medicine) => {
    if (sourceRef.current) sourceRef.current.close();
    setText('');
    setIsStreaming(true);

    const apiBase = import.meta.env.VITE_API_URL ?? '';
    const url = `${apiBase}/api/ai/stream?medicine=${encodeURIComponent(medicine || '')}`;
    const es  = new EventSource(url);
    sourceRef.current = es;

    es.onmessage = (e) => {
      if (e.data === '[DONE]') {
        setIsStreaming(false);
        es.close();
        return;
      }
      try {
        const { text: chunk } = JSON.parse(e.data);
        setText((prev) => prev + chunk);
      } catch (_) { /* ignore parse errors */ }
    };

    es.onerror = () => {
      setIsStreaming(false);
      es.close();
    };
  }, []);

  const reset = useCallback(() => {
    if (sourceRef.current) sourceRef.current.close();
    setText('');
    setIsStreaming(false);
  }, []);

  return { text, isStreaming, startStream, reset };
}
