"use client";

export function PlayBackground() {
  return (
    <div className="play-bg" aria-hidden>
      <div className="play-bg-gradient" />
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="play-particle"
          style={{
            left: `${8 + (i * 7.5) % 90}%`,
            top: `${10 + ((i * 13) % 80)}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${6 + (i % 4) * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
