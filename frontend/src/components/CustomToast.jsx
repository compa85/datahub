import { Button } from "@nextui-org/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function CustomToast({ children }) {
    return (
        <div className="bg-content1 shadow-small rounded-large absolute bottom-4 right-4">
            <div className="flex items-center gap-4 p-2">
                <p className="text-foreground-500 pl-3 text-sm">{children}</p>

                <Button isIconOnly className="bg-transparent">
                    <FontAwesomeIcon icon={faXmark} />
                </Button>
            </div>
        </div>
    );
}

export default CustomToast;
