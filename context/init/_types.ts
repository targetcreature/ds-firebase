export type State = {
    game: Game,
    owner: string,
    players: Record<string, Player>
}

export type Game = {
    round: number,
    turn: number,
    submissions: Record<string, {
        data: string
        votes: string[]
    }>
}

export type Player = {
    name: string,
    score: 0,
    isReady: false
}