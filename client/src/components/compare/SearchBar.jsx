import React, { useState } from 'react';
import Chip from '../ui/Chip';

const QUICK_CHIPS = [
  'Paracetamol 500mg',
  'Metformin 500mg',
  'Atorvastatin 10mg',
  'Azithromycin 500mg',
  'Omeprazole 20mg',
];

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div style={{ padding: '16px 16px 0' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          id="medicine-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="e.g. Paracetamol 500mg, Metformin…"
          aria-label="Search for a medicine"
          style={{
            flex: 1,
            border: '2px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '13px 16px',
            fontSize: 15,
            fontFamily: 'var(--font-body)',
            background: 'var(--surface)',
            color: 'var(--text)',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
        <button
          id="medicine-search-btn"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          aria-label="Search medicine prices"
          style={{
            background: 'var(--teal)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '13px 20px',
            fontSize: 15,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
            whiteSpace: 'nowrap',
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => !loading && (e.target.style.background = 'var(--teal-dark)')}
          onMouseLeave={(e) => (e.target.style.background = 'var(--teal)')}
        >
          {loading ? '…' : 'Search'}
        </button>
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {QUICK_CHIPS.map((chip) => (
          <Chip
            key={chip}
            onClick={() => { setQuery(chip); onSearch(chip); }}
          >
            {chip}
          </Chip>
        ))}
      </div>
    </div>
  );
}
