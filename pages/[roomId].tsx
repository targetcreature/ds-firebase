import { useData } from "./_app"

type Props = {
    roomId: string
}

const App: React.FC = () => {

    const data = useData()

    console.log({ data })

    return (
        <div>room</div>
        // <Test />
    )

}

export default App
