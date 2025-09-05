import React from 'react';
import { MessageSquare, Search, CheckCircle, ArrowRight } from 'lucide-react';
export const HowItWorksSection = () => {
  const features = [{
    icon: <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-blue-500" />
        </div>,
    title: 'Agile Workflow',
    description: 'Describe your event needs in plain language. Our AI understands and plans accordingly.'
  }, {
    icon: <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Search className="w-6 h-6 text-green-500" />
        </div>,
    title: 'Task Management',
    description: 'We find and vet the best vendors based on your requirements and budget constraints.'
  }, {
    icon: <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-purple-500" />
        </div>,
    title: 'Real-time Collaboration',
    description: 'Approve suggestions and let our AI handle the booking and coordination details.'
  }, {
    icon: <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3H3V10H10V3Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 3H14V10H21V3Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 14H14V21H21V14Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 14H3V21H10V14Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>,
    title: 'Custom Dashboards',
    description: 'Monitor all aspects of your event planning with beautiful, customizable dashboards.'
  }];
  return <section className="w-full py-24 px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">
            Our Top Notch Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to plan and execute flawless events, powered by
            artificial intelligence.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <div key={index} className="bg-white p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-lg font-medium mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>)}
        </div>
        <div className="mt-16 text-center">
          <button className="px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mx-auto">
            Let's Plan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>;
};