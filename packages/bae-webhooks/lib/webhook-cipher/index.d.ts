export declare class WebookCipher {
    private alg;
    private iv;
    private secretKey;
    constructor(secretKey: string);
    encrypt(message: string): string;
    decrypt(hash: string): string;
}
