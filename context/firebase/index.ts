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

type UseFirebase<T> = [
    React.FC,
    () => T,
    (cb: (draft: T, uid: string) => T, onComplete?: () => void) => void
]

export const useFirebase = <G, P>(props: Props<G, P>): UseFirebase<State<G, P>> => {

    const { config, initGame, initPlayer, Loading } = props

    const init: State<G, P> = {
        game: initGame,
        owner: null,
        players: {
            init: initPlayer
        }
    }

    const DataCTX = createContext(init)
    const FireCTX = createContext<{ uid: string, DB: firebase.database.Reference }>(null)

    const { AUTH, DB } = initializeFirebase(config)

    const useDB = () => {
        const { DB, uid } = useContext(FireCTX)
        return (cb: (draft: State<G, P>, uid: string) => State<G, P>, onComplete?: () => void) => {
            DB.transaction((state) => {
                return cb(state, uid)
            }, (err) => {
                if (err) throw err
                onComplete && onComplete()
            })
        }
    }

    const usePlayer = () => {
        const { DB, uid } = useContext(FireCTX)
        return (cb: (draft: State<G, P>, uid: string) => State<G, P>, onComplete?: () => void) => {
            DB.child(`players/${uid}`).transaction((state) => {
                return cb(state, uid)
            }, (err) => {
                if (err) throw err
                onComplete && onComplete()
            })
        }
    }

    const useData = () => useContext(DataCTX)

    const Provider = _provider({
        AUTH,
        DB,
        init,
        DataCTX,
        FireCTX,
        Loading
    })

    return [
        Provider, useData, usePlayer
    ]

}