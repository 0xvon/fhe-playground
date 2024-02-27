import { getBytes } from "@/backend/utils";

interface Props {
    title: string;
    result: string;
}

const Output = ({ title, result }: Props) => {
    const bytesize = getBytes(result);
    return (
        <div className="my-4">
            <h2 className="text-black text-xl font-semibold bg-blue-300">{title} ({bytesize.toLocaleString()}B)</h2>
            <div className="h-[220px] overflow-x-hidden overflow-y-scroll bg-blue-100">
                <p className="text-black break-words">{result}</p>
            </div>
        </div>
    );
};

export default Output;