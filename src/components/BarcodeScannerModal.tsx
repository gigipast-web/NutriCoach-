import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Barcode,
  Camera,
  X,
  Check,
  Loader2,
  Search,
  Upload,
  AlertCircle,
  RefreshCw,
  Sparkles,
  VideoOff,
} from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { FoodItem, MealType } from '../types.ts';
import { compressImageFileToDataUrl, captureVideoFrameToDataUrl } from '../utils/imageCompressor.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFood: (food: FoodItem, mealType?: MealType, portionGrams?: number) => void;
  isDarkMode: boolean;
}

interface ScannedProduct extends FoodItem {
  barcode?: string;
  brand?: string;
  nutriscore?: string;
  imageUrl?: string;
  quantityLabel?: string;
  servingGrams?: number;
  source?: 'openfoodfacts' | 'gemini-vision' | 'local';
}

function getSuggestedMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return 'petit_dejeuner';
  if (hour < 15) return 'dejeuner';
  if (hour < 18) return 'collation';
  return 'diner';
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectFood,
  isDarkMode,
}) => {
  const { language } = useLanguage();
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraStatus, setCameraStatus] = useState<'starting' | 'active' | 'unavailable' | 'paused'>('starting');
  const [portionGrams, setPortionGrams] = useState<number>(100);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(getSuggestedMealType);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const isDetectingRef = useRef<boolean>(false);

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current !== null) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const lookupBarcodeOnServer = useCallback(async (rawCode: string) => {
    const cleanCode = rawCode.replace(/\D/g, '');
    if (!/^\d{8,14}$/.test(cleanCode)) {
      setScanError('Saisissez un code-barres valide (8 à 14 chiffres, ex: 3017620422003).');
      return;
    }

    setScanError(null);
    setIsLookingUp(true);
    setManualCode(cleanCode);

    try {
      const res = await fetch(`/api/barcode/${encodeURIComponent(cleanCode)}`);
      const data = await res.json();

      if (!res.ok || !data.found || !data.product) {
        setScanError(
          data.error || `Produit non trouvé pour le code-barres ${cleanCode}. Essayez de photographier l'emballage.`
        );
        return;
      }

      const p = data.product;
      const defaultPortion = Number(p.servingGrams) > 0 ? Number(p.servingGrams) : 100;
      setScannedProduct({
        id: `barcode_${p.barcode || Date.now()}`,
        name: p.name || 'Produit scanné',
        calories: Number(p.calories) || 0,
        protein: Number(p.protein) || 0,
        carbs: Number(p.carbs) || 0,
        fat: Number(p.fat) || 0,
        servingSize: '100g',
        category: 'Produit scanné',
        barcode: p.barcode,
        brand: p.brand,
        nutriscore: p.nutriscore,
        imageUrl: p.imageUrl,
        quantityLabel: p.quantityLabel,
        servingGrams: defaultPortion,
        source: p.source || 'openfoodfacts',
      });
      setPortionGrams(defaultPortion);
      stopCamera();
      setCameraStatus('paused');
    } catch (err) {
      console.error('Barcode lookup fetch error:', err);
      setScanError('Erreur réseau lors de la recherche du produit. Réessayez dans un instant.');
    } finally {
      setIsLookingUp(false);
    }
  }, [stopCamera]);

  const scanImageWithAiFallback = useCallback(
    async (imageDataUrl: string) => {
      setScanError(null);
      setIsLookingUp(true);
      try {
        const res = await fetch('/api/ai/scan-barcode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: imageDataUrl, language }),
        });
        const data = await res.json();
        if (!res.ok || !data.found || !data.product) {
          if (data.detectedBarcode) {
            setManualCode(data.detectedBarcode);
          }
          setScanError(
            data.error ||
              "Code-barres ou étiquette nutritionnelle illisible. Rapprochez la caméra ou saisissez les chiffres."
          );
          return;
        }

        const p = data.product;
        const defaultPortion = Number(p.servingGrams) > 0 ? Number(p.servingGrams) : 100;
        setScannedProduct({
          id: `barcode_${p.barcode || Date.now()}`,
          name: p.name || 'Produit scanné',
          calories: Number(p.calories) || 0,
          protein: Number(p.protein) || 0,
          carbs: Number(p.carbs) || 0,
          fat: Number(p.fat) || 0,
          servingSize: '100g',
          category: 'Produit scanné',
          barcode: p.barcode,
          brand: p.brand,
          nutriscore: p.nutriscore,
          imageUrl: p.imageUrl,
          quantityLabel: p.quantityLabel,
          servingGrams: defaultPortion,
          source: p.source || 'gemini-vision',
        });
        setPortionGrams(defaultPortion);
        stopCamera();
        setCameraStatus('paused');
      } catch (err) {
        console.error('AI barcode scan error:', err);
        setScanError("Impossible d'analyser l'image pour le moment.");
      } finally {
        setIsLookingUp(false);
      }
    },
    [language, stopCamera]
  );

  const tryDecodeCanvas = useCallback(async (canvas: HTMLCanvasElement): Promise<string | null> => {
    // 1. Native BarcodeDetector (ultra-fast on Android Chrome / Edge)
    const NativeBarcodeDetector = (window as any).BarcodeDetector;
    if (NativeBarcodeDetector) {
      try {
        const detector = new NativeBarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf'],
        });
        const codes = await detector.detect(canvas);
        if (Array.isArray(codes) && codes.length > 0 && codes[0]?.rawValue) {
          const digits = String(codes[0].rawValue).replace(/\D/g, '');
          if (digits.length >= 8) return digits;
        }
      } catch {}
    }

    // 2. ZXing MultiFormat fallback (works on Firefox / Safari / WebViews without BarcodeDetector)
    try {
      if (!zxingReaderRef.current) {
        zxingReaderRef.current = new BrowserMultiFormatReader();
      }
      const result = zxingReaderRef.current.decodeFromCanvas(canvas);
      const text = result?.getText?.();
      if (text) {
        const digits = text.replace(/\D/g, '');
        if (digits.length >= 8) return digits;
      }
    } catch {
      // NotFoundException on frames without a barcode is normal
    }

    return null;
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraStatus('starting');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('unavailable');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraStatus('active');

      const offscreenCanvas = document.createElement('canvas');
      scanIntervalRef.current = window.setInterval(async () => {
        if (
          isDetectingRef.current ||
          !videoRef.current ||
          videoRef.current.readyState < 2 ||
          videoRef.current.videoWidth === 0
        ) {
          return;
        }

        isDetectingRef.current = true;
        try {
          const v = videoRef.current;
          const targetW = Math.min(960, v.videoWidth);
          const targetH = Math.round((v.videoHeight * targetW) / v.videoWidth);
          offscreenCanvas.width = targetW;
          offscreenCanvas.height = targetH;
          const ctx = offscreenCanvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(v, 0, 0, targetW, targetH);

          const detectedDigits = await tryDecodeCanvas(offscreenCanvas);
          if (detectedDigits) {
            try {
              navigator.vibrate?.(70);
            } catch {}
            stopCamera();
            await lookupBarcodeOnServer(detectedDigits);
          }
        } finally {
          isDetectingRef.current = false;
        }
      }, 380);
    } catch (err) {
      console.warn('Camera permission or device unavailable:', err);
      setCameraStatus('unavailable');
    }
  }, [lookupBarcodeOnServer, stopCamera, tryDecodeCanvas]);

  useEffect(() => {
    if (isOpen) {
      setScannedProduct(null);
      setScanError(null);
      setSelectedMealType(getSuggestedMealType());
      startCamera();
    } else {
      stopCamera();
      setCameraStatus('paused');
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  if (!isOpen) return null;

  const handleCaptureFrameScan = async () => {
    if (!videoRef.current || cameraStatus !== 'active') {
      fileInputRef.current?.click();
      return;
    }
    const frameDataUrl = captureVideoFrameToDataUrl(videoRef.current, 1280, 0.9);
    if (!frameDataUrl) {
      setScanError("Caméra non prête. Réessayez ou importez une photo.");
      return;
    }
    await scanImageWithAiFallback(frameDataUrl);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setScanError(null);
    setIsLookingUp(true);
    try {
      const compressedDataUrl = await compressImageFileToDataUrl(file, 1280, 0.9);

      // 1. Try local ZXing barcode decoder first (0ms network cost)
      try {
        if (!zxingReaderRef.current) {
          zxingReaderRef.current = new BrowserMultiFormatReader();
        }
        const zxingRes = await zxingReaderRef.current.decodeFromImageUrl(compressedDataUrl);
        const text = zxingRes?.getText?.();
        const digits = text ? text.replace(/\D/g, '') : '';
        if (digits.length >= 8) {
          await lookupBarcodeOnServer(digits);
          return;
        }
      } catch {
        // Fallback to Gemini Vision barcode/label reader
      }

      // 2. Fallback to Gemini Vision (reads barcode numbers OR nutrition label directly)
      await scanImageWithAiFallback(compressedDataUrl);
    } catch (err: any) {
      setScanError(err?.message || "Impossible de traiter cette image.");
      setIsLookingUp(false);
    }
  };

  const factor = Math.max(1, portionGrams) / 100;
  const computedCalories = scannedProduct ? Math.round(scannedProduct.calories * factor) : 0;
  const computedProtein = scannedProduct ? Math.round(scannedProduct.protein * factor * 10) / 10 : 0;
  const computedCarbs = scannedProduct ? Math.round(scannedProduct.carbs * factor * 10) / 10 : 0;
  const computedFat = scannedProduct ? Math.round(scannedProduct.fat * factor * 10) / 10 : 0;

  const handleAdd = () => {
    if (!scannedProduct) return;
    onSelectFood(
      {
        ...scannedProduct,
        calories: computedCalories,
        protein: computedProtein,
        carbs: computedCarbs,
        fat: computedFat,
        servingSize: `${portionGrams}g`,
      },
      selectedMealType,
      portionGrams
    );
    onClose();
  };

  const handleResetScan = () => {
    setScannedProduct(null);
    setScanError(null);
    startCamera();
  };

  const mealOptions: Array<{ type: MealType; label: string }> = [
    { type: 'petit_dejeuner', label: 'Petit-déj.' },
    { type: 'dejeuner', label: 'Déjeuner' },
    { type: 'collation', label: 'Collation' },
    { type: 'diner', label: 'Dîner' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className={`w-full max-w-md max-h-[92vh] overflow-y-auto p-5 sm:p-6 rounded-3xl border shadow-2xl relative ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-black'
        }`}
      >
        <button
          id="btn-close-barcode-modal"
          type="button"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer z-10"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1.5 mb-4 pr-6">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <Barcode className="w-6 h-6" />
          </div>
          <h3 className="font-black text-lg text-black dark:text-white">Scanner de Code-Barres</h3>
          <p className="text-xs text-black/75 dark:text-slate-300">
            Visez le code-barres avec la caméra, prenez une photo ou saisissez le numéro EAN.
          </p>
        </div>

        {/* Hidden file input for photo barcode capture */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        {!scannedProduct ? (
          <div className="space-y-3.5">
            {/* Live Camera Viewfinder */}
            <div className="relative h-52 bg-slate-950 rounded-2xl overflow-hidden border-2 border-emerald-500/40 flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover ${cameraStatus === 'active' ? 'opacity-100' : 'opacity-20'}`}
              />

              {/* Laser & Aiming Frame Overlay */}
              {cameraStatus === 'active' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-28 border-2 border-emerald-400/80 rounded-xl relative shadow-[0_0_0_999px_rgba(0,0,0,0.35)]">
                    <div className="absolute inset-x-2 h-0.5 bg-emerald-400 shadow-lg shadow-emerald-400 animate-pulse top-1/2" />
                  </div>
                  <span className="absolute bottom-2 px-2.5 py-0.5 rounded-full bg-black/65 text-[10px] font-bold text-emerald-300">
                    {isLookingUp ? 'Recherche du produit...' : 'Détection automatique active'}
                  </span>
                </div>
              )}

              {cameraStatus === 'starting' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white text-xs font-bold">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                  <span>Ouverture de la caméra...</span>
                </div>
              )}

              {cameraStatus === 'unavailable' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <VideoOff className="w-7 h-7 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    Caméra en direct indisponible ou non autorisée
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Utilisez le bouton photo ci-dessous ou saisissez les chiffres du code-barres.
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons: Capture Frame / Photo Upload */}
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-trigger-barcode-scan"
                type="button"
                onClick={handleCaptureFrameScan}
                disabled={isLookingUp}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold p-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isLookingUp ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : cameraStatus === 'active' ? (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <span>{cameraStatus === 'active' ? 'Capturer & Lire IA' : 'Prendre photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLookingUp}
                className={`font-bold p-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                    : 'bg-emerald-50 border-emerald-200 text-black hover:bg-emerald-100'
                }`}
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Photo / Galerie</span>
              </button>
            </div>

            {/* Manual Barcode Entry */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                lookupBarcodeOnServer(manualCode);
              }}
              className="space-y-1.5 pt-1"
            >
              <label className="text-[11px] font-extrabold text-black dark:text-slate-300 block">
                Ou saisir le numéro du code-barres (EAN) :
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="input-manual-barcode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 3017620422003"
                  className={`flex-1 min-w-0 px-3 py-2.5 rounded-xl border text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
                      : 'bg-slate-50 border-slate-300 text-black placeholder:text-slate-500'
                  }`}
                />
                <button
                  id="btn-search-manual-barcode"
                  type="submit"
                  disabled={isLookingUp || manualCode.length < 8}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-45 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>OK</span>
                </button>
              </div>
            </form>

            {scanError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-start gap-2 text-xs font-bold text-rose-800 dark:text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{scanError}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3.5">
            <div className="flex items-start gap-3">
              {scannedProduct.imageUrl && (
                <img
                  src={scannedProduct.imageUrl}
                  alt={scannedProduct.name}
                  className="w-14 h-14 rounded-xl object-cover border border-emerald-200 bg-white shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400">
                    {scannedProduct.source === 'gemini-vision' ? 'Reconnu par IA' : 'OpenFoodFacts'}
                  </span>
                  {scannedProduct.nutriscore && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                      Nutri-Score {scannedProduct.nutriscore}
                    </span>
                  )}
                </div>
                <h4 className="font-black text-sm text-black dark:text-white leading-snug mt-0.5">
                  {scannedProduct.name}
                </h4>
                {scannedProduct.barcode && (
                  <span className="text-[10px] font-mono text-black/65 dark:text-slate-400">
                    EAN : {scannedProduct.barcode}
                  </span>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="font-black text-lg text-emerald-700 dark:text-emerald-400 block">
                  {computedCalories} kcal
                </span>
                <span className="text-[10px] font-bold text-black/65 dark:text-slate-400">
                  pour {portionGrams}g
                </span>
              </div>
            </div>

            <div className="flex justify-between text-xs text-black dark:text-slate-200 border-t border-emerald-200/70 dark:border-emerald-800/60 pt-2.5 font-bold">
              <span>
                Protéines : <strong>{computedProtein}g</strong>
              </span>
              <span>
                Glucides : <strong>{computedCarbs}g</strong>
              </span>
              <span>
                Lipides : <strong>{computedFat}g</strong>
              </span>
            </div>

            {/* Portion Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-black dark:text-slate-200">
                <span>Quantité consommée (g) :</span>
                <input
                  type="number"
                  min={5}
                  max={2000}
                  value={portionGrams}
                  onChange={(e) => setPortionGrams(Math.max(1, parseInt(e.target.value, 10) || 100))}
                  className={`w-20 px-2 py-1 rounded-lg border text-right text-xs font-black ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-emerald-300 text-black'
                  }`}
                />
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[30, 50, 100, 150, 200].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setPortionGrams(g)}
                    className={`py-1 rounded-lg text-[11px] font-black cursor-pointer transition-all ${
                      portionGrams === g
                        ? 'bg-emerald-600 text-white'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-white text-black border border-emerald-200'
                    }`}
                  >
                    {g}g
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Type Selector */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-black dark:text-slate-200 block">
                Enregistrer dans :
              </span>
              <div className="grid grid-cols-4 gap-1">
                {mealOptions.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedMealType(opt.type)}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-black cursor-pointer transition-all truncate ${
                      selectedMealType === opt.type
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-white text-black border border-emerald-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleResetScan}
                className={`px-3 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer border ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-white border-emerald-200 text-black'
                }`}
                title="Scanner un autre produit"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                id="btn-add-scanned-food"
                type="button"
                onClick={handleAdd}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black p-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" /> Ajouter au journal ({computedCalories} kcal)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

