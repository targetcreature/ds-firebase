import { useCallback, useEffect, useState } from "react"
import { Loading } from "../../components/Loading"
import { initState } from "../init"
import firebase from "./_init"

type Props = {
    path: string
}

export const FirebaseProvider: React.FC<Props> = ({ path, children }) => {

    const [connecting, setConnecting] = useState(true)

    const [data, setData] = useState(null)
    const [uid, setUID] = useState(null)
    const [isOwner, setOwner] = useState(false)

    console.log({ data, uid, isOwner })

    const createRoom = useCallback((ref: firebase.database.Reference, uid: string) => {
        ref.set(initState(uid, "Craig"), (err) => err ? console.log(err) : setOwner(true))
    }, [])

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const ref = firebase.database().ref(path)
                ref.on("value", (snap) => {
                    const data = snap.child("publicData").val()
                    if (!data) return createRoom(ref, user.uid)
                    setData(data)
                }, (err) => console.log(err))

                setUID(user.uid)

            } else {
                console.log("authed out")
            }
            setConnecting(false)
        })
    }, [])

    /* on exit */
    const exit = useCallback(() => {
        firebase.auth().signOut()
        console.log("window closed")
    }, [])
    useEffect(() => window.onbeforeunload = () => exit(), [exit])

    return connecting ? <Loading /> : <>{children}</>
}
