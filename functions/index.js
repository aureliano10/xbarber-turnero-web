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


// Callable function to grant admin role to an existing user
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // For production, you should add a check here to ensure only authorized users can run this.
  // For example:
  // if (context.auth.token.admin !== true) {
  //   return { error: "Request not authorized. User must be an administrator to fulfill request." };
  // }

  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with one argument "email".');
  }

  try {
    console.log(`Looking up user by email: ${email}`);
    const user = await admin.auth().getUserByEmail(email);
    
    console.log(`Setting custom claim for UID: ${user.uid}`);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    // We can also update the Firestore document for consistency, although the claim is what matters for security.
    await admin.firestore().collection("users").doc(user.uid).update({ role: 'admin' });
    
    console.log(`Successfully made ${email} an admin.`);
    return { result: `Success! ${email} has been made an admin.` };
  } catch (error) {
    console.error(`Error setting admin role for ${email}:`, error);
    throw new functions.https.HttpsError('internal', 'An error occurred while trying to set the admin role.');
  }
});
