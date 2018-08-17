import { PreprocessorToken } from "./PreprocessorToken";

export class SkippedToken extends PreprocessorToken {
    constructor(token: PreprocessorToken) {
        super(token.kind, token.start, token.length);
    }
}