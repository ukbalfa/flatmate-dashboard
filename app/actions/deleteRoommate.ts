'use server';

import admin from 'firebase-admin';

function getAdminApp() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return admin.app();
}

export async function deleteRoommateAction(uid: string) {
  try {
    getAdminApp();
    await admin.auth().deleteUser(uid);
    await admin.firestore().collection('users').doc(uid).delete();
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete roommate';
    return { success: false, error: message };
  }
}
