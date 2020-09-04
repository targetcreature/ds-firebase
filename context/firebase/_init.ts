import firebase from 'firebase/app'
import 'firebase/auth' // If you need it
import 'firebase/database' // If you need it


const config = {
  apiKey: "AIzaSyDZFlZLzy-3RChsZ09-oDkrym60wPS8FxY",
  authDomain: "react-44534.firebaseapp.com",
  databaseURL: "https://react-44534.firebaseio.com",
  projectId: "react-44534",
  storageBucket: "react-44534.appspot.com",
  messagingSenderId: "924977178872",
  appId: "1:924977178872:web:1cc99077310146d0c3f30d",
  measurementId: "G-Z77TJW01CZ"
}

if (!firebase.apps.length) {

  firebase.initializeApp(config)
  firebase.auth().signInAnonymously().catch((error) => {
    console.log("ERROR: ", error)
  })

}

export default firebase
