import React from 'react';

interface HUDProps {
  cargo: any[];
  deliveredCount: number;
}

const HUD: React.FC<HUDProps> = ({ cargo, deliveredCount }) => {
  const maxCargo = 5;
  const isFull = cargo.length >= maxCargo;

  return (
    <div className="ui-overlay">
      {/* Top Left: Cargo indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '10px 20px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <span style={{ fontSize: '1.5rem' }}>🕷️</span>
        {Array.from({ length: maxCargo }).map((_, i) => (
          <span key={i} style={{ opacity: i < cargo.length ? 1 : 0.3 }}>
            {i < cargo.length ? '🪲' : '🕸️'}
          </span>
        ))}
      </div>

      {/* Top Right: Delivered Counter */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '10px 20px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '1.2rem',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        Delivered: <span style={{ fontWeight: 'bold', color: '#81c784' }}>{deliveredCount}</span>
      </div>

      {/* Bottom Center: Full Cargo Banner */}
      {isFull && (
        <div style={{
          position: 'absolute',
          bottom: '150px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(211, 47, 47, 0.9)',
          color: 'white',
          padding: '12px 30px',
          borderRadius: '30px',
          fontSize: '1.4rem',
          fontWeight: 'bold',
          animation: 'pulse 1s infinite alternate',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap'
        }}>
          Return to nest! 🕸️
        </div>
      )}

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          from { transform: translateX(-50%) scale(1); }
          to { transform: translateX(-50%) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default HUD;
