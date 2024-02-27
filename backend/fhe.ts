import { InputData, ResultData } from "./entity";
import SEAL from "node-seal";

export const enc_eval_relin_dec = async (data: InputData): Promise<ResultData> => {
    const seal = await SEAL();
    const schemeType = data.scheme === 'bfv' ? seal.SchemeType.bfv : seal.SchemeType.bgv;
    const securityLevel = seal.SecurityLevel.tc128;
    const polyModulusDegree = 4096;
    const bitSizes = [36, 36, 37];
    const bitSize = 20;

    // check if a.length === b.length
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

    return {
        sk: secretKey.save(),
        pk: publicKey.save(),
        encA: cipherTextA!.save(),
        encB: cipherTextB!.save(),
        evalResult: relinResult!.save(),
        dec: dec.toString(),
        operation: data.operation,
        resultArray: Array.from(dec),
        answerArray: answer,
    }
}