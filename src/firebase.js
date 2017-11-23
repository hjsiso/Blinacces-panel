
import firebase from 'firebase'

// Initialize Firebase
var config = {
    apiKey: "",
    authDomain: "blindaccesapp.firebaseapp.com",
    databaseURL: "https://blindaccesapp.firebaseio.com",
    projectId: "blindaccesapp",
    storageBucket: "blindaccesapp.appspot.com",
    messagingSenderId: ""
  };
  
  firebase.initializeApp(config);
 
  export default firebase;