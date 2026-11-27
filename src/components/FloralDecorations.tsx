import React, { useId } from 'react';
import { useDecor } from '../theme/DecorContext.tsx';

/**
 * FloralDecorations: High-fidelity seasonal botanical ornaments.
 * Automatically adapts to Spring, Summer, Autumn, or Winter based on hemisphere & season.
 */

export const BlossomFlower: React.FC<{
  size?: number;
  className?: string;
  palette?: 'pink' | 'golden' | 'orchid' | 'emerald';
}> = ({ size = 24, className = '', palette = 'pink' }) => {
  const { activeSeason } = useDecor();
  const uid = useId().replace(/:/g, '');
  const gradientId = `blossom-${palette}-${uid}`;

  if (activeSeason === 'winter') {
    const winterPalettes = {
      pink: { from: '#7DD3FC', mid: '#38BDF8', to: '#E0F2FE', center: '#FFFFFF', centerDot: '#0284C7' },
      golden: { from: '#CBD5E1', mid: '#94A3B8', to: '#F8FAFC', center: '#BAE6FD', centerDot: '#0369A1' },
      orchid: { from: '#93C5FD', mid: '#60A5FA', to: '#EFF6FF', center: '#E0F2FE', centerDot: '#2563EB' },
      emerald: { from: '#5EEAD4', mid: '#2DD4BF', to: '#CCFBF1', center: '#F0FDFA', centerDot: '#0F766E' },
    };
    const wp = winterPalettes[palette];
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={`shrink-0 drop-shadow-xs ${className}`}>
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={wp.to} />
            <stop offset="65%" stopColor={wp.mid} />
            <stop offset="100%" stopColor={wp.from} />
          </radialGradient>
        </defs>
        <g>
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path
              key={angle}
              transform={`rotate(${angle} 50 50)`}
              d="M 50 50 C 42 26, 44 10, 50 6 C 56 10, 58 26, 50 50 Z"
              fill={`url(#${gradientId})`}
            />
          ))}
        </g>
        <circle cx="50" cy="50" r="11" fill={wp.center} />
        <circle cx="50" cy="50" r="5" fill={wp.centerDot} />
      </svg>
    );
  }

  const seasonalPalettes =
    activeSeason === 'autumn'
      ? {
          pink: { from: '#EA580C', mid: '#C2410C', to: '#FDBA74', center: '#FEF08A', centerDot: '#B45309' },
          golden: { from: '#F59E0B', mid: '#D97706', to: '#FDE68A', center: '#78350F', centerDot: '#451A03' },
          orchid: { from: '#DC2626', mid: '#B91C1C', to: '#FCA5A5', center: '#FDE047', centerDot: '#CA8A04' },
          emerald: { from: '#84CC16', mid: '#65A30D', to: '#D9F99D', center: '#FEF08A', centerDot: '#A16207' },
        }
      : activeSeason === 'summer'
      ? {
          pink: { from: '#FACC15', mid: '#EAB308', to: '#FEF9C3', center: '#EA580C', centerDot: '#9A3412' },
          golden: { from: '#F59E0B', mid: '#D97706', to: '#FEF08A', center: '#FFFFFF', centerDot: '#CA8A04' },
          orchid: { from: '#A78BFA', mid: '#8B5CF6', to: '#EDE9FE', center: '#FDE047', centerDot: '#D97706' },
          emerald: { from: '#34D399', mid: '#10B981', to: '#A7F3D0', center: '#FEF08A', centerDot: '#F59E0B' },
        }
      : {
          pink: { from: '#FB7185', mid: '#F43F5E', to: '#FDA4AF', center: '#FDE047', centerDot: '#EAB308' },
          golden: { from: '#FBBF24', mid: '#F59E0B', to: '#FEF08A', center: '#EA580C', centerDot: '#C2410C' },
          orchid: { from: '#C084FC', mid: '#A855F7', to: '#E9D5FF', center: '#F472B6', centerDot: '#DB2777' },
          emerald: { from: '#34D399', mid: '#10B981', to: '#A7F3D0', center: '#FDE047', centerDot: '#F59E0B' },
        };

  const p = seasonalPalettes[palette];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-xs ${className}`}
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.to} />
          <stop offset="70%" stopColor={p.mid} />
          <stop offset="100%" stopColor={p.from} />
        </radialGradient>
      </defs>
      <g>
        <path d="M 50 50 C 40 20, 42 5, 50 5 C 58 5, 60 20, 50 50 Z" fill={`url(#${gradientId})`} />
        <path d="M 50 50 C 75 30, 90 35, 93 45 C 96 55, 78 65, 50 50 Z" fill={`url(#${gradientId})`} />
        <path d="M 50 50 C 75 70, 80 88, 72 94 C 64 100, 52 80, 50 50 Z" fill={`url(#${gradientId})`} />
        <path d="M 50 50 C 35 78, 20 90, 15 80 C 10 70, 30 55, 50 50 Z" fill={`url(#${gradientId})`} />
        <path d="M 50 50 C 22 45, 5 35, 10 25 C 15 15, 35 25, 50 50 Z" fill={`url(#${gradientId})`} />
      </g>
      <circle cx="50" cy="50" r="13" fill={p.center} />
      <circle cx="50" cy="50" r="7" fill={p.centerDot} />
      <circle cx="47" cy="45" r="1.5" fill="#FFFFFF" />
      <circle cx="53" cy="53" r="1.2" fill="#FFFFFF" />
    </svg>
  );
};

