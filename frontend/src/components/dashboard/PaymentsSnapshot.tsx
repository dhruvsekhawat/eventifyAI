import React from 'react'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

type Payment = {
  id: string
  vendor: string
  amount: string
  dueDate: string
  status: 'paid' | 'pending' | 'overdue'
}

const payments: Payment[] = [
  {
    id: '1',
    vendor: 'Grand Ballroom',
    amount: '$3,500',
    dueDate: 'Paid on May 15',
    status: 'paid',
  },
  {
    id: '2',
    vendor: 'Gourmet Delights',
    amount: '$1,200',
    dueDate: 'Due in 5 days',
    status: 'pending',
  },
  {
    id: '3',
    vendor: 'Modern Decor Co.',
    amount: '$800',
    dueDate: 'Overdue by 2 days',
    status: 'overdue',
  },
]

const statusIcons = {
  paid: <CheckCircle size={16} className="text-[#22C55E]" />,
  pending: <Clock size={16} className="text-[#F59E0B]" />,
  overdue: <AlertCircle size={16} className="text-[#EF4444]" />,
}

const statusClasses = {
  paid: 'bg-[#ECFDF5] text-[#22C55E]',
  pending: 'bg-[#FEF3C7] text-[#F59E0B]',
  overdue: 'bg-[#FEE2E2] text-[#EF4444]',
}

export function PaymentsSnapshot() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm mt-6">
      <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center">
        <h2 className="text-lg font-medium text-[#0F172A]">Payments</h2>
        <div className="flex items-center gap-1">
          <svg
            width="32"
            height="20"
            viewBox="0 0 32 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="20" rx="4" fill="#635BFF" />
            <path
              d="M13.9 8.2C13.9 7.1 14.7 6.4 15.9 6.4C16.8 6.4 17.4 6.9 17.6 7.7H19.1C18.8 6.2 17.6 5.1 15.9 5.1C14 5.1 12.5 6.6 12.5 8.4C12.5 10.2 14 11.7 15.9 11.7C17.6 11.7 18.8 10.6 19.1 9.1H17.6C17.4 9.9 16.8 10.4 15.9 10.4C14.7 10.4 13.9 9.6 13.9 8.5V8.2Z"
              fill="white"
            />
          </svg>
          <span className="text-xs text-[#94A3B8]">Powered by Stripe</span>
        </div>
      </div>
      <div className="p-5 divide-y divide-[#E2E8F0]">
        {payments.map((payment) => (
          <div key={payment.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-[#0F172A]">{payment.vendor}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {statusIcons[payment.status]}
                  <span className="text-xs text-[#94A3B8]">
                    {payment.dueDate}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-light text-[#0F172A]">
                  {payment.amount}
                </span>
                <span
                  className={`mt-1 text-xs px-2 py-0.5 rounded-full ${statusClasses[payment.status]}`}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-5 border-t border-[#E2E8F0]">
        <button className="w-full py-2 text-sm bg-gradient-to-r from-[#CFFAFE] to-[#A7F3D0] text-[#0F172A] rounded-full hover:opacity-90">
          View all payments
        </button>
      </div>
    </div>
  )
}
