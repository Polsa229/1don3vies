import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from '@/i18n/I18nContext';
import { Navbar } from '@/components/shared/Navbar';
import { StickyCta } from '@/components/shared/StickyCta';
import { Hero } from '@/sections/Hero';
import { EligibilitySimulator } from '@/sections/EligibilitySimulator';
import { QuoteBlock } from '@/components/shared/SectionHeading';
import { ProcessSection } from '@/sections/ProcessSection';
import { CentersSection } from '@/sections/CentersSection';
import { ReservesSection } from '@/sections/ReservesSection';
import { WhyDonateSection } from '@/sections/WhyDonateSection';
import { FaqSection } from '@/sections/FaqSection';
import { Footer } from '@/sections/Footer';
import { BackToTop } from '@/components/shared/BackToTop';
import { ChatWidget } from '@/components/shared/ChatWidget';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { CentersPage } from '@/pages/CentersPage';

function LandingPage() {
  return (
    <>
      <StickyCta />
      <main>
        <Hero />
        <EligibilitySimulator />
        <QuoteBlock quoteKey="quote.1" />
        <ProcessSection />
        <CentersSection limit={4} />
        <ReservesSection />
        <WhyDonateSection />
        <FaqSection />
      </main>
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <I18nProvider>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <BrowserRouter>
        <div className="min-h-screen bg-ivory-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/centres" element={<CentersPage />} />
          </Routes>
          <Footer />
          <BackToTop />
          <ChatWidget />
        </div>
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App;
