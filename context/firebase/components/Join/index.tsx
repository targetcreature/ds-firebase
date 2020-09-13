import { useCallback, useState } from "react"

type Props = {
    handler: (name: string) => void
    playerList: string[]
    isOwner: boolean
}

export const Join: React.FC<Props> = ({ handler, playerList, isOwner }) => {

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
                    gridTemplateRows: "2fr 2fr 1fr auto"
                }}>

                <p>
                    {
                        error ? <span className="join_room_error" style={{ color: "red" }}>{error}</span>
                            :
                            "ENTER NAME"
                    }
                </p>

                <input type="text"
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