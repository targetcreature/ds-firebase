import { createContext, useCallback, useEffect, useState } from "react"
import { Loading } from "../../components/Loading"
import { newState } from "../init"
import { State } from "../init/_types"
import firebase from "./_init"

type Props = {
    path: string
}

const DataCTX = createContext<State>(null)

export const FirebaseProvider: React.FC<Props> = ({ path, children }) => {

    const [connecting, setConnecting] = useState(true)

    const [data, setData] = useState(null)
    const [uid, setUID] = useState(null)
    const [isOwner, setOwner] = useState(false)
    const [ref, setRef] = useState<firebase.database.Reference>(null)
    // const [playerList, setList]

    console.log({ data, uid, isOwner })

    const createRoom = useCallback((ref: firebase.database.Reference, uid: string) => {
        ref.set(newState(uid, "Craig"), (err) => err ? console.log(err) : setOwner(true))
    }, [])

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => user && setUID(user.uid))
    }, [])

    useEffect(() => {
        if (uid) {
            let init = false
            const ref = firebase.database().ref(path)
            ref.on("value", (snap) => {
                const data = snap.val()
                if (!init) {
                    if (!data) {
                        createRoom(ref, uid)
                    }
                    init = true
                }
                setData(snap.val())
            }, (err) => console.log(err))

            setRef(ref)
        } else {
            console.log("authed out")
        }
        setConnecting(false)
    }, [uid])

    /* on exit */
    const exit = useCallback(() => {

        firebase.database().ref(path).remove()
        firebase.auth().signOut()
        console.log("window closed")
    }, [])

    useEffect(() => window.onbeforeunload = () => exit(), [exit])

    return connecting ? <Loading /> :
        <DataCTX.Provider value={data}>
            <button onClick={() => exit()}>DELETE</button>
            {children}
        </DataCTX.Provider>
}
