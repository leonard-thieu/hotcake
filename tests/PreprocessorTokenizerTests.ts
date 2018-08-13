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

        it(`should return an Unknown token when reading '"' that is never terminated by another '"'`, function() {
            const input = '"My unterminated string literal.';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.Unknown);
            assert.equal(token.length, 1);
        });

        it(`should return an IntegerLiteral token when reading '%' followed by any binary character`, function() {
            const input = '%0101001';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.IntegerLiteral);
            assert.equal(token.length, 8);
        });

        it(`should return an IntegerLiteral token when reading '$' followed by any hexadecimal character`, function() {
            const input = '$1D39';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.IntegerLiteral);
            assert.equal(token.length, 5);
        });

        it(`should return an IntegerLiteral token when reading decimal characters`, function() {
            const input = '1234';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.IntegerLiteral);
            assert.equal(token.length, 4);
        });

        it(`should return a FloatLiteral token when reading a floating point number`, function() {
            const input = '1.234';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.FloatLiteral);
            assert.equal(token.length, 5);
        });

        const symbols = [
            { kind: PreprocessorTokenKind.NumberSign, input: '#' },
            { kind: PreprocessorTokenKind.Ampersand, input: '&' },
            { kind: PreprocessorTokenKind.OpeningParenthesis, input: '(' },
            { kind: PreprocessorTokenKind.ClosingParenthesis, input: ')' },
            { kind: PreprocessorTokenKind.Asterisk, input: '*' },
            { kind: PreprocessorTokenKind.PlusSign, input: '+' },
            { kind: PreprocessorTokenKind.Comma, input: ',' },
            { kind: PreprocessorTokenKind.HyphenMinus, input: '-' },
            { kind: PreprocessorTokenKind.Period, input: '.' },
            { kind: PreprocessorTokenKind.Slash, input: '/' },
            { kind: PreprocessorTokenKind.Colon, input: ':' },
            { kind: PreprocessorTokenKind.Semicolon, input: ';' },
            { kind: PreprocessorTokenKind.LessThanSign, input: '<' },
            { kind: PreprocessorTokenKind.EqualsSign, input: '=' },
            { kind: PreprocessorTokenKind.GreaterThanSign, input: '>' },
            { kind: PreprocessorTokenKind.QuestionMark, input: '?' },
            { kind: PreprocessorTokenKind.CommercialAt, input: '@' },
            { kind: PreprocessorTokenKind.OpeningSquareBracket, input: '[' },
            { kind: PreprocessorTokenKind.ClosingSquareBracket, input: ']' },
            { kind: PreprocessorTokenKind.VerticalBar, input: '|' },
            { kind: PreprocessorTokenKind.Tilde, input: '~' },
        ];

        for (let { kind, input } of symbols) {
            const k = PreprocessorTokenKind[kind];

            it(`should return a ${k} token when reading '${input}'`, function() {
                const tokenizer = new PreprocessorTokenizer(input);
    
                const token = tokenizer.next();
    
                assert.equal(token.kind, kind);
            });
        }
    });
});