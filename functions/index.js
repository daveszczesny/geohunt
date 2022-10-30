const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firestore)


exports.deleteUser = functions.https.onCall(async (data, context) => {
    cors: 'Access-Control-Allow-Origin';
    try {


        const uid = context.auth.uid;
        const db = admin.firestore();
        const collection = db.collection("players");
        await collection.doc(uid).delete();
        await admin.auth().deleteUser(uid);
        return "success";
    } catch (err) {
        console.error(err);
        return "error";
    }
})