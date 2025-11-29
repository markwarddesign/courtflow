# CourtFlow - Coaching Suite

A comprehensive basketball coaching application built with React, Vite, TypeScript, Tailwind CSS, and Supabase.

## 🏀 Features

- **Dashboard** - Central hub for accessing all coaching modules
- **Practice Planner** - Design detailed practice schedules with timed activities and coaching cues
- **Roster Manager** - Maintain player names and numbers
- **Drill Repository** - Save and organize drills with YouTube video links
- **Playbook** - Store offensive/defensive plays with diagrams
- **Scouting Reports** - Record opponent analysis and game preparation notes

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **Icons**: Lucide React

## � Project Structure

```
courtflow/
├── src/
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global Tailwind styles
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client config
│   │   └── database.types.ts     # TypeScript types
│   ├── store/
│   │   ├── useNavStore.ts        # Navigation state
│   │   └── useUserStore.ts       # User/auth state
│   └── views/
│       ├── DashboardView.tsx     # Home dashboard
│       ├── PracticePlanView.tsx  # Practice planning
│       ├── RosterView.tsx        # Roster management
│       ├── DrillsView.tsx        # Drill repository
│       ├── PlaybookView.tsx      # Playbook management
│       └── ScoutingView.tsx      # Scouting reports
├── database-migrations/           # SQL migration files
│   ├── 001_initial_schema.sql
│   └── 002_rls_policies.sql
├── public/                        # Static assets
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### 1. Clone the Repository

```bash
git clone https://github.com/markwarddesign/courtflow.git
cd courtflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In your Supabase project dashboard, go to the SQL Editor
3. Run the migration files in order:
   - `database-migrations/001_initial_schema.sql`
   - `database-migrations/002_rls_policies.sql`

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings under API.

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

**In a typical local setup, you would create a mock configuration file or manually initialize Firebase:**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`  // Example local Firebase initialization if not running in the canvas environment  const localFirebaseConfig = {      apiKey: "YOUR_API_KEY",      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",      projectId: "YOUR_PROJECT_ID",      // ... rest of config  };  // Use this config to initialize Firebase locally.  `

The application's logic for connecting to Firebase and authenticating is contained within src/App.jsx.

### 4\. Running the App

1.  npm install
2.  npm run dev // or equivalent based on your setup (e.g., Vite/Webpack)
3.  Access the application in your browser.
