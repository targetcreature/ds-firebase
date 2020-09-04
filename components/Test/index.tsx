import { useSetData } from "../../context/firebase"

export const Test: React.FC = () => {

    const produce = useSetData()

    return (
        <div>
            <div>Test</div>
            <button type="button" onClick={() => {
                produce((draft, uid) => {
                    draft.players[uid].name = "Tommy"
                    return draft
                }, (err) => err && console.log(err))
            }}>UPDATE</button>
        </div>
    )

}