import { assertNever } from '../assertNever';
import { ArrayTypeAnnotation } from './Node/ArrayTypeAnnotation';
import { CommaSeparator } from './Node/CommaSeparator';
import { ConfigurationTag } from './Node/ConfigurationTag';
import { ArrayLiteralExpression } from './Node/Expression/ArrayLiteralExpression';
import { AssignmentExpression, AssignmentOperatorToken } from './Node/Expression/AssignmentExpression';
import { BinaryExpression, BinaryExpressionOperatorToken } from './Node/Expression/BinaryExpression';
import { BooleanLiteralExpression, BooleanLiteralExpressionValueToken } from './Node/Expression/BooleanLiteralExpression';
import { Expressions, MissableExpression } from './Node/Expression/Expression';
import { FloatLiteralExpression } from './Node/Expression/FloatLiteralExpression';
import { GlobalScopeExpression } from './Node/Expression/GlobalScopeExpression';
import { GroupingExpression } from './Node/Expression/GroupingExpression';
import { IdentifierExpression, IdentifierExpressionToken } from './Node/Expression/IdentifierExpression';
import { IndexExpression } from './Node/Expression/IndexExpression';
import { IntegerLiteralExpression } from './Node/Expression/IntegerLiteralExpression';
import { InvokeExpression } from './Node/Expression/InvokeExpression';
import { NewExpression } from './Node/Expression/NewExpression';
import { NullExpression } from './Node/Expression/NullExpression';
import { ScopeMemberAccessExpression } from './Node/Expression/ScopeMemberAccessExpression';
import { SelfExpression } from './Node/Expression/SelfExpression';
import { SliceExpression } from './Node/Expression/SliceExpression';
import { MissableStringLiteralExpression, StringLiteralExpression } from './Node/Expression/StringLiteralExpression';
import { SuperExpression } from './Node/Expression/SuperExpression';
import { UnaryExpression, UnaryOperatorToken } from './Node/Expression/UnaryExpression';
import { EscapedIdentifier, MissableIdentifier } from './Node/Identifier';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { MissableTypeReference, TypeReference, TypeReferenceIdentifierStartToken } from './Node/TypeReference';
import { GreaterThanSignEqualsSignToken } from './Token/GreaterThanSignEqualsSignToken';
import { MissingToken, MissingTokenKinds } from './Token/MissingToken';
import { ModKeywordEqualsSignToken } from './Token/ModKeywordEqualsSignToken';
import { ShlKeywordEqualsSignToken } from './Token/ShlKeywordEqualsSignToken';
import { ShrKeywordEqualsSignToken } from './Token/ShrKeywordEqualsSignToken';
import { SkippedToken } from './Token/SkippedToken';
import { CommaToken, CommercialAtToken, ConfigurationTagStartToken, FloatLiteralToken, IntegerLiteralToken, NewKeywordToken, NullKeywordToken, OpeningParenthesisToken, OpeningSquareBracketToken, PeriodPeriodToken, PeriodToken, QuotationMarkToken, SelfKeywordToken, SuperKeywordToken, TokenKinds, TokenKindTokenMap, Tokens } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export abstract class ParserBase {
    protected tokens: Tokens[] = undefined!;
    protected position: number = 0;

    // #region Expression sequence

    private isExpressionSequenceTerminator(token: Tokens): boolean {
        return !this.isExpressionSequenceMemberStart(token);
    }

    protected isExpressionSequenceMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Comma: {
                return true;
            }
        }

        return this.isExpressionStart(token);
    }

    private parseExpressionSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        return this.parseExpression(parent);
    }

    // #endregion

    // #region Expressions

    protected isExpressionStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.NewKeyword:
            case TokenKind.NullKeyword:
            case TokenKind.TrueKeyword:
            case TokenKind.FalseKeyword:
            case TokenKind.SelfKeyword:
            case TokenKind.SuperKeyword:
            case TokenKind.QuotationMark:
            case TokenKind.FloatLiteral:
            case TokenKind.IntegerLiteral:
            case TokenKind.Period:
            case TokenKind.OpeningParenthesis:
            case TokenKind.OpeningSquareBracket:
            case TokenKind.PlusSign:
            case TokenKind.HyphenMinus:
            case TokenKind.Tilde:
            case TokenKind.NotKeyword:
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword: {
                return true;
            }
        }

        return false;
    }

    protected parseExpression(parent: Nodes) {
        return this.parseBinaryExpressionOrHigher(Precedence.Initial, parent);
    }

    // #region Binary expressions

    protected parseBinaryExpressionOrHigher(precedence: Precedence, parent: Nodes) {
        let expression = this.parseUnaryExpressionOrHigher(parent);
        let [prevNewPrecedence, prevAssociativity] = UnknownPrecedenceAndAssociativity;

        while (true) {
            let token = this.getToken();

            switch (token.kind) {
                case TokenKind.GreaterThanSign: {
                    const nextToken = this.getToken(1);
                    if (nextToken.kind === TokenKind.EqualsSign) {
                        token = new GreaterThanSignEqualsSignToken(token, nextToken);
                    }
                    break;
                }
                case TokenKind.ShlKeyword: {
                    const nextToken = this.getToken(1);
                    if (nextToken.kind === TokenKind.EqualsSign) {
                        token = new ShlKeywordEqualsSignToken(token, nextToken);
                    }
                    break;
                }
                case TokenKind.ShrKeyword: {
                    const nextToken = this.getToken(1);
                    if (nextToken.kind === TokenKind.EqualsSign) {
                        token = new ShrKeywordEqualsSignToken(token, nextToken);
                    }
                    break;
                }
                case TokenKind.ModKeyword: {
                    const nextToken = this.getToken(1);
                    if (nextToken.kind === TokenKind.EqualsSign) {
                        token = new ModKeywordEqualsSignToken(token, nextToken);
                    }
                    break;
                }
            }

            const [newPrecedence, associativity] = getBinaryOperatorPrecedenceAndAssociativity(token, parent);

            if (prevAssociativity === Associativity.None &&
                prevNewPrecedence === newPrecedence) {
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
            switch (token.kind) {
                case TokenKind.GreaterThanSignEqualsSign:
                case TokenKind.ShlKeywordEqualsSign:
                case TokenKind.ShrKeywordEqualsSign:
                case TokenKind.ModKeywordEqualsSign: {
                    this.advanceToken();
                    break;
                }
            }

            switch (token.kind) {
                case TokenKind.VerticalBarEqualsSign:
                case TokenKind.TildeEqualsSign:
                case TokenKind.AmpersandEqualsSign:
                case TokenKind.HyphenMinusEqualsSign:
                case TokenKind.PlusSignEqualsSign:
                case TokenKind.ShrKeywordEqualsSign:
                case TokenKind.ShlKeywordEqualsSign:
                case TokenKind.ModKeywordEqualsSign:
                case TokenKind.SlashEqualsSign:
                case TokenKind.AsteriskEqualsSign: {
                    expression = this.parseAssignmentExpression(parent, expression, token, newPrecedence);
                    break;
                }
                case TokenKind.OrKeyword:
                case TokenKind.AndKeyword:
                case TokenKind.LessThanSignGreaterThanSign:
                case TokenKind.GreaterThanSignEqualsSign:
                case TokenKind.LessThanSignEqualsSign:
                case TokenKind.GreaterThanSign:
                case TokenKind.LessThanSign:
                case TokenKind.VerticalBar:
                case TokenKind.Tilde:
                case TokenKind.Ampersand:
                case TokenKind.HyphenMinus:
                case TokenKind.PlusSign:
                case TokenKind.ShrKeyword:
                case TokenKind.ShlKeyword:
                case TokenKind.ModKeyword:
                case TokenKind.Slash:
                case TokenKind.Asterisk: {
                    expression = this.parseBinaryExpression(parent, expression, token, newPrecedence);
                    break;
                }
                case TokenKind.EqualsSign: {
                    if (parent) {
                        if (parent.kind === NodeKind.ExpressionStatement ||
                            parent.kind === NodeKind.ForLoop) {
                            expression = this.parseAssignmentExpression(parent, expression, token, newPrecedence);
                            break;
                        }
                    }

                    expression = this.parseBinaryExpression(parent, expression, token, newPrecedence);
                    break;
                }
            }

            prevNewPrecedence = newPrecedence;
            prevAssociativity = associativity;
        }

        return expression;
    }

    private parseAssignmentExpression(
        parent: Nodes,
        leftOperand: MissableExpression,
        operator: AssignmentOperatorToken,
        newPrecedence: Precedence,
    ): AssignmentExpression {
        const assignmentExpression = new AssignmentExpression();
        assignmentExpression.parent = parent;
        assignmentExpression.leftOperand = leftOperand;
        if (leftOperand.kind !== TokenKind.Missing) {
            leftOperand.parent = assignmentExpression;
        }
        assignmentExpression.operator = operator;
        assignmentExpression.eachInKeyword = this.eatOptional(TokenKind.EachInKeyword);
        assignmentExpression.rightOperand = this.parseBinaryExpressionOrHigher(newPrecedence, assignmentExpression);

        return assignmentExpression;
    }

    private parseBinaryExpression(
        parent: Nodes,
        leftOperand: MissableExpression,
        operator: BinaryExpressionOperatorToken,
        newPrecedence: Precedence,
    ): BinaryExpression {
        const binaryExpression = new BinaryExpression();
        binaryExpression.parent = parent;
        binaryExpression.leftOperand = leftOperand;
        if (leftOperand.kind !== TokenKind.Missing) {
            leftOperand.parent = binaryExpression;
        }
        binaryExpression.operator = operator;
        binaryExpression.rightOperand = this.parseBinaryExpressionOrHigher(newPrecedence, binaryExpression);

        return binaryExpression;
    }

    // #endregion

    // #region Unary expressions

    protected parseUnaryExpressionOrHigher(parent: Nodes): MissableExpression {
        const newlines = this.parseList(ParseContextKind.NewlineList, /*parent*/ null!, /*delimiter*/ null);

        let expression: MissableExpression;

        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.PlusSign:
            case TokenKind.HyphenMinus:
            case TokenKind.Tilde:
            case TokenKind.NotKeyword: {
                this.advanceToken();

                expression = this.parseUnaryExpression(parent, token);
                break;
            }
            default: {
                expression = this.parsePrimaryExpression(parent);

                if (expression.kind !== TokenKind.Missing) {
                    while (true) {
                        const postfixExpression = this.parsePostfixExpression(expression);

                        if (!postfixExpression) {
                            break;
                        }

                        expression = postfixExpression;
                    }
                }
                break;
            }
        }

        expression.newlines = newlines;

        return expression;
    }

    protected parseUnaryExpression(parent: Nodes, operator: UnaryOperatorToken): UnaryExpression {
        const unaryExpression = new UnaryExpression();
        unaryExpression.parent = parent;
        unaryExpression.operator = operator;
        unaryExpression.operand = this.parseUnaryExpressionOrHigher(unaryExpression);

        return unaryExpression;
    }

    // #endregion

    // #region Primary expressions

    protected parsePrimaryExpression(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.NewKeyword: {
                this.advanceToken();

                switch (parent.kind) {
                    case NodeKind.ScopeMemberAccessExpression: {
                        return this.parseIdentifierExpression(parent, token);
                    }
                }

                return this.parseNewExpression(parent, token);
            }
            case TokenKind.NullKeyword: {
                this.advanceToken();

                return this.parseNullExpression(parent, token);
            }
            case TokenKind.TrueKeyword:
            case TokenKind.FalseKeyword: {
                this.advanceToken();

                return this.parseBooleanLiteralExpression(parent, token);
            }
            case TokenKind.SelfKeyword: {
                this.advanceToken();

                return this.parseSelfExpression(parent, token);
            }
            case TokenKind.SuperKeyword: {
                this.advanceToken();

                return this.parseSuperExpression(parent, token);
            }
            case TokenKind.QuotationMark: {
                this.advanceToken();

                return this.parseStringLiteralExpression(parent, token);
            }
            case TokenKind.FloatLiteral: {
                this.advanceToken();

                return this.parseFloatLiteralExpression(parent, token);
            }
            case TokenKind.IntegerLiteral: {
                this.advanceToken();

                return this.parseIntegerLiteralExpression(parent, token);
            }
            case TokenKind.OpeningSquareBracket: {
                this.advanceToken();

                return this.parseArrayLiteralExpression(parent, token);
            }
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword: {
                this.advanceToken();

                return this.parseIdentifierExpression(parent, token);
            }
            case TokenKind.Period: {
                // Don't consume the token here. This creates a placeholder expression for ScopeMemberAccessExpression
                // to attach on to.
                return this.parseGlobalScopeExpression(parent);
            }
            case TokenKind.OpeningParenthesis: {
                this.advanceToken();

                return this.parseGroupingExpression(parent, token);
            }
        }

        return this.createMissingToken(token.fullStart, TokenKind.Expression);
    }

    protected parseNewExpression(parent: Nodes, newKeyword: NewKeywordToken): NewExpression {
        const newExpression = new NewExpression();
        newExpression.parent = parent;
        newExpression.newKeyword = newKeyword;
        newExpression.type = this.parseMissableTypeReference(newExpression);

        return newExpression;
    }

    protected parseNullExpression(parent: Nodes, nullKeyword: NullKeywordToken): NullExpression {
        const nullExpression = new NullExpression();
        nullExpression.parent = parent;
        nullExpression.nullKeyword = nullKeyword;

        return nullExpression;
    }

    protected parseBooleanLiteralExpression(parent: Nodes, value: BooleanLiteralExpressionValueToken): BooleanLiteralExpression {
        const booleanLiteralExpression = new BooleanLiteralExpression();
        booleanLiteralExpression.parent = parent;
        booleanLiteralExpression.value = value;

        return booleanLiteralExpression;
    }

    protected parseSelfExpression(parent: Nodes, selfKeyword: SelfKeywordToken): SelfExpression {
        const selfExpression = new SelfExpression();
        selfExpression.parent = parent;
        selfExpression.selfKeyword = selfKeyword;

        return selfExpression;
    }

    protected parseSuperExpression(parent: Nodes, superKeyword: SuperKeywordToken): SuperExpression {
        const superExpression = new SuperExpression();
        superExpression.parent = parent;
        superExpression.superKeyword = superKeyword;

        return superExpression;
    }

    // #region String literal expression

    protected parseMissableStringLiteralExpression(parent: Nodes): MissableStringLiteralExpression {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.QuotationMark: {
                this.advanceToken();

                return this.parseStringLiteralExpression(parent, token);
            }
        }

        return this.createMissingToken(token.fullStart, NodeKind.StringLiteralExpression);
    }

    protected parseStringLiteralExpression(parent: Nodes, startQuotationMark: QuotationMarkToken): StringLiteralExpression {
        const stringLiteralExpression = new StringLiteralExpression();
        stringLiteralExpression.parent = parent;
        stringLiteralExpression.startQuotationMark = startQuotationMark;
        stringLiteralExpression.children = this.parseList(stringLiteralExpression.kind, stringLiteralExpression);
        stringLiteralExpression.endQuotationMark = this.eatMissable(TokenKind.QuotationMark);

        return stringLiteralExpression;
    }

    // #region String literal expression children

    protected isStringLiteralExpressionChildListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.QuotationMark: {
                return true;
            }
        }

        return false;
    }

    protected isStringLiteralExpressionChildStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.StringLiteralText:
            case TokenKind.EscapeNull:
            case TokenKind.EscapeCharacterTabulation:
            case TokenKind.EscapeLineFeedLf:
            case TokenKind.EscapeCarriageReturnCr:
            case TokenKind.EscapeQuotationMark:
            case TokenKind.EscapeTilde:
            case TokenKind.EscapeUnicodeHexValue:
            case TokenKind.InvalidEscapeSequence:
            case TokenKind.ConfigurationTagStart: {
                return true;
            }
        }

        return false;
    }

    protected parseStringLiteralExpressionChild(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.StringLiteralText:
            case TokenKind.EscapeNull:
            case TokenKind.EscapeCharacterTabulation:
            case TokenKind.EscapeLineFeedLf:
            case TokenKind.EscapeCarriageReturnCr:
            case TokenKind.EscapeQuotationMark:
            case TokenKind.EscapeTilde:
            case TokenKind.EscapeUnicodeHexValue:
            case TokenKind.InvalidEscapeSequence: {
                this.advanceToken();

                return token;
            }
            case TokenKind.ConfigurationTagStart: {
                this.advanceToken();

                return this.parseConfigurationTag(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    protected parseConfigurationTag(parent: Nodes, startToken: ConfigurationTagStartToken): ConfigurationTag {
        const configurationTag = new ConfigurationTag();
        configurationTag.parent = parent;
        configurationTag.startToken = startToken;
        configurationTag.name = this.eatOptional(TokenKind.Identifier);
        // Guaranteed by tokenizer.
        configurationTag.endToken = this.eat(TokenKind.ConfigurationTagEnd);

        return configurationTag;
    }

    // #endregion

    // #endregion

    protected parseFloatLiteralExpression(parent: Nodes, value: FloatLiteralToken): FloatLiteralExpression {
        const floatLiteralExpression = new FloatLiteralExpression();
        floatLiteralExpression.parent = parent;
        floatLiteralExpression.value = value;

        return floatLiteralExpression;
    }

    protected parseIntegerLiteralExpression(parent: Nodes, value: IntegerLiteralToken): IntegerLiteralExpression {
        const integerLiteralExpression = new IntegerLiteralExpression();
        integerLiteralExpression.parent = parent;
        integerLiteralExpression.value = value;

        return integerLiteralExpression;
    }

    protected parseArrayLiteralExpression(parent: Nodes, openingSquareBracket: OpeningSquareBracketToken): ArrayLiteralExpression {
        const arrayLiteralExpression = new ArrayLiteralExpression();
        arrayLiteralExpression.parent = parent;
        arrayLiteralExpression.openingSquareBracket = openingSquareBracket;
        arrayLiteralExpression.leadingNewlines = this.parseList(ParseContextKind.NewlineList, arrayLiteralExpression, /*delimiter*/ null);
        arrayLiteralExpression.expressions = this.parseList(ParseContextKind.ExpressionSequence, arrayLiteralExpression, TokenKind.Comma);
        arrayLiteralExpression.closingSquareBracket = this.eatMissable(TokenKind.ClosingSquareBracket);

        return arrayLiteralExpression;
    }

    protected parseIdentifierExpression(parent: Nodes, identifierStart: IdentifierExpressionToken | CommercialAtToken): IdentifierExpression {
        const identifierExpression = new IdentifierExpression();
        identifierExpression.parent = parent;
        identifierExpression.identifier = this.parseIdentifier(identifierExpression, identifierStart);

        // Generic type arguments
        const position = this.position;
        const lessThanSign = this.eatOptional(TokenKind.LessThanSign);
        if (lessThanSign) {
            const typeArguments = this.parseList(ParseContextKind.TypeReferenceSequence, identifierExpression, TokenKind.Comma);
            const greaterThanSign = this.eatOptional(TokenKind.GreaterThanSign);

            // Couldn't find terminating `>`. That means `<` is part of a binary expression and not the start of generic type arguments.
            if (!greaterThanSign) {
                this.position = position;
            } else {
                identifierExpression.lessThanSign = lessThanSign;
                identifierExpression.typeArguments = typeArguments;
                identifierExpression.greaterThanSign = greaterThanSign;
            }
        }

        return identifierExpression;
    }

    protected parseGlobalScopeExpression(parent: Nodes): GlobalScopeExpression {
        const globalScopeExpression = new GlobalScopeExpression();
        globalScopeExpression.parent = parent;

        return globalScopeExpression;
    }

    protected parseGroupingExpression(parent: Nodes, openingParenthesis: OpeningParenthesisToken): GroupingExpression {
        const groupingExpression = new GroupingExpression();
        groupingExpression.parent = parent;
        groupingExpression.openingParenthesis = openingParenthesis;
        groupingExpression.expression = this.parseExpression(groupingExpression);
        groupingExpression.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);

        return groupingExpression;
    }

    // #endregion

    // #region Postfix expressions

    protected parsePostfixExpression(expression: Expressions) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Period: {
                this.advanceToken();

                return this.parseScopeMemberAccessExpression(expression, token);
            }
            case TokenKind.OpeningSquareBracket: {
                this.advanceToken();

                return this.parseIndexOrSliceExpression(expression, token);
            }
        }

        if (this.isInvokeExpressionStart(token, expression)) {
            return this.parseInvokeExpression(expression);
        }
    }

    protected parseScopeMemberAccessExpression(expression: Expressions, scopeMemberAccessOperator: PeriodToken): ScopeMemberAccessExpression {
        const scopeMemberAccessExpression = new ScopeMemberAccessExpression();
        scopeMemberAccessExpression.parent = expression.parent;
        expression.parent = scopeMemberAccessExpression;
        scopeMemberAccessExpression.scopableExpression = expression;
        scopeMemberAccessExpression.scopeMemberAccessOperator = scopeMemberAccessOperator;
        scopeMemberAccessExpression.member = this.parseUnaryExpressionOrHigher(scopeMemberAccessExpression);

        return scopeMemberAccessExpression;
    }

    protected parseIndexOrSliceExpression(expression: Expressions, openingSquareBracket: OpeningSquareBracketToken) {
        let indexExpressionExpressionOrstartExpression: MissableExpression | undefined = undefined;
        const token = this.getToken();
        if (this.isExpressionStart(token)) {
            indexExpressionExpressionOrstartExpression = this.parseExpression(/*parent*/ undefined!) as Expressions;
        }

        const sliceOperator = this.eatOptional(TokenKind.PeriodPeriod);
        if (!sliceOperator) {
            if (!indexExpressionExpressionOrstartExpression) {
                indexExpressionExpressionOrstartExpression = this.createMissingToken(token.fullStart, TokenKind.Expression);
            }

            return this.parseIndexExpression(expression, openingSquareBracket, indexExpressionExpressionOrstartExpression);
        }

        return this.parseSliceExpression(expression, openingSquareBracket, indexExpressionExpressionOrstartExpression, sliceOperator);
    }

    protected parseIndexExpression(
        expression: Expressions,
        openingSquareBracket: OpeningSquareBracketToken,
        indexExpressionExpression: MissableExpression,
    ): IndexExpression {
        const indexExpression = new IndexExpression();
        indexExpression.parent = expression.parent;
        expression.parent = indexExpression;
        indexExpression.indexableExpression = expression;
        indexExpression.openingSquareBracket = openingSquareBracket;
        indexExpression.indexExpressionExpression = indexExpressionExpression;
        if (indexExpression.indexExpressionExpression.kind !== TokenKind.Missing) {
            indexExpression.indexExpressionExpression.parent = indexExpression;
        }
        indexExpression.closingSquareBracket = this.eatMissable(TokenKind.ClosingSquareBracket);

        return indexExpression;
    }

    protected parseSliceExpression(
        expression: Expressions,
        openingSquareBracket: OpeningSquareBracketToken,
        startExpression: Expressions | undefined,
        sliceOperator: PeriodPeriodToken,
    ): SliceExpression {
        const sliceExpression = new SliceExpression();
        sliceExpression.parent = expression.parent;
        expression.parent = sliceExpression;
        sliceExpression.sliceableExpression = expression;
        sliceExpression.openingSquareBracket = openingSquareBracket;
        sliceExpression.startExpression = startExpression;
        if (sliceExpression.startExpression) {
            sliceExpression.startExpression.parent = sliceExpression;
        }
        sliceExpression.sliceOperator = sliceOperator;
        if (this.isExpressionStart(this.getToken())) {
            sliceExpression.endExpression = this.parseExpression(sliceExpression) as Expressions;
        }
        sliceExpression.closingSquareBracket = this.eatMissable(TokenKind.ClosingSquareBracket);

        return sliceExpression;
    }

    protected abstract isInvokeExpressionStart(token: Tokens, expression: Expressions): boolean;

    protected parseInvokeExpression(expression: Expressions): InvokeExpression {
        const invokeExpression = new InvokeExpression();
        invokeExpression.parent = expression.parent;
        expression.parent = invokeExpression;
        invokeExpression.invokableExpression = expression;
        invokeExpression.openingParenthesis = this.eatOptional(TokenKind.OpeningParenthesis);
        if (invokeExpression.openingParenthesis) {
            invokeExpression.leadingNewlines = this.parseList(ParseContextKind.NewlineList, invokeExpression, /*delimiter*/ null);
        }
        invokeExpression.arguments = this.parseList(ParseContextKind.ExpressionSequence, invokeExpression, TokenKind.Comma, /*allowEmpty*/ true);
        if (invokeExpression.openingParenthesis) {
            invokeExpression.closingParenthesis = this.eatMissable(TokenKind.ClosingParenthesis);
        }

        return invokeExpression;
    }

    // #endregion

    // #endregion

    // #region Newline list

    private isNewlineListTerminator(token: Tokens): boolean {
        return !this.isNewlineListMemberStart(token);
    }

    private isNewlineListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.Newline: {
                return true;
            }
        }

        return false;
    }

    protected parseNewlineListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Newline: {
                this.advanceToken();

                return token;
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #region Type reference sequence

    private isTypeReferenceSequenceTerminator(token: Tokens): boolean {
        return !this.isTypeReferenceSequenceMemberStart(token);
    }

    private isTypeReferenceSequenceMemberStart(token: Tokens): boolean {
        return token.kind === TokenKind.Comma ||
            this.isTypeReferenceStart(token);
    }

    private parseTypeReferenceSequenceMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Comma: {
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        if (this.isTypeReferenceStart(token)) {
            this.advanceToken();

            return this.parseTypeReference(parent, token);
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #region Type reference

    protected isTypeReferenceStart(token: Tokens): token is TypeReferenceIdentifierStartToken | PeriodToken {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt:
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.VoidKeyword:
            case TokenKind.Period: {
                return true;
            }
        }

        return false;
    }

    protected parseMissableTypeReference(parent: Nodes): MissableTypeReference {
        const token = this.getToken();
        if (this.isTypeReferenceStart(token)) {
            this.advanceToken();

            return this.parseTypeReference(parent, token);
        }

        return this.createMissingToken(token.fullStart, NodeKind.TypeReference);
    }

    protected parseTypeReference(parent: Nodes, typeReferenceStart: TypeReferenceIdentifierStartToken | PeriodToken): TypeReference {
        const typeReference = new TypeReference();
        typeReference.parent = parent;

        switch (typeReferenceStart.kind) {
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.VoidKeyword: {
                typeReference.identifier = typeReferenceStart;
                break;
            }
            default: {
                switch (typeReferenceStart.kind) {
                    case TokenKind.Identifier: {
                        const nextToken = this.getToken();
                        if (nextToken.kind === TokenKind.Period) {
                            typeReference.moduleIdentifier = typeReferenceStart;

                            this.advanceToken();
                            typeReference.scopeMemberAccessOperator = nextToken;
                        } else {
                            // Uneat token so it can be fed to identifier.
                            this.position--;
                        }
                        break;
                    }
                    case TokenKind.Period: {
                        typeReference.scopeMemberAccessOperator = typeReferenceStart;
                        break;
                    }
                    default: {
                        // Uneat token so it can be fed to identifier.
                        this.position--;
                        break;
                    }
                }
                typeReference.identifier = this.parseMissableIdentifier(typeReference);

                // Generic type arguments
                typeReference.lessThanSign = this.eatOptional(TokenKind.LessThanSign);
                if (typeReference.lessThanSign) {
                    typeReference.typeArguments = this.parseList(ParseContextKind.TypeReferenceSequence, typeReference, TokenKind.Comma);
                    typeReference.greaterThanSign = this.eatMissable(TokenKind.GreaterThanSign);
                }
                break;
            }
        }

        typeReference.arrayTypeAnnotations = this.parseList(ParseContextKind.ArrayTypeAnnotationList, typeReference, /*delimiter*/ null);

        return typeReference;
    }

    // #endregion

    // #region Array type annotation list

    private isArrayTypeAnnotationListTerminator(token: Tokens): boolean {
        return !this.isArrayTypeAnnotationListMemberStart(token);
    }

    private isArrayTypeAnnotationListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.OpeningSquareBracket: {
                return true;
            }
        }

        return false;
    }

    private parseArrayTypeAnnotationListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.OpeningSquareBracket: {
                this.advanceToken();

                return this.parseArrayTypeAnnotation(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    // #region Array type annotation

    protected parseArrayTypeAnnotation(parent: Nodes, openingSquareBracket: OpeningSquareBracketToken): ArrayTypeAnnotation {
        const arrayTypeAnnotation = new ArrayTypeAnnotation();
        arrayTypeAnnotation.parent = parent;
        arrayTypeAnnotation.openingSquareBracket = openingSquareBracket;
        if (this.isExpressionStart(this.getToken())) {
            arrayTypeAnnotation.expression = this.parseExpression(arrayTypeAnnotation);
        }
        arrayTypeAnnotation.closingSquareBracket = this.eatMissable(TokenKind.ClosingSquareBracket);

        return arrayTypeAnnotation;
    }

    // #endregion

    // #endregion

    // #region Comma separator

    protected parseCommaSeparator(parent: Nodes, separator: CommaToken): CommaSeparator {
        const commaSeparator = new CommaSeparator();
        commaSeparator.parent = parent;
        commaSeparator.separator = separator;
        commaSeparator.newlines = this.parseList(ParseContextKind.NewlineList, commaSeparator, /*delimiter*/ null);

        return commaSeparator;
    }

    // #endregion

    // #region Identifier

    protected parseMissableIdentifier(parent: Nodes): MissableIdentifier {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.CommercialAt: {
                this.advanceToken();

                return this.parseIdentifier(parent, token);
            }
        }

        return this.createMissingToken(token.fullStart, TokenKind.Identifier);
    }

    protected parseIdentifier(
        parent: Nodes,
        identifierStart: CommercialAtToken,
    ): EscapedIdentifier;
    protected parseIdentifier<TIdentifier extends IdentifierExpressionToken>(
        parent: Nodes,
        identifierStart: CommercialAtToken | TIdentifier,
    ): EscapedIdentifier | TIdentifier;
    protected parseIdentifier<TIdentifier extends IdentifierExpressionToken>(
        parent: Nodes,
        identifierStart: CommercialAtToken | TIdentifier,
    ): EscapedIdentifier | TIdentifier {
        if (identifierStart.kind === TokenKind.CommercialAt) {
            return this.parseEscapedIdentifier(parent, identifierStart);
        }

        return identifierStart;
    }

    private parseEscapedIdentifier(parent: Nodes, commercialAt: CommercialAtToken): EscapedIdentifier {
        const escapedIdentifier = new EscapedIdentifier();
        escapedIdentifier.parent = parent;
        escapedIdentifier.commercialAt = commercialAt;
        escapedIdentifier.name = this.eatMissable(
            TokenKind.Identifier,
            TokenKind.ObjectKeyword,
            TokenKind.ThrowableKeyword,
            TokenKind.VoidKeyword,
            TokenKind.StrictKeyword,
            TokenKind.PublicKeyword,
            TokenKind.PrivateKeyword,
            TokenKind.ProtectedKeyword,
            TokenKind.FriendKeyword,
            TokenKind.PropertyKeyword,
            TokenKind.BoolKeyword,
            TokenKind.IntKeyword,
            TokenKind.FloatKeyword,
            TokenKind.StringKeyword,
            TokenKind.ArrayKeyword,
            TokenKind.ModKeyword,
            TokenKind.ContinueKeyword,
            TokenKind.ExitKeyword,
            TokenKind.IncludeKeyword,
            TokenKind.ImportKeyword,
            TokenKind.ModuleKeyword,
            TokenKind.ExternKeyword,
            TokenKind.NewKeyword,
            TokenKind.SelfKeyword,
            TokenKind.SuperKeyword,
            TokenKind.EachInKeyword,
            TokenKind.TrueKeyword,
            TokenKind.FalseKeyword,
            TokenKind.NullKeyword,
            TokenKind.NotKeyword,
            TokenKind.ExtendsKeyword,
            TokenKind.AbstractKeyword,
            TokenKind.FinalKeyword,
            TokenKind.SelectKeyword,
            TokenKind.CaseKeyword,
            TokenKind.DefaultKeyword,
            TokenKind.ConstKeyword,
            TokenKind.LocalKeyword,
            TokenKind.GlobalKeyword,
            TokenKind.FieldKeyword,
            TokenKind.MethodKeyword,
            TokenKind.FunctionKeyword,
            TokenKind.ClassKeyword,
            TokenKind.AndKeyword,
            TokenKind.OrKeyword,
            TokenKind.ShlKeyword,
            TokenKind.ShrKeyword,
            TokenKind.EndKeyword,
            TokenKind.IfKeyword,
            TokenKind.ThenKeyword,
            TokenKind.ElseKeyword,
            TokenKind.ElseIfKeyword,
            TokenKind.EndIfKeyword,
            TokenKind.WhileKeyword,
            TokenKind.WendKeyword,
            TokenKind.RepeatKeyword,
            TokenKind.UntilKeyword,
            TokenKind.ForeverKeyword,
            TokenKind.ForKeyword,
            TokenKind.ToKeyword,
            TokenKind.StepKeyword,
            TokenKind.NextKeyword,
            TokenKind.ReturnKeyword,
            TokenKind.InterfaceKeyword,
            TokenKind.ImplementsKeyword,
            TokenKind.InlineKeyword,
            TokenKind.AliasKeyword,
            TokenKind.TryKeyword,
            TokenKind.CatchKeyword,
            TokenKind.ThrowKeyword,
        );

        return escapedIdentifier;
    }

    // #endregion

    // #region Core

    // #region Parse lists

    protected parseContexts: ParseContext[] = undefined!;

    protected parseList<TParseContext extends ParseContext>(parseContext: TParseContext, parent?: Nodes): ParseContextElementArray<TParseContext>;
    protected parseList<TParseContext extends ParseContext>(parseContext: TParseContext, parent: Nodes, delimiter: null): ParseContextElementSequence<TParseContext>;
    protected parseList<TParseContext extends ParseContext>(parseContext: TParseContext, parent: Nodes, delimiter: TokenKinds, allowEmpty?: boolean): ParseContextElementDelimitedSequence<TParseContext>;
    protected parseList<TParseContext extends ParseContext>(parseContext: TParseContext, parent: Nodes, delimiter?: TokenKinds | null, allowEmpty?: boolean) {
        if (typeof parseContext === 'undefined') {
            throw new Error('parseContext is undefined.');
        }

        this.parseContexts.push(parseContext);

        const nodes: ParseContextElementArrayBase<TParseContext> = [];
        let isLastNodeDelimiter: boolean = false;
        while (true) {
            const token = this.getToken();

            if (this.isListTerminator(parseContext, token)) {
                break;
            }

            if (this.isValidListElement(parseContext, token)) {
                if (delimiter) {
                    const isCurrentNodeDelimiter = token.kind === delimiter;
                    if (nodes.length === 0 ||
                        !isCurrentNodeDelimiter && isLastNodeDelimiter ||
                        allowEmpty ||
                        isCurrentNodeDelimiter && !isLastNodeDelimiter) {
                        isLastNodeDelimiter = isCurrentNodeDelimiter;
                    } else {
                        break;
                    }
                }

                const node = this.parseListElement(parseContext, parent);
                nodes.push(node);

                continue;
            }

            if (this.isValidInEnclosingContexts(token)) {
                break;
            }

            this.advanceToken();
            const skippedToken = this.createSkippedToken(token);
            nodes.push(skippedToken);
        }

        this.parseContexts.pop();

        return nodes;
    }

    protected abstract isListTerminator(parseContext: ParseContext, token: Tokens): boolean;

    protected isListTerminatorCore(parseContext: ParseContextBase, token: Tokens): boolean {
        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case NodeKind.StringLiteralExpression: {
                return this.isStringLiteralExpressionChildListTerminator(token);
            }
            case ParseContextKind.NewlineList: {
                return this.isNewlineListTerminator(token);
            }
            case ParseContextKind.ArrayTypeAnnotationList: {
                return this.isArrayTypeAnnotationListTerminator(token);
            }
            case ParseContextKind.TypeReferenceSequence: {
                return this.isTypeReferenceSequenceTerminator(token);
            }
            case ParseContextKind.ExpressionSequence: {
                return this.isExpressionSequenceTerminator(token);
            }
        }

        return assertNever(parseContext);
    }

    protected abstract isValidListElement(parseContext: ParseContext, token: Tokens): boolean;

    protected isValidListElementCore(parseContext: ParseContextBase, token: Tokens): boolean {
        switch (parseContext) {
            case NodeKind.StringLiteralExpression: {
                return this.isStringLiteralExpressionChildStart(token);
            }
            case ParseContextKind.NewlineList: {
                return this.isNewlineListMemberStart(token);
            }
            case ParseContextKind.ArrayTypeAnnotationList: {
                return this.isArrayTypeAnnotationListMemberStart(token);
            }
            case ParseContextKind.TypeReferenceSequence: {
                return this.isTypeReferenceSequenceMemberStart(token);
            }
            case ParseContextKind.ExpressionSequence: {
                return this.isExpressionSequenceMemberStart(token);
            }
        }

        return assertNever(parseContext);
    }

    protected abstract parseListElement(parseContext: ParseContext, parent: Nodes): ParseContextElementMap[ParseContext];

    protected parseListElementCore(parseContext: ParseContextBase, parent: Nodes) {
        switch (parseContext) {
            case NodeKind.StringLiteralExpression: {
                return this.parseStringLiteralExpressionChild(parent);
            }
            case ParseContextKind.NewlineList: {
                return this.parseNewlineListMember(parent);
            }
            case ParseContextKind.ArrayTypeAnnotationList: {
                return this.parseArrayTypeAnnotationListMember(parent);
            }
            case ParseContextKind.TypeReferenceSequence: {
                return this.parseTypeReferenceSequenceMember(parent);
            }
            case ParseContextKind.ExpressionSequence: {
                return this.parseExpressionSequenceMember(parent);
            }
        }

        return assertNever(parseContext);
    }

    private isValidInEnclosingContexts(token: Tokens): boolean {
        for (let i = this.parseContexts.length - 2; i >= 0; i--) {
            const parseContext = this.parseContexts[i];
            if (this.isValidListElement(parseContext, token) ||
                this.isListTerminator(parseContext, token)) {
                return true;
            }
        }

        return false;
    }

    // #endregion

    protected parseCore(parent: Nodes | undefined, token: Tokens): never {
        const p = parent || {
            kind: undefined,
        };

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)} in ${JSON.stringify(p.kind)}`);
    }

    // #region Tokens

    protected createMissingToken(fullStart: number, originalKind: MissingTokenKinds): MissingToken {
        return new MissingToken(fullStart, originalKind);
    }

    protected createSkippedToken(token: Tokens): SkippedToken {
        return new SkippedToken(token);
    }

    protected eatMissable<TMissableKind extends TokenKinds>(
        kind: TMissableKind,
    ): TokenKindTokenMap[TMissableKind] | MissingToken;
    protected eatMissable<TMissableKind extends TokenKinds, TTokenKind extends TokenKinds>(
        kind: TMissableKind,
        ...kinds: TTokenKind[]
    ): TokenKindTokenMap[TMissableKind | TTokenKind] | MissingToken;
    protected eatMissable<TMissableKind extends TokenKinds, TTokenKind extends TokenKinds>(
        kind: TMissableKind,
        ...kinds: TTokenKind[]
    ): TokenKindTokenMap[TMissableKind | TTokenKind] | MissingToken {
        const token = this.getToken();
        if (kind === token.kind ||
            kinds.includes(token.kind as TTokenKind)) {
            this.advanceToken();

            return token;
        }

        return this.createMissingToken(token.fullStart, kind);
    }

    protected eat<TTokenKind extends TokenKinds>(...kinds: TTokenKind[]): TokenKindTokenMap[TTokenKind] {
        const token = this.getToken();
        if (kinds.includes(token.kind as TTokenKind)) {
            this.advanceToken();

            return token;
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)} not in ${JSON.stringify(kinds)}`);
    }

    protected eatOptional<TTokenKind extends TokenKinds>(...kinds: TTokenKind[]): TokenKindTokenMap[TTokenKind] | undefined {
        const token = this.getToken();
        if (kinds.includes(token.kind as TTokenKind)) {
            this.advanceToken();

            return token;
        }

        return undefined;
    }

    protected getToken(offset: number = 0): Tokens {
        return this.tokens[this.position + offset];
    }

    protected advanceToken(): void {
        if (this.position < this.tokens.length) {
            this.position++;
        }
    }

    // #endregion

    // #endregion
}

