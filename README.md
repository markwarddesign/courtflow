🏀 CourtFlow: Coaching Suite
============================

**CourtFlow** is a comprehensive, responsive web application designed for basketball coaches to streamline their practice planning, roster management, drill organization, playbook creation, and opponent scouting. Built as part of the Full Court Suite coaching toolkit, it utilizes React and Firebase Firestore for real-time data persistence.

Features
--------

*   **Home/Command Central:** Centralized dashboard for accessing all modules.
    
*   **Practice Planner:** Design detailed practice schedules with clock times, activities, and points of precision, optimized for landscape printing (8.5x11).
    
*   **Roster Manager:** Maintain player names and numbers.
    
*   **Drill Repository:** Save reusable drills, categorize them by type, focus, and include embedded YouTube links for visual reference.
    
*   **Playbook:** Store offensive, defensive, and special situation plays with descriptions and diagram image URLs.
    
*   **Scouting Reports:** Dedicated section for recording opponent personnel, offensive, and defensive tendencies.
    
*   **Real-Time Saving:** All data is persisted automatically to Firestore.
    

🛠️ Project Setup
-----------------

### 1\. Prerequisites

You will need Node.js and npm installed.

### 2\. Dependencies

The project requires the following packages (listed in package.json):

*   react
    
*   react-dom
    
*   firebase
    
*   lucide-react
    
*   tailwindcss (for styling, typically managed by your build process)
    

### 3\. Firebase Configuration

This application uses Firebase Firestore for persistent storage and Firebase Auth for anonymous user sessions.

**Note:** The application expects the Firebase configuration and authorization tokens to be passed via specific global variables (\_\_app\_id, \_\_firebase\_config, \_\_initial\_auth\_token). When running locally or deploying, you must ensure these variables (or mock variables for local testing) are available in your build environment.

**In a typical local setup, you would create a mock configuration file or manually initialize Firebase:**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // Example local Firebase initialization if not running in the canvas environment  const localFirebaseConfig = {      apiKey: "YOUR_API_KEY",      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",      projectId: "YOUR_PROJECT_ID",      // ... rest of config  };  // Use this config to initialize Firebase locally.   `

The application's logic for connecting to Firebase and authenticating is contained within src/App.jsx.

### 4\. Running the App

1.  npm install
    
2.  npm run dev // or equivalent based on your setup (e.g., Vite/Webpack)
    
3.  Access the application in your browser.
