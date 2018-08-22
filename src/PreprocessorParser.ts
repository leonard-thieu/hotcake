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
        let token: Token;
        do {
            token = tokenizer.next();
            this.tokens.push(token);
        } while (token.kind !== TokenKind.EOF);

        return this.parseModule();
    }

    private parseModule(): ModuleNode {
        const moduleNode = new ModuleNode();

        let continueParsing = true;
        do {
            const token = this.getCurrentToken();
            switch (token.kind) {
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                default: {
                    let child: Node | Token | null = this.parseNextInModuleContext(moduleNode);
                    if (child === null) {
                        child = new SkippedToken(token);
                        this.advanceToken();
                    }
                    moduleNode.members.push(child);
                    break;
                }
            }
        } while (continueParsing);

        moduleNode.eofToken = this.eat(TokenKind.EOF);

        return moduleNode;
    }

    private parseNextInModuleContext(parent: Node): Node | null {
        const token = this.getCurrentToken();
        switch (token.kind) {
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

    private assertExpressionParsedCompletely() {
        const token = this.getCurrentToken();

        assert([
            TokenKind.Newline,
            TokenKind.EOF,
        ].includes(token.kind), TokenKind[token.kind]);
    }

    private parseIfDirective(parent: Node): IfDirectiveNode {
        const ifDirective = new IfDirectiveNode();
        ifDirective.parent = parent;
        ifDirective.ifDirectiveKeyword = this.eat(TokenKind.IfDirectiveKeyword);
        ifDirective.expression = this.parseExpression(ifDirective);
        this.assertExpressionParsedCompletely();

        let continueParsing = true;
        do {
            const token = this.getCurrentToken();
            switch (token.kind) {
                case TokenKind.EndDirectiveKeyword:
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                case TokenKind.ElseIfDirectiveKeyword: {
                    const child = this.parseElseIfDirective(ifDirective);
                    ifDirective.elseIfDirectives.push(child);
                    break;
                }
                case TokenKind.ElseDirectiveKeyword: {
                    // TODO: How should multiple Else directives be handled?
                    ifDirective.elseDirective = this.parseElseDirective(ifDirective);
                    break;
                }
                default: {
                    let child: Node | Token | null = this.parseNextInModuleContext(ifDirective);
                    if (child === null) {
                        child = token;
                        this.advanceToken();
                    }
                    ifDirective.members.push(child);
                    break;
                }
            }
        } while (continueParsing);

        ifDirective.endDirectiveKeyword = this.eat(TokenKind.EndDirectiveKeyword);

        return ifDirective;
    }

    private parseElseIfDirective(parent: IfDirectiveNode): ElseIfDirectiveNode {
        const elseIfDirective = new ElseIfDirectiveNode();
        elseIfDirective.parent = parent;
        elseIfDirective.elseIfDirectiveKeyword = this.eat(TokenKind.ElseIfDirectiveKeyword);
        elseIfDirective.expression = this.parseExpression(elseIfDirective);
        this.assertExpressionParsedCompletely();

        let continueParsing = true;
        do {
            const token = this.getCurrentToken();
            switch (token.kind) {
                case TokenKind.ElseIfDirectiveKeyword:
                case TokenKind.ElseDirectiveKeyword:
                case TokenKind.EndDirectiveKeyword:
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                default: {
                    const child =
                        this.parseNextInModuleContext(elseIfDirective) ||
                        this.eat(token.kind);
                    elseIfDirective.members.push(child);
                    break;
                }
            }
        } while (continueParsing);

        return elseIfDirective;
    }

    private parseElseDirective(parent: IfDirectiveNode): ElseDirectiveNode {
        const elseDirective = new ElseDirectiveNode();
        elseDirective.parent = parent;
        elseDirective.elseDirectiveKeyword = this.eat(TokenKind.ElseDirectiveKeyword);

        let continueParsing = true;
        do {
            const token = this.getCurrentToken();
            switch (token.kind) {
                case TokenKind.EndDirectiveKeyword:
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                default: {
                    const child =
                        this.parseNextInModuleContext(elseDirective) ||
                        this.eat(token.kind);
                    elseDirective.members.push(child);
                    break;
                }
            }
        } while (continueParsing);

        return elseDirective;
    }

    private parseRemDirective(parent: Node): RemDirectiveNode {
        const remDirective = new RemDirectiveNode();
        remDirective.parent = parent;
        remDirective.remDirectiveKeyword = this.eat(TokenKind.RemDirectiveKeyword);

        let continueParsing = true;
        do {
            const token = this.getCurrentToken();
            switch (token.kind) {
                case TokenKind.EndDirectiveKeyword:
                case TokenKind.EOF: {
                    continueParsing = false;
                    break;
                }
                case TokenKind.RemDirectiveKeyword: {
                    const child = this.parseRemDirective(remDirective);
                    remDirective.children.push(child);
                    break;
                }
                case TokenKind.IfDirectiveKeyword: {
                    const child = this.parseIfDirective(remDirective);
                    remDirective.children.push(child);
                    break;
                }
                case TokenKind.RemDirectiveBody: {
                    const child = this.eat(token.kind);
                    remDirective.children.push(child);
                    break;
                }
                default: {
                    const child = new SkippedToken(this.eat(token.kind));
                    remDirective.children.push(child);
                    break;
                }
            }
        } while (continueParsing);

        remDirective.endDirectiveKeyword = this.eat(TokenKind.EndDirectiveKeyword);

        return remDirective;
    }

    private parsePrintDirective(parent: Node): PrintDirectiveNode {
        const printDirective = new PrintDirectiveNode();
        printDirective.parent = parent;
        printDirective.printDirectiveKeyword = this.eat(TokenKind.PrintDirectiveKeyword);
        printDirective.expression = this.parseExpression(printDirective);
        this.assertExpressionParsedCompletely();

        return printDirective;
    }

    private parseErrorDirective(parent: Node): ErrorDirectiveNode {
        const errorDirective = new ErrorDirectiveNode();
        errorDirective.parent = parent;
        errorDirective.errorDirectiveKeyword = this.eat(TokenKind.ErrorDirectiveKeyword);
        errorDirective.expression = this.parseExpression(errorDirective);
        this.assertExpressionParsedCompletely();

        return errorDirective;
    }

    // #endregion

    // #region Expressions

    private parseExpression(parent: Node): Expression {
        return this.parseBinaryExpression(parent);
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
            case TokenKind.Identifier: {
                return this.parseVariable(parent);
            }
            case TokenKind.QuotationMark: {
                return this.parseStringLiteral(parent);
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

    private parseVariable(parent: Node) {
        const variable = new Variable();
        variable.parent = parent;
        variable.name = this.eat(TokenKind.Identifier);

        return variable;
    }

    private parseStringLiteral(parent: Node) {
        const stringLiteral = new StringLiteral();
        stringLiteral.parent = parent;
        stringLiteral.startQuote = this.eat(TokenKind.QuotationMark);

        let continueParsing = true;
        do {
            const token = this.getCurrentToken();
            switch (token.kind) {
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
                    const child = this.eat(token.kind);
                    stringLiteral.children.push(child);
                    break;
                }
                default: {
                    const child = new SkippedToken(this.eat(token.kind));
                    stringLiteral.children.push(child);
                    break;
                }
            }
        } while (continueParsing);

        stringLiteral.endQuote = this.eat(TokenKind.QuotationMark);

        return stringLiteral;
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
