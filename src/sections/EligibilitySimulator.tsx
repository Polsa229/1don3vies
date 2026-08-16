import { useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import {
  checkEligibility,
  MAX_AGE,
  MIN_AGE,
} from "@/features/eligibility/eligibility.logic";
import type {
  EligibilityInput,
  EligibilityResult,
  Gender,
} from "@/features/eligibility/eligibility.types";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { InkBlot } from "@/components/shared/InkBlot";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  RotateCcw,
  Check,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";

const choiceBtn = (active: boolean) =>
  `px-4 py-3 rounded-2xl text-sm font-semibold border transition-all duration-200 ${
    active
      ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
      : "border-warmgray-200 bg-ivory-50 text-warmgray-600 hover:border-primary-300"
  }`;

const fieldInput =
  "w-full px-4 py-2.5 text-xl font-display text-primary-900 bg-ivory-50 border border-warmgray-200 rounded-2xl focus:border-primary-400 transition-colors outline-none";

export function EligibilitySimulator() {
  const { t, lang } = useI18n();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [weight, setWeight] = useState("");
  const [hasDonatedBefore, setHasDonatedBefore] = useState<boolean | null>(
    null,
  );
  const [lastDonationDate, setLastDonationDate] = useState("");
  const [showLastDate, setShowLastDate] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EligibilityResult | null>(null);

  function isAgeBlocking() {
    const ageNum = Number(age);
    return (
      Boolean(age) && !isNaN(ageNum) && (ageNum < MIN_AGE || ageNum > MAX_AGE)
    );
  }

  function validateForm(): boolean {
    setError("");
    if (!age || isNaN(Number(age))) {
      setError(t("eligibility.error.ageRequired"));
      return false;
    }
    if (isAgeBlocking()) return true;
    if (gender === null) {
      setError(t("eligibility.error.genderRequired"));
      return false;
    }
    if (!weight || isNaN(Number(weight))) {
      setError(t("eligibility.error.weightRequired"));
      return false;
    }
    if (hasDonatedBefore === null) {
      setError(t("eligibility.error.prevDonationRequired"));
      return false;
    }
    if (hasDonatedBefore && !lastDonationDate) {
      setShowLastDate(true);
      setError(t("eligibility.error.dateRequired"));
      return false;
    }
    if (hasDonatedBefore && new Date(lastDonationDate) > new Date()) {
      setError(t("eligibility.error.dateFuture"));
      return false;
    }
    return true;
  }

  function handleSubmit() {
    if (!validateForm()) return;
    const input: EligibilityInput = {
      age: Number(age),
      gender,
      weight: Number(weight),
      hasDonatedBefore,
      lastDonationDate: hasDonatedBefore ? lastDonationDate : null,
    };
    setResult(checkEligibility(input, lang));
  }

  function handleRestart() {
    setAge("");
    setGender(null);
    setWeight("");
    setHasDonatedBefore(null);
    setLastDonationDate("");
    setShowLastDate(false);
    setError("");
    setResult(null);
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const showResult = Boolean(result);

  return (
    <section
      id="eligibility"
      className="relative pt-2 pb-8 lg:pt-6 lg:pb-16 overflow-hidden"
    >
      <InkBlot
        variant={2}
        color="#691735"
        className="absolute top-20 -right-40 w-[500px] h-[700px] opacity-[0.03]"
      />

      <div className="container-hemo relative z-10">
        <SectionHeading
          eyebrowKey="eligibility.eyebrow"
          titleKey="eligibility.title"
          subtitleKey="eligibility.subtitle"
          className="!mb-4 sm:!mb-5"
        />

        <div className="max-w-2xl mx-auto">
          <div id="simulator-form" className="scroll-mt-24">
            {!showResult && (
              <div className="bg-surface rounded-2xl shadow-lg shadow-primary-900/[0.04] border border-warmgray-200/70 p-4 sm:p-5">
                <div className="flex-1 space-y-4">
                  <div>
                    <label
                      htmlFor="age-input"
                      className="block text-base sm:text-lg font-display text-primary-900 mb-1"
                    >
                      {t("eligibility.age")}
                    </label>
                    <p className="text-xs text-warmgray-600 leading-relaxed mb-2">
                      {t("eligibility.age.hint")}
                    </p>
                    <input
                      id="age-input"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      onFocus={() => setShowLastDate(false)}
                      onClick={() => setShowLastDate(false)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder="—"
                      className={fieldInput}
                    />
                  </div>
                  <div>
                    <p className="block text-base sm:text-lg font-display text-primary-900 mb-1">
                      {t("eligibility.gender")}
                    </p>
                    <p className="text-xs text-warmgray-600 leading-relaxed mb-2">
                      {t("eligibility.gender.hint")}
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(["male", "female"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={choiceBtn(gender === g)}
                        >
                          {t(
                            g === "male"
                              ? "eligibility.male"
                              : "eligibility.female",
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="weight-input"
                      className="block text-base sm:text-lg font-display text-primary-900 mb-1"
                    >
                      {t("eligibility.weight")}
                    </label>
                    <p className="text-xs text-warmgray-600 leading-relaxed mb-2">
                      {t("eligibility.weight.hint")}
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        id="weight-input"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={300}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="—"
                        className={fieldInput}
                      />
                      <span className="shrink-0 text-lg font-display text-warmgray-400">
                        kg
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="block text-base sm:text-lg font-display text-primary-900 mb-1">
                      {t("eligibility.prevDonation")}
                    </p>
                    <p className="text-xs text-warmgray-600 leading-relaxed mb-2">
                      {t("eligibility.prevDonation.hint")}
                    </p>
                    <div className="flex flex-nowrap items-stretch gap-2.5 min-h-[3.25rem] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setHasDonatedBefore(true);
                          setShowLastDate(true);
                        }}
                        className={`${choiceBtn(hasDonatedBefore === true)} min-w-0 flex-1`}
                      >
                        {t("eligibility.yes")}
                      </button>
                      <div
                        className="min-w-0 overflow-hidden transition-[width] duration-300 ease-out"
                        style={{ width: showLastDate ? "36%" : 0 }}
                      >
                        <input
                          id="date-input"
                          type="date"
                          value={lastDonationDate}
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setLastDonationDate(e.target.value)}
                          aria-label={t("eligibility.lastDonationDate")}
                          title={t("eligibility.lastDonationDate")}
                          tabIndex={showLastDate ? 0 : -1}
                          className={`${fieldInput} h-full w-full text-base transition-transform duration-300 ease-out ${
                            showLastDate ? "translate-x-0" : "translate-x-full"
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHasDonatedBefore(false);
                          setLastDonationDate("");
                          setShowLastDate(false);
                        }}
                        className={`${choiceBtn(hasDonatedBefore === false)} min-w-0 flex-1`}
                      >
                        {t("eligibility.no")}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    className="mt-3 flex items-start gap-2 text-sm text-error-700 bg-error-50 border border-error-200 rounded-xl px-3.5 py-2 animate-fade-in"
                  >
                    <AlertCircle
                      className="w-4 h-4 mt-0.5 shrink-0"
                      aria-hidden
                    />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-end mt-auto pt-3">
                  <Button onClick={handleSubmit}>
                    {t("eligibility.seeResult")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {showResult && result && (
              <div className="animate-scale-in">
                <ResultDisplay
                  result={result}
                  onRestart={handleRestart}
                  onScrollToSection={scrollToSection}
                />
              </div>
            )}
          </div>
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

  const isEligible = result.status === "eligible";
  const isTemp = result.status === "temporarily_ineligible";

  return (
    <div className="space-y-6">
      {/* Result card */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`rounded-3xl p-8 sm:p-10 border-2 shadow-xl ${
          isEligible
            ? "bg-success-50 border-success-200 shadow-success-900/5"
            : isTemp
              ? "bg-accent-50 border-accent-200 shadow-accent-900/5"
              : "bg-primary-50 border-primary-200 shadow-primary-900/5"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isEligible
                ? "bg-success-500 text-white"
                : isTemp
                  ? "bg-accent-500 text-white"
                  : "bg-primary-600 text-white"
            }`}
          >
            {isEligible ? (
              <Check className="w-6 h-6" />
            ) : isTemp ? (
              <Clock className="w-6 h-6" />
            ) : (
              <X className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1">
            {!isEligible && !isTemp && (
              <p className="text-lg sm:text-xl font-display text-primary-900 mb-1.5">
                {t("eligibility.result.ineligible")}
              </p>
            )}
            <p
              className={`${
                !isEligible && !isTemp
                  ? "text-base text-warmgray-600"
                  : "text-lg sm:text-xl font-display text-primary-900"
              } leading-relaxed`}
            >
              {result.message}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-warmgray-200/50">
          <p className="text-sm text-warmgray-600 italic leading-relaxed">
            {t("eligibility.disclaimer")}
          </p>
        </div>
      </div>

      {/* Donor card preview (eligible only) */}
      {isEligible && (
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <DonorCard />
        </div>
      )}

      {/* Next steps */}
      {isEligible && (
        <div
          className="flex flex-col sm:flex-row gap-3 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <Button
            variant="outline"
            onClick={() => onScrollToSection("process")}
            className="flex-1"
          >
            {t("eligibility.nextSteps.process")}
          </Button>
          <Button
            variant="primary"
            onClick={() => onScrollToSection("centers")}
            className="flex-1"
          >
            {t("eligibility.nextSteps.centers")}
          </Button>
        </div>
      )}

      {/* Restart */}
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 text-sm font-medium text-warmgray-600 hover:text-primary-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t("eligibility.restart")}
        </button>
      </div>
    </div>
  );
}

function DonorCard() {
  const { t } = useI18n();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 p-8 shadow-2xl shadow-primary-900/30">
      {/* Decorative ink blot */}
      <div className="absolute -top-10 -right-10 w-48 h-48 opacity-10">
        <InkBlot variant={4} color="#FDE8E6" className="w-full h-full" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-300">
              {t("eligibility.card.title")}
            </p>
            <p className="text-sm text-primary-200 mt-1">1Don3Vies</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-ivory-50/10 flex items-center justify-center">
            <Check className="w-5 h-5 text-accent-300" />
          </div>
        </div>

        <p className="font-display text-2xl text-ivory-50 mb-1">
          {t("eligibility.card.name")}
        </p>
        <p className="text-sm text-primary-200 mb-6">
          {t("eligibility.card.id")}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-500/20 border border-success-400/30">
          <span className="w-2 h-2 rounded-full bg-success-400" />
          <span className="text-sm font-medium text-success-200">
            {t("eligibility.card.status")}
          </span>
        </div>

        <p className="mt-6 text-xs text-primary-200 italic leading-relaxed">
          {t("eligibility.card.note")}
        </p>
      </div>
    </div>
  );
}
