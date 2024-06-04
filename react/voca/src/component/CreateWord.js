import { useRef } from "react";
import useFetch from "../hooks/useFetch";

export default function CreateWord() {
    const days = useFetch("http://localhost:3001/days");

    function onSubmit(e) {
        e.preventDefault();

        fetch(`http://localhost:3001/words/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                day: dayRef.current.value,
                eng: engRef.current.value,
                kor: korRef.current.value,
                isDone: false,
            }),
        }).then(res => {
            if (res.ok) {
                alert("생성 완료");
            }
        })
    }

    const engRef = useRef(null);
    const korRef = useRef(null);
    const dayRef = useRef(null);

    return <form onSubmit={onSubmit}>
        <div className="input_area">
            <label>Eng</label>
            <input type="text" placeholder="computer" reg={engRef} />
        </div>
        <div className="input_area">
            <label>Kor</label>
            <input type="text" placeholder="컴퓨터" reg={korRef} />
        </div>
        <div className="input_area">
            <label>Day</label>
            <select reg={dayRef}>
                {days.map(day => (
                    <option key={day.id} value={day.day}>
                        {day.day}
                    </option>
                ))}
            </select>
        </div>
        <button>저장</button>
    </form>;
}