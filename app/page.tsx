"use client";
import { useState } from "react";
// components
import Header from "@/components/Header";
import Input from "@/components/Input";
import Output from "@/components/Output";
import Answer from "@/components/Answer";
// backend
import { DICTIONARY, InputData, PerformanceTime, PerformanceTimeConstructor, ResultData, ResultDataConstructor } from "@/backend/entity";
import { enc_eval_relin_dec } from "@/backend/seal";

export default function Home() {
    const [result, setResult] = useState<ResultData>(ResultDataConstructor.default());
    const [time, setTime] = useState<PerformanceTime>(PerformanceTimeConstructor.default());
    const handleFormSubmit = async (data: InputData) => {
        try {
            const { resultData, performanceTime } = await enc_eval_relin_dec(data);
            setResult(resultData);
            setTime(performanceTime);
        } catch (e) { alert(e) }
    }

    return (
        <main className="container mx-auto bg-white">
            <Header />
            <h1 className="text-black text-6xl font-semibold m-auto text-center my-10">{DICTIONARY.TITLE}</h1>
            <Input onSubmit={handleFormSubmit} />
            <Output title={DICTIONARY.SK_TITLE} result={result.sk} time={time.genKeyTime} infoFileDirectory={result.scheme} infoFilePath="secretkey" />
            <Output title={DICTIONARY.PK_TITLE} result={result.pk} time={time.genKeyTime} infoFileDirectory={result.scheme} infoFilePath="publickey" />
            <Output title={DICTIONARY.ENC_A_TITLE} result={result.encA} time={time.encATime} infoFileDirectory={result.scheme} infoFilePath="encryption_and_decryption" />
            <Output title={DICTIONARY.ENC_B_TITLE} result={result.encB} time={time.encBTime} infoFileDirectory={result.scheme} infoFilePath="encryption_and_decryption" />
            <Output title={result.operation === "+" ? DICTIONARY.EVAL_ADD_TITLE : DICTIONARY.EVAL_MUL_TITLE} result={result.evalResult} time={time.evalTime} infoFileDirectory={result.scheme} infoFilePath="evaluation" />
            <Output title={result.operation === "+" ? DICTIONARY.DEC_ADD_TITLE : DICTIONARY.DEC_MUL_TITLE} result={result.dec} time={time.decTime} infoFileDirectory={result.scheme} infoFilePath="encryption_and_decryption" />
            <Answer title={result.operation === "+" ? DICTIONARY.ANS_ADD_TITLE : DICTIONARY.ANS_MUL_TITLE} result={result.resultArray} answer={result.answerArray} />
        </main>
    );
}
