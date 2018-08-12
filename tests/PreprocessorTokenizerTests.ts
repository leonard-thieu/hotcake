import assert = require('assert');

import { PreprocessorTokenizer } from "../PreprocessorTokenizer";
import { PreprocessorTokenKind } from '../PreprocessorToken';

describe('PreprocessorTokenizer', function() {
    describe('#next()', function() {
        it(`should return an EOF token when reading the end of the input`, function() {
            const input = '';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.EOF);
        });

        it(`should return an Unknown token when reading a character that is unknown`, function() {
            const input = '!';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.Unknown);
        });

        it(`should return a Newline token when reading a line feed character`, function() {
            const input = '\n';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.Newline);
        });

        it(`should return a Whitespace token when reading a run of whitespace characters`, function() {
            const input = '\t ';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.Whitespace);
            assert.equal(token.length, 2);
        });

        it(`should return a Comment token when reading "'" followed by the rest of the characters on the line`, function() {
            const input = "' This is my comment.";
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.Comment);
            assert.equal(token.length, 21);
        });

        it(`should return a StringLiteral token when reading '"' followed by any characters and terminated by '"'`, function() {
            const input = '"My string literal."';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.StringLiteral);
            assert.equal(token.length, 20);
        });
    });
});