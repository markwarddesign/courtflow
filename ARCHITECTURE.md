# CourtFlow Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Application                         │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │              App.tsx (React Router)                   │ │ │
│  │  │  - Route configuration                                │ │ │
│  │  │  - Navigation component                               │ │ │
│  │  │  - Auth initialization                                │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                           │                                 │ │
│  │         ┌─────────────────┴─────────────────┐              │ │
│  │         ▼                                     ▼              │ │
│  │  ┌─────────────┐                     ┌──────────────┐      │ │
│  │  │   Stores    │                     │    Views     │      │ │
│  │  │  (Zustand)  │                     │ (Components) │      │ │
│  │  │             │                     │              │      │ │
│  │  │ • NavStore  │◄────────────────────┤ • Dashboard  │      │ │
│  │  │ • UserStore │                     │ • Roster     │      │ │
│  │  └─────────────┘                     │ • Practice   │      │ │
│  │         ▲                             │ • Drills     │      │ │
│  │         │                             │ • Playbook   │      │ │
│  │         │                             │ • Scouting   │      │ │
│  │         │                             └──────────────┘      │ │
│  │         │                                     │              │ │
│  │         │                                     ▼              │ │
│  │         │                             ┌──────────────┐      │ │
│  │         └─────────────────────────────┤  Supabase    │      │ │
│  │                                       │  Client      │      │ │
│  │                                       │  (lib/)      │      │ │
│  │                                       └──────────────┘      │ │
│  │                                               │              │ │
│  └───────────────────────────────────────────────┼─────────────┘ │
│                                                  │                │
└──────────────────────────────────────────────────┼────────────────┘
                                                   │
                                                   │ HTTPS
                                                   ▼
                    ┌───────────────────────────────────────────┐
                    │          SUPABASE CLOUD                    │
                    │                                            │
                    │  ┌─────────────────────────────────────┐  │
                    │  │      Authentication Service          │  │
                    │  │  - Anonymous auth                    │  │
                    │  │  - Session management                │  │
                    │  └─────────────────────────────────────┘  │
                    │                    │                       │
                    │                    ▼                       │
                    │  ┌─────────────────────────────────────┐  │
                    │  │   PostgreSQL Database                │  │
                    │  │                                      │  │
                    │  │  Tables:                             │  │
                    │  │  • schools                           │  │
                    │  │  • users                             │  │
                    │  │  • players                           │  │
                    │  │  • practice_plans                    │  │
                    │  │  • practice_activities               │  │
                    │  │  • drills                            │  │
                    │  │  • plays                             │  │
                    │  │  • scouting_reports                  │  │
                    │  │                                      │  │
                    │  │  All protected by RLS policies       │  │
                    │  └─────────────────────────────────────┘  │
                    │                                            │
                    └────────────────────────────────────────────┘
```

## Data Flow

### Read Operation (SELECT)

```
User Action → View Component → Supabase Client → RLS Check → PostgreSQL
                                                      │
                                                      ▼
View Update ← Component State ← Response ← Filtered Data
```

### Write Operation (INSERT/UPDATE/DELETE)

```
User Input → View Component → Optimistic Update → Supabase Client
                                    │                    │
                                    ▼                    ▼
                            Local State            RLS Check
                                                        │
                                                        ▼
                                                   PostgreSQL
                                                        │
                                                        ▼
                                                   Success/Error
                                                        │
                                                        ▼
                            Revert if error ← Response Handler
```

## Component Hierarchy

```
App.tsx
├── Navigation
│   └── Links to all routes
│
└── Routes
    ├── "/" → DashboardView
    │   └── Module cards (navigate to other views)
    │
    ├── "/roster" → RosterView
    │   ├── Player list
    │   ├── Add player button
    │   ├── Edit player inputs
    │   └── Delete player buttons
    │
    ├── "/practice-planner" → PracticePlanView
    │   ├── Practice plans list
    │   ├── Current plan editor
    │   │   ├── Date/time inputs
    │   │   ├── Activities table
    │   │   └── Team rosters/notes
    │   └── Add/delete activity buttons
    │
    ├── "/drills" → DrillsView
    │   ├── Drill cards
    │   │   ├── Collapsed view (name, type, focus)
    │   │   └── Expanded view (full details + YouTube)
    │   └── Add drill button
    │
    ├── "/playbook" → PlaybookView
    │   ├── Play cards (grid)
    │   │   ├── Name/type
    │   │   ├── Description
    │   │   └── Diagram (optional)
    │   └── Add play button
    │
    └── "/scouting" → ScoutingView
        ├── Report cards
        │   ├── Opponent/date
        │   ├── Personnel
        │   ├── Offensive tendencies
        │   ├── Defensive tendencies
        │   └── Special situations
        └── Add report button
