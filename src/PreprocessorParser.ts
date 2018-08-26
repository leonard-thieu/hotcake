import assert = require('assert');

import { assertNever } from './assertNever';
import { GreaterThanSignEqualsSignToken } from './GreaterThanSignEqualsSignToken';
import { MissingToken } from './MissingToken';
import { AssignmentDirective } from './Node/Directive/AssignmentDirective';
import { Directive, Directives } from './Node/Directive/Directive';
import { ElseDirective } from './Node/Directive/ElseDirective';
import { ElseIfDirective } from './Node/Directive/ElseIfDirective';
import { EndDirective } from './Node/Directive/EndDirective';
import { ErrorDirective } from './Node/Directive/ErrorDirective';
import { IfDirective } from './Node/Directive/IfDirective';
import { PrintDirective } from './Node/Directive/PrintDirective';
import { RemDirective } from './Node/Directive/RemDirective';
import { BinaryExpression } from './Node/Expression/BinaryExpression';
import { BooleanLiteral } from './Node/Expression/BooleanLiteral';
import { Expression, Expressions } from './Node/Expression/Expression';
import { FloatLiteral } from './Node/Expression/FloatLiteral';
import { GroupingExpression } from './Node/Expression/GroupingExpression';
import { IntegerLiteral } from './Node/Expression/IntegerLiteral';
import { StringLiteral } from './Node/Expression/StringLiteral';
import { UnaryOpExpression } from './Node/Expression/UnaryOpExpression';
import { Variable } from './Node/Expression/Variable';
import { Node } from './Node/Node';
import { PreprocessorModule } from './Node/PreprocessorModule';
import { PreprocessorParseContext } from './PreprocessorParseContext';
import { PreprocessorTokenizer } from './PreprocessorTokenizer';
import { SkippedToken } from './SkippedToken';
import { Token } from './Token';
import { TokenKind } from "./TokenKind";

export class PreprocessorParser {
    private tokens: Token[];
    private position: number;

    parse(input: string): PreprocessorModule {
        const tokenizer = new PreprocessorTokenizer(input);

        this.tokens = [];
        this.position = 0;
        let token: Token;
        do {
            token = tokenizer.next();
            this.tokens.push(token);
        } while (token.kind !== TokenKind.EOF);

        return this.parseModule();
    }

    private parseModule(): PreprocessorModule {
        const preprocessorModule = new PreprocessorModule();
        preprocessorModule.members.push(...this.parseList(preprocessorModule, PreprocessorParseContext.ModuleMembers) as Array<Directives | Token>);
        preprocessorModule.eofToken = this.eat(TokenKind.EOF);

        return preprocessorModule;
    }

    // #region Directives

    private assertExpressionParsedCompletely(): void {
        const token = this.getCurrentToken();

        assert([
            TokenKind.Newline,
            TokenKind.EOF,
        ].includes(token.kind), TokenKind[token.kind]);
    }

    private parseIfDirective(parent: Node): IfDirective {
        const ifDirective = new IfDirective();
        ifDirective.parent = parent;
        ifDirective.ifDirectiveKeyword = this.eat(TokenKind.IfDirectiveKeyword);
        ifDirective.expression = this.parseExpression(ifDirective);
        this.assertExpressionParsedCompletely();

        ifDirective.members.push(...this.parseList(ifDirective, PreprocessorParseContext.IfDirectiveMembers) as Array<Directives | Token>);
        while (this.getCurrentToken().kind === TokenKind.ElseIfDirectiveKeyword) {
            ifDirective.elseIfDirectives.push(this.parseElseIfDirective(ifDirective));
        }

        if (this.getCurrentToken().kind === TokenKind.ElseDirectiveKeyword) {
            ifDirective.elseDirective = this.parseElseDirective(ifDirective);
        }

        ifDirective.endDirective = this.parseEndDirective(ifDirective);

        return ifDirective;
    }

    private parseElseIfDirective(parent: IfDirective): ElseIfDirective {
        const elseIfDirective = new ElseIfDirective();
        elseIfDirective.parent = parent;
        elseIfDirective.elseIfDirectiveKeyword = this.eat(TokenKind.ElseIfDirectiveKeyword);
        elseIfDirective.expression = this.parseExpression(elseIfDirective);
        this.assertExpressionParsedCompletely();

        elseIfDirective.members.push(...this.parseList(elseIfDirective, PreprocessorParseContext.IfDirectiveMembers) as Array<Directives | Token>);

        return elseIfDirective;
    }

