const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Renaming for clarity as it now does more than just setting an admin role
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;

  // 1. Create a user document in Firestore
  // This will store user information accessible by the app
  const userRef = admin.firestore().collection("users").doc(uid);
  const userDocument = {
    uid,
    email,
    displayName: displayName || null, // Save the name from signup, or null if not provided
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await userRef.set(userDocument);
    console.log(`Successfully created user document for ${email}`);
  } catch (error) {
    console.error(`Error creating user document for ${email}:`, error);
    // We can still proceed to the admin role check even if this fails
  }

  // 2. Check if the user should be an admin
  if (email === "admin@gmail.com") {
    try {
      await admin.auth().setCustomUserClaims(uid, { admin: true });
      console.log(`Successfully set admin role for ${email}`);
      // Optional: Add admin role to the Firestore document as well
      await userRef.update({ role: 'admin' });
      return { message: `Admin role set and user document created for ${email}` };
    } catch (error) {
      console.error(`Error setting custom claims for ${email}:`, error);
      return { error: "Error setting custom claims." };
    }
  }

  return { message: `User document created for ${email}` };
});
