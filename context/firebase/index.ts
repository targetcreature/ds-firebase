import { createContext, useContext } from 'react'
import { _provider } from './provider'
import { initializeFirebase } from './_bin/initializeFirebase'

type Props<G, P> = {
    config: Object
    init: {
        game: G,
        player: P,
    }
    Loading?: React.FC
}

export type MetaPlayer = {
    status: {
        isActive: boolean
        isReady: boolean
        isSpectating: boolean
    }
}

export type State<G, P> = {
    game: G
    owner: string
    isClosed: boolean
    players: Record<string, P & MetaPlayer>
}

interface UseRoom<G, P> extends State<G, P> {
    my: P
}

interface UseSet<G, P> {
    game: <K extends keyof G>(key: K, cb: (draft: G[K]) => G[K], onComplete?: () => void) => void
    my: <K extends keyof P>(key: K, cb: (draft: P[K]) => P[K], onComplete?: () => void) => void
}


type UseFirebase<G, P> = [
    React.FC,
    () => UseRoom<G, P>,
    () => UseSet<G, P>
]

export type FireCTX = {
    uid: string,
    Ref: firebase.database.Reference,
    isOwner: boolean
}

export const useFirebase = <G, P>(props: Props<G, P>): UseFirebase<G, P> => {

    const { config, init: { game, player }, Loading } = props

    const init: State<G, P> = {
        game,
        owner: null,
        isClosed: false,
        players: {
            init: {
                ...player,
                status: {
                    isActive: true,
                    isReady: false,
                    isSpectating: false
                }
            }
        }
    }

    const DataCTX = createContext(init)
    const FireCTX = createContext<FireCTX>(null)

    const { AUTH, DB } = initializeFirebase(config)

    const useRoom = (): UseRoom<G, P> => {
        const { uid } = useContext(FireCTX)
        const data = useContext(DataCTX)
        return {
            ...data,
            my: data.players[uid]
        }
    }

    const useSet = (): UseSet<G, P> => {
        const { Ref, uid, isOwner } = useContext(FireCTX)
        return {
            game: <K extends keyof G>(key: K, cb: (draft: G[K]) => G[K], onComplete?: () => void) => {
                if (isOwner) {
                    Ref.child(`game/${key}`).transaction((d) => cb(d), (err) => {
                        if (err) throw err
                        onComplete && onComplete()
                    })
                }
            },
            my: <K extends keyof P>(key: K, cb: (draft: P[K]) => P[K], onComplete?: () => void) => {
                Ref.child(`players/${uid}/${key}`).transaction((d) => cb(d), (err) => {
                    if (err) throw err
                    onComplete && onComplete()
                })
            }
        }
    }

    const Provider = _provider({
        AUTH,
        DB,
        init,
        DataCTX,
        FireCTX,
        Loading
    })

    return [
        Provider,
        useRoom,
        useSet
    ]

}