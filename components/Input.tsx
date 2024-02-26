import { InputData } from "@/app/page";
import { FormEvent, useState } from "react";

interface Props {
    onSubmit: (data: InputData) => void;
}

const Input = ({ onSubmit }: Props) => {
    const [inputA, setInputA] = useState('');
    const [inputB, setInputB] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            a: inputA.split(',').map(Number),
            b: inputB.split(',').map(Number),
        });
    };

    return (
        <div className="my-12">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="inputA" className="block mb-2">Input A:</label>
                    <input
                        id="inputA"
                        type="text"
                        name={inputA}
                        onChange={(e) => setInputA(e.target.value)}
                        className="border border-gray-300 p-2 w-full"
                        placeholder="e.g., 1,2,3"
                    />
                </div>
                <div>
                    <label htmlFor="inputB" className="block mb-2">Input B:</label>
                    <input
                        id="inputB"
                        type="text"
                        name={inputB}
                        onChange={(e) => setInputB(e.target.value)}
                        className="border border-gray-300 p-2 w-full"
                        placeholder="e.g., 4,5,6"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    CALCULATE
                </button>
            </form>
        </div>
    );
};

export default Input;