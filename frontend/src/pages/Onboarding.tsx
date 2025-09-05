import React, { useState } from 'react'
import { WelcomeOverlay } from '../components/onboarding/WelcomeOverlay'
import { EventSetup } from '../components/onboarding/EventSetup'

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    setShowSetup(true)
  }

  const handleSetupComplete = () => {
    setShowSetup(false)
    setSetupComplete(true)
    // Redirect to dashboard after animation
    setTimeout(() => {
      onComplete()
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F8FAFC] overflow-hidden">
      {showWelcome && <WelcomeOverlay onComplete={handleWelcomeComplete} />}
      {showSetup && <EventSetup onComplete={handleSetupComplete} />}
      {setupComplete && (
        <div className="h-screen w-full flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] rounded-full opacity-25 animate-ping"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] rounded-full">
              <svg
                className="w-12 h-12 text-[#0F172A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-light text-[#0F172A] mb-4 animate-fadeIn">
            Done! We're sourcing your vendors...
          </h1>
          <p className="text-[#475569] max-w-md text-center animate-fadeIn">
            In 48 hours, your venues, catering, and décor options will be ready.
            We'll notify you when everything is set!
          </p>
          <div className="mt-12 w-64 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] animate-progressBar"></div>
          </div>
        </div>
      )}
    </div>
  )
}
