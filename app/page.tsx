"use client";
import { useState } from "react";
// components
import Header from "@/components/Header";
import Input from "@/components/Input";
import Output from "@/components/Output";
import Answer from "@/components/Answer";
// backend
import { InputData, ResultData, ResultDataConstructor } from "@/backend/entity";
import { op2symbol } from "@/backend/utils";
import { enc_eval_relin_dec } from "@/backend/seal";

export default function Home() {
    const [result, setResult] = useState<ResultData>(ResultDataConstructor.default());
    const handleFormSubmit = async (data: InputData) => {
        try { setResult(await enc_eval_relin_dec(data)) } catch (e) { alert(e) }
    }

    return (
        <main className="container mx-auto bg-white">
            <Header />
            <h1 className="text-black text-6xl font-semibold m-auto text-center my-10">Dec(Enc(A) ♢ Enc(B)) = A ♢ B</h1>
            <Input onSubmit={handleFormSubmit} />
            <Output title="Secret Key (sk)" result={result.sk} />
            <Output title="Public Key (pk)" result={result.pk} />
            <Output title="Enc(A, pk)" result={result.encA} />
            <Output title="Enc(B, pk)" result={result.encB} />
            <Output title={`Enc(A) ${op2symbol(result.operation)} Enc(B)`} result={result.evalResult} />
            <Output title={`Dec(Enc(A) ${op2symbol(result.operation)} Enc(B), sk)`} result={result.dec} />
            <Answer title={`A ${op2symbol(result.operation)} B`} result={result.resultArray} answer={result.answerArray} />
        </main>
    );
}
