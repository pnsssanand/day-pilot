# DayPilot - Personal Schedule & Task Manager

A beautiful, production-ready task management app built with React, Firebase, and Cloudinary.

**Created by Anand Pinisetty**

## Features

- **Authentication**: Email/password sign-up & sign-in with Firebase Auth
- **Task Management**: Create, edit, delete tasks with dates, times, priorities, and categories
- **Multiple Views**: Today, Tomorrow, Date picker, Priority, and "To Learn" views
- **Profile & Media**: Upload profile photo and video via Cloudinary
- **Greeting Animation**: Beautiful animated greeting with user photo and time-based message
- **Responsive Design**: Mobile-first, works great on all devices

## Tech Stack

- React 18 with TypeScript
- Firebase (Auth + Firestore)
- Cloudinary (media storage)
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- React Router v6

## Setup

### 1. Clone and Install

```bash
npm install
```

### 2. Firebase Configuration

The app uses the following Firebase project (already configured):

- Project ID: `day-pilot-c2e6a`
- Auth Domain: `day-pilot-c2e6a.firebaseapp.com`

### 3. Cloudinary Configuration

The app uses unsigned uploads with:

- Cloud Name: `dlvjvskje`
- Upload Preset: `daypilot`

### 4. Run Development Server

```bash
npm run dev
```

## Firestore Security Rules

Add these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own tasks
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Firestore Indexes

Create these composite indexes for optimal query performance:

1. **Tasks by date and time**:
   - Collection: `tasks`
   - Fields: `userId` (Ascending), `date` (Ascending), `time` (Ascending)

2. **Priority tasks**:
   - Collection: `tasks`
   - Fields: `userId` (Ascending), `priority` (Ascending), `date` (Ascending)

3. **Learn tasks**:
   - Collection: `tasks`
   - Fields: `userId` (Ascending), `category` (Ascending), `date` (Ascending)

## Security Considerations

### Cloudinary Uploads

This app uses **unsigned uploads** for convenience. For production:

1. Consider using **signed uploads** instead
2. Create a server endpoint to generate upload signatures
3. Never expose your Cloudinary API secret in client code

### Firebase Config

The Firebase config values in the code are client-side safe (API key, auth domain, etc.). However:

1. Never commit server-side secrets (service account keys)
2. Enable App Check for additional security
3. Set up proper Firestore security rules (see above)

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── DateSelector.tsx # Date navigation
│   ├── GreetingLoader.tsx # Welcome animation
│   ├── Navbar.tsx       # App navigation
│   ├── ProtectedRoute.tsx # Auth guard
│   ├── TaskItem.tsx     # Single task card
│   ├── TaskList.tsx     # Task list container
│   └── TaskModal.tsx    # Add/edit task modal
├── contexts/
│   └── AuthContext.tsx  # Auth state management
├── hooks/
│   └── useTasks.ts      # Firestore task hooks
├── lib/
│   ├── cloudinary.ts    # Upload utilities
│   ├── firebase.ts      # Firebase config
│   └── utils.ts         # Helper functions
├── pages/
│   ├── Dashboard.tsx    # Main task view
│   ├── Learn.tsx        # Learning tasks
│   ├── Login.tsx        # Auth page
│   ├── Priority.tsx     # Starred tasks
│   └── Profile.tsx      # User settings
└── types/
    └── task.ts          # TypeScript types
```

## Author

**Anand Pinisetty**

## License

MIT
