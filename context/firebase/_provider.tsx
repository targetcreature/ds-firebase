import firebase from 'firebase/app'
import 'firebase/auth' // If you need it
import 'firebase/database' // If you need it
import { useRouter } from "next/router"
import { Context, useCallback, useEffect, useState } from "react"

type Props = {
    config: Object,
    init: any,
    DataCTX: Context<any>
    FireCTX: Context<any>
    Loading: React.FC
}

export const _provider = ({ config, init, DataCTX, FireCTX, Loading = () => null }: Props): React.FC => ({ children }) => {

    const [DB, setDB] = useState<firebase.database.Reference>(null)
    const [uid, setUID] = useState<string>(null)
    const [data, setData] = useState(null)

    const router = useRouter()

    useEffect(() => {
        if (!firebase.apps.length) {
            firebase.initializeApp(config)
            firebase.auth().signInAnonymously().catch((error) => {
                console.log("ERROR: ", error)
            })
        }
    }, [])

    useEffect(() => {

        if (router.asPath !== router.route) {

            const [room] = Object.values(router.query)
            const DB = firebase.database().ref(room as string)

            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    const { uid } = user
                    DB.on("value", snap => setData(snap.val()), err => err && console.log(err))
                    setUID(uid)
                    setDB(DB)
                }
            }, err => err && console.log(err))
        }

    }, [router])

    const onExit = useCallback(() => {
        console.log("exited")
    }, [])

    useEffect(() => {
        window.onbeforeunload = () => {
            onExit()
            firebase.auth().signOut()
            console.log("window closed")
        }
    }, [onExit])

    return !data ? <Loading /> : (
        <FireCTX.Provider value={{ uid, DB }}>
            <DataCTX.Provider value={data}>
                {children}
            </DataCTX.Provider>
        </FireCTX.Provider>
    )
}