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

export const generateRandomVector = (length: number = 4096): { a: number[], b: number[] } => {
    const vectorLength = Math.floor(Math.random() * length);
    const a = [];
    const b = [];
    for (let i = 0; i < vectorLength; i++) {
        a.push(Math.floor(Math.random() * 500) + 1);
        b.push(Math.floor(Math.random() * 500) + 1);
    }
    return { a, b };
}