# Firebase Setup Guide for Yellow Movement

## Quick Start Checklist

This document guides you through the final steps to get your React Vite app fully functional with Firebase.

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or use existing)
3. Name it: `Yellow Movement`
4. Follow the setup wizard
5. Once created, you'll see your project dashboard

---

## Step 2: Get Your Firebase Credentials

1. In Firebase Console, click the **gear icon** → **Project Settings**
2. Scroll down to "Your apps" section
3. Click **Web** icon (`</>`), then register your app as "yellow-movement"
4. Copy the entire `firebaseConfig` object that appears
5. You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "yellow-movement.firebaseapp.com",
  projectId: "yellow-movement-xyz",
  storageBucket: "yellow-movement-xyz.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

---

## Step 3: Update Your .env File

Open `.env` and replace the placeholder values with your actual Firebase credentials:

```dotenv
VITE_CLOUDINARY_CLOUD_NAME=dmadawcmz
VITE_CLOUDINARY_UPLOAD_PRESET=yellow-movement-receipt

VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=yellow-movement.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yellow-movement-xyz
VITE_FIREBASE_STORAGE_BUCKET=yellow-movement-xyz.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

> **Important**: The `.env` file contains secrets. **Never commit it to version control!** Add to `.gitignore` if it isn't already.

---

## Step 4: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Start in **Production mode** (we'll set rules in Step 5)
4. Choose a location close to your users
5. Click **Create**

---

## Step 5: Deploy Firestore Security Rules

1. In Firestore, click **Rules** tab
2. Replace all existing rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create submissions
    match /blogSubmissions/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    match /getInvolvedSubmissions/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    match /donations/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

**Why these rules?**
- `allow create: if true` = Public forms (anyone can submit)
- `allow read, update, delete: if request.auth != null` = Only authenticated admins can view/manage

---

## Step 6: Enable Firebase Authentication

1. Go to **Authentication** (left sidebar)
2. Click **Get Started**
3. In the "Sign-in method" tab, enable **Email/Password**
4. Click **Save**

---

## Step 7: Create Admin User(s)

1. In Authentication, go to **Users** tab
2. Click **Add user**
3. Enter an email and password for your admin account:
   - Email: `admin@yellowmovement.org` (or your preference)
   - Password: Choose a strong password
4. Click **Add user**

> **Note**: You can add multiple admin accounts here. Each one will have full access to the dashboard.

---

## Step 8: Test Your Application

1. **Terminal**: Make sure your dev server is running
   ```bash
   npm run dev
   ```

2. **Browser**: Open `http://localhost:5173/`

3. **Test Public Submission**:
   - Click **Donate** button
   - Fill in the form with test data
   - Click **Submit Donation**
   - Check Firestore for the new document

4. **Test Admin Access**:
   - Click **Admin** button in navbar
   - Enter your admin credentials (email/password from Step 7)
   - You should see the Admin Dashboard with all submissions

5. **Test Admin Actions**:
   - Click **Approve** or **Reject** on a pending submission
   - Verify the status updates in Firestore

---

## Project File Structure

```
src/
├── firebase.js                 # Firebase initialization
├── firestoreService.js         # Firestore CRUD operations
├── authService.js              # Authentication helpers
├── App.jsx                      # Main app with routing
├── main.jsx                     # React entry point
└── components/
    ├── Login.jsx               # Admin login form
    ├── AdminDashboard.jsx      # Admin management interface
    ├── DonationForm.jsx        # Public donation form
    ├── BlogForm.jsx            # Public blog submission form
    └── GetInvolvedForm.jsx     # Public volunteer form
```

---

## Available Features

### Public Forms (Anyone can submit)
- **Donate**: Upload receipts to Cloudinary, submit donation info
- **Blog**: Write and submit blog posts
- **Get Involved**: Volunteer/participation form

### Admin Features (Authenticated only)
- View all submissions (donations, blogs, volunteers)
- Approve/Reject pending submissions
- Track review history (who reviewed, when)
- Filter by submission type

---

## Firestore Collections & Schema

### blogSubmissions
```javascript
{
  title: string,
  author: string,
  content: string,
  category: string,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: timestamp,
  reviewedAt: timestamp (nullable),
  reviewedBy: string (nullable)
}
```

### getInvolvedSubmissions
```javascript
{
  name: string,
  email: string,
  phone: string (nullable),
  skillsOrInterests: string (nullable),
  availableHours: string (nullable),
  message: string (nullable),
  status: 'pending' | 'approved' | 'rejected',
  createdAt: timestamp,
  reviewedAt: timestamp (nullable),
  reviewedBy: string (nullable)
}
```

### donations
```javascript
{
  email: string (nullable),
  message: string (nullable),
  isAnonymous: boolean,
  receiptUrl: string,
  receiptPublicId: string,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: timestamp,
  reviewedAt: timestamp (nullable),
  reviewedBy: string (nullable)
}
```

---

## Troubleshooting

### "Firebase API key is not valid"
- Check `.env` file has correct credentials
- Make sure Vite has restarted (save `.env`, dev server reloads automatically)
- Verify credentials match your Firebase project

### "Permission denied" when submitting forms
- Check Firestore security rules are published
- Ensure rules allow `create: if true`
- Check browser console for error details

### Admin login not working
- Verify admin user was created in Authentication
- Check you're using correct email/password
- Look at browser console for auth errors

### No submissions appearing in admin dashboard
- Verify Firestore rules allow `read` for authenticated users
- Check you're logged in as admin
- Confirm submissions were actually created (check Firestore console)

---

## Production Deployment

When ready to deploy:

1. **Build your app**: `npm run build`
2. **Deploy to Vercel/Netlify**:
   - Add environment variables in platform settings
   - Copy all `VITE_FIREBASE_*` and Cloudinary vars

3. **Update Firebase security rules** (already done, but verify)
4. **Monitor**: Check Firestore for submissions

---

## Next Steps

1. ✅ Customize branding (colors, logos)
2. ✅ Add email notifications when forms submitted
3. ✅ Create API endpoints for third-party integrations
4. ✅ Set up automated reports/exports
5. ✅ Add more admin features (search, filter, export)

Need help? Check the console for specific error messages!