```

## State Management Pattern

### Global State (Zustand)

```typescript
useNavStore
├── currentView: string
└── setCurrentView: (view: string) => void

useUserStore
├── user: User | null
├── schoolId: string | null
├── setUser: (user: User | null) => void
├── setSchoolId: (schoolId: string | null) => void
└── clearUser: () => void
```

### Local State (React useState)

```typescript
View Component
├── [items, setItems] = useState<Item[]>([])
├── [loading, setLoading] = useState(true)
├── [expanded, setExpanded] = useState<string | null>(null)
└── ... (view-specific state)
```

## Database Schema Relationships

```
schools
└── 1:N → users
    └── 1:N → (via school_id)
        ├── players
        ├── practice_plans
        │   └── 1:N → practice_activities
        ├── drills
        ├── plays
        └── scouting_reports
```

## Security Model (RLS)

```
User Request
    │
    ▼
Extract user_id from JWT
    │
    ▼
Query: SELECT * FROM players WHERE school_id = ?
    │
    ▼
RLS Policy Check:
    school_id IN (
        SELECT school_id FROM users
        WHERE id = auth.uid()
    )
    │
    ├── ✅ ALLOW → Return data
    └── ❌ DENY → Return empty
```

## Build Pipeline

```
Source Code (TypeScript + React)
    │
    ▼
Vite Build Process
    ├── TypeScript Compilation
    ├── JSX Transformation
    ├── Tailwind CSS Processing
    ├── Asset Optimization
    └── Code Splitting
    │
    ▼
Production Bundle (dist/)
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   ├── index-[hash].css
    │   └── ... (chunks)
    └── ... (static assets)
    │
    ▼
Deploy to Hosting (Vercel/Netlify/etc)
```

## Development Workflow

```
1. Code Change
    │
    ▼
2. Vite HMR (Hot Module Replacement)
    │
    ├── TypeScript Recompilation
    ├── React Component Refresh
    └── CSS Hot Reload
    │
    ▼
3. Browser Update (no full reload)
    │
    ▼
4. Test in Browser
    │
    ├── Success → Continue coding
    └── Error → Check console → Fix → Repeat
```

## Key Design Patterns

### 1. Feature-Based Architecture

Each view is self-contained with its own:

- State management
- Data fetching
- CRUD operations
- UI rendering

### 2. Optimistic Updates

```
User Action → Update UI immediately → Call API
    │
    ├── Success → Keep UI state
    └── Error → Revert UI state + Show error
```

### 3. Row Level Security (RLS)

Multi-tenancy without application-level checks:

```
PostgreSQL enforces:
- Users only see their school's data
- No shared data between schools
- Automatic filtering on every query
```

### 4. Type Safety

```
Database Schema → TypeScript Types → Component Props
    │                    │                  │
    └────────────────────┴──────────────────┘
            Compile-time safety
```

---

## Technology Choices Rationale

| Technology         | Why?                               |
| ------------------ | ---------------------------------- |
| **Vite**           | 10-100x faster than CRA, better DX |
| **TypeScript**     | Catch errors at compile time       |
| **Supabase**       | PostgreSQL + Auth + RLS in one     |
| **Zustand**        | Lightweight (1KB), simple API      |
| **React Router**   | Standard for SPA routing           |
| **Tailwind CSS 4** | Utility-first, fast development    |

---

This architecture provides:

- ✅ Fast development experience
- ✅ Type safety
- ✅ Scalable database
- ✅ Built-in security
- ✅ Easy maintenance
- ✅ Modern best practices
