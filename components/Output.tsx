import { getBytes } from "@/backend/utils";
import { useEffect, useState } from "react";
import { DialogComponent } from "./Dialog";
import { FaFile, FaInfoCircle, FaStopwatch } from "react-icons/fa";

interface Props {
    title: string;
    result: string;
    time: number;
    infoFileDirectory: string;
    infoFilePath: string;
}

const Output = ({ title, result, time, infoFileDirectory, infoFilePath }: Props) => {
    const [popupFlag, setPopupFlag] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [content, setContent] = useState("");
    const bytesize = getBytes(result);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/markdown/${infoFileDirectory}/${infoFilePath}`)
            .then((data) => data.json())
            .then((json) => {
                setContent(json.htmlContent);
                setIsLoading(false);
            })
            .catch((e) => {
                console.error(e);
                alert(e.digest);
                setIsLoading(false);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [infoFileDirectory]);

    return (
        <div className="my-4">
            <div className="flex justify-between items-center bg-blue-300 p-2">
                <div className="flex itemx-center gap-4">
                    <h2 className="text-black text-xl font-semibold">{title}</h2>
                    <div className="flex items-center gap-1"><FaFile size={15} /><p className="text-black">{bytesize.toLocaleString()}B</p></div>
                    <div className="flex items-center gap-1"><FaStopwatch size={15} /><p className="text-black">{time.toLocaleString()}msec</p></div>
                </div>
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