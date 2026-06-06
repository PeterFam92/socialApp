export declare const generateHash: (plaintext: string, rounds?: number) => Promise<string>;
export declare const compareHash: (plaintext: string, hashed: string) => Promise<boolean>;
