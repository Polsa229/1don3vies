import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { I18nProvider } from "@/i18n/I18nContext";
import { Navbar } from "@/components/shared/Navbar";
import { StickyCta } from "@/components/shared/StickyCta";
import { Hero } from "@/sections/Hero";
import { QuoteBlock } from "@/components/shared/SectionHeading";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Footer } from "@/sections/Footer";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";

const EligibilitySimulator = lazy(() =>
  import("@/sections/EligibilitySimulator").then((m) => ({
    default: m.EligibilitySimulator,
  })),
);
const ProcessSection = lazy(() =>
  import("@/sections/ProcessSection").then((m) => ({
    default: m.ProcessSection,
  })),
);
const CentersSection = lazy(() =>
  import("@/sections/CentersSection").then((m) => ({
    default: m.CentersSection,
  })),
);
const ReservesSection = lazy(() =>
  import("@/sections/ReservesSection").then((m) => ({
    default: m.ReservesSection,
  })),
);
const WhyDonateSection = lazy(() =>
  import("@/sections/WhyDonateSection").then((m) => ({
    default: m.WhyDonateSection,
  })),
);
const FaqSection = lazy(() =>
  import("@/sections/FaqSection").then((m) => ({ default: m.FaqSection })),
);
const CentersPage = lazy(() =>
  import("@/pages/CentersPage").then((m) => ({ default: m.CentersPage })),
);
const BackToTop = lazy(() =>
  import("@/components/shared/BackToTop").then((m) => ({
    default: m.BackToTop,
  })),
);
const ChatWidget = lazy(() =>
  import("@/components/shared/ChatWidget").then((m) => ({
    default: m.ChatWidget,
  })),
);

function prefetchLandingChunks() {
  void import("@/sections/EligibilitySimulator");
  void import("@/sections/ProcessSection");
  void import("@/sections/CentersSection");
}

function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) return;

    let cancelled = false;
    let attempts = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    function finish() {
      // Une fois sur l'accueil, garder une URL propre : /
      navigate("/", { replace: true });
    }

    function tryScroll() {
      if (cancelled) return;

      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        finish();
        return;
      }

      attempts += 1;
      if (attempts < 40) {
        retryTimer = window.setTimeout(tryScroll, 50);
        return;
      }

      finish();
    }

    const startTimer = window.setTimeout(tryScroll, 50);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [location.hash, location.key, navigate]);

  return (
    <>
      <StickyCta />
      <main>
        <Hero />
        <Suspense fallback={<div className="min-h-[50vh]" aria-hidden />}>
          <EligibilitySimulator />
        </Suspense>
        <QuoteBlock quoteKey="quote.1" />
        <Suspense fallback={null}>
          <ProcessSection />
          <CentersSection limit={6} />
          <ReservesSection />
          <WhyDonateSection />
          <FaqSection />
        </Suspense>
      </main>
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem("1Don3Vies-intro-seen");
    } catch {
      return true;
    }
  });
  const [widgetsReady, setWidgetsReady] = useState(false);

  useEffect(() => {
    prefetchLandingChunks();
  }, []);

  useEffect(() => {
    if (loading) return;

    const idle = window.requestIdleCallback;
    const id = idle
      ? idle(() => setWidgetsReady(true), { timeout: 2000 })
      : window.setTimeout(() => setWidgetsReady(true), 600);

    return () => {
      if (idle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [loading]);

  const handleLoadingComplete = useCallback(() => {
    try {
      sessionStorage.setItem("1Don3Vies-intro-seen", "1");
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setLoading(false);
  }, []);

  return (
    <I18nProvider>
      <BrowserRouter>
        {loading ? (
          <LoadingScreen onComplete={handleLoadingComplete} />
        ) : (
          <div className="min-h-screen bg-background pb-16 lg:pb-0">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/centres"
                element={
                  <Suspense fallback={null}>
                    <CentersPage />
                  </Suspense>
                }
              />
            </Routes>
            <Footer />
            <MobileBottomNav />
            {widgetsReady && (
              <Suspense fallback={null}>
                <BackToTop />
                <ChatWidget />
              </Suspense>
            )}
          </div>
        )}
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App;
