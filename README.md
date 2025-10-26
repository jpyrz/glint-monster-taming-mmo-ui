# Glint Monster Taming MMO UI

A React-based user interface for the Glint Monster Taming MMO game with Firebase authentication and push notifications.

## Features

- 🔐 **Firebase Authentication** - Secure user login and registration
- 🔔 **Push Notifications** - Real-time game notifications via Firebase Cloud Messaging (FCM)
- 🎮 **Game Interface** - Monster taming MMO user interface
- 📱 **Progressive Web App** - Works offline and can be installed on devices
- 🎨 **Modern UI** - Built with Mantine UI components
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Prerequisites

- Node.js (v16 or higher)
- A Firebase project with Authentication and Cloud Messaging enabled
- The Glint Monster Taming MMO API server running

## Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd glint-monster-taming-mmo-ui
   npm install
   ```

2. **Configure Firebase:**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values in `.env`
   - Update `public/firebase-messaging-sw.js` with your Firebase config

3. **Firebase Project Setup:**
   - Enable Authentication with Email/Password
   - Enable Cloud Messaging
   - Generate a VAPID key for web push notifications
   - Add your domain to authorized domains

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:5173](http://localhost:5173) to view it in the browser.**

## Firebase Configuration

You'll need these values from your Firebase project settings:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-your_measurement_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
VITE_API_BASE_URL=http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

The app uses Firebase Authentication with email/password. Users can:
- Create new accounts
- Sign in with existing accounts
- Stay logged in across sessions
- Securely log out

## Push Notifications

The app integrates with Firebase Cloud Messaging to provide:
- Real-time game notifications
- Background message handling
- Notification permission management
- Test notification functionality

## API Integration

The UI connects to the Glint Monster Taming MMO API for:
- User authentication validation
- FCM token registration
- Game data synchronization
- Notification sending

Make sure the API server is running on the URL specified in `VITE_API_BASE_URL`.

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthContainer.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── NotificationSettings.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── config/              # Configuration files
│   └── firebase.ts
├── hooks/               # Custom React hooks
│   └── useFCM.ts
├── services/            # API services
│   └── apiService.ts
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

## Getting Started

1. Set up your Firebase project with Authentication and Cloud Messaging
2. Configure your `.env` file with Firebase credentials
3. Start the API server (see glint-monster-taming-mmo-api repository)
4. Run `npm run dev` to start the UI
5. Register a new account or sign in
6. Enable notifications when prompted
7. Test the notification system

## Troubleshooting

- **Notifications not working**: Check that your VAPID key is correctly set and notifications are enabled in your browser
- **Authentication errors**: Verify your Firebase configuration and ensure the API server is running
- **CORS issues**: Make sure the API server is configured to accept requests from your frontend domain