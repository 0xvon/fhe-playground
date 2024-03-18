import { calcAnswer } from "./utils";
import { DICTIONARY, InputData, PerformanceTime, ResultData } from "./entity";
import SEAL from "node-seal";
import { SEALLibrary } from "node-seal/implementation/seal";
import { KeyGenerator } from "node-seal/implementation/key-generator";
import { SchemeType } from "node-seal/implementation/scheme-type";
import { EncryptionParameters } from "node-seal/implementation/encryption-parameters";
import { BatchEncoder } from "node-seal/implementation/batch-encoder";
import { Decryptor } from "node-seal/implementation/decryptor";
import { CipherText } from "node-seal/implementation/cipher-text";
import { Evaluator } from "node-seal/implementation/evaluator";

export const enc_eval_relin_dec = async (data: InputData): Promise<{ resultData: ResultData, performanceTime: PerformanceTime }> => {
    const seal = await SEAL();
    const schemeType = encScheme(data.scheme, seal);
    const securityLevel = seal.SecurityLevel.tc128;
    const polyModulusDegree = 4096; // t: polynomial modulus
    const bitSizes = [36, 36, 37]; // bit-length of the primes , at most 60 bits
    const bitSize = 26; // bit-length of the primes to be generated

    // check if a.length === b.length
    if (data.a.length !== data.b.length) throw Error(`A size ${data.a.length} must be same as B size ${data.b.length}`);
    // params
    const encParams = generateParams(schemeType, polyModulusDegree, bitSizes, bitSize, seal);
    // context
    const context = seal.Context(encParams, true, securityLevel);
    const startTime = performance.now(); // measuring time from now
    const keyGenerator = seal.KeyGenerator(context);
    // keys
    const { secretKey, publicKey, relinKey } = generateKeys(keyGenerator);
    const genkeyTime = performance.now(); // measuring genkey time
    // instances
    const encoder = seal.BatchEncoder(context);
    const encrypter = seal.Encryptor(context, publicKey);
    const evaluator = seal.Evaluator(context);
    const decrypter = seal.Decryptor(context, secretKey);
    // plaintext
    const plainTextA = encoder.encode(Int32Array.from(data.a))!;
    const plainTextB = encoder.encode(Int32Array.from(data.b))!;
    // encrypt
    const startTime2 = performance.now(); // measuring time from now
    const cipherTextA = encrypter.encrypt(plainTextA)!;
    const encATime = performance.now(); // measuring encA time
    const cipherTextB = encrypter.encrypt(plainTextB)!;
    const encBTime = performance.now();
    // evaluate
    const evalResult = evaluate(evaluator, cipherTextA, cipherTextB, data.operation);
    // relinearize
    const relinResult = evaluator.relinearize(evalResult, relinKey)!;
    const evalTime = performance.now();
    // decrypt
    const startTime3 = performance.now();
    const dec = decrypt(encoder, decrypter, relinResult, data.a.length);
    const decTime = performance.now();
    // answer
    const answer = calcAnswer(data.a, data.b, data.operation);

    const resultData: ResultData = {
        sk: secretKey.save(),
        pk: publicKey.save(),
        encA: cipherTextA.save(),
        encB: cipherTextB.save(),
        evalResult: relinResult.save(),
        dec: dec.toString(),
        operation: data.operation,
        scheme: data.scheme,
        resultArray: dec,
        answerArray: answer,
    }
    const performanceTime: PerformanceTime = {
        genKeyTime: genkeyTime - startTime,
        encATime: encATime - startTime2,
        encBTime: encBTime - encATime,
        evalTime: evalTime - encBTime,
        decTime: decTime - startTime3,
    }

    return { resultData, performanceTime };
}

const encScheme = (scheme: string, seal: SEALLibrary): SchemeType => {
    switch (scheme) {
        case DICTIONARY.FHE_SCHEME.BFV: return seal.SchemeType.bfv;
        case DICTIONARY.FHE_SCHEME.BGV: return seal.SchemeType.bgv;
        case DICTIONARY.FHE_SCHEME.CKKS: return seal.SchemeType.ckks;
        default: throw Error("This scheme is not supported.");
    }
}

const generateParams = (
    schemeType: SchemeType,
    polyModulusDegree: number,
    bitSizes: number[],
    bitSize: number,
    seal: SEALLibrary,
): EncryptionParameters => {
    const encParams = seal.EncryptionParameters(schemeType);
    encParams.setPolyModulusDegree(polyModulusDegree);
    encParams.setCoeffModulus(
        seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
    );
    encParams.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize));
    return encParams;
}

// sk: secret key
// pk: public key
// rk: relinearization key
const generateKeys = (keyGenerator: KeyGenerator) => {
    const secretKey = keyGenerator.secretKey();
    const publicKey = keyGenerator.createPublicKey();
    const relinKey = keyGenerator.createRelinKeys();
    return { secretKey, publicKey, relinKey };
}

const evaluate = (
    evaluator: Evaluator,
    a: CipherText, b: CipherText,
    operation: string,
): CipherText => {
    return operation === '+'
        ? evaluator.add(a, b)!
        : evaluator.multiply(a, b)!;
}

const decrypt = (
    encoder: BatchEncoder, decrypter: Decryptor,
    cipherText: CipherText, length: number,
): number[] => {
    return Array.from(
        encoder
            .decode(decrypter.decrypt(cipherText)!)
            .slice(0, length)
    );
}
