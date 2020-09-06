import { useFirebase } from "../context/firebase"
// import { FirebaseProvider } from "../context/firebase/provider"
import "../styles/_.scss"

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

const init = {
  fart: "machine"
}

const Loading: React.FC = () => <div>Loading...</div>

const [FirebaseProvider, useData, useDB] = useFirebase(config, init, Loading)

export { useData, useDB }

export default function App({ Component, pageProps }) {

  return (
    <FirebaseProvider>
      <Component {...pageProps} />
    </FirebaseProvider>
  )
}
