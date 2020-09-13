import { useOwner, useRoom, useSet } from "./_app"

type Props = {
    roomId: string
}

const App: React.FC = () => {

    const { my, game } = useRoom()
    const set = useSet()
    const owner = useOwner()

    return (
        <div>
            <div>Name: {my.name}</div>
            <div>Round: {game.round}</div>
            <button type="button" onClick={() => set.my("name", (draft) => draft.replace("a", "!"))}>Nameify</button>
            <button type="button" onClick={() => set.game("round", (n) => n + 1)}>Gameify</button>
            <button type="button" onClick={() => set.publicData((draft) => {
                draft.dobby = "dibby"
            })}>Publify</button>
            <button type="button" onClick={() => owner.startGame()}>Start Game</button>
        </div>
    )

}

export default App
