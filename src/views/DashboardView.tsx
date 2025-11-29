import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Clipboard, Users, Target, Swords, FileText } from 'lucide-react'

const DashboardView: React.FC = () => {
  const navigate = useNavigate()

  const modules = [
    {
      id: 'planner',
      title: 'Practice Planner',
      description: 'Design, clock, and detail your daily basketball practice sessions.',
      icon: Clipboard,
      path: '/practice-planner',
      color: 'red',
    },
    {
      id: 'roster',
      title: 'Roster Manager',
      description: 'Keep track of player names and numbers in one organized place.',
      icon: Users,
      path: '/roster',
      color: 'red',
    },
    {
      id: 'drills',
      title: 'Drill Repository',
      description: 'Save, categorize, and reference your favorite drills with video links.',
      icon: Target,
      path: '/drills',
      color: 'red',
    },
    {
      id: 'plays',
      title: 'Playbook',
      description: 'Store offensive and defensive sets with descriptions and diagrams.',
      icon: Swords,
      path: '/playbook',
      color: 'red',
    },
    {
      id: 'scouting',
      title: 'Scouting Reports',
      description: 'Analyze opponents and save key personnel and strategy notes.',
      icon: FileText,
      path: '/scouting',
      color: 'red',
      fullWidth: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-600">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-black mb-4 flex items-center justify-center">
              <Activity className="w-8 h-8 mr-2 text-red-600" />
              CourtFlow
            </h1>
            <p className="text-gray-700">
              Welcome to the <strong>CourtFlow</strong> coaching suite. Select a module below to manage your team and prepare for practice and games.
            </p>
          </div>

          {/* Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => {
              const Icon = module.icon
              return (
                <div
                  key={module.id}
                  onClick={() => navigate(module.path)}
                  className={`
                    bg-gray-50 p-6 rounded-lg border border-gray-200 
                    hover:border-red-600 transition duration-200 cursor-pointer
                    hover:shadow-lg transform hover:scale-105
                    ${module.fullWidth ? 'md:col-span-2' : ''}
                  `}
                >
                  <Icon className="w-8 h-8 mx-auto text-red-600 mb-3" />
                  <h3 className="text-xl font-bold text-black text-center mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 text-sm text-center">
                    {module.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardView
