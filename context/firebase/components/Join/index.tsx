import { useCallback, useState } from "react"

type Props = {
    handler: (name: string) => void
    isSpectating: boolean
    playerList: string[]
}

export const Join: React.FC<Props> = ({ handler, isSpectating, playerList }) => {

    const [name, setName] = useState("")
    const [error, setError] = useState("")

    const onClick = useCallback(() => {
        if (!name) return setError("enter a name dummy")
        const players = playerList.map((p) => p.toLowerCase())
        if (players.includes(name.toLowerCase())) return setError("name's taken")
        handler(name)
    }, [playerList, handler, name])

    return (
        <div className="join_room_wrap"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(0,0,0,0.5)",
            }}>
            <div className="join_room_body"
                style={{
                    padding: "20px",
                    borderRadius: "5px",
                    background: "white",
                    display: "grid",
                    justifyItems: "center",
                    textAlign: "center",
                    fontFamily: "sans-serif",
                    gridTemplateRows: "2fr 2fr 1fr 1fr"
                }}>

                <p>ENTER NAME</p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onClick()
                    }}
                >
                    <input type="text"
                        style={{
                            fontSize: "2em",
                            width: "250px"
                        }}
                        value={name} onChange={(e) => {
                            setError("")
                            setName(e.target.value)
                        }} />
                    <button type="submit"
                        style={{
                            marginLeft: "5px",
                            fontSize: "2em"
                        }}>
                        Join
                            </button>
                </form>
                <div className="join_room_error" style={{ color: "red" }}>{error}</div>
                <div className="join_room_spectator">{isSpectating && "spectator mode"}</div>
            </div>
        </div>
    )

}