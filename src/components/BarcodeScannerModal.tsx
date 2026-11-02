import React, { useState } from 'react';
import { Barcode, Camera, X, Check, Loader2 } from 'lucide-react';
import { FoodItem } from '../types.ts';
import { foodDatabase } from '../data/initialData.ts';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFood: (food: FoodItem) => void;
  isDarkMode: boolean;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectFood,
  isDarkMode,
}) => {
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomFood = foodDatabase[Math.floor(Math.random() * foodDatabase.length)];
      setScannedFood(randomFood);
      setIsScanning(false);
    }, 1200);
  };

  const handleAdd = () => {
    if (scannedFood) {
      onSelectFood(scannedFood);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          id="btn-close-barcode-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <Barcode className="w-6 h-6" />
          </div>
          <h3 className="font-black text-lg">Scanner de Code-Barres</h3>
          <p className="text-xs text-slate-400">
            Pointez la caméra vers un produit alimentaire pour récupérer ses valeurs nutritionnelles.
          </p>
        </div>

        {/* Viewfinder Graphic */}
        <div className="relative h-48 bg-slate-950 rounded-2xl overflow-hidden border border-emerald-500/30 flex items-center justify-center mb-4">
          <div className="absolute inset-x-0 h-0.5 bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse top-1/2" />
          <div className="border-2 border-emerald-400/60 w-44 h-28 rounded-xl border-dashed flex items-center justify-center">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-black/40 px-2 py-1 rounded">
              {isScanning ? 'Analyse en cours...' : 'Placer le code-barres ici'}
            </span>
          </div>
        </div>

        {scannedFood ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 block">
                  Produit trouvé
                </span>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{scannedFood.name}</h4>
              </div>
              <span className="font-black text-base text-emerald-600">{scannedFood.calories} kcal</span>
            </div>

            <div className="flex justify-between text-xs text-slate-500 border-t border-emerald-100 dark:border-emerald-800/60 pt-2">
              <span>
                Protéines: <strong>{scannedFood.protein}g</strong>
              </span>
              <span>
                Glucides: <strong>{scannedFood.carbs}g</strong>
              </span>
              <span>
                Lipides: <strong>{scannedFood.fat}g</strong>
              </span>
            </div>

            <button
              id="btn-add-scanned-food"
              onClick={handleAdd}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" /> Ajouter au journal
            </button>
          </div>
        ) : (
          <button
            id="btn-trigger-barcode-scan"
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isScanning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            {isScanning ? 'Analyse du produit en cours...' : 'Détecter le code-barres du produit'}
          </button>
        )}
      </div>
    </div>
  );
};
