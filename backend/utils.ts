// "hello" -> xx Bytes
export const getBytes = (str: string): number => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(str);
    return encoded.length;
}

// `add` -> `+`
// `mul` -> `x`
export const op2symbol = (op: string): string => op === 'add' ? "+" : "x";