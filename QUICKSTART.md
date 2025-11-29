# 🚀 Quick Start Guide

## Setup in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose a name, database password, and region
4. Wait for the project to be created (~2 minutes)

#### Run Database Migrations

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste the contents of `database-migrations/001_initial_schema.sql`
4. Click "Run"
5. Repeat for `database-migrations/002_rls_policies.sql`

#### Get Your API Keys

1. In Supabase dashboard, click "Project Settings" (gear icon)
2. Click "API" in the left menu
3. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string of characters)

### 3. Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and paste your keys:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

## 🎯 What You'll See

1. **Dashboard** - Click on any module card to get started
2. **Roster** - Add your first players
3. **Practice Planner** - Create a practice plan with timed activities
4. **Drills** - Build your drill repository with YouTube links
5. **Playbook** - Add plays with descriptions and diagrams
6. **Scouting** - Record opponent analysis

## 📝 First Steps

### Add Your Team Roster

1. Click "Roster Manager" from the dashboard
2. Click "Add New Player"
3. Enter player name and number
4. Repeat for all players

### Create Your First Practice Plan

1. Click "Practice Planner" from the dashboard
2. Click "Create Practice Plan" (if this is your first one)
3. Set the date and start time
4. Add activities with clock times
5. Add coaching cues in the "Points of Precision" column
6. Click "Print" to get a printable version

### Build Your Drill Repository

1. Click "Drill Repository"
2. Click "Add Drill"
3. Enter drill name, type, and focus area
4. Add a description with instructions
5. Paste a YouTube link for video reference
6. The video will embed automatically!

## 🔧 Troubleshooting

### "Cannot connect to Supabase"

- Check your `.env` file has the correct URL and key
- Make sure you've run both migration SQL files
- Verify your Supabase project is running

### "TypeScript errors"

- Run `npm install` again
- Delete `node_modules` and run `npm install`

### "Page is blank"

- Open browser console (F12) and check for errors
- Make sure `.env` file exists and has correct values

## 📚 Learn More

- [Full README](./README.md) - Complete documentation
- [Migration Guide](./MIGRATION.md) - Migrating from Firebase
- [Database README](./database-migrations/README.md) - Database schema details

## 🎉 You're Ready!

Start building your coaching toolkit. All data is automatically saved to your Supabase database and synced across devices!
