import { useState } from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { checkEligibility } from '@/features/eligibility/eligibility.logic';
import type { EligibilityInput, EligibilityResult, Gender } from '@/features/eligibility/eligibility.types';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { InkBlot } from '@/components/shared/InkBlot';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ArrowLeft, RotateCcw, Check, X, Clock, AlertCircle } from 'lucide-react';

const TOTAL_STEPS = 5;

export function EligibilitySimulator() {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(0); // 0-4 for questions, 5 for result
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [weight, setWeight] = useState('');
  const [hasDonatedBefore, setHasDonatedBefore] = useState<boolean | null>(null);
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<EligibilityResult | null>(null);

  function validateCurrentStep(): boolean {
    setError('');
    switch (step) {
      case 0:
        if (!age || isNaN(Number(age))) {
          setError(t('eligibility.error.ageRequired'));
          return false;
        }
        return true;
      case 1:
        if (gender === null) {
          setError(t('eligibility.error.ageRequired'));
          return false;
        }
        return true;
      case 2:
        if (!weight || isNaN(Number(weight))) {
          setError(t('eligibility.error.weightRequired'));
          return false;
        }
        return true;
      case 3:
        if (hasDonatedBefore === null) {
          setError(t('eligibility.error.ageRequired'));
          return false;
        }
        return true;
      case 4:
        if (hasDonatedBefore && !lastDonationDate) {
          setError(t('eligibility.error.dateRequired'));
          return false;
        }
        if (hasDonatedBefore && new Date(lastDonationDate) > new Date()) {
          setError(t('eligibility.error.dateFuture'));
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) return;

    if (step === 3 && hasDonatedBefore === false) {
      // Skip date step, go straight to result
      computeResult();
      setStep(5);
      return;
    }

    if (step === 4) {
      computeResult();
      setStep(5);
      return;
    }

    setStep((s) => s + 1);
  }

  function computeResult() {
    const input: EligibilityInput = {
      age: Number(age),
      gender,
      weight: Number(weight),
      hasDonatedBefore,
      lastDonationDate: hasDonatedBefore ? lastDonationDate : null,
    };
    setResult(checkEligibility(input, lang));
  }

  function handleBack() {
    setError('');
    if (step === 5) {
      setStep(hasDonatedBefore ? 4 : 3);
      return;
    }
    if (step === 3 && hasDonatedBefore === false) {
      setStep(2);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  function handleRestart() {
    setStep(0);
    setAge('');
    setGender(null);
    setWeight('');
    setHasDonatedBefore(null);
    setLastDonationDate('');
    setError('');
    setResult(null);
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const isResultStep = step === 5;
  const progress = isResultStep ? 100 : (step / TOTAL_STEPS) * 100;

  return (
    <section id="eligibility" className="relative py-24 lg:py-32 overflow-hidden">
      <InkBlot
        variant={2}
        color="#8B3147"
        className="absolute top-20 -right-40 w-[500px] h-[700px] opacity-[0.03]"
      />

      <div className="container-hemo relative z-10">
        <SectionHeading
          eyebrowKey="eligibility.eyebrow"
          titleKey="eligibility.title"
          subtitleKey="eligibility.subtitle"
        />

        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          {!isResultStep && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-warmgray-500">
                  {t('eligibility.step')} {step + 1} {t('eligibility.of')} {TOTAL_STEPS}
                </span>
                <span className="text-sm font-medium text-bordeaux-600">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-ivory-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-bordeaux-600 to-bordeaux-700 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Question steps */}
          {!isResultStep && (
            <div className="bg-white rounded-3xl shadow-xl shadow-bordeaux-900/5 border border-warmgray-200/50 p-8 sm:p-10 min-h-[340px] flex flex-col">
              {/* Step 0: Age */}
              {step === 0 && (
                <div className="flex flex-col gap-6 flex-1 animate-fade-in">
                  <div>
                    <label htmlFor="age-input" className="block text-xl font-display text-bordeaux-900 mb-2">
                      {t('eligibility.age')}
                    </label>
                    <p className="text-sm text-warmgray-500">{t('eligibility.age.hint')}</p>
                  </div>
                  <input
                    id="age-input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    placeholder="—"
                    className="w-full max-w-xs px-5 py-4 text-2xl font-display text-bordeaux-900 bg-ivory-50 border-2 border-warmgray-200 rounded-2xl focus:border-bordeaux-400 transition-colors outline-none"
                    autoFocus
                  />
                </div>
              )}

              {/* Step 1: Gender */}
              {step === 1 && (
                <div className="flex flex-col gap-6 flex-1 animate-fade-in">
                  <div>
                    <label className="block text-xl font-display text-bordeaux-900 mb-2">
                      {t('eligibility.gender')}
                    </label>
                    <p className="text-sm text-warmgray-500">{t('eligibility.gender.hint')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(['male', 'female'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`px-6 py-5 rounded-2xl text-lg font-semibold border-2 transition-all duration-200 ${
                          gender === g
                            ? 'border-bordeaux-500 bg-bordeaux-50 text-bordeaux-700 shadow-md'
                            : 'border-warmgray-200 bg-ivory-50 text-warmgray-600 hover:border-bordeaux-300 hover:bg-bordeaux-50/30'
                        }`}
                      >
                        {t(g === 'male' ? 'eligibility.male' : 'eligibility.female')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Weight */}
              {step === 2 && (
                <div className="flex flex-col gap-6 flex-1 animate-fade-in">
                  <div>
                    <label htmlFor="weight-input" className="block text-xl font-display text-bordeaux-900 mb-2">
                      {t('eligibility.weight')}
                    </label>
                    <p className="text-sm text-warmgray-500">{t('eligibility.weight.hint')}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <input
                      id="weight-input"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={300}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                      placeholder="—"
                      className="w-full max-w-xs px-5 py-4 text-2xl font-display text-bordeaux-900 bg-ivory-50 border-2 border-warmgray-200 rounded-2xl focus:border-bordeaux-400 transition-colors outline-none"
                      autoFocus
                    />
                    <span className="text-xl font-display text-warmgray-400">kg</span>
                  </div>
                </div>
              )}

              {/* Step 3: Previous donation */}
              {step === 3 && (
                <div className="flex flex-col gap-6 flex-1 animate-fade-in">
                  <div>
                    <label className="block text-xl font-display text-bordeaux-900 mb-2">
                      {t('eligibility.prevDonation')}
                    </label>
                    <p className="text-sm text-warmgray-500">{t('eligibility.prevDonation.hint')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setHasDonatedBefore(true)}
                      className={`px-6 py-5 rounded-2xl text-lg font-semibold border-2 transition-all duration-200 ${
                        hasDonatedBefore === true
                          ? 'border-bordeaux-500 bg-bordeaux-50 text-bordeaux-700 shadow-md'
                          : 'border-warmgray-200 bg-ivory-50 text-warmgray-600 hover:border-bordeaux-300 hover:bg-bordeaux-50/30'
                      }`}
                    >
                      {t('eligibility.yes')}
                    </button>
                    <button
                      onClick={() => setHasDonatedBefore(false)}
                      className={`px-6 py-5 rounded-2xl text-lg font-semibold border-2 transition-all duration-200 ${
                        hasDonatedBefore === false
                          ? 'border-bordeaux-500 bg-bordeaux-50 text-bordeaux-700 shadow-md'
                          : 'border-warmgray-200 bg-ivory-50 text-warmgray-600 hover:border-bordeaux-300 hover:bg-bordeaux-50/30'
                      }`}
                    >
                      {t('eligibility.no')}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Last donation date */}
              {step === 4 && (
                <div className="flex flex-col gap-6 flex-1 animate-fade-in">
                  <div>
                    <label htmlFor="date-input" className="block text-xl font-display text-bordeaux-900 mb-2">
                      {t('eligibility.lastDonationDate')}
                    </label>
                    <p className="text-sm text-warmgray-500">{t('eligibility.lastDonationDate.hint')}</p>
                  </div>
                  <input
                    id="date-input"
                    type="date"
                    value={lastDonationDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="w-full max-w-xs px-5 py-4 text-lg font-display text-bordeaux-900 bg-ivory-50 border-2 border-warmgray-200 rounded-2xl focus:border-bordeaux-400 transition-colors outline-none"
                    autoFocus
                  />
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-warmgray-100">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-sm font-medium text-warmgray-500 hover:text-bordeaux-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('eligibility.back')}
                </button>
                <Button onClick={handleNext}>
                  {step === 4 || (step === 3 && hasDonatedBefore === false)
                    ? t('eligibility.seeResult')
                    : t('eligibility.next')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Result step */}
          {isResultStep && result && (
            <div className="animate-scale-in">
              <ResultDisplay result={result} onRestart={handleRestart} onScrollToSection={scrollToSection} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ResultDisplay({
  result,
  onRestart,
  onScrollToSection,
}: {
  result: EligibilityResult;
  onRestart: () => void;
  onScrollToSection: (id: string) => void;
}) {
  const { t } = useI18n();

  const isEligible = result.status === 'eligible';
  const isTemp = result.status === 'temporarily_ineligible';

  return (
    <div className="space-y-6">
      {/* Result card */}
      <div
        className={`rounded-3xl p-8 sm:p-10 border-2 shadow-xl ${
          isEligible
            ? 'bg-success-50 border-success-200 shadow-success-900/5'
            : isTemp
            ? 'bg-accent-50 border-accent-200 shadow-accent-900/5'
            : 'bg-bordeaux-50 border-bordeaux-200 shadow-bordeaux-900/5'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isEligible
                ? 'bg-success-500 text-white'
                : isTemp
                ? 'bg-accent-500 text-white'
                : 'bg-bordeaux-600 text-white'
            }`}
          >
            {isEligible ? <Check className="w-6 h-6" /> : isTemp ? <Clock className="w-6 h-6" /> : <X className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <p className="text-lg sm:text-xl font-display text-bordeaux-900 leading-relaxed">
              {result.message}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-warmgray-200/50">
          <p className="text-sm text-warmgray-500 italic leading-relaxed">
            {t('eligibility.disclaimer')}
          </p>
        </div>
      </div>

      {/* Donor card preview (eligible only) */}
      {isEligible && (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <DonorCard />
        </div>
      )}

      {/* Next steps */}
      {isEligible && (
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button variant="outline" onClick={() => onScrollToSection('process')} className="flex-1">
            {t('eligibility.nextSteps.process')}
          </Button>
          <Button variant="primary" onClick={() => onScrollToSection('centers')} className="flex-1">
            {t('eligibility.nextSteps.centers')}
          </Button>
        </div>
      )}

      {/* Restart */}
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 text-sm font-medium text-warmgray-500 hover:text-bordeaux-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('eligibility.restart')}
        </button>
      </div>
    </div>
  );
}

function DonorCard() {
  const { t } = useI18n();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bordeaux-700 via-bordeaux-800 to-plum-900 p-8 shadow-2xl shadow-bordeaux-900/30">
      {/* Decorative ink blot */}
      <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10">
        <InkBlot variant={4} color="#FFEDD0" className="w-full h-full" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-300">
              {t('eligibility.card.title')}
            </p>
            <p className="text-sm text-bordeaux-200 mt-1">HemoLink</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-ivory-50/10 flex items-center justify-center">
            <Check className="w-5 h-5 text-accent-300" />
          </div>
        </div>

        <p className="font-display text-2xl text-ivory-50 mb-1">
          {t('eligibility.card.name')}
        </p>
        <p className="text-sm text-bordeaux-200 mb-6">{t('eligibility.card.id')}</p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-500/20 border border-success-400/30">
          <span className="w-2 h-2 rounded-full bg-success-400" />
          <span className="text-sm font-medium text-success-200">{t('eligibility.card.status')}</span>
        </div>

        <p className="mt-6 text-xs text-bordeaux-200 italic leading-relaxed">
          {t('eligibility.card.note')}
        </p>
      </div>
    </div>
  );
}
