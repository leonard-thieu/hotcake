import assert = require('assert');
import glob = require('glob');
import fs = require('fs');

import { Tokenizer } from "../Tokenizer";
import { Token, TokenKind } from '../Token';

describe('Tokenizer', function () {
    describe('#next()', function () {
        it(`should return an EOF token when reading the end of the input`, function () {
            const input = '';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.EOF);
        });

        it(`should return an Unknown token when reading a character that is unknown`, function () {
            const input = '!';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.Unknown);
        });

        it(`should return a Newline token when reading a line feed character`, function () {
            const input = '\n';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.Newline);
        });

        it(`should return a Whitespace token when reading a run of whitespace characters`, function () {
            const input = '\t ';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.Whitespace);
            assert.equal(token.length, 2);
        });

        it(`should return a Comment token when reading "'" followed by the rest of the characters on the line`, function () {
            const input = "' This is my comment.";
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.Comment);
            assert.equal(token.length, 21);
        });

        it(`should return a StringLiteral token when reading '"' followed by any characters and terminated by '"'`, function () {
            const input = '"My string literal."';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.StringLiteral);
            assert.equal(token.length, 20);
        });

        it(`should return an Unknown token when reading '"' that is never terminated by another '"'`, function () {
            const input = '"My unterminated string literal.';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.Unknown);
            assert.equal(token.length, 1);
        });

        it(`should return an IntegerLiteral token when reading '%' followed by any binary character`, function () {
            const input = '%0101001';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.IntegerLiteral);
            assert.equal(token.length, 8);
        });

        it(`should return an IntegerLiteral token when reading '$' followed by any hexadecimal character`, function () {
            const input = '$1D39';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.IntegerLiteral);
            assert.equal(token.length, 5);
        });

        it(`should return an IntegerLiteral token when reading decimal characters`, function () {
            const input = '1234';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.IntegerLiteral);
            assert.equal(token.length, 4);
        });

        it(`should return a FloatLiteral token when reading a floating point number`, function () {
            const input = '1.234';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, TokenKind.FloatLiteral);
            assert.equal(token.length, 5);
        });

        it(`should return an Identifier token when reading an alphabetic character followed by any '_' or alphanumeric characters`, function () {
            const input = 'a23_4b';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(TokenKind[token.kind], TokenKind[TokenKind.Identifier]);
            assert.equal(token.length, 6);
        });

        it(`should return an Identifier token when reading '_' followed by any '_' or alphanumeric characters`, function () {
            const input = '_a23_4b';
            const tokenizer = new Tokenizer(input);

            const token = tokenizer.next();

            assert.equal(TokenKind[token.kind], TokenKind[TokenKind.Identifier]);
            assert.equal(token.length, 7);
        });

        interface TestKindsTestData {
            kind: TokenKind;
            input: string;
        }

        function testKinds(data: TestKindsTestData[]): void {
            for (const { kind, input } of data) {
                const k = TokenKind[kind];

                it(`should return a ${k} token when reading '${input}'`, function () {
                    const tokenizer = new Tokenizer(input);

                    const token = tokenizer.next();

                    assert.equal(TokenKind[token.kind], TokenKind[kind]);
                });
            }
        }

        describe('directives', function () {
            const directives = [
                { kind: TokenKind.IfDirectiveKeyword, input: '#If' },
                { kind: TokenKind.ElseIfDirectiveKeyword, input: '#ElseIf' },
                { kind: TokenKind.ElseDirectiveKeyword, input: '#Else' },
                { kind: TokenKind.EndDirectiveKeyword, input: '#EndIf' },
                { kind: TokenKind.EndDirectiveKeyword, input: '#End' },
                { kind: TokenKind.RemDirectiveKeyword, input: '#Rem' },
                { kind: TokenKind.PrintDirectiveKeyword, input: '#Print' },
                { kind: TokenKind.ErrorDirectiveKeyword, input: '#Error' },
            ];

            testKinds(directives);
        });

        describe('symbols', function () {
            const symbols = [
                { kind: TokenKind.Ampersand, input: '&' },
                { kind: TokenKind.OpeningParenthesis, input: '(' },
                { kind: TokenKind.ClosingParenthesis, input: ')' },
                { kind: TokenKind.Asterisk, input: '*' },
                { kind: TokenKind.PlusSign, input: '+' },
                { kind: TokenKind.Comma, input: ',' },
                { kind: TokenKind.HyphenMinus, input: '-' },
                { kind: TokenKind.Period, input: '.' },
                { kind: TokenKind.Slash, input: '/' },
                { kind: TokenKind.Colon, input: ':' },
                { kind: TokenKind.Semicolon, input: ';' },
                { kind: TokenKind.LessThanSign, input: '<' },
                { kind: TokenKind.EqualsSign, input: '=' },
                { kind: TokenKind.GreaterThanSign, input: '>' },
                { kind: TokenKind.QuestionMark, input: '?' },
                { kind: TokenKind.CommercialAt, input: '@' },
                { kind: TokenKind.OpeningSquareBracket, input: '[' },
                { kind: TokenKind.ClosingSquareBracket, input: ']' },
                { kind: TokenKind.VerticalBar, input: '|' },
                { kind: TokenKind.Tilde, input: '~' },
            ];

            testKinds(symbols);
        });

        describe('keywords', function () {
            const keywords = [
                { kind: TokenKind.VoidKeyword, input: 'Void' },
                { kind: TokenKind.StrictKeyword, input: 'Strict' },
                { kind: TokenKind.PublicKeyword, input: 'Public' },
                { kind: TokenKind.PrivateKeyword, input: 'Private' },
                { kind: TokenKind.ProtectedKeyword, input: 'Protected' },
                { kind: TokenKind.FriendKeyword, input: 'Friend' },
                { kind: TokenKind.PropertyKeyword, input: 'Property' },
                { kind: TokenKind.BoolKeyword, input: 'Bool' },
                { kind: TokenKind.IntKeyword, input: 'Int' },
                { kind: TokenKind.FloatKeyword, input: 'Float' },
                { kind: TokenKind.StringKeyword, input: 'String' },
                { kind: TokenKind.ArrayKeyword, input: 'Array' },
                { kind: TokenKind.ObjectKeyword, input: 'Object' },
                { kind: TokenKind.ModKeyword, input: 'Mod' },
                { kind: TokenKind.ContinueKeyword, input: 'Continue' },
                { kind: TokenKind.ExitKeyword, input: 'Exit' },
                { kind: TokenKind.IncludeKeyword, input: 'Include' },
                { kind: TokenKind.ImportKeyword, input: 'Import' },
                { kind: TokenKind.ModuleKeyword, input: 'Module' },
                { kind: TokenKind.ExternKeyword, input: 'Extern' },
                { kind: TokenKind.NewKeyword, input: 'New' },
                { kind: TokenKind.SelfKeyword, input: 'Self' },
                { kind: TokenKind.SuperKeyword, input: 'Super' },
                { kind: TokenKind.EachInKeyword, input: 'EachIn' },
                { kind: TokenKind.TrueKeyword, input: 'True' },
                { kind: TokenKind.FalseKeyword, input: 'False' },
                { kind: TokenKind.NullKeyword, input: 'Null' },
                { kind: TokenKind.NotKeyword, input: 'Not' },
                { kind: TokenKind.ExtendsKeyword, input: 'Extends' },
                { kind: TokenKind.AbstractKeyword, input: 'Abstract' },
                { kind: TokenKind.FinalKeyword, input: 'Final' },
                { kind: TokenKind.SelectKeyword, input: 'Select' },
                { kind: TokenKind.CaseKeyword, input: 'Case' },
                { kind: TokenKind.DefaultKeyword, input: 'Default' },
                { kind: TokenKind.ConstKeyword, input: 'Const' },
                { kind: TokenKind.LocalKeyword, input: 'Local' },
                { kind: TokenKind.GlobalKeyword, input: 'Global' },
                { kind: TokenKind.FieldKeyword, input: 'Field' },
                { kind: TokenKind.MethodKeyword, input: 'Method' },
                { kind: TokenKind.FunctionKeyword, input: 'Function' },
                { kind: TokenKind.ClassKeyword, input: 'Class' },
                { kind: TokenKind.AndKeyword, input: 'And' },
                { kind: TokenKind.OrKeyword, input: 'Or' },
                { kind: TokenKind.ShlKeyword, input: 'Shl' },
                { kind: TokenKind.ShrKeyword, input: 'Shr' },
                { kind: TokenKind.EndKeyword, input: 'End' },
                { kind: TokenKind.IfKeyword, input: 'If' },
                { kind: TokenKind.ThenKeyword, input: 'Then' },
                { kind: TokenKind.ElseKeyword, input: 'Else' },
                { kind: TokenKind.ElseIfKeyword, input: 'ElseIf' },
                { kind: TokenKind.EndIfKeyword, input: 'EndIf' },
                { kind: TokenKind.WhileKeyword, input: 'While' },
                { kind: TokenKind.WendKeyword, input: 'Wend' },
                { kind: TokenKind.RepeatKeyword, input: 'Repeat' },
                { kind: TokenKind.UntilKeyword, input: 'Until' },
                { kind: TokenKind.ForeverKeyword, input: 'Forever' },
                { kind: TokenKind.ForKeyword, input: 'For' },
                { kind: TokenKind.ToKeyword, input: 'To' },
                { kind: TokenKind.StepKeyword, input: 'Step' },
                { kind: TokenKind.NextKeyword, input: 'Next' },
                { kind: TokenKind.ReturnKeyword, input: 'Return' },
                { kind: TokenKind.InterfaceKeyword, input: 'Interface' },
                { kind: TokenKind.ImplementsKeyword, input: 'Implements' },
                { kind: TokenKind.InlineKeyword, input: 'Inline' },
                { kind: TokenKind.AliasKeyword, input: 'Alias' },
                { kind: TokenKind.TryKeyword, input: 'Try' },
                { kind: TokenKind.CatchKeyword, input: 'Catch' },
                { kind: TokenKind.ThrowKeyword, input: 'Throw' },
                { kind: TokenKind.ThrowableKeyword, input: 'Throwable' },
            ];

            testKinds(keywords);
        });

        describe('lexical cases', function() {
            const sourcePaths: string[] = [];
            sourcePaths.push(...glob.sync('S:\\Projects\\_GitHub\\leonard-thieu\\ndref\\src\\**\\*.monkey'));
            sourcePaths.push(...glob.sync('S:\\Projects\\_GitHub\\blitz-research\\monkey\\**\\*.monkey'));
    
            for (const sourcePath of sourcePaths) {
                it(sourcePath, function () {
                    const contents = fs.readFileSync(sourcePath, 'utf-8');
                    const tokenizer = new Tokenizer(contents);
                    const tokens: Token[] = [];
                    let t: Token;
                    do {
                        t = tokenizer.next();
                        tokens.push(t);
                    } while (t.kind !== TokenKind.EOF);
    
                    // const tokensPath = sourcePath + '.tokens.json';
                    // const tokensJSON = JSON.stringify(tokens, null, 2);
                    // fs.writeFileSync(tokensPath, tokensJSON);
                });
            }
        });
    });
});