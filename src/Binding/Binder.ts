import path = require('path');
import { assertNever, assertType } from '../assertNever';
import { CommaSeparator } from '../Syntax/Node/CommaSeparator';
import { AccessibilityDirective } from '../Syntax/Node/Declaration/AccessibilityDirective';
import { AliasDirectiveSequence } from '../Syntax/Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration } from '../Syntax/Node/Declaration/ClassDeclaration';
import { ClassMethodDeclaration } from '../Syntax/Node/Declaration/ClassMethodDeclaration';
import { DataDeclarationSequence } from '../Syntax/Node/Declaration/DataDeclarationSequence';
import { Declarations } from '../Syntax/Node/Declaration/Declaration';
import { ExternClassDeclaration } from '../Syntax/Node/Declaration/ExternDeclaration/ExternClassDeclaration';
import { ExternDataDeclarationSequence } from '../Syntax/Node/Declaration/ExternDeclaration/ExternDataDeclarationSequence';
import { FunctionDeclaration } from '../Syntax/Node/Declaration/FunctionDeclaration';
import { ImportStatement } from '../Syntax/Node/Declaration/ImportStatement';
import { InterfaceDeclaration } from '../Syntax/Node/Declaration/InterfaceDeclaration';
import { ModuleDeclaration } from '../Syntax/Node/Declaration/ModuleDeclaration';
import { TypeDeclaration } from '../Syntax/Node/Declaration/TypeDeclaration';
import { ArrayLiteralExpression } from '../Syntax/Node/Expression/ArrayLiteralExpression';
import { AssignmentExpression } from '../Syntax/Node/Expression/AssignmentExpression';
import { BinaryExpression } from '../Syntax/Node/Expression/BinaryExpression';
import { MissableExpression } from '../Syntax/Node/Expression/Expression';
import { GlobalScopeExpression } from '../Syntax/Node/Expression/GlobalScopeExpression';
import { GroupingExpression } from '../Syntax/Node/Expression/GroupingExpression';
import { IdentifierExpression } from '../Syntax/Node/Expression/IdentifierExpression';
import { IndexExpression } from '../Syntax/Node/Expression/IndexExpression';
import { InvokeExpression } from '../Syntax/Node/Expression/InvokeExpression';
import { NewExpression } from '../Syntax/Node/Expression/NewExpression';
import { ScopeMemberAccessExpression } from '../Syntax/Node/Expression/ScopeMemberAccessExpression';
import { SelfExpression } from '../Syntax/Node/Expression/SelfExpression';
import { SliceExpression } from '../Syntax/Node/Expression/SliceExpression';
import { SuperExpression } from '../Syntax/Node/Expression/SuperExpression';
import { UnaryExpression } from '../Syntax/Node/Expression/UnaryExpression';
import { NodeKind } from '../Syntax/Node/NodeKind';
import { ContinueStatement } from '../Syntax/Node/Statement/ContinueStatement';
import { EmptyStatement } from '../Syntax/Node/Statement/EmptyStatement';
import { ExitStatement } from '../Syntax/Node/Statement/ExitStatement';
import { ExpressionStatement } from '../Syntax/Node/Statement/ExpressionStatement';
import { ForLoop } from '../Syntax/Node/Statement/ForLoop';
import { ElseIfStatement, ElseStatement, IfStatement } from '../Syntax/Node/Statement/IfStatement';
import { RepeatLoop } from '../Syntax/Node/Statement/RepeatLoop';
import { ReturnStatement } from '../Syntax/Node/Statement/ReturnStatement';
import { CaseStatement, DefaultStatement, SelectStatement } from '../Syntax/Node/Statement/SelectStatement';
import { Statements } from '../Syntax/Node/Statement/Statement';
import { ThrowStatement } from '../Syntax/Node/Statement/ThrowStatement';
import { CatchStatement, TryStatement } from '../Syntax/Node/Statement/TryStatement';
import { WhileLoop } from '../Syntax/Node/Statement/WhileLoop';
import { ParseContextElementDelimitedSequence, ParseContextKind } from '../Syntax/ParserBase';
import { MissingToken } from '../Syntax/Token/MissingToken';
import { SkippedToken } from '../Syntax/Token/SkippedToken';
import { NewlineToken, TokenKinds } from '../Syntax/Token/Token';
import { TokenKind } from '../Syntax/Token/TokenKind';
import { BoundNode } from './Node/BoundNode';
import { BoundNodeKind } from './Node/BoundNodeKind';
import { BoundDataDeclaration } from './Node/Declaration/BoundDataDeclaration';
import { BoundDeclarations } from './Node/Declaration/BoundDeclaration';
import { BoundFunctionDeclaration } from './Node/Declaration/BoundFunctionDeclaration';
import { BoundModuleDeclaration } from './Node/Declaration/BoundModuleDeclaration';
import { BoundBinaryExpression } from './Node/Expression/BoundBinaryExpression';
import { BoundBooleanLiteralExpression } from './Node/Expression/BoundBooleanLiteralExpression';
import { BoundExpression } from './Node/Expression/BoundExpression';
import { BoundFloatLiteralExpression } from './Node/Expression/BoundFloatLiteralExpression';
import { BoundIntegerLiteralExpression } from './Node/Expression/BoundIntegerLiteralExpression';
import { BoundInvokeExpression } from './Node/Expression/BoundInvokeExpression';
import { BoundNullExpression } from './Node/Expression/BoundNullExpression';
import { BoundStringLiteralExpression } from './Node/Expression/BoundStringLiteralExpression';
import { BoundUnaryExpression } from './Node/Expression/BoundUnaryExpression';
import { BoundExpressionStatement } from './Node/Statement/BoundExpressionStatement';
import { BoolType } from './Type/BoolType';
import { FloatType } from './Type/FloatType';
import { IntType } from './Type/IntType';
import { ObjectType } from './Type/ObjectType';
import { StringType } from './Type/StringType';
import { Type } from './Type/Type';
import { TypeKind } from './Type/TypeKind';
import { VoidType } from './Type/VoidType';

export class Binder {
    private document: string = undefined!;

    bind(moduleDeclaration: ModuleDeclaration) {
        this.document = moduleDeclaration.document;

        return this.bindModuleDeclaration(moduleDeclaration);
    }

    private bindModuleDeclaration(moduleDeclaration: ModuleDeclaration): BoundModuleDeclaration {
        const boundModuleDeclaration = new BoundModuleDeclaration();
        boundModuleDeclaration.identifier = this.declareSymbol(moduleDeclaration, boundModuleDeclaration);
        boundModuleDeclaration.locals = new BoundSymbolTable();

        for (const member of moduleDeclaration.headerMembers) {
            switch (member.kind) {
                case NodeKind.FriendDirective: {
                    // Selectively exports symbols.
                    break;
                }
                case NodeKind.AliasDirectiveSequence: {
                    this.bindAliasDirectiveSequence(member);
                    break;
                }
                default: {
                    type ExpectedType =
                        ImportStatement |
                        AccessibilityDirective |
                        NewlineToken |
                        SkippedToken<TokenKinds>
                        ;
                    assertType<ExpectedType>(member);
                    break;
                }
            }
        }

        boundModuleDeclaration.members = this.bindModuleDeclarationMembers(moduleDeclaration, boundModuleDeclaration);

        return boundModuleDeclaration;
    }

    private bindModuleDeclarationMembers(
        moduleDeclaration: ModuleDeclaration,
        parent: BoundModuleDeclaration,
    ) {
        const boundMembers: BoundFunctionDeclaration[] = [];

        for (const member of moduleDeclaration.members) {
            switch (member.kind) {
                case NodeKind.AccessibilityDirective: {
                    // Selectively exports symbols.
                    break;
                }
                case NodeKind.DataDeclarationSequence:
                case NodeKind.ExternDataDeclarationSequence: {
                    this.bindDataDeclarationSequence(member);
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    const boundFunction = this.bindFunctionDeclaration(member, parent);
                    boundMembers.push(boundFunction);
                    break;
                }
                case NodeKind.ExternFunctionDeclaration: {
                    throw new Error('Method not implemented.');
                }
                case NodeKind.InterfaceDeclaration: {
                    this.bindInterfaceDeclaration(member, parent);
                    break;
                }
                case NodeKind.ClassDeclaration:
                case NodeKind.ExternClassDeclaration: {
                    this.bindClassDeclaration(member, parent);
                    break;
                }
                default: {
                    type ExpectedType =
                        NewlineToken |
                        SkippedToken<TokenKinds>
                        ;
                    assertType<ExpectedType>(member);
                    break;
                }
            }
        }

        return boundMembers;
    }

    private bindAliasDirectiveSequence(aliasDirectiveSequence: AliasDirectiveSequence) {
        for (const child of aliasDirectiveSequence.children) {
            switch (child.kind) {
                case NodeKind.AliasDirective: {
                    // TOOD: Bind Alias directive
                    break;
                }
                default: {
                    assertType<CommaSeparator>(child);
                    break;
                }
            }
        }
    }

    private bindInterfaceDeclaration(interfaceDeclaration: InterfaceDeclaration, parent: BoundModuleDeclaration) {
        // TODO: Bind interface declaration

        for (const member of interfaceDeclaration.members) {
            switch (member.kind) {
                case NodeKind.DataDeclarationSequence: {
                    this.bindDataDeclarationSequence(member);
                    break;
                }
                case NodeKind.InterfaceMethodDeclaration: {
                    throw new Error('Method not implemented.');
                }
                default: {
                    type ExpectedType = NewlineToken | SkippedToken<TokenKinds>;
                    assertType<ExpectedType>(member);
                    break;
                }
            }
        }
    }

    private bindClassDeclaration(classDeclaration: ClassDeclaration | ExternClassDeclaration, parent: BoundModuleDeclaration) {
        // TODO: Bind class declaration

        for (const member of classDeclaration.members) {
            switch (member.kind) {
                case NodeKind.DataDeclarationSequence:
                case NodeKind.ExternDataDeclarationSequence: {
                    this.bindDataDeclarationSequence(member);
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    this.bindFunctionDeclaration(member, parent);
                    break;
                }
                case NodeKind.ExternFunctionDeclaration:
                case NodeKind.ClassMethodDeclaration:
                case NodeKind.ExternClassMethodDeclaration: {
                    throw new Error('Method not implemented.');
                }
                case NodeKind.AccessibilityDirective:
                default: {
                    type ExpectedType =
                        AccessibilityDirective |
                        NewlineToken |
                        SkippedToken<TokenKinds>
                        ;
                    assertType<ExpectedType>(member);
                    break;
                }
            }
        }
    }

    private bindFunctionDeclaration(
        functionDeclaration: FunctionDeclaration,
        parent: BoundModuleDeclaration,
    ): BoundFunctionDeclaration {
        const boundFunctionDeclaration = new BoundFunctionDeclaration();
        boundFunctionDeclaration.parent = parent;
        boundFunctionDeclaration.identifier = this.declareSymbol(functionDeclaration, boundFunctionDeclaration);
        boundFunctionDeclaration.locals = new BoundSymbolTable();
        boundFunctionDeclaration.returnType = this.bindTypeReference(functionDeclaration.returnType);
        boundFunctionDeclaration.parameters = this.bindDataDeclarations(functionDeclaration.parameters, boundFunctionDeclaration);
        boundFunctionDeclaration.statements = this.bindStatements(functionDeclaration);

        return boundFunctionDeclaration;
    }

    private bindDataDeclarations(
        parameters: ParseContextElementDelimitedSequence<ParseContextKind.DataDeclarationSequence>,
        parent: BoundFunctionDeclaration,
    ) {
        const boundDataDeclarations: BoundDataDeclaration[] = [];

        for (const parameter of parameters) {
            switch (parameter.kind) {
                case NodeKind.DataDeclaration: {
                    const boundDataDeclaration = new BoundDataDeclaration();
                    boundDataDeclaration.parent = parent;
                    boundDataDeclaration.identifier = this.declareSymbol(parameter, boundDataDeclaration);
                    boundDataDeclaration.type = this.bindTypeReference(parameter.type);

                    boundDataDeclarations.push(boundDataDeclaration);
                    break;
                }
                default: {
                    assertType<CommaSeparator>(parameter);
                    break;
                }
            }
        }

        return boundDataDeclarations;
    }

    private bindStatements(scopedNode: ScopedNode) {
        const boundStatements: BoundExpressionStatement[] = [];

        if (scopedNode.statements) {
            for (const statement of scopedNode.statements) {
                switch (statement.kind) {
                    case TokenKind.Skipped: { break; }
                    default: {
                        const boundStatement = this.bindStatement(statement);
                        if (boundStatement) {
                            boundStatements.push(boundStatement);
                        }
                        break;
                    }
                }
            }
        }

        return boundStatements;
    }

    private bindStatement(statement: Statements) {
        switch (statement.kind) {
            case NodeKind.DataDeclarationSequenceStatement: {
                this.bindDataDeclarationSequence(statement.dataDeclarationSequence);
                break;
            }
            case NodeKind.IfStatement: {
                this.bindIfStatement(statement);
                break;
            }
            case NodeKind.SelectStatement: {
                this.bindSelectStatement(statement);
                break;
            }
            case NodeKind.WhileLoop:
            case NodeKind.RepeatLoop: {
                this.bindStatements(statement);
                break;
            }
            case NodeKind.ForLoop: {
                this.bindForLoop(statement);
                break;
            }
            case NodeKind.TryStatement: {
                this.bindTryStatement(statement);
                break;
            }
            case NodeKind.ExpressionStatement: {
                return this.bindExpressionStatement(statement);
            }
            default: {
                type ExpectedType =
                    ElseIfStatement | ElseStatement |
                    CaseStatement | DefaultStatement |
                    ContinueStatement | ExitStatement |
                    ThrowStatement |
                    CatchStatement |
                    ReturnStatement |
                    EmptyStatement
                    ;
                assertType<ExpectedType>(statement);
                break;
            }
        }
    }

    private bindIfStatement(statement: IfStatement) {
        this.bindStatements(statement);

        if (statement.elseIfStatements) {
            for (const elseifStatement of statement.elseIfStatements) {
                this.bindStatements(elseifStatement);
            }
        }

        if (statement.elseStatement) {
            this.bindStatements(statement.elseStatement);
        }
    }

    private bindSelectStatement(statement: SelectStatement) {
        for (const caseStatement of statement.caseStatements) {
            this.bindStatements(caseStatement);
        }

        if (statement.defaultStatement) {
            this.bindStatements(statement.defaultStatement);
        }
    }

    private bindForLoop(statement: ForLoop) {
        switch (statement.header.kind) {
            case NodeKind.DataDeclarationSequenceStatement: {
                this.bindDataDeclarationSequence(statement.header.dataDeclarationSequence);
                break;
            }
            case NodeKind.NumericForLoopHeader: {
                if (statement.header.loopVariableExpression.kind === NodeKind.DataDeclarationSequenceStatement) {
                    this.bindDataDeclarationSequence(statement.header.loopVariableExpression.dataDeclarationSequence);
                }
                break;
            }
            default: {
                type ExpectedType = AssignmentExpression | MissingToken<TokenKind.ForLoopHeader>;
                assertType<ExpectedType>(statement.header);
                break;
            }
        }
    }

    private bindTryStatement(statement: TryStatement) {
        this.bindStatements(statement);

        if (statement.catchStatements) {
            for (const catchStatement of statement.catchStatements) {
                this.bindCatchStatement(catchStatement);
            }
        }
    }

    private bindCatchStatement(catchStatement: CatchStatement) {
        if (catchStatement.parameter.kind === NodeKind.DataDeclaration) {
            // TODO: Bind catch statement parameter
        }

        this.bindStatements(catchStatement);
    }

    private bindDataDeclarationSequence(dataDeclarationSequence: DataDeclarationSequence | ExternDataDeclarationSequence) {
        for (const child of dataDeclarationSequence.children) {
            switch (child.kind) {
                case NodeKind.DataDeclaration:
                case NodeKind.ExternDataDeclaration: {
                    // TODO: Bind data declarations
                    break;
                }
                default: {
                    assertType<CommaSeparator>(child);
                    break;
                }
            }
        }
    }

    private bindExpressionStatement(statement: ExpressionStatement): BoundExpressionStatement {
        const boundExpressionStatement = new BoundExpressionStatement();
        boundExpressionStatement.expression = this.bindExpression(statement.expression);

        return boundExpressionStatement;
    }

    private bindExpression(expression: MissableExpression): BoundExpression {
        switch (expression.kind) {
            case NodeKind.InvokeExpression: {
                return this.bindInvokeExpression(expression);
            }
            case NodeKind.BinaryExpression: {
                return this.bindBinaryExpression(expression);
            }
            case NodeKind.UnaryExpression: {
                return this.bindUnaryExpression(expression);
            }
            case NodeKind.NullExpression: {
                return this.bindNullExpression();
            }
            case NodeKind.BooleanLiteralExpression: {
                return this.bindBooleanLiteralExpression();
            }
            case NodeKind.IntegerLiteralExpression: {
                return this.bindIntegerLiteralExpression();
            }
            case NodeKind.FloatLiteralExpression: {
                return this.bindFloatLiteralExpression();
            }
            case NodeKind.StringLiteralExpression: {
                return this.bindStringLiteralExpression();
            }
            default: {
                type ExpectedType =
                    NewExpression |
                    SelfExpression |
                    SuperExpression |
                    ArrayLiteralExpression |
                    IdentifierExpression |
                    ScopeMemberAccessExpression |
                    InvokeExpression |
                    IndexExpression |
                    SliceExpression |
                    GroupingExpression |
                    AssignmentExpression |
                    GlobalScopeExpression |
                    MissingToken<TokenKind.Expression>;
                assertType<ExpectedType>(expression);
                throw new Error(`Binding '${expression.kind}' is not implemented.`);
            }
        }
    }

    private bindInvokeExpression(expression: InvokeExpression): BoundInvokeExpression {
        const boundInvokeExpression = new BoundInvokeExpression();
        // TODO: Determine return type of invocation.
        boundInvokeExpression.type = VoidType.type;
        boundInvokeExpression.arguments = this.bindArguments(expression);

        return boundInvokeExpression;
    }

    private bindArguments(expression: InvokeExpression) {
        const boundArguments: BoundExpression[] = [];

        for (const argument of expression.arguments) {
            switch (argument.kind) {
                case NodeKind.CommaSeparator: { break; }
                default: {
                    const boundArgument = this.bindExpression(argument);
                    boundArguments.push(boundArgument);
                    break;
                }
            }
        }

        return boundArguments;
    }

    private bindBinaryExpression(expression: BinaryExpression): BoundBinaryExpression {
        const boundBinaryExpression = new BoundBinaryExpression();
        boundBinaryExpression.leftOperand = this.bindExpression(expression.leftOperand);
        boundBinaryExpression.rightOperand = this.bindExpression(expression.rightOperand);

        const { leftOperand, rightOperand } = boundBinaryExpression;
        const operatorKind = expression.operator.kind;
        switch (operatorKind) {
            // Binary arithmetic operations
            case TokenKind.Asterisk:
            case TokenKind.Slash:
            case TokenKind.ModKeyword:
            case TokenKind.PlusSign:
            case TokenKind.HyphenMinus: {
                let balancedType = this.getBalancedType(leftOperand.type, rightOperand.type);

                switch (balancedType) {
                    case null: {
                        throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
                    }
                    case StringType.type: {
                        if (operatorKind !== TokenKind.PlusSign) {
                            throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
                        }

                        break;
                    }
                    case IntType.type:
                    case FloatType.type: {
                        break;
                    }
                    default: {
                        throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
                    }
                }

                boundBinaryExpression.type = balancedType;
                break;
            }

            // Bitwise operations
            case TokenKind.ShlKeyword:
            case TokenKind.ShrKeyword:
            case TokenKind.Ampersand:
            case TokenKind.Tilde:
            case TokenKind.VerticalBar: {
                if (!leftOperand.type.isConvertibleTo(IntType.type) ||
                    !rightOperand.type.isConvertibleTo(IntType.type)) {
                    throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
                }

                boundBinaryExpression.type = IntType.type;
                break;
            }

            // Comparison operations
            case TokenKind.EqualsSign:
            case TokenKind.LessThanSign:
            case TokenKind.GreaterThanSign:
            case TokenKind.LessThanSignEqualsSign:
            case TokenKind.GreaterThanSignEqualsSign:
            case TokenKind.LessThanSignGreaterThanSign: {
                let balancedType = this.getBalancedType(leftOperand.type, rightOperand.type);
                if (!balancedType) {
                    throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
                }

                switch (balancedType.kind) {
                    case TypeKind.Array: {
                        throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
                    }
                    case TypeKind.Bool:
                    case TypeKind.Object: {
                        if (operatorKind !== TokenKind.EqualsSign &&
                            operatorKind !== TokenKind.LessThanSignGreaterThanSign) {
                            throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
                        }

                        break;
                    }
                }

                boundBinaryExpression.type = BoolType.type;
                break;
            }

            // Conditional operations
            case TokenKind.AndKeyword:
            case TokenKind.OrKeyword: {
                boundBinaryExpression.type = BoolType.type;
                break;
            }

            default: {
                boundBinaryExpression.type = assertNever(operatorKind);
                break;
            }
        }

        return boundBinaryExpression;
    }

    private getBalancedType(leftOperandType: Type, rightOperandType: Type) {
        if (leftOperandType === StringType.type ||
            rightOperandType === StringType.type) {
            return StringType.type;
        }

        if (leftOperandType === FloatType.type ||
            rightOperandType === FloatType.type) {
            return FloatType.type;
        }

        if (leftOperandType === IntType.type ||
            rightOperandType === IntType.type) {
            return IntType.type;
        }

        if (leftOperandType.isConvertibleTo(rightOperandType)) {
            return rightOperandType;
        }

        if (rightOperandType.isConvertibleTo(leftOperandType)) {
            return leftOperandType;
        }

        return null;
    }

    private bindUnaryExpression(expression: UnaryExpression): BoundUnaryExpression {
        const boundUnaryExpression = new BoundUnaryExpression();
        boundUnaryExpression.operand = this.bindExpression(expression.operand);

        const boundOperandType = boundUnaryExpression.operand.type;
        const operatorKind = expression.operator.kind;
        switch (operatorKind) {
            // Unary plus
            case TokenKind.PlusSign:
            // Unary minus
            case TokenKind.HyphenMinus: {
                switch (boundOperandType) {
                    case IntType.type:
                    case FloatType.type: {
                        boundUnaryExpression.type = boundOperandType;
                        break;
                    }
                    default: {
                        throw new Error(`Unexpected operand type '${boundOperandType}' for unary operator '${operatorKind}'.`);
                    }
                }
                break;
            }
            // Bitwise complement
            case TokenKind.Tilde: {
                if (boundUnaryExpression.operand.type.isConvertibleTo(IntType.type)) {
                    boundUnaryExpression.type = IntType.type;
                } else {
                    throw new Error(`Cannot get bitwise complement of '${boundOperandType}'. '${boundOperandType}' is not implicitly convertible to 'Int'.`);
                }
                break;
            }
            // Boolean inverse
            case TokenKind.NotKeyword: {
                boundUnaryExpression.type = BoolType.type;
                break;
            }
            default: {
                boundUnaryExpression.type = assertNever(operatorKind);
                break;
            }
        }

        return boundUnaryExpression;
    }

    private bindNullExpression(): BoundNullExpression {
        return new BoundNullExpression();
    }

    private bindBooleanLiteralExpression(): BoundBooleanLiteralExpression {
        return new BoundBooleanLiteralExpression();
    }

    private bindIntegerLiteralExpression(): BoundIntegerLiteralExpression {
        return new BoundIntegerLiteralExpression();
    }

    private bindFloatLiteralExpression(): BoundFloatLiteralExpression {
        return new BoundFloatLiteralExpression();
    }

    private bindStringLiteralExpression(): BoundStringLiteralExpression {
        return new BoundStringLiteralExpression();
    }

    // #region Core

    private bindTypeReference(typeDeclaration: TypeDeclaration | undefined): Type {
        if (!typeDeclaration) {
            return IntType.type;
        }

        switch (typeDeclaration.kind) {
            case NodeKind.ShorthandTypeDeclaration: {
                const { shorthandType } = typeDeclaration;
                if (shorthandType) {
                    switch (shorthandType.kind) {
                        case TokenKind.QuestionMark: {
                            return BoolType.type;
                        }
                        case TokenKind.NumberSign: {
                            return IntType.type;
                        }
                        case TokenKind.PercentSign: {
                            return FloatType.type;
                        }
                        case TokenKind.DollarSign: {
                            return StringType.type;
                        }
                        default: {
                            return assertNever(shorthandType);
                        }
                    }
                } else {
                    throw new Error('Method not implemented.');
                }
            }
            case NodeKind.LonghandTypeDeclaration: {
                const { typeReference } = typeDeclaration;
                switch (typeReference.kind) {
                    case NodeKind.TypeReference: {
                        const { identifier } = typeReference;
                        switch (identifier.kind) {
                            case TokenKind.BoolKeyword: {
                                return BoolType.type;
                            }
                            case TokenKind.IntKeyword: {
                                return IntType.type;
                            }
                            case TokenKind.FloatKeyword: {
                                return FloatType.type;
                            }
                            case TokenKind.StringKeyword: {
                                return StringType.type;
                            }
                            case TokenKind.ObjectKeyword: {
                                return ObjectType.type;
                            }
                            case TokenKind.VoidKeyword: {
                                return VoidType.type;
                            }
                            case TokenKind.Missing: {
                                throw new Error('Method not implemented.');
                            }
                            default: {
                                throw new Error(`Binding '${identifier.kind}' types is not implemented.`);
                            }
                        }
                    }
                    case TokenKind.Missing: {
                        throw new Error('Method not implemented.');
                    }
                    default: {
                        return assertNever(typeReference);
                    }
                }
            }
            default: {
                return assertNever(typeDeclaration);
            }
        }
    }

    private declareSymbol(declaration: Declarations, boundDeclaration: BoundDeclarations) {
        const name = this.getDeclarationName(declaration);
        const identifier = new BoundSymbol(name, boundDeclaration);

        if (boundDeclaration.kind !== BoundNodeKind.ModuleDeclaration) {
            const parentLocals = boundDeclaration.parent.locals;
            const existingSymbol = parentLocals.get(name);

            if (existingSymbol) {
                throw new Error(`Duplicate symbol '${name}'.`);
            }
            else {
                parentLocals.set(name, identifier);
            }
        }

        return identifier;
    }

    private getDeclarationName(declaration: Declarations) {
        switch (declaration.kind) {
            case NodeKind.ModuleDeclaration: {
                return path.basename(declaration.filePath, path.extname(declaration.filePath));
            }
            case NodeKind.AliasDirective:
            case NodeKind.DataDeclaration:
            case NodeKind.ExternDataDeclaration:
            case NodeKind.FunctionDeclaration:
            case NodeKind.ExternFunctionDeclaration:
            case NodeKind.InterfaceDeclaration:
            case NodeKind.InterfaceMethodDeclaration:
            case NodeKind.ClassDeclaration:
            case NodeKind.ClassMethodDeclaration:
            case NodeKind.ExternClassDeclaration:
            case NodeKind.ExternClassMethodDeclaration: {
                switch (declaration.identifier.kind) {
                    case TokenKind.Missing: { break; }
                    case NodeKind.EscapedIdentifier: {
                        return declaration.identifier.name.getText(this.document);
                    }
                    default: {
                        return declaration.identifier.getText(this.document);
                    }
                }
            }
        }

        throw new Error(`Unexpected declaration: ${JSON.stringify(declaration.kind)}`);
    }

    // #endregion
}

type ScopedNode =
    FunctionDeclaration | ClassMethodDeclaration |
    IfStatement | ElseIfStatement | ElseStatement |
    CaseStatement | DefaultStatement |
    WhileLoop |
    RepeatLoop |
    ForLoop |
    TryStatement | CatchStatement
    ;

export class BoundSymbol {
    constructor(
        public name: string,
        public declaration: BoundNode,
    ) { }

    readonly references: BoundNode[] = [];
}

export class BoundSymbolTable extends Map<string, BoundSymbol> { }
