"use client";

export function WatermarkOverlay() {
  const items = Array.from({ length: 20 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {items.map((_, i) => (
        <div
          key={i}
          className="absolute text-white font-bold text-sm tracking-widest whitespace-nowrap select-none"
          style={{
            opacity: 0.35,
            transform: `rotate(-45deg)`,
            top: `${(i % 5) * 22 - 10}%`,
            left: `${Math.floor(i / 5) * 30 - 15}%`,
            letterSpacing: "0.2em",
          }}
        >
          HEROMINT PREVIEW
        </div>
      ))}
    </div>
  );
}
