import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  X,
} from 'lucide-react';
import { UserProfile } from '../types.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { getUiAuthBilling } from '../i18n/uiAuthBillingI18n.ts';
import { getUiCore } from '../i18n/uiCoreI18n.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userUpdates: Partial<UserProfile>) => void;
  isDarkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isDarkMode,
}) => {
  const { language } = useLanguage();
  const ab = getUiAuthBilling(language);
  const uiCore = getUiCore(language);
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 fields - all empty by default
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Step 2 fields - all empty by default
  const [sex, setSex] = useState<'femme' | 'homme' | ''>('');
  const [age, setAge] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [currentWeightKg, setCurrentWeightKg] = useState<string>('');
  const [targetWeightKg, setTargetWeightKg] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel'] | ''>('');

  React.useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setAgreeTerms(false);
      setSex('');
      setAge('');
      setHeightCm('');
      setCurrentWeightKg('');
      setTargetWeightKg('');
      setActivityLevel('');
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      setStep(2);
    } else {
      // Login
      onSuccess({
        name: name.trim() || ab.userFallback,
        email: email.trim(),
        isLoggedIn: true,
      });
      onClose();
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      name: name.trim() || ab.userFallback,
      email: email.trim(),
      isLoggedIn: true,
      sex: sex === 'homme' ? 'homme' : 'femme',
      age: age ? Number(age) : 30,
      heightCm: heightCm ? Number(heightCm) : 170,
      currentWeightKg: currentWeightKg ? Number(currentWeightKg) : 70,
      targetWeightKg: targetWeightKg ? Number(targetWeightKg) : (currentWeightKg ? Number(currentWeightKg) : 65),
      activityLevel: (activityLevel as UserProfile['activityLevel']) || 'moderement_actif',
      trialDaysRemaining: 30,
      trialStartDate: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div
        className={`w-full max-w-md max-h-[92dvh] overflow-y-auto p-4 sm:p-6 rounded-3xl border shadow-2xl relative my-auto box-border ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer z-10"
          aria-label={uiCore.close}
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Tab switcher: Inscription vs Connexion (Segmented & Anti-overflow) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 mb-5 pr-8 sm:pr-0">
          <button
            id="tab-auth-signup"
            type="button"
            onClick={() => {
              setMode('signup');
              setStep(1);
            }}
            className={`py-2 px-2 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer text-center truncate ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-emerald-300 dark:border-emerald-600'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            {ab.authSignupTab}
          </button>
          <button
            id="tab-auth-login"
            type="button"
            onClick={() => {
              setMode('login');
              setStep(1);
            }}
            className={`py-2 px-2 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer text-center truncate ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-emerald-300 dark:border-emerald-600'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            {ab.authLoginTab}
          </button>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {ab.authFirstName}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-auth-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={ab.authFirstNamePh}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {ab.authEmail}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={ab.authEmailPh}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {ab.authPassword}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'signup' && (
                <span className="text-[11px] text-slate-400 mt-1 block">{ab.authMin6}</span>
              )}
            </div>

            {mode === 'signup' && (
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    id="checkbox-auth-agree-terms"
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded-sm text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                    {ab.authTerms1}{' '}
                    <a
                      href="/privacy.html"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 font-bold underline"
                    >
                      {ab.authTermsLink}
                    </a>
                    .
                  </span>
                </label>
              </div>
            )}

            {/* Trial callout */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 space-y-2 mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                {ab.authTrialCallout}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-800/90 dark:text-emerald-400/90">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {ab.authFeat1}
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {ab.authFeat2}
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {ab.authFeat3}
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {ab.authFeat4}
                </div>
              </div>
            </div>

            <button
              id="btn-auth-step1-submit"
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3 rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {mode === 'signup' ? (
                <>
                  <span>{ab.authContinueGoals}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{ab.authLoginBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2 (Registration Objectives & Measures) */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div className="text-center mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {ab.authStep2Of2}
              </span>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                {ab.authCalibrateTitle}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {ab.authSexLabel}
                </label>
                <select
                  id="input-auth-sex"
                  required
                  value={sex}
                  onChange={(e) => setSex(e.target.value as 'femme' | 'homme')}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="" disabled>{ab.authSelectPh}</option>
                  <option value="femme">{ab.authFemale}</option>
                  <option value="homme">{ab.authMale}</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {ab.authAgeLabel}
                </label>
                <input
                  id="input-auth-age"
                  type="number"
                  min="14"
                  max="100"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="35"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {ab.authHeightLabel}
                </label>
                <input
                  id="input-auth-height"
                  type="number"
                  min="100"
                  max="230"
                  required
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="170"
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-semibold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {ab.authCurrentWeightLabel}
                </label>
                <input
                  id="input-auth-current-weight"
                  type="number"
                  step="0.1"
                  min="35"
                  max="250"
                  required
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(e.target.value)}
                  placeholder="70.0"
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-semibold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 text-emerald-600">
                  {ab.authTargetWeightLabel}
                </label>
                <input
                  id="input-auth-target-weight"
                  type="number"
                  step="0.1"
                  min="35"
                  max="250"
                  required
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(e.target.value)}
                  placeholder="65.0"
                  className={`w-full px-2.5 py-2 rounded-xl border text-xs font-semibold text-emerald-600 font-bold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                {ab.authActivityLabel}
              </label>
              <select
                id="input-auth-activity"
                required
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="" disabled>{ab.authActivitySelect}</option>
                <option value="sedentaire">{ab.authActSedentary}</option>
                <option value="legerement_actif">{ab.authActLight}</option>
                <option value="moderement_actif">{ab.authActModerate}</option>
                <option value="tres_actif">{ab.authActVery}</option>
              </select>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-center"
              >
                {ab.authBack}
              </button>
              <button
                id="btn-auth-complete-signup"
                type="submit"
                className="w-full flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-3 px-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">{ab.authStart30Days}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
