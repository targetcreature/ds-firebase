import { createContext, useContext } from 'react'
import { _provider } from './components/Provider'
import { initializeFirebase } from './_bin/initializeFirebase'

type Props<G, P, D> = {
    config: Object
    init: {
        game: G,
        player: P,
        publicData: D,
    }
    Loading?: React.FC
}

export type State<G, P, D> = {
    game: G
    players: Record<string, P & {
        name: string
        status: {
            isActive: boolean
            isReady: boolean
            isSpectating: boolean
        }
    }>
    publicData?: D | {}
    status: {
        owner: string
        isClosed: boolean
    }
}

type Player<G, P, D> = State<G, P, D>["players"][0]

type UseRoom<G, P, D> = State<G, P, D> & {
    my: Player<G, P, D>
}

export type UseSet<G, P, D> = {
    game: <K extends keyof G>(key: K, cb: (draft: G[K]) => G[K], onComplete?: () => void) => void
    my: <K extends keyof Player<G, P, D>>(key: K, cb: (draft: Player<G, P, D>[K]) => Player<G, P, D>[K], onComplete?: () => void) => void
    publicData?: (data: D, onComplete?: () => void) => void
}

type UseFirebase<G, P, D> = [
    React.FC,
    () => UseRoom<G, P, D>,
    () => UseSet<G, P, D>
]

export type FireCTX = {
    uid: string,
    Ref: firebase.database.Reference,
    isOwner: boolean
}

export const useFirebase = <G, P, D>(props: Props<G, P, D>): UseFirebase<G, P, D> => {

    const { config, init: { game, player, publicData = null }, Loading } = props

    const init: State<G, P, D> = {
        game,
        players: {
            init: {
                ...player,
                name: "",
                status: {
                    isActive: true,
                    isReady: false,
                    isSpectating: false
                }
            }
        },
        publicData,
        status: {
            owner: null,
            isClosed: false,
        },
    }

    const DataCTX = createContext(init)
    const FireCTX = createContext<FireCTX>(null)

    const { AUTH, DB } = initializeFirebase(config)

    const useRoom = (): UseRoom<G, P, D> => {
        const { uid } = useContext(FireCTX)
        const data = useContext(DataCTX)
        return {
            ...data,
            my: data.players[uid]
        }
    }

    const useSet = (): UseSet<G, P, D> => {
        const { Ref, uid, isOwner } = useContext(FireCTX)
        const set: UseSet<G, P, D> = {
            game: (key, cb, onComplete?) => {
                if (isOwner) {
                    Ref.child(`game/${key}`).transaction((d) => cb(d), (err) => {
                        if (err) throw err
                        onComplete && onComplete()
                    })
                }
            },
            my: (key, cb, onComplete?) => {
                Ref.child(`players/${uid}/${key}`).transaction((d) => cb(d), (err) => {
                    if (err) throw err
                    onComplete && onComplete()
                })
            }
        }

        if (publicData) {
            set.publicData = (data, onComplete?) => {
                Ref.child("publicData").set(data, (err) => {
                    if (err) throw err
                    onComplete && onComplete()
                })
            }
        }

        return set
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