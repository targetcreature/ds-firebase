import { useRoom, useSet } from "./_app"

type Props = {
    roomId: string
}

const App: React.FC = () => {

    const { my, game } = useRoom()
    const set = useSet()

    return (
        <div>
            <div>Name: {my.name || "No Name"}</div>
            <div>Round: {game.round}</div>
            <button type="button" onClick={() => set.my("name", (name) => "Jibb")}>Nameify</button>
            <button type="button" onClick={() => set.game("round", (n) => n + 1)}>Gameify</button>
        </div>
        // <Test />
    )

}

export default App
