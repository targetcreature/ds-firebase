import { useCallback, useState } from "react"
import styles from "./styles.module.scss"

type Props = {
    handler: (name: string) => void
    playerList: string[]
    isOwner: boolean
}

export const Join: React.FC<Props> = (props) => {

    const {
        handler,
        playerList,
        isOwner
    } = props

    const [name, setName] = useState("")
    const [error, setError] = useState("")

    const onClick = useCallback(() => {
        if (!name) return setError("enter a name dummy")
        const players = playerList.filter((p) => !!p).map((p) => p.toLowerCase())
        if (players.includes(name.toLowerCase())) {
            setName("")
            return setError("name's taken")
        }
        handler(name)
    }, [playerList, handler, name])

    return (
        <div className={styles.join}>
            <form className="join_room_body"
                onSubmit={(e) => {
                    e.preventDefault()
                    onClick()
                }}
                style={{
                    padding: "20px",
                    borderRadius: "5px",
                    background: "white",
                    display: "grid",
                    justifyItems: "center",
                    textAlign: "center",
                    fontFamily: "sans-serif",
                }}>

                <p><b>PLAYERS</b></p>
                <ul>
                    {
                        playerList.map((p, i) =>
                            <li key={i}>{p}</li>
                        )
                    }
                </ul>

                <input
                    type="text"
                    placeholder={error || "Enter Name"}
                    style={{
                        fontSize: "2em",
                        width: "250px"
                    }}
                    value={name} onChange={(e) => {
                        setError("")
                        setName(e.target.value)
                    }} />
                <br />
                <button type="submit"
                    style={{
                        fontSize: "2em",
                    }}>
                    {isOwner ? "Create" : "Join"} Room
                </button>
            </form>
        </div>
    )

}