import React, { useEffect, useRef, useState } from 'react';

export default function BarcodeScanner({ onDetect }) {
  const videoRef    = useRef(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const readerRef   = useRef(null);

  useEffect(() => {
    let codeReader = null;

    const startScan = async () => {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/library');
        codeReader    = new BrowserMultiFormatReader();
        readerRef.current = codeReader;
        setScanning(true);

        await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            const text = result.getText();
            codeReader.reset();
            setScanning(false);
            onDetect(text);
          }
        });
      } catch (e) {
        setError('Camera not available. Please allow camera access or use manual input.');
        setScanning(false);
      }
    };

    startScan();

    return () => {
      if (readerRef.current) {
        try { readerRef.current.reset(); } catch (_) {}
      }
    };
  }, [onDetect]);

  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      {/* Scan frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          background: '#000',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '3px solid var(--teal)',
        }}
      >
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          aria-label="Camera viewfinder for barcode scanning"
        />
        {/* Corner decorations */}
        {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((pos) => (
          <div
            key={pos}
            style={{
              position: 'absolute',
              width: 24,
              height: 24,
              borderColor: 'var(--teal)',
              borderStyle: 'solid',
              borderWidth: 0,
              ...(pos.includes('top') ? { top: 12, borderTopWidth: 3 } : { bottom: 12, borderBottomWidth: 3 }),
              ...(pos.includes('Left') ? { left: 12, borderLeftWidth: 3 } : { right: 12, borderRightWidth: 3 }),
            }}
          />
        ))}

        {/* Pulse animation on scan line */}
        {scanning && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              height: 2,
              background: 'var(--teal)',
              animation: 'scanPulse 1.5s ease-in-out infinite',
              boxShadow: '0 0 8px var(--teal)',
            }}
          />
        )}
      </div>

      {error && (
        <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--red-light)', borderRadius: 'var(--radius-md)', color: '#B91C1C', fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      <style>{`
        @keyframes scanPulse {
          0%, 100% { transform: translateY(-8px); opacity: 0.7; }
          50% { transform: translateY(8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
