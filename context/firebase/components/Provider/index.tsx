import { useRouter } from "next/router"
import { Context, useCallback, useEffect, useMemo, useState } from "react"
import { FireCTX, State } from "../.."
import { Join } from "../Join"

type Props = {
    AUTH: firebase.auth.Auth
    DB: firebase.database.Database
    init: State<{}, {}, {}>,
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
    const [data, setData] = useState<Props["init"]>({
        ...init,
        players: {}
    })
    const [isReady, setReady] = useState(false)
    const [isJoined, setJoined] = useState(false)
    const [owner, setOwner] = useState(null)

    const router = useRouter()

    const isOwner = useMemo(() => !!owner && owner === uid, [owner, uid])

    useEffect(() => {

        if (router.asPath !== router.route) {

            const [room] = Object.values(router.query)
            const Ref = DB.ref(room as string)
            setRef(Ref)

            AUTH.onAuthStateChanged(user => {
                if (user) {
                    const { uid } = user
                    setUID(uid)
                    Ref.once("value", snap => {
                        const data: Props["init"] = snap.val()
                        if (!data) {
                            const initData = {
                                ...init,
                                players: {
                                    [uid]: init.players.init
                                },
                                status: {
                                    ...init.status,
                                    owner: uid,
                                }
                            }
                            Ref.set(initData)
                        }
                        else {
                            Ref.child(`players/${uid}`).transaction((p) => {
                                if (!p) return init.players.init
                                setJoined(true)
                                const resume: Props["init"]["players"][0] = { ...p }
                                resume.status.isActive = true
                                resume.status.isSpectating = !data.status.isClosed
                                return resume
                            }, err => err && console.log(err))
                        }

                        Ref.on("value", snap => {
                            const data: Props["init"] = snap.val()
                            setOwner(data.status.owner)
                            setData(data)
                            setReady(true)
                        }, err => err && console.log(err))

                    })
                }
            }, err => err && console.log("auth error: ", err))
        }

    }, [router])

    const onExit = useCallback(() => {
        Ref.off()
        Ref.child(`players/${uid}/status/isActive`).set(false)
        if (isOwner) {
            const nextOwner = Object.entries(data.players).filter(([key, { status: { isActive } }]) => key !== uid && !!isActive).map(([key]) => key)[0]
            if (nextOwner) {
                Ref.child("status/owner").set(nextOwner, (err) => console.log("owner error: ", err))
            }
            else {
                // Ref.remove()
            }
        }
        AUTH.signOut()
    }, [data.players, isOwner, Ref, uid])

    useEffect(() => {
        window.onbeforeunload = () => {
            onExit()
        }
    }, [onExit])

    const handleJoin = useCallback((name: string) => {
        Ref.child(`players/${uid}/name`).set(name, (err) =>
            err ? console.log(err) : setJoined(true)
        )
    }, [Ref, uid])


    return !isReady ? <Loading /> : (
        <FireCTX.Provider value={{ uid, Ref, isOwner }}>
            <DataCTX.Provider value={data}>
                {!isJoined && <Join onClick={handleJoin} />}
                {children}
            </DataCTX.Provider>
        </FireCTX.Provider>
    )
}