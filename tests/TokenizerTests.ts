import glob = require('glob');
import fs = require('fs');
import path = require('path');
import { orderBy } from 'natural-orderby';

import { Token, TokenKind } from '../src/Token';
import { Tokenizer } from '../src/Tokenizer';

const skippedLexicalCases: string[] = require('./skippedLexical.json');

describe('Tokenizer', function () {
    let sourcePaths: string[] = [];
    const lexicalCasesPath = path.join(__dirname, 'cases', 'lexical');
    const lexicalCasesGlobPath = path.join(lexicalCasesPath, '**', '*.monkey');
    sourcePaths.push(...glob.sync(lexicalCasesGlobPath));
    sourcePaths = orderBy(sourcePaths);

    for (const sourcePath of sourcePaths) {
        const sourceBasename = path.basename(sourcePath);
        
        let _it: Mocha.PendingTestFunction = it;
        if (skippedLexicalCases.includes(sourceBasename)) {
            _it = xit;
        }

        // TODO: Should this fail/warn if baselines have changed?
        _it(sourceBasename, function () {
            const contents = fs.readFileSync(sourcePath, 'utf-8');
            const tokenizer = new Tokenizer(contents);
            const tokens: Token[] = [];
            let t: Token;
            do {
                t = tokenizer.next();
                tokens.push(t);
            } while (t.kind !== TokenKind.EOF);

            const tokensPath = sourcePath + '.tokens.json';
            const tokensJSON = JSON.stringify(tokens, null, 2);
            fs.writeFileSync(tokensPath, tokensJSON);
        });
    }
});