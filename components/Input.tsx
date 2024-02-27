import { InputData } from "@/backend/entity";
import { FormEvent, useState } from "react";

interface Props {
    onSubmit: (data: InputData) => void;
}

const Input = ({ onSubmit }: Props) => {
    const [inputA, setInputA] = useState('');
    const [operation, setOperation] = useState('add');
    const [inputB, setInputB] = useState('');
    const [scheme, setScheme] = useState('bfv');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            a: inputA.split(',').map(Number),
            b: inputB.split(',').map(Number),
            operation: operation,
            scheme: scheme,
        });
    };

    return (
        <div className="my-12">
            <form className="space-y-4 text-black" onSubmit={handleSubmit}>
                <div className="flex align-center items-center">
                    <label htmlFor="inputA" className="block mr-2">A:</label>
                    <input
                        id="inputA"
                        type="text"
                        name={inputA}
                        onChange={(e) => setInputA(e.target.value)}
                        className="border border-gray-300 p-2 w-full"
                        placeholder="e.g., 1,2,3"
                    />
                </div>
                <select
                    id="operation"
                    onChange={(e) => setOperation(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-center w-auto"
                >
                    <option value="add" selected>+</option>
                    <option value="mul">x</option>
                </select>
                <div className="flex align-center items-center">
                    <label htmlFor="inputB" className="block mr-2">B:</label>
                    <input
                        id="inputB"
                        type="text"
                        name={inputB}
                        onChange={(e) => setInputB(e.target.value)}
                        className="border border-gray-300 p-2 w-full"
                        placeholder="e.g., 4,5,6"
                    />
                </div>
                <div className="flex items-center">
                    <select
                        onChange={(e) => setScheme(e.target.value)}
                        id="scheme"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-center w-auto mr-2"
                    >
                        <option value="bfv" selected>BFV</option>
                        <option value="bgv">BGV</option>
                        <option value="ckks" disabled>CKKS</option>
                    </select>
                    <p>Scheme</p>
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                    CALCULATE
                </button>
            </form>
        </div>
    );
};

export default Input;