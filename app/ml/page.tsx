"use client";
import { useState } from "react";
// components
import Header from "@/components/Header";
// backend
import { DICTIONARY } from "@/backend/entity";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";
import SimpleOutput from "@/components/SimpleOutput";
import SimpleImageOutput from "@/components/SimpleImageOutput";

interface Result {
    X_q: [number];
    X_q_img: string;
    X_q_enc: string;
    output_q_enc: string;
    output: number;
    ans: number;

    keygen_time: number;
    enc_time: number;
    pred_time: number;
    dec_time: number;
}

interface Mnist {
    id: number;
    X: [number];
    X_img: string;
    y: number;
}

const endpoint = process.env.NEXT_PUBLIC_ML_ENDPOINT ?? "http://127.0.0.1:8000";

export default function ML() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<Result | undefined>();
    const [mnist, setMnist] = useState<Mnist | undefined>();

    return (
        <main className="container mx-auto bg-white">
            <Header />
            <h1 className="text-black text-6xl font-semibold m-auto text-center my-10">{DICTIONARY.TITLE}</h1>
            <div className="grid grid-cols-2 gap-4 grid-flow-col">
                <div>
                    <button type="button" className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-600 w-full my-8"
                        onClick={() => {
                            setIsLoading(true);
                            const randomId = Math.floor(Math.random() * 100);
                            fetch(`${endpoint}/img/?id=${randomId}`)
                                .then((data) => data.json())
                                .then((json) => {
                                    setMnist(json as Mnist);
                                    setIsLoading(false);
                                })
                                .catch((e) => {
                                    alert(e.digest);
                                    setIsLoading(false);
                                })
                        }} disabled={isLoading}>{isLoading ? <FaSpinner className="animate-spin" /> : "Random Image"}</button>
                    {mnist && <Image src={`data:image/png;base64,${mnist.X_img}`} width={500} height={500} className="w-full m-auto" alt="mnist image" />}
                </div>
                <div>
                    <button type="button" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full my-8"
                        onClick={() => {
                            if (mnist) {
                                setIsLoading(true);
                                fetch(`${endpoint}/predict/?id=${mnist.id}`, { method: "POST" })
                                    .then((data) => data.json())
                                    .then((json) => {
                                        console.log(json);
                                        setResult(json as Result);
                                        setIsLoading(false);
                                    })
                                    .catch((e) => {
                                        console.error(e);
                                        alert(e.digest);
                                        setIsLoading(false);
                                    })
                            }
                        }} disabled={isLoading}>{isLoading ? <FaSpinner className="animate-spin" /> : "Run"}</button>
                    <SimpleImageOutput title="Quantized Input" resultImg={result?.X_q_img} />
                    <SimpleOutput title="Enc(QInput)" result={result?.X_q_enc?.toString() ?? "XXX"} time={result?.enc_time} />
                    <SimpleOutput title="Enc(QOutput)" result={result?.output_q_enc?.toString() ?? "XXX"} time={result?.pred_time} />
                    <SimpleOutput title="Output" result={result?.output?.toString() ?? "XXX"} time={result?.dec_time} />
                    <SimpleOutput title="Answer" result={result?.ans?.toString() ?? "XXX"} />
                </div>
            </div>
        </main>
    );
}
