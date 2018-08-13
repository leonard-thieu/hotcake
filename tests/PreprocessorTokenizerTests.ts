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

        it(`should return an Identifier token when reading an alphabetic character followed by any '_' or alphanumeric characters`, function() {
            const input = 'a23_4b';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.Identifier);
            assert.equal(token.length, 6);
        });

        it(`should return an Identifier token when reading '_' followed by any '_' or alphanumeric characters`, function() {
            const input = '_a23_4b';
            const tokenizer = new PreprocessorTokenizer(input);

            const token = tokenizer.next();

            assert.equal(token.kind, PreprocessorTokenKind.Identifier);
            assert.equal(token.length, 7);
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

        const keywords = [
            { kind: PreprocessorTokenKind.VoidKeyword, input: 'Void' },
            { kind: PreprocessorTokenKind.StrictKeyword, input: 'Strict' },
            { kind: PreprocessorTokenKind.PublicKeyword, input: 'Public' },
            { kind: PreprocessorTokenKind.PrivateKeyword, input: 'Private' },
            { kind: PreprocessorTokenKind.ProtectedKeyword, input: 'Protected' },
            { kind: PreprocessorTokenKind.FriendKeyword, input: 'Friend' },
            { kind: PreprocessorTokenKind.PropertyKeyword, input: 'Property' },
            { kind: PreprocessorTokenKind.BoolKeyword, input: 'Bool' },
            { kind: PreprocessorTokenKind.IntKeyword, input: 'Int' },
            { kind: PreprocessorTokenKind.FloatKeyword, input: 'Float' },
            { kind: PreprocessorTokenKind.StringKeyword, input: 'String' },
            { kind: PreprocessorTokenKind.ArrayKeyword, input: 'Array' },
            { kind: PreprocessorTokenKind.ObjectKeyword, input: 'Object' },
            { kind: PreprocessorTokenKind.ModKeyword, input: 'Mod' },
            { kind: PreprocessorTokenKind.ContinueKeyword, input: 'Continue' },
            { kind: PreprocessorTokenKind.ExitKeyword, input: 'Exit' },
            { kind: PreprocessorTokenKind.IncludeKeyword, input: 'Include' },
            { kind: PreprocessorTokenKind.ImportKeyword, input: 'Import' },
            { kind: PreprocessorTokenKind.ModuleKeyword, input: 'Module' },
            { kind: PreprocessorTokenKind.ExternKeyword, input: 'Extern' },
            { kind: PreprocessorTokenKind.NewKeyword, input: 'New' },
            { kind: PreprocessorTokenKind.SelfKeyword, input: 'Self' },
            { kind: PreprocessorTokenKind.SuperKeyword, input: 'Super' },
            { kind: PreprocessorTokenKind.EachInKeyword, input: 'EachIn' },
            { kind: PreprocessorTokenKind.TrueKeyword, input: 'True' },
            { kind: PreprocessorTokenKind.FalseKeyword, input: 'False' },
            { kind: PreprocessorTokenKind.NullKeyword, input: 'Null' },
            { kind: PreprocessorTokenKind.NotKeyword, input: 'Not' },
            { kind: PreprocessorTokenKind.ExtendsKeyword, input: 'Extends' },
            { kind: PreprocessorTokenKind.AbstractKeyword, input: 'Abstract' },
            { kind: PreprocessorTokenKind.FinalKeyword, input: 'Final' },
            { kind: PreprocessorTokenKind.SelectKeyword, input: 'Select' },
            { kind: PreprocessorTokenKind.CaseKeyword, input: 'Case' },
            { kind: PreprocessorTokenKind.DefaultKeyword, input: 'Default' },
            { kind: PreprocessorTokenKind.ConstKeyword, input: 'Const' },
            { kind: PreprocessorTokenKind.LocalKeyword, input: 'Local' },
            { kind: PreprocessorTokenKind.GlobalKeyword, input: 'Global' },
            { kind: PreprocessorTokenKind.FieldKeyword, input: 'Field' },
            { kind: PreprocessorTokenKind.MethodKeyword, input: 'Method' },
            { kind: PreprocessorTokenKind.FunctionKeyword, input: 'Function' },
            { kind: PreprocessorTokenKind.ClassKeyword, input: 'Class' },
            { kind: PreprocessorTokenKind.AndKeyword, input: 'And' },
            { kind: PreprocessorTokenKind.OrKeyword, input: 'Or' },
            { kind: PreprocessorTokenKind.ShlKeyword, input: 'Shl' },
            { kind: PreprocessorTokenKind.ShrKeyword, input: 'Shr' },
            { kind: PreprocessorTokenKind.EndKeyword, input: 'End' },
            { kind: PreprocessorTokenKind.IfKeyword, input: 'If' },
            { kind: PreprocessorTokenKind.ThenKeyword, input: 'Then' },
            { kind: PreprocessorTokenKind.ElseKeyword, input: 'Else' },
            { kind: PreprocessorTokenKind.ElseIfKeyword, input: 'ElseIf' },
            { kind: PreprocessorTokenKind.EndIfKeyword, input: 'EndIf' },
            { kind: PreprocessorTokenKind.WhileKeyword, input: 'While' },
            { kind: PreprocessorTokenKind.WendKeyword, input: 'Wend' },
            { kind: PreprocessorTokenKind.RepeatKeyword, input: 'Repeat' },
            { kind: PreprocessorTokenKind.UntilKeyword, input: 'Until' },
            { kind: PreprocessorTokenKind.ForeverKeyword, input: 'Forever' },
            { kind: PreprocessorTokenKind.ForKeyword, input: 'For' },
            { kind: PreprocessorTokenKind.ToKeyword, input: 'To' },
            { kind: PreprocessorTokenKind.StepKeyword, input: 'Step' },
            { kind: PreprocessorTokenKind.NextKeyword, input: 'Next' },
            { kind: PreprocessorTokenKind.ReturnKeyword, input: 'Return' },
            { kind: PreprocessorTokenKind.InterfaceKeyword, input: 'Interface' },
            { kind: PreprocessorTokenKind.ImplementsKeyword, input: 'Implements' },
            { kind: PreprocessorTokenKind.InlineKeyword, input: 'Inline' },
            { kind: PreprocessorTokenKind.AliasKeyword, input: 'Alias' },
            { kind: PreprocessorTokenKind.TryKeyword, input: 'Try' },
            { kind: PreprocessorTokenKind.CatchKeyword, input: 'Catch' },
            { kind: PreprocessorTokenKind.ThrowKeyword, input: 'Throw' },
            { kind: PreprocessorTokenKind.ThrowableKeyword, input: 'Throwable' },
        ];

        for (let { kind, input } of keywords) {
            const k = PreprocessorTokenKind[kind];

            it(`should return a ${k} token when reading '${input}'`, function() {
                const tokenizer = new PreprocessorTokenizer(input);
    
                const token = tokenizer.next();
    
                assert.equal(token.kind, kind);
            });
        }
    });
});