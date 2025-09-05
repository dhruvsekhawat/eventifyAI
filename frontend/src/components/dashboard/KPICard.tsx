import React from 'react'
import { motion } from 'framer-motion'

interface KPICardProps {
  title: string
  value: string | number
  subValue?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  loading?: boolean
}

export function KPICard({ 
  title, 
  value, 
  subValue, 
  icon, 
  trend, 
  trendValue, 
  loading = false 
}: KPICardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-[#22C55E]'
      case 'down':
        return 'text-[#EF4444]'
      default:
        return 'text-[#64748B]'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗'
      case 'down':
        return '↘'
      default:
        return '→'
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-4 bg-[#F1F5F9] rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-[#F1F5F9] rounded-full animate-pulse"></div>
        </div>
        <div className="w-20 h-8 bg-[#F1F5F9] rounded animate-pulse mb-2"></div>
        <div className="w-24 h-4 bg-[#F1F5F9] rounded animate-pulse"></div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#64748B]">{title}</h3>
        <div className="w-8 h-8 bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-[#0F172A]">{value}</span>
        {subValue && (
          <span className="text-sm text-[#64748B]">{subValue}</span>
        )}
      </div>
      
      {trend && trendValue && (
        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
          <span className="text-xs">{getTrendIcon()}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </motion.div>
  )
}
