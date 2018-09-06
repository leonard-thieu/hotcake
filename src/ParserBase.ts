import { assertNever } from './assertNever';
import { ArrayTypeDeclaration } from "./Node/ArrayTypeDeclaration";
import { CommaSeparator } from './Node/CommaSeparator';
import { ConfigurationTag } from './Node/ConfigurationTag';
import { ArrayLiteral } from './Node/Expression/ArrayLiteral';
import { AssignmentExpression, AssignmentOperatorToken } from './Node/Expression/AssignmentExpression';
import { BinaryExpression, BinaryExpressionOperatorToken } from './Node/Expression/BinaryExpression';
import { BooleanLiteral } from './Node/Expression/BooleanLiteral';
import { Expressions, isMissingToken } from './Node/Expression/Expression';
import { FloatLiteral } from './Node/Expression/FloatLiteral';
import { GroupingExpression } from './Node/Expression/GroupingExpression';
import { IdentifierExpression } from './Node/Expression/IdentifierExpression';
import { IndexExpression } from './Node/Expression/IndexExpression';
import { IntegerLiteral } from './Node/Expression/IntegerLiteral';
import { InvokeExpression } from './Node/Expression/InvokeExpression';
import { NewExpression } from './Node/Expression/NewExpression';
import { NullExpression } from './Node/Expression/NullExpression';
import { ScopeMemberAccessExpression } from './Node/Expression/ScopeMemberAccessExpression';
import { SelfExpression } from './Node/Expression/SelfExpression';
import { SliceExpression } from './Node/Expression/SliceExpression';
import { StringLiteral } from './Node/Expression/StringLiteral';
import { SuperExpression } from './Node/Expression/SuperExpression';
import { UnaryOpExpression } from './Node/Expression/UnaryOpExpression';
import { ModulePath } from './Node/ModulePath';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { TypeReference } from './Node/TypeReference';
import { GreaterThanSignEqualsSignToken } from './Token/GreaterThanSignEqualsSignToken';
import { MissingToken } from './Token/MissingToken';
import { ModKeywordEqualsSignToken } from './Token/ModKeywordEqualsSignToken';
import { ShlKeywordEqualsSignToken } from './Token/ShlKeywordEqualsSignToken';
import { ShrKeywordEqualsSignToken } from './Token/ShrKeywordEqualsSignToken';
import { SkippedToken } from './Token/SkippedToken';
import { MissingExpressionToken, NewlineToken, TokenKinds, TokenKindTokenMap, Tokens } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export abstract class ParserBase {
    protected tokens: Tokens[];
    protected position: number;

    // #region Expressions

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
                    if (parent && parent.kind === NodeKind.ExpressionStatement) {
                        expression = this.parseAssignmentExpression(parent, expression, token, newPrecedence);
                    } else {
                        expression = this.parseBinaryExpression(parent, expression, token, newPrecedence);
                    }
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
        leftOperand: Expressions | MissingExpressionToken,
        operator: AssignmentOperatorToken,
        newPrecedence: Precedence,
    ) {
        const assignmentExpression = new AssignmentExpression();
        assignmentExpression.parent = parent;
        assignmentExpression.leftOperand = leftOperand;
        if (!isMissingToken(leftOperand)) {
            leftOperand.parent = assignmentExpression;
        }
        assignmentExpression.operator = operator;
        assignmentExpression.eachInKeyword = this.eatOptional(TokenKind.EachInKeyword);
        assignmentExpression.rightOperand = this.parseBinaryExpressionOrHigher(newPrecedence, assignmentExpression);

        return assignmentExpression;
    }

    private parseBinaryExpression(
        parent: Nodes,
        leftOperand: Expressions | MissingExpressionToken,
        operator: BinaryExpressionOperatorToken,
        newPrecedence: Precedence,
    ) {
        const binaryExpression = new BinaryExpression();
        binaryExpression.parent = parent;
        binaryExpression.leftOperand = leftOperand;
        if (!isMissingToken(leftOperand)) {
            leftOperand.parent = binaryExpression;
        }
        binaryExpression.operator = operator;
        binaryExpression.rightOperand = this.parseBinaryExpressionOrHigher(newPrecedence, binaryExpression);

        return binaryExpression;
    }

    // #region Unary expressions

    protected parseUnaryExpressionOrHigher(parent: Nodes): Expressions | MissingExpressionToken {
        let newlines: NewlineToken[] | null = null;
        while (true) {
            const token = this.getToken();
            if (token.kind !== TokenKind.Newline) {
                break;
            }

            if (newlines === null) {
                newlines = [];
            }

            this.advanceToken();
            newlines.push(token);
        }

        let expression: Expressions | MissingExpressionToken;

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

    protected parseUnaryOpExpression(parent: Nodes): UnaryOpExpression {
        const unaryOpExpression = new UnaryOpExpression();
        unaryOpExpression.parent = parent;
        unaryOpExpression.operator = this.eat(TokenKind.PlusSign, TokenKind.HyphenMinus, TokenKind.Tilde, TokenKind.NotKeyword);
        unaryOpExpression.operand = this.parseUnaryExpressionOrHigher(unaryOpExpression);

        return unaryOpExpression;
    }

    // #region Primary expressions

    protected parsePrimaryExpression(parent: Nodes): Expressions | MissingExpressionToken {
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
            case TokenKind.Period:
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.Identifier: {
                return this.parseIdentifierExpression(parent);
            }
            case TokenKind.OpeningParenthesis: {
                return this.parseGroupingExpression(parent);
            }
        }

        console.error(`${JSON.stringify(token.kind)} not implemented.`);

        return this.createMissingExpressionToken(token.fullStart);
    }

    protected parseNewExpression(parent: Nodes): NewExpression {
        const newExpression = new NewExpression();
        newExpression.parent = parent;
        newExpression.newKeyword = this.eat(TokenKind.NewKeyword);
        newExpression.type = this.parseTypeReference(newExpression);

        return newExpression;
    }

    protected parseNullExpression(parent: Nodes): NullExpression {
        const nullExpression = new NullExpression();
        nullExpression.parent = parent;
        nullExpression.nullKeyword = this.eat(TokenKind.NullKeyword);

        return nullExpression;
    }

    protected parseBooleanLiteral(parent: Nodes): BooleanLiteral {
        const booleanLiteral = new BooleanLiteral();
        booleanLiteral.parent = parent;
        booleanLiteral.value = this.eat(TokenKind.TrueKeyword, TokenKind.FalseKeyword);

        return booleanLiteral;
    }

    protected parseSelfExpression(parent: Nodes): SelfExpression {
        const selfExpression = new SelfExpression();
        selfExpression.parent = parent;
        selfExpression.selfKeyword = this.eat(TokenKind.SelfKeyword);

        return selfExpression;
    }

    protected parseSuperExpression(parent: Nodes): SuperExpression {
        const superExpression = new SuperExpression();
        superExpression.parent = parent;
        superExpression.superKeyword = this.eat(TokenKind.SuperKeyword);

        return superExpression;
    }

    protected parseStringLiteral(parent: Nodes): StringLiteral {
        const stringLiteral = new StringLiteral();
        stringLiteral.parent = parent;
        stringLiteral.startQuote = this.eat(TokenKind.QuotationMark);
        stringLiteral.children = this.parseList(stringLiteral, stringLiteral.kind);
        stringLiteral.endQuote = this.eat(TokenKind.QuotationMark);

        return stringLiteral;
    }

    protected parseFloatLiteral(parent: Nodes): FloatLiteral {
        const floatLiteral = new FloatLiteral();
        floatLiteral.parent = parent;
        floatLiteral.value = this.eat(TokenKind.FloatLiteral);

        return floatLiteral;
    }

    protected parseIntegerLiteral(parent: Nodes): IntegerLiteral {
        const integerLiteral = new IntegerLiteral();
        integerLiteral.parent = parent;
        integerLiteral.value = this.eat(TokenKind.IntegerLiteral);

        return integerLiteral;
    }

    protected parseArrayLiteral(parent: Nodes): ArrayLiteral {
        const arrayLiteral = new ArrayLiteral();
        arrayLiteral.parent = parent;
        arrayLiteral.openingSquareBracket = this.eat(TokenKind.OpeningSquareBracket);
        arrayLiteral.expressions = this.parseList(arrayLiteral, ParseContextKind.ExpressionSequence);
        arrayLiteral.closingSquareBracket = this.eat(TokenKind.ClosingSquareBracket);

        return arrayLiteral;
    }

    protected parseIdentifierExpression(parent: Nodes): IdentifierExpression {
        const identifierExpression = new IdentifierExpression();
        identifierExpression.parent = parent;
        identifierExpression.globalScopeMemberAccessOperator = this.eatOptional(TokenKind.Period);
        identifierExpression.name = this.eat(
            TokenKind.BoolKeyword,
            TokenKind.IntKeyword,
            TokenKind.FloatKeyword,
            TokenKind.StringKeyword,
            TokenKind.ObjectKeyword,
            TokenKind.ThrowableKeyword,
            TokenKind.Identifier,
        );

        // Generic type arguments
        const position = this.position;
        const lessThanSign = this.eatOptional(TokenKind.LessThanSign);
        if (lessThanSign !== null) {
            const typeArguments = this.parseList(identifierExpression, ParseContextKind.TypeReferenceSequence);
            const greaterThanSign = this.eatOptional(TokenKind.GreaterThanSign);

            // Couldn't find terminating `>`. That means `<` is part of a binary expression and not the start of generic type arguments.
            if (greaterThanSign === null) {
                this.position = position;
            } else {
                identifierExpression.lessThanSign = lessThanSign;
                identifierExpression.typeArguments = typeArguments;
                identifierExpression.greaterThanSign = greaterThanSign;
            }
        }

        return identifierExpression;
    }

    protected parseGroupingExpression(parent: Nodes): GroupingExpression {
        const groupingExpression = new GroupingExpression();
        groupingExpression.parent = parent;
        groupingExpression.openingParenthesis = this.eat(TokenKind.OpeningParenthesis);
        groupingExpression.expression = this.parseExpression(groupingExpression);
        groupingExpression.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        return groupingExpression;
    }

    private createMissingExpressionToken(fullStart: number): MissingExpressionToken {
        return new MissingToken(TokenKind.Expression, fullStart);
    }

    // #region Postfix expressions

    protected parsePostfixExpression(expression: Expressions | MissingExpressionToken) {
        if (isMissingToken(expression)) {
            return expression;
        }

        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Period: {
                return this.parseScopeMemberAccessExpression(expression);
            }
            case TokenKind.OpeningSquareBracket: {
                return this.parseIndexOrSliceExpression(expression);
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
        scopeMemberAccessExpression.member = this.parseUnaryExpressionOrHigher(scopeMemberAccessExpression);

        return scopeMemberAccessExpression;
    }

    protected parseIndexOrSliceExpression(expression: Expressions) {
        const openingSquareBracket = this.eat(TokenKind.OpeningSquareBracket);

        let indexExpressionExpressionOrstartExpression: Expressions | MissingExpressionToken | null = null;
        if (this.isExpressionStart(this.getToken())) {
            indexExpressionExpressionOrstartExpression = this.parseExpression(null as any);

            if (this.getToken().kind === TokenKind.ClosingSquareBracket) {
                const indexExpression = new IndexExpression();
                indexExpression.parent = expression.parent;
                expression.parent = indexExpression;
                indexExpression.indexableExpression = expression;
                indexExpression.openingSquareBracket = openingSquareBracket;
                indexExpression.indexExpressionExpression = indexExpressionExpressionOrstartExpression;
                indexExpression.closingSquareBracket = this.eat(TokenKind.ClosingSquareBracket);

                return indexExpression;
            }
        }

        const sliceExpression = new SliceExpression();
        sliceExpression.parent = expression.parent;
        expression.parent = sliceExpression;
        sliceExpression.sliceableExpression = expression;
        sliceExpression.openingSquareBracket = openingSquareBracket;
        sliceExpression.startExpression = indexExpressionExpressionOrstartExpression;

        if (this.getToken().kind !== TokenKind.ClosingSquareBracket) {
            sliceExpression.sliceOperator = this.eat(TokenKind.PeriodPeriod);
        }
        if (this.isExpressionStart(this.getToken())) {
            sliceExpression.endExpression = this.parseExpression(sliceExpression);
        }

        sliceExpression.closingSquareBracket = this.eat(TokenKind.ClosingSquareBracket);

        return sliceExpression;
    }

    protected abstract isInvokeExpressionStart(token: Tokens, expression: Expressions): boolean;

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

    private isExpressionSequenceListTerminator(token: Tokens): boolean {
        return !this.isExpressionSequenceMemberStart(token);
    }

    protected isExpressionSequenceMemberStart(token: Tokens): boolean {
        return token.kind === TokenKind.Comma ||
            this.isExpressionStart(token);
    }

    private parseExpressionSequenceMember(parent: Nodes) {
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
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.VoidKeyword:
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

    protected parseCommaSeparator(parent: Nodes): CommaSeparator {
        const commaSeparator = new CommaSeparator();
        commaSeparator.parent = parent;
        commaSeparator.separator = this.eat(TokenKind.Comma);
        let token: typeof commaSeparator.newlines[0] | null;
        while ((token = this.eatOptional(TokenKind.Newline)) !== null) {
            commaSeparator.newlines.push(token);
        }

        return commaSeparator;
    }

    protected isTypeReferenceStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
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

    protected parseTypeReference(parent: Nodes): TypeReference {
        const typeReference = new TypeReference();
        typeReference.parent = parent;

        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
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
                    // TODO: This is type unsafe.
                    typeReference.identifier = modulePathChildren.pop() as typeof typeReference.identifier;
                    typeReference.scopeMemberAccessOperator = modulePathChildren.pop() as typeof typeReference.scopeMemberAccessOperator;
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

            typeReference.arrayTypeDeclarations.push(this.parseArrayTypeDeclaration(typeReference));
        }

        return typeReference;
    }

    protected parseModulePath(parent: Nodes): ModulePath {
        const modulePath = new ModulePath();
        modulePath.parent = parent;

        // TODO: Should probably use parseList and be less strict.
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

    protected parseArrayTypeDeclaration(parent: Nodes): ArrayTypeDeclaration {
        const arrayTypeDeclaration = new ArrayTypeDeclaration();
        arrayTypeDeclaration.parent = parent;
        arrayTypeDeclaration.openingSquareBracket = this.eat(TokenKind.OpeningSquareBracket);
        if (this.isExpressionStart(this.getToken())) {
            arrayTypeDeclaration.expression = this.parseExpression(arrayTypeDeclaration);
        }
        arrayTypeDeclaration.closingSquareBracket = this.eat(TokenKind.ClosingSquareBracket);

        return arrayTypeDeclaration;
    }

    protected isExpressionStart(token: Tokens): boolean {
        switch (token.kind) {
            // TODO: Might need to include Newline?
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

    // #region String literal children

    protected isStringLiteralChildListTerminator(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.QuotationMark: {
                return true;
            }
        }

        return false;
    }

    protected isStringLiteralChildStart(token: Tokens): boolean {
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

    protected parseStringLiteralChild(parent: Nodes) {
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
                return this.parseConfigurationTag(parent);
            }
        }

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)}`);
    }

    protected parseConfigurationTag(parent: Nodes): ConfigurationTag {
        const configurationTag = new ConfigurationTag();
        configurationTag.parent = parent;
        configurationTag.startToken = this.eat(TokenKind.ConfigurationTagStart);
        configurationTag.name = this.eat(TokenKind.Identifier);
        configurationTag.endToken = this.eat(TokenKind.ConfigurationTagEnd);

        return configurationTag;
    }

    // #endregion

    // #region Core

    // #region Parse lists

    protected parseContexts: ParseContext[];

    protected parseList<TParseContext extends ParseContext>(
        parent: Nodes,
        parseContext: TParseContext
    ) {
        if (typeof parseContext === 'undefined') {
            throw new Error('parseContext is undefined.');
        }

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

    protected abstract isListTerminator(parseContext: ParseContext, token: Tokens): boolean;

    protected isListTerminatorCore(parseContext: ParseContextBase, token: Tokens): boolean {
        if (token.kind === TokenKind.EOF) {
            return true;
        }

        switch (parseContext) {
            case NodeKind.StringLiteral: {
                return this.isStringLiteralChildListTerminator(token);
            }
            case ParseContextKind.TypeReferenceSequence: {
                return this.isTypeReferenceSequenceTerminator(token);
            }
            case ParseContextKind.ExpressionSequence: {
                return this.isExpressionSequenceListTerminator(token);
            }
        }

        return assertNever(parseContext);
    }

    protected abstract isValidListElement(parseContext: ParseContext, token: Tokens): boolean;

    protected isValidListElementCore(parseContext: ParseContextBase, token: Tokens): boolean {
        switch (parseContext) {
            case NodeKind.StringLiteral: {
                return this.isStringLiteralChildStart(token);
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
            case NodeKind.StringLiteral: {
                return this.parseStringLiteralChild(parent);
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

    // #region Tokens

    protected eat<TTokenKind extends TokenKinds>(...kinds: TTokenKind[]): TokenKindTokenMap[TTokenKind] {
        const token = this.getToken();
        if (kinds.includes(token.kind as TTokenKind)) {
            this.advanceToken();

            return token;
        }

        // TODO: A bit type unsafe.
        return new MissingToken(kinds[0], token.start) as TokenKindTokenMap[TTokenKind];
    }

    protected eatOptional<TTokenKind extends TokenKinds>(...kinds: TTokenKind[]): TokenKindTokenMap[TTokenKind] | null {
        const token = this.getToken();
        if (kinds.includes(token.kind as TTokenKind)) {
            this.advanceToken();

            return token;
        }

        return null;
    }

    protected getToken(offset: number = 0) {
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

function getBinaryOperatorPrecedenceAndAssociativity(token: Tokens, parent: Nodes | null): PrecedenceAndAssociativity {
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
    TypeReferenceSequence = 'TypeReferenceSequence',
    ExpressionSequence = 'Expressions',
}

export interface ParseContextElementMapBase {
    [NodeKind.StringLiteral]: ReturnType<ParserBase['parseStringLiteralChild']>;
    [ParseContextKind.TypeReferenceSequence]: ReturnType<ParserBase['parseTypeReferenceSequenceMember']>;
    [ParseContextKind.ExpressionSequence]: ReturnType<ParserBase['parseExpressionSequenceMember']>;
}

type ParseContextBase = keyof ParseContextElementMapBase;

export interface ParseContextElementMap extends ParseContextElementMapBase {

}

export type ParseContext = keyof ParseContextElementMap;

export type ParseContextElementArray<TParseContext extends ParseContext> = Array<ParseContextElementMap[TParseContext] | SkippedToken<TokenKinds>>;

// #endregion
