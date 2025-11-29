# ✅ CourtFlow Setup Checklist

Use this checklist to complete your setup and start using CourtFlow!

## 📋 Pre-Flight Checklist

### Phase 1: Dependencies ✅

- [x] Node.js 18+ installed
- [x] npm dependencies installed (`npm install`)
- [x] All configuration files created
- [x] TypeScript configured
- [x] Vite configured
- [x] Tailwind CSS 4 configured

### Phase 2: Supabase Setup ⏳

- [ ] Created Supabase account at [supabase.com](https://supabase.com)
- [ ] Created new Supabase project
- [ ] Project is fully initialized (2-3 minutes)
- [ ] Copied Project URL from Settings > API
- [ ] Copied anon/public key from Settings > API

### Phase 3: Database Migrations ⏳

- [ ] Opened SQL Editor in Supabase dashboard
- [ ] Ran `database-migrations/001_initial_schema.sql`
- [ ] Verified no errors in SQL execution
- [ ] Ran `database-migrations/002_rls_policies.sql`
- [ ] Verified no errors in SQL execution

### Phase 4: Environment Configuration ⏳

- [ ] Created `.env` file (from `.env.example`)
- [ ] Added `VITE_SUPABASE_URL` to `.env`
- [ ] Added `VITE_SUPABASE_ANON_KEY` to `.env`
- [ ] Saved `.env` file
- [ ] Verified `.env` is in `.gitignore`

### Phase 5: Launch ⏳

- [ ] Run `npm run dev`
- [ ] App opens at http://localhost:5173
- [ ] No console errors in browser (F12)
- [ ] Dashboard loads successfully
- [ ] Can navigate between modules

## 🎯 Feature Testing Checklist

### Roster Manager

- [ ] Can access Roster Manager from dashboard
- [ ] Can add a new player
- [ ] Player name and number save correctly
- [ ] Can edit player information
- [ ] Can delete a player
- [ ] Print button works

### Practice Planner

- [ ] Can create first practice plan
- [ ] Can set date and start time
- [ ] Can add practice activities
- [ ] Clock times can be edited
- [ ] Can add activities between existing ones
- [ ] Can delete activities
- [ ] Team rosters and notes save
- [ ] Print button generates landscape layout

### Drill Repository

- [ ] Can add a new drill
- [ ] Can select drill type
- [ ] Can enter focus area
- [ ] Description saves correctly
- [ ] Can paste YouTube URL
- [ ] YouTube video embeds correctly
- [ ] Can expand/collapse drills
- [ ] Can delete drills

### Playbook

- [ ] Can add new play
- [ ] Can select play type (Offense/Defense/Special)
- [ ] Description saves
- [ ] Can add diagram URL (optional)
- [ ] Image displays if URL provided
- [ ] Can edit play details
- [ ] Can delete plays

### Scouting Reports

- [ ] Can create new scouting report
- [ ] Opponent name saves
- [ ] Date can be set
- [ ] Personnel notes save
- [ ] Offensive tendencies save
- [ ] Defensive tendencies save
- [ ] Special situations save
- [ ] Can delete reports
- [ ] Reports sorted by date

## 🔍 Troubleshooting Checklist

If something doesn't work, check:

### Connection Issues

- [ ] Supabase project URL is correct
- [ ] Supabase anon key is correct
- [ ] Both values in `.env` start with `VITE_`
- [ ] `.env` file is in root directory (not in `/src`)
- [ ] Restarted dev server after changing `.env`

### Database Issues

- [ ] Both migration SQL files ran successfully
- [ ] No errors shown in Supabase SQL Editor
- [ ] Tables exist in Supabase Table Editor
- [ ] RLS policies are enabled (shield icon on tables)

### Data Not Saving

- [ ] Browser console shows no errors (F12)
- [ ] Network tab shows successful requests
- [ ] User has a school_id assigned
- [ ] RLS policies allow insert/update operations

### UI Issues

- [ ] Cleared browser cache (Ctrl+Shift+R / Cmd+Shift+R)
- [ ] Tried different browser
- [ ] Console shows no JavaScript errors
- [ ] Tailwind styles are loading

## 📈 Production Checklist

Ready to deploy? Check these:

### Build

- [ ] `npm run build` completes without errors
- [ ] `dist/` directory is created
- [ ] `npm run preview` shows working app

### Deployment

- [ ] Choose hosting platform (Vercel, Netlify, etc.)
- [ ] Set environment variables on hosting platform
- [ ] Deploy from `dist/` directory
- [ ] Test deployed app works
- [ ] All features work in production

### Security

- [ ] `.env` is in `.gitignore`
- [ ] No secrets committed to git
- [ ] RLS policies are enabled
- [ ] Only anon key used (not service key)

## 🎓 Learning Checklist

Want to customize CourtFlow? Learn these:

### Basic Customization

- [ ] Understand component structure in `/src/views`
- [ ] Know how to modify colors in `tailwind.config.ts`
- [ ] Can add new fields to database tables
- [ ] Can update TypeScript types

### Advanced Customization

- [ ] Understand Zustand store pattern
- [ ] Can create new views
- [ ] Can add new routes in `App.tsx`
- [ ] Can write new RLS policies

## 📚 Documentation Checklist

Have you reviewed:

- [ ] [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup guide
- [ ] [README.md](./README.md) - Full documentation
- [ ] [MIGRATION.md](./MIGRATION.md) - Technical migration details
- [ ] [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - What changed overview
- [ ] [database-migrations/README.md](./database-migrations/README.md) - Database docs

## 🎉 All Done?

If all checkboxes are complete:

- ✅ Your CourtFlow app is fully set up
- ✅ All features are working
- ✅ Data is persisting to Supabase
- ✅ You're ready to coach smarter!

---

**Time to hit the court!** 🏀

Need help? Check the troubleshooting section or review the documentation files.
