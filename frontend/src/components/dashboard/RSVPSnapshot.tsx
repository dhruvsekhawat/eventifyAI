import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  {
    name: 'Going',
    value: 65,
    color: '#22C55E',
  },
  {
    name: 'Not Going',
    value: 20,
    color: '#EF4444',
  },
  {
    name: 'Unknown',
    value: 15,
    color: '#94A3B8',
  },
]

const COLORS = ['#22C55E', '#EF4444', '#94A3B8']

export function RSVPSnapshot() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm mt-6">
      <div className="p-5 border-b border-[#E2E8F0]">
        <h2 className="text-lg font-medium text-[#0F172A]">RSVP Snapshot</h2>
      </div>
      <div className="p-5 flex flex-col items-center">
        <div className="w-full h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-2xl font-light text-[#0F172A]">
                {item.value}%
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                ></div>
                <span className="text-sm text-[#475569]">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full mt-4 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-[#F1F5F9] text-[#475569] text-xs rounded-full">
            12 Vegetarian
          </span>
          <span className="px-2 py-1 bg-[#F1F5F9] text-[#475569] text-xs rounded-full">
            8 Vegan
          </span>
          <span className="px-2 py-1 bg-[#F1F5F9] text-[#475569] text-xs rounded-full">
            5 Gluten-free
          </span>
          <span className="px-2 py-1 bg-[#F1F5F9] text-[#475569] text-xs rounded-full">
            3 Nut allergies
          </span>
        </div>
      </div>
    </div>
  )
}
