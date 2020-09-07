import { useRouter } from "next/router"
import { Context, useCallback, useEffect, useMemo, useState } from "react"

type Props = {
    AUTH: firebase.auth.Auth
    DB: firebase.database.Database
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

export const _provider = (props: Props): React.FC => ({ children }) => {

    const {
        AUTH,
        DB,
        init,
        DataCTX,
        FireCTX,
        Loading = () => null
    } = props

    const [Ref, setRef] = useState<firebase.database.Reference>(null)
    const [uid, setUID] = useState<string>(null)
    const [data, setData] = useState(null)
    const [joined, setJoined] = useState(false)
    const [owner, setOwner] = useState(null)

    const router = useRouter()

    console.log({ uid })

    const isOwner = useMemo(() => !!owner && owner === uid, [owner, uid])
    console.log({ isOwner })

    useEffect(() => {

        if (router.asPath !== router.route) {

            const [room] = Object.values(router.query)
            const Ref = DB.ref(room as string)

            AUTH.onAuthStateChanged(user => {
                if (user) {
                    const { uid } = user
                    Ref.on("value", snap => {
                        const data = snap.val()
                        if (!data) {
                            const initData = {
                                ...init,
                                owner: uid,
                                players: {
                                    [uid]: init.players.init
                                }
                            }
                            Ref.set(initData)
                            setData(initData)
                        }
                        else {
                            setOwner(data.owner)
                            setData(data)
                            if (!joined) {
                                setJoined(true)
                                Ref.child("players").update({
                                    [uid]: init.players.init
                                }, err => err && console.log(err))
                            }
                        }
                    }, err => err && console.log(err))
                    setUID(uid)
                    setRef(Ref)
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
            AUTH.signOut()
        }
    }, [onExit])


    return !data ? <Loading /> : (
        <FireCTX.Provider value={{ uid, Ref }}>
            <DataCTX.Provider value={data}>
                {children}
            </DataCTX.Provider>
        </FireCTX.Provider>
    )
}