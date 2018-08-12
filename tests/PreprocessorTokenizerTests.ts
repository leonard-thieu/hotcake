import assert = require('assert');

import { PreprocessorTokenizer } from "../PreprocessorTokenizer";
import { PreprocessorTokenKind } from '../PreprocessorToken';

describe('PreprocessorTokenizer', function() {
    describe('#next()', function() {
        it(`should return an Unknown token when reading a token that is unknown`, function() {
            const input = '!';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.Unknown);
        });

        it(`should return an EOF token when reading the end of the input`, function() {
            const input = '';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.EOF);
        });
    });
});