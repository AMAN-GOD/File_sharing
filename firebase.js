const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'filesharing-d7c31.firebasestorage.app' // Replace with your Firebase Storage bucket URL
});
const bucket = admin.storage().bucket();
module.exports = { bucket };