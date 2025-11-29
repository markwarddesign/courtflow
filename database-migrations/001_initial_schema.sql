-- CourtFlow Database Schema
-- Migration 001: Initial Schema Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schools table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create players/roster table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create practice_plans table
CREATE TABLE practice_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  notes TEXT,
  team1_roster TEXT,
  team2_roster TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create practice_activities table (individual drills/activities in a practice plan)
CREATE TABLE practice_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_plan_id UUID NOT NULL REFERENCES practice_plans(id) ON DELETE CASCADE,
  clock TIME NOT NULL,
  end_time TIME NOT NULL,
  activity TEXT NOT NULL,
  precision TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create drills repository table
CREATE TABLE drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Skill', 'Conditioning', 'Team Defense', 'Team Offense', 'Special Situations'
  focus TEXT NOT NULL,
  description TEXT NOT NULL,
  youtube_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create plays/playbook table
CREATE TABLE plays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Offense', 'Defense', 'Special'
  description TEXT NOT NULL,
  diagram_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scouting_reports table
CREATE TABLE scouting_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  opponent TEXT NOT NULL,
  date DATE NOT NULL,
  personnel TEXT NOT NULL,
  offense_notes TEXT NOT NULL,
  defense_notes TEXT NOT NULL,
  special_notes TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_players_school_id ON players(school_id);
CREATE INDEX idx_practice_plans_school_id ON practice_plans(school_id);
CREATE INDEX idx_practice_plans_date ON practice_plans(date);
CREATE INDEX idx_practice_activities_practice_plan_id ON practice_activities(practice_plan_id);
CREATE INDEX idx_drills_school_id ON drills(school_id);
CREATE INDEX idx_plays_school_id ON plays(school_id);
CREATE INDEX idx_scouting_reports_school_id ON scouting_reports(school_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_plans_updated_at BEFORE UPDATE ON practice_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_activities_updated_at BEFORE UPDATE ON practice_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drills_updated_at BEFORE UPDATE ON drills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plays_updated_at BEFORE UPDATE ON plays
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scouting_reports_updated_at BEFORE UPDATE ON scouting_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
