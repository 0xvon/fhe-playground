// "hello" -> xx Bytes
export const getBytes = (str: string): number => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(str);
    return encoded.length;
}

// A ♢ B
export const calcAnswer = (
    a: number[], b: number[], operation: string
): number[] => {
    return a.map((val, i) =>
        operation === '+' ? val + b[i]
            : val * b[i]
    );
}