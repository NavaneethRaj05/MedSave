import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import LandingPage  from './pages/LandingPage';
import ComparePage  from './pages/ComparePage';
import AdvisorPage  from './pages/AdvisorPage';
import ScannerPage  from './pages/ScannerPage';
import HistoryPage  from './pages/HistoryPage';
import AlertsPage   from './pages/AlertsPage';
import ChatBot      from './components/chatbot/ChatBot';

export default function App() {
  return (
    <AppProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          success: { style: { background: '#0D9488', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '13px' } },
          error:   { style: { background: '#EF4444', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '13px' } },
          duration: 3000,
        }}
      />
      <Routes>
        {/* Landing page — no Layout wrapper, full-screen 3D */}
        <Route path="/" element={<LandingPage />} />

        {/* App pages — wrapped in Layout with dark nav + bottom nav */}
        <Route path="/compare"  element={<Layout><ComparePage /></Layout>} />
        <Route path="/advisor"  element={<Layout><AdvisorPage /></Layout>} />
        <Route path="/scanner"  element={<Layout><ScannerPage /></Layout>} />
        <Route path="/history"  element={<Layout><HistoryPage /></Layout>} />
        <Route path="/alerts"   element={<Layout><AlertsPage /></Layout>} />
      </Routes>

      {/* Floating chatbot on all pages */}
      <ChatBot />
    </AppProvider>
  );
}
