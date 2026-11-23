import React, { useState } from 'react';
import {
  Droplets,
  Footprints,
  Plus,
  RefreshCw,
  Activity,
  Flame,
  Pencil,
  Trash2,
  Check,
  X,
  Watch,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, WaterData, ActivityEntry } from '../types.ts';
import { SmartwatchSyncModal } from './SmartwatchSyncModal.tsx';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { getUiTracking } from '../i18n/uiTrackingI18n.ts';

interface HydrationViewProps {
  user: UserProfile;
  water: WaterData;
  activities: ActivityEntry[];
  onAddWater: (amountMl: number) => void;
  onAddActivity: (activity: Omit<ActivityEntry, 'id'>) => void;
  onDeleteActivity?: (id: string) => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onResetTodaySteps?: () => void;
  isDarkMode: boolean;
}

export const HydrationView: React.FC<HydrationViewProps> = ({
  user,
  water,
  activities,
  onAddWater,
  onAddActivity,
  onDeleteActivity,
  onUpdateUser,
  onResetTodaySteps,
  isDarkMode,
}) => {
  const { language, locale } = useLanguage();
  const trk = getUiTracking(language);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isEditStepTargetOpen, setIsEditStepTargetOpen] = useState(false);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [newStepTarget, setNewStepTarget] = useState(user.stepTarget.toString());
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDuration, setActivityDuration] = useState('30');
  const [activityCalories, setActivityCalories] = useState('150');
  const [activitySteps, setActivitySteps] = useState('2500');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayActivities = activities.filter((a) => !a.timestamp || a.timestamp.startsWith(todayStr));
  const totalSteps = todayActivities.reduce((acc, a) => acc + a.stepsCount, 0);
  const totalCaloriesBurned = todayActivities.reduce((acc, a) => acc + a.caloriesBurned, 0);
  const targetGlasses = Math.round(user.waterTargetMl / 250);

  const formatWatchSyncLabel = (raw?: string) => {
    if (!raw) return '';
    const match = raw.match(/^(?:Aujourd'hui à|Today at)\s+(.+)$/i);
    if (match) return trk.todayAtTime(match[1]);
    return raw;
  };

  const handleQuickAddSteps = (steps: number, durationMin: number, cal: number, label: string) => {
    onAddActivity({
      title: label,
      type: 'walk',
      durationMinutes: durationMin,
      caloriesBurned: cal,
      stepsCount: steps,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveStepTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newStepTarget, 10);
    if (val && val >= 1000 && onUpdateUser) {
      onUpdateUser({ stepTarget: val });
    }
    setIsEditStepTargetOpen(false);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;

    onAddActivity({
      title: activityTitle,
      type: 'sport',
      durationMinutes: parseInt(activityDuration, 10) || 30,
      caloriesBurned: parseInt(activityCalories, 10) || 150,
      stepsCount: parseInt(activitySteps, 10) || 0,
      timestamp: new Date().toISOString(),
    });

    setActivityTitle('');
    setIsActivityModalOpen(false);
  };

  return (
    <div id="hydration-view" className="space-y-6 pb-12">
      {/* Header bar */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 px-3 py-1 rounded-full text-xs font-bold">
              {trk.wellbeingBadge}
            </span>
            <span className="text-xs text-slate-400">{trk.dailyTracking}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">{trk.hydrationTitle}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {trk.waterShort} :{' '}
            <strong className="text-sky-600 font-bold">
              {(water.amountMl / 1000).toFixed(1)}L / {(user.waterTargetMl / 1000).toFixed(1)}L
            </strong>{' '}
            • {trk.stepsShort} :{' '}
            <strong className="text-violet-600 font-bold">
              {totalSteps.toLocaleString(locale)} / {user.stepTarget.toLocaleString(locale)}
            </strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {user.connectedWatch?.connected && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold">
              <Watch className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{user.connectedWatch.brand}</span>
            </div>
          )}
          <button
            id="btn-sync-health"
            onClick={() => setIsWatchModalOpen(true)}
            className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:opacity-90 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Watch className="w-4 h-4" />
            <span>{user.connectedWatch?.connected ? trk.syncWatchShort : trk.syncMyWatch}</span>
            <RefreshCw className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* 2-Column Grid: Water & Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Card */}
        <div
          id="card-hydration-tracker"
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm space-y-5`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-500" />
              {trk.hydrationJournal}
            </h3>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 px-2.5 py-1 rounded-full">
              {trk.goalMl(user.waterTargetMl)}
            </span>
          </div>

          <div className="text-center py-4 bg-sky-50/50 dark:bg-sky-950/30 rounded-2xl border border-sky-100 dark:border-sky-900 space-y-1">
            <span className="text-4xl font-black text-sky-600 dark:text-sky-400">
              {water.glassesCount}
            </span>
            <span className="text-xs font-bold text-slate-500 block">
              {trk.outOfGlasses(targetGlasses)}
            </span>
            <span className="text-xs text-sky-600 font-semibold block">
              {trk.litersTotal((water.amountMl / 1000).toFixed(2))}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              id="btn-add-water-glass"
              onClick={() => onAddWater(250)}
              className="p-3 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-700 dark:text-sky-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Droplets className="w-5 h-5 text-sky-500" />
              {trk.addGlass250}
            </button>

            <button
              id="btn-add-water-bottle"
              onClick={() => onAddWater(500)}
              className="p-3 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-700 dark:text-sky-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Droplets className="w-5 h-5 text-sky-600" />
              {trk.addBottle500}
            </button>

            <button
              id="btn-sub-water-glass"
              onClick={() => onAddWater(-250)}
              className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isDarkMode ? 'border-slate-800 bg-slate-800 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              -250 ml
            </button>
          </div>
        </div>

        {/* Steps & Physical Activity Card */}
        <div
          id="card-activity-tracker"
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm space-y-5`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Footprints className="w-5 h-5 text-violet-500" />
              {trk.activitiesStepsTitle}
            </h3>
            <button
              id="btn-open-activity-modal"
              onClick={() => setIsActivityModalOpen(true)}
              className="bg-violet-50 hover:bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> {trk.logSportBtn}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              } text-center space-y-1.5`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{trk.todaysSteps}</span>
                {totalSteps > 0 && onResetTodaySteps && (
                  <button
                    type="button"
                    id="btn-reset-steps-morning"
                    onClick={onResetTodaySteps}
                    className="text-[10px] text-slate-400 hover:text-rose-500 font-semibold underline cursor-pointer flex items-center gap-0.5"
                    title={trk.resetStepsTitle}
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>{trk.resetToZero}</span>
                  </button>
                )}
              </div>
              <span className="text-2xl font-black text-violet-600 dark:text-violet-400 block">
                {totalSteps.toLocaleString(locale)}
              </span>

              {/* Progress bar towards daily goal */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden my-1">
                <div
                  className="bg-violet-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((totalSteps / (user.stepTarget || 10000)) * 100))}%` }}
                />
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {trk.stepsMorningNote}
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-0.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {trk.stepGoalPrefix(user.stepTarget.toLocaleString(locale))}
                </span>
                <button
                  type="button"
                  id="btn-edit-step-target"
                  onClick={() => {
                    setNewStepTarget(user.stepTarget.toString());
                    setIsEditStepTargetOpen(true);
                  }}
                  className="p-1 rounded-md text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-950/60 cursor-pointer transition-colors"
                  title={trk.editStepGoalTitle}
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              } text-center space-y-1 flex flex-col justify-center`}
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase">{trk.caloriesBurned}</span>
              <span className="text-2xl font-black text-orange-600 dark:text-orange-400 block">
                +{totalCaloriesBurned} {trk.kcal}
              </span>
              <span className="text-[10px] text-slate-400">{trk.activeBurn}</span>
            </div>
          </div>

          {/* Connected Watch Sync Banner */}
          <div
            id="banner-watch-sync"
            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-gradient-to-r from-sky-50 to-teal-50 border-sky-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
                <Watch className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5 truncate">
                  {user.connectedWatch?.connected
                    ? trk.watchPrefix(user.connectedWatch.brand)
                    : trk.watchGenericTitle}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                  {user.connectedWatch?.lastSync
                    ? trk.lastSyncPrefix(formatWatchSyncLabel(user.connectedWatch.lastSync))
                    : trk.watchSyncSub}
                </span>
              </div>
            </div>

            <button
              type="button"
              id="btn-open-watch-modal-card"
              onClick={() => setIsWatchModalOpen(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{user.connectedWatch?.connected ? trk.syncActionBtn : trk.connectActionBtn}</span>
            </button>
          </div>

          {/* Quick Step Buttons */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
              <span>{trk.quickAddSteps}</span>
              <span className="text-[10px] font-normal text-slate-400">{trk.clickDirectAdd}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="btn-quick-add-1000-steps"
                onClick={() => handleQuickAddSteps(1000, 12, 45, trk.presetSmallWalk)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs hover:border-violet-400 hover:shadow-xs active:scale-[0.98] ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-violet-300'
                    : 'bg-violet-50/70 border-violet-200 text-violet-900'
                }`}
              >
                <div className="text-sm font-black">+{(1000).toLocaleString(locale)}</div>
                <div className="text-[10px] font-medium opacity-75">~12 min • 45 {trk.kcal}</div>
              </button>

              <button
                type="button"
                id="btn-quick-add-2500-steps"
                onClick={() => handleQuickAddSteps(2500, 25, 110, trk.presetActiveWalk)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs hover:border-violet-400 hover:shadow-xs active:scale-[0.98] ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-violet-300'
                    : 'bg-violet-50/70 border-violet-200 text-violet-900'
                }`}
              >
                <div className="text-sm font-black">+{(2500).toLocaleString(locale)}</div>
                <div className="text-[10px] font-medium opacity-75">~25 min • 110 {trk.kcal}</div>
              </button>

              <button
                type="button"
                id="btn-quick-add-5000-steps"
                onClick={() => handleQuickAddSteps(5000, 50, 220, trk.presetLongWalk)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs hover:border-violet-400 hover:shadow-xs active:scale-[0.98] ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-violet-300'
                    : 'bg-violet-50/70 border-violet-200 text-violet-900'
                }`}
              >
                <div className="text-sm font-black">+{(5000).toLocaleString(locale)}</div>
                <div className="text-[10px] font-medium opacity-75">~50 min • 220 {trk.kcal}</div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {trk.loggedActivitiesCount(activities.length)}
            </h4>
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                {trk.noActivitiesToday}
              </p>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 block">
                        {act.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {act.durationMinutes} min • {act.stepsCount > 0 ? `${act.stepsCount.toLocaleString(locale)} ${trk.stepsUnit}` : trk.sportSession}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                      +{act.caloriesBurned} {trk.kcal}
                    </span>
                    {onDeleteActivity && (
                      <button
                        type="button"
                        onClick={() => onDeleteActivity(act.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                        title={trk.deleteActivityTitle}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-xl ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="font-black text-lg mb-1">{trk.addActivityModalTitle}</h3>
            <p className="text-xs text-slate-400 mb-4">
              {trk.addActivityModalSub}
            </p>

            <form onSubmit={handleSaveActivity} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">{trk.activityNameLabel}</label>
                <input
                  id="input-activity-title"
                  type="text"
                  required
                  placeholder={trk.activityNamePlaceholder}
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-sm font-medium outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">{trk.durationMinLabel}</label>
                  <input
                    id="input-activity-duration"
                    type="number"
                    value={activityDuration}
                    onChange={(e) => setActivityDuration(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-sm font-medium outline-none ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">{trk.caloriesBurnedLabel}</label>
                  <input
                    id="input-activity-calories"
                    type="number"
                    value={activityCalories}
                    onChange={(e) => setActivityCalories(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-sm font-medium outline-none ${
                      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">{trk.stepsOptionalLabel}</label>
                <input
                  id="input-activity-steps"
                  type="number"
                  value={activitySteps}
                  onChange={(e) => setActivitySteps(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-sm font-medium outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {trk.cancel}
                </button>
                <button
                  id="btn-save-activity-entry"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  {trk.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Daily Step Target Modal */}
      {isEditStepTargetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-xl ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Footprints className="w-5 h-5 text-violet-500" />
                {trk.editStepModalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditStepTargetOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label={trk.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {trk.editStepModalSub}
            </p>

            <form onSubmit={handleSaveStepTarget} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  {trk.dailyStepTargetLabel}
                </label>
                <input
                  id="input-modal-step-target"
                  type="number"
                  step="500"
                  min="1000"
                  max="50000"
                  required
                  value={newStepTarget}
                  onChange={(e) => setNewStepTarget(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-base font-extrabold outline-none ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              {/* Fast presets */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {trk.recommendedTargets}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[6000, 8000, 10000, 12000, 15000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewStepTarget(preset.toString())}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        newStepTarget === preset.toString()
                          ? 'bg-violet-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {preset.toLocaleString(locale)} {trk.stepsUnit}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditStepTargetOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {trk.cancel}
                </button>
                <button
                  id="btn-save-step-target-modal"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {trk.validateGoalBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Smartwatch & Health Sensors Sync Modal */}
      <SmartwatchSyncModal
        isOpen={isWatchModalOpen}
        onClose={() => setIsWatchModalOpen(false)}
        user={user}
        onUpdateUser={onUpdateUser || (() => {})}
        onAddActivity={onAddActivity}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
