import React from 'react';
export const TrustedBySection = () => {
  return <section className="w-full bg-gray-50 py-16 px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-500 mb-8 text-sm font-medium">
          TRUSTED BY LEADING COMPANIES
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          {['Acme Inc.', 'Globex', 'Soylent', 'Initech', 'Umbrella Corp'].map(company => <div key={company} className="text-lg text-gray-400 font-medium">
                {company}
              </div>)}
        </div>
      </div>
    </section>;
};