    private parseElseDirective(parent: IfDirective): ElseDirective {
        const elseDirective = new ElseDirective();
        elseDirective.parent = parent;
        elseDirective.elseDirectiveKeyword = this.eat(TokenKind.ElseDirectiveKeyword);
        elseDirective.members.push(...this.parseList(elseDirective, PreprocessorParseContext.IfDirectiveMembers) as Array<Directives | Token>);

        return elseDirective;
    }

    private parseEndDirective(parent: Directive): EndDirective {
        const endDirective = new EndDirective();
        endDirective.parent = parent;
        endDirective.endDirectiveKeyword = this.eat(TokenKind.EndDirectiveKeyword);

        return endDirective;
    }

    private parseRemDirective(parent: Node): RemDirective {
        const remDirective = new RemDirective();
        remDirective.parent = parent;
        remDirective.remDirectiveKeyword = this.eat(TokenKind.RemDirectiveKeyword);
        remDirective.children.push(...this.parseList(remDirective, PreprocessorParseContext.RemDirectiveMembers) as Array<RemDirective | IfDirective | Token>);
        remDirective.endDirective = this.parseEndDirective(remDirective);

        return remDirective;
    }

    private parsePrintDirective(parent: Node): PrintDirective {
        const printDirective = new PrintDirective();
        printDirective.parent = parent;
        printDirective.printDirectiveKeyword = this.eat(TokenKind.PrintDirectiveKeyword);
        printDirective.expression = this.parseExpression(printDirective);
        this.assertExpressionParsedCompletely();

        return printDirective;
    }

    private parseErrorDirective(parent: Node): ErrorDirective {
        const errorDirective = new ErrorDirective();
        errorDirective.parent = parent;
        errorDirective.errorDirectiveKeyword = this.eat(TokenKind.ErrorDirectiveKeyword);
        errorDirective.expression = this.parseExpression(errorDirective);
        this.assertExpressionParsedCompletely();

        return errorDirective;
    }

    private parseAssignmentDirective(parent: Node): AssignmentDirective {
        const assignmentDirective = new AssignmentDirective();
        assignmentDirective.parent = parent;
        assignmentDirective.name = this.eat(TokenKind.ConfigurationVariable);
        assignmentDirective.operator = this.eat(TokenKind.EqualsSign, TokenKind.PlusSignEqualsSign);
        assignmentDirective.expression = this.parseExpression(assignmentDirective);

        return assignmentDirective;
    }

    // #endregion

    // #region Expressions

    private parseExpression(parent: Node): Expressions {
        return this.parseBinaryExpression(Precedence.Initial, parent);
    }

    private parseBinaryExpression(precedence: Precedence, parent: Node): Expressions {
        let expression = this.parseUnaryExpression(parent);

        let [prevNewPrecedence, prevAssociativity] = UNKNOWN_PRECEDENCE_AND_ASSOCIATIVITY;

        while (true) {
            let token = this.getCurrentToken();

            if (token.kind === TokenKind.GreaterThanSign) {
                const nextToken = this.getToken(1);
                if (nextToken.kind === TokenKind.EqualsSign) {
                    token = new GreaterThanSignEqualsSignToken(token, nextToken);
                    this.advanceToken();
                }
            }

            const [newPrecedence, associativity] = getBinaryOperatorPrecedenceAndAssociativity(token);

            if (prevAssociativity === Associativity.None && prevNewPrecedence === newPrecedence) {
                break;
            }

            const shouldConsumeCurrentOperator =
                associativity === Associativity.Right ?
                    newPrecedence >= precedence :
                    newPrecedence > precedence;

            if (!shouldConsumeCurrentOperator) {
                break;
            }

            this.advanceToken();

            expression = this.makeBinaryExpression(
                expression,
                token,
                this.parseBinaryExpression(newPrecedence, (null as any)),
                parent
            );

            prevNewPrecedence = newPrecedence;
            prevAssociativity = associativity;
        }

        return expression;
    }

    private makeBinaryExpression(leftOperand: Expressions, operator: Token, rightOperand: Expressions, parent: Node): Expressions {
        const binaryExpression = new BinaryExpression();
        binaryExpression.parent = parent;
        binaryExpression.leftOperand = leftOperand;
        leftOperand.parent = binaryExpression;
        binaryExpression.operator = operator;
        binaryExpression.rightOperand = rightOperand;
        rightOperand.parent = binaryExpression;

        return binaryExpression;
    }