// #region Precedence and associativity

enum Precedence {
    Unknown = -1,
    Initial = 0,
    LogicalOr = 1,
    LogicalAnd = 2,
    Assignment = 3,
    EqualityRelational = 4,
    BitwiseOr = 5,
    BitwiseXorBitwiseAnd = 6,
    Additive = 7,
    ShiftMultiplicative = 8,
}

enum Associativity {
    Unknown = -1,
    None = 0,
    Left = 1,
    Right = 2,
}

type PrecedenceAndAssociativity = [Precedence, Associativity];

type PrecedenceAndAssociativityMap = {
    readonly [P in TokenKinds]?: PrecedenceAndAssociativity;
};

const LogicalOrPrecedenceAndAssociativity: PrecedenceAndAssociativity = [Precedence.LogicalOr, Associativity.Left];
const LogicalAndPrecedenceAndAssociativity: PrecedenceAndAssociativity = [Precedence.LogicalAnd, Associativity.Left];
const AssignmentPrecedenceAndAssociativity: PrecedenceAndAssociativity = [Precedence.Assignment, Associativity.Right];
const EqualityRelationalPrecedenceAndAssociativity: PrecedenceAndAssociativity = [Precedence.EqualityRelational, Associativity.None];
const BitwiseOrPrecedenceAndAssociativity: PrecedenceAndAssociativity = [Precedence.BitwiseOr, Associativity.Left];
const BitwiseXorBitwiseAndPrecedenceAndAssociativity: PrecedenceAndAssociativity = [Precedence.BitwiseXorBitwiseAnd, Associativity.Left];
const AdditivePrecedenceAndAssociativity: PrecedenceAndAssociativity = [Precedence.Additive, Associativity.Left];
const ShiftMultiplicativePrecedenceAndAssociativity: PrecedenceAndAssociativity = [Precedence.ShiftMultiplicative, Associativity.Left];
const UnknownPrecedenceAndAssociativity: PrecedenceAndAssociativity = [Precedence.Unknown, Associativity.Unknown];

