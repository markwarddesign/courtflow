import React, { useState, useEffect } from 'react'
import { Users, Plus, Trash2, Printer } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/useUserStore'
import type { Database } from '../lib/database.types'

type Player = Database['public']['Tables']['players']['Row']
type PlayerInsert = Database['public']['Tables']['players']['Insert']
type PlayerUpdate = Database['public']['Tables']['players']['Update']

const RosterView: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const { schoolId } = useUserStore()

  const fetchPlayers = async () => {
    if (!schoolId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('school_id', schoolId)
        .order('name')

      if (error) throw error
      setPlayers(data || [])
    } catch (error) {
      console.error('Error fetching players:', error)
      alert('Failed to load players')
    } finally {
      setLoading(false)
    }
  }

  // Fetch players on component mount
  useEffect(() => {
    fetchPlayers()
  }, [schoolId])

  const updatePlayer = async (id: string, field: 'name' | 'number', value: string) => {
    try {
      // Optimistic update
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
      
      // @ts-expect-error - Supabase types infer as never without env vars, but works at runtime
      const { error } = await supabase
        .from('players')
        .update({ [field]: value })
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.error('Error updating player:', error)
      // Revert on error
      fetchPlayers()
    }
  }

  const addNewPlayer = async () => {
    if (!schoolId) return

    const newPlayer: PlayerInsert = {
      school_id: schoolId,
      name: '',
      number: '',
    }

    try {
      // @ts-expect-error - Supabase types infer as never without env vars, but works at runtime
      const { data, error } = await supabase
        .from('players')
        .insert(newPlayer)
        .select()
        .single()

      if (error) throw error
      if (data) setPlayers(prev => [...prev, data])
    } catch (error) {
      console.error('Error adding player:', error)
      alert('Failed to add player')
    }
  }

  const deletePlayer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return

    // Optimistic update
    setPlayers(prev => prev.filter(p => p.id !== id))

    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting player:', error)
      alert('Failed to delete player')
      fetchPlayers() // Revert on error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading players...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-600">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black flex items-center">
              <Users className="w-6 h-6 mr-2 text-red-600" />
              Roster Manager
            </h2>
            <button
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-md print-hidden"
              title="Print Roster"
            >
              <Printer className="w-4 h-4 mr-1" />
              Print Roster
            </button>
          </div>

          {/* Player Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center space-x-2 bg-gray-50 p-3 rounded border border-gray-300 shadow-sm"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={player.name}
                  onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                  className="flex-1 p-1 border border-white rounded text-sm focus:border-red-500 focus:ring-red-500"
                />
                <input
                  type="text"
                  placeholder="#"
                  value={player.number}
                  onChange={(e) => updatePlayer(player.id, 'number', e.target.value)}
                  className="w-12 p-1 border border-white rounded text-sm text-center focus:border-red-500 focus:ring-red-500"
                />
                <button
                  onClick={() => deletePlayer(player.id)}
                  className="text-red-600 hover:text-red-800 transition print-hidden"
                  title="Remove Player"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add New Player Button */}
            <button
              onClick={addNewPlayer}
              className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md print-hidden"
            >
              <Plus className="w-5 h-5 mr-1" />
              Add New Player
            </button>
          </div>

          {/* Print View */}
          <div className="hidden print:block mt-8">
            <h3 className="text-xl font-bold mb-2">
              Current Roster ({players.length} Players)
            </h3>
            <div className="grid grid-cols-3 gap-2 border border-black p-3">
              {players.map((p) => (
                <div key={p.id} className="text-sm">
                  <span className="font-semibold">
                    {p.number ? `[#${p.number}]` : ''}
                  </span>{' '}
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RosterView
