interface Props {
    title: string;
    result: number[];
    answer: number[];
}

const Answer = ({ title, result, answer }: Props) => {
    const isCorrect = result.every((val, i) => val === answer[i]);

    return (
        <div className="my-4">
            <h2 className="text-black text-xl font-semibold bg-blue-300 p-2">{title}</h2>
            <div className={`h-[220px] overflow-x-hidden overflow-y-scroll ${isCorrect ? "bg-green-100" : "bg-red-100"} p-2`}>
                <p className="text-black break-words">{answer.join(',')}</p>
            </div>
        </div>
    );
};

export default Answer;