import React from 'react'
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react'

type Task = {
  id: string
  title: string
  dueDate: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  autoNudge: boolean
}

const tasks: Task[] = [
  {
    id: '1',
    title: 'Confirm final headcount with venue',
    dueDate: 'Tomorrow',
    completed: false,
    priority: 'high',
    autoNudge: true,
  },
  {
    id: '2',
    title: 'Review and approve catering menu',
    dueDate: 'In 3 days',
    completed: false,
    priority: 'medium',
    autoNudge: true,
  },
  {
    id: '3',
    title: 'Send welcome email to guests',
    dueDate: 'In 5 days',
    completed: false,
    priority: 'low',
    autoNudge: false,
  },
  {
    id: '4',
    title: 'Book transportation service',
    dueDate: 'Yesterday',
    completed: true,
    priority: 'medium',
    autoNudge: false,
  },
]

const priorityColors = {
  low: 'bg-[#F0F9FF] text-[#0EA5E9]',
  medium: 'bg-[#FEF3C7] text-[#F59E0B]',
  high: 'bg-[#FEE2E2] text-[#EF4444]',
}

export function TasksFollowups() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
      <div className="p-5 border-b border-[#E2E8F0]">
        <h2 className="text-lg font-medium text-[#0F172A]">
          Tasks & Follow-ups
        </h2>
      </div>
      <div className="p-5 divide-y divide-[#E2E8F0]">
        {tasks.map((task) => (
          <div key={task.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {task.completed ? (
                  <CheckCircle size={18} className="text-[#22C55E]" />
                ) : (
                  <Circle size={18} className="text-[#E2E8F0]" />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm ${
                      task.completed
                        ? 'text-[#94A3B8] line-through'
                        : 'text-[#475569]'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
                    <Clock size={14} />
                    <span>{task.dueDate}</span>
                  </div>
                  {task.autoNudge && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#94A3B8]">Auto-nudge</span>
                      <div className="relative inline-block w-8 h-4 rounded-full bg-[#22C55E]">
                        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-5 border-t border-[#E2E8F0] flex justify-center">
        <button className="text-sm text-[#3B82F6] hover:underline">
          Add new task
        </button>
      </div>
    </div>
  )
}
