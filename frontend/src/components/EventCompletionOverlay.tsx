import React from 'react'
import { CheckCircle, Sparkles, Coffee, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EventCompletionOverlayProps {
  isVisible: boolean
  onClose: () => void
}

export function EventCompletionOverlay({ isVisible, onClose }: EventCompletionOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              delay: 0.1
            }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#CFFAFE]/20 via-[#A7F3D0]/20 to-[#FEF3C7]/20" />
            
            {/* Floating sparkles */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-4 right-4"
            >
              <Sparkles size={20} className="text-[#3B82F6]" />
            </motion.div>
            
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-4 left-4"
            >
              <Sparkles size={16} className="text-[#22C55E]" />
            </motion.div>

            {/* Main content */}
            <div className="relative z-10">
              {/* Success checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15,
                  delay: 0.3
                }}
                className="w-20 h-20 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <CheckCircle size={40} className="text-white" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-[#0F172A] mb-3"
              >
                All Done! 🎉
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-[#475569] text-lg mb-6 leading-relaxed"
              >
                Your event has been submitted successfully. 
                <br />
                <span className="font-medium text-[#0F172A]">
                  Sit back, relax, and let our AI handle the rest!
                </span>
              </motion.p>

              {/* Status indicators */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3 mb-8"
              >
                <div className="flex items-center justify-center gap-3 text-sm text-[#64748B]">
                  <Clock size={16} className="text-[#3B82F6]" />
                  <span>Voice agent is making calls...</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-sm text-[#64748B]">
                  <Coffee size={16} className="text-[#22C55E]" />
                  <span>Getting quotes from vendors...</span>
                </div>
              </motion.div>

              {/* Action button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A] font-medium py-3 px-6 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                View Dashboard
              </motion.button>

              {/* Bottom message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs text-[#94A3B8] mt-4"
              >
                You'll receive updates as quotes come in
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
