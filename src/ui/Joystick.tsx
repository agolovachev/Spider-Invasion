import React, { useState, useRef, useEffect } from 'react';

interface JoystickProps {
  onMove: (dx: number, dy: number) => void;
}

const Joystick: React.FC<JoystickProps> = ({ onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);

  const radius = 80;
  const knobRadius = 30;

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    handleMove(clientX, clientY);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !baseRef.current) return;

    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;

    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > radius) {
      dx = (dx / dist) * radius;
      dy = (dy / dist) * radius;
    }

    setKnobPos({ x: dx, y: dy });
    onMove(dx / radius, dy / radius);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging]);

  return (
    <div 
      className="joystick-container ui-element"
      style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      <div
        ref={baseRef}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${knobRadius * 2}px`,
            height: `${knobRadius * 2}px`,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.8)',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(${-knobRadius + knobPos.x}px, ${-knobRadius + knobPos.y}px)`,
            cursor: 'grab',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}
        />
      </div>
    </div>
  );
};

export default Joystick;
