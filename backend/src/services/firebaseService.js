const admin = require('firebase-admin')

let db = null

const initializeFirebase = () => {
  try {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token'
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      })
    }

    db = admin.firestore()
    console.log('Firebase initialized successfully')
    
    return db
  } catch (error) {
    console.error('Firebase initialization error:', error)
    throw error
  }
}

const getFirestore = () => {
  if (!db) {
    throw new Error('Firestore not initialized')
  }
  return db
}

const getAuth = () => {
  return admin.auth()
}

const getStorage = () => {
  return admin.storage()
}

module.exports = {
  initializeFirebase,
  getFirestore,
  getAuth,
  getStorage,
  admin
}
