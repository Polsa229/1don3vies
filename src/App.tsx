import { useState } from 'react';
import { I18nProvider } from '@/i18n/I18nContext';
import { Navbar } from '@/components/shared/Navbar';
import { StickyCta } from '@/components/shared/StickyCta';
import { Hero } from '@/sections/Hero';
import { EligibilitySimulator } from '@/sections/EligibilitySimulator';
import { QuoteBlock } from '@/components/shared/SectionHeading';
import { ProcessSection } from '@/sections/ProcessSection';
import { SyringeScroll } from '@/components/shared/SyringeScroll';
import { CentersSection } from '@/sections/CentersSection';
import { ReservesSection } from '@/sections/ReservesSection';
import { WhyDonateSection } from '@/sections/WhyDonateSection';
import { FaqSection } from '@/sections/FaqSection';
import { Footer } from '@/sections/Footer';
import { BackToTop } from '@/components/shared/BackToTop';
import { ChatWidget } from '@/components/shared/ChatWidget';
import { LoadingScreen } from '@/components/shared/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <I18nProvider>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className="min-h-screen bg-ivory-50">
        <Navbar />
        <StickyCta />
        <main>
          <Hero />
          <EligibilitySimulator />
          <QuoteBlock quoteKey="quote.1" />
          <ProcessSection />
          {/* Syringe scroll animation between Process and Centers */}
          <div className="relative py-12 overflow-hidden">
            <div className="container-hemo flex justify-center">
              <SyringeScroll />
            </div>
          </div>
          <CentersSection />
          <ReservesSection />
          <WhyDonateSection />
          <FaqSection />
        </main>
        <Footer />
        <BackToTop />
        <ChatWidget />
      </div>
    </I18nProvider>
  );
}

export default App;
