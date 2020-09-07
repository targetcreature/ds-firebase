import firebase from 'firebase/app'
import 'firebase/auth' // If you need it
import 'firebase/database' // If you need it
import { useRouter } from "next/router"
import { Context, useCallback, useEffect, useMemo, useState } from "react"

type Props = {
    config: Object
    init: {
        game: any
        owner: string
        players: {
            init?: any
        }
    },
    DataCTX: Context<any>
    FireCTX: Context<any>
    Loading: React.FC
}

export const _provider = ({ config, init, DataCTX, FireCTX, Loading = () => null }: Props): React.FC => ({ children }) => {

    const [DB, setDB] = useState<firebase.database.Reference>(null)
    const [uid, setUID] = useState<string>(null)
    const [data, setData] = useState(null)
    const [joined, setJoined] = useState(false)
    const [owner, setOwner] = useState(null)

    const router = useRouter()

    console.log({ uid })

    const isOwner = useMemo(() => !!owner && owner === uid, [owner, uid])
    console.log({ isOwner })

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
                    DB.on("value", snap => {
                        const data = snap.val()
                        if (!data) {
                            const initData = {
                                ...init,
                                owner: uid,
                                players: {
                                    [uid]: init.players.init
                                }
                            }
                            DB.set(initData)
                            setData(initData)
                        }
                        else {
                            setOwner(data.owner)
                            setData(data)
                            if (!joined) {
                                setJoined(true)
                                DB.child("players").update({
                                    [uid]: init.players.init
                                }, err => err && console.log(err))
                            }
                        }
                    }, err => err && console.log(err))
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