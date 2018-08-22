import path = require('path');

import { PreprocessorParser } from '../src/PreprocessorParser';
import { Token, TokenKind } from '../src/Token';
import { Tokenizer } from '../src/Tokenizer';
import { executeTestCases } from "./shared";

executeTestCases({
    name: 'MonkeyX',
    casesPath: path.resolve('..', '..', 'blitz-research', 'monkey'),
    outputBasePath: path.join(__dirname, 'cases', 'MonkeyX'),
    ext: 'tokens',
    testCallback: (contents) => {
        const tokenizer = new Tokenizer(contents);
        const tokens: Token[] = [];
        let t: Token;
        do {
            t = tokenizer.next();
            tokens.push(t);
        } while (t.kind !== TokenKind.EOF);
    
        return tokens;
    },
});

executeTestCases({
    name: 'MonkeyX',
    casesPath: path.resolve('..', '..', 'blitz-research', 'monkey'),
    outputBasePath: path.join(__dirname, 'cases', 'MonkeyX'),
    ext: 'tree',
    testCallback: (contents) => {
        const parser = new PreprocessorParser();
        
        return parser.parse(contents);
    },
});
