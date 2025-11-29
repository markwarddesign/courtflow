# CourtFlow Migration Guide

## Migration from Firebase to Supabase

This guide will help you migrate your existing CourtFlow application from Firebase to the new Supabase-based architecture.

### What Changed

#### Technology Stack

- ✅ **React 18** (unchanged)
- ✅ **Lucide React** icons (unchanged)
- 🔄 **Firebase** → **Supabase** (database & auth)
- 🔄 **Create React App** → **Vite** (build tool)
- 🔄 **JavaScript** → **TypeScript** (type safety)
- 🆕 **Tailwind CSS 4** with @tailwindcss/vite plugin
- 🆕 **Zustand** for state management
- 🆕 **React Router DOM v6** for routing

#### Architecture Changes

- **Single File App** → **Feature-based Views** pattern
- **useState** → **Zustand stores** for global state
- **Firestore** → **Supabase PostgreSQL** with RLS
- **Component functions** → **Separate View components**
- **Inline state management** → **Dedicated store files**

### Migration Steps

#### Step 1: Set Up New Dependencies

```bash
# Remove old dependencies
npm uninstall react-scripts firebase

# Install new dependencies
npm install
```

This will install all the new dependencies specified in the updated `package.json`.

#### Step 2: Set Up Supabase

1. **Create a Supabase Project**

   - Go to [supabase.com](https://supabase.com) and create an account
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migrations**

   - In Supabase dashboard, go to SQL Editor
   - Run `database-migrations/001_initial_schema.sql`
   - Run `database-migrations/002_rls_policies.sql`

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key

#### Step 3: Understand the New Structure

The new architecture follows a clean separation of concerns:

```
src/
├── App.tsx                 # Main app with routing
├── main.tsx                # Entry point
├── lib/                    # Configuration & utilities
│   ├── supabase.ts        # Supabase client
│   └── database.types.ts  # TypeScript types
├── store/                  # Global state (Zustand)
│   ├── useNavStore.ts     # Navigation state
│   └── useUserStore.ts    # User/auth state
└── views/                  # Feature-based view components
    ├── DashboardView.tsx  # Home/command central
    ├── RosterView.tsx     # Roster management
    ├── PracticePlanView.tsx
    ├── DrillsView.tsx
    ├── PlaybookView.tsx
    └── ScoutingView.tsx
```

#### Step 4: Data Migration

If you have existing Firebase data, you'll need to migrate it to Supabase:

1. **Export Data from Firebase**

   ```javascript
   // Use Firebase Admin SDK to export data
   const admin = require("firebase-admin");
   // Export your collections to JSON
   ```

2. **Transform and Import to Supabase**
   - Transform Firebase documents to match the new schema
   - Use Supabase API or SQL INSERT statements
   - Match the schema in `database-migrations/001_initial_schema.sql`

Example transformation:

```javascript
// Firebase document
{
  name: "John Doe",
  number: "23"
}

// Supabase row
{
  id: uuid(),
  school_id: schoolId,
  name: "John Doe",
  number: "23",
  created_at: now(),
  updated_at: now()
}
```

#### Step 5: Run the New Application

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

### Key Differences for Developers

#### 1. State Management

**Before (Firebase):**

```javascript
const [roster, setRoster] = useState([]);
```

**After (Supabase + Zustand):**

```typescript
// Global state in store
const { schoolId } = useUserStore();

// Local component state
const [roster, setRoster] = useState<Player[]>([]);
```

#### 2. Data Fetching

**Before (Firebase):**

```javascript
const docRef = doc(db, "coaching_toolkit", userId);
onSnapshot(docRef, (snapshot) => {
  setRoster(snapshot.data()?.roster || []);
});
```

**After (Supabase):**

```typescript
const fetchPlayers = async () => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("school_id", schoolId)
    .order("name");

  if (error) throw error;
  setPlayers(data || []);
};
```

#### 3. Data Updates

**Before (Firebase):**

```javascript
await updateDoc(docRef, {
  roster: updatedRoster,
});
```

**After (Supabase):**

```typescript
const { error } = await supabase
  .from("players")
  .update({ name: value })
  .eq("id", playerId);
```

#### 4. Navigation

**Before:**

```javascript
const [currentView, setCurrentView] = useState("Home");
```

**After (React Router):**

```typescript
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate("/roster");
```

### Benefits of New Architecture

1. **TypeScript** - Type safety prevents bugs
2. **Better Performance** - Vite is faster than CRA
3. **Scalability** - PostgreSQL is more powerful than Firestore
4. **Security** - Row Level Security (RLS) built-in
5. **Modern Patterns** - Feature-based architecture is more maintainable
6. **Better Developer Experience** - Hot module replacement, better errors

### Common Issues & Solutions

#### Issue: TypeScript Errors

**Solution**: Run `npm install` to ensure @types packages are installed

#### Issue: Supabase Connection

**Solution**: Check `.env` file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

#### Issue: RLS Blocking Queries

**Solution**: Ensure user is authenticated and has a school_id

#### Issue: Build Errors

**Solution**: Run `npm run build` and check for any import path issues

### Need Help?

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [Vite Documentation](https://vitejs.dev)
- Look at example view components in `src/views/`

### Rollback Plan

If you need to rollback to the Firebase version:

1. Keep the old `App.jsx` file backed up
2. Revert `package.json` changes
3. Run `npm install`
4. Copy back old files

However, the new architecture is recommended for long-term maintainability!
