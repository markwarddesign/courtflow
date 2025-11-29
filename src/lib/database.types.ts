export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          school_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          school_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          school_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          school_id: string
          name: string
          number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          number: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          number?: string
          created_at?: string
          updated_at?: string
        }
      }
      practice_plans: {
        Row: {
          id: string
          school_id: string
          date: string
          start_time: string
          notes: string | null
          team1_roster: string | null
          team2_roster: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          date: string
          start_time: string
          notes?: string | null
          team1_roster?: string | null
          team2_roster?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          date?: string
          start_time?: string
          notes?: string | null
          team1_roster?: string | null
          team2_roster?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      practice_activities: {
        Row: {
          id: string
          practice_plan_id: string
          clock: string
          end_time: string
          activity: string
          precision: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          practice_plan_id: string
          clock: string
          end_time: string
          activity: string
          precision: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          practice_plan_id?: string
          clock?: string
          end_time?: string
          activity?: string
          precision?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      drills: {
        Row: {
          id: string
          school_id: string
          name: string
          type: string
          focus: string
          description: string
          youtube_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          type: string
          focus: string
          description: string
          youtube_link?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          type?: string
          focus?: string
          description?: string
          youtube_link?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plays: {
        Row: {
          id: string
          school_id: string
          name: string
          type: string
          description: string
          diagram_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          type: string
          description: string
          diagram_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          type?: string
          description?: string
          diagram_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      scouting_reports: {
        Row: {
          id: string
          school_id: string
          opponent: string
          date: string
          personnel: string
          offense_notes: string
          defense_notes: string
          special_notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          opponent: string
          date: string
          personnel: string
          offense_notes: string
          defense_notes: string
          special_notes: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          opponent?: string
          date?: string
          personnel?: string
          offense_notes?: string
          defense_notes?: string
          special_notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
