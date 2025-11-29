# Database Migrations

This directory contains SQL migration files for the CourtFlow application database schema.

## Setup Instructions

1. **Create a Supabase Project**

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run Migrations**

   - Open your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run each migration file in order:
     1. `001_initial_schema.sql` - Creates all tables and indexes
     2. `002_rls_policies.sql` - Sets up Row Level Security policies

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase project URL and anon key

## Migration Files

### 001_initial_schema.sql

- Creates all database tables
- Sets up foreign key relationships
- Creates indexes for performance
- Adds updated_at triggers

### 002_rls_policies.sql

- Enables Row Level Security on all tables
- Creates policies for multi-tenancy (school-based isolation)
- Ensures users can only access data from their own school

## Database Schema

The application uses the following tables:

- **schools** - School/organization information
- **users** - User profiles linked to auth.users
- **players** - Player roster with names and numbers
- **practice_plans** - Practice session metadata (date, time, notes)
- **practice_activities** - Individual drills/activities within a practice plan
- **drills** - Drill repository with types, descriptions, and YouTube links
- **plays** - Playbook with offensive/defensive plays and diagram URLs
- **scouting_reports** - Opponent scouting information

All tables include:

- UUID primary keys
- school_id for multi-tenancy
- created_at and updated_at timestamps
- Proper cascade delete relationships
