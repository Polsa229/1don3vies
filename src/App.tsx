import { I18nProvider } from '@/i18n/I18nContext';
import { Navbar } from '@/components/shared/Navbar';
import { Hero } from '@/sections/Hero';
import { EligibilitySimulator } from '@/sections/EligibilitySimulator';
import { ProcessSection } from '@/sections/ProcessSection';
import { QuoteBlock } from '@/components/shared/SectionHeading';
import { CentersSection } from '@/sections/CentersSection';
import { ReservesSection } from '@/sections/ReservesSection';
import { WhyDonateSection } from '@/sections/WhyDonateSection';
import { FaqSection } from '@/sections/FaqSection';
import { Footer } from '@/sections/Footer';

function App() {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-ivory-50">
        <Navbar />
        <main>
          <Hero />
          <EligibilitySimulator />
          <QuoteBlock quoteKey="quote.1" />
          <ProcessSection />
          <CentersSection />
          <ReservesSection />
          <WhyDonateSection />
          <FaqSection />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}

export default App;
