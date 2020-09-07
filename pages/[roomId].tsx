import { useRoom, useSet } from "./_app"

type Props = {
    roomId: string
}

const App: React.FC = () => {

    const data = useRoom()
    const set = useSet()

    console.log({ data })

    return (
        <div>
            <div>{data.my?.name || "No Name"}</div>
            <button type="button" onClick={() => set.my((draft) => {
                draft.name = "Larry"
                return draft
            })}>Larrify</button>
        </div>
        // <Test />
    )

}

export default App
