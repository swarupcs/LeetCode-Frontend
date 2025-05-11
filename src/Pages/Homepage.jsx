import { Header } from '@/components/LandingPage/Header';
import { HeroSection } from '@/components/LandingPage/HeroSection';
import { FeaturesSection } from '@/components/LandingPage/FeatureSection';
import { HowItWorksSection } from '@/components/LandingPage/HowItWorksSection';
import { PricingSection } from '@/components/LandingPage/PricingSection';
import { CtaSection } from '@/components/LandingPage/CtaSection';
import { Footer } from '@/components/LandingPage/Footer';


export default function Homepage() {
  return (
    <div className='flex min-h-screen flex-col bg-premium-darker text-white'>
      <Header />
      <main className='flex-1'>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
