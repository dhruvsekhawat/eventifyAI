import React, { useState, useEffect } from 'react'
import { Phone, Mic, CheckCircle, Clock, AlertCircle, Users, Building, UtensilsCrossed } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

type VoiceAgentActivity = {
  id: string
  status: 'idle' | 'calling' | 'negotiating' | 'completed' | 'failed'
  vendor_name: string
  vendor_type: string
  progress: number
  duration: number
  agent_name: string
  last_update: string
}

export function VoiceAgentStatus() {
  const [activities, setActivities] = useState<VoiceAgentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCalls: 0,
    successfulCalls: 0,
    averageDuration: 0,
    activeAgents: 0
  })

  useEffect(() => {
    fetchVoiceAgentData()
    const interval = setInterval(fetchVoiceAgentData, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchVoiceAgentData = async () => {
    try {
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
      
      // Create activity from event summary
      const activities: VoiceAgentActivity[] = []
      
      if (currentEvent.summary) {
        // Extract quote amount from summary
        const quoteMatch = currentEvent.summary.match(/\$([\d,]+)/)
        const quoteAmount = quoteMatch ? quoteMatch[1].replace(',', '') : null
        
        if (quoteAmount) {
          activities.push({
            id: `event-${currentEvent.id}`,
            status: 'completed',
            vendor_name: 'Venue Contacted',
            vendor_type: 'venue',
            progress: 100,
            duration: 180, // Default 3 minutes
            agent_name: 'Maya',
            last_update: currentEvent.updated_at
          })
        }
      }

      setActivities(activities)

      // Calculate stats from event summary
      const totalCalls = currentEvent.summary ? 1 : 0
      const successfulCalls = currentEvent.summary ? 1 : 0
      const averageDuration = 180 // Default 3 minutes
      const activeAgents = 0 // No active agents currently

      setStats({
        totalCalls,
        successfulCalls,
        averageDuration,
        activeAgents
      })
    } catch (error) {
      console.error('Error fetching voice agent data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-[#22C55E]'
      case 'calling':
        return 'text-[#3B82F6]'
      case 'negotiating':
        return 'text-[#F59E0B]'
      case 'failed':
        return 'text-[#EF4444]'
      default:
        return 'text-[#64748B]'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />
      case 'calling':
        return <Phone size={16} />
      case 'negotiating':
        return <Mic size={16} />
      case 'failed':
        return <AlertCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const getVendorIcon = (type: string) => {
    switch (type) {
      case 'venue':
        return <Building size={14} />
      case 'caterer':
        return <UtensilsCrossed size={14} />
      case 'decorator':
        return <Users size={14} />
      default:
        return <Building size={14} />
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
        <div className="p-5 border-b border-[#E2E8F0]">
          <h2 className="text-lg font-medium text-[#0F172A]">Voice Agent Status</h2>
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
        <h2 className="text-lg font-medium text-[#0F172A]">Voice Agent Status</h2>
        <p className="text-sm text-[#475569] mt-1">Real-time AI agent activity</p>
      </div>

      {/* Stats Row */}
      <div className="p-5 border-b border-[#E2E8F0]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-[#0F172A]">{stats.totalCalls}</div>
            <div className="text-xs text-[#64748B]">Total Calls</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-[#22C55E]">{stats.successfulCalls}</div>
            <div className="text-xs text-[#64748B]">Successful</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-[#3B82F6]">{formatDuration(stats.averageDuration)}</div>
            <div className="text-xs text-[#64748B]">Avg Duration</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-[#F59E0B]">{stats.activeAgents}</div>
            <div className="text-xs text-[#64748B]">Active</div>
          </motion.div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="p-5">
        <h3 className="text-sm font-medium text-[#0F172A] mb-4">Recent Activity</h3>
        
        <div className="space-y-4">
          <AnimatePresence>
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 bg-[#F8FAFC] rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(activity.status)} bg-opacity-10`}>
                    {getStatusIcon(activity.status)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-[#0F172A] truncate">{activity.vendor_name}</h4>
                      <div className="flex items-center gap-1 text-[#64748B]">
                        {getVendorIcon(activity.vendor_type)}
                        <span className="text-xs capitalize">{activity.vendor_type}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(activity.status)} bg-opacity-10`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-[#64748B]">
                      <span>{activity.agent_name}</span>
                      {activity.duration > 0 && (
                        <span>{formatDuration(activity.duration)}</span>
                      )}
                    </div>
                    
                    {activity.status === 'calling' && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></div>
                        <span className="text-xs text-[#3B82F6]">Live</span>
                      </div>
                    )}
                  </div>

                  {activity.status === 'calling' && (
                    <div className="mt-2">
                      <div className="w-full bg-[#E2E8F0] rounded-full h-1">
                        <motion.div
                          className="bg-[#3B82F6] h-1 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${activity.progress}%` }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {activities.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-[#64748B]" />
              </div>
              <p className="text-[#64748B] text-sm">No recent activity</p>
              <p className="text-[#94A3B8] text-xs mt-1">Voice agent will start making calls soon...</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Live Status Indicator */}
      {stats.activeAgents > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-[#ECFDF5] to-[#F0F9FF] border-t border-[#E2E8F0]"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#0F172A]">
              {stats.activeAgents} AI agent{stats.activeAgents > 1 ? 's' : ''} currently making calls
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
