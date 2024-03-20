import { getBytes } from "@/backend/utils";
import { FaFile, FaStopwatch } from "react-icons/fa";

interface Props {
    title: string;
    result: string;
    time?: number;
}

const SimpleOutput = ({ title, result, time }: Props) => {
    const bytesize = getBytes(result);

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center bg-blue-300 p-2">
                <div className="flex itemx-center gap-4">
                    <h2 className="text-black text-xl font-semibold">{title}</h2>
                    <div className="flex items-center gap-1"><FaFile size={15} /><p className="text-black">{bytesize.toLocaleString()}B</p></div>
                    {time && <div className="flex items-center gap-1"><FaStopwatch size={15} /><p className="text-black">{(time).toLocaleString()}sec</p></div>}
                </div>
                <div />
            </div>
            <div className="h-[100px] overflow-x-hidden overflow-y-scroll bg-blue-100 p-2">
                <p className="text-black break-words">{result}</p>
            </div>
        </div>
    );
};

export default SimpleOutput;