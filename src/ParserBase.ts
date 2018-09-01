import { assertNever } from './assertNever';
import { CommaSeparator } from './Node/CommaSeparator';
import { ArrayLiteral } from './Node/Expression/ArrayLiteral';
import { BinaryExpression } from './Node/Expression/BinaryExpression';
import { BooleanLiteral } from './Node/Expression/BooleanLiteral';
import { Expressions, isMissingToken } from './Node/Expression/Expression';
import { FloatLiteral } from './Node/Expression/FloatLiteral';
import { GroupingExpression } from './Node/Expression/GroupingExpression';
import { IndexExpression } from './Node/Expression/IndexExpression';
import { IntegerLiteral } from './Node/Expression/IntegerLiteral';
import { InvokeExpression } from './Node/Expression/InvokeExpression';
import { NewExpression } from './Node/Expression/NewExpression';
import { NullExpression } from './Node/Expression/NullExpression';
import { ScopeMemberAccessExpression } from './Node/Expression/ScopeMemberAccessExpression';
import { SelfExpression } from './Node/Expression/SelfExpression';
import { StringLiteral } from './Node/Expression/StringLiteral';
import { SuperExpression } from './Node/Expression/SuperExpression';
import { UnaryOpExpression } from './Node/Expression/UnaryOpExpression';
import { Variable } from './Node/Expression/Variable';
import { ModulePath } from './Node/ModulePath';
import { Node } from './Node/Node';
import { ArrayTypeDeclaration, TypeReference } from './Node/TypeReference';
import { GreaterThanSignEqualsSignToken } from './Token/GreaterThanSignEqualsSignToken';
import { MissingToken } from './Token/MissingToken';
import { SkippedToken } from './Token/SkippedToken';
import { Token } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export abstract class ParserBase {
    protected tokens: Token[];
    protected position: number;

    // #region Expressions

    protected parseExpression(parent: Node): Expressions | MissingToken {
        return this.parseBinaryExpression(Precedence.Initial, parent);
    }

    // #region Binary expressions

    protected parseBinaryExpression(precedence: Precedence, parent: Node): Expressions | MissingToken {
        let expression = this.parseUnaryExpression(parent);
        let [prevNewPrecedence, prevAssociativity] = UNKNOWN_PRECEDENCE_AND_ASSOCIATIVITY;

        while (true) {
            let token = this.getToken();

            if (token.kind === TokenKind.GreaterThanSign) {
                const nextToken = this.getToken(1);
                if (nextToken.kind === TokenKind.EqualsSign) {
                    token = new GreaterThanSignEqualsSignToken(token, nextToken);
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
            if (token.kind === TokenKind.GreaterThanSignEqualsSign) {
                this.advanceToken();
            }

            const eachInKeyword = this.eatOptional(TokenKind.EachInKeyword);

            expression = this.makeBinaryExpression(
                expression,
                token,
                eachInKeyword,
                this.parseBinaryExpression(newPrecedence, parent),
                parent
            );

            prevNewPrecedence = newPrecedence;
            prevAssociativity = associativity;
        }

        return expression;
    }

    protected makeBinaryExpression(
        leftOperand: Expressions | MissingToken,
        operator: Token,
        eachInKeyword: Token | null,
        rightOperand: Expressions | MissingToken,
        parent: Node
    ): Expressions {
        const binaryExpression = new BinaryExpression();
        binaryExpression.parent = parent;
        binaryExpression.leftOperand = leftOperand;
        if (!isMissingToken(leftOperand)) {
            leftOperand.parent = binaryExpression;
        }
        binaryExpression.operator = operator;
        binaryExpression.eachInKeyword = eachInKeyword;
        binaryExpression.rightOperand = rightOperand;
        if (!isMissingToken(rightOperand)) {
            rightOperand.parent = binaryExpression;
        }

        return binaryExpression;
    }

    // #region Unary expressions

    protected parseUnaryExpression(parent: Node): Expressions | MissingToken {
        let newlines: Token[] | null = null;
        while (true) {
            const token = this.getToken();
            if (token.kind !== TokenKind.Newline) {
                break;
            }

            if (!newlines) {
                newlines = [];
            }

            this.advanceToken();
            newlines.push(token);
        }

        let expression: Expressions | MissingToken;

        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.PlusSign:
            case TokenKind.HyphenMinus:
            case TokenKind.Tilde:
            case TokenKind.NotKeyword: {
                expression = this.parseUnaryOpExpression(parent);
                break;
            }
            default: {
                expression = this.parsePrimaryExpression(parent);

                // TODO: Is this the best way to go about this?
                let expression2: typeof expression;
                while (true) {
                    expression2 = this.parsePostfixExpression(expression);
                    if (expression2 === expression) {
                        break;
                    }
                    expression = expression2;
                }
                break;
            }
        }

        expression.newlines = newlines;

        return expression;
    }

    protected parseUnaryOpExpression(parent: Node): UnaryOpExpression {
        const unaryOpExpression = new UnaryOpExpression();
        unaryOpExpression.parent = parent;
        unaryOpExpression.operator = this.eat(TokenKind.PlusSign, TokenKind.HyphenMinus, TokenKind.Tilde, TokenKind.NotKeyword);
        unaryOpExpression.operand = this.parseUnaryExpression(unaryOpExpression);

        return unaryOpExpression;
    }

    // #region Primary expressions

    protected parsePrimaryExpression(parent: Node): Expressions | MissingToken {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.NewKeyword: {
                return this.parseNewExpression(parent);
            }
            case TokenKind.NullKeyword: {
                return this.parseNullExpression(parent);
            }
            case TokenKind.TrueKeyword:
            case TokenKind.FalseKeyword: {
                return this.parseBooleanLiteral(parent);
            }
            case TokenKind.SelfKeyword: {
                return this.parseSelfExpression(parent);
            }
            case TokenKind.SuperKeyword: {
                return this.parseSuperExpression(parent);
            }
            case TokenKind.QuotationMark: {
                return this.parseStringLiteral(parent);
            }
            case TokenKind.FloatLiteral: {
                return this.parseFloatLiteral(parent);
            }
            case TokenKind.IntegerLiteral: {
                return this.parseIntegerLiteral(parent);
            }
            case TokenKind.OpeningSquareBracket: {
                return this.parseArrayLiteral(parent);
            }
            case TokenKind.StringKeyword:
            case TokenKind.BoolKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.Identifier: {
                return this.parseVariable(parent);
            }
            case TokenKind.OpeningParenthesis: {
                return this.parseGroupingExpression(parent);
            }
        }

        console.error(`${JSON.stringify(token.kind)} not implemented.`);

        return new MissingToken(TokenKind.Expression, token.fullStart)
    }

    protected parseNewExpression(parent: Node): NewExpression {
        const newExpression = new NewExpression();
        newExpression.parent = parent;
        newExpression.newKeyword = this.eat(TokenKind.NewKeyword);
        newExpression.type = this.parseTypeReference(newExpression);
        newExpression.openingParenthesis = this.eatOptional(TokenKind.OpeningParenthesis);
        newExpression.arguments = this.parseList(newExpression, ParseContextKind.ExpressionSequence);
        newExpression.closingParenthesis = this.eatOptional(TokenKind.ClosingParenthesis);

        return newExpression;
    }

    protected parseNullExpression(parent: Node): NullExpression {
        const nullExpression = new NullExpression();
        nullExpression.parent = parent;
        nullExpression.nullKeyword = this.eat(TokenKind.NullKeyword);

        return nullExpression;
    }

    protected parseBooleanLiteral(parent: Node): BooleanLiteral {
        const booleanLiteral = new BooleanLiteral();
        booleanLiteral.parent = parent;
        booleanLiteral.value = this.eat(TokenKind.TrueKeyword, TokenKind.FalseKeyword);

        return booleanLiteral;
    }

    protected parseSelfExpression(parent: Node): SelfExpression {
        const selfExpression = new SelfExpression();
        selfExpression.parent = parent;
        selfExpression.selfKeyword = this.eat(TokenKind.SelfKeyword);

        return selfExpression;
    }

    protected parseSuperExpression(parent: Node): SuperExpression {
        const superExpression = new SuperExpression();
        superExpression.parent = parent;
        superExpression.superKeyword = this.eat(TokenKind.SuperKeyword);

        return superExpression;
    }

    protected parseStringLiteral(parent: Node): StringLiteral {
        const stringLiteral = new StringLiteral();
        stringLiteral.parent = parent;
        stringLiteral.startQuote = this.eat(TokenKind.QuotationMark);

        let continueParsing = true;
        do {
            const token = this.getToken();
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

    protected parseFloatLiteral(parent: Node): FloatLiteral {
        const floatLiteral = new FloatLiteral();
        floatLiteral.parent = parent;
        floatLiteral.value = this.eat(TokenKind.FloatLiteral);

        return floatLiteral;
    }

    protected parseIntegerLiteral(parent: Node): IntegerLiteral {
        const integerLiteral = new IntegerLiteral();
        integerLiteral.parent = parent;
        integerLiteral.value = this.eat(TokenKind.IntegerLiteral);

        return integerLiteral;
    }

    protected parseArrayLiteral(parent: Node): ArrayLiteral {
        const arrayLiteral = new ArrayLiteral();
        arrayLiteral.parent = parent;
        arrayLiteral.openingSquareBracket = this.eat(TokenKind.OpeningSquareBracket);
        arrayLiteral.expressions = this.parseList(arrayLiteral, ParseContextKind.ExpressionSequence);
        arrayLiteral.closingSquareBracket = this.eat(TokenKind.ClosingSquareBracket);

        return arrayLiteral;
    }

    protected parseVariable(parent: Node): Variable {
        const variable = new Variable();
        variable.parent = parent;
        variable.name = this.eat(
            TokenKind.Identifier,
            TokenKind.StringKeyword,
            TokenKind.BoolKeyword,
            TokenKind.FloatKeyword,
            TokenKind.IntKeyword,
            TokenKind.ObjectKeyword,
            TokenKind.ThrowableKeyword,
        );

        return variable;
    }

    protected parseGroupingExpression(parent: Node): GroupingExpression {
        const groupingExpression = new GroupingExpression();
        groupingExpression.parent = parent;
        groupingExpression.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        groupingExpression.expression = this.parseExpression(groupingExpression);
        groupingExpression.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        return groupingExpression;
    }

    // #region Postfix expressions

    protected parsePostfixExpression(expression: Expressions | MissingToken) {
        if (isMissingToken(expression)) {
            return expression;
        }

        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Period: {
                return this.parseScopeMemberAccessExpression(expression);
            }
            case TokenKind.OpeningSquareBracket: {
                return this.parseIndexExpression(expression);
            }
        }

        if (this.isInvokeExpressionStart(token, expression)) {
            return this.parseInvokeExpression(expression);
        }

        return expression;
    }

    protected parseScopeMemberAccessExpression(expression: Expressions): ScopeMemberAccessExpression {
        const scopeMemberAccessExpression = new ScopeMemberAccessExpression();
        scopeMemberAccessExpression.parent = expression.parent;
        expression.parent = scopeMemberAccessExpression;
        scopeMemberAccessExpression.scopableExpression = expression;
        scopeMemberAccessExpression.scopeMemberAccessOperator = this.eat(TokenKind.Period);
        scopeMemberAccessExpression.identifier = this.eat(TokenKind.Identifier);

        return scopeMemberAccessExpression;
    }

    protected parseIndexExpression(expression: Expressions): IndexExpression {
        const indexExpression = new IndexExpression();
        indexExpression.parent = expression.parent;
        expression.parent = indexExpression;
        indexExpression.indexableExpression = expression;
        indexExpression.openingSquareBracket = this.eat(TokenKind.OpeningSquareBracket);

        if (this.getToken(1).kind === TokenKind.PeriodPeriod) {
            indexExpression.startExpression = this.parseExpression(indexExpression);
        }

        if (this.getToken().kind === TokenKind.PeriodPeriod) {
            indexExpression.sliceOperator = this.eat(TokenKind.PeriodPeriod);

            if (this.getToken().kind !== TokenKind.ClosingSquareBracket) {
                indexExpression.endExpression = this.parseExpression(indexExpression);
            }
        }

        if (indexExpression.sliceOperator === null) {
            indexExpression.indexExpressionExpression = this.parseExpression(indexExpression);
        }

        indexExpression.closingSquareBracket = this.eat(TokenKind.ClosingSquareBracket);

        return indexExpression;
    }

    protected isInvokeExpressionStart(token: Token, expression: Expressions): boolean {
        switch (token.kind) {
            case TokenKind.OpeningParenthesis: {
                return true;
            }
        }

        return this.isExpressionSequenceMemberStart(token);
    }

    protected parseInvokeExpression(expression: Expressions): InvokeExpression {
        const invokeExpression = new InvokeExpression();
        invokeExpression.parent = expression.parent;
        expression.parent = invokeExpression;
        invokeExpression.invokableExpression = expression;
        invokeExpression.openingParenthesis = this.eatOptional(TokenKind.OpeningParenthesis);
        invokeExpression.arguments = this.parseList(invokeExpression, ParseContextKind.ExpressionSequence);
        if (invokeExpression.openingParenthesis !== null) {
            invokeExpression.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);
        }

        return invokeExpression;
    }

    // #endregion

    // #endregion

    // #endregion

    // #endregion

    // #region Expression sequence

    private isExpressionSequenceListTerminator(token: Token): boolean {
        return !this.isExpressionSequenceMemberStart(token);
    }

    private isExpressionSequenceMemberStart(token: Token): boolean {
        return token.kind === TokenKind.Comma ||
            this.isExpressionStart(token);
    }

    private parseExpressionSequenceMember(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Comma: {
                return this.parseCommaSeparator(parent);
            }
        }

        return this.parseExpression(parent);
    }

    // #endregion

    // #endregion

    // #region Type reference sequence

    private isTypeReferenceSequenceTerminator(token: Token): boolean {
        return !this.isTypeReferenceSequenceMemberStart(token);
    }

    private isTypeReferenceSequenceMemberStart(token: Token): boolean {
        return token.kind === TokenKind.Comma ||
            this.isTypeReferenceStart(token);
    }

    private parseTypeReferenceSequenceMember(parent: Node) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier: {
                return this.parseTypeReference(parent);
            }
            case TokenKind.Comma: {
                return this.parseCommaSeparator(parent);
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    // #endregion

    protected parseCommaSeparator(parent: Node): CommaSeparator {
        const commaSeparator = new CommaSeparator();
        commaSeparator.parent = parent;
        commaSeparator.separator = this.eat(TokenKind.Comma);
        let token: Token | null;
        while ((token = this.eatOptional(TokenKind.Newline)) !== null) {
            commaSeparator.newlines.push(token);
        }

        return commaSeparator;
    }

    protected isTypeReferenceStart(token: Token): boolean {
        switch (token.kind) {
            case TokenKind.DollarSign:
            case TokenKind.QuestionMark:
            case TokenKind.NumberSign:
            case TokenKind.PercentSign:
            case TokenKind.StringKeyword:
            case TokenKind.BoolKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.VoidKeyword:
            case TokenKind.Identifier:
            case TokenKind.Period: {
                return true;
            }
        }

        return false;
    }

    protected parseTypeReference(parent: Node): TypeReference {
        const typeReference = new TypeReference();
        typeReference.parent = parent;

        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.DollarSign:
            case TokenKind.QuestionMark:
            case TokenKind.NumberSign:
            case TokenKind.PercentSign:
            case TokenKind.StringKeyword:
            case TokenKind.BoolKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.VoidKeyword: {
                typeReference.identifier = token;
                this.advanceToken();
                break;
            }
            default: {
                // Create a ModulePath only if necessary.
                if (token.kind !== TokenKind.Identifier ||
                    this.getToken(1).kind === TokenKind.Period) {
                    typeReference.modulePath = this.parseModulePath(typeReference);

                    const modulePathChildren = typeReference.modulePath.children;
                    typeReference.identifier = modulePathChildren.pop()!;
                    typeReference.scopeMemberAccessOperator = modulePathChildren.pop()!;
                } else {
                    typeReference.identifier = token;
                    this.advanceToken();
                }

                // Generic type arguments
                typeReference.lessThanSign = this.eatOptional(TokenKind.LessThanSign);
                if (typeReference.lessThanSign !== null) {
                    typeReference.typeArguments = this.parseList(typeReference, ParseContextKind.TypeReferenceSequence);
                    typeReference.greaterThanSign = this.eat(TokenKind.GreaterThanSign);
                }
                break;
            }
        }

        while (this.getToken().kind === TokenKind.OpeningSquareBracket) {
            if (typeReference.arrayTypeDeclarations === null) {
                typeReference.arrayTypeDeclarations = [];
            }

            typeReference.arrayTypeDeclarations.push(this.parseArrayTypeDeclaration(parent));
        }

        return typeReference;
    }

    protected parseModulePath(parent: Node): ModulePath {
        const modulePath = new ModulePath();
        modulePath.parent = parent;

        let lastTokenKind: TokenKind | undefined;
        while (true) {
            const token = this.getToken();
            if (token.kind === TokenKind.Identifier) {
                if (lastTokenKind !== undefined &&
                    lastTokenKind !== TokenKind.Period) {
                    console.error(`Did not expect ${JSON.stringify(token.kind)} to follow ${JSON.stringify(lastTokenKind)}`);
                    break;
                }

                modulePath.children.push(token);
                this.advanceToken();
            } else if (token.kind === TokenKind.Period) {
                if (lastTokenKind !== undefined &&
                    lastTokenKind !== TokenKind.Identifier) {
                    console.error(`Did not expect ${JSON.stringify(token.kind)} to follow ${JSON.stringify(lastTokenKind)}`);
                    break;
                }

                modulePath.children.push(token);
                this.advanceToken();
            } else {
                break;
            }
        }

        return modulePath;
    }

    protected parseArrayTypeDeclaration(parent: Node): ArrayTypeDeclaration {
        const arrayTypeDeclaration = new ArrayTypeDeclaration();
        arrayTypeDeclaration.parent = parent;
        arrayTypeDeclaration.openingSquareBracket = this.eat(TokenKind.OpeningSquareBracket);
        if (this.isExpressionStart(this.getToken())) {
            arrayTypeDeclaration.expression = this.parseExpression(arrayTypeDeclaration);
        }
        arrayTypeDeclaration.closingSquareBracket = this.eat(TokenKind.ClosingSquareBracket);

        return arrayTypeDeclaration;
    }

    protected isExpressionStart(token: Token): boolean {
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
            case TokenKind.Identifier:
            case TokenKind.Period:
            case TokenKind.OpeningParenthesis:
            case TokenKind.OpeningSquareBracket:
            case TokenKind.PlusSign:
            case TokenKind.HyphenMinus:
            case TokenKind.Tilde:
            case TokenKind.NotKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.BoolKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword: {
                return true;
            }
        }

        return false;
    }

    // #region Core

    // #region Parse lists

    protected parseContexts: ParseContext[];

    protected parseList<TParseContext extends ParseContext>(
        parent: Node,
        parseContext: TParseContext
    ) {
        this.parseContexts.push(parseContext);

        const nodes: ParseContextElementArray<TParseContext> = [];
        while (true) {
            const token = this.getToken();

            if (this.isListTerminator(parseContext, token)) {
                break;
            }

            if (this.isValidListElement(parseContext, token)) {
                const element = this.parseListElement(parseContext, parent);
                nodes.push(element);

                continue;
            }

            if (this.isValidInEnclosingContexts(token)) {
                break;
            }

            const skippedToken = new SkippedToken(token);
            nodes.push(skippedToken);
            this.advanceToken();
        }

        this.parseContexts.pop();

        return nodes;
    }

    protected abstract isListTerminator(parseContext: ParseContext, token: Token): boolean;

    protected isListTerminatorCore(parseContext: ParseContextBase, token: Token): boolean {
        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case ParseContextKind.TypeReferenceSequence: {
                return this.isTypeReferenceSequenceTerminator(token);
            }
            case ParseContextKind.ExpressionSequence: {
                return this.isExpressionSequenceListTerminator(token);
            }
        }

        return assertNever(parseContext);
    }

    protected abstract isValidListElement(parseContext: ParseContext, token: Token): boolean;

    protected isValidListElementCore(parseContext: ParseContextBase, token: Token): boolean {
        switch (parseContext) {
            case ParseContextKind.TypeReferenceSequence: {
                return this.isTypeReferenceSequenceMemberStart(token);
            }
            case ParseContextKind.ExpressionSequence: {
                return this.isExpressionSequenceMemberStart(token);
            }
        }

        return assertNever(parseContext);
    }

    protected abstract parseListElement(parseContext: ParseContext, parent: Node): ParseContextElementMap[ParseContext];

    protected parseListElementCore(parseContext: ParseContextBase, parent: Node) {
        switch (parseContext) {
            case ParseContextKind.TypeReferenceSequence: {
                return this.parseTypeReferenceSequenceMember(parent);
            }
            case ParseContextKind.ExpressionSequence: {
                return this.parseExpressionSequenceMember(parent);
            }
        }

        return assertNever(parseContext);
    }

    private isValidInEnclosingContexts(token: Token): boolean {
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

    // #region Tokens

    protected eat(...kinds: TokenKind[]): Token {
        const eaten = this.eatOptional(...kinds);
        if (eaten !== null) {
            return eaten;
        }

        const token = this.getToken();

        return new MissingToken(kinds[0], token.start);
    }

    protected eatOptional(...kinds: TokenKind[]): Token | null {
        const token = this.getToken();
        if (kinds.includes(token.kind)) {
            this.advanceToken();

            return token;
        }

        return null;
    }

    protected getToken(offset: number = 0): Token {
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

// #region Parse contexts

export enum ParseContextKind {
    TypeReferenceSequence = 'TypeReferenceSequence',
    ExpressionSequence = 'Expressions',
}
export interface ParseContextElementMapBase {
    [ParseContextKind.TypeReferenceSequence]: ReturnType<ParserBase['parseTypeReferenceSequenceMember']>;
    [ParseContextKind.ExpressionSequence]: ReturnType<ParserBase['parseExpressionSequenceMember']>;
}

type ParseContextBase = keyof ParseContextElementMapBase;

export interface ParseContextElementMap extends ParseContextElementMapBase {

}

export type ParseContext = keyof ParseContextElementMap;

export type ParseContextElementArray<TParseContext extends ParseContext> = Array<ParseContextElementMap[TParseContext] | SkippedToken>;

// #endregion
