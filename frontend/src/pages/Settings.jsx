import Sidebar from "../components/CustomSidebar";

function Settings() {
    return (
        <>
            <div className="flex">
                <Sidebar selectedKey="settings" />

                <div className="max-h-svh w-full overflow-auto p-4">
                    <h1>Impostazioni</h1>
                </div>
            </div>
        </>
    );
}

export default Settings;
