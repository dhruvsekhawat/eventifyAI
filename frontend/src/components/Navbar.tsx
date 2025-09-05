import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onGetStarted: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    // Set initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-lg border-b border-gray-100' 
        : 'bg-transparent'
    }`}>
      <div className="w-full py-6 px-8 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-gray-900">eventify</span>
          <span className="text-blue-500">AI</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <a href="#features" className={`transition-colors text-sm font-medium ${
            isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-800 hover:text-gray-600'
          }`}>
            Features
          </a>
          <a href="#pricing" className={`transition-colors text-sm font-medium ${
            isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-800 hover:text-gray-600'
          }`}>
            Pricing
          </a>
          <a href="#changelog" className={`transition-colors text-sm font-medium ${
            isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-800 hover:text-gray-600'
          }`}>
            Changelog
          </a>
          <a href="#contact" className={`transition-colors text-sm font-medium ${
            isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-800 hover:text-gray-600'
          }`}>
            Contact
          </a>
        </div>

        {/* CTA Button */}
        <div>
          <button 
            onClick={onGetStarted}
            className={`px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium ${
              isScrolled 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            <span>Get Started</span>
          </button>
        </div>
      </div>
    </nav>
  );
};