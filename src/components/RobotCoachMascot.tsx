import React from 'react';

interface RobotCoachMascotProps {
  size?: number | string;
  className?: string;
  waving?: boolean;
  mood?: 'happy' | 'thinking' | 'wink' | 'celebrate';
}

/**
 * RobotCoachMascot: The friendly 3D pastel robot mascot from NutriCoach
 * Features white pearlescent body, sage green antenna pods, glowing smiling digital visor,
 * and emerald heart badge on chest.
 */
export const RobotCoachMascot: React.FC<RobotCoachMascotProps> = ({
  size = 90,
  className = '',
  waving = true,
  mood = 'happy',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="NutriCoach Robot Mascot"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(31,111,67,0.12)] transition-transform hover:scale-105 duration-300"
      >
        <defs>
          {/* Head & Body White Pearl Gradient */}
          <linearGradient id="robotWhitePearl" x1="40" y1="20" x2="120" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F0F7F2" />
            <stop offset="100%" stopColor="#D9E9DE" />
          </linearGradient>

          {/* Mint Antenna Pods Gradient */}
          <linearGradient id="robotSagePod" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#1F6F43" />
          </linearGradient>

          {/* Dark Visor Gradient */}
          <linearGradient id="robotVisor" x1="50" y1="42" x2="110" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B2618" />
            <stop offset="100%" stopColor="#05150C" />
          </linearGradient>

          {/* Visor Glare */}
          <linearGradient id="robotVisorGlare" x1="45" y1="45" x2="115" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Emerald Heart Gradient */}
          <linearGradient id="robotHeart" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#1F6F43" />
          </linearGradient>

          {/* Glow filter for eyes */}
          <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soft Drop Shadow beneath */}
        <ellipse cx="80" cy="148" rx="42" ry="7" fill="#1F6F43" fillOpacity="0.12" />

        {/* --- BODY / TORSO --- */}
        <path
          d="M50 102 C50 92, 110 92, 110 102 L116 132 C116 142, 44 142, 44 132 Z"
          fill="url(#robotWhitePearl)"
          stroke="#CBE0D2"
          strokeWidth="1.5"
        />

        {/* Heart emblem on chest */}
        <g transform="translate(80, 118)">
          <path
            d="M 0 -4 C -2 -7, -7 -7, -7 -3 C -7 1, -1 5, 0 8 C 1 5, 7 1, 7 -3 C 7 -7, 2 -7, 0 -4 Z"
            fill="url(#robotHeart)"
            className="animate-pulse"
          />
        </g>

        {/* Left Arm (Relaxed) */}
        <path
          d="M45 106 C36 112, 34 126, 40 132 C43 134, 46 130, 48 124"
          fill="url(#robotWhitePearl)"
          stroke="#CBE0D2"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Right Arm (Friendly Waving) */}
        {waving ? (
          <g className="origin-[115px_110px] animate-[wiggle_2.5s_ease-in-out_infinite]">
            <path
              d="M114 105 C124 102, 134 94, 138 84 C140 79, 134 76, 128 82 C122 88, 118 96, 114 105 Z"
              fill="url(#robotWhitePearl)"
              stroke="#CBE0D2"
              strokeWidth="1.5"
            />
            {/* Hand wave palm */}
            <circle cx="136" cy="80" r="5" fill="#34D399" />
          </g>
        ) : (
          <path
            d="M115 106 C124 112, 126 126, 120 132 C117 134, 114 130, 112 124"
            fill="url(#robotWhitePearl)"
            stroke="#CBE0D2"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}

        {/* --- HEAD GROUP --- */}
        <g>
          {/* Top Antenna stalk & sphere */}
          <path d="M80 32 L80 20" stroke="#86EFAC" strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="18" r="4.5" fill="url(#robotSagePod)" />
          <circle cx="80" cy="18" r="2" fill="#FFFFFF" fillOpacity="0.8" />

          {/* Little Decorative Blooming Blossom on the Head */}
          <g transform="translate(93, 22)">
            {/* 5 Petals */}
            <circle cx="0" cy="-4.5" r="3.6" fill="#FDA4AF" />
            <circle cx="4.2" cy="-1.5" r="3.6" fill="#F43F5E" />
            <circle cx="2.6" cy="3.8" r="3.6" fill="#FB7185" />
            <circle cx="-3.4" cy="3.2" r="3.6" fill="#F43F5E" />
            <circle cx="-4.2" cy="-2.2" r="3.6" fill="#FDA4AF" />
            {/* Flower Center */}
            <circle cx="0" cy="0" r="2.4" fill="#FDE047" />
            <circle cx="0" cy="0" r="1.2" fill="#EA580C" />
          </g>

          {/* Left Ear Antenna Pod */}
          <g>
            <rect x="23" y="52" width="7" height="18" rx="3.5" fill="url(#robotSagePod)" />
            <circle cx="26.5" cy="61" r="5" fill="#1F6F43" />
            <circle cx="26.5" cy="61" r="2.5" fill="#86EFAC" />
          </g>

          {/* Right Ear Antenna Pod */}
          <g>
            <rect x="130" y="52" width="7" height="18" rx="3.5" fill="url(#robotSagePod)" />
            <circle cx="133.5" cy="61" r="5" fill="#1F6F43" />
            <circle cx="133.5" cy="61" r="2.5" fill="#86EFAC" />
          </g>

          {/* Main Head Capsule */}
          <rect
            x="28"
            y="28"
            width="104"
            height="74"
            rx="37"
            fill="url(#robotWhitePearl)"
            stroke="#CBE0D2"
            strokeWidth="1.5"
          />

          {/* Digital Screen Visor */}
          <rect
            x="40"
            y="42"
            width="80"
            height="46"
            rx="23"
            fill="url(#robotVisor)"
            stroke="#1F6F43"
            strokeWidth="1.2"
          />

          {/* Visor Glare Curve */}
          <path
            d="M48 46 C60 44, 100 44, 112 46 C105 52, 55 52, 48 46 Z"
            fill="url(#robotVisorGlare)"
          />

          {/* Cheerful Glowing Cyan-Mint Eyes */}
          {mood === 'happy' && (
            <g filter="url(#eyeGlow)">
              {/* Left Eye: Smiling Arc */}
              <path
                d="M56 65 C56 57, 68 57, 68 65"
                stroke="#6EE7B7"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Eye: Smiling Arc */}
              <path
                d="M92 65 C92 57, 104 57, 104 65"
                stroke="#6EE7B7"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {mood === 'wink' && (
            <g filter="url(#eyeGlow)">
              {/* Left Eye: Smiling Arc */}
              <path
                d="M56 65 C56 57, 68 57, 68 65"
                stroke="#6EE7B7"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Eye: Winking Line */}
              <path
                d="M92 65 L104 65"
                stroke="#6EE7B7"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {mood === 'celebrate' && (
            <g filter="url(#eyeGlow)">
              {/* Star-like Eyes */}
              <path
                d="M62 58 L62 70 M56 64 L68 64"
                stroke="#FDE047"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M98 58 L98 70 M92 64 L104 64"
                stroke="#FDE047"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {mood === 'thinking' && (
            <g filter="url(#eyeGlow)">
              <circle cx="62" cy="63" r="3.5" fill="#6EE7B7" />
              <circle cx="98" cy="63" r="3.5" fill="#6EE7B7" />
            </g>
          )}

          {/* Soft Cheeks (Blush) */}
          <ellipse cx="50" cy="73" rx="4.5" ry="2.5" fill="#34D399" fillOpacity="0.3" />
          <ellipse cx="110" cy="73" rx="4.5" ry="2.5" fill="#34D399" fillOpacity="0.3" />

          {/* Subtle Smile below eyes */}
          <path
            d="M76 75 C78 78, 82 78, 84 75"
            stroke="#6EE7B7"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};
