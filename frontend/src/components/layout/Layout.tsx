import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, ChevronDown, Bell, Settings, User, LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="font-medium text-[#0F172A]">
              Eventify AI
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-full text-sm text-[#475569]">
              <span>Summer Gala 2024</span>
              <ChevronDown size={16} />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden md:flex items-center">
              <Search size={18} className="absolute left-3 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-[#F8FAFC] rounded-md text-sm border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] w-[180px] lg:w-[240px]"
              />
            </div>
            <button className="p-2 text-[#475569] hover:bg-[#F8FAFC] rounded-full">
              <Bell size={20} />
            </button>
            <Link to="/settings" className="p-2 text-[#475569] hover:bg-[#F8FAFC] rounded-full">
              <Settings size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#3B82F6] rounded-full flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-[#475569] hover:bg-[#F8FAFC] rounded-full"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow">{children}</main>
    </div>
  )
}
