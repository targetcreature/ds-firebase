import { State } from "./_types"

export const initState = (uid: string, name: string): State => ({
    publicData: {
        game: {
            round: 0,
            turn: 0
        },
        owner: uid,
        players: {
            [uid]: {
                name,
                isReady: false,
                score: 0
            }
        }
    },
    privateData: {
        [uid]: {
            submission: "",
            vote: 0
        }
    }
})