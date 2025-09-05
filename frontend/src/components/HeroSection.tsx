import React from 'react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return <div className="min-h-screen w-full bg-white relative">
      {/* Teal Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      {/* Content */}
      <section className="relative w-full px-8 md:px-12 pt-32 pb-24 overflow-hidden z-10">
        {/* Trust Badge */}
        <div className="max-w-6xl mx-auto mb-12 flex justify-center">
          <div className="bg-green-50 text-green-800 py-2 px-6 rounded-full inline-block text-sm font-medium text-center">
            1000+ events managed
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-medium leading-tight tracking-tight mb-6 max-w-4xl">
              Plan Events in Minutes.
              <br />
              <span className="text-blue-500">Not Weeks.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-8">
              Maximize efficiency with AI-powered event planning that handles
              venues, catering, and coordination—putting time back in your pocket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <input type="email" placeholder="Enter your email" className="px-6 py-3 rounded-lg border border-gray-200 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-200" />
              <button 
                onClick={onGetStarted}
                className="px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-3">
              *No long-term commitment, cancel anytime.*
            </div>
          </div>
          <div className="relative mt-16">
            <div className="absolute -top-10 -right-10 bg-white p-4 rounded-lg shadow-lg border border-gray-100 max-w-xs hidden md:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Event Progress</span>
              </div>
              <div className="text-2xl font-medium">76% Complete</div>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{
                width: '76%'
              }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};