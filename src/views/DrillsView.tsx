import React, { useState, useEffect } from 'react'
import { Target, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/useUserStore'
import type { Database } from '../lib/database.types'

type Drill = Database['public']['Tables']['drills']['Row']

const DrillsView: React.FC = () => {
  const [drills, setDrills] = useState<Drill[]>([])
  const [expandedDrill, setExpandedDrill] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { schoolId } = useUserStore()

  useEffect(() => {
    fetchDrills()
  }, [schoolId])

  const fetchDrills = async () => {
    if (!schoolId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('drills')
        .select('*')
        .eq('school_id', schoolId)
        .order('name')

      if (error) throw error
      setDrills(data || [])
    } catch (error) {
      console.error('Error fetching drills:', error)
    } finally {
      setLoading(false)
    }
  }

  const addNewDrill = async () => {
    if (!schoolId) return

    const newDrill = {
      school_id: schoolId,
      name: '',
      type: 'Skill',
      focus: '',
      description: '',
      youtube_link: null,
    }

    try {
      const { data, error } = await supabase
        .from('drills')
        .insert(newDrill)
        .select()
        .single()

      if (error) throw error
      if (data) {
        setDrills(prev => [...prev, data])
        setExpandedDrill(data.id)
      }
    } catch (error) {
      console.error('Error adding drill:', error)
    }
  }

    const handleDrillChange = async (id: string, field: keyof Drill, value: string) => {
    setDrills(drills.map(d => d.id === id ? { ...d, [field]: value } : d))
    await supabase
      .from('drills')
      .update({ [field]: value } as DrillUpdate)
      .eq('id', id)
  }

  const deleteDrill = async (id: string) => {
    if (!confirm('Delete this drill?')) return

    setDrills(prev => prev.filter(d => d.id !== id))

    try {
      const { error } = await supabase
        .from('drills')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting drill:', error)
      fetchDrills()
    }
  }

  const getYoutubeEmbedUrl = (url: string | null) => {
    if (!url) return null
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.get('v')) {
        return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`
      }
      if (urlObj.hostname.includes('youtu.be') && urlObj.pathname.length > 1) {
        return `https://www.youtube.com/embed/${urlObj.pathname.substring(1)}`
      }
      return null
    } catch {
      return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading drills...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-600">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black flex items-center">
              <Target className="w-6 h-6 mr-2 text-red-600" />
              Drill Repository
            </h2>
            <button
              onClick={addNewDrill}
              className="gradient-btn flex items-center"
            >
              <Plus className="w-5 h-5 mr-1" />
              Add Drill
            </button>
          </div>

          <div className="space-y-4">
            {drills.map((drill) => (
              <div key={drill.id} className="border border-gray-300 rounded-lg overflow-hidden">
                <div
                  className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => setExpandedDrill(expandedDrill === drill.id ? null : drill.id)}
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={drill.name}
                      onChange={(e) => {
                        e.stopPropagation()
                        updateDrill(drill.id, 'name', e.target.value)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Drill Name"
                      className="font-semibold text-lg bg-transparent border-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                    />
                    <div className="text-sm text-gray-600 mt-1">
                      Type: {drill.type} | Focus: {drill.focus || 'Not specified'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteDrill(drill.id)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {expandedDrill === drill.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {expandedDrill === drill.id && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={drill.type}
                          onChange={(e) => updateDrill(drill.id, 'type', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                        >
                          <option value="Skill">Skill</option>
                          <option value="Conditioning">Conditioning</option>
                          <option value="Team Defense">Team Defense</option>
                          <option value="Team Offense">Team Offense</option>
                          <option value="Special Situations">Special Situations</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Focus Area</label>
                        <input
                          type="text"
                          value={drill.focus}
                          onChange={(e) => updateDrill(drill.id, 'focus', e.target.value)}
                          placeholder="e.g., Ball Handling, Shooting"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={drill.description}
                        onChange={(e) => updateDrill(drill.id, 'description', e.target.value)}
                        rows={4}
                        placeholder="Detailed drill instructions..."
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link</label>
                      <input
                        type="url"
                        value={drill.youtube_link || ''}
                        onChange={(e) => updateDrill(drill.id, 'youtube_link', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                      />
                      {drill.youtube_link && getYoutubeEmbedUrl(drill.youtube_link) && (
                        <div className="mt-3">
                          <iframe
                            width="100%"
                            height="315"
                            src={getYoutubeEmbedUrl(drill.youtube_link) || ''}
                            title="Drill Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {drills.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No drills yet. Add your first drill to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DrillsView