const OperatorPrecedenceAndAssociativityMap: PrecedenceAndAssociativityMap = {
    [TokenKind.OrKeyword]: LogicalOrPrecedenceAndAssociativity,

    [TokenKind.AndKeyword]: LogicalAndPrecedenceAndAssociativity,

    [TokenKind.VerticalBarEqualsSign]: AssignmentPrecedenceAndAssociativity,
    [TokenKind.TildeEqualsSign]: AssignmentPrecedenceAndAssociativity,
    [TokenKind.AmpersandEqualsSign]: AssignmentPrecedenceAndAssociativity,
    [TokenKind.HyphenMinusEqualsSign]: AssignmentPrecedenceAndAssociativity,
    [TokenKind.PlusSignEqualsSign]: AssignmentPrecedenceAndAssociativity,
    [TokenKind.ModKeywordEqualsSign]: AssignmentPrecedenceAndAssociativity,
    [TokenKind.ShrKeywordEqualsSign]: AssignmentPrecedenceAndAssociativity,
    [TokenKind.ShlKeywordEqualsSign]: AssignmentPrecedenceAndAssociativity,
    [TokenKind.SlashEqualsSign]: AssignmentPrecedenceAndAssociativity,
    [TokenKind.AsteriskEqualsSign]: AssignmentPrecedenceAndAssociativity,

    [TokenKind.LessThanSignGreaterThanSign]: EqualityRelationalPrecedenceAndAssociativity,
    [TokenKind.GreaterThanSignEqualsSign]: EqualityRelationalPrecedenceAndAssociativity,
    [TokenKind.LessThanSignEqualsSign]: EqualityRelationalPrecedenceAndAssociativity,
    [TokenKind.GreaterThanSign]: EqualityRelationalPrecedenceAndAssociativity,
    [TokenKind.LessThanSign]: EqualityRelationalPrecedenceAndAssociativity,

    [TokenKind.VerticalBar]: BitwiseOrPrecedenceAndAssociativity,

    [TokenKind.Tilde]: BitwiseXorBitwiseAndPrecedenceAndAssociativity,
    [TokenKind.Ampersand]: BitwiseXorBitwiseAndPrecedenceAndAssociativity,

    [TokenKind.HyphenMinus]: AdditivePrecedenceAndAssociativity,
    [TokenKind.PlusSign]: AdditivePrecedenceAndAssociativity,

    [TokenKind.ShrKeyword]: ShiftMultiplicativePrecedenceAndAssociativity,
    [TokenKind.ShlKeyword]: ShiftMultiplicativePrecedenceAndAssociativity,
    [TokenKind.ModKeyword]: ShiftMultiplicativePrecedenceAndAssociativity,
    [TokenKind.Slash]: ShiftMultiplicativePrecedenceAndAssociativity,
    [TokenKind.Asterisk]: ShiftMultiplicativePrecedenceAndAssociativity,
};

