const admin = require("firebase-admin");

// const serviceAccount = require("./julla-tutorial.json");

const serviceAccount = require("../config/adtip-face-app-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://sample-project-e1a84.firebaseio.com"
// })

module.exports.admin = admin