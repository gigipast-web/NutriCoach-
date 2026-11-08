import React from 'react';

/**
 * FloralDecorations: High-fidelity botanical flowers, blooming petals, and gradient garden ornaments
 * to bring vibrant colors, warmth, and natural beauty to the NutriCoach interface.
 */

// 1. Single Blossom Flower (Cherry blossom / Fleur de cerisier / Pivoine)
export const BlossomFlower: React.FC<{
  size?: number;
  className?: string;
  palette?: 'pink' | 'golden' | 'orchid' | 'emerald';
}> = ({ size = 24, className = '', palette = 'pink' }) => {
  const gradientId = `blossom-${palette}-${Math.random().toString(36).substring(2, 7)}`;

  const palettes = {
    pink: {
      from: '#FB7185',
      mid: '#F43F5E',
      to: '#FDA4AF',
      center: '#FDE047',
      centerDot: '#EAB308',
    },
    golden: {
      from: '#FBBF24',
      mid: '#F59E0B',
      to: '#FEF08A',
      center: '#EA580C',
      centerDot: '#C2410C',
    },
    orchid: {
      from: '#C084FC',
      mid: '#A855F7',
      to: '#E9D5FF',
      center: '#F472B6',
      centerDot: '#DB2777',
    },
    emerald: {
      from: '#34D399',
      mid: '#10B981',
      to: '#A7F3D0',
      center: '#FDE047',
      centerDot: '#F59E0B',
    },
  };

  const p = palettes[palette];

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

      {/* 5 Petals */}
      <g>
        {/* Top petal */}
        <path
          d="M 50 50 C 40 20, 42 5, 50 5 C 58 5, 60 20, 50 50 Z"
          fill={`url(#${gradientId})`}
        />
        {/* Top-right petal */}
        <path
          d="M 50 50 C 75 30, 90 35, 93 45 C 96 55, 78 65, 50 50 Z"
          fill={`url(#${gradientId})`}
        />
        {/* Bottom-right petal */}
        <path
          d="M 50 50 C 75 70, 80 88, 72 94 C 64 100, 52 80, 50 50 Z"
          fill={`url(#${gradientId})`}
        />
        {/* Bottom-left petal */}
        <path
          d="M 50 50 C 35 78, 20 90, 15 80 C 10 70, 30 55, 50 50 Z"
          fill={`url(#${gradientId})`}
        />
        {/* Top-left petal */}
        <path
          d="M 50 50 C 22 45, 5 35, 10 25 C 15 15, 35 25, 50 50 Z"
          fill={`url(#${gradientId})`}
        />
      </g>

      {/* Center Pistil & Stamens */}
      <circle cx="50" cy="50" r="13" fill={p.center} />
      <circle cx="50" cy="50" r="7" fill={p.centerDot} />

      {/* Little pollen specks */}
      <circle cx="47" cy="45" r="1.5" fill="#FFFFFF" />
      <circle cx="53" cy="53" r="1.2" fill="#FFFFFF" />
    </svg>
  );
};

// 2. Corner Floral Wreath Accent (for card tops or borders)
export const CornerFloralFlourish: React.FC<{
  className?: string;
  flip?: boolean;
}> = ({ className = '', flip = false }) => {
  return (
    <div
      className={`pointer-events-none select-none absolute z-10 ${
        flip ? 'top-0 right-0 scale-x-[-1]' : 'top-0 left-0'
      } ${className}`}
    >
      <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="stemGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="petalPink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
          <linearGradient id="petalGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Delicate curving stem */}
        <path
          d="M 5 95 C 15 50, 45 20, 95 10"
          stroke="url(#stemGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Leaves */}
        <path
          d="M 30 52 C 22 42, 25 35, 38 42 C 42 46, 38 52, 30 52 Z"
          fill="#34D399"
          opacity="0.85"
        />
        <path
          d="M 60 28 C 55 18, 62 12, 72 20 C 74 24, 68 28, 60 28 Z"
          fill="#10B981"
          opacity="0.9"
        />

        {/* Small corner blossom */}
        <circle cx="20" cy="70" r="7" fill="url(#petalGold)" />
        <circle cx="20" cy="70" r="3" fill="#D97706" />

        {/* Main blossom at top */}
        <circle cx="85" cy="18" r="9" fill="url(#petalPink)" />
        <circle cx="85" cy="18" r="4" fill="#FDE047" />
      </svg>
    </div>
  );
};

// 3. Floating Petal Burst (Decorative background particles)
export const FloatingPetalsAura: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none opacity-40 dark:opacity-20 ${className}`}
    >
      {/* Petal 1 */}
      <span className="absolute top-12 left-6 text-base animate-bounce [animation-duration:6s] opacity-70">
        🌸
      </span>
      {/* Petal 2 */}
      <span className="absolute top-28 right-8 text-sm animate-pulse [animation-duration:4s] opacity-60">
        🌺
      </span>
      {/* Petal 3 */}
      <span className="absolute top-96 left-12 text-sm animate-bounce [animation-duration:8s] opacity-50">
        🌼
      </span>
      {/* Petal 4 */}
      <span className="absolute top-[480px] right-14 text-xs animate-pulse [animation-duration:5s] opacity-70">
        🌷
      </span>
      {/* Petal 5 */}
      <span className="absolute top-[750px] left-8 text-base opacity-40">
        ✨
      </span>
      {/* Petal 6 */}
      <span className="absolute top-[900px] right-6 text-sm opacity-60">
        🌸
      </span>
    </div>
  );
};

// 4. Botanical Flower Garden Banner Header Accent
export const FlowerGardenCluster: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <BlossomFlower size={20} palette="pink" />
      <BlossomFlower size={16} palette="golden" className="-ml-1" />
      <BlossomFlower size={18} palette="orchid" className="-ml-1" />
    </div>
  );
};
