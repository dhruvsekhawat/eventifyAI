import React, { useState } from 'react'
import { Building, UtensilsCrossed, Palette } from 'lucide-react'

type Vendor = {
  id: string
  name: string
  total: string
  inclusions: string[]
  available: boolean
}

type TabType = 'venue' | 'catering' | 'decor'

const vendors: Record<TabType, Vendor[]> = {
  venue: [
    {
      id: '1',
      name: 'Grand Ballroom',
      total: '$12,500',
      inclusions: ['AV', 'Tables', 'Parking'],
      available: true,
    },
    {
      id: '2',
      name: 'Lakeside Manor',
      total: '$15,800',
      inclusions: ['AV', 'Security'],
      available: true,
    },
    {
      id: '3',
      name: 'Urban Loft',
      total: '$9,200',
      inclusions: ['Tables', 'Chairs'],
      available: false,
    },
  ],
  catering: [
    {
      id: '4',
      name: 'Gourmet Delights',
      total: '$85/person',
      inclusions: ['Staff', 'Dessert'],
      available: true,
    },
    {
      id: '5',
      name: 'Fusion Catering',
      total: '$92/person',
      inclusions: ['Staff', 'Bar', 'Dessert'],
      available: true,
    },
    {
      id: '6',
      name: 'Elegant Eats',
      total: '$78/person',
      inclusions: ['Staff'],
      available: true,
    },
  ],
  decor: [
    {
      id: '7',
      name: 'Floral Fantasies',
      total: '$3,200',
      inclusions: ['Setup', 'Delivery'],
      available: true,
    },
    {
      id: '8',
      name: 'Modern Decor Co.',
      total: '$2,800',
      inclusions: ['Setup'],
      available: true,
    },
    {
      id: '9',
      name: 'Elegant Arrangements',
      total: '$4,100',
      inclusions: ['Setup', 'Delivery', 'Lighting'],
      available: false,
    },
  ],
}

export function VendorShortlist() {
  const [activeTab, setActiveTab] = useState<TabType>('venue')
  
  const tabIcons = {
    venue: <Building size={16} />,
    catering: <UtensilsCrossed size={16} />,
    decor: <Palette size={16} />,
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
      <div className="p-5 border-b border-[#E2E8F0]">
        <h2 className="text-lg font-medium text-[#0F172A]">Vendor Shortlist</h2>
      </div>
      <div className="border-b border-[#E2E8F0]">
        <div className="flex">
          {(['venue', 'catering', 'decor'] as TabType[]).map((tab) => (
            <button
              key={tab}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-light capitalize ${
                activeTab === tab
                  ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tabIcons[tab]}
              {tab}
            </button>
          ))}
        </div>

      </div>
      <div className="p-5 divide-y divide-[#E2E8F0]">
        {vendors[activeTab].map((vendor) => (
          <div key={vendor.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-[#0F172A]">{vendor.name}</h3>
                <p className="text-sm text-[#475569] mt-1">{vendor.total}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {vendor.inclusions.map((inclusion) => (
                    <span
                      key={inclusion}
                      className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-xs rounded-full"
                    >
                      {inclusion}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    vendor.available
                      ? 'bg-[#ECFDF5] text-[#22C55E]'
                      : 'bg-[#FEF2F2] text-[#EF4444]'
                  }`}
                >
                  {vendor.available ? 'Available' : 'Unavailable'}
                </span>
                <div className="flex gap-2 mt-1">
                  <button className="px-3 py-1.5 text-xs border border-[#E2E8F0] rounded-full hover:bg-[#F8FAFC]">
                    View Quote
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A] rounded-full hover:opacity-90">
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
