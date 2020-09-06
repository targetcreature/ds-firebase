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

const model = {
    rooms: {
        roomId: {
            name: "room name",
            owner: "tyuilbn",
            game: {
                round: 0,
                turn: 0,
            }
        },
    },
    roomsPublic: {
        roomId: {
            uuid: {
                submission: "hi there",
                vote: 0
            }
        }
    },
    users: {
        sdfghjk: {
            room: "dfghjk",
            submission: "hi there",
            score: 0
        }
    }
}