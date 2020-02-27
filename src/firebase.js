import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBFwUjcI_6mfHNMNSfAN********",
    authDomain: "*******.firebaseapp.com",
    databaseURL: "https://*******.firebaseio.com",
    projectId: "*******",
    storageBucket: "*******.appspot.com",
    messagingSenderId: "2177*******",
    appId: "1:2177*******:web:74020c104ff72*******",
    measurementId: "G-66MH*******"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

export default firebase;