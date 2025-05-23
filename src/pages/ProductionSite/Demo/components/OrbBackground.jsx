// Create: ./pages/ProductionSite/Demo/components/OrbBackground.jsx
import React from 'react';

const Orb = ({ hoverIntensity, rotateOnHover, hue, forceHoverState }) => {
  return (
    <div className="orb-container">
      <div 
        className={`orb ${forceHoverState ? 'active' : ''}`}
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `radial-gradient(circle, hsl(${hue}, 70%, 60%), hsl(${hue}, 50%, 40%))`,
          animation: forceHoverState ? 'pulse 2s infinite' : 'none'
        }}
      />
    </div>
  );
};

export default Orb;