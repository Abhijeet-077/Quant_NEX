import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';

export function NeonWave() {
  const { theme } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (theme === 'dark') {
        setPosition({ x: e.clientX, y: e.clientY });
        setIsActive(true);
        
        // Reset the timeout on each mouse move
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set a timeout to hide the effect after mouse stops moving
        timeoutRef.current = setTimeout(() => {
          if (!isClicking) {
            setIsActive(false);
          }
        }, 300);
      }
    };

    // Handle mouse click
    const handleMouseDown = () => {
      if (theme === 'dark') {
        setIsClicking(true);
        setIsActive(true);
      }
    };

    // Handle mouse release
    const handleMouseUp = () => {
      if (theme === 'dark') {
        setIsClicking(false);
        
        // Hide the effect after a delay
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          setIsActive(false);
        }, 300);
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [theme, isClicking]);

  // Only render in dark mode
  if (theme !== 'dark') {
    return null;
  }

  return (
    <div
      ref={waveRef}
      className={`neon-wave-effect ${isActive ? 'active' : ''}`}
      style={{
        left: `${position.x - 75}px`,
        top: `${position.y - 75}px`,
        transform: isClicking ? 'scale(1.5)' : 'scale(1)',
        transition: 'transform 0.3s ease, opacity 0.2s ease',
      }}
    />
  );
}
