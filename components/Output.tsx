import { getBytes } from "@/backend/utils";
import { useEffect, useState } from "react";
import { DialogComponent } from "./Dialog";
import { FaInfoCircle } from "react-icons/fa";
import { markdownContent } from "@/backend/markdown";

interface Props {
    title: string;
    result: string;
    infoFileDirectory: string;
    infoFilePath: string;
}

const Output = ({ title, result, infoFileDirectory, infoFilePath }: Props) => {
    const [popupFlag, setPopupFlag] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState("");
    const bytesize = getBytes(result);

    useEffect(() => {
        setIsLoading(true);
        markdownContent("spec/" + infoFileDirectory, infoFilePath)
            .then((_content) => {
                setContent(_content);
                setIsLoading(false);
            })
            .catch((e) => {
                alert(e);
                setIsLoading(false);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [infoFileDirectory]);

    return (
        <div className="my-4">
            <div className="flex justify-between items-center bg-blue-300 p-2">
                <h2 className="text-black text-xl font-semibold">{title} ({bytesize.toLocaleString()}B)</h2>
                <FaInfoCircle onClick={() => setPopupFlag(true)} className="mr-2" size={20} color="black" opacity={isLoading ? "0.2" : "1.0"} />
            </div>
            <div className="h-[220px] overflow-x-hidden overflow-y-scroll bg-blue-100 p-2">
                <p className="text-black break-words">{result}</p>
            </div>
            <DialogComponent viewFlag={popupFlag} setViewFlag={setPopupFlag} content={content} />
        </div>
    );
};

export default Output;