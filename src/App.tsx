import React, { useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'
import { supabase } from './lib/supabase'
import { useUserStore } from './store/useUserStore'
import type { User } from '@supabase/supabase-js'

// Views
import DashboardView from './views/DashboardView'
import RosterView from './views/RosterView'
import PracticePlanView from './views/PracticePlanView'
import DrillsView from './views/DrillsView'
import PlaybookView from './views/PlaybookView'
import ScoutingView from './views/ScoutingView'

const Navigation: React.FC = () => {
  const location = useLocation()

  return (
    <header className="bg-black text-white p-4 shadow-lg print-hidden sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold flex items-center hover:opacity-80 transition"
        >
          <Home className="w-6 h-6 mr-2 text-red-500" />
          CourtFlow
        </Link>

        <nav className="hidden md:flex space-x-4">
          <Link
            to="/practice-planner"
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              location.pathname === '/practice-planner'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Planner
          </Link>
          <Link
            to="/roster"
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              location.pathname === '/roster'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Roster
          </Link>
          <Link
            to="/drills"
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              location.pathname === '/drills'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Drills
          </Link>
          <Link
            to="/playbook"
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              location.pathname === '/playbook'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Plays
          </Link>
          <Link
            to="/scouting"
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              location.pathname === '/scouting'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Scouting
          </Link>
        </nav>
      </div>
    </header>
  )
}

const App: React.FC = () => {
  const { user, schoolId, setUser, setSchoolId } = useUserStore()

  const createDefaultSchool = useCallback(async (userId: string) => {
    try {
      // Create school
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert({ name: 'My Team' })
        .select()
        .single()

      if (schoolError) throw schoolError

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          school_id: schoolData.id,
          email: null,
          full_name: 'Coach',
        })

      if (userError) throw userError

      setSchoolId(schoolData.id)
    } catch (error) {
      console.error('Error creating default school:', error)
    }
  }, [setSchoolId])

  const fetchOrCreateUserProfile = useCallback(async (userId: string) => {
    try {
      // Check if user profile exists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError && userError.code !== 'PGRST116') {
        throw userError
      }

      if (userData) {
        // User exists, get school ID
        if (userData.school_id) {
          setSchoolId(userData.school_id)
        } else {
          // Create a default school for this user
          await createDefaultSchool(userId)
        }
      } else {
        // Create user profile and school
        await createDefaultSchool(userId)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [setSchoolId, createDefaultSchool])

  const signInAnonymously = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) {
        // If anonymous auth is disabled, create a mock user for demo
        console.warn('⚠️ Anonymous authentication is not enabled in Supabase')
        console.log('📝 To fix this:')
        console.log('   1. Go to your Supabase Dashboard')
        console.log('   2. Click Authentication → Providers')
        console.log('   3. Enable "Anonymous" sign-in')
        console.log('   4. Refresh this page')
        console.log('')
        console.log('📖 See ENABLE_AUTH.md for detailed instructions')
        console.log('🔄 Running in demo mode (data will not persist)')
        // Set a mock demo state
        const demoSchoolId = 'demo-school-id'
        setSchoolId(demoSchoolId)
        const demoUser: User = {
          id: 'demo-user',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
        }
        setUser(demoUser)
        return
      }
      if (data.user) {
        setUser(data.user)
        await fetchOrCreateUserProfile(data.user.id)
      }
    } catch (error) {
      console.error('Error signing in anonymously:', error)
      // Fallback to demo mode
      setSchoolId('demo-school-id')
      const demoUser: User = {
        id: 'demo-user',
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
      }
      setUser(demoUser)
    }
  }, [setUser, setSchoolId, fetchOrCreateUserProfile])

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchOrCreateUserProfile(session.user.id)
      } else {
        // Anonymous sign in for demo purposes
        signInAnonymously()
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchOrCreateUserProfile(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, fetchOrCreateUserProfile, signInAnonymously])

  if (!user || !schoolId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading CourtFlow...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans pb-20 print:pb-0 print:bg-white">
        <style>
          {`
            @media print {
              .print-hidden {
                display: none !important;
              }
              @page {
                size: 11in 8.5in;
                margin: 0.5in;
              }
              body {
                margin: 0;
              }
            }
          `}
        </style>
        <Navigation />
        <main className="max-w-6xl mx-auto p-4 md:p-8 print:p-0">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/practice-planner" element={<PracticePlanView />} />
            <Route path="/roster" element={<RosterView />} />
            <Route path="/drills" element={<DrillsView />} />
            <Route path="/playbook" element={<PlaybookView />} />
            <Route path="/scouting" element={<ScoutingView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
