import { GreaterThanSignEqualsSignToken } from "./GreaterThanSignEqualsSignToken";
import { MissingToken } from "./MissingToken";
import { BinaryExpression } from "./Node/Expression/BinaryExpression";
import { BooleanLiteral } from "./Node/Expression/BooleanLiteral";
import { Expression, Expressions } from "./Node/Expression/Expression";
import { FloatLiteral } from "./Node/Expression/FloatLiteral";
import { GroupingExpression } from "./Node/Expression/GroupingExpression";
import { IntegerLiteral } from "./Node/Expression/IntegerLiteral";
import { StringLiteral } from "./Node/Expression/StringLiteral";
import { UnaryOpExpression } from "./Node/Expression/UnaryOpExpression";
import { Variable } from "./Node/Expression/Variable";
import { Node } from "./Node/Node";
import { SkippedToken } from "./SkippedToken";
import { Token } from "./Token";
import { TokenKind } from "./TokenKind";

export abstract class ParserBase {
    protected tokens: Token[];
    protected position: number;

    // #region Expressions

    protected parseExpression(parent: Node): Expressions {
        return this.parseBinaryExpression(Precedence.Initial, parent);
    }

    protected parseBinaryExpression(precedence: Precedence, parent: Node): Expressions {
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

    protected makeBinaryExpression(leftOperand: Expressions, operator: Token, rightOperand: Expressions, parent: Node): Expressions {
        const binaryExpression = new BinaryExpression();
        binaryExpression.parent = parent;
        binaryExpression.leftOperand = leftOperand;
        leftOperand.parent = binaryExpression;
        binaryExpression.operator = operator;
        binaryExpression.rightOperand = rightOperand;
        rightOperand.parent = binaryExpression;

        return binaryExpression;
    }

    protected parseUnaryExpression(parent: Node): Expressions {
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

    protected parseUnaryOpExpression(parent: Node): UnaryOpExpression {
        const unaryOpExpression = new UnaryOpExpression();
        unaryOpExpression.parent = parent;
        unaryOpExpression.operator = this.eat(TokenKind.PlusSign, TokenKind.HyphenMinus, TokenKind.Tilde, TokenKind.NotKeyword);
        unaryOpExpression.operand = this.parseUnaryExpression(unaryOpExpression);

        return unaryOpExpression;
    }

    protected parsePrimaryExpression(parent: Node): Expressions {
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

    protected parseGroupingExpression(parent: Node): GroupingExpression {
        const groupingExpression = new GroupingExpression();
        groupingExpression.parent = parent;
        groupingExpression.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        groupingExpression.expression = this.parseExpression(groupingExpression);
        groupingExpression.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        return groupingExpression;
    }

    protected parseVariable(parent: Node): Variable {
        const variable = new Variable();
        variable.parent = parent;
        variable.name = this.eat(TokenKind.Identifier);

        return variable;
    }

    protected parseStringLiteral(parent: Node): StringLiteral {
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

    protected parseBooleanLiteral(parent: Node): BooleanLiteral {
        const booleanLiteral = new BooleanLiteral();
        booleanLiteral.parent = parent;
        booleanLiteral.value = this.eat(TokenKind.TrueKeyword, TokenKind.FalseKeyword);

        return booleanLiteral;
    }

    protected parseIntegerLiteral(parent: Node): IntegerLiteral {
        const integerLiteral = new IntegerLiteral();
        integerLiteral.parent = parent;
        integerLiteral.value = this.eat(TokenKind.IntegerLiteral);

        return integerLiteral;
    }

    protected parseFloatLiteral(parent: Node): FloatLiteral {
        const floatLiteral = new FloatLiteral();
        floatLiteral.parent = parent;
        floatLiteral.value = this.eat(TokenKind.FloatLiteral);

        return floatLiteral;
    }

    // #endregion

    // #region Core

    protected eat(...kinds: TokenKind[]): Token {
        const eaten = this.eatOptional(...kinds);
        if (eaten !== null) {
            return eaten;
        }

        const token = this.getCurrentToken();

        return new MissingToken(kinds[0], token.start);
    }

    protected eatOptional(...kinds: TokenKind[]): Token | null {
        const token = this.getCurrentToken();
        if (kinds.includes(token.kind)) {
            this.advanceToken();

            return token;
        }

        return null;
    }

    protected getCurrentToken(): Token {
        return this.getToken(0);
    }

    protected getToken(offset: number): Token {
        return this.tokens[this.position + offset];
    }

    protected advanceToken(): void {
        if (this.position < this.tokens.length) {
            this.position++;
        }
    }

    // #endregion

}

export type ParseListElementFn = (parent: Node) => Expression | Token;

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
