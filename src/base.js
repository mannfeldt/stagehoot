import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// PROD
const prodConfig = {
  apiKey: 'AIzaSyB8vYoKiw2DlJycM5bqKKaU4vK_0n7HcsU',
  authDomain: 'stagehoot.firebaseapp.com',
  databaseURL: 'https://stagehoot.firebaseio.com',
  projectId: 'stagehoot',
  storageBucket: 'stagehoot.appspot.com',
  messagingSenderId: '589747985768',
};

const golfConfig = {
  apiKey: 'AIzaSyA1LCnNtukZ_zxfJwCeaEgKTU-BNrprX24',
  authDomain: 'stagehoot-golf.firebaseapp.com',
  databaseURL: 'https://stagehoot-golf.firebaseio.com',
  projectId: 'stagehoot-golf',
  storageBucket: 'stagehoot-golf.appspot.com',
  messagingSenderId: '688320597897',
  appId: '1:688320597897:web:8279c87d63b8e6fa',
};

// DEV

const fire = firebase.initializeApp(prodConfig, 'default');
const fireGolf = firebase.initializeApp(golfConfig, 'golf');

export { fire, fireGolf };
