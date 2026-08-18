import { useMemo } from 'react';

const SYMBOLS = ['×', '+', '=', '2', '3', '4', '5', '10', '×', '🔢'];

export default function FloatingNumbers() {
  const items = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      value: SYMBOLS[i % SYMBOLS.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: `${1.8 + Math.random() * 2.5}rem`,
    })), []);

  return (
    <div className="floating-numbers">
      {items.map((n, i) => (
        <span key={i} className="floating-number" style={{
          left: n.left, animationDelay: n.delay,
          animationDuration: n.duration, fontSize: n.size,
        }}>{n.value}</span>
      ))}
    </div>
  );
}
