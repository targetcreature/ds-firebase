import { useRoom, useSet } from "./_app"

type Props = {
    roomId: string
}

const App: React.FC = () => {

    const { my, game } = useRoom()
    const set = useSet()

    set.publicData((draft) => ({
        ...draft,
        test: "hi"
    }))


    return (
        <div>
            {
                Object.entries(my).map(([key, val]) =>
                    key !== "status" &&
                    <div key={key}>
                        {key}: {val}
                    </div>
                )
            }
            <div>Name: {my.name || "No Name"}</div>
            <div>Round: {game.round}</div>
            <button type="button" onClick={() => set.my("name", (name) => "Jibb")}>Nameify</button>
            <button type="button" onClick={() => set.game("round", (n) => n + 1)}>Gameify</button>
            {/* <button type="button" onClick={() => set.publicData({ bibby: "baby" })}>Publify</button> */}
        </div>
    )

}

export default App
