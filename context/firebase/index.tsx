import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { Loading } from "../../components/Loading"
import { newState } from "../init"
import { State } from "../init/_types"
import firebase from "./_init"

type Props = {
    path: string
}

// const SetDataCTX = createContext<(f: (cb: State) => void) => void>(null)
const DataCTX = createContext<State>(null)
const RefCTX = createContext<{ ref: firebase.database.Reference, uid: string }>(null)

export const FirebaseProvider: React.FC<Props> = ({ path, children }) => {

    const [connecting, setConnecting] = useState(true)
    const [data, setData] = useState(null)
    const [uid, setUID] = useState(null)
    const [isOwner, setOwner] = useState(false)
    const [ref, setRef] = useState<firebase.database.Reference>(null)
    const [playerList, setList] = useState([])

    console.log({ data, uid, isOwner })

    const createRoom = useCallback((ref: firebase.database.Reference, uid: string) => {
        ref.set(newState(uid, "Craig"), (err) => err ? console.log(err) : setOwner(true))
    }, [])

    const sortData = useCallback((data: State) => {
        if (data) {
            setList(Object.keys(data.players))
            setData(data)
            setOwner(data.owner === uid)
        }
    }, [uid])

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user?.uid) {
                let init = false
                const ref = firebase.database().ref(path)
                ref.on("value", (snap) => {
                    const data = snap.val()
                    if (!init) {
                        if (!data) {
                            createRoom(ref, user.uid)
                        }
                        init = true
                    }
                    sortData(snap.val())
                }, (err) => console.log(err))
                setRef(ref)
                setUID(user.uid)
            } else {
                console.log("authed out")
            }
            setConnecting(false)
        })
    }, [])

    /* on exit */
    const exit = useCallback(() => {
        if (isOwner) {
            if (playerList.length > 1) {
                const newOwner = playerList.map((k) => k !== uid)[0]
                ref.update({ owner: newOwner })
            }
            else {
                firebase.database().ref(path).remove()
            }
            firebase.auth().signOut()
            console.log("window closed")
        }
    }, [isOwner, playerList, ref])

    // useEffect(() => window.onbeforeunload = () => exit(), [exit])

    return connecting ? <Loading /> :
        <RefCTX.Provider value={{ ref, uid }}>
            <DataCTX.Provider value={data}>
                {children}
            </DataCTX.Provider>
        </RefCTX.Provider>
}

export const useSetData = () => {
    const { ref, uid } = useContext(RefCTX)
    return (cb: (draft: State, uid: string) => State, onComplete?: () => void) => {
        ref.transaction((state) => {
            return cb(state, uid)
        }, (err) => {
            if (err) throw err
            onComplete()
        })
    }
}
