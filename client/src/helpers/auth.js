import { ref, firebaseAuth } from '../config/constants.js';
import { saveNewUser } from '../helpers/http.js';
import firebase from 'firebase';

export default function auth () {
  return firebaseAuth().signInWithPopup(new firebase.auth.FacebookAuthProvider());
}

export function checkIfAuthed (store) {
	console.log("checkIfAuthed called", store.getState() )		
  return store.getState().users.isAuthed === true
}

export function logout () {
  return firebaseAuth().signOut();
}

export function saveUser (user) {
  return ref.child(`users/${user.uid}`)
    .set(user)
    .then(() => user)    	
    .then((newUser) => {
    	if(newUser)  return saveNewUser(newUser)
    })

}
