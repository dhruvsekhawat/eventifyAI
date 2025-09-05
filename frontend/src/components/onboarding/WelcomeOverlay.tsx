import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WelcomeScreenProps {
  onComplete: () => void
}

export function WelcomeOverlay({ onComplete }: WelcomeScreenProps) {
  const [currentScreen, setCurrentScreen] = useState(0)
  const totalScreens = 3

  const nextScreen = () => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen(currentScreen + 1)
    } else {
      onComplete()
    }
  }

  const screens = [
    // Screen 1
    <motion.div
      key="welcome"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.5,
      }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl">👋</span>
      </div>
      <h1 className="text-4xl font-light text-[#0F172A] mb-6">
        Welcome to Eventify AI
      </h1>
      <p className="text-[#475569] text-lg max-w-md mb-12">
        In 48 hours, your venues, catering, and décor options will be ready.
      </p>
      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        onClick={nextScreen}
        className="px-8 py-3 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A] rounded-full font-medium"
      >
        Continue
      </motion.button>
    </motion.div>,

    // Screen 2
    <motion.div
      key="howItWorks"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.5,
      }}
      className="flex flex-col items-center text-center"
    >
      <h1 className="text-4xl font-light text-[#0F172A] mb-10">
        Here's how it works
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mb-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-medium text-[#0F172A] mb-2">
            Tell us about your event
          </h3>
          <p className="text-[#475569]">Share your vision and requirements</p>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-medium text-[#0F172A] mb-2">
            We source and negotiate vendors
          </h3>
          <p className="text-[#475569]">Our AI finds the perfect matches</p>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-xl font-medium text-[#0F172A] mb-2">
            You approve and relax
          </h3>
          <p className="text-[#475569]">We handle all the details</p>
        </motion.div>
      </div>
      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        onClick={nextScreen}
        className="px-8 py-3 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A] rounded-full font-medium"
      >
        Continue
      </motion.button>
    </motion.div>,

    // Screen 3
    <motion.div
      key="getStarted"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.5,
      }}
      className="flex flex-col items-center text-center"
    >
      <h1 className="text-4xl font-light text-[#0F172A] mb-8">
        Let's get started
      </h1>
      <p className="text-[#475569] text-lg max-w-md mb-12">
        Create your event and we'll take care of the rest.
      </p>
      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        onClick={nextScreen}
        className="px-10 py-4 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A] rounded-full text-lg font-medium shadow-lg"
      >
        Create My Event
      </motion.button>
    </motion.div>,
  ]

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-6">
      <div className="absolute top-8 right-8 flex gap-2">
        {Array.from({
          length: totalScreens,
        }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentScreen ? 'bg-[#3B82F6]' : 'bg-[#E2E8F0]'
            }`}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">{screens[currentScreen]}</AnimatePresence>
    </div>
  )
}
