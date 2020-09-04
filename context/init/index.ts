import { State } from "./_types"

export const initState: State = {
    owner: null,
    players: {},
    game: {
        round: 0,
        turn: 0,
        submissions: {}
    }
}

export const newState = (uid: string, name: string): State => ({
    ...initState,
    owner: uid,
    players: {
        [uid]: {
            name,
            isReady: false,
            score: 0
        }
    }
})