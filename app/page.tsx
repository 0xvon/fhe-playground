"use client";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Output from "@/components/Output";
import Answer from "@/components/Answer";
import { useState } from "react";
import SEAL from "node-seal";

export interface InputData {
    a: number[];
    b: number[];
    operation: string;
    scheme: string;
}

export interface ResultData {
    sk: string;
    pk: string;
    encA: string;
    encB: string;
    evalResult: string;
    dec: string;
    operation: string;
    result: number[];
    answer: number[];
}

export default function Home() {
    const [result, setResult] = useState<ResultData>({
        sk: '',
        pk: '',
        encA: '',
        encB: '',
        evalResult: '',
        dec: '',
        operation: 'add',
        result: [],
        answer: [],
    });

    const handleFormSubmit = async (data: InputData) => {
        const seal = await SEAL();
        const schemeType = data.scheme === 'bfv' ? seal.SchemeType.bfv : seal.SchemeType.bgv;
        const securityLevel = seal.SecurityLevel.tc128;
        const polyModulusDegree = 4096;
        const bitSizes = [36, 36, 37];
        const bitSize = 20;
        try {
            if (data.a.length !== data.b.length) throw Error(`a size ${data.a.length} must be same as b size ${data.b.length}`);
            const encParams = seal.EncryptionParameters(schemeType);
            encParams.setPolyModulusDegree(polyModulusDegree);
            encParams.setCoeffModulus(
                seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
            );
            encParams.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize));
            const context = seal.Context(encParams, true, securityLevel);
            const keyGenerator = seal.KeyGenerator(context);

            const secretKey = keyGenerator.secretKey();
            const publicKey = keyGenerator.createPublicKey();
            const relinKey = keyGenerator.createRelinKeys();
            // const galoisKey = keyGenerator.createGaloisKeys();

            const encoder = seal.BatchEncoder(context);
            const encrypter = seal.Encryptor(context, publicKey);
            const evaluator = seal.Evaluator(context);
            const decrypter = seal.Decryptor(context, secretKey);

            const plainTextA = encoder.encode(Int32Array.from(data.a));
            const plainTextB = encoder.encode(Int32Array.from(data.b));

            // enc
            const cipherTextA = encrypter.encrypt(plainTextA!);
            const cipherTextB = encrypter.encrypt(plainTextB!);

            // evaluate
            const evalResult = data.operation === 'add' ? evaluator.add(cipherTextA!, cipherTextB!) : evaluator.multiply(cipherTextA!, cipherTextB!);
            // relinearize
            const relinResult = evaluator.relinearize(evalResult!, relinKey);

            // dec
            const dec = decrypter.decrypt(relinResult!);
            const answer = data.a
                .map((val, i) =>
                    data.operation === 'add' ? val + data.b[i]
                        : val * data.b[i]
                )
                .map(val => isNaN(val) ? 0 : val);
            const _dec = encoder.decode(dec!).slice(0, answer.length);

            setResult({
                sk: secretKey.save(),
                pk: publicKey.save(),
                encA: cipherTextA!.save(),
                encB: cipherTextB!.save(),
                evalResult: relinResult!.save(),
                dec: _dec.toString(),
                operation: data.operation,
                result: Array.from(_dec),
                answer: answer,
            });
        } catch (e) {
            alert(e);
        }

    }

    return (
        <main className="container mx-auto bg-white">
            <Header />
            <h1
                className="text-black text-6xl font-semibold m-auto text-center my-10"
            >Dec(Enc(A) ♢ Enc(B)) = A ♢ B</h1>
            <Input onSubmit={handleFormSubmit} />
            <Output title="Secret Key (sk)" result={result.sk} />
            <Output title="Public Key (pk)" result={result.pk} />
            <Output title="Enc(A, pk)" result={result.encA} />
            <Output title="Enc(B, pk)" result={result.encB} />
            <Output title={`Enc(A) ${result.operation === 'add' ? '+' : 'x'} Enc(B)`} result={result.evalResult} />
            <Output title={`Dec(Enc(A) ${result.operation === 'add' ? '+' : 'x'} Enc(B), sk)`} result={result.dec} />
            <Answer title={`A ${result.operation === 'add' ? '+' : 'x'} B`} result={result.result} answer={result.answer} />
        </main>
    );
}
