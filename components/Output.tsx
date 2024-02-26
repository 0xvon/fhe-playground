interface Props {
    title: string;
    result: string;
}

const Output = ({ title, result }: Props) => {
    return (
        <div className="my-4">
            <h2 className="text-xl font-semibold bg-blue-300">{title}</h2>
            <div className="h-[220px] overflow-x-hidden overflow-y-scroll bg-blue-100">
                <p className="break-words">{result}</p>
            </div>
        </div>
    );
};

export default Output;