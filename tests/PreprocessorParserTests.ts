import { PreprocessorParser } from '../src/PreprocessorParser';
import { Token } from '../src/Token';
import { Tokenizer } from '../src/Tokenizer';
import { TokenKind } from "../src/TokenKind";
import { executeTestCases } from './shared';

executeTestCases('PreprocessorParser', 'tokens', (contents) => {
    const tokenizer = new Tokenizer(contents);
    const tokens: Token[] = [];
    let t: Token;
    do {
        t = tokenizer.next();
        tokens.push(t);
    } while (t.kind !== TokenKind.EOF);

    return tokens;
});

executeTestCases('PreprocessorParser', 'tree', (contents) => {
    const parser = new PreprocessorParser();

    return parser.parse(contents);
});
