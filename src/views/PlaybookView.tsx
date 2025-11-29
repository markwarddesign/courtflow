import React, { useState, useEffect } from 'react'
import { BookOpen, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/useUserStore'
import type { Database } from '../lib/database.types'

type Play = Database['public']['Tables']['plays']['Row']

const PlaybookView: React.FC = () => {
  const [plays, setPlays] = useState<Play[]>([])
  const [loading, setLoading] = useState(true)
  const { schoolId } = useUserStore()

  useEffect(() => {
    fetchPlays()
  }, [schoolId])

  const fetchPlays = async () => {
    if (!schoolId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('plays')
        .select('*')
        .eq('school_id', schoolId)
        .order('name')

      if (error) throw error
      setPlays(data || [])
    } catch (error) {
      console.error('Error fetching plays:', error)
    } finally {
      setLoading(false)
    }
  }

    const addNewPlay = async () => {
    if (!schoolId) return
    const newPlay: PlayInsert = {
      school_id: schoolId,
      name: 'New Play',
      type: 'Offense',
      description: '',
      diagram_url: null
    }
    const { data } = await supabase
      .from('plays')
      .insert(newPlay)
      .select()
      .single()
    
    if (data) {
      setPlays([...plays, data])
    }
  }

    const handlePlayChange = async (id: string, field: keyof Play, value: string) => {
    setPlays(plays.map(p => p.id === id ? { ...p, [field]: value } : p))
    await supabase
      .from('plays')
      .update({ [field]: value } as PlayUpdate)
      .eq('id', id)
  }

  const deletePlay = async (id: string) => {
    if (!confirm('Delete this play?')) return

    setPlays(prev => prev.filter(p => p.id !== id))

    try {
      const { error } = await supabase
        .from('plays')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting play:', error)
      fetchPlays()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading playbook...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-600">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black flex items-center">
              <Swords className="w-6 h-6 mr-2 text-red-600" />
              Playbook
            </h2>
            <button onClick={addNewPlay} className="gradient-btn flex items-center">
              <Plus className="w-5 h-5 mr-1" />
              Add Play
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plays.map((play) => (
              <div key={play.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={play.name}
                    onChange={(e) => updatePlay(play.id, 'name', e.target.value)}
                    placeholder="Play Name"
                    className="font-bold text-lg flex-1 bg-transparent border-b-2 border-gray-300 focus:border-red-500 px-1"
                  />
                  <button
                    onClick={() => deletePlay(play.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <select
                  value={play.type}
                  onChange={(e) => updatePlay(play.id, 'type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-red-500"
                >
                  <option value="Offense">Offense</option>
                  <option value="Defense">Defense</option>
                  <option value="Special">Special</option>
                </select>

                <textarea
                  value={play.description}
                  onChange={(e) => updatePlay(play.id, 'description', e.target.value)}
                  rows={4}
                  placeholder="Play description and instructions..."
                  className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-red-500 resize-none"
                />

                <input
                  type="url"
                  value={play.diagram_url || ''}
                  onChange={(e) => updatePlay(play.id, 'diagram_url', e.target.value)}
                  placeholder="Diagram URL (optional)"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                />

                {play.diagram_url && (
                  <div className="mt-3">
                    <img
                      src={play.diagram_url}
                      alt="Play Diagram"
                      className="w-full h-auto rounded border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {plays.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Swords className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No plays yet. Add your first play to start building your playbook!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlaybookView
