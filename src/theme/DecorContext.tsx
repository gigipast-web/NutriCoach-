import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Hemisphere = 'north' | 'south';
export type DecorMode = 'auto' | Season;
export type HemisphereSource = 'gps' | 'timezone' | 'manual';

interface DecorContextValue {
  decorMode: DecorMode;
  setDecorMode: (mode: DecorMode) => void;
  activeSeason: Season;
  hemisphere: Hemisphere;
  hemisphereSource: HemisphereSource;
  setHemisphereManual: (hemisphere: Hemisphere) => void;
  detectHemisphereFromGps: () => Promise<{ ok: boolean; hemisphere?: Hemisphere; latitude?: number; error?: string }>;
  isDetectingGps: boolean;
  isWinter: boolean;
}

const STORAGE_MODE_KEY = 'nutricoach_decor_mode';
const STORAGE_HEMI_KEY = 'nutricoach_hemisphere';
const STORAGE_HEMI_SRC_KEY = 'nutricoach_hemisphere_source';

const SOUTH_TZ_PREFIXES = [
  'Australia/',
  'Antarctica/',
];

const SOUTH_TZ_EXACT = new Set([
  'Pacific/Auckland',
  'Pacific/Chatham',
  'Pacific/Fiji',
  'Pacific/Tahiti',
  'Pacific/Tongatapu',
  'Pacific/Apia',
  'Pacific/Noumea',
  'Pacific/Port_Moresby',
  'Pacific/Rarotonga',
  'Pacific/Easter',
  'Indian/Mauritius',
  'Indian/Reunion',
  'Indian/Antananarivo',
  'Indian/Mayotte',
  'Africa/Johannesburg',
  'Africa/Harare',
  'Africa/Maputo',
  'Africa/Windhoek',
  'Africa/Lusaka',
  'Africa/Gaborone',
  'Africa/Maseru',
  'Africa/Mbabane',
  'Africa/Blantyre',
  'Africa/Lubumbashi',
  'Africa/Kinshasa',
  'Africa/Luanda',
  'America/Buenos_Aires',
  'America/Sao_Paulo',
  'America/Rio_Branco',
  'America/Manaus',
  'America/Santiago',
  'America/Montevideo',
  'America/Asuncion',
  'America/La_Paz',
  'America/Lima',
  'America/Recife',
  'America/Fortaleza',
  'America/Bahia',
  'America/Belem',
  'America/Cuiaba',
  'America/Campo_Grande',
  'America/Porto_Velho',
  'America/Mendoza',
  'America/Cordoba',
  'America/Punta_Arenas',
]);

export function inferHemisphereFromTimezone(): Hemisphere {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (
      SOUTH_TZ_PREFIXES.some((p) => tz.startsWith(p)) ||
      tz.startsWith('America/Argentina/') ||
      SOUTH_TZ_EXACT.has(tz)
    ) {
      return 'south';
    }
  } catch {
    // Ignore Intl errors
  }
  return 'north';
}

export function getSeasonForDateAndHemisphere(date: Date, hemisphere: Hemisphere): Season {
  const month = date.getMonth(); // 0 = Jan ... 11 = Dec
  let northSeason: Season;
  if (month === 11 || month === 0 || month === 1) {
    northSeason = 'winter';
  } else if (month >= 2 && month <= 4) {
    northSeason = 'spring';
  } else if (month >= 5 && month <= 7) {
    northSeason = 'summer';
  } else {
    northSeason = 'autumn';
  }

  if (hemisphere === 'north') return northSeason;

  switch (northSeason) {
    case 'winter':
      return 'summer';
    case 'summer':
      return 'winter';
    case 'spring':
      return 'autumn';
    case 'autumn':
      return 'spring';
  }
}

const DecorContext = createContext<DecorContextValue>({
  decorMode: 'auto',
  setDecorMode: () => {},
  activeSeason: 'autumn',
  hemisphere: 'north',
  hemisphereSource: 'timezone',
  setHemisphereManual: () => {},
  detectHemisphereFromGps: async () => ({ ok: false }),
  isDetectingGps: false,
  isWinter: false,
});

