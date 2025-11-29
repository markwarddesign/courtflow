import React, { useState, useEffect } from 'react'
import { FileSearch, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/useUserStore'
import type { Database } from '../lib/database.types'

type ScoutingReport = Database['public']['Tables']['scouting_reports']['Row']

const ScoutingView: React.FC = () => {
  const [reports, setReports] = useState<ScoutingReport[]>([])
  const [loading, setLoading] = useState(true)
  const { schoolId } = useUserStore()

  useEffect(() => {
    fetchReports()
  }, [schoolId])

  const fetchReports = async () => {
    if (!schoolId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('scouting_reports')
        .select('*')
        .eq('school_id', schoolId)
        .order('date', { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (error) {
      console.error('Error fetching scouting reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const addNewReport = async () => {
    if (!schoolId) return

    const newReport = {
      school_id: schoolId,
      opponent: '',
      date: new Date().toISOString().split('T')[0],
      personnel: '',
      offense_notes: '',
      defense_notes: '',
      special_notes: '',
    }

    try {
      const { data, error } = await supabase
        .from('scouting_reports')
        .insert(newReport)
        .select()
        .single()

      if (error) throw error
      if (data) setReports(prev => [data, ...prev])
    } catch (error) {
      console.error('Error adding report:', error)
    }
  }

    const handleReportChange = async (id: string, field: keyof ScoutingReport, value: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, [field]: value } : r))
    await supabase
      .from('scouting_reports')
      .update({ [field]: value } as ScoutingReportUpdate)
      .eq('id', id)
  }

  const deleteReport = async (id: string) => {
    if (!confirm('Delete this scouting report?')) return

    setReports(prev => prev.filter(r => r.id !== id))

    try {
      const { error } = await supabase
        .from('scouting_reports')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting report:', error)
      fetchReports()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading scouting reports...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-600">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black flex items-center">
              <FileText className="w-6 h-6 mr-2 text-red-600" />
              Scouting Reports
            </h2>
            <button onClick={addNewReport} className="gradient-btn flex items-center">
              <Plus className="w-5 h-5 mr-1" />
              New Report
            </button>
          </div>

          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report.id} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={report.opponent}
                      onChange={(e) => updateReport(report.id, 'opponent', e.target.value)}
                      placeholder="Opponent Name"
                      className="font-bold text-xl bg-white border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="date"
                      value={report.date}
                      onChange={(e) => updateReport(report.id, 'date', e.target.value)}
                      className="bg-white border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Key Personnel & Players
                    </label>
                    <textarea
                      value={report.personnel}
                      onChange={(e) => updateReport(report.id, 'personnel', e.target.value)}
                      rows={3}
                      placeholder="Notable players, jersey numbers, strengths/weaknesses..."
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Offensive Tendencies
                    </label>
                    <textarea
                      value={report.offense_notes}
                      onChange={(e) => updateReport(report.id, 'offense_notes', e.target.value)}
                      rows={4}
                      placeholder="Offensive sets, preferred plays, ball screens, transition..."
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Defensive Tendencies
                    </label>
                    <textarea
                      value={report.defense_notes}
                      onChange={(e) => updateReport(report.id, 'defense_notes', e.target.value)}
                      rows={4}
                      placeholder="Defense type (man/zone), pressure, help defense..."
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Situations & Notes
                    </label>
                    <textarea
                      value={report.special_notes}
                      onChange={(e) => updateReport(report.id, 'special_notes', e.target.value)}
                      rows={3}
                      placeholder="Inbound plays, press breaks, late-game tendencies..."
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No scouting reports yet. Add your first report to start analyzing opponents!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScoutingView
