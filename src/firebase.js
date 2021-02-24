// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {

  apiKey: "AIzaSyBOjkj7aAx62iak6f98rEdg59aI3udolnc",
  authDomain: "reactsocialapp-9c391.firebaseapp.com",
  projectId: "reactsocialapp-9c391",
  databaseURL: "https://reactsocialapp-9c391-default-rtdb.firebaseio.com/",
  storageBucket: 'gs://reactsocialapp-9c391.appspot.com'

  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth;
  export const database = firebase.database();
 export  const storage = firebase.storage();
