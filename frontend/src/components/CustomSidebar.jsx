import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faDatabase, faTable, faSquareCaretLeft, faSquareCaretRight } from "@fortawesome/free-solid-svg-icons";

function Sidebar({ selectedKey }) {
    return (
        <>
            <aside className="border-divider border-r-small sticky top-0 flex h-svh min-w-64 flex-col gap-5 overflow-y-auto p-5">
                <div className="flex w-full items-center justify-center">
                    <h2 className="text-2xl font-bold">DataHub</h2>
                </div>

                <Listbox
                    className="h-full"
                    itemClasses={{
                        base: "px-4 py-3 rounded-medium gap-3 data-[selected=true]:bg-default-100",
                        title: "font-medium tracking-wide text-default-500 group-data-[selected=true]:text-foreground",
                    }}
                    variant="flat"
                    aria-label="Sidebar"
                    selectedKeys={[selectedKey]}
                    selectionMode="single"
                    hideSelectedIcon={true}
                >
                    <ListboxItem
                        key="browse"
                        href="/browse"
                        title="Tabella"
                        startContent={<FontAwesomeIcon icon={faTable} className="text-default-500 group-data-[selected=true]:text-foreground text-lg" />}
                    ></ListboxItem>

                    <ListboxItem
                        key="query"
                        href="/query"
                        title="Query"
                        startContent={<FontAwesomeIcon icon={faDatabase} className="text-default-500 group-data-[selected=true]:text-foreground text-lg" />}
                    ></ListboxItem>

                    <ListboxItem
                        key="settings"
                        href="/settings"
                        title="Impostazioni"
                        startContent={<FontAwesomeIcon icon={faGear} className="text-default-500 group-data-[selected=true]:text-foreground text-lg" />}
                    ></ListboxItem>
                </Listbox>
            </aside>
        </>
    );
}

export default Sidebar;
