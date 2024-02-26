"use client";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Output from "@/components/Output";
import { useState } from "react";
import SEAL from "node-seal";

export interface InputData {
    a: number[];
    b: number[];
}

export interface ResultData {
    encA: string;
    encB: string;
    encAdd: string;
    encMul: string;
    add: Int32Array | Uint32Array;
    mul: Int32Array | Uint32Array;
}

export default function Home() {
    const [result, setResult] = useState<ResultData>({
        encA: '',
        encB: '',
        encAdd: '',
        encMul: '',
        add: Int32Array.from([0, 0, 0, 0]),
        mul: Int32Array.from([0, 0, 0, 0]),
    });

    const handleFormSubmit = async (data: InputData) => {
        const seal = await SEAL();

        const schemeType = seal.SchemeType.bfv;
        const securityLevel = seal.SecurityLevel.tc128;
        const polyModulusDegree = 4096;
        const bitSizes = [36, 36, 37];
        const bitSize = 20;
        try {
            const encParams = seal.EncryptionParameters(schemeType);
            encParams.setPolyModulusDegree(polyModulusDegree);
            encParams.setCoeffModulus(
                seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
            );
            encParams.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize));
            const context = seal.Context(encParams, true, securityLevel);
            const keyGenerator = seal.KeyGenerator(context);
            console.log('setup completed');

            const secretKey = keyGenerator.secretKey();
            const publicKey = keyGenerator.createPublicKey();
            const evalKey = keyGenerator.createRelinKeys();
            const galoisKey = keyGenerator.createGaloisKeys();

            console.log('public key', publicKey);

            const encoder = seal.BatchEncoder(context);
            const encrypter = seal.Encryptor(context, publicKey);
            const evaluator = seal.Evaluator(context);
            const decrypter = seal.Decryptor(context, secretKey);

            console.log('encrypter', encrypter);

            const plainTextA = encoder.encode(Int32Array.from(data.a));
            const plainTextB = encoder.encode(Int32Array.from(data.b));

            const cipherTextA = encrypter.encrypt(plainTextA!);
            const cipherTextB = encrypter.encrypt(plainTextB!);

            console.log('cipher text of A', cipherTextA);
            console.log('cipher text of B', cipherTextB);

            const addResult = evaluator.add(cipherTextA!, cipherTextB!);
            const mulResult = evaluator.multiply(cipherTextA!, cipherTextB!);

            const decAdd = decrypter.decrypt(addResult!);
            const decMul = decrypter.decrypt(mulResult!);

            setResult({
                encA: cipherTextA!.save(),
                encB: cipherTextB!.save(),
                encAdd: addResult!.save(),
                encMul: mulResult!.save(),
                add: encoder.decode(decAdd!),
                mul: encoder.decode(decMul!),
            });
        } catch (e) {
            alert(`error ${e}`);
        }

    }

    return (
        <main className="container mx-auto bg-white">
            <Header />
            <Input onSubmit={handleFormSubmit} />
            <Output title="Enc(A)" result={result.encA} />
            <Output title="Enc(B)" result={result.encB} />
            <Output title="Enc(A + B)" result={result.encAdd} />
            <Output title="Enc(A x B)" result={result.encMul} />
            <Output title="Dec(Enc(A + B)) = A + B" result={result.add.join(", ")} />
            <Output title="Dec(Enc(A x B)) = A x B" result={result.mul.join(", ")} />
        </main>
    );
}
