import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingDown,
  Plus,
  Camera,
  History,
  CheckCircle2,
  Upload,
  Trash2,
  ArrowLeftRight,
  Sparkles,
  X,
  Maximize2,
  Scale,
  Calendar,
  Image as ImageIcon,
  BarChart3,
  LineChart,
  Palette,
  Trophy,
  Zap,
  Award,
  Flag,
  Droplets,
} from 'lucide-react';
import { UserProfile, WeightEntry } from '../types.ts';
import {
  BlossomFlower,
  CornerFloralFlourish,
  FlowerGardenCluster,
} from './FloralDecorations.tsx';

interface ProgressViewProps {
  user: UserProfile;
  weightHistory: WeightEntry[];
  onAddWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  isDarkMode: boolean;
}

interface ProgressPhotoItem {
  url: string;
  date: string;
  weightKg: number;
}

interface ProgressPhotosState {
  before: ProgressPhotoItem | null;
  after: ProgressPhotoItem | null;
}

/**
 * Compresses an uploaded image file on the client using HTML5 Canvas
 * so that it stores safely in localStorage without bloating memory
 */
const compressImage = (file: File, maxWidth = 800, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Erreur de lecture de l’image'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsDataURL(file);
  });
};

export const ProgressView: React.FC<ProgressViewProps> = ({
  user,
  weightHistory,
  onAddWeightEntry,
  isDarkMode,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(user.currentWeightKg.toString());
  const [newWaist, setNewWaist] = useState('80');
  const [newNote, setNewNote] = useState('');
  const [evolutionTab, setEvolutionTab] = useState<'poids' | 'calories' | 'hydratation'>('poids');

  // Comparison Photo State with localStorage persistence
  const [photos, setPhotos] = useState<ProgressPhotosState>(() => {
    try {
      const saved = localStorage.getItem('nutricoach_progress_photos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved progress photos from storage', e);
    }
    return { before: null, after: null };
  });

  // Comparison display mode: 'cards' (side-by-side) or 'split' (interactive slider)
  const [comparisonMode, setComparisonMode] = useState<'cards' | 'split'>('cards');
  const [splitPosition, setSplitPosition] = useState(50); // percentage 0 - 100
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);

  // Hidden file inputs
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const sortedHistory = [...weightHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const startWeight = user.startWeightKg;
  const currentWeight = user.currentWeightKg;
  const totalLost = startWeight - currentWeight;

  // Persist photos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('nutricoach_progress_photos', JSON.stringify(photos));
    } catch (e) {
      console.error('LocalStorage error saving progress photos', e);
    }
  }, [photos]);

  const handleFileUpload = async (type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'before') setIsUploadingBefore(true);
    else setIsUploadingAfter(true);

    try {
      const compressedDataUrl = await compressImage(file, 800, 0.82);
      setPhotos((prev) => ({
        ...prev,
        [type]: {
          url: compressedDataUrl,
          date:
            type === 'before'
              ? sortedHistory[0]?.date || '2026-06-01'
              : sortedHistory[sortedHistory.length - 1]?.date ||
                new Date().toISOString().split('T')[0],
          weightKg:
            type === 'before'
              ? sortedHistory[0]?.weightKg || user.startWeightKg
              : currentWeight,
        },
      }));
    } catch (err) {
      console.error('Erreur compression image:', err);
      alert("Impossible de charger l'image. Veuillez essayer un autre fichier.");
    } finally {
      if (type === 'before') setIsUploadingBefore(false);
      else setIsUploadingAfter(false);
      // Reset input value so re-selecting the same file triggers onChange
      e.target.value = '';
    }
  };

  const handleDeletePhoto = (type: 'before' | 'after') => {
    setPhotos((prev) => ({
      ...prev,
      [type]: null,
    }));
    if (comparisonMode === 'split') {
      setComparisonMode('cards');
    }
  };

  const handleLoadDemoPhotos = () => {
    setPhotos({
      before: {
        url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
        date: sortedHistory[0]?.date || '2026-06-01',
        weightKg: sortedHistory[0]?.weightKg || startWeight,
      },
      after: {
        url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
        date: new Date().toISOString().split('T')[0],
        weightKg: currentWeight,
      },
    });
  };

  // Interactive slider touch/mouse drag handlers
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const posPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitPosition(posPercent);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    handleSliderMove(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    handleSliderMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightVal = parseFloat(newWeight);
    if (!weightVal) return;

    onAddWeightEntry({
      date: new Date().toISOString().split('T')[0],
      weightKg: weightVal,
      waistCm: newWaist ? parseFloat(newWaist) : undefined,
      note: newNote || undefined,
    });

    setNewNote('');
    setIsModalOpen(false);
  };

  // Chart visual theme and interactive states
  const [chartTheme, setChartTheme] = useState<'aurora' | 'sunset' | 'electric'>(() => {
    return (localStorage.getItem('nutricoach_chart_theme') as any) || 'aurora';
  });
  const [chartMode, setChartMode] = useState<'spline' | 'bars'>('spline');
  const [hoveredEntryIndex, setHoveredEntryIndex] = useState<number | null>(null);

  const handleSelectTheme = (theme: 'aurora' | 'sunset' | 'electric') => {
    setChartTheme(theme);
    localStorage.setItem('nutricoach_chart_theme', theme);
  };

  // SVG Chart calculation
  const svgWidth = 650;
  const svgHeight = 260;
  const paddingX = 45;
  const paddingY = 40;

  const weights = sortedHistory.map((h) => h.weightKg).concat(user.targetWeightKg);
  const minWeight = Math.floor(Math.min(...weights) - 1);
  const maxWeight = Math.ceil(Math.max(...weights) + 1);

  const getX = (index: number) => {
    if (sortedHistory.length <= 1) return svgWidth / 2;
    return paddingX + (index / (sortedHistory.length - 1)) * (svgWidth - 2 * paddingX);
  };

  const getY = (w: number) => {
    return (
      svgHeight -
      paddingY -
      ((w - minWeight) / (maxWeight - minWeight || 1)) * (svgHeight - 2 * paddingY)
    );
  };

  const targetY = getY(user.targetWeightKg);
  const chartPoints = sortedHistory.map((h, i) => ({
    x: getX(i),
    y: getY(h.weightKg),
    entry: h,
    index: i,
  }));

  // Cubic Bezier Spline generation for buttery smooth curve
  const generateSmoothSpline = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    if (pts.length === 2) {
      return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
    }
    let path = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const smoothSplinePath = generateSmoothSpline(chartPoints);
  const splineAreaPath = chartPoints.length > 0
    ? `${smoothSplinePath} L ${chartPoints[chartPoints.length - 1].x.toFixed(1)} ${svgHeight - paddingY + 10} L ${chartPoints[0].x.toFixed(1)} ${svgHeight - paddingY + 10} Z`
    : '';

  // Theme palettes configuration
  const themeConfig = {
    aurora: {
      id: 'aurora',
      name: 'Aurore Boréale',
      stroke: 'url(#aurora-stroke)',
      fill: 'url(#aurora-fill)',
      glowColor: '#06B6D4',
      badgeGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      activeBorder: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40',
      stops: [
        { offset: '0%', color: '#10B981' },
        { offset: '50%', color: '#06B6D4' },
        { offset: '100%', color: '#6366F1' },
      ],
      pointFill: '#06B6D4',
    },
    sunset: {
      id: 'sunset',
      name: 'Sunset Glow',
      stroke: 'url(#sunset-stroke)',
      fill: 'url(#sunset-fill)',
      glowColor: '#F43F5E',
      badgeGradient: 'from-amber-400 via-rose-500 to-purple-600',
      activeBorder: 'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40',
      stops: [
        { offset: '0%', color: '#F59E0B' },
        { offset: '50%', color: '#F43F5E' },
        { offset: '100%', color: '#8B5CF6' },
      ],
      pointFill: '#F43F5E',
    },
    electric: {
      id: 'electric',
      name: 'Cyber Néon',
      stroke: 'url(#electric-stroke)',
      fill: 'url(#electric-fill)',
      glowColor: '#84CC16',
      badgeGradient: 'from-lime-400 via-teal-400 to-blue-500',
      activeBorder: 'border-lime-500 text-lime-600 dark:text-lime-400 bg-lime-50/80 dark:bg-lime-950/40',
      stops: [
        { offset: '0%', color: '#84CC16' },
        { offset: '50%', color: '#14B8A6' },
        { offset: '100%', color: '#3B82F6' },
      ],
      pointFill: '#84CC16',
    },
  }[chartTheme];

  // Weight records & statistics
  const minWeightEntry = sortedHistory.reduce((prev, curr) => (curr.weightKg < prev.weightKg ? curr : prev), sortedHistory[0] || { weightKg: currentWeight });
  const maxWeightEntry = sortedHistory.reduce((prev, curr) => (curr.weightKg > prev.weightKg ? curr : prev), sortedHistory[0] || { weightKg: currentWeight });
  const remainingToGoal = Math.max(0, currentWeight - user.targetWeightKg);
  const goalProgressPercent = Math.min(100, Math.max(0, Math.round(((startWeight - currentWeight) / (startWeight - user.targetWeightKg || 1)) * 100)));

  // Grid steps (horizontal lines)
  const gridStep = maxWeight - minWeight > 6 ? 2 : 1;
  const gridWeights: number[] = [];
  for (let w = Math.ceil(minWeight); w <= Math.floor(maxWeight); w += gridStep) {
    gridWeights.push(w);
  }

  const activeEntry = hoveredEntryIndex !== null ? sortedHistory[hoveredEntryIndex] : null;

  const hasBothPhotos = !!(photos.before && photos.after);

  return (
    <div id="progress-view" className="space-y-6 pb-12">
      {/* Hidden file inputs for photo upload */}
      <input
        type="file"
        ref={beforeInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload('before', e)}
      />
      <input
        type="file"
        ref={afterInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload('after', e)}
      />

      {/* 1. Header bar with title "Mon évolution", Calendar icon & Blossom (Screen 2) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 flex items-center justify-center text-[#163321] dark:text-emerald-300 font-bold shadow-xs">
            ‹
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#163321] dark:text-white tracking-tight">
              Mon évolution
            </h1>
            <BlossomFlower size={22} palette="orchid" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 flex items-center justify-center text-[#1F6F43] dark:text-emerald-400 hover:bg-[#EAF3EA] transition-all cursor-pointer shadow-xs"
          title="Calendrier des pesées & nouvelle pesée"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Toggle Tabs: [Poids] [Calories] [Hydratation] with Radiant Gradients */}
      <div className="flex items-center gap-2 max-w-md">
        <button
          type="button"
          onClick={() => setEvolutionTab('poids')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
            evolutionTab === 'poids'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-[#E3ECE2] text-[#5A7363] hover:bg-[#D5E4D5]'
          }`}
        >
          Poids
        </button>
        <button
          type="button"
          onClick={() => setEvolutionTab('calories')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
            evolutionTab === 'calories'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
              : 'bg-[#E3ECE2] text-[#5A7363] hover:bg-[#D5E4D5]'
          }`}
        >
          Calories
        </button>
        <button
          type="button"
          onClick={() => setEvolutionTab('hydratation')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
            evolutionTab === 'hydratation'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'bg-[#E3ECE2] text-[#5A7363] hover:bg-[#D5E4D5]'
          }`}
        >
          Hydratation
        </button>
      </div>

      {/* 3. Pastel Minimalist Weight Chart (Screen 2) */}
      {evolutionTab === 'poids' && (
        <div
          id="pastel-weight-curve-card"
          className={`p-5 sm:p-6 rounded-[28px] border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
          } shadow-[0_4px_24px_rgba(31,111,67,0.04)] relative overflow-hidden`}
        >
          {/* Subtle horizontal grid lines & SVG curve */}
          <div className="relative w-full h-56 pt-2 pb-6">
            <svg viewBox="0 0 400 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="pastelGreenLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1F6F43" />
                  <stop offset="100%" stopColor="#2E8B57" />
                </linearGradient>
              </defs>

              {/* Grid Lines (72, 70, 68, 66, 64) */}
              {[
                { val: 72, y: 20 },
                { val: 70, y: 55 },
                { val: 68, y: 90 },
                { val: 66, y: 125 },
                { val: 64, y: 160 },
              ].map((grid) => (
                <g key={grid.val}>
                  <text
                    x="20"
                    y={grid.y + 4}
                    fill="#94A3B8"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="end"
                  >
                    {grid.val}
                  </text>
                  <line
                    x1="35"
                    y1={grid.y}
                    x2="390"
                    y2={grid.y}
                    stroke="#EDF3ED"
                    strokeWidth="1.2"
                  />
                </g>
              ))}

              {/* X Axis Labels (S1, S2, S3, S4) */}
              {[
                { label: 'S1', x: 50 },
                { label: 'S2', x: 155 },
                { label: 'S3', x: 260 },
                { label: 'S4', x: 365 },
              ].map((item) => (
                <text
                  key={item.label}
                  x={item.x}
                  y="178"
                  fill="#94A3B8"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {item.label}
                </text>
              ))}

              {/* The Smooth Green Weight Curve connecting S1..S4 */}
              {/* S1: 71.5kg (y: 29), S2: 70kg (y: 55), S3: 68kg (y: 90), S4: 67.5kg (y: 99) */}
              <path
                d="M 50 29 C 100 35, 120 52, 155 55 C 205 60, 220 85, 260 90 C 300 95, 330 98, 365 99"
                fill="none"
                stroke="url(#pastelGreenLine)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Points on S1, S2, S3, S4 */}
              <circle cx="50" cy="29" r="4.5" fill="#1F6F43" />
              <circle cx="155" cy="55" r="4.5" fill="#1F6F43" />
              <circle cx="260" cy="90" r="4.5" fill="#1F6F43" />
              <circle cx="365" cy="99" r="5" fill="#1F6F43" />
            </svg>

            {/* Floating Pill on S4: 67,5 kg (Screen 2) */}
            <div className="absolute right-3 top-16 bg-[#1F6F43] text-white px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1 animate-pulse">
              <span>{currentWeight.toFixed(1).replace('.', ',')} kg</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Trophy Milestone Card (Screen 2) with Sunset Coral & Gold Gradient */}
      <div
        id="milestone-trophy-card"
        className="p-5 rounded-[26px] bg-gradient-to-r from-[#FFF7E8] via-[#FFF0DB] to-[#FFE4E6] dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-4 shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base sm:text-lg font-black text-[#8A5800] dark:text-amber-300">
                Bravo !
              </h3>
              <BlossomFlower size={16} palette="golden" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#A76D00] dark:text-amber-400">
              - {totalLost > 0 ? totalLost.toFixed(1).replace('.', ',') : '2,5'} kg depuis le début
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-2xl select-none">
          <span>🌸</span>
          <span>🎉</span>
        </div>
      </div>

      {/* 5. Vos objectifs (Screen 2) */}
      <div
        id="goals-rings-card"
        className={`p-6 rounded-[28px] border relative overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-[#122218] border-slate-800'
            : 'bg-gradient-to-br from-white via-[#FCFDFB] to-[#F5F9F6] border-[#E2ECE2]'
        } shadow-[0_4px_24px_rgba(31,111,67,0.05)] space-y-4`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#163321] dark:text-white">
              Vos objectifs
            </h2>
            <FlowerGardenCluster />
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-[#5A7363] dark:text-slate-400 hover:text-[#1F6F43] flex items-center gap-0.5 cursor-pointer"
          >
            Voir tout ›
          </button>
        </div>

        {/* 3 Circular Goal Rings (Screen 2) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          {/* Ring 1: Poids -5 kg */}
          <div className="flex flex-col items-center">
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#EAEFEA" strokeWidth="6" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="6"
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * 60) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Flag className="w-3.5 h-3.5 text-[#10B981] mb-0.5" />
                <span className="text-[11px] font-black text-[#163321] dark:text-white leading-none">
                  - 5 kg
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#5A7363] dark:text-slate-400 mt-2 block">
              sur 8 semaines
            </span>
          </div>

          {/* Ring 2: Streak 5 jours */}
          <div className="flex flex-col items-center">
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#EAEFEA" strokeWidth="6" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * 80) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-amber-500 text-xs mb-0.5">★</span>
                <span className="text-[11px] font-black text-[#163321] dark:text-white leading-none">
                  5 jours
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#5A7363] dark:text-slate-400 mt-2 block">
              série active
            </span>
          </div>

          {/* Ring 3: Eau 2 L */}
          <div className="flex flex-col items-center">
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#EAEFEA" strokeWidth="6" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="6"
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * 75) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="w-3.5 h-3.5 text-cyan-600 mb-0.5" />
                <span className="text-[11px] font-black text-[#163321] dark:text-white leading-none">
                  2 L
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#5A7363] dark:text-slate-400 mt-2 block">
              d'eau / jour
            </span>
          </div>
        </div>
      </div>

      {/* 6. Encouragement Banner with Sprout & Flowers (Screen 2) */}
      <div
        id="sprout-encouragement-banner"
        className="p-4 rounded-2xl bg-gradient-to-r from-[#E6EFE6] via-[#EAF5EC] to-[#F1F9F3] dark:from-emerald-950/40 dark:to-teal-950/30 border border-[#D5E4D5] dark:border-emerald-800/60 flex items-center justify-between gap-3 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl shrink-0 select-none">🌱</span>
          <p className="text-xs sm:text-sm font-bold text-[#1F6F43] dark:text-emerald-300">
            Vous êtes sur la bonne voie ! Continuez, vous y arriverez 💚
          </p>
        </div>
        <span className="text-xl select-none">🌸</span>
      </div>

      {/* Action CTA: Enregistrer une nouvelle pesée with Rich Gradient */}
      <div className="flex justify-center pt-1">
        <button
          id="btn-open-weighin-modal-pastel"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Enregistrer une nouvelle pesée</span>
          <span className="text-sm">🌸</span>
        </button>
      </div>

      {/* Vibrant Modern Chart Card */}
      <div
        id="weight-chart-card"
        className={`p-4 sm:p-7 rounded-2xl sm:rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-5 overflow-hidden`}
      >
        {/* Chart Card Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${themeConfig.badgeGradient} text-white flex items-center justify-center shadow-xs shrink-0`}>
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Évolution Graphique du Poids
              </h3>
              <p className="text-[11px] text-slate-400 font-bold">
                Objectif visé : <span className="text-emerald-600 dark:text-emerald-400 font-black">{user.targetWeightKg} kg</span>
              </p>
            </div>
          </div>

          {/* Controls: Chart Mode (Spline vs Bars) & Color Theme Selector - 100% Mobile 9:16 Safe */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Chart Mode Toggle */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setChartMode('spline')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  chartMode === 'spline'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border-emerald-500/70 shadow-xs ring-1 ring-emerald-400/40'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                title="Courbe fluide et lumineuse"
              >
                <LineChart className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">Courbe</span>
              </button>
              <button
                type="button"
                onClick={() => setChartMode('bars')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  chartMode === 'bars'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border-cyan-500/70 shadow-xs ring-1 ring-cyan-400/40'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                title="Histogramme coloré"
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span className="truncate">Barres</span>
              </button>
            </div>

            {/* Theme Selector Pill Group */}
            <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => handleSelectTheme('aurora')}
                className={`px-2 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                  chartTheme === 'aurora'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300/80 ring-2 ring-emerald-400/40 shadow-xs'
                    : 'border-emerald-500/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-emerald-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 shrink-0 inline-block" />
                <span className="truncate">Aurore</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTheme('sunset')}
                className={`px-2 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                  chartTheme === 'sunset'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-rose-300/80 ring-2 ring-rose-400/40 shadow-xs'
                    : 'border-rose-500/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-rose-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-300 shrink-0 inline-block" />
                <span className="truncate">Sunset</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTheme('electric')}
                className={`px-2 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                  chartTheme === 'electric'
                    ? 'bg-gradient-to-r from-lime-500 to-blue-500 text-white border-lime-300/80 ring-2 ring-lime-400/40 shadow-xs'
                    : 'border-lime-500/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-lime-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-lime-300 shrink-0 inline-block" />
                <span className="truncate">Néon</span>
              </button>
            </div>
          </div>
        </div>


        {/* Hover inspection pill banner */}
        {activeEntry && (
          <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {new Date(activeEntry.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              {activeEntry.note && (
                <span className="text-slate-500 italic text-[11px]">« {activeEntry.note} »</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold">Pesée :</span>
                <span className="text-sm font-black text-slate-800 dark:text-white">{activeEntry.weightKg} kg</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold">Évolution :</span>
                <span className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                  activeEntry.weightKg <= startWeight
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {activeEntry.weightKg <= startWeight ? `-${(startWeight - activeEntry.weightKg).toFixed(1)} kg` : `+${(activeEntry.weightKg - startWeight).toFixed(1)} kg`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SVG Drawing Canvas */}
        <div className="w-full overflow-x-auto select-none pt-1">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px] max-h-72">
            <defs>
              {/* Aurora Theme Gradients */}
              <linearGradient id="aurora-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
              <linearGradient id="aurora-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.38" />
                <stop offset="50%" stopColor="#10B981" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>

              {/* Sunset Theme Gradients */}
              <linearGradient id="sunset-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="sunset-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.38" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
              </linearGradient>

              {/* Electric Neon Theme Gradients */}
              <linearGradient id="electric-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#84CC16" />
                <stop offset="50%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="electric-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#84CC16" stopOpacity="0.38" />
                <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>

              {/* Bar Gradients */}
              <linearGradient id="bar-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={themeConfig.stops[0].color} stopOpacity="0.95" />
                <stop offset="60%" stopColor={themeConfig.stops[1].color} stopOpacity="0.75" />
                <stop offset="100%" stopColor={themeConfig.stops[2].color} stopOpacity="0.45" />
              </linearGradient>

              {/* Glow Drop Shadow Filter */}
              <filter id="chart-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor={themeConfig.glowColor} floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Horizontal Grid lines & scale labels */}
            {gridWeights.map((val) => {
              const yPos = getY(val);
              return (
                <g key={`grid-${val}`}>
                  <line
                    x1={paddingX - 10}
                    y1={yPos}
                    x2={svgWidth - 20}
                    y2={yPos}
                    stroke={isDarkMode ? '#334155' : '#E2E8F0'}
                    strokeDasharray="4 4"
                    strokeWidth="1"
                    strokeOpacity={isDarkMode ? '0.45' : '0.8'}
                  />
                  <text
                    x={paddingX - 16}
                    y={yPos + 3.5}
                    textAnchor="end"
                    className="text-[10px] font-bold fill-slate-400 select-none"
                  >
                    {val}kg
                  </text>
                </g>
              );
            })}

            {/* Target Weight Reference Line with Badge */}
            <g>
              <line
                x1={paddingX - 10}
                y1={targetY}
                x2={svgWidth - 20}
                y2={targetY}
                stroke="#10B981"
                strokeDasharray="6 4"
                strokeWidth="2"
                strokeOpacity="0.85"
              />
              <rect
                x={svgWidth - 118}
                y={targetY - 10}
                width="104"
                height="20"
                rx="10"
                fill={isDarkMode ? '#064e3b' : '#ecfdf5'}
                stroke="#10B981"
                strokeWidth="1.2"
              />
              <text
                x={svgWidth - 66}
                y={targetY + 3.5}
                textAnchor="middle"
                fill="#10B981"
                fontSize="9.5"
                fontWeight="900"
              >
                🎯 CIBLE {user.targetWeightKg} KG
              </text>
            </g>

            {/* RENDERING MODE: Smooth Spline Curve */}
            {chartMode === 'spline' && (
              <>
                {/* Luminous Area Fill under spline */}
                <path
                  d={splineAreaPath}
                  fill={themeConfig.fill}
                  className="transition-all duration-500 ease-out"
                />

                {/* Spline Path with Gradient & Glow Filter */}
                <path
                  d={smoothSplinePath}
                  fill="none"
                  stroke={themeConfig.stroke}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#chart-glow)"
                  className="transition-all duration-500 ease-out"
                />

                {/* Data Points on curve */}
                {chartPoints.map((pt) => {
                  const isHovered = hoveredEntryIndex === pt.index;
                  const isLowest = pt.entry.id === minWeightEntry?.id;
                  const isLatest = pt.index === chartPoints.length - 1;

                  return (
                    <g
                      key={`point-${pt.entry.id}`}
                      className="cursor-pointer transition-transform"
                      onMouseEnter={() => setHoveredEntryIndex(pt.index)}
                      onMouseLeave={() => setHoveredEntryIndex(null)}
                      onClick={() => setHoveredEntryIndex(pt.index)}
                    >
                      {/* Active Beacon Pulse on latest entry */}
                      {isLatest && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="12"
                          fill={themeConfig.stops[1].color}
                          fillOpacity="0.25"
                          className="animate-ping"
                        />
                      )}

                      {/* Lowest weight marker badge */}
                      {isLowest && (
                        <g transform={`translate(${pt.x - 14}, ${pt.y - 28})`}>
                          <rect
                            width="28"
                            height="16"
                            rx="8"
                            fill="#F59E0B"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="shadow-sm"
                          />
                          <text
                            x="14"
                            y="11"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="900"
                          >
                            MIN
                          </text>
                        </g>
                      )}

                      {/* Outer Ring */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? '8' : isLowest ? '7' : '5.5'}
                        fill={isHovered ? '#ffffff' : themeConfig.stops[1].color}
                        stroke={isHovered ? themeConfig.stops[1].color : '#ffffff'}
                        strokeWidth={isHovered ? '3.5' : '2'}
                        className="transition-all duration-200 shadow-sm"
                      />

                      {/* Weight Label above point */}
                      <text
                        x={pt.x}
                        y={pt.y - (isLowest ? 32 : 11)}
                        textAnchor="middle"
                        className={`text-[10.5px] font-black select-none ${
                          isHovered
                            ? 'fill-emerald-600 dark:fill-emerald-400 font-black'
                            : 'fill-slate-700 dark:fill-slate-200'
                        }`}
                      >
                        {pt.entry.weightKg}kg
                      </text>

                      {/* Date label at bottom */}
                      <text
                        x={pt.x}
                        y={svgHeight - 12}
                        textAnchor="middle"
                        className={`text-[9.5px] font-bold select-none ${
                          isHovered ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-slate-400'
                        }`}
                      >
                        {new Date(pt.entry.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {/* RENDERING MODE: Stylized Modern Bars */}
            {chartMode === 'bars' && (
              <>
                {chartPoints.map((pt) => {
                  const barWidth = Math.min(36, Math.max(16, (svgWidth - 2 * paddingX) / (chartPoints.length * 1.5)));
                  const barHeight = Math.max(4, svgHeight - paddingY - pt.y);
                  const isHovered = hoveredEntryIndex === pt.index;
                  const isLowest = pt.entry.id === minWeightEntry?.id;

                  return (
                    <g
                      key={`bar-${pt.entry.id}`}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredEntryIndex(pt.index)}
                      onMouseLeave={() => setHoveredEntryIndex(null)}
                      onClick={() => setHoveredEntryIndex(pt.index)}
                    >
                      {/* Bar Rectangle with Rounded Top Caps */}
                      <rect
                        x={pt.x - barWidth / 2}
                        y={pt.y}
                        width={barWidth}
                        height={barHeight}
                        rx="7"
                        fill="url(#bar-gradient)"
                        opacity={isHovered ? 1 : 0.88}
                        stroke={isHovered ? '#ffffff' : 'none'}
                        strokeWidth="2"
                        className="transition-all duration-200 hover:brightness-110"
                      />

                      {/* Top neon cap */}
                      <rect
                        x={pt.x - barWidth / 2}
                        y={pt.y}
                        width={barWidth}
                        height="4"
                        rx="2"
                        fill={isHovered ? '#ffffff' : themeConfig.stops[0].color}
                      />

                      {/* Min record badge */}
                      {isLowest && (
                        <g transform={`translate(${pt.x - 14}, ${pt.y - 22})`}>
                          <rect
                            width="28"
                            height="14"
                            rx="7"
                            fill="#F59E0B"
                            stroke="#ffffff"
                            strokeWidth="1.2"
                          />
                          <text
                            x="14"
                            y="10"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="8"
                            fontWeight="900"
                          >
                            MIN
                          </text>
                        </g>
                      )}

                      {/* Weight value above bar */}
                      <text
                        x={pt.x}
                        y={pt.y - (isLowest ? 24 : 7)}
                        textAnchor="middle"
                        className={`text-[10px] font-black select-none ${
                          isHovered
                            ? 'fill-emerald-600 dark:fill-emerald-400 font-black'
                            : 'fill-slate-700 dark:fill-slate-200'
                        }`}
                      >
                        {pt.entry.weightKg}kg
                      </text>

                      {/* Date label at bottom */}
                      <text
                        x={pt.x}
                        y={svgHeight - 12}
                        textAnchor="middle"
                        className={`text-[9.5px] font-bold select-none ${
                          isHovered ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-slate-400'
                        }`}
                      >
                        {new Date(pt.entry.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>

        {/* Bottom Chart Footer Legend */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-[11px] sm:text-xs pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 inline-block shrink-0" />
              <span>Courbe lissée</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500 inline-block shrink-0" />
              <span>Cible ({user.targetWeightKg} kg)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 text-white flex items-center justify-center text-[7px] font-black shrink-0">★</span>
              <span>Record bas</span>
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 italic">Touchez un point pour inspecter</span>
        </div>
      </div>

      {/* 2-Column: Avant/Après & Historique */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Avant / Après Card - FULLY FUNCTIONAL */}
        <div
          id="photo-comparison-card"
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-xs space-y-4`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              Photos Avant / Après
            </h3>

            {/* Mode switch & Demo helper */}
            <div className="flex items-center gap-2">
              {hasBothPhotos && (
                <button
                  type="button"
                  onClick={() => setComparisonMode(comparisonMode === 'cards' ? 'split' : 'cards')}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer hover:bg-emerald-100"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{comparisonMode === 'cards' ? 'Mode Curseur ↔' : 'Vue Côte à Côte'}</span>
                </button>
              )}

              {hasBothPhotos && (
                <button
                  type="button"
                  onClick={() => setIsFullscreenModalOpen(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Plein écran"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparez visuellement votre silhouette pour mesurer l'impact réel de vos efforts.
          </p>

          {/* Interactive Split View Slider when toggled */}
          {comparisonMode === 'split' && hasBothPhotos && photos.before && photos.after ? (
            <div className="space-y-3">
              <div
                ref={sliderContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchMove={handleTouchMove}
                className="relative w-full h-80 rounded-2xl overflow-hidden cursor-ew-resize select-none border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-950"
              >
                {/* AFTER image (Background layer) */}
                <img
                  src={photos.after.url}
                  alt="Après"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-3 right-3 bg-emerald-600/90 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
                  ACTUEL ({photos.after.weightKg} kg)
                </div>

                {/* BEFORE image (Clipped foreground layer) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${splitPosition}%` }}
                >
                  <img
                    src={photos.before.url}
                    alt="Avant"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{
                      width: sliderContainerRef.current?.clientWidth || '100%',
                      maxWidth: 'none',
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
                    AVANT ({photos.before.weightKg} kg)
                  </div>
                </div>

                {/* Vertical Divider line & draggable handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
                  style={{ left: `${splitPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-800 shadow-xl flex items-center justify-center font-black text-xs border-2 border-emerald-500">
                    ⬌
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Glissez le curseur de gauche à droite pour comparer</span>
                <span className="font-bold text-emerald-600">
                  -{(photos.before.weightKg - photos.after.weightKg).toFixed(1)} kg d'écart
                </span>
              </div>
            </div>
          ) : (
            /* Cards Side-by-Side View */
            <div className="grid grid-cols-2 gap-3">
              {/* Slot 1: AVANT */}
              <div
                className={`p-3.5 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      AVANT
                    </span>
                    {photos.before && (
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto('before')}
                        className="text-slate-400 hover:text-rose-500 p-0.5 rounded-md transition-colors"
                        title="Supprimer la photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {photos.before ? (
                    <div className="relative w-full h-44 rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-700">
                      <img
                        src={photos.before.url}
                        alt="Photo de départ"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => beforeInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-xs font-bold"
                      >
                        <Upload className="w-4 h-4" />
                        Changer la photo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id="btn-upload-before-photo"
                      onClick={() => beforeInputRef.current?.click()}
                      disabled={isUploadingBefore}
                      className="w-full h-44 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-slate-800/80 hover:bg-emerald-50/50 dark:hover:bg-slate-800 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-3 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 mb-2 transition-colors">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                        {isUploadingBefore ? 'Chargement...' : 'Ajouter photo'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Galerie ou appareil
                      </span>
                    </button>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100 block">
                    {photos.before?.weightKg || sortedHistory[0]?.weightKg || startWeight} kg
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {photos.before?.date || sortedHistory[0]?.date || 'Date de départ'}
                  </span>
                </div>
              </div>

              {/* Slot 2: ACTUEL / APRÈS */}
              <div
                className={`p-3.5 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      ACTUEL
                    </span>
                    {photos.after && (
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto('after')}
                        className="text-slate-400 hover:text-rose-500 p-0.5 rounded-md transition-colors"
                        title="Supprimer la photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {photos.after ? (
                    <div className="relative w-full h-44 rounded-xl overflow-hidden group border border-emerald-200 dark:border-emerald-800">
                      <img
                        src={photos.after.url}
                        alt="Photo actuelle"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => afterInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-xs font-bold"
                      >
                        <Upload className="w-4 h-4" />
                        Changer la photo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id="btn-upload-after-photo"
                      onClick={() => afterInputRef.current?.click()}
                      disabled={isUploadingAfter}
                      className="w-full h-44 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 hover:border-emerald-500 bg-white dark:bg-slate-800/80 hover:bg-emerald-50/50 dark:hover:bg-slate-800 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-3 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 transition-colors">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                        {isUploadingAfter ? 'Chargement...' : 'Ajouter photo'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Photo récente
                      </span>
                    </button>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                    {photos.after?.weightKg || currentWeight} kg
                  </span>
                  <span className="text-[10px] text-emerald-600/80 font-bold block">
                    -{totalLost > 0 ? totalLost.toFixed(1) : 0} kg perdus !
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Test Buttons */}
          <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              🔒 Vos photos restent 100% privées sur votre appareil.
            </span>
            {!hasBothPhotos && (
              <button
                type="button"
                onClick={handleLoadDemoPhotos}
                className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                Charger des photos d'exemple
              </button>
            )}
          </div>
        </div>

        {/* Historique des Pesées Card */}
        <div
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-xs space-y-4`}
        >
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            Historique des Pesées
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {sortedHistory
              .slice()
              .reverse()
              .map((entry) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 block">
                      {new Date(entry.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    {entry.note && (
                      <span className="text-[11px] text-slate-400 block italic">"{entry.note}"</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                      {entry.weightKg} kg
                    </span>
                    {entry.waistCm && (
                      <span className="text-[10px] text-slate-400 block">Taille : {entry.waistCm} cm</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Weigh-in Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-xl ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="font-black text-lg mb-1">Nouvelle pesée</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enregistrez votre poids et tour de taille pour mettre à jour vos graphiques.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Poids (kg) *</label>
                <input
                  id="input-new-weight-kg"
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm font-bold outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Tour de taille (cm - optionnel)</label>
                <input
                  id="input-new-waist-cm"
                  type="number"
                  step="0.5"
                  value={newWaist}
                  onChange={(e) => setNewWaist(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm font-medium outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Note personnelle</label>
                <input
                  id="input-new-weight-note"
                  type="text"
                  placeholder="ex: Pesée à jeun du matin"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm font-medium outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  id="btn-save-new-weight-entry"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Comparison Modal */}
      {isFullscreenModalOpen && photos.before && photos.after && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className={`w-full max-w-2xl p-6 rounded-3xl border shadow-2xl relative ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-xl flex items-center gap-2">
                  <span>Transformation Corporelle</span>
                  <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                    -{totalLost.toFixed(1)} kg perdus
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  De {photos.before.weightKg} kg à {photos.after.weightKg} kg
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreenModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-center">
                <div className="aspect-3/4 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-black">
                  <img src={photos.before.url} alt="Avant" className="w-full h-full object-cover" />
                </div>
                <span className="font-extrabold text-sm block">AVANT ({photos.before.weightKg} kg)</span>
                <span className="text-xs text-slate-400">{photos.before.date}</span>
              </div>
              <div className="space-y-2 text-center">
                <div className="aspect-3/4 rounded-2xl overflow-hidden border border-emerald-500 bg-black">
                  <img src={photos.after.url} alt="Actuel" className="w-full h-full object-cover" />
                </div>
                <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 block">
                  ACTUEL ({photos.after.weightKg} kg)
                </span>
                <span className="text-xs text-slate-400">{photos.after.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
