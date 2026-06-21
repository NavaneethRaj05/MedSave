import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [searchHistory, setSearchHistory] = useState([]);
  const [lastSearch, setLastSearch]       = useState('');
  const [sessionId, setSessionId]         = useState('');

  useEffect(() => {
    // Ensure sessionId exists
    let sid = localStorage.getItem('medsave_session');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('medsave_session', sid);
    }
    setSessionId(sid);
  }, []);

  const addToHistory = (entry) => {
    setSearchHistory((prev) => [entry, ...prev.slice(0, 19)]);
  };

  return (
    <AppContext.Provider value={{ searchHistory, addToHistory, lastSearch, setLastSearch, sessionId }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
