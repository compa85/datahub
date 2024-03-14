import Sidebar from "../components/CustomSidebar";

function Query() {
    return (
        <>
            <div className="flex">
                <Sidebar selectedKey="query" />

                <div className="max-h-svh w-full overflow-auto p-4">
                    <h1>Query</h1>
                </div>
            </div>
        </>
    );
}

export default Query;
