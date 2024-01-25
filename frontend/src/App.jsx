import { useState } from "react";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="flex flex-col justify-center gap-4">
            <h1 className="text-4xl font-bold">Vite + React</h1>
            <button
                className="rounded-lg px-3 py-2 transition hover:outline hover:outline-black dark:hover:outline-white"
                onClick={() => setCount((count) => count + 1)}
            >
                count is {count}
            </button>
        </div>
    );
}

export default App;
