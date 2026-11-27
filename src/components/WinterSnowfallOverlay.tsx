import React from 'react';
import { useDecor } from '../theme/DecorContext.tsx';

interface ParticleSpec {
  id: number;
  leftPercent: number;
  sizePx: number;
  durationSec: number;
  delaySec: number;
  opacity: number;
  driftPx: number;
}

const PARTICLES: ParticleSpec[] = [
  { id: 1, leftPercent: 4, sizePx: 10, durationSec: 18, delaySec: -2, opacity: 0.45, driftPx: 18 },
  { id: 2, leftPercent: 11, sizePx: 8, durationSec: 22, delaySec: -9, opacity: 0.35, driftPx: -14 },
  { id: 3, leftPercent: 17, sizePx: 13, durationSec: 20, delaySec: -5, opacity: 0.48, driftPx: 22 },
  { id: 4, leftPercent: 24, sizePx: 8, durationSec: 25, delaySec: -14, opacity: 0.3, driftPx: -16 },
  { id: 5, leftPercent: 31, sizePx: 11, durationSec: 19, delaySec: -7, opacity: 0.42, driftPx: 15 },
  { id: 6, leftPercent: 39, sizePx: 7, durationSec: 24, delaySec: -18, opacity: 0.34, driftPx: -12 },
  { id: 7, leftPercent: 46, sizePx: 12, durationSec: 21, delaySec: -3, opacity: 0.46, driftPx: 20 },
  { id: 8, leftPercent: 53, sizePx: 9, durationSec: 26, delaySec: -11, opacity: 0.32, driftPx: -18 },
  { id: 9, leftPercent: 60, sizePx: 10, durationSec: 17, delaySec: -6, opacity: 0.42, driftPx: 14 },
  { id: 10, leftPercent: 67, sizePx: 13, durationSec: 23, delaySec: -15, opacity: 0.45, driftPx: -20 },
  { id: 11, leftPercent: 74, sizePx: 8, durationSec: 20, delaySec: -4, opacity: 0.36, driftPx: 12 },
  { id: 12, leftPercent: 81, sizePx: 11, durationSec: 24, delaySec: -12, opacity: 0.44, driftPx: -15 },
  { id: 13, leftPercent: 88, sizePx: 9, durationSec: 18, delaySec: -8, opacity: 0.4, driftPx: 18 },
  { id: 14, leftPercent: 95, sizePx: 12, durationSec: 22, delaySec: -16, opacity: 0.45, driftPx: -22 },
];

export const WinterSnowfallOverlay: React.FC = () => {
  const { activeSeason } = useDecor();

  const colorClass =
    activeSeason === 'winter'
      ? 'text-sky-400/80 dark:text-sky-200/75'
      : activeSeason === 'autumn'
      ? 'text-amber-600/70 dark:text-amber-400/55'
      : activeSeason === 'summer'
      ? 'text-amber-400/70 dark:text-amber-300/55'
      : 'text-rose-400/70 dark:text-rose-300/55';

  return (
    <div
      id="seasonal-particle-overlay"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none"
    >
      {PARTICLES.map((p) => (
        <span
          key={`${activeSeason}-${p.id}`}
          className={`winter-snowflake absolute -top-6 ${colorClass} drop-shadow-2xs`}
          style={
            {
              left: `${p.leftPercent}%`,
              width: `${p.sizePx}px`,
              height: `${p.sizePx}px`,
              opacity: p.opacity,
              animationDuration: `${p.durationSec}s`,
              animationDelay: `${p.delaySec}s`,
              '--snow-drift': `${p.driftPx}px`,
            } as React.CSSProperties
          }
        >
          {activeSeason === 'winter' && (
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="2.1" fill="currentColor" />
            </svg>
          )}
          {activeSeason === 'autumn' && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2C14.5 6 19 8.5 21 11.5C18.5 13 17 14 17 17C14.5 16.5 13.5 17.5 12 21C10.5 17.5 9.5 16.5 7 17C7 14 5.5 13 3 11.5C5 8.5 9.5 6 12 2Z" />
            </svg>
          )}
          {activeSeason === 'summer' && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <circle cx="12" cy="12" r="4.5" opacity="0.85" />
              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
            </svg>
          )}
          {activeSeason === 'spring' && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 3C16.5 6 18 11.5 14.5 16.5C12.5 19.3 9.5 19.5 8 17C6 13.5 7.5 7 12 3Z" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
};