export const DecorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [decorMode, setDecorModeState] = useState<DecorMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MODE_KEY);
      if (saved === 'auto' || saved === 'spring' || saved === 'summer' || saved === 'autumn' || saved === 'winter') {
        return saved;
      }
      // Migrate older single-flag preference if present
      const legacy = localStorage.getItem('nutricoach_decor');
      if (legacy === 'classic') return 'spring';
      if (legacy === 'winter') return 'auto';
      return 'auto';
    } catch {
      return 'auto';
    }
  });

  const [hemisphere, setHemisphere] = useState<Hemisphere>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HEMI_KEY);
      if (saved === 'north' || saved === 'south') return saved;
    } catch {
      // Ignore
    }
    return inferHemisphereFromTimezone();
  });

  const [hemisphereSource, setHemisphereSource] = useState<HemisphereSource>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HEMI_SRC_KEY);
      if (saved === 'gps' || saved === 'timezone' || saved === 'manual') return saved;
    } catch {
      // Ignore
    }
    return 'timezone';
  });

  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const activeSeason: Season =
    decorMode === 'auto'
      ? getSeasonForDateAndHemisphere(new Date(), hemisphere)
      : decorMode;

  const isWinter = activeSeason === 'winter';

  const applyHemisphere = useCallback((nextHemi: Hemisphere, src: HemisphereSource) => {
    setHemisphere(nextHemi);
    setHemisphereSource(src);
    try {
      localStorage.setItem(STORAGE_HEMI_KEY, nextHemi);
      localStorage.setItem(STORAGE_HEMI_SRC_KEY, src);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const detectHemisphereFromGps = useCallback(async (): Promise<{
    ok: boolean;
    hemisphere?: Hemisphere;
    latitude?: number;
    error?: string;
  }> => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      const fallback = inferHemisphereFromTimezone();
      applyHemisphere(fallback, 'timezone');
      return { ok: false, hemisphere: fallback, error: 'geolocation_unsupported' };
    }

    setIsDetectingGps(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const detected: Hemisphere = lat >= 0 ? 'north' : 'south';
          applyHemisphere(detected, 'gps');
          setDecorModeState('auto');
          try {
            localStorage.setItem(STORAGE_MODE_KEY, 'auto');
          } catch {
            // Ignore
          }
          setIsDetectingGps(false);
          resolve({ ok: true, hemisphere: detected, latitude: lat });
        },
        (err) => {
          setIsDetectingGps(false);
          resolve({ ok: false, error: err?.message || 'permission_denied' });
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 3600000 }
      );
    });
  }, [applyHemisphere]);

  // Silently refresh hemisphere via GPS on launch only if geolocation permission was already granted
  useEffect(() => {
    if (
      typeof navigator === 'undefined' ||
      !navigator.permissions ||
      !navigator.geolocation ||
      hemisphereSource === 'manual'
    ) {
      return;
    }

    let cancelled = false;
    navigator.permissions
      .query({ name: 'geolocation' as PermissionName })
      .then((status) => {
        if (!cancelled && status.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              if (!cancelled) {
                const detected: Hemisphere = pos.coords.latitude >= 0 ? 'north' : 'south';
                applyHemisphere(detected, 'gps');
              }
            },
            () => {},
            { enableHighAccuracy: false, timeout: 6000, maximumAge: 3600000 }
          );
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [applyHemisphere, hemisphereSource]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MODE_KEY, decorMode);
    } catch {
      // Ignore
    }
    if (typeof document !== 'undefined') {
      document.body.classList.remove('season-spring', 'season-summer', 'season-autumn', 'season-winter', 'winter-decor');
      document.body.classList.add(`season-${activeSeason}`);
      if (activeSeason === 'winter') {
        document.body.classList.add('winter-decor');
      }
    }
  }, [decorMode, activeSeason]);

  const setDecorMode = (mode: DecorMode) => {
    setDecorModeState(mode);
  };

  const setHemisphereManual = (hemi: Hemisphere) => {
    applyHemisphere(hemi, 'manual');
    setDecorModeState('auto');
  };

  return (
    <DecorContext.Provider
      value={{
        decorMode,
        setDecorMode,
        activeSeason,
        hemisphere,
        hemisphereSource,
        setHemisphereManual,
        detectHemisphereFromGps,
        isDetectingGps,
        isWinter,
      }}
    >
      {children}
    </DecorContext.Provider>
  );
};

export const useDecor = () => useContext(DecorContext);
