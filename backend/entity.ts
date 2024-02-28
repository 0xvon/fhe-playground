export interface InputData {
    a: number[]; // [1,2,3]
    b: number[]; // [2,4,6]
    operation: string; // +, x
    scheme: string; // BFV, BGV, CKKS, TFHE
}

export interface ResultData {
    sk: string; // Secret Key
    pk: string; // Public Key
    encA: string; // Enc(B)
    encB: string; // Enc(B)
    evalResult: string; // Enc(A) ♢ Enc(B)
    dec: string; // Dec result
    operation: string; // + or x
    scheme: string;
    resultArray: number[]; // Dec result array
    answerArray: number[]; // Answer array
}

export interface PerformanceTime {
    genKeyTime: number;
    encATime: number;
    encBTime: number;
    evalTime: number;
    decTime: number;
}

export class ResultDataConstructor implements ResultData {
    sk: string;
    pk: string;
    encA: string;
    encB: string;
    evalResult: string;
    dec: string;
    operation: string;
    scheme: string;
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
        scheme: string,
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
        this.scheme = scheme;
        this.resultArray = resultArray;
        this.answerArray = answerArray;
    }

    static default(): ResultData {
        return new ResultDataConstructor('x', 'x', 'x', 'x', 'x', '0', '+', 'BFV', [0], [0]);
    }
}

export class PerformanceTimeConstructor implements PerformanceTime {
    genKeyTime: number;
    encATime: number;
    encBTime: number;
    evalTime: number;
    decTime: number;

    constructor(
        genKeyTime: number,
        encATime: number,
        encBTime: number,
        evalTime: number,
        decTime: number,
    ) {
        this.genKeyTime = genKeyTime;
        this.encATime = encATime;
        this.encBTime = encBTime;
        this.evalTime = evalTime;
        this.decTime = decTime;
    }

    static default(): PerformanceTime {
        return new PerformanceTimeConstructor(0, 0, 0, 0, 0);
    }
}

export const DICTIONARY = {
    TITLE: "Dec(Enc(A) ♢ Enc(B)) = A ♢ B",
    WEBSITE_TITLE: "FHE Playground",
    WEBSITE_DESCRIPTION: "A simple interface for Fully Homomorphic Encryption",
    SK_TITLE: "SecretKey",
    PK_TITLE: "PublicKey",
    ENC_A_TITLE: "Enc(A, PK)",
    ENC_B_TITLE: "Enc(B, PK)",
    EVAL_ADD_TITLE: "Enc(A) + Enc(B)",
    EVAL_MUL_TITLE: "Enc(A) x Enc(B)",
    DEC_ADD_TITLE: "Dec(Enc(A) + Enc(B), SK)",
    DEC_MUL_TITLE: "Dec(Enc(A) x Enc(B), SK)",
    ANS_ADD_TITLE: "A + B",
    ANS_MUL_TITLE: "A x B",
    CALC_BUTTON_TITLE: "CALCULATE!",
    OP: {
        ADD: "+",
        MUL: "x",
    },
    FHE_SCHEME: {
        BFV: "BFV",
        BGV: "BGV",
        CKKS: "CKKS",
    }
}