export const CornerFloralFlourish: React.FC<{
  className?: string;
  flip?: boolean;
}> = ({ className = '', flip = false }) => {
  const { activeSeason } = useDecor();
  const uid = useId().replace(/:/g, '');

  const colors =
    activeSeason === 'winter'
      ? { stemA: '#0F766E', stemB: '#38BDF8', leafA: '#94A3B8', leafB: '#5EEAD4', orbA: '#E0F2FE', orbB: '#38BDF8', dot: '#0284C7' }
      : activeSeason === 'autumn'
      ? { stemA: '#9A3412', stemB: '#D97706', leafA: '#F59E0B', leafB: '#EA580C', orbA: '#FDE68A', orbB: '#DC2626', dot: '#78350F' }
      : activeSeason === 'summer'
      ? { stemA: '#15803D', stemB: '#65A30D', leafA: '#84CC16', leafB: '#22C55E', orbA: '#FEF08A', orbB: '#F59E0B', dot: '#A78BFA' }
      : { stemA: '#10B981', stemB: '#047857', leafA: '#34D399', leafB: '#10B981', orbA: '#FDA4AF', orbB: '#F43F5E', dot: '#FDE047' };

  return (
    <div
      className={`pointer-events-none select-none absolute z-10 ${
        flip ? 'top-0 right-0 scale-x-[-1]' : 'top-0 left-0'
      } ${className}`}
    >
      <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={`stem-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.stemA} />
            <stop offset="100%" stopColor={colors.stemB} />
          </linearGradient>
          <linearGradient id={`orb-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.orbA} />
            <stop offset="100%" stopColor={colors.orbB} />
          </linearGradient>
        </defs>
        <path d="M 5 95 C 15 50, 45 20, 95 10" stroke={`url(#stem-${uid})`} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M 30 52 C 22 42, 25 35, 38 42 C 42 46, 38 52, 30 52 Z" fill={colors.leafA} opacity="0.85" />
        <path d="M 60 28 C 55 18, 62 12, 72 20 C 74 24, 68 28, 60 28 Z" fill={colors.leafB} opacity="0.9" />
        <circle cx="20" cy="70" r="6.5" fill={`url(#orb-${uid})`} />
        <circle cx="20" cy="70" r="2.8" fill={colors.dot} />
        <circle cx="85" cy="18" r="8.5" fill={`url(#orb-${uid})`} />
        <circle cx="85" cy="18" r="3.5" fill={colors.dot} />
      </svg>
    </div>
  );
};

export const FloatingPetalsAura: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { activeSeason } = useDecor();

  const icons =
    activeSeason === 'winter'
      ? ['❄️', '🌲', '❄️', '✨', '❄️', '🌲']
      : activeSeason === 'autumn'
      ? ['🍁', '🍂', '🌰', '✨', '🍁', '🍂']
      : activeSeason === 'summer'
      ? ['🍋', '🌿', '☀️', '✨', '🫒', '🌼']
      : ['🌸', '🌺', '🌼', '🌷', '✨', '🌸'];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none opacity-40 dark:opacity-20 ${className}`}
    >
      <span className="absolute top-12 left-6 text-base animate-pulse [animation-duration:5s] opacity-75">{icons[0]}</span>
      <span className="absolute top-28 right-8 text-sm animate-pulse [animation-duration:4s] opacity-65">{icons[1]}</span>
      <span className="absolute top-96 left-12 text-sm animate-pulse [animation-duration:6s] opacity-55">{icons[2]}</span>
      <span className="absolute top-[480px] right-14 text-xs animate-pulse [animation-duration:5s] opacity-70">{icons[3]}</span>
      <span className="absolute top-[750px] left-8 text-base opacity-45">{icons[4]}</span>
      <span className="absolute top-[900px] right-6 text-sm opacity-60">{icons[5]}</span>
    </div>
  );
};

export const FlowerGardenCluster: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <BlossomFlower size={20} palette="pink" />
      <BlossomFlower size={16} palette="golden" className="-ml-1" />
      <BlossomFlower size={18} palette="orchid" className="-ml-1" />
    </div>
  );
};
