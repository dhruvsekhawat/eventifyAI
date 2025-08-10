import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Check,
  Upload,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface EventSetupProps {
  onComplete: () => void
}

export function EventSetup({ onComplete }: EventSetupProps) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 7

  // Form state
  const [eventType, setEventType] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventCity, setEventCity] = useState('')
  const [guestCount, setGuestCount] = useState(50)
  const [budget, setBudget] = useState(10000)
  const [selectedVibes, setSelectedVibes] = useState<string[]>([])
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])

  const nextStep = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
      setProgress(((step + 1) / totalSteps) * 100)
    } else {
      // Final step - save event to database
      await saveEvent()
    }
  }

  const saveEvent = async () => {
    setIsSubmitting(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Create event data
      const eventData = {
        user_id: user.id,
        title: `${eventType} Event`,
        description: `A ${eventType.toLowerCase()} event in ${eventCity} with ${guestCount} guests. Budget: $${budget.toLocaleString()}. Vibe: ${selectedVibes.join(', ')}. Dietary considerations: ${selectedDietary.join(', ')}`,
        event_type: eventType,
        event_date: eventDate,
        location: eventCity,
        budget: budget,
        guest_count: guestCount,
        status: 'planning',
        summary: `Planning a ${eventType.toLowerCase()} event for ${guestCount} guests in ${eventCity} with a budget of $${budget.toLocaleString()}.`
      }

      // Insert event into database
      const { data: event, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single()

      if (error) {
        console.error('Error saving event:', error)
        throw error
      }

      // Add event to voice agent queue for vendor sourcing
      await supabase
        .from('voice_agent_queue')
        .insert([{
          event_id: event.id,
          status: 'pending',
          priority: 1,
          data: {
            event_type: eventType,
            location: eventCity,
            guest_count: guestCount,
            budget: budget,
            vibes: selectedVibes,
            dietary: selectedDietary
          }
        }])

      console.log('Event saved successfully:', event)
      
      // Complete the onboarding
      onComplete()
      
    } catch (error) {
      console.error('Error saving event:', error)
      // Still complete onboarding even if there's an error
      onComplete()
    } finally {
      setIsSubmitting(false)
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
      setProgress(((step - 1) / totalSteps) * 100)
    }
  }

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe))
    } else {
      setSelectedVibes([...selectedVibes, vibe])
    }
  }

  const toggleDietary = (diet: string) => {
    if (selectedDietary.includes(diet)) {
      setSelectedDietary(selectedDietary.filter((d) => d !== diet))
    } else {
      setSelectedDietary([...selectedDietary, diet])
    }
  }

  const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Anniversary',
    'Graduation',
    'Other',
  ]

  const vibeOptions = [
    'Elegant',
    'Casual',
    'Luxury',
    'Outdoor',
    'Modern',
    'Traditional',
    'Romantic',
    'Minimalist',
  ]

  const dietaryOptions = [
    'Vegan',
    'Vegetarian',
    'Halal',
    'Kosher',
    'Gluten-free',
    'Dairy-free',
    'No restrictions',
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const steps = [
    // Step 1: Event Type
    <motion.div
      key="eventType"
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      className="w-full max-w-2xl"
    >
      <h2 className="text-3xl font-light text-[#0F172A] mb-6">
        What type of event are you planning?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {eventTypes.map((type) => (
          <motion.div
            key={type}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={() => setEventType(type)}
            className={`p-6 rounded-xl cursor-pointer border-2 transition-all ${
              eventType === type
                ? 'border-[#3B82F6] bg-[#F0F9FF]'
                : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg text-[#0F172A]">{type}</span>
              {eventType === type && (
                <Check size={20} className="text-[#3B82F6]" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>,

    // Step 2: Date & Time
    <motion.div
      key="dateTime"
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      className="w-full max-w-2xl"
    >
      <h2 className="text-3xl font-light text-[#0F172A] mb-6">
        When is your event?
      </h2>
      <div className="bg-white p-6 rounded-xl border-2 border-[#E2E8F0] mb-8">
        <div className="flex items-center gap-4">
          <Calendar size={24} className="text-[#94A3B8]" />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="flex-grow bg-transparent border-none text-lg text-[#0F172A] focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </motion.div>,

    // Step 3: City
    <motion.div
      key="city"
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      className="w-full max-w-2xl"
    >
      <h2 className="text-3xl font-light text-[#0F172A] mb-6">
        Where will your event take place?
      </h2>
      <div className="bg-white p-6 rounded-xl border-2 border-[#E2E8F0] mb-8">
        <input
          type="text"
          placeholder="Enter city name"
          value={eventCity}
          onChange={(e) => setEventCity(e.target.value)}
          className="w-full bg-transparent border-none text-lg text-[#0F172A] focus:outline-none focus:ring-0 placeholder-[#94A3B8]"
        />
      </div>
    </motion.div>,

    // Step 4: Guest Count
    <motion.div
      key="guestCount"
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      className="w-full max-w-2xl"
    >
      <h2 className="text-3xl font-light text-[#0F172A] mb-6">
        How many guests do you expect?
      </h2>
      <div className="bg-white p-6 rounded-xl border-2 border-[#E2E8F0] mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[#94A3B8]">Fewer</span>
          <span className="text-sm text-[#94A3B8]">More</span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={guestCount}
          onChange={(e) => setGuestCount(parseInt(e.target.value))}
          className="w-full h-2 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer"
        />
        <div className="mt-6 text-center">
          <span className="text-3xl font-light text-[#0F172A]">
            {guestCount}
          </span>
          <span className="text-[#475569] ml-2">guests</span>
        </div>
      </div>
    </motion.div>,

    // Step 5: Budget Range
    <motion.div
      key="budget"
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      className="w-full max-w-2xl"
    >
      <h2 className="text-3xl font-light text-[#0F172A] mb-6">
        What's your budget range?
      </h2>
      <div className="bg-white p-6 rounded-xl border-2 border-[#E2E8F0] mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[#94A3B8]">$1,000</span>
          <span className="text-sm text-[#94A3B8]">$50,000+</span>
        </div>
        <input
          type="range"
          min="1000"
          max="50000"
          step="500"
          value={budget}
          onChange={(e) => setBudget(parseInt(e.target.value))}
          className="w-full h-2 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer"
        />
        <div className="mt-6 text-center">
          <span className="text-3xl font-light text-[#0F172A]">
            {formatCurrency(budget)}
          </span>
        </div>
      </div>
    </motion.div>,

    // Step 6: Vibe/Mood Tags
    <motion.div
      key="vibe"
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      className="w-full max-w-2xl"
    >
      <h2 className="text-3xl font-light text-[#0F172A] mb-6">
        What vibe are you going for?
      </h2>
      <p className="text-[#475569] mb-6">Select all that apply</p>
      <div className="flex flex-wrap gap-3 mb-8">
        {vibeOptions.map((vibe) => (
          <motion.div
            key={vibe}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => toggleVibe(vibe)}
            className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
              selectedVibes.includes(vibe)
                ? 'bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A]'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#94A3B8]'
            }`}
          >
            {vibe}
          </motion.div>
        ))}
      </div>
    </motion.div>,

    // Step 7: Dietary Considerations
    <motion.div
      key="dietary"
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      className="w-full max-w-2xl"
    >
      <h2 className="text-3xl font-light text-[#0F172A] mb-6">
        Any dietary considerations?
      </h2>
      <p className="text-[#475569] mb-6">Select all that apply</p>
      <div className="flex flex-wrap gap-3 mb-8">
        {dietaryOptions.map((diet) => (
          <motion.div
            key={diet}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => toggleDietary(diet)}
            className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
              selectedDietary.includes(diet)
                ? 'bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A]'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:border-[#94A3B8]'
            }`}
          >
            {diet}
          </motion.div>
        ))}
      </div>
    </motion.div>,

    // Step 8: Upload Guest List (Optional)
    <motion.div
      key="upload"
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      className="w-full max-w-2xl"
    >
      <h2 className="text-3xl font-light text-[#0F172A] mb-6">
        Upload guest list (optional)
      </h2>
      <p className="text-[#475569] mb-6">
        You can upload a CSV file with your guest list or skip this step
      </p>
      <div className="bg-white p-8 rounded-xl border-2 border-dashed border-[#E2E8F0] mb-8 flex flex-col items-center justify-center">
        <Upload size={32} className="text-[#94A3B8] mb-4" />
        <p className="text-[#475569] mb-2">Drag and drop your CSV file here</p>
        <p className="text-[#94A3B8] text-sm mb-6">or</p>
        <button className="px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#475569] hover:bg-[#F1F5F9]">
          Browse files
        </button>
      </div>
      <div className="text-center">
        <button onClick={saveEvent} className="text-[#3B82F6] hover:underline">
          Skip this step
        </button>
      </div>
    </motion.div>,
  ]

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6">
      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-12">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#475569]">Event Setup</span>
          <span className="text-sm font-medium text-[#0F172A]">
            {progress}% Complete
          </span>
        </div>
        <div className="h-1 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0]"
            initial={{
              width: 0,
            }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.5,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between w-full max-w-2xl mt-8">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-full ${
            step === 0
              ? 'opacity-50 cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]'
              : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={nextStep}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-6 py-3 rounded-full ${
            isSubmitting
              ? 'opacity-50 cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]'
              : 'bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A]'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : step < totalSteps - 1 ? (
            <>
              Continue
              <ChevronRight size={18} />
            </>
          ) : (
            'Complete Setup'
          )}
        </motion.button>
      </div>
    </div>
  )
}
