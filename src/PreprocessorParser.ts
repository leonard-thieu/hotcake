import { MissingToken } from './MissingToken';
import {
    ElseDirectiveNode,
    ElseIfDirectiveNode,
    ErrorDirectiveNode,
    IfDirectiveNode,
    ModuleNode,
    Node,
    PrintDirectiveNode,
    RemDirectiveNode,
} from './Node';
import { SkippedToken } from './SkippedToken';
import { Token, TokenKind } from './Token';
import { Tokenizer } from './Tokenizer';

export class PreprocessorParser {
    private tokens: Token[] = [];
    private position: number = 0;

    parse(input: string): ModuleNode {
        const tokenizer = new Tokenizer(input);

        this.tokens.length = 0;
        this.position = 0;
        let t: Token;
        do {
            t = tokenizer.next();
            this.tokens.push(t);
        } while (t.kind !== TokenKind.EOF);

        return this.parseModule();
    }

    private parseModule(): ModuleNode {
        const n = new ModuleNode();

        let continueParsing = true;
        do {
            const t = this.getCurrentToken();
            switch (t.kind) {
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                default: {
                    let child: Node | Token | null = this.parseNextInModuleContext(n);
                    if (child === null) {
                        child = new SkippedToken(t);
                        this.advanceToken();
                    }
                    n.children.push(child);
                    break;
                }
            }
        } while (continueParsing);

        n.eofToken = this.eat(TokenKind.EOF);

        return n;
    }

    private parseNextInModuleContext(parent: Node): Node | null {
        const t = this.getCurrentToken();
        switch (t.kind) {
            case TokenKind.IfDirectiveKeyword: {
                return this.parseIfDirective(parent);
            }
            case TokenKind.RemDirectiveKeyword: {
                return this.parseRemDirective(parent);
            }
            case TokenKind.PrintDirectiveKeyword: {
                return this.parsePrintDirective(parent);
            }
            case TokenKind.ErrorDirectiveKeyword: {
                return this.parseErrorDirective(parent);
            }
        }

        return null;
    }

    private parseIfDirective(parent: Node): IfDirectiveNode {
        const n = new IfDirectiveNode();
        n.parent = parent;
        n.ifDirectiveKeyword = this.eat(TokenKind.IfDirectiveKeyword);
        n.expression = this.parseExpression(n);

        let continueParsing = true;
        do {
            const t = this.getCurrentToken();
            switch (t.kind) {
                case TokenKind.EndDirectiveKeyword:
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                case TokenKind.ElseIfDirectiveKeyword: {
                    const child = this.parseElseIfDirective(n);
                    n.elseIfDirectives.push(child);
                    break;
                }
                case TokenKind.ElseDirectiveKeyword: {
                    // TODO: How should multiple Else directives be handled?
                    n.elseDirective = this.parseElseDirective(n);
                    break;
                }
                default: {
                    let child: Node | Token | null = this.parseNextInModuleContext(n);
                    if (child === null) {
                        child = t;
                        this.advanceToken();
                    }
                    n.children.push(child);
                    break;
                }
            }
        } while (continueParsing);

        n.endDirectiveKeyword = this.eat(TokenKind.EndDirectiveKeyword);

        return n;
    }

    private parseElseIfDirective(parent: IfDirectiveNode): ElseIfDirectiveNode {
        const n = new ElseIfDirectiveNode();
        n.parent = parent;
        n.elseIfDirectiveKeyword = this.eat(TokenKind.ElseIfDirectiveKeyword);
        n.expression = this.parseExpression(n);

        let continueParsing = true;
        do {
            const t = this.getCurrentToken();
            switch (t.kind) {
                case TokenKind.ElseIfDirectiveKeyword:
                case TokenKind.ElseDirectiveKeyword:
                case TokenKind.EndDirectiveKeyword:
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                default: {
                    let child: Node | Token | null = this.parseNextInModuleContext(n);
                    if (child === null) {
                        child = t;
                        this.advanceToken();
                    }
                    n.children.push(child);
                    break;
                }
            }
        } while (continueParsing);

        return n;
    }

    private parseElseDirective(parent: IfDirectiveNode): ElseDirectiveNode {
        const n = new ElseDirectiveNode();
        n.parent = parent;
        n.elseDirectiveKeyword = this.eat(TokenKind.ElseDirectiveKeyword);

        let continueParsing = true;
        do {
            const t = this.getCurrentToken();
            switch (t.kind) {
                case TokenKind.EndDirectiveKeyword:
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                default: {
                    let child: Node | Token | null = this.parseNextInModuleContext(n);
                    if (child === null) {
                        child = t;
                        this.advanceToken();
                    }
                    n.children.push(child);
                    break;
                }
            }
        } while (continueParsing);

        return n;
    }

    private parseRemDirective(parent: Node): RemDirectiveNode {
        const n = new RemDirectiveNode();
        n.parent = parent;
        n.remDirectiveKeyword = this.eat(TokenKind.RemDirectiveKeyword);

        let continueParsing = true;
        do {
            const t = this.getCurrentToken();
            switch (t.kind) {
                case TokenKind.EndDirectiveKeyword:
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                case TokenKind.RemDirectiveKeyword: {
                    const child = this.parseRemDirective(n);
                    n.children.push(child);
                    break;
                }
                case TokenKind.RemDirectiveBody: {
                    const child = t;
                    n.children.push(child);
                    break;
                }
                default: {
                    const child = new SkippedToken(t);
                    n.children.push(child);
                    break;
                }
            }
        } while (continueParsing);

        n.endDirectiveKeyword = this.eat(TokenKind.EndDirectiveKeyword);

        return n;
    }

    private parsePrintDirective(parent: Node): PrintDirectiveNode {
        const n = new PrintDirectiveNode();
        n.parent = parent;
        n.printDirectiveKeyword = this.eat(TokenKind.PrintDirectiveKeyword);
        n.expression = this.parseExpression(n);

        return n;
    }

    private parseErrorDirective(parent: Node): ErrorDirectiveNode {
        const n = new ErrorDirectiveNode();
        n.parent = parent;
        n.errorDirectiveKeyword = this.eat(TokenKind.ErrorDirectiveKeyword);
        n.expression = this.parseExpression(n);

        return n;
    }

    private parseExpression(parent: Node): Node | MissingToken {
        const token = this.getCurrentToken();

        return new MissingToken(TokenKind.Expression, token.start);
    }

    private eat(kind: TokenKind): Token {
        let token = this.getCurrentToken();
        let keepAdvancing = true;
        while (keepAdvancing) {
            switch (token.kind) {
                case TokenKind.Whitespace:
                case TokenKind.Comment: {
                    this.advanceToken();
                    token = this.getCurrentToken();
                    break;
                }
                default: {
                    keepAdvancing = false;
                    break;
                }
            }
        }

        if (token.kind === kind) {
            this.advanceToken();
            return token;
        }

        return new MissingToken(kind, token.start);
    }

    private getCurrentToken(): Token {
        return this.tokens[this.position];
    }

    private advanceToken(): void {
        if (this.position < this.tokens.length) {
            this.position++;
        }
    }
}
