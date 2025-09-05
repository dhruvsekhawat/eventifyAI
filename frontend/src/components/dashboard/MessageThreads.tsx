import React, { useState, useEffect } from 'react'
import { Phone, Clock, Star, CheckCircle, AlertCircle, MessageCircle, Calendar, User, Building } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

type VoiceAgentLog = {
  id: string
  event_id: string
  vendor_quote_id: string
  call_type: 'outbound' | 'inbound' | 'follow_up'
  call_status: string
  contact_name: string
  contact_phone: string
  contact_email: string
  call_start_time: string
  call_end_time: string
  call_duration: number
  recording_url: string | null
  agent_id: string
  agent_name: string
  conversation_summary: string
  key_points: string[]
  action_items: string[]
  next_steps: string
  call_quality_score: number
  customer_satisfaction: number
  agent_notes: string
  supervisor_notes: string | null
  created_at: string
}

type VendorQuote = {
  id: string
  vendor_name: string
  vendor_type: string
  quote_amount: string
  status: string
}

export function MessageThreads() {
  const [callLogs, setCallLogs] = useState<VoiceAgentLog[]>([])
  const [vendorQuotes, setVendorQuotes] = useState<VendorQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState<VoiceAgentLog | null>(null)
  const [showCallDetails, setShowCallDetails] = useState(false)

  useEffect(() => {
    fetchCallData()
  }, [])

  const fetchCallData = async () => {
    try {
      setLoading(true)
      
      // Fetch voice agent logs
      const { data: logs, error: logsError } = await supabase
        .from('voice_agent_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (logsError) throw logsError

      // Fetch vendor quotes for context
      const { data: quotes, error: quotesError } = await supabase
        .from('vendor_quotes')
        .select('id, vendor_name, vendor_type, quote_amount, status')

      if (quotesError) throw quotesError

      setCallLogs(logs || [])
      setVendorQuotes(quotes || [])
    } catch (error) {
      console.error('Error fetching call data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVendorForCall = (vendorQuoteId: string) => {
    return vendorQuotes.find(quote => quote.id === vendorQuoteId)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#ECFDF5] text-[#22C55E]'
      case 'in_progress':
        return 'bg-[#FEF3C7] text-[#F59E0B]'
      case 'failed':
        return 'bg-[#FEF2F2] text-[#EF4444]'
      case 'no_answer':
        return 'bg-[#F3F4F6] text-[#6B7280]'
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]'
    }
  }

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'outbound':
        return <Phone size={14} className="text-[#3B82F6]" />
      case 'inbound':
        return <Phone size={14} className="text-[#22C55E]" />
      case 'follow_up':
        return <MessageCircle size={14} className="text-[#F59E0B]" />
      default:
        return <Phone size={14} className="text-[#64748B]" />
    }
  }

  const getQualityScoreColor = (score: number) => {
    if (score >= 4) return 'text-[#22C55E]'
    if (score >= 3) return 'text-[#F59E0B]'
    return 'text-[#EF4444]'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm mt-6">
        <div className="p-5 border-b border-[#E2E8F0]">
          <h2 className="text-lg font-medium text-[#0F172A]">Recent Calls</h2>
        </div>
        <div className="p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm mt-6">
      <div className="p-5 border-b border-[#E2E8F0]">
        <h2 className="text-lg font-medium text-[#0F172A]">Recent Calls</h2>
        <p className="text-sm text-[#475569] mt-1">Voice agent conversation history</p>
      </div>

      <div className="divide-y divide-[#E2E8F0]">
        <AnimatePresence>
          {callLogs.map((call, index) => {
            const vendor = getVendorForCall(call.vendor_quote_id)
            
            return (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedCall(call)
                  setShowCallDetails(true)
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] rounded-full flex items-center justify-center">
                      {getCallTypeIcon(call.call_type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[#0F172A] truncate">
                          {call.contact_name}
                        </h3>
                        <span className="text-xs text-[#64748B]">•</span>
                        <span className="text-xs text-[#64748B]">{call.contact_phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCallStatusColor(call.call_status)}`}>
                          {call.call_status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-[#64748B]">
                          {formatTimeAgo(call.created_at)}
                        </span>
                      </div>
                    </div>

                    {vendor && (
                      <div className="flex items-center gap-2 mb-2">
                        <Building size={12} className="text-[#64748B]" />
                        <span className="text-sm text-[#475569] font-medium">{vendor.vendor_name}</span>
                        <span className="text-xs text-[#64748B]">•</span>
                        <span className="text-xs text-[#64748B] capitalize">{vendor.vendor_type}</span>
                        {vendor.quote_amount && (
                          <>
                            <span className="text-xs text-[#64748B]">•</span>
                            <span className="text-xs font-medium text-[#0F172A]">
                              ${parseFloat(vendor.quote_amount).toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <p className="text-sm text-[#475569] mb-3 line-clamp-2">
                      {call.conversation_summary}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#64748B]">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDuration(call.call_duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        {call.agent_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={12} className={getQualityScoreColor(call.call_quality_score)} />
                        {call.call_quality_score}/5
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(call.call_start_time).toLocaleDateString()}
                      </div>
                    </div>

                    {call.key_points && call.key_points.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {call.key_points.slice(0, 3).map((point, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-xs rounded-full flex items-center gap-1"
                          >
                            <CheckCircle size={10} />
                            {point}
                          </span>
                        ))}
                        {call.key_points.length > 3 && (
                          <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-xs rounded-full">
                            +{call.key_points.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {callLogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center"
          >
            <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone size={24} className="text-[#64748B]" />
            </div>
            <p className="text-[#64748B] text-sm">No calls yet</p>
            <p className="text-[#94A3B8] text-xs mt-1">Voice agent will start making calls soon...</p>
          </motion.div>
        )}
      </div>

      {/* Call Details Modal */}
      <AnimatePresence>
        {showCallDetails && selectedCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCallDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[#E2E8F0]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0F172A]">Call Details</h3>
                    <p className="text-[#475569] mt-1">{selectedCall.contact_name} • {selectedCall.contact_phone}</p>
                  </div>
                  <button
                    onClick={() => setShowCallDetails(false)}
                    className="text-[#64748B] hover:text-[#0F172A]"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F8FAFC] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} className="text-[#3B82F6]" />
                      <span className="font-medium text-[#0F172A]">Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-[#0F172A]">
                      {formatDuration(selectedCall.call_duration)}
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">
                      {new Date(selectedCall.call_start_time).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-[#3B82F6]" />
                      <span className="font-medium text-[#0F172A]">Quality Score</span>
                    </div>
                    <p className="text-2xl font-bold text-[#0F172A]">
                      {selectedCall.call_quality_score}/5
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">
                      Agent: {selectedCall.agent_name}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-[#0F172A] mb-3">Conversation Summary</h4>
                  <p className="text-[#475569] text-sm leading-relaxed bg-[#F8FAFC] p-4 rounded-lg">
                    {selectedCall.conversation_summary}
                  </p>
                </div>

                {selectedCall.key_points && selectedCall.key_points.length > 0 && (
                  <div>
                    <h4 className="font-medium text-[#0F172A] mb-3">Key Points</h4>
                    <div className="space-y-2">
                      {selectedCall.key_points.map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-[#475569] text-sm">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCall.action_items && selectedCall.action_items.length > 0 && (
                  <div>
                    <h4 className="font-medium text-[#0F172A] mb-3">Action Items</h4>
                    <div className="space-y-2">
                      {selectedCall.action_items.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-[#475569] text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCall.next_steps && (
                  <div>
                    <h4 className="font-medium text-[#0F172A] mb-3">Next Steps</h4>
                    <p className="text-[#475569] text-sm bg-[#FEF3C7] p-3 rounded-lg">
                      {selectedCall.next_steps}
                    </p>
                  </div>
                )}

                {selectedCall.agent_notes && (
                  <div>
                    <h4 className="font-medium text-[#0F172A] mb-3">Agent Notes</h4>
                    <p className="text-[#475569] text-sm bg-[#F1F5F9] p-3 rounded-lg">
                      {selectedCall.agent_notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
                  <button className="flex-1 px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#0F172A] hover:bg-[#F8FAFC]">
                    Contact Vendor
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A] rounded-lg hover:opacity-90">
                    Follow Up
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
