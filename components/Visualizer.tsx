import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  isActive: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ isActive }) => {
  const barsRef = useRef<HTMLDivElement[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        barsRef.current.forEach(bar => {
            if (bar) bar.style.height = '4px';
        });
        return;
    }

    const animate = () => {
      barsRef.current.forEach(bar => {
        if (bar) {
          // Generowanie losowej wysokości dla efektu "mówienia"
          const height = Math.random() * 24 + 4;
          bar.style.height = `${height}px`;
        }
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  return (
    <div className="flex items-center justify-center space-x-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) barsRef.current[i] = el; }}
          className={`w-1.5 bg-red-500 rounded-full transition-all duration-75 ${isActive ? 'animate-pulse' : ''}`}
          style={{ height: '4px' }}
        />
      ))}
    </div>
  );
};

export default Visualizer;