    private parseUnaryExpression(parent: Node): Expressions {
        const token = this.getCurrentToken();
        switch (token.kind) {
            case TokenKind.PlusSign:
            case TokenKind.HyphenMinus:
            case TokenKind.Tilde:
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

    private parsePrimaryExpression(parent: Node): Expressions {
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
            case TokenKind.TrueKeyword:
            case TokenKind.FalseKeyword: {
                return this.parseBooleanLiteral(parent);
            }
            case TokenKind.IntegerLiteral: {
                return this.parseIntegerLiteral(parent);
            }
            case TokenKind.FloatLiteral: {
                return this.parseFloatLiteral(parent);
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

    private parseVariable(parent: Node): Variable {
        const variable = new Variable();
        variable.parent = parent;
        variable.name = this.eat(TokenKind.Identifier);

        return variable;
    }

    private parseStringLiteral(parent: Node): StringLiteral {
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

    private parseBooleanLiteral(parent: Node): BooleanLiteral {
        const booleanLiteral = new BooleanLiteral();
        booleanLiteral.parent = parent;
        booleanLiteral.value = this.eat(TokenKind.TrueKeyword, TokenKind.FalseKeyword);

        return booleanLiteral;
    }

    private parseIntegerLiteral(parent: Node): IntegerLiteral {
        const integerLiteral = new IntegerLiteral();
        integerLiteral.parent = parent;
        integerLiteral.value = this.eat(TokenKind.IntegerLiteral);

        return integerLiteral;
    }

    private parseFloatLiteral(parent: Node): FloatLiteral {
        const floatLiteral = new FloatLiteral();
        floatLiteral.parent = parent;
        floatLiteral.value = this.eat(TokenKind.FloatLiteral);

        return floatLiteral;
    }

    // #endregion

    // #region Core

    private currentParseContext: PreprocessorParseContext;

    private parseList(parent: Node, parseContext: PreprocessorParseContext): Array<Expression | Token> {
        const savedParseContext = this.currentParseContext;
        this.currentParseContext |= parseContext;

        const parseListElementFn = this.getParseListElementFn(parseContext).bind(this);

        const nodes: Array<Expression | Token> = [];
        while (!this.isCurrentTokenListTerminator(parseContext)) {
            if (this.isCurrentTokenValidListElement(parseContext)) {
                const element = parseListElementFn(parent);
                nodes.push(element);

                continue;
            }

            if (this.isCurrentTokenValidInEnclosingContexts()) {
                break;
            }

            const token = new SkippedToken(this.getCurrentToken());
            nodes.push(token);
            this.advanceToken();
        }

        this.currentParseContext = savedParseContext;

        return nodes;
    }

    private getParseListElementFn(parseContext: PreprocessorParseContext): ParseListElementFn {
        switch (parseContext) {
            case PreprocessorParseContext.ModuleMembers:
            case PreprocessorParseContext.IfDirectiveMembers: {
                return this.parseModuleMember;
            }
            case PreprocessorParseContext.RemDirectiveMembers: {
                return this.parseRemDirectiveMember;
            }
        }

        return assertNever(parseContext);
    }

    private parseModuleMember(parent: Node): Directives | Token {
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
            case TokenKind.ConfigurationVariable: {
                return this.parseAssignmentDirective(parent);
            }
        }

        this.advanceToken();

        return token;
    }

    private parseRemDirectiveMember(parent: Node): IfDirective | RemDirective | Token {
        const token = this.getCurrentToken();
        switch (token.kind) {
            case TokenKind.IfDirectiveKeyword: {
                return this.parseIfDirective(parent);
            }
            case TokenKind.RemDirectiveKeyword: {
                return this.parseRemDirective(parent);
            }
            case TokenKind.RemDirectiveBody: {
                this.advanceToken();

                return token;
            }
        }

        throw new Error(`Unexpected token: ${TokenKind[token.kind] || token.kind}`);
    }

    private isCurrentTokenListTerminator(parseContext: PreprocessorParseContext): boolean {
        const token = this.getCurrentToken();
        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case PreprocessorParseContext.ModuleMembers: {
                return false;
            }
            case PreprocessorParseContext.IfDirectiveMembers: {
                switch (token.kind) {
                    case TokenKind.ElseIfDirectiveKeyword:
                    case TokenKind.ElseDirectiveKeyword:
                    case TokenKind.EndDirectiveKeyword: {
                        return true;
                    }
                }

                return false;
            }
            case PreprocessorParseContext.RemDirectiveMembers: {
                return token.kind === TokenKind.EndDirectiveKeyword;
            }
        }

        return assertNever(parseContext);
    }

    private isCurrentTokenValidListElement(parseContext: PreprocessorParseContext): boolean {
        switch (parseContext) {
            case PreprocessorParseContext.ModuleMembers:
            case PreprocessorParseContext.IfDirectiveMembers: {
                return true;
            }
            case PreprocessorParseContext.RemDirectiveMembers: {
                const token = this.getCurrentToken();
                switch (token.kind) {
                    case TokenKind.IfDirectiveKeyword:
                    case TokenKind.RemDirectiveKeyword:
                    case TokenKind.RemDirectiveBody: {
                        return true;
                    }
                }

                return false;
            }
        }

        return assertNever(parseContext);
    }

    private isCurrentTokenValidInEnclosingContexts(): boolean {
        for (let i = 0; i < 32; i++) {
            const parseContext = 1 << i;
            if (this.isInParseContext(parseContext)) {
                if (this.isCurrentTokenValidListElement(parseContext) ||
                    this.isCurrentTokenListTerminator(parseContext)) {
                    return true;
                }
            }
        }

        return false;
    }

    private isInParseContext(parseContext: number): boolean {
        return (this.currentParseContext & parseContext) === 1;
    }

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

type ParseListElementFn = (parent: Node) => Expression | Token;

// #region Precedence and associativity

enum Precedence {
    Unknown = -1,
    Initial = 0,
    LogicalOr = 6,
    LogicalAnd = 7,
    EqualityRelational = 8,
    BitwiseOr = 9,
    BitwiseXorBitwiseAnd = 10,
    Additive = 11,
    ShiftMultiplicative = 12,
}

enum Associativity {
    Unknown = -1,
    None = 0,
    Left = 1,
    Right = 2,
}

type PrecedenceAndAssociativity = [Precedence, Associativity];

type PrecedenceAndAssociativityMap = {
    readonly [P in keyof typeof TokenKind]?: PrecedenceAndAssociativity;
};

const OPERATOR_PRECEDENCE_AND_ASSOCIATIVITY: PrecedenceAndAssociativityMap = {
    [TokenKind.OrKeyword]: [Precedence.LogicalOr, Associativity.Left],

    [TokenKind.AndKeyword]: [Precedence.LogicalAnd, Associativity.Left],

    [TokenKind.LessThanSignGreaterThanSign]: [Precedence.EqualityRelational, Associativity.None],
    [TokenKind.GreaterThanSignEqualsSign]: [Precedence.EqualityRelational, Associativity.None],
    [TokenKind.LessThanSignEqualsSign]: [Precedence.EqualityRelational, Associativity.None],
    [TokenKind.GreaterThanSign]: [Precedence.EqualityRelational, Associativity.None],
    [TokenKind.LessThanSign]: [Precedence.EqualityRelational, Associativity.None],
    [TokenKind.EqualsSign]: [Precedence.EqualityRelational, Associativity.None],

    [TokenKind.VerticalBar]: [Precedence.BitwiseOr, Associativity.Left],

    [TokenKind.Tilde]: [Precedence.BitwiseXorBitwiseAnd, Associativity.Left],
    [TokenKind.Ampersand]: [Precedence.BitwiseXorBitwiseAnd, Associativity.Left],

    [TokenKind.HyphenMinus]: [Precedence.Additive, Associativity.Left],
    [TokenKind.PlusSign]: [Precedence.Additive, Associativity.Left],

    [TokenKind.ShrKeyword]: [Precedence.ShiftMultiplicative, Associativity.Left],
    [TokenKind.ShlKeyword]: [Precedence.ShiftMultiplicative, Associativity.Left],
    [TokenKind.ModKeyword]: [Precedence.ShiftMultiplicative, Associativity.Left],
    [TokenKind.Slash]: [Precedence.ShiftMultiplicative, Associativity.Left],
    [TokenKind.Asterisk]: [Precedence.ShiftMultiplicative, Associativity.Left],
};

const UNKNOWN_PRECEDENCE_AND_ASSOCIATIVITY: PrecedenceAndAssociativity = [Precedence.Unknown, Associativity.Unknown];

function getBinaryOperatorPrecedenceAndAssociativity(token: Token): PrecedenceAndAssociativity {
    return OPERATOR_PRECEDENCE_AND_ASSOCIATIVITY[token.kind] ||
        UNKNOWN_PRECEDENCE_AND_ASSOCIATIVITY;
}

// #endregion
