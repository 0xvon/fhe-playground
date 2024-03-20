import Image from "next/image";

interface Props {
    title: string;
    resultImg?: string; // base64 string format
}

const SimpleImageOutput = ({ title, resultImg }: Props) => {
    return (
        <div className="mb-4">
            <div className="flex justify-between items-center bg-blue-300 p-2">
                <div className="flex itemx-center gap-4">
                    <h2 className="text-black text-xl font-semibold">{title}</h2>
                </div>
                <div />
            </div>
            <div className="h-[200px] overflow-x-hidden overflow-y-scroll bg-blue-100 p-2">
                {resultImg && <Image src={`data:image/png;base64,${resultImg}`} width={500} height={500} className="w-full m-auto" alt="mnist image" />}
            </div>
        </div>
    );
};

export default SimpleImageOutput;