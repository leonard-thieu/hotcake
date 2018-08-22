import assert = require('assert');

import { MissingToken } from './MissingToken';
import { ElseDirectiveNode } from './Node/ElseDirectiveNode';
import { ElseIfDirectiveNode } from './Node/ElseIfDirectiveNode';
import { ErrorDirectiveNode } from './Node/ErrorDirectiveNode';
import { BinaryExpression } from './Node/Expression/BinaryExpression';
import { Expression } from './Node/Expression/Expression';
import { GroupingExpression } from './Node/Expression/GroupingExpression';
import { StringLiteral } from './Node/Expression/StringLiteral';
import { UnaryOpExpression } from './Node/Expression/UnaryOpExpression';
import { Variable } from './Node/Expression/Variable';
import { IfDirectiveNode } from './Node/IfDirectiveNode';
import { ModuleNode } from './Node/ModuleNode';
import { Node } from './Node/Node';
import { PrintDirectiveNode } from './Node/PrintDirectiveNode';
import { RemDirectiveNode } from './Node/RemDirectiveNode';
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
                    n.members.push(child);
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

    // #region Directives

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
                    n.members.push(child);
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
                    n.members.push(child);
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
                    n.members.push(child);
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
                case TokenKind.IfDirectiveKeyword: {
                    const child = this.parseIfDirective(n);
                    n.children.push(child);
                    break;
                }
                case TokenKind.RemDirectiveBody: {
                    const child = t;
                    n.children.push(child);
                    this.advanceToken();
                    break;
                }
                default: {
                    const child = new SkippedToken(t);
                    n.children.push(child);
                    this.advanceToken();
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

    // #endregion

    // #region Expressions

    private parseExpression(parent: Node): Expression {
        const expression = this.parseBinaryExpression(parent);

        assert([
            TokenKind.Newline,
            TokenKind.EOF,
        ].includes(this.getCurrentToken().kind), TokenKind[this.getCurrentToken().kind]);

        return expression;
    }

    private parseBinaryExpression(parent: Node): Expression {
        let expression = this.parseUnaryExpression(parent);

        do {
            let token = this.getCurrentToken();

            let isBinaryOperator = false;
            switch (token.kind) {
                case TokenKind.Asterisk:
                case TokenKind.Slash:
                case TokenKind.ModKeyword:
                case TokenKind.ShlKeyword:
                case TokenKind.ShrKeyword:
                case TokenKind.PlusSign:
                case TokenKind.HyphenMinus:
                case TokenKind.Ampersand:
                case TokenKind.Tilde:
                case TokenKind.VerticalBar:
                case TokenKind.EqualsSign: {
                    isBinaryOperator = true;
                    break;
                }
                case TokenKind.LessThanSign: {
                    const nextToken = this.getToken(1);
                    switch (nextToken.kind) {
                        case TokenKind.EqualsSign:
                            this.advanceToken();
                            token = new Token(TokenKind.LessThanOrEquals, token.fullStart, token.start, token.length + nextToken.length);
                            break;
                        case TokenKind.GreaterThanSign:
                            this.advanceToken();
                            token = new Token(TokenKind.NotEquals, token.fullStart, token.start, token.length + nextToken.length);
                            break;
                    }

                    isBinaryOperator = true;
                    break;
                }
                case TokenKind.GreaterThanSign: {
                    const nextToken = this.getToken(1);
                    switch (nextToken.kind) {
                        case TokenKind.EqualsSign:
                            this.advanceToken();
                            token = new Token(TokenKind.GreaterThanOrEquals, token.fullStart, token.start, token.length + nextToken.length);
                            break;
                    }

                    isBinaryOperator = true;
                    break;
                }
                case TokenKind.AndKeyword:
                case TokenKind.OrKeyword: {
                    isBinaryOperator = true;
                    break;
                }
            }

            if (!isBinaryOperator) {
                break;
            }

            this.advanceToken();

            expression = this.makeBinaryExpression(
                expression,
                token,
                this.parseBinaryExpression((null as any)),
                parent
            );
        } while (false);

        return expression;
    }

    private makeBinaryExpression(leftOperand: Expression, operator: Token, rightOperand: Expression, parent: Node): Expression {
        const binaryExpression = new BinaryExpression();
        binaryExpression.parent = parent;
        binaryExpression.leftOperand = leftOperand;
        leftOperand.parent = binaryExpression;
        binaryExpression.operator = operator;
        binaryExpression.rightOperand = rightOperand;
        rightOperand.parent = binaryExpression;

        return binaryExpression;
    }

    private parseUnaryExpression(parent: Node): Expression {
        const token = this.getCurrentToken();
        switch (token.kind) {
            case TokenKind.NotKeyword: {
                return this.parseUnaryOpExpression(parent);
            }
        }

        return this.parsePrimaryExpression(parent);
    }

    private parseUnaryOpExpression(parent: Node): UnaryOpExpression {
        const unaryOpExpression = new UnaryOpExpression();
        unaryOpExpression.parent = parent;
        unaryOpExpression.operator = this.eat(TokenKind.PlusSign, TokenKind.HyphenMinus, TokenKind.Tilde, TokenKind.NotKeyword);
        unaryOpExpression.operand = this.parseUnaryExpression(unaryOpExpression);

        return unaryOpExpression;
    }

    private parsePrimaryExpression(parent: Node): Expression {
        const token = this.getCurrentToken();
        switch (token.kind) {
            case TokenKind.OpeningParenthesis: {
                return this.parseGroupingExpression(parent);
            }
            case TokenKind.QuotationMark: {
                return this.parseStringLiteral(parent);
            }
            case TokenKind.Identifier: {
                return this.parseConfigVariable(parent);
            }
        }

        throw new Error(`${TokenKind[token.kind]} not implemented.`);
    }

    private parseGroupingExpression(parent: Node): GroupingExpression {
        const groupingExpression = new GroupingExpression();
        groupingExpression.parent = parent;
        groupingExpression.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        groupingExpression.expression = this.parseExpression(groupingExpression);
        groupingExpression.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        return groupingExpression;
    }

    private parseConfigVariable(parent: Node) {
        const variable = new Variable();
        variable.parent = parent;
        variable.name = this.eat(TokenKind.Identifier);

        return variable;
    }

    private parseStringLiteral(parent: Node) {
        const n = new StringLiteral();
        n.parent = parent;
        n.startQuote = this.eat(TokenKind.QuotationMark);

        let continueParsing = true;
        do {
            const t = this.getCurrentToken();
            switch (t.kind) {
                case TokenKind.QuotationMark:
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                case TokenKind.StringLiteralText:
                case TokenKind.EscapeNull:
                case TokenKind.EscapeCharacterTabulation:
                case TokenKind.EscapeLineFeedLf:
                case TokenKind.EscapeCarriageReturnCr:
                case TokenKind.EscapeQuotationMark:
                case TokenKind.EscapeTilde:
                case TokenKind.EscapeUnicodeHexValue:
                case TokenKind.InvalidEscapeSequence: {
                    const child = t;
                    n.children.push(child);
                    this.advanceToken();
                    break;
                }
                default: {
                    const child = new SkippedToken(t);
                    n.children.push(child);
                    this.advanceToken();
                    break;
                }
            }
        } while (continueParsing);

        n.endQuote = this.eat(TokenKind.QuotationMark);

        return n;
    }

    // #endregion

    // #region Core

    private eat(...kinds: TokenKind[]): Token {
        const eaten = this.eatOptional(...kinds);
        if (eaten !== null) {
            return eaten;
        }

        const token = this.getCurrentToken();

        return new MissingToken(kinds[0], token.start);
    }

    private eatOptional(...kinds: TokenKind[]): Token | null {
        const token = this.getCurrentToken();
        if (kinds.includes(token.kind)) {
            this.advanceToken();

            return token;
        }

        return null;
    }

    private getCurrentToken(): Token {
        return this.getToken(0);
    }

    private getToken(offset: number): Token {
        return this.tokens[this.position + offset];
    }

    private advanceToken(): void {
        if (this.position < this.tokens.length) {
            this.position++;
        }
    }

    // #endregion
}
