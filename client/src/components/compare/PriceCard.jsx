import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';

const LOGO_BG = {
  govt:   '#DBEAFE',
  online: '#F3E8FF',
  local:  'var(--red-light)',
  chain:  'var(--green-light)',
  brand:  'rgba(245,158,11,0.15)',
};

const getPlatformSearchUrl = (platformName, medicineName, matchingTitle) => {
  const query = encodeURIComponent(matchingTitle || medicineName || '');
  const name = platformName.toLowerCase();
  
  if (name.includes('1mg')) {
    return `https://www.1mg.com/search/all?name=${query}`;
  }
  if (name.includes('pharmeasy')) {
    return `https://pharmeasy.in/search/all?searchTextField=${query}`;
  }
  if (name.includes('apollo')) {
    return `https://www.apollopharmacy.in/search-medicines/${query}`;
  }
  if (name.includes('medplus')) {
    return `https://www.medplusmart.com/searchCategory?searchKey=${query}`;
  }
  if (name.includes('amazon')) {
    return `https://www.amazon.in/s?k=${query}+medicine`;
  }
  if (name.includes('justdial')) {
    return `https://www.justdial.com/Search/${query}`;
  }
  if (name.includes('aushadhi') || name.includes('pmbjp')) {
    return `https://janaushadhi.gov.in/ProductDetails.aspx`;
  }
  if (name.includes('local')) {
    return `https://www.google.com/maps/search/medical+shops+near+me`;
  }
  return `https://www.google.com/search?q=${query}+buy+online`;
};

export default function PriceCard({ source, isBest, localPrice, index, medicineName }) {
  const isLocal      = source.type === 'local';
  const discPct      = source.mrp > source.price ? Math.round(((source.mrp - source.price) / source.mrp) * 100) : 0;
  const vsLocal      = localPrice && source.name !== 'Local Medical Shop' ? localPrice - source.price : 0;

  let badgeVariant = 'disc';
  let badgeText    = discPct > 0 ? `${discPct}% off MRP` : null;
  if (isBest)           { badgeVariant = 'best'; badgeText = '✓ Best Price'; }
  else if (source.type === 'govt') { badgeVariant = 'govt'; badgeText = '🏛️ Govt Scheme'; }
  else if (isLocal)     { badgeVariant = 'mrp';  badgeText = '⚠️ Often No Discount'; }

  const hasDelivery = source.deliveryCost && source.deliveryTime;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      style={{
        background: isBest ? 'rgba(34,197,94,0.08)' : isLocal ? 'rgba(239,68,68,0.08)' : 'var(--surface)',
        border: `1.5px solid ${isBest ? 'rgba(34,197,94,0.3)' : isLocal ? 'rgba(239,68,68,0.2)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
          background: LOGO_BG[source.type] || '#F3F4F6',
        }}
      >
        {source.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
            {source.name}
          </span>
          {badgeText && (
            <Badge variant={badgeVariant}>{badgeText}</Badge>
          )}
        </div>
        
        {source.matchingTitle && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Match: {source.matchingTitle}
          </div>
        )}

        <div style={{ fontSize: 11, color: hasDelivery ? 'var(--teal-muted)' : 'var(--text-dim)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          {hasDelivery ? (
            <>🚚 {source.deliveryCost} · {source.deliveryTime}</>
          ) : (
            source.note
          )}
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: isBest ? 'var(--green)' : isLocal ? 'var(--red)' : 'var(--text)',
          }}
        >
          ₹{source.price}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
          MRP ₹{source.mrp}
        </div>
        {vsLocal > 0 && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--green)',
              background: 'var(--green-light)',
              padding: '2px 7px',
              borderRadius: 6,
              marginTop: 2,
              display: 'inline-block',
            }}
          >
            Save ₹{vsLocal}
          </span>
        )}
        
        {/* Verify Store Link */}
        <a 
          href={getPlatformSearchUrl(source.name, medicineName, source.matchingTitle)} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 6,
            padding: '4px 8px',
            background: 'var(--teal-light)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--teal-muted)',
            fontSize: 10,
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--teal)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--teal-light)'; e.currentTarget.style.color = 'var(--teal-muted)'; }}
        >
          Verify Price ↗
        </a>
      </div>
    </motion.div>
  );
}
