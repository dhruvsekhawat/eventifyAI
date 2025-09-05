import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KPICard } from '../components/dashboard/KPICard'
import { VendorShortlist } from '../components/dashboard/VendorShortlist'
import { MessageThreads } from '../components/dashboard/MessageThreads'
import { VoiceAgentStatus } from '../components/dashboard/VoiceAgentStatus'
import { TasksFollowups } from '../components/dashboard/TasksFollowups'
import { RSVPSnapshot } from '../components/dashboard/RSVPSnapshot'
import { PaymentsSnapshot } from '../components/dashboard/PaymentsSnapshot'
import { Users, ShoppingBag, DollarSign, Calendar, Plus, Phone, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'

type DashboardData = {
  totalGuests: number
  totalVendors: number
  totalBudget: number
  daysUntilEvent: number
  confirmedVendors: number
  totalQuotes: number
  averageCallQuality: number
  recentCalls: number
}

export function Dashboard() {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalGuests: 0,
    totalVendors: 0,
    totalBudget: 0,
    daysUntilEvent: 0,
    confirmedVendors: 0,
    totalQuotes: 0,
    averageCallQuality: 0,
    recentCalls: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
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
      
      // Fetch guests
      const { data: guests } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', currentEvent.id)

      // Parse event summary for quote information
      let totalQuotes = 0
      let averageCallQuality = 0
      let recentCalls = 0
      
      if (currentEvent.summary) {
        // Extract quote count from summary
        const quoteMatches = currentEvent.summary.match(/\$/g)
        totalQuotes = quoteMatches ? quoteMatches.length : 0
        
        // Set default call quality if summary exists
        averageCallQuality = 4.0
        
        // Count as recent call if summary was updated recently
        const summaryDate = new Date(currentEvent.updated_at)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        if (summaryDate > sevenDaysAgo) {
          recentCalls = 1
        }
      }

      // Calculate metrics
      const totalGuests = guests?.length || 0
      const totalVendors = totalQuotes // Use quote count as vendor count
      const confirmedVendors = 0 // No confirmed vendors yet
      const totalBudget = currentEvent.budget || 0
      
      // Calculate days until event
      const eventDate = new Date(currentEvent.event_date)
      const today = new Date()
      const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      setDashboardData({
        totalGuests,
        totalVendors,
        totalBudget,
        daysUntilEvent,
        confirmedVendors,
        totalQuotes,
        averageCallQuality,
        recentCalls
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNewEvent = () => {
    navigate('/onboarding')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#CFFAFE]/20 to-[#A7F3D0]/20 pt-12 pb-16"
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-light text-[#0F172A]">
                Your Event Planning Dashboard
              </h1>
              <p className="mt-2 text-[#475569] font-light">
                Track all your event details in one place. {dashboardData.daysUntilEvent > 0 
                  ? `Next milestone: Event in ${dashboardData.daysUntilEvent} days.`
                  : 'Your event is today!'
                }
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNewEvent}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A] rounded-full hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
              Create New Event
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-8">
        {/* KPI Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <KPICard
            title="Guests"
            value={dashboardData.totalGuests}
            subValue="/120"
            icon={<Users size={20} />}
            loading={loading}
          />
          <KPICard
            title="Vendors"
            value={dashboardData.confirmedVendors}
            subValue={`/${dashboardData.totalVendors} confirmed`}
            icon={<ShoppingBag size={20} />}
            loading={loading}
          />
          <KPICard
            title="Budget"
            value={formatCurrency(dashboardData.totalBudget)}
            subValue="/25,000"
            icon={<DollarSign size={20} />}
            loading={loading}
          />
          <KPICard
            title="Timeline"
            value={dashboardData.daysUntilEvent > 0 ? `${dashboardData.daysUntilEvent} days` : 'Today!'}
            subValue="until event"
            icon={<Calendar size={20} />}
            loading={loading}
          />
        </motion.div>

        {/* Voice Agent Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
        >
          <KPICard
            title="Total Quotes"
            value={dashboardData.totalQuotes}
            icon={<ShoppingBag size={20} />}
            loading={loading}
          />
          <KPICard
            title="Recent Calls"
            value={dashboardData.recentCalls}
            subValue="last 7 days"
            icon={<Phone size={20} />}
            loading={loading}
          />
          <KPICard
            title="Call Quality"
            value={dashboardData.averageCallQuality}
            subValue="/5.0"
            icon={<Star size={20} />}
            loading={loading}
          />
          <KPICard
            title="Success Rate"
            value={`${dashboardData.totalVendors > 0 ? Math.round((dashboardData.confirmedVendors / dashboardData.totalVendors) * 100) : 0}%`}
            icon={<Users size={20} />}
            loading={loading}
          />
        </motion.div>

        {/* Two Column Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column (8) */}
          <div className="lg:col-span-8">
            <VendorShortlist />
            <VoiceAgentStatus />
            <MessageThreads />
          </div>
          {/* Right Column (4) */}
          <div className="lg:col-span-4">
            <TasksFollowups />
            <RSVPSnapshot />
            <PaymentsSnapshot />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
