import { useFirebase } from "../context/firebase"

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
  game: {
    round: 0,
    turn: 0
  },
  player: {
    submission: "",
    vote: 0,
    name: ""
  },
  publicData: {
    fart: "machine"
  }
}

const Loading: React.FC = () => <div>Loading...</div>

const [FirebaseProvider, useRoom, useSet] = useFirebase({ config, init, Loading })

export { useRoom, useSet }

export default function App({ Component, pageProps }) {

  return (
    <FirebaseProvider>
      <Component {...pageProps} />
    </FirebaseProvider>
  )
}
