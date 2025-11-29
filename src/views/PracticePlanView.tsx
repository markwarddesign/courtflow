import React, { useState, useEffect } from 'react'
import { Printer, Plus, Trash2, Target, Swords, Users, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/useUserStore'
import type { Database } from '../lib/database.types'

type PracticePlan = Database['public']['Tables']['practice_plans']['Row']
type PracticeActivity = Database['public']['Tables']['practice_activities']['Row']

interface PlanWithActivities extends PracticePlan {
  activities: PracticeActivity[]
}

const PracticePlanView: React.FC = () => {
  const [plans, setPlans] = useState<PlanWithActivities[]>([])
  const [currentPlan, setCurrentPlan] = useState<PlanWithActivities | null>(null)
  const [loading, setLoading] = useState(true)
  const { schoolId } = useUserStore()

  useEffect(() => {
    fetchPlans()
  }, [schoolId])

  const fetchPlans = async () => {
    if (!schoolId) return

    try {
      setLoading(true)
      const { data: plansData, error } = await supabase
        .from('practice_plans')
        .select(`
          *,
          practice_activities (*)
        `)
        .eq('school_id', schoolId)
        .order('date', { ascending: false })

      if (error) throw error

      const formatted = plansData.map(plan => ({
        ...plan,
        activities: (plan.practice_activities || []).sort((a: any, b: any) => a.order_index - b.order_index)
      }))

      setPlans(formatted)
      if (formatted.length > 0 && !currentPlan) {
        setCurrentPlan(formatted[0])
      }
    } catch (error) {
      console.error('Error fetching practice plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewPlan = async () => {
    if (!schoolId) return

    const newPlan = {
      school_id: schoolId,
      date: new Date().toISOString().split('T')[0],
      start_time: '16:00:00',
      notes: 'Today\'s focus areas...',
      team1_roster: '',
      team2_roster: '',
    }

    try {
      const { data, error } = await supabase
        .from('practice_plans')
        .insert(newPlan)
        .select()
        .single()

      if (error) throw error

      // Create default activities
      const defaultActivities = [
        { clock: '16:00:00', end_time: '16:15:00', activity: 'Warm-up / Stretching', precision: 'Focus on dynamic stretching and injury prevention routines.', order_index: 0 },
        { clock: '16:15:00', end_time: '16:30:00', activity: 'Ball Handling Drills', precision: 'Mikan drill, figure 8s, weak-hand emphasis.', order_index: 1 },
      ]

      const activitiesWithPlanId = defaultActivities.map(act => ({
        ...act,
        practice_plan_id: data.id,
      }))

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('practice_activities')
        .insert(activitiesWithPlanId)
        .select()

      if (activitiesError) throw activitiesError

      const newPlanWithActivities: PlanWithActivities = {
        ...data,
        activities: activitiesData,
      }

      setPlans(prev => [newPlanWithActivities, ...prev])
      setCurrentPlan(newPlanWithActivities)
    } catch (error) {
      console.error('Error creating plan:', error)
      alert('Failed to create practice plan')
    }
  }

  const updatePlanField = async (field: keyof PracticePlan, value: string) => {
    if (!currentPlan) return

    const updated = { ...currentPlan, [field]: value }
    setCurrentPlan(updated)

    try {
      const { error } = await supabase
        .from('practice_plans')
        .update({ [field]: value })
        .eq('id', currentPlan.id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating plan:', error)
    }
  }

  const updateActivity = async (activityId: string, field: keyof PracticeActivity, value: string) => {
    if (!currentPlan) return

    const updatedActivities = currentPlan.activities.map(act =>
      act.id === activityId ? { ...act, [field]: value } : act
    )

    setCurrentPlan({ ...currentPlan, activities: updatedActivities })

    try {
      const { error } = await supabase
        .from('practice_activities')
        .update({ [field]: value })
        .eq('id', activityId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating activity:', error)
    }
  }

  const addActivity = async (afterIndex?: number) => {
    if (!currentPlan) return

    const orderIndex = afterIndex !== undefined ? afterIndex + 1 : currentPlan.activities.length

    const newActivity = {
      practice_plan_id: currentPlan.id,
      clock: '16:00:00',
      end_time: '16:15:00',
      activity: '',
      precision: '',
      order_index: orderIndex,
    }

    try {
      const { data, error } = await supabase
        .from('practice_activities')
        .insert(newActivity)
        .select()
        .single()

      if (error) throw error

      const updatedActivities = [...currentPlan.activities]
      updatedActivities.splice(orderIndex, 0, data)

      // Reindex
      const reindexed = updatedActivities.map((act, idx) => ({ ...act, order_index: idx }))

      setCurrentPlan({ ...currentPlan, activities: reindexed })
    } catch (error) {
      console.error('Error adding activity:', error)
    }
  }

  const deleteActivity = async (activityId: string) => {
    if (!currentPlan) return

    const updated = currentPlan.activities.filter(act => act.id !== activityId)
    setCurrentPlan({ ...currentPlan, activities: updated })

    try {
      const { error } = await supabase
        .from('practice_activities')
        .delete()
        .eq('id', activityId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting activity:', error)
      fetchPlans()
    }
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ''
    try {
      const [hours, minutes] = timeString.split(':').map(Number)
      const date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes)
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    } catch {
      return timeString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading practice plans...</div>
      </div>
    )
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-12 rounded-xl shadow-2xl border-t-4 border-red-600">
            <h2 className="text-2xl font-bold text-black mb-4">No Practice Plans Yet</h2>
            <p className="text-gray-600 mb-6">Create your first practice plan to get started.</p>
            <button
              onClick={createNewPlan}
              className="gradient-btn flex items-center justify-center mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Practice Plan
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-600">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0 mb-6 print-hidden">
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Date:
                <input
                  type="date"
                  value={currentPlan.date}
                  onChange={(e) => updatePlanField('date', e.target.value)}
                  className="ml-2 p-1 border border-gray-300 rounded text-sm focus:border-red-500"
                />
              </label>
              <label className="flex items-center text-sm font-medium text-gray-700">
                Start Time:
                <input
                  type="time"
                  value={currentPlan.start_time}
                  onChange={(e) => updatePlanField('start_time', e.target.value)}
                  className="ml-2 p-1 border border-gray-300 rounded text-sm focus:border-red-500"
                />
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={createNewPlan}
                className="flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
              >
                <Plus className="w-4 h-4 mr-1" /> New Plan
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-md"
              >
                <Printer className="w-4 h-4 mr-1" /> Print
              </button>
            </div>
          </div>

          {/* Print-Only Header */}
          <div className="hidden print:block mb-4 text-center">
            <h2 className="text-2xl font-extrabold text-black uppercase">
              Practice Plan - {new Date(currentPlan.date).toLocaleDateString()}
            </h2>
            <p className="text-sm text-gray-700">Start Time: {formatTime(currentPlan.start_time)}</p>
          </div>

          {/* Practice Activities Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-600 text-white uppercase text-xs font-bold tracking-wider">
                  <th className="p-2 w-12 print-hidden"></th>
                  <th className="p-2 w-20 border-r border-red-700">Clock</th>
                  <th className="p-2 w-20 border-r border-red-700">End Time</th>
                  <th className="p-2 w-1/3 border-r border-red-700">Activity / Drill</th>
                  <th className="p-2 w-2/3">Points of Precision / Coaching Cues</th>
                </tr>
              </thead>
              <tbody>
                {currentPlan.activities.map((activity, index) => (
                  <tr key={activity.id} className="border-b border-gray-300 hover:bg-red-50 transition">
                    <td className="p-1 print-hidden">
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => deleteActivity(activity.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete Row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => addActivity(index)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Add Row Below"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-1 border-r border-gray-300">
                      <input
                        type="time"
                        value={activity.clock}
                        onChange={(e) => updateActivity(activity.id, 'clock', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded text-sm focus:border-red-500 print:border-none"
                      />
                    </td>
                    <td className="p-1 border-r border-gray-300">
                      <input
                        type="time"
                        value={activity.end_time}
                        onChange={(e) => updateActivity(activity.id, 'end_time', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded text-sm focus:border-red-500 print:border-none"
                      />
                    </td>
                    <td className="p-1 border-r border-gray-300">
                      <textarea
                        value={activity.activity}
                        onChange={(e) => updateActivity(activity.id, 'activity', e.target.value)}
                        rows={2}
                        className="w-full h-12 p-1 border border-gray-300 rounded text-sm focus:border-red-500 resize-none print:border-none print:h-auto"
                      />
                    </td>
                    <td className="p-1">
                      <textarea
                        value={activity.precision}
                        onChange={(e) => updateActivity(activity.id, 'precision', e.target.value)}
                        rows={2}
                        className="w-full h-12 p-1 border border-gray-300 rounded text-sm focus:border-red-500 resize-none print:border-none print:h-auto"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Activity Button */}
          <div className="mt-4 text-center print-hidden">
            <button
              onClick={() => addActivity()}
              className="flex items-center justify-center mx-auto px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Activity Row
            </button>
          </div>

          {/* Team Rosters and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="border border-gray-300 rounded-lg p-3">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-1 text-red-600" /> Team 1 Roster
              </h4>
              <textarea
                value={currentPlan.team1_roster || ''}
                onChange={(e) => updatePlanField('team1_roster', e.target.value)}
                rows={6}
                placeholder="List of players for Team 1 (e.g., Starters)"
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:border-red-500 print:border-none"
              />
            </div>
            <div className="border border-gray-300 rounded-lg p-3">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-1 text-red-600" /> Team 2 Roster
              </h4>
              <textarea
                value={currentPlan.team2_roster || ''}
                onChange={(e) => updatePlanField('team2_roster', e.target.value)}
                rows={6}
                placeholder="List of players for Team 2 (e.g., Bench Unit)"
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:border-red-500 print:border-none"
              />
            </div>
            <div className="border border-gray-300 rounded-lg p-3">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-1 text-red-600" /> General Notes
              </h4>
              <textarea
                value={currentPlan.notes || ''}
                onChange={(e) => updatePlanField('notes', e.target.value)}
                rows={6}
                placeholder="General notes, facility needs, reminders, etc."
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:border-red-500 print:border-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticePlanView
