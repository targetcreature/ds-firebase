import { useRouter } from "next/router"
import { Context, useCallback, useEffect, useMemo, useState } from "react"
import { FireCTX } from ".."

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
    FireCTX: Context<FireCTX>
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
    const [owner, setOwner] = useState(null)

    const router = useRouter()

    const isOwner = useMemo(() => !!owner && owner === uid, [owner, uid])

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
                            if (!data.players[uid]) {
                                Ref.child(`players/${uid}`).set(init.players.init, err => err && console.log(err))
                                data.players[uid] = init.players.init
                            }
                            setOwner(data.owner)
                            setData(data)
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
        <FireCTX.Provider value={{ uid, Ref, isOwner }}>
            <DataCTX.Provider value={data}>
                {children}
            </DataCTX.Provider>
        </FireCTX.Provider>
    )
}