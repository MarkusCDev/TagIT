/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true }); // Include origin or a specific domain

admin.initializeApp();

exports.getBusTimings = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    // Rest of your function...
    const firestore = admin.firestore();
    
    try {
      const querySnapshot = await firestore.collection("CCNY_Shuttle_Routing")
                                        .orderBy("datetime", "desc")
                                        .limit(1)
                                        .where("nextStop", "==", "W125")
                                        .get();

      let timings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        timings.push(data); // Modify this based on how you want to structure the response
      });

      response.status(200).send(timings);
    } catch (e) {
      console.log(e);
      response.status(500).send(e);
    }
  });
});
