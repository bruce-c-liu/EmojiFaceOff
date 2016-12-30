import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBsYNMmZ4VRCadmbS9WJRJguvVfIqA-zuc',
  authDomain: 'emoji-faceoff.firebaseapp.com',
  databaseURL: 'https://emoji-faceoff.firebaseio.com'
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
