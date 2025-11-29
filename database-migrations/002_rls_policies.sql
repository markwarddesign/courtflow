-- CourtFlow Database Schema
-- Migration 002: Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE scouting_reports ENABLE ROW LEVEL SECURITY;

-- Schools policies
CREATE POLICY "Users can view their own school"
  ON schools FOR SELECT
  USING (
    id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own school"
  ON schools FOR UPDATE
  USING (
    id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

-- Players policies
CREATE POLICY "Users can view players from their school"
  ON players FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert players to their school"
  ON players FOR INSERT
  WITH CHECK (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update players from their school"
  ON players FOR UPDATE
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete players from their school"
  ON players FOR DELETE
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

-- Practice plans policies
CREATE POLICY "Users can view practice plans from their school"
  ON practice_plans FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert practice plans to their school"
  ON practice_plans FOR INSERT
  WITH CHECK (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update practice plans from their school"
  ON practice_plans FOR UPDATE
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete practice plans from their school"
  ON practice_plans FOR DELETE
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

-- Practice activities policies
CREATE POLICY "Users can view activities from their school's practice plans"
  ON practice_activities FOR SELECT
  USING (
    practice_plan_id IN (
      SELECT id FROM practice_plans
      WHERE school_id IN (
        SELECT school_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert activities to their school's practice plans"
  ON practice_activities FOR INSERT
  WITH CHECK (
    practice_plan_id IN (
      SELECT id FROM practice_plans
      WHERE school_id IN (
        SELECT school_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update activities from their school's practice plans"
  ON practice_activities FOR UPDATE
  USING (
    practice_plan_id IN (
      SELECT id FROM practice_plans
      WHERE school_id IN (
        SELECT school_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete activities from their school's practice plans"
  ON practice_activities FOR DELETE
  USING (
    practice_plan_id IN (
      SELECT id FROM practice_plans
      WHERE school_id IN (
        SELECT school_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- Drills policies
CREATE POLICY "Users can view drills from their school"
  ON drills FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert drills to their school"
  ON drills FOR INSERT
  WITH CHECK (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update drills from their school"
  ON drills FOR UPDATE
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete drills from their school"
  ON drills FOR DELETE
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

-- Plays policies
CREATE POLICY "Users can view plays from their school"
  ON plays FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert plays to their school"
  ON plays FOR INSERT
  WITH CHECK (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update plays from their school"
  ON plays FOR UPDATE
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete plays from their school"
  ON plays FOR DELETE
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

-- Scouting reports policies
CREATE POLICY "Users can view scouting reports from their school"
  ON scouting_reports FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert scouting reports to their school"
  ON scouting_reports FOR INSERT
  WITH CHECK (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update scouting reports from their school"
  ON scouting_reports FOR UPDATE
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete scouting reports from their school"
  ON scouting_reports FOR DELETE
  USING (
    school_id IN (
      SELECT school_id FROM users WHERE id = auth.uid()
    )
  );
