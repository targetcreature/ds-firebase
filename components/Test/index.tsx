import { useSetData } from "../../context/firebase"

export const Test: React.FC = () => {

    const produce = useSetData()

    return (
        <div>
            <div>Test</div>
            <button type="button" onClick={() => {
                produce((draft, uid) => {
                    draft.game.round = 5
                    draft.players[uid].name = "Dommy"
                    return draft
                })
            }}>UPDATE</button>
        </div>
    )

}