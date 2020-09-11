import { useState } from "react"

type Props = {
    onClick: (name: string) => void
}

export const Join: React.FC<Props> = ({ onClick }) => {

    const [name, setName] = useState("")

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
                style={{
                    padding: "20px",
                    borderRadius: "5px",
                    background: "white"
                }}
                onSubmit={(e) => {
                    e.preventDefault()
                    onClick(name)
                }}
            >
                <h2>Enter Name</h2>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <button type="submit">Join</button>
            </form>
        </div>
    )

}