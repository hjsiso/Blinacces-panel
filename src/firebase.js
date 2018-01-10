import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyB564e_AfQ8RFT9bp17ZhnZAUXvE5SoC08",
  authDomain: "blindaccesapp.firebaseapp.com",
  databaseURL: "https://blindaccesapp.firebaseio.com",
  projectId: "blindaccesapp",
  storageBucket: "blindaccesapp.appspot.com",
  messagingSenderId: "176221302114"
};

firebase.initializeApp(config);

export default firebase;
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();