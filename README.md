# AchieveIt - Goal-Based Task Manager

A powerful goal-based task management application built with React, Material-UI, Firebase Authentication, and Firestore.

## Features

- 🎯 **Goal-Based Task System**: Create goals with specific thresholds and track your progress
- 📊 **Progress Dashboard**: Visual progress bars showing completion status for each goal
- 📅 **Calendar View**: See all your tasks organized by date
- 🔥 **Streak Tracking**: Track your daily completion streak with visual graphs
- ⚡ **Automatic Task Generation**: When you create a goal with N steps, the system automatically generates N tasks for the next N days
- 🔐 **Google Authentication**: Secure login with Google account
- 💾 **Cloud Storage**: All data stored securely in Firebase Firestore
- 🌓 **Dark Mode**: Full dark mode support with automatic theme persistence
- 📱 **PWA Support**: Install as native app, works offline, push notifications
- ⚡ **Performance Optimized**: Code splitting, lazy loading, optimized rendering
- 🎨 **Modern UI**: Beautiful gradients, smooth animations, responsive design

## Tech Stack

- **Frontend**: React 18 with Vite
- **UI Library**: Material-UI (MUI) v5
- **Authentication**: Firebase Google Auth
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **Date Handling**: date-fns
- **PWA**: Service Workers, Web App Manifest
- **Icons**: Custom favicon set with multiple sizes

## Features

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Firebase project

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Google Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
4. Create a Firestore database:
   - Go to Firestore Database
   - Create database in production mode
   - Choose a location
5. Set up Firestore rules (Security Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Goals collection
    match /goals/{goalId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

6. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Click the web icon (</>) to add a web app
   - Copy the configuration

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Firebase

Edit `src/config/firebase.js` and replace with your Firebase configuration:

```javascript
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 5. Run the Application

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Usage

### Creating a Goal

1. Click "Create Goal" button on the dashboard
2. Enter:
   - **Goal Name**: Name of your goal
   - **Description**: Optional description
   - **Total Steps**: Number of days/steps (e.g., 100 for a 100-day challenge)
   - **Start Date**: When to begin
3. Click "Create Goal"

The system will automatically create tasks for each day!

### Tracking Progress

- **Dashboard**: View all your goals with progress bars
- **Calendar**: See tasks organized by date, check them off as you complete them
- **Streak**: Monitor your daily completion streak and view analytics

### Completing Tasks

1. Go to Calendar view
2. Click on a date to see tasks
3. Check the checkbox to mark tasks as complete
4. Your goal progress updates automatically!

## Project Structure

```
src/
├── components/
│   ├── Login.jsx              # Google authentication
│   ├── Dashboard.jsx          # Goals overview with progress bars
│   ├── CalendarView.jsx       # Calendar with task management
│   ├── StreakView.jsx         # Streak tracking and graphs
│   ├── GoalCard.jsx           # Individual goal card component
│   └── CreateGoalDialog.jsx   # Goal creation dialog
├── contexts/
│   └── AuthContext.jsx        # Authentication context
├── services/
│   └── firestoreService.js    # Firestore database operations
├── config/
│   ├── firebase.js            # Firebase configuration
│   └── firebaseInit.js        # Firebase initialization
├── App.jsx                     # Main app component
└── main.jsx                    # App entry point
```

## Features in Detail

### Automatic Task Generation

When you create a goal with 100 steps:
- 100 tasks are automatically created
- Each task is assigned to a consecutive day starting from your chosen start date
- Tasks include step numbers and descriptions
- All tasks are linked to the parent goal

### Progress Tracking

- Real-time progress updates as you complete tasks
- Visual progress bars on each goal card
- Percentage completion display
- Automatic goal status (Active/Completed)

### Streak System

- Tracks consecutive days of task completion
- Visual streak counter with fire icon
- 30-day completion graph
- Tips for maintaining streaks

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

You can deploy this application to:
- Firebase Hosting
- Vercel
- Netlify
- Any static hosting service (with HTTPS required for PWA)

## PWA (Progressive Web App)

See [PWA_FEATURES.md](PWA_FEATURES.md) for detailed PWA setup and features.

### Quick PWA Setup

The app already has PWA support configured! To use it:

1. **Install as App**:
   - Click "Install App" button when using the web version
   - Or use browser's native install option
   - On iOS: Use Safari's Share → Add to Home Screen

2. **Works Offline**:
   - App runs completely offline once installed
   - Automatically syncs when connection returns
   - Shows online/offline status indicator

3. **Push Notifications**:
   - Get task reminders and streak updates
   - Grant notification permission when prompted

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
