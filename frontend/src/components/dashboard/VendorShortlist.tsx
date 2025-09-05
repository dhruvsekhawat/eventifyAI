import React, { useState, useEffect } from 'react'
import { Building, UtensilsCrossed, Palette, Phone, Clock, Star, CheckCircle, AlertCircle, ArrowRight, Calendar, DollarSign, Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

type VendorQuote = {
  id: string
  vendor_type: 'venue' | 'caterer' | 'decorator' | 'photographer' | 'music' | 'transportation'
  vendor_name: string
  contact_person: string
  phone: string
  email: string
  quote_amount: string
  quote_currency: string
  quote_valid_until: string
  service_description: string
  inclusions: string[]
  exclusions: string[]
  availability: boolean
  capacity: number
  agent_call_date: string
  agent_notes: string
  call_duration: number
  call_quality_score: number
  status: 'pending' | 'confirmed' | 'rejected' | 'expired'
  priority: number
  created_at: string
}

type VoiceAgentLog = {
  id: string
  call_status: string
  contact_name: string
  contact_phone: string
  call_start_time: string
  call_duration: number
  conversation_summary: string
  key_points: string[]
  action_items: string[]
  next_steps: string
  call_quality_score: number
  customer_satisfaction: number
  agent_notes: string
}

type TabType = 'venue' | 'caterer' | 'decorator' | 'photographer' | 'music' | 'transportation'

export function VendorShortlist() {
  const [activeTab, setActiveTab] = useState<TabType>('venue')
  const [vendorQuotes, setVendorQuotes] = useState<VendorQuote[]>([])
  const [voiceAgentLogs, setVoiceAgentLogs] = useState<VoiceAgentLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState<VendorQuote | null>(null)
  const [showCallDetails, setShowCallDetails] = useState(false)
  
  const tabIcons = {
    venue: <Building size={16} />,
    caterer: <UtensilsCrossed size={16} />,
    decorator: <Palette size={16} />,
    photographer: <Palette size={16} />,
    music: <Palette size={16} />,
    transportation: <Palette size={16} />,
  }

  const tabLabels = {
    venue: 'Venues',
    caterer: 'Catering',
    decorator: 'Decor',
    photographer: 'Photography',
    music: 'Music',
    transportation: 'Transport',
  }

  useEffect(() => {
    fetchVendorData()
  }, [])

  const fetchVendorData = async () => {
    try {
      setLoading(true)
      
      // Get current user's events
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch events for the user
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!events || events.length === 0) {
        setLoading(false)
        return
      }

      const currentEvent = events[0] // Most recent event
      
      // Parse event summary to extract quote information
      if (currentEvent.summary) {
        const parsedQuotes = parseEventSummary(currentEvent.summary, currentEvent.id)
        setVendorQuotes(parsedQuotes)
      } else {
        setVendorQuotes([])
      }
      
      setVoiceAgentLogs([]) // We'll use the event summary instead
    } catch (error) {
      console.error('Error fetching vendor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseEventSummary = (summary: string, eventId: string): VendorQuote[] => {
    const quotes: VendorQuote[] = []
    
    // Extract quote amount from summary
    const quoteMatch = summary.match(/\$([\d,]+)/)
    const quoteAmount = quoteMatch ? quoteMatch[1].replace(',', '') : null
    
    // Determine vendor type based on summary content
    let vendorType: 'venue' | 'caterer' | 'decorator' = 'venue'
    if (summary.toLowerCase().includes('catering') || summary.toLowerCase().includes('food') || summary.toLowerCase().includes('vegetarian')) {
      vendorType = 'caterer'
    } else if (summary.toLowerCase().includes('decor') || summary.toLowerCase().includes('floral')) {
      vendorType = 'decorator'
    }
    
    // Extract dietary info
    const dietaryInfo = []
    if (summary.toLowerCase().includes('vegetarian')) dietaryInfo.push('Vegetarian')
    if (summary.toLowerCase().includes('gluten-free')) dietaryInfo.push('Gluten-free')
    if (summary.toLowerCase().includes('kosher')) dietaryInfo.push('Kosher')
    
    if (quoteAmount) {
      quotes.push({
        id: `parsed-${eventId}`,
        event_id: eventId,
        vendor_type: vendorType,
        vendor_name: 'Venue Contacted',
        contact_person: 'Contact Person',
        phone: '+1-555-0000',
        email: 'contact@venue.com',
        website: null,
        address: null,
        city: null,
        state: null,
        zip_code: null,
        quote_amount: quoteAmount,
        quote_currency: 'USD',
        quote_valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quote_notes: null,
        service_description: summary.substring(0, 100) + '...',
        inclusions: dietaryInfo.length > 0 ? dietaryInfo : ['Basic Service'],
        exclusions: [],
        availability: true,
        capacity: 160, // Default from event
        agent_call_date: new Date().toISOString(),
        agent_notes: summary,
        call_duration: 180, // Default 3 minutes
        call_quality_score: 4, // Default score
        status: 'pending',
        priority: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    
    return quotes
  }

  const getVendorsByType = (type: TabType) => {
    return vendorQuotes.filter(vendor => vendor.vendor_type === type)
  }

  const getCallLogForVendor = (vendorId: string) => {
    return voiceAgentLogs.find(log => log.id === vendorId)
  }

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(parseFloat(amount))
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#ECFDF5] text-[#22C55E]'
      case 'pending':
        return 'bg-[#FEF3C7] text-[#F59E0B]'
      case 'rejected':
        return 'bg-[#FEF2F2] text-[#EF4444]'
      case 'expired':
        return 'bg-[#F3F4F6] text-[#6B7280]'
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]'
    }
  }

  const getQualityScoreColor = (score: number) => {
    if (score >= 4) return 'text-[#22C55E]'
    if (score >= 3) return 'text-[#F59E0B]'
    return 'text-[#EF4444]'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="p-5 border-b border-[#E2E8F0]">
          <h2 className="text-lg font-medium text-[#0F172A]">Vendor Shortlist</h2>
        </div>
        <div className="p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
      <div className="p-5 border-b border-[#E2E8F0]">
        <h2 className="text-lg font-medium text-[#0F172A]">Vendor Shortlist</h2>
        <p className="text-sm text-[#475569] mt-1">Real quotes from AI voice agent calls</p>
      </div>
      
      <div className="border-b border-[#E2E8F0]">
        <div className="flex overflow-x-auto">
          {(['venue', 'caterer', 'decorator'] as TabType[]).map((tab) => (
            <button
              key={tab}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-light whitespace-nowrap ${
                activeTab === tab
                  ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tabIcons[tab]}
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 divide-y divide-[#E2E8F0]">
        <AnimatePresence mode="wait">
          {getVendorsByType(activeTab).map((vendor, index) => {
            const callLog = getCallLogForVendor(vendor.id)
            
            return (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="py-4 first:pt-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-[#0F172A]">{vendor.vendor_name}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={`${
                              i < vendor.call_quality_score 
                                ? getQualityScoreColor(vendor.call_quality_score)
                                : 'text-[#E2E8F0]'
                            }`}
                            fill={i < vendor.call_quality_score ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-lg font-semibold text-[#0F172A] mb-1">
                      {formatCurrency(vendor.quote_amount, vendor.quote_currency)}
                    </p>
                    
                    <p className="text-sm text-[#475569] mb-2">{vendor.service_description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-[#64748B] mb-3">
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        {vendor.capacity} guests
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(vendor.quote_valid_until).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDuration(vendor.call_duration)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {vendor.inclusions?.slice(0, 3).map((inclusion) => (
                        <span
                          key={inclusion}
                          className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-xs rounded-full flex items-center gap-1"
                        >
                          <CheckCircle size={10} />
                          {inclusion}
                        </span>
                      ))}
                      {vendor.inclusions?.length > 3 && (
                        <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-xs rounded-full">
                          +{vendor.inclusions.length - 3} more
                        </span>
                      )}
                    </div>

                    {callLog && (
                      <div className="bg-[#F8FAFC] rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone size={12} className="text-[#3B82F6]" />
                          <span className="text-xs font-medium text-[#0F172A]">Call Summary</span>
                        </div>
                        <p className="text-xs text-[#475569] line-clamp-2">
                          {callLog.conversation_summary}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 ml-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(vendor.status)}`}>
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                    
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          setSelectedVendor(vendor)
                          setShowCallDetails(true)
                        }}
                        className="px-3 py-1.5 text-xs border border-[#E2E8F0] rounded-full hover:bg-[#F8FAFC] flex items-center gap-1"
                      >
                        <Phone size={10} />
                        Call Details
                      </button>
                      <button className="px-3 py-1.5 text-xs bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A] rounded-full hover:opacity-90 flex items-center gap-1">
                        <ArrowRight size={10} />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {getVendorsByType(activeTab).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center"
          >
            <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building size={24} className="text-[#64748B]" />
            </div>
            <p className="text-[#64748B] text-sm">No {activeTab} quotes yet</p>
            <p className="text-[#94A3B8] text-xs mt-1">Voice agent is working on getting quotes...</p>
          </motion.div>
        )}
      </div>

      {/* Call Details Modal */}
      <AnimatePresence>
        {showCallDetails && selectedVendor && (
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
                    <h3 className="text-xl font-semibold text-[#0F172A]">{selectedVendor.vendor_name}</h3>
                    <p className="text-[#475569] mt-1">{selectedVendor.contact_person}</p>
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
                      <DollarSign size={16} className="text-[#3B82F6]" />
                      <span className="font-medium text-[#0F172A]">Quote</span>
                    </div>
                    <p className="text-2xl font-bold text-[#0F172A]">
                      {formatCurrency(selectedVendor.quote_amount, selectedVendor.quote_currency)}
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">
                      Valid until {new Date(selectedVendor.quote_valid_until).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} className="text-[#3B82F6]" />
                      <span className="font-medium text-[#0F172A]">Call Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-[#0F172A]">
                      {formatDuration(selectedVendor.call_duration)}
                    </p>
                    <p className="text-xs text-[#64748B] mt-1">
                      {new Date(selectedVendor.agent_call_date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-[#0F172A] mb-3">Call Summary</h4>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    {getCallLogForVendor(selectedVendor.id)?.conversation_summary || selectedVendor.agent_notes}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-[#0F172A] mb-3">Key Points</h4>
                  <div className="space-y-2">
                    {getCallLogForVendor(selectedVendor.id)?.key_points?.map((point, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#475569] text-sm">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-[#0F172A] mb-3">Inclusions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.inclusions?.map((inclusion) => (
                      <span
                        key={inclusion}
                        className="px-3 py-1 bg-[#ECFDF5] text-[#22C55E] text-sm rounded-full flex items-center gap-1"
                      >
                        <CheckCircle size={12} />
                        {inclusion}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedVendor.exclusions?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-[#0F172A] mb-3">Exclusions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.exclusions?.map((exclusion) => (
                        <span
                          key={exclusion}
                          className="px-3 py-1 bg-[#FEF2F2] text-[#EF4444] text-sm rounded-full flex items-center gap-1"
                        >
                          <AlertCircle size={12} />
                          {exclusion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
                  <button className="flex-1 px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#0F172A] hover:bg-[#F8FAFC]">
                    Contact Vendor
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A] rounded-lg hover:opacity-90">
                    Approve Quote
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
