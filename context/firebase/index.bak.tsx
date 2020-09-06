import { useRouter } from "next/router"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Loading } from "../../components/Loading"
import { newState } from "../init"
import { Player, State } from "../init/_types"
import firebase from "./_init"

const DataCTX = createContext<State>(null)
const RefCTX = createContext<{ ref: firebase.database.Reference, uid: string }>(null)

export const FirebaseProvider: React.FC = ({ children }) => {

    const { asPath } = useRouter()

    const path: string = useMemo(() =>
        asPath === "/"
            ? "/"
            : asPath.includes("[")
                ? null
                : asPath.replace("/", "")
        , [asPath])

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

    const joinRoom = useCallback((ref: firebase.database.Reference, uid: string) => {
        ref.child(`players/${uid}`).set({ isReady: false, name: "Bubby", score: 0 } as Player)
        console.log("join room")
        // ref.set(newState(uid, "Craig"), (err) => err ? console.log(err) : setOwner(true))
    }, [])

    const sortData = useCallback((data: State) => {
        if (data) {
            setList(Object.keys(data.players))
            setData(data)
            setOwner(data.owner === uid)
        }
    }, [uid])

    useEffect(() => {

        const DB = firebase.database().ref()

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const { uid } = user

                DB.child(`users/${uid}`).set({
                    room: path,
                    score: 0
                })

                DB.child("rooms").push({
                    title: path,
                    owner: uid
                })


                // DB.child("rooms")
                //     .orderByChild("name")
                //     .equalTo(path)
                //     .on("value", snap => {
                //         if (!snap.exists()) {
                //             firebase.database().ref().push({
                //                 name: path,
                //                 owner: uid,
                //                 game: {
                //                     round: 0,
                //                     turn: 0
                //                 }
                //             })
                //             return
                //         }
                //         setData(snap.val())
                //     }, (err) => {
                //         if (err) throw err
                //     })


                console.log(uid)
                // let init = false
                // const ref = firebase.database().ref(path)
                // ref.once("value", snap => {
                //     console.log("once: ", snap.val())
                // })
                // ref.on("value", (snap) => {
                //     const data = snap.val()
                //     if (!init) {
                //         if (!data) createRoom(ref, user.uid)
                //         else joinRoom(ref, user.uid)
                //         init = true
                //     }
                //     sortData(snap.val())
                // }, (err) => console.log(err))
                // setRef(ref)
                // setUID(user.uid)
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
        }
    }, [isOwner, playerList, ref])

    useEffect(() => {
        window.onbeforeunload = () => {
            // exit()
            firebase.auth().signOut()
            console.log("window closed")
        }
    }, [exit])

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
            onComplete && onComplete()
        })
    }
}
