import React from 'react';
export const Footer = () => {
  return <footer className="w-full bg-white py-12 px-8 md:px-12 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0 flex items-center gap-1">
            <span className="text-blue-500 text-2xl">●</span>
            <div className="text-xl font-medium tracking-tight">
              eventify<span className="text-blue-500">AI</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Product
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} eventifyAI. All rights reserved.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>;
};