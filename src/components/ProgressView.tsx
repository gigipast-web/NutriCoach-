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
} from 'lucide-react';
import { UserProfile, WeightEntry } from '../types.ts';

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

  // SVG Chart calculation
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

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

  const polylinePoints = sortedHistory.map((h, i) => `${getX(i)},${getY(h.weightKg)}`).join(' ');
  const targetY = getY(user.targetWeightKg);

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

      {/* Header bar */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
              Courbe de Poids
            </span>
            <span className="text-xs text-slate-400">Progression</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Suivi des Progrès</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total perdu :{' '}
            <strong className="text-emerald-600 font-bold">
              -{totalLost > 0 ? totalLost.toFixed(1) : 0} kg
            </strong>{' '}
            depuis le départ.
          </p>
        </div>

        <button
          id="btn-open-weighin-modal"
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Enregistrer une nouvelle pesée
        </button>
      </div>

      {/* SVG Chart Card */}
      <div
        id="weight-chart-card"
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-xs space-y-4`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            Évolution du Poids (kg)
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Cible : <strong className="text-emerald-600">{user.targetWeightKg} kg</strong>
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-h-64">
            {/* Target line */}
            <line
              x1="20"
              y1={targetY}
              x2={svgWidth - 20}
              y2={targetY}
              stroke="#10B981"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text x={svgWidth - 85} y={targetY - 6} fill="#10B981" fontSize="10" fontWeight="bold">
              Cible {user.targetWeightKg} kg
            </text>

            {/* Polyline */}
            <polyline
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />

            {/* Data points */}
            {sortedHistory.map((entry, idx) => {
              const cx = getX(idx);
              const cy = getY(entry.weightKg);
              return (
                <g key={entry.id}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="5"
                    className="fill-emerald-600 stroke-white dark:stroke-slate-900"
                    strokeWidth="2"
                  />
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    className="fill-slate-700 dark:fill-slate-200 text-[10px] font-bold"
                  >
                    {entry.weightKg}kg
                  </text>
                  <text
                    x={cx}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    className="fill-slate-400 text-[9px]"
                  >
                    {new Date(entry.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                  </text>
                </g>
              );
            })}
          </svg>
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