function getBinaryOperatorPrecedenceAndAssociativity(token: Tokens, parent: Nodes | undefined): PrecedenceAndAssociativity {
    if (token.kind === TokenKind.EqualsSign) {
        return parent && parent.kind === NodeKind.ExpressionStatement ?
            AssignmentPrecedenceAndAssociativity :
            EqualityRelationalPrecedenceAndAssociativity;
    }

    return OperatorPrecedenceAndAssociativityMap[token.kind] ||
        UnknownPrecedenceAndAssociativity;
}

// #endregion

// #region Parse contexts

export enum ParseContextKind {
    NewlineList = 'NewlineList',
    ArrayTypeAnnotationList = 'ArrayTypeAnnotationList',
    TypeReferenceSequence = 'TypeReferenceSequence',
    ExpressionSequence = 'ExpressionSequence',
}

export interface ParseContextElementMapBase {
    [NodeKind.StringLiteralExpression]: ReturnType<ParserBase['parseStringLiteralExpressionChild']>;
    [ParseContextKind.NewlineList]: ReturnType<ParserBase['parseNewlineListMember']>;
    [ParseContextKind.ArrayTypeAnnotationList]: ReturnType<ParserBase['parseArrayTypeAnnotationListMember']>;
    [ParseContextKind.TypeReferenceSequence]: ReturnType<ParserBase['parseTypeReferenceSequenceMember']>;
    [ParseContextKind.ExpressionSequence]: ReturnType<ParserBase['parseExpressionSequenceMember']>;
}

type ParseContextBase = keyof ParseContextElementMapBase;

export interface ParseContextElementMap extends ParseContextElementMapBase { }

export type ParseContext = keyof ParseContextElementMap;

type ParseContextElementArrayBase<TParseContext extends ParseContext> = Array<ParseContextElementMap[TParseContext] | SkippedToken>;
export type ParseContextElementArray<TParseContext extends ParseContext> = Array<ParseContextElementMap[TParseContext] | SkippedToken> & { _arrayBrand: never; };
export type ParseContextElementSequence<TParseContext extends ParseContext> = Array<ParseContextElementMap[TParseContext]> & { _sequenceBrand: never; };
export type ParseContextElementDelimitedSequence<TParseContext extends ParseContext> = Array<ParseContextElementMap[TParseContext]> & { _delimitedSequenceBrand: never; };

// #endregion
