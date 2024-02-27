export interface InputData {
    a: number[]; // [1,2,3]
    b: number[]; // [2,4,6]
    operation: string; // add, mul
    scheme: string; // bfv, bgv, ckks, tfhe
}

export interface ResultData {
    sk: string; // Secret Key
    pk: string; // Public Key
    encA: string; // Enc(B)
    encB: string; // Enc(B)
    evalResult: string; // Enc(A) ♢ Enc(B)
    dec: string; // Dec result
    operation: string; // add or mul
    resultArray: number[]; // Dec result array
    answerArray: number[]; // Answer array
}

export class ResultDataConstructor implements ResultData {
    sk: string;
    pk: string;
    encA: string;
    encB: string;
    evalResult: string;
    dec: string;
    operation: string;
    resultArray: number[];
    answerArray: number[];

    constructor(
        sk: string,
        pk: string,
        encA: string,
        encB: string,
        evalResult: string,
        dec: string,
        operation: string,
        resultArray: number[],
        answerArray: number[],
    ) {
        this.sk = sk;
        this.pk = pk;
        this.encA = encA;
        this.encB = encB;
        this.evalResult = evalResult;
        this.dec = dec;
        this.operation = operation;
        this.resultArray = resultArray;
        this.answerArray = answerArray;
    }

    static default(): ResultData {
        return new ResultDataConstructor('', '', '', '', '', '', '', [], []);
    }
}