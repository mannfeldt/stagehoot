import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

//PROD
var prodConfig = {
  apiKey: "AIzaSyB8vYoKiw2DlJycM5bqKKaU4vK_0n7HcsU",
  authDomain: "stagehoot.firebaseapp.com",
  databaseURL: "https://stagehoot.firebaseio.com",
  projectId: "stagehoot",
  storageBucket: "stagehoot.appspot.com",
  messagingSenderId: "589747985768"
};

//DEV

const fire = firebase.initializeApp(prodConfig);

export { fire }