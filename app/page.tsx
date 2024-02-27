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
    sk: string; // Secret Key
    pk: string; // Public Key
    encA: string; // Enc(B)
    encB: string; // Enc(B)
    evalResult: string; // Enc(A) + Enc(B)
    dec: string; // Dec result
    operation: string; // add or mul
    resultArray: number[]; // Dec result array
    answerArray: number[]; // Answer array
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
        resultArray: [],
        answerArray: [],
    });

    const handleFormSubmit = async (data: InputData) => {
        const seal = await SEAL();
        const schemeType = data.scheme === 'bfv' ? seal.SchemeType.bfv : seal.SchemeType.bgv;
        const securityLevel = seal.SecurityLevel.tc128;
        const polyModulusDegree = 4096;
        const bitSizes = [36, 36, 37];
        const bitSize = 20;
        try {
            if (data.a.length !== data.b.length) throw Error(`A size ${data.a.length} must be same as B size ${data.b.length}`);
            // params
            const encParams = seal.EncryptionParameters(schemeType);
            encParams.setPolyModulusDegree(polyModulusDegree);
            encParams.setCoeffModulus(
                seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
            );
            encParams.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize));
            // context
            const context = seal.Context(encParams, true, securityLevel);
            const keyGenerator = seal.KeyGenerator(context);
            // keys
            const secretKey = keyGenerator.secretKey();
            const publicKey = keyGenerator.createPublicKey();
            const relinKey = keyGenerator.createRelinKeys();
            // instances
            const encoder = seal.BatchEncoder(context);
            const encrypter = seal.Encryptor(context, publicKey);
            const evaluator = seal.Evaluator(context);
            const decrypter = seal.Decryptor(context, secretKey);
            // plaintext
            const plainTextA = encoder.encode(Int32Array.from(data.a));
            const plainTextB = encoder.encode(Int32Array.from(data.b));
            // encrypt
            const cipherTextA = encrypter.encrypt(plainTextA!);
            const cipherTextB = encrypter.encrypt(plainTextB!);
            // evaluate
            const evalResult = data.operation === 'add' ? evaluator.add(cipherTextA!, cipherTextB!) : evaluator.multiply(cipherTextA!, cipherTextB!);
            // relinearize
            const relinResult = evaluator.relinearize(evalResult!, relinKey);
            // decrypt
            const dec = encoder
                .decode(
                    decrypter.decrypt(relinResult!)!
                )
                .slice(0, data.a.length);
            // answer
            const answer = data.a
                .map((val, i) =>
                    data.operation === 'add' ? val + data.b[i]
                        : val * data.b[i]
                );

            setResult({
                sk: secretKey.save(),
                pk: publicKey.save(),
                encA: cipherTextA!.save(),
                encB: cipherTextB!.save(),
                evalResult: relinResult!.save(),
                dec: dec.toString(),
                operation: data.operation,
                resultArray: Array.from(dec),
                answerArray: answer,
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
            <Answer title={`A ${result.operation === 'add' ? '+' : 'x'} B`} result={result.resultArray} answer={result.answerArray} />
        </main>
    );
}
