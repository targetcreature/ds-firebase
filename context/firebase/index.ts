import { createContext, useContext } from 'react'
import { initializeFirebase } from './bin/initializeFirebase'
import { _provider } from './_provider'

type Props<G, P> = {
    config: Object,
    initGame: G,
    initPlayer: P,
    Loading?: React.FC
}

type State<G, P> = {
    game: G,
    owner: string
    players: Record<string, P>
}

interface UseRoom<G, P> extends State<G, P> {
    my: P
}

interface UseSet<G, P> {
    // game: (cb: (draft: State<G, P>) => State<G, P>, onComplete?: () => void) => void
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

    const { config, initGame, initPlayer, Loading } = props

    const init: State<G, P> = {
        game: initGame,
        owner: null,
        players: {
            init: initPlayer
        }
    }

    const DataCTX = createContext(init)
    const FireCTX = createContext<FireCTX>(null)

    const { AUTH, DB } = initializeFirebase(config)

    const useRoom = () => {
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
        Provider, useRoom, useSet
    ]

}