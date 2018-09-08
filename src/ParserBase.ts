import { assertNever } from './assertNever';
import { ArrayTypeDeclaration } from "./Node/ArrayTypeDeclaration";
import { CommaSeparator } from './Node/CommaSeparator';
import { ConfigurationTag } from './Node/ConfigurationTag';
import { ArrayLiteral } from './Node/Expression/ArrayLiteral';
import { AssignmentExpression, AssignmentOperatorToken } from './Node/Expression/AssignmentExpression';
import { BinaryExpression, BinaryExpressionOperatorToken } from './Node/Expression/BinaryExpression';
import { BooleanLiteral, BooleanLiteralValueToken } from './Node/Expression/BooleanLiteral';
import { Expressions, MissableExpression } from './Node/Expression/Expression';
import { FloatLiteral } from './Node/Expression/FloatLiteral';
import { GroupingExpression } from './Node/Expression/GroupingExpression';
import { IdentifierExpression, IdentifierNameToken } from './Node/Expression/IdentifierExpression';
import { IndexExpression } from './Node/Expression/IndexExpression';
import { IntegerLiteral } from './Node/Expression/IntegerLiteral';
import { InvokeExpression } from './Node/Expression/InvokeExpression';
import { NewExpression } from './Node/Expression/NewExpression';
import { NullExpression } from './Node/Expression/NullExpression';
import { ScopeMemberAccessExpression } from './Node/Expression/ScopeMemberAccessExpression';
import { SelfExpression } from './Node/Expression/SelfExpression';
import { SliceExpression } from './Node/Expression/SliceExpression';
import { MissableStringLiteral, StringLiteral } from './Node/Expression/StringLiteral';
import { SuperExpression } from './Node/Expression/SuperExpression';
import { UnaryOperatorToken, UnaryOpExpression } from './Node/Expression/UnaryOpExpression';
import { ModulePath } from './Node/ModulePath';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { TypeReference, TypeReferenceIdentifierToken } from './Node/TypeReference';
import { GreaterThanSignEqualsSignToken } from './Token/GreaterThanSignEqualsSignToken';
import { MissingToken } from './Token/MissingToken';
import { ModKeywordEqualsSignToken } from './Token/ModKeywordEqualsSignToken';
import { ShlKeywordEqualsSignToken } from './Token/ShlKeywordEqualsSignToken';
import { ShrKeywordEqualsSignToken } from './Token/ShrKeywordEqualsSignToken';
import { SkippedToken } from './Token/SkippedToken';
import { CommaToken, ConfigurationTagEndToken, ConfigurationTagStartToken, FloatLiteralToken, IdentifierToken, IntegerLiteralToken, NewKeywordToken, NullKeywordToken, OpeningParenthesisToken, OpeningSquareBracketToken, PeriodPeriodToken, PeriodToken, QuotationMarkToken, SelfKeywordToken, SuperKeywordToken, TokenKinds, TokenKindTokenMap, Tokens } from './Token/Token';
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
    ) {
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
    ) {
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

    // #region Unary expressions

    protected parseUnaryExpressionOrHigher(parent: Nodes): MissableExpression {
        let newlines = this.parseList(null as any, ParseContextKind.NewlineList);

        let expression: MissableExpression;

        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.PlusSign:
            case TokenKind.HyphenMinus:
            case TokenKind.Tilde:
            case TokenKind.NotKeyword: {
                this.advanceToken();

                expression = this.parseUnaryOpExpression(parent, token);
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

    protected parseUnaryOpExpression(parent: Nodes, operator: UnaryOperatorToken): UnaryOpExpression {
        const unaryOpExpression = new UnaryOpExpression();
        unaryOpExpression.parent = parent;
        unaryOpExpression.operator = operator;
        unaryOpExpression.operand = this.parseUnaryExpressionOrHigher(unaryOpExpression);

        return unaryOpExpression;
    }

    // #region Primary expressions

    protected parsePrimaryExpression(parent: Nodes): MissableExpression {
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

                return this.parseBooleanLiteral(parent, token);
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

                return this.parseStringLiteral(parent, token);
            }
            case TokenKind.FloatLiteral: {
                this.advanceToken();

                return this.parseFloatLiteral(parent, token);
            }
            case TokenKind.IntegerLiteral: {
                this.advanceToken();

                return this.parseIntegerLiteral(parent, token);
            }
            case TokenKind.OpeningSquareBracket: {
                this.advanceToken();

                return this.parseArrayLiteral(parent, token);
            }
            case TokenKind.Period:
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.Identifier: {
                this.advanceToken();

                return this.parseIdentifierExpression(parent, token);
            }
            case TokenKind.OpeningParenthesis: {
                this.advanceToken();

                return this.parseGroupingExpression(parent, token);
            }
            case TokenKind.EOF: {
                break;
            }
            default: {
                console.error(`${JSON.stringify(token.kind)} not implemented.`);
                break;
            }
        }

        return new MissingToken(token.fullStart, TokenKind.Expression);
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

    protected parseBooleanLiteral(parent: Nodes, value: BooleanLiteralValueToken): BooleanLiteral {
        const booleanLiteral = new BooleanLiteral();
        booleanLiteral.parent = parent;
        booleanLiteral.value = value;

        return booleanLiteral;
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

    protected parseMissableStringLiteral(parent: Nodes): MissableStringLiteral {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.QuotationMark: {
                this.advanceToken();

                return this.parseStringLiteral(parent, token);
            }
        }

        return new MissingToken(token.fullStart, NodeKind.StringLiteral);
    }

    protected parseStringLiteral(parent: Nodes, startQuotationMark: QuotationMarkToken): StringLiteral {
        const stringLiteral = new StringLiteral();
        stringLiteral.parent = parent;
        stringLiteral.startQuotationMark = startQuotationMark;
        stringLiteral.children = this.parseList(stringLiteral, stringLiteral.kind);
        stringLiteral.endQuotationMark = this.eat(TokenKind.QuotationMark);

        return stringLiteral;
    }

    protected parseFloatLiteral(parent: Nodes, value: FloatLiteralToken): FloatLiteral {
        const floatLiteral = new FloatLiteral();
        floatLiteral.parent = parent;
        floatLiteral.value = value;

        return floatLiteral;
    }

    protected parseIntegerLiteral(parent: Nodes, value: IntegerLiteralToken): IntegerLiteral {
        const integerLiteral = new IntegerLiteral();
        integerLiteral.parent = parent;
        integerLiteral.value = value;

        return integerLiteral;
    }

    protected parseArrayLiteral(parent: Nodes, openingSquareBracket: OpeningSquareBracketToken): ArrayLiteral {
        const arrayLiteral = new ArrayLiteral();
        arrayLiteral.parent = parent;
        arrayLiteral.openingSquareBracket = openingSquareBracket;
        arrayLiteral.expressions = this.parseList(arrayLiteral, ParseContextKind.ExpressionSequence);
        arrayLiteral.closingSquareBracket = this.eat(TokenKind.ClosingSquareBracket);

        return arrayLiteral;
    }

    protected parseIdentifierExpression(parent: Nodes, name: IdentifierNameToken | PeriodToken): IdentifierExpression {
        const identifierExpression = new IdentifierExpression();
        identifierExpression.parent = parent;
        if (name.kind === TokenKind.Period) {
            identifierExpression.globalScopeMemberAccessOperator = name;
            identifierExpression.name = this.eat(
                TokenKind.BoolKeyword,
                TokenKind.IntKeyword,
                TokenKind.FloatKeyword,
                TokenKind.StringKeyword,
                TokenKind.ObjectKeyword,
                TokenKind.ThrowableKeyword,
                TokenKind.Identifier,
            );
        } else {
            identifierExpression.name = name;
        }

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

    protected parseGroupingExpression(parent: Nodes, openingParenthesis: OpeningParenthesisToken): GroupingExpression {
        const groupingExpression = new GroupingExpression();
        groupingExpression.parent = parent;
        groupingExpression.openingParenthesis = openingParenthesis;
        groupingExpression.expression = this.parseExpression(groupingExpression);
        groupingExpression.closingParenthesis = this.eat(TokenKind.ClosingParenthesis);

        return groupingExpression;
    }

    // #region Postfix expressions

    protected parsePostfixExpression(expression: MissableExpression) {
        if (expression.kind === TokenKind.Missing) {
            return expression;
        }

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

        return expression;
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
        let indexExpressionExpressionOrstartExpression: MissableExpression | null = null;
        const token = this.getToken();
        if (this.isExpressionStart(token)) {
            indexExpressionExpressionOrstartExpression = this.parseExpression(null as any) as Expressions;
        }

        const sliceOperator = this.eatOptional(TokenKind.PeriodPeriod);
        if (!sliceOperator) {
            if (!indexExpressionExpressionOrstartExpression) {
                indexExpressionExpressionOrstartExpression = new MissingToken(token.fullStart, TokenKind.Expression);
            }

            return this.parseIndexExpression(expression, openingSquareBracket, indexExpressionExpressionOrstartExpression);
        }

        return this.parseSliceExpression(expression, openingSquareBracket, indexExpressionExpressionOrstartExpression, sliceOperator);
    }

    protected parseIndexExpression(
        expression: Expressions,
        openingSquareBracket: OpeningSquareBracketToken,
        indexExpressionExpression: MissableExpression
    ): IndexExpression {
        const indexExpression = new IndexExpression();
        indexExpression.parent = expression.parent;
        expression.parent = indexExpression;
        indexExpression.indexableExpression = expression;
        indexExpression.openingSquareBracket = openingSquareBracket;
        indexExpression.indexExpressionExpression = indexExpressionExpression;
        indexExpression.closingSquareBracket = this.eat(TokenKind.ClosingSquareBracket);

        return indexExpression;
    }

    protected parseSliceExpression(
        expression: Expressions,
        openingSquareBracket: OpeningSquareBracketToken,
        startExpression: Expressions | null,
        sliceOperator: PeriodPeriodToken
    ): SliceExpression {
        const sliceExpression = new SliceExpression();
        sliceExpression.parent = expression.parent;
        expression.parent = sliceExpression;
        sliceExpression.sliceableExpression = expression;
        sliceExpression.openingSquareBracket = openingSquareBracket;
        sliceExpression.startExpression = startExpression;
        sliceExpression.sliceOperator = sliceOperator;
        if (this.isExpressionStart(this.getToken())) {
            sliceExpression.endExpression = this.parseExpression(sliceExpression) as Expressions;
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
                this.advanceToken();

                return this.parseCommaSeparator(parent, token);
            }
        }

        return this.parseExpression(parent);
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

    protected parseCommaSeparator(parent: Nodes, separator: CommaToken): CommaSeparator {
        const commaSeparator = new CommaSeparator();
        commaSeparator.parent = parent;
        commaSeparator.separator = separator;
        commaSeparator.newlines = this.parseList(commaSeparator, ParseContextKind.NewlineList);

        return commaSeparator;
    }

    protected isTypeReferenceStart(token: Tokens): token is TypeReferenceIdentifierToken | PeriodToken {
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

    protected parseMissableTypeReference(parent: Nodes): TypeReference | MissingToken<NodeKind.TypeReference> {
        const token = this.getToken();
        if (this.isTypeReferenceStart(token)) {
            this.advanceToken();

            return this.parseTypeReference(parent, token);
        }

        return new MissingToken(token.fullStart, NodeKind.TypeReference);
    }

    protected parseTypeReference(parent: Nodes, nameOrModulePathStart: TypeReferenceIdentifierToken | PeriodToken): TypeReference {
        const typeReference = new TypeReference();
        typeReference.parent = parent;

        switch (nameOrModulePathStart.kind) {
            case TokenKind.BoolKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.VoidKeyword: {
                typeReference.name = nameOrModulePathStart;
                break;
            }
            default: {
                if (nameOrModulePathStart.kind === TokenKind.Identifier &&
                    !this.isModulePathChildStart(this.getToken())) {
                    typeReference.name = nameOrModulePathStart;
                } else {
                    typeReference.modulePath = this.parseModulePath(typeReference, nameOrModulePathStart);
                    typeReference.name = typeReference.modulePath.name!;
                    typeReference.scopeMemberAccessOperator = typeReference.modulePath.scopeMemberAccessOperator;
                    this.setModulePathProperties(typeReference.modulePath);
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

        typeReference.arrayTypeDeclarations = this.parseList(typeReference, ParseContextKind.ArrayTypeDeclarationList);

        return typeReference;
    }

    protected parseModulePath(parent: Nodes, firstChild: IdentifierToken | PeriodToken): ModulePath {
        const modulePath = new ModulePath();
        modulePath.parent = parent;
        modulePath.children = this.parseList(modulePath, modulePath.kind);
        modulePath.children.unshift(firstChild);
        this.setModulePathProperties(modulePath);

        return modulePath;
    }

    private setModulePathProperties(modulePath: ModulePath) {
        let lastChild = modulePath.children[modulePath.children.length - 1];
        if (!lastChild) {
            modulePath.name = null;
        } else if (lastChild.kind === TokenKind.Identifier) {
            modulePath.children.pop();
            modulePath.name = lastChild;
        }

        lastChild = modulePath.children[modulePath.children.length - 1];
        if (!lastChild) {
            modulePath.scopeMemberAccessOperator = null;
        } else if (lastChild.kind === TokenKind.Period) {
            modulePath.children.pop();
            modulePath.scopeMemberAccessOperator = lastChild;
        } else {
            modulePath.scopeMemberAccessOperator = new MissingToken(lastChild.fullStart, TokenKind.Period);
        }
    }

    // #region Module path

    private isModulePathTerminator(token: Tokens): boolean {
        return !this.isModulePathChildStart(token);
    }

    protected isModulePathChildStart(token: Tokens): token is IdentifierToken | PeriodToken {
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Period: {
                return true;
            }
        }

        return false;
    }

    protected parseModulePathChild(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.Identifier:
            case TokenKind.Period: {
                this.advanceToken();

                return token;
            }
        }

        return this.parseCore(parent, token);
    }

    // #endregion

    // #region Array type declaration list

    private isArrayTypeDeclarationListTerminator(token: Tokens): boolean {
        return !this.isArrayTypeDeclarationListMemberStart(token);
    }

    private isArrayTypeDeclarationListMemberStart(token: Tokens): boolean {
        switch (token.kind) {
            case TokenKind.OpeningSquareBracket: {
                return true;
            }
        }

        return false;
    }

    private parseArrayTypeDeclarationListMember(parent: Nodes) {
        const token = this.getToken();
        switch (token.kind) {
            case TokenKind.OpeningSquareBracket: {
                this.advanceToken();

                return this.parseArrayTypeDeclaration(parent, token);
            }
        }

        return this.parseCore(parent, token);
    }

    protected parseArrayTypeDeclaration(parent: Nodes, openingSquareBracket: OpeningSquareBracketToken): ArrayTypeDeclaration {
        const arrayTypeDeclaration = new ArrayTypeDeclaration();
        arrayTypeDeclaration.parent = parent;
        arrayTypeDeclaration.openingSquareBracket = openingSquareBracket;
        if (this.isExpressionStart(this.getToken())) {
            arrayTypeDeclaration.expression = this.parseExpression(arrayTypeDeclaration);
        }
        arrayTypeDeclaration.closingSquareBracket = this.eat(TokenKind.ClosingSquareBracket);

        return arrayTypeDeclaration;
    }

    // #endregion

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
        configurationTag.endToken = this.eat(TokenKind.ConfigurationTagEnd) as ConfigurationTagEndToken;

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
            case NodeKind.ModulePath: {
                return this.isModulePathTerminator(token);
            }
            case ParseContextKind.NewlineList: {
                return this.isNewlineListTerminator(token);
            }
            case ParseContextKind.ArrayTypeDeclarationList: {
                return this.isArrayTypeDeclarationListTerminator(token);
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
            case NodeKind.ModulePath: {
                return this.isModulePathChildStart(token);
            }
            case ParseContextKind.NewlineList: {
                return this.isNewlineListMemberStart(token);
            }
            case ParseContextKind.ArrayTypeDeclarationList: {
                return this.isArrayTypeDeclarationListMemberStart(token);
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
            case NodeKind.ModulePath: {
                return this.parseModulePathChild(parent);
            }
            case ParseContextKind.NewlineList: {
                return this.parseNewlineListMember(parent);
            }
            case ParseContextKind.ArrayTypeDeclarationList: {
                return this.parseArrayTypeDeclarationListMember(parent);
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

    protected parseCore(parent: Nodes | null, token: Tokens): never {
        const p = parent || {
            kind: null,
        };

        throw new Error(`Unexpected token: ${JSON.stringify(token.kind)} in ${JSON.stringify(p.kind)}`);
    }

    // #region Tokens

    protected eat<TTokenKind extends TokenKinds>(...kinds: TTokenKind[]): TokenKindTokenMap[TTokenKind] | MissingToken<TTokenKind> {
        const token = this.getToken();
        if (kinds.includes(token.kind as TTokenKind)) {
            this.advanceToken();

            return token;
        }

        return new MissingToken(token.fullStart, kinds[0]);
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
    NewlineList = 'NewlineList',
    ArrayTypeDeclarationList = 'ArrayTypeDeclarationList',
    TypeReferenceSequence = 'TypeReferenceSequence',
    ExpressionSequence = 'ExpressionSequence',
}

export interface ParseContextElementMapBase {
    [NodeKind.StringLiteral]: ReturnType<ParserBase['parseStringLiteralChild']>;
    [NodeKind.ModulePath]: ReturnType<ParserBase['parseModulePathChild']>;
    [ParseContextKind.NewlineList]: ReturnType<ParserBase['parseNewlineListMember']>;
    [ParseContextKind.ArrayTypeDeclarationList]: ReturnType<ParserBase['parseArrayTypeDeclarationListMember']>;
    [ParseContextKind.TypeReferenceSequence]: ReturnType<ParserBase['parseTypeReferenceSequenceMember']>;
    [ParseContextKind.ExpressionSequence]: ReturnType<ParserBase['parseExpressionSequenceMember']>;
}

type ParseContextBase = keyof ParseContextElementMapBase;

export interface ParseContextElementMap extends ParseContextElementMapBase { }

export type ParseContext = keyof ParseContextElementMap;

export type ParseContextElementArray<TParseContext extends ParseContext> = Array<ParseContextElementMap[TParseContext] | SkippedToken<TokenKinds>>;

// #endregion
