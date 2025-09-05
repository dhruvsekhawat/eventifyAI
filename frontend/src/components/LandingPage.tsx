import React from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { TrustedBySection } from './TrustedBySection';
import { HowItWorksSection } from './HowItWorksSection';
import { Footer } from './Footer';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full min-h-screen font-light bg-white text-gray-800">
      <Navbar onGetStarted={onGetStarted} />
      <main>
        <HeroSection onGetStarted={onGetStarted} />
        <TrustedBySection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};
