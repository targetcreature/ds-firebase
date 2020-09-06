import { createContext, useContext } from 'react'
import { _provider } from './_provider'

type UseFirebase<T> = [
    React.FC,
    () => T,
    (cb: (draft: T, uid: string) => T, onComplete?: () => void) => void
]

export const useFirebase = <T>(config: Object, init: T, Loading?: React.FC): UseFirebase<T> => {

    const DataCTX = createContext<T>(init)
    const FireCTX = createContext<{ uid: string, DB: firebase.database.Reference }>(null)

    const useDB = () => {
        const { DB, uid } = useContext(FireCTX)
        return (cb: (draft: T, uid: string) => T, onComplete?: () => void) => {
            DB.transaction((state) => {
                return cb(state, uid)
            }, (err) => {
                if (err) throw err
                onComplete && onComplete()
            })
        }
    }

    const useData = () => useContext(DataCTX)

    const Provider = _provider({ config, init, DataCTX, FireCTX, Loading })

    return [
        Provider, useData, useDB
    ]

}