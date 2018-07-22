// Type definitions for antlr 4.7
// Project: http://www.antlr.org/
// Definitions by: Leonard Thieu <https://github.com/leonard-thieu>

declare module 'antlr4' {
    interface Token {

    }

    interface TokenSource {

    }

    export class RuleContext {

    }

    export class Interval {

    }

    interface IntStream {
        readonly index: number;
        readonly size: number;

        consume(): void;

        getSourceName(): string;

        LA(i: number): number;

        mark(): number;

        release(marker: number): void;

        seek(index: number): void;
    }

    interface CharStream extends IntStream {
        getText(interval: Interval): string;
    }

    export class InputStream implements CharStream {
        constructor(data: string, decodeToUnicodeCodePoints?: boolean);

        readonly index: number;
        readonly size: number;

        consume(): void;

        getSourceName(): string;

        LA(i: number): number;

        mark(): number;

        release(marker: number): void;

        seek(index: number): void;

        getText(interval: Interval): string;

        reset(): void;
    }

    interface TokenStream extends IntStream {
        get(index: number): Token;

        getText(start: Token, stop: Token): string;

        getText(ctx: RuleContext): string;

        getText(interval: Interval): string;

        getText(): string;

        getTokenSource(): TokenSource;

        LT(k: number): Token;
    }

    export class BufferedTokenStream implements TokenStream {
        constructor(tokenSource: TokenSource);

        protected fetchedEOF: boolean;
        protected p: number;
        protected tokens: Token[];
        protected tokenSource: TokenSource;

        readonly index: number;
        readonly size: number;

        LA(i: number): number;

        LT(k: number): Token;

        consume(): void;

        get(index: number): Token;

        getSourceName(): string;

        getText(start: Token, stop: Token): string;
        getText(ctx: RuleContext): string;
        getText(interval: Interval): string;
        getText(): string;

        getTokenSource(): TokenSource;

        mark(): number;

        release(marker: number): void;

        seek(index: number): void;

        protected adjustSeekIndex(i: number): number;

        protected fetch(n: number): number;

        fill(): void;

        protected filterForChannel(left: number, right: number, channel: number): Token[] | null;

        get(start: number, stop: number): Token[];

        getHiddenTokensToLeft(tokenIndex: number, channel?: number): Token[];

        getHiddenTokensToRight(tokenIndex: number, channel?: number): Token[];

        getTokens(start: number, stop: number, types: number[]): Token[];
        getTokens(start: number, stop: number, ttype: number): Token[];
        getTokens(start: number, stop: number): Token[];
        getTokens(): Token[];

        protected lazyInit(): void;

        protected LB(k: number): Token;

        protected nextTokenOnChannel(i: number, channel: number): number;

        protected previousTokenOnChannel(i: number, channel: number): number;

        reset(): void;

        setTokenSource(tokenSource: TokenSource): void;

        protected setup(): void;

        protected sync(i: number): boolean;
    }

    export class CommonTokenStream extends BufferedTokenStream {
        constructor(tokenSource: TokenSource, channel?: number);

        protected channel: number;

        getNumberOfOnChannelTokens(): number;
    }

    export abstract class Parser {

    }

    export namespace tree {
        interface ParseTreeListener {

        }

        interface RuleNode {

        }

        interface ParseTreeVisitor<T> {

        }

        interface Tree {
            getChild(i: number): Tree;

            getChildCount(): number;

            getParent(): Tree;

            getPayload(): any;

            toStringTree(): string;
        }

        interface SyntaxTree extends Tree {
            getSourceInterval(): Interval;
        }

        interface ParseTree extends SyntaxTree {
            accept<T>(visitor: ParseTreeVisitor<T>): T;

            getChild(i: number): Tree;

            getParent(): Tree;

            getText(): string;

            setParent(parent: RuleContext): void;

            toStringTree(parser: Parser): string;

            toStringTree(): string;
        }

        export class ParseTreeWalker {
            static readonly DEFAULT: ParseTreeWalker;

            constructor();

            protected enterRule(listener: ParseTreeListener, r: RuleNode): void;

            protected exitRule(listener: ParseTreeListener, r: RuleNode): void;

            walk(listener: ParseTreeListener, t: ParseTree): void;
        }
    }
}
