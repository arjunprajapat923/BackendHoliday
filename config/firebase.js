const admin = require("firebase-admin");
const serviceAccount = require("../qviq-62fe6-firebase-adminsdk-fbsvc-6afee028c7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
