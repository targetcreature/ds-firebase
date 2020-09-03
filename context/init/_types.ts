export type State = {
    publicData: {
        owner: string,
        game: {
            round: number,
            turn: number
        },
        players: Record<string, {
            name: string,
            score: 0,
            isReady: false
        }>
    },
    privateData: Record<string, {
        submission: "",
        vote: 0
    }>
}