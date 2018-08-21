import { Token, TokenKind } from '../src/Token';
import { Tokenizer } from '../src/Tokenizer';
import { executeTestCases } from './shared';

executeTestCases('Tokenizer', 'tokens', (contents) => {
    const tokenizer = new Tokenizer(contents);
    const tokens: Token[] = [];
    let t: Token;
    do {
        t = tokenizer.next();
        tokens.push(t);
    } while (t.kind !== TokenKind.EOF);

    return tokens;
});
