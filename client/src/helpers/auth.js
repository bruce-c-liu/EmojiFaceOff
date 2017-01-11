import { ref, firebaseAuth } from '../config/constants.js';
// import { saveNewUser } from '../helpers/http.js';
import firebase from 'firebase';

// export default function auth () {
//   return firebaseAuth().signInWithPopup(new firebase.auth.FacebookAuthProvider());
// }

export default function auth () {
  firebaseAuth().signInWithRedirect(new firebase.auth.FacebookAuthProvider());
}

export function checkIfAuthed (store) {
  console.log('checkIfAuthed called', store.getState());
  return store.getState().users.isAuthed;
}

export function logout () {
  return firebaseAuth().signOut();
}

// export function saveUser (user) {
//   return ref.child(`users/${user.uid}`).set(user)
//     .then((newUser) => {
//       if (newUser) return saveNewUser(newUser);
//     });
// }

export function saveUserFirebase (user) {
  return ref.child(`users/${user.uid}`).set(user);
}
