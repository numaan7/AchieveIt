# Firestore Setup Guide

## Important: Set Up Firestore Security Rules

If goals are not saving, it's likely due to Firestore security rules. Follow these steps:

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/

### 2. Select Your Project
Click on your project: `sample-c07f9`

### 3. Navigate to Firestore Database
- Click on "Firestore Database" in the left sidebar
- Click on the "Rules" tab

### 4. Update Your Security Rules

Replace the existing rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Goals collection
    match /goals/{goalId} {
      // Allow users to read their own goals
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // Allow users to create goals with their userId
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      // Allow users to update their own goals
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      
      // Allow users to delete their own goals
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      // Allow users to read their own tasks
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // Allow users to create tasks with their userId
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      // Allow users to update their own tasks
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      
      // Allow users to delete their own tasks
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Click "Publish"

Make sure to click the "Publish" button to save your changes.

## Testing

After updating the rules:

1. Refresh your application
2. Try creating a new goal
3. Check the browser console (F12) for any errors
4. Goals should now save successfully!

## Troubleshooting

### Issue: "Missing or insufficient permissions"
- **Solution**: Make sure you're signed in with Google and the Firestore rules are published

### Issue: Goals still not saving
1. Check browser console for errors (Press F12)
2. Verify you're signed in (check top right for your profile picture)
3. Check internet connection
4. Try signing out and signing back in

### Issue: "requires an index"
- **Solution**: The app now filters data on the client side to avoid needing composite indexes
- If you still see this error, click the link in the error message to create the index automatically

## Verify Setup

To verify everything is working:

1. Sign in to the app
2. Create a new goal with:
   - Name: "Test Goal"
   - Steps: 5
   - Start Date: Today
3. You should see:
   - Success message
   - New goal card with progress bar
   - Goal appears on dashboard

If you see the goal card, everything is working correctly! 🎉
