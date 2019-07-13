import path = require('path');
import { assertNever, assertType } from '../assertNever';
import { CommaSeparator } from '../Syntax/Node/CommaSeparator';
import { AliasDirectiveSequence } from '../Syntax/Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration } from '../Syntax/Node/Declaration/ClassDeclaration';
import { ClassMethodDeclaration } from '../Syntax/Node/Declaration/ClassMethodDeclaration';
import { DataDeclaration, DataDeclarationSequence } from '../Syntax/Node/Declaration/DataDeclarationSequence';
import { Declarations } from '../Syntax/Node/Declaration/Declaration';
import { FunctionDeclaration } from '../Syntax/Node/Declaration/FunctionDeclaration';
import { InterfaceDeclaration } from '../Syntax/Node/Declaration/InterfaceDeclaration';
import { InterfaceMethodDeclaration } from '../Syntax/Node/Declaration/InterfaceMethodDeclaration';
import { ModuleDeclaration } from '../Syntax/Node/Declaration/ModuleDeclaration';
import { BinaryExpression } from '../Syntax/Node/Expression/BinaryExpression';
import { MissableExpression } from '../Syntax/Node/Expression/Expression';
import { IdentifierExpression } from '../Syntax/Node/Expression/IdentifierExpression';
import { InvokeExpression } from '../Syntax/Node/Expression/InvokeExpression';
import { NewExpression } from '../Syntax/Node/Expression/NewExpression';
import { UnaryExpression } from '../Syntax/Node/Expression/UnaryExpression';
import { EscapeOptionalIdentifierNameToken } from '../Syntax/Node/Identifier';
import { NodeKind } from '../Syntax/Node/NodeKind';
import { EmptyStatement } from '../Syntax/Node/Statement/EmptyStatement';
import { ExpressionStatement } from '../Syntax/Node/Statement/ExpressionStatement';
import { ForLoop } from '../Syntax/Node/Statement/ForLoop';
import { ElseIfStatement, ElseStatement, IfStatement } from '../Syntax/Node/Statement/IfStatement';
import { ReturnStatement } from '../Syntax/Node/Statement/ReturnStatement';
import { CaseStatement, DefaultStatement, SelectStatement } from '../Syntax/Node/Statement/SelectStatement';
import { Statements } from '../Syntax/Node/Statement/Statement';
import { StatementsParent } from '../Syntax/Node/Statement/StatementsParent';
import { CatchStatement, TryStatement } from '../Syntax/Node/Statement/TryStatement';
import { ShorthandTypeToken, TypeAnnotation } from '../Syntax/Node/TypeAnnotation';
import { MissableTypeReference } from '../Syntax/Node/TypeReference';
import { ParseContextElementDelimitedSequence, ParseContextKind } from '../Syntax/ParserBase';
import { MissingToken } from '../Syntax/Token/MissingToken';
import { SkippedToken } from '../Syntax/Token/SkippedToken';
import { NewlineToken, TokenKinds } from '../Syntax/Token/Token';
import { TokenKind } from '../Syntax/Token/TokenKind';
import { BoundSymbol, BoundSymbolTable } from './BoundSymbol';
import { BoundNodes } from './Node/BoundNode';
import { BoundNodeKind } from './Node/BoundNodeKind';
import { BoundClassDeclaration, BoundClassDeclarationMember } from './Node/Declaration/BoundClassDeclaration';
import { BoundClassMethodDeclaration } from './Node/Declaration/BoundClassMethodDeclaration';
import { BoundDataDeclaration } from './Node/Declaration/BoundDataDeclaration';
import { BoundDeclarations } from './Node/Declaration/BoundDeclarations';
import { BoundFunctionDeclaration } from './Node/Declaration/BoundFunctionDeclaration';
import { BoundInterfaceDeclaration, BoundInterfaceDeclarationMember } from './Node/Declaration/BoundInterfaceDeclaration';
import { BoundInterfaceMethodDeclaration } from './Node/Declaration/BoundInterfaceMethodDeclaration';
import { BoundModuleDeclaration, BoundModuleDeclarationMember } from './Node/Declaration/BoundModuleDeclaration';
import { BoundBinaryExpression } from './Node/Expression/BoundBinaryExpression';
import { BoundBooleanLiteralExpression } from './Node/Expression/BoundBooleanLiteralExpression';
import { BoundExpression } from './Node/Expression/BoundExpression';
import { BoundFloatLiteralExpression } from './Node/Expression/BoundFloatLiteralExpression';
import { BoundIdentifierExpression } from './Node/Expression/BoundIdentifierExpression';
import { BoundIntegerLiteralExpression } from './Node/Expression/BoundIntegerLiteralExpression';
import { BoundInvokeExpression } from './Node/Expression/BoundInvokeExpression';
import { BoundNewExpression } from './Node/Expression/BoundNewExpression';
import { BoundNullExpression } from './Node/Expression/BoundNullExpression';
import { BoundSelfExpression } from './Node/Expression/BoundSelfExpression';
import { BoundStringLiteralExpression } from './Node/Expression/BoundStringLiteralExpression';
import { BoundUnaryExpression } from './Node/Expression/BoundUnaryExpression';
import { BoundExpressionStatement } from './Node/Statement/BoundExpressionStatement';
import { BoundReturnStatement } from './Node/Statement/BoundReturnStatement';
import { BoundStatements } from './Node/Statement/BoundStatements';
import { ArrayType } from './Type/ArrayType';
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
    private module: BoundModuleDeclaration = undefined!;

    bind(moduleDeclaration: ModuleDeclaration) {
        this.document = moduleDeclaration.document;

        return this.bindModuleDeclaration(moduleDeclaration);
    }

    private bindModuleDeclaration(moduleDeclaration: ModuleDeclaration): BoundModuleDeclaration {
        const boundModuleDeclaration = new BoundModuleDeclaration();
        this.module = boundModuleDeclaration;
        boundModuleDeclaration.identifier = this.declareSymbol(moduleDeclaration, boundModuleDeclaration);
        boundModuleDeclaration.locals = new BoundSymbolTable();

        for (const member of moduleDeclaration.headerMembers) {
            switch (member.kind) {
                case NodeKind.FriendDirective:
                case NodeKind.ImportStatement:
                case NodeKind.AccessibilityDirective: {
                    throw new Error('Method not implemented.');
                }
                case NodeKind.AliasDirectiveSequence: {
                    this.bindAliasDirectiveSequence(member);
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

        boundModuleDeclaration.members = this.bindModuleDeclarationMembers(moduleDeclaration, boundModuleDeclaration);

        return boundModuleDeclaration;
    }

    private bindModuleDeclarationMembers(
        moduleDeclaration: ModuleDeclaration,
        parent: BoundModuleDeclaration,
    ) {
        const boundMembers: BoundModuleDeclarationMember[] = [];

        for (const member of moduleDeclaration.members) {
            switch (member.kind) {
                case NodeKind.AccessibilityDirective:
                case NodeKind.ExternDataDeclarationSequence:
                case NodeKind.ExternFunctionDeclaration:
                case NodeKind.ExternClassDeclaration: {
                    throw new Error('Method not implemented.');
                }
                case NodeKind.DataDeclarationSequence: {
                    const boundDataDeclarationSequence = this.bindDataDeclarationSequence(member, parent);
                    boundMembers.push(...boundDataDeclarationSequence);
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    const boundFunction = this.bindFunctionDeclaration(member, parent);
                    boundMembers.push(boundFunction);
                    break;
                }
                case NodeKind.InterfaceDeclaration: {
                    const boundInterface = this.bindInterfaceDeclaration(member, parent);
                    boundMembers.push(boundInterface);
                    break;
                }
                case NodeKind.ClassDeclaration: {
                    const boundClass = this.bindClassDeclaration(member, parent);
                    boundMembers.push(boundClass);
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

    private bindInterfaceDeclaration(
        interfaceDeclaration: InterfaceDeclaration,
        parent: BoundModuleDeclaration,
    ): BoundInterfaceDeclaration {
        const boundInterfaceDeclaration = new BoundInterfaceDeclaration();
        boundInterfaceDeclaration.parent = parent;
        boundInterfaceDeclaration.identifier = this.declareSymbol(interfaceDeclaration, boundInterfaceDeclaration);
        boundInterfaceDeclaration.type = new ObjectType(boundInterfaceDeclaration);
        if (interfaceDeclaration.baseTypes) {
            boundInterfaceDeclaration.baseTypes = this.bindTypeReferenceSequence(interfaceDeclaration.baseTypes);
        }
        boundInterfaceDeclaration.locals = new BoundSymbolTable();
        boundInterfaceDeclaration.members = this.bindInterfaceDeclarationMembers(interfaceDeclaration, boundInterfaceDeclaration);

        return boundInterfaceDeclaration;
    }

    private bindInterfaceDeclarationMembers(
        interfaceDeclaration: InterfaceDeclaration,
        boundInterfaceDeclaration: BoundInterfaceDeclaration,
    ) {
        const boundMembers: BoundInterfaceDeclarationMember[] = [];

        for (const member of interfaceDeclaration.members) {
            switch (member.kind) {
                case NodeKind.DataDeclarationSequence: {
                    boundMembers.push(...this.bindDataDeclarationSequence(member, boundInterfaceDeclaration));
                    break;
                }
                case NodeKind.InterfaceMethodDeclaration: {
                    const boundInterfaceMethodDeclaration = this.bindInterfaceMethodDeclaration(member, boundInterfaceDeclaration);
                    boundMembers.push(boundInterfaceMethodDeclaration);
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

    private bindInterfaceMethodDeclaration(
        interfaceMethodDeclaration: InterfaceMethodDeclaration,
        parent: BoundInterfaceDeclaration,
    ): BoundInterfaceMethodDeclaration {
        const boundInterfaceMethodDeclaration = new BoundInterfaceMethodDeclaration();
        boundInterfaceMethodDeclaration.parent = parent;
        boundInterfaceMethodDeclaration.identifier = this.declareSymbol(interfaceMethodDeclaration, boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.locals = new BoundSymbolTable();
        boundInterfaceMethodDeclaration.returnType = this.bindTypeAnnotation(interfaceMethodDeclaration.returnType);
        boundInterfaceMethodDeclaration.parameters = this.bindDataDeclarationSequence(interfaceMethodDeclaration.parameters, boundInterfaceMethodDeclaration);

        return boundInterfaceMethodDeclaration;
    }

    private bindClassDeclaration(
        classDeclaration: ClassDeclaration,
        parent: BoundModuleDeclaration,
    ) {
        const boundClassDeclaration = new BoundClassDeclaration();
        boundClassDeclaration.parent = parent;
        boundClassDeclaration.identifier = this.declareSymbol(classDeclaration, boundClassDeclaration);
        boundClassDeclaration.type = new ObjectType(boundClassDeclaration);
        boundClassDeclaration.locals = new BoundSymbolTable();
        if (classDeclaration.baseType &&
            classDeclaration.baseType.kind === NodeKind.TypeReference) {
            boundClassDeclaration.baseType = this.bindTypeReference(classDeclaration.baseType);
        }
        if (classDeclaration.implementedTypes) {
            boundClassDeclaration.implementedTypes = this.bindTypeReferenceSequence(classDeclaration.implementedTypes);
        }
        boundClassDeclaration.members = this.bindClassDeclarationMembers(classDeclaration, boundClassDeclaration);

        return boundClassDeclaration;
    }

    private bindClassDeclarationMembers(
        classDeclaration: ClassDeclaration,
        parent: BoundClassDeclaration,
    ) {
        const boundMembers: BoundClassDeclarationMember[] = [];

        for (const member of classDeclaration.members) {
            switch (member.kind) {
                case NodeKind.DataDeclarationSequence: {
                    const boundDataDeclarationSequence = this.bindDataDeclarationSequence(member, parent);
                    boundMembers.push(...boundDataDeclarationSequence);
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    const boundFunctionDeclaration = this.bindFunctionDeclaration(member, parent);
                    boundMembers.push(boundFunctionDeclaration);
                    break;
                }
                case NodeKind.ClassMethodDeclaration: {
                    const boundClassMethodDeclaration = this.bindClassMethodDeclaration(member, parent);
                    boundMembers.push(boundClassMethodDeclaration);
                    break;
                }
                case NodeKind.AccessibilityDirective: {
                    throw new Error('Method not implemented.');
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

    private bindClassMethodDeclaration(
        classMethodDeclaration: ClassMethodDeclaration,
        parent: BoundClassDeclaration,
    ) {
        const boundClassMethodDeclaration = new BoundClassMethodDeclaration();
        boundClassMethodDeclaration.parent = parent;
        boundClassMethodDeclaration.identifier = this.declareSymbol(classMethodDeclaration, boundClassMethodDeclaration);
        boundClassMethodDeclaration.locals = new BoundSymbolTable();
        boundClassMethodDeclaration.returnType = this.bindTypeAnnotation(classMethodDeclaration.returnType);
        boundClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(classMethodDeclaration.parameters, boundClassMethodDeclaration);
        if (classMethodDeclaration.statements) {
            boundClassMethodDeclaration.statements = this.bindStatements(classMethodDeclaration, boundClassMethodDeclaration);
        }

        return boundClassMethodDeclaration;
    }

    private bindFunctionDeclaration(
        functionDeclaration: FunctionDeclaration,
        parent: BoundNodes,
    ): BoundFunctionDeclaration {
        const boundFunctionDeclaration = new BoundFunctionDeclaration();
        boundFunctionDeclaration.parent = parent;
        boundFunctionDeclaration.identifier = this.declareSymbol(functionDeclaration, boundFunctionDeclaration);
        boundFunctionDeclaration.locals = new BoundSymbolTable();
        boundFunctionDeclaration.returnType = this.bindTypeAnnotation(functionDeclaration.returnType);
        boundFunctionDeclaration.parameters = this.bindDataDeclarationSequence(functionDeclaration.parameters, boundFunctionDeclaration);
        boundFunctionDeclaration.statements = this.bindStatements(functionDeclaration, boundFunctionDeclaration);

        return boundFunctionDeclaration;
    }

    private bindDataDeclarationSequence(
        dataDeclarationSequence: DataDeclarationSequence,
        parent: BoundNodes,
    ): BoundDataDeclaration[] {
        const boundDataDeclarations: BoundDataDeclaration[] = [];

        for (const dataDeclaration of dataDeclarationSequence.children) {
            switch (dataDeclaration.kind) {
                case NodeKind.DataDeclaration: {
                    const boundDataDeclaration = this.bindDataDeclaration(dataDeclaration, parent);
                    boundDataDeclarations.push(boundDataDeclaration);
                    break;
                }
                default: {
                    assertType<CommaSeparator>(dataDeclaration);
                    break;
                }
            }
        }

        return boundDataDeclarations;
    }

    private bindDataDeclaration(
        dataDeclaration: DataDeclaration,
        parent: BoundNodes,
    ) {
        const boundDataDeclaration = new BoundDataDeclaration();
        boundDataDeclaration.parent = parent;
        boundDataDeclaration.identifier = this.declareSymbol(dataDeclaration, boundDataDeclaration);
        boundDataDeclaration.type = this.bindTypeAnnotation(dataDeclaration.type);

        return boundDataDeclaration;
    }

    private bindStatements(
        statementsParent: StatementsParent,
        parent: BoundNodes,
    ) {
        const boundStatements: BoundStatements[] = [];

        if (statementsParent.statements) {
            for (const statement of statementsParent.statements) {
                switch (statement.kind) {
                    case TokenKind.Skipped: { break; }
                    default: {
                        const boundStatement = this.bindStatement(statement, parent);
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

    private bindStatement(
        statement: Statements,
        parent: BoundNodes,
    ) {
        switch (statement.kind) {
            case NodeKind.DataDeclarationSequenceStatement: {
                this.bindDataDeclarationSequence(statement.dataDeclarationSequence, parent);
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
            case NodeKind.ForLoop: {
                this.bindForLoop(statement);
                break;
            }
            case NodeKind.TryStatement: {
                this.bindTryStatement(statement);
                break;
            }
            case NodeKind.ReturnStatement: {
                return this.bindReturnStatement(statement, parent);
            }
            case NodeKind.ExpressionStatement: {
                return this.bindExpressionStatement(statement, parent);
            }
            case NodeKind.WhileLoop:
            case NodeKind.RepeatLoop:
            case NodeKind.ThrowStatement:
            case NodeKind.ReturnStatement:
            case NodeKind.ContinueStatement:
            case NodeKind.ExitStatement: {
                break;
            }
            default: {
                type ExpectedType =
                    ElseIfStatement | ElseStatement |
                    CaseStatement | DefaultStatement |
                    CatchStatement |
                    EmptyStatement
                    ;
                assertType<ExpectedType>(statement);
                break;
            }
        }
    }

    private bindReturnStatement(
        statement: ReturnStatement,
        parent: BoundNodes,
    ) {
        const boundReturnStatement = new BoundReturnStatement();
        boundReturnStatement.parent = parent;
        if (statement.expression) {
            boundReturnStatement.expression = this.bindExpression(statement.expression, boundReturnStatement);
            boundReturnStatement.type = boundReturnStatement.expression.type;
        } else {
            boundReturnStatement.type = VoidType.type;
        }

        const functionOrMethod = this.getNearestAncestor(boundReturnStatement, [
            BoundNodeKind.FunctionDeclaration,
            BoundNodeKind.ClassMethodDeclaration
        ]) as BoundFunctionDeclaration | BoundClassMethodDeclaration;

        if (!boundReturnStatement.type.isConvertibleTo(functionOrMethod.returnType)) {
            throw new Error(`'${boundReturnStatement.type}' is not convertible to '${functionOrMethod.returnType}'.`);
        }

        return boundReturnStatement;
    }

    private bindIfStatement(statement: IfStatement) {
        // this.bindStatements(statement);

        // if (statement.elseIfStatements) {
        //     for (const elseifStatement of statement.elseIfStatements) {
        //         this.bindStatements(elseifStatement);
        //     }
        // }

        // if (statement.elseStatement) {
        //     this.bindStatements(statement.elseStatement);
        // }
    }

    private bindSelectStatement(statement: SelectStatement) {
        // for (const caseStatement of statement.caseStatements) {
        //     this.bindStatements(caseStatement);
        // }

        // if (statement.defaultStatement) {
        //     this.bindStatements(statement.defaultStatement);
        // }
    }

    private bindForLoop(statement: ForLoop) {
        switch (statement.header.kind) {
            case NodeKind.DataDeclarationSequenceStatement: {
                this.bindDataDeclarationSequence(statement.header.dataDeclarationSequence, undefined!);
                break;
            }
            case NodeKind.NumericForLoopHeader: {
                if (statement.header.loopVariableExpression.kind === NodeKind.DataDeclarationSequenceStatement) {
                    this.bindDataDeclarationSequence(statement.header.loopVariableExpression.dataDeclarationSequence, undefined!);
                }
                break;
            }
            case NodeKind.AssignmentExpression: {
                throw new Error('Method not implemented.');
            }
            default: {
                assertType<MissingToken<TokenKind.ForLoopHeader>>(statement.header);
                break;
            }
        }
    }

    private bindTryStatement(statement: TryStatement) {
        // this.bindStatements(statement);

        // if (statement.catchStatements) {
        //     for (const catchStatement of statement.catchStatements) {
        //         this.bindCatchStatement(catchStatement);
        //     }
        // }
    }

    private bindCatchStatement(catchStatement: CatchStatement) {
        // if (catchStatement.parameter.kind === NodeKind.DataDeclaration) {
        //     // TODO: Bind catch statement parameter
        // }

        // this.bindStatements(catchStatement);
    }

    private bindExpressionStatement(
        statement: ExpressionStatement,
        parent: BoundNodes,
    ): BoundExpressionStatement {
        const boundExpressionStatement = new BoundExpressionStatement();
        boundExpressionStatement.parent = parent;
        boundExpressionStatement.expression = this.bindExpression(statement.expression, boundExpressionStatement);

        return boundExpressionStatement;
    }

    private bindExpression(
        expression: MissableExpression,
        parent: BoundNodes,
    ): BoundExpression {
        switch (expression.kind) {
            case NodeKind.InvokeExpression: {
                return this.bindInvokeExpression(expression, parent);
            }
            case NodeKind.BinaryExpression: {
                return this.bindBinaryExpression(expression, parent);
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
            case NodeKind.IdentifierExpression: {
                return this.bindIdentifierExpression(expression, parent);
            }
            case NodeKind.NewExpression: {
                return this.bindNewExpression(expression, parent);
            }
            case NodeKind.SelfExpression: {
                return this.bindSelfExpression(parent);
            }
            case NodeKind.SuperExpression:
            case NodeKind.ArrayLiteralExpression:
            case NodeKind.ScopeMemberAccessExpression:
            case NodeKind.InvokeExpression:
            case NodeKind.IndexExpression:
            case NodeKind.SliceExpression:
            case NodeKind.GroupingExpression:
            case NodeKind.AssignmentExpression:
            case NodeKind.GlobalScopeExpression: {
                throw new Error(`Binding '${expression.kind}' is not implemented.`);
            }
            default: {
                assertType<MissingToken<TokenKind.Expression>>(expression);
                throw new Error('Method not implemented.');
            }
        }
    }

    private bindSelfExpression(parent: BoundNodes) {
        const boundSelfExpression = new BoundSelfExpression();
        boundSelfExpression.parent = parent;

        const ancestor = this.getNearestAncestor(boundSelfExpression, [BoundNodeKind.ClassDeclaration]) as BoundClassDeclaration;
        boundSelfExpression.type = ancestor.type;

        return boundSelfExpression;
    }

    private bindNewExpression(
        expression: NewExpression,
        parent: BoundNodes,
    ) {
        const boundNewExpression = new BoundNewExpression();
        boundNewExpression.type = this.bindTypeReference(expression.type);
        boundNewExpression.parent = parent;

        return boundNewExpression;
    }

    private bindIdentifierExpression(
        identifierExpression: IdentifierExpression,
        parent: BoundNodes,
    ) {
        const boundIdentifierExpression = new BoundIdentifierExpression();
        boundIdentifierExpression.parent = parent;

        const identifier = identifierExpression.identifier;
        switch (identifier.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword: {
                boundIdentifierExpression.identifier = this.getSymbol(identifier, boundIdentifierExpression);

                const declaration = boundIdentifierExpression.identifier.declaration;
                switch (declaration.kind) {
                    case BoundNodeKind.InterfaceDeclaration:
                    case BoundNodeKind.ClassDeclaration:
                    case BoundNodeKind.DataDeclaration: {
                        boundIdentifierExpression.type = declaration.type;
                        break;
                    }
                    default: {
                        type ExpectedType =
                            BoundModuleDeclaration |
                            BoundInterfaceMethodDeclaration |
                            BoundClassMethodDeclaration |
                            BoundFunctionDeclaration
                            ;
                        assertType<ExpectedType>(declaration);
                        break;
                    }
                }

                break;
            }
            case TokenKind.BoolKeyword: {
                boundIdentifierExpression.type = BoolType.type;
                break;
            }
            case TokenKind.IntKeyword: {
                boundIdentifierExpression.type = IntType.type;
                break;
            }
            case TokenKind.FloatKeyword: {
                boundIdentifierExpression.type = FloatType.type;
                break;
            }
            case TokenKind.StringKeyword: {
                boundIdentifierExpression.type = StringType.type;
                break;
            }
            default: {
                identifier;
                break;
            }
        }

        return boundIdentifierExpression;
    }

    private getSymbol(
        identifier: EscapeOptionalIdentifierNameToken,
        boundIdentifierExpression: BoundIdentifierExpression,
    ) {
        let identifierSymbol: BoundSymbol | undefined;

        const identifierText = identifier.getText(this.document);
        let node: any = boundIdentifierExpression.parent;
        while (true) {
            if (node.locals) {
                identifierSymbol = node.locals.get(identifierText);
                if (identifierSymbol) {
                    break;
                }
            }

            if (node.parent) {
                node = node.parent;
            } else {
                throw new Error(`Could not find '${identifierText}'.`);
            }
        }

        return identifierSymbol;
    }

    private bindInvokeExpression(
        expression: InvokeExpression,
        parent: BoundNodes,
    ): BoundInvokeExpression {
        const boundInvokeExpression = new BoundInvokeExpression();
        boundInvokeExpression.parent = parent;
        boundInvokeExpression.invokableExpression = this.bindExpression(expression.invokableExpression, boundInvokeExpression);
        boundInvokeExpression.type = boundInvokeExpression.invokableExpression.type;
        boundInvokeExpression.arguments = this.bindArguments(expression, boundInvokeExpression);

        return boundInvokeExpression;
    }

    private bindArguments(
        expression: InvokeExpression,
        parent: BoundInvokeExpression,
    ) {
        const boundArguments: BoundExpression[] = [];

        for (const argument of expression.arguments) {
            switch (argument.kind) {
                case NodeKind.CommaSeparator: { break; }
                default: {
                    const boundArgument = this.bindExpression(argument, parent);
                    boundArguments.push(boundArgument);
                    break;
                }
            }
        }

        return boundArguments;
    }

    private bindBinaryExpression(
        expression: BinaryExpression,
        parent: BoundNodes,
    ): BoundBinaryExpression {
        const boundBinaryExpression = new BoundBinaryExpression();
        boundBinaryExpression.parent = parent;
        boundBinaryExpression.leftOperand = this.bindExpression(expression.leftOperand, boundBinaryExpression);
        boundBinaryExpression.rightOperand = this.bindExpression(expression.rightOperand, boundBinaryExpression);

        const { leftOperand, rightOperand } = boundBinaryExpression;
        const operatorKind = expression.operator.kind;
        switch (operatorKind) {
            // Binary arithmetic operations
            case TokenKind.Asterisk:
            case TokenKind.Slash:
            case TokenKind.ModKeyword:
            case TokenKind.PlusSign:
            case TokenKind.HyphenMinus: {
                const balancedType = this.getBalancedType(leftOperand.type, rightOperand.type);

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
        boundUnaryExpression.operand = this.bindExpression(expression.operand, boundUnaryExpression);

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

    private bindTypeReferenceSequence(typeReferences: ParseContextElementDelimitedSequence<ParseContextKind.TypeReferenceSequence>) {
        const types: Type[] = [];

        for (const typeReference of typeReferences) {
            switch (typeReference.kind) {
                case NodeKind.TypeReference: {
                    const type = this.bindTypeReference(typeReference);
                    types.push(type);
                    break;
                }
                default: {
                    assertType<CommaSeparator>(typeReference);
                    break;
                }
            }
        }

        return types;
    }

    private bindTypeAnnotation(typeAnnotation: TypeAnnotation | undefined): Type {
        if (!typeAnnotation) {
            return IntType.type;
        }

        switch (typeAnnotation.kind) {
            case NodeKind.ShorthandTypeAnnotation: {
                // TODO: Nested array annotations
                const { arrayTypeAnnotations, shorthandType } = typeAnnotation;
                if (arrayTypeAnnotations.length) {
                    let elementType: Type;
                    if (!shorthandType) {
                        elementType = IntType.type;
                    } else {
                        elementType = this.bindShorthandType(shorthandType);
                    }

                    return new ArrayType(elementType);
                } else {
                    return this.bindShorthandType(shorthandType!);
                }
            }
            case NodeKind.LonghandTypeAnnotation: {
                return this.bindTypeReference(typeAnnotation.typeReference);
            }
            default: {
                return assertNever(typeAnnotation);
            }
        }
    }

    private bindShorthandType(shorthandType: ShorthandTypeToken) {
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
    }

    private bindTypeReference(typeReference: MissableTypeReference) {
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
                    case TokenKind.Identifier: {
                        if (typeReference.moduleIdentifier) {
                            const moduleIdentifierText = typeReference.moduleIdentifier.getText(this.document);
                            const moduleReferenceSymbol = this.module.locals.get(moduleIdentifierText);
                            if (!moduleReferenceSymbol) {
                                throw new Error(`The '${moduleIdentifierText}' module is not imported.`);
                            } else {
                                const moduleDeclaration = moduleReferenceSymbol.declaration;
                                switch (moduleDeclaration.kind) {
                                    case BoundNodeKind.ModuleDeclaration: {
                                        const identifierText = identifier.getText(this.document);
                                        const type = this.bindTypeReferenceFromModule(identifierText, moduleDeclaration);
                                        if (!type) {
                                            throw new Error(`Could not find '${identifierText}' in '${moduleIdentifierText}'.`);
                                        } else {
                                            return type;
                                        }
                                    }
                                    default: {
                                        throw new Error(`'${moduleIdentifierText}' is not a module.`);
                                    }
                                }
                            }
                        } else {
                            const identifierText = identifier.getText(this.document);
                            const type = this.bindTypeReferenceFromModule(identifierText, this.module);
                            if (!type) {
                                for (const [name, node] of this.module.locals) {
                                    const { declaration } = node;
                                    switch (declaration.kind) {
                                        case BoundNodeKind.ModuleDeclaration: {
                                            const type = this.bindTypeReferenceFromModule(identifierText, declaration);
                                            if (type) {
                                                return type;
                                            }
                                            break;
                                        }
                                    }
                                }

                                throw new Error(`Could not find '${identifierText}'.`);
                            } else {
                                return type;
                            }
                        }
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

    private bindTypeReferenceFromModule(identifierText: string, moduleDeclaration: BoundModuleDeclaration) {
        const identifierSymbol = moduleDeclaration.locals.get(identifierText);

        if (!identifierSymbol) {
            return undefined;
        } else {
            const identifierDeclaration = identifierSymbol.declaration;
            switch (identifierDeclaration.kind) {
                case BoundNodeKind.InterfaceDeclaration:
                case BoundNodeKind.ClassDeclaration: {
                    return identifierDeclaration.type;
                }
                default: {
                    throw new Error(`'${identifierText}' is not a class or interface.`);
                }
            }
        }
    }

    private declareSymbol(declaration: Declarations, boundDeclaration: BoundDeclarations) {
        const name = this.getDeclarationName(declaration);
        const identifier = new BoundSymbol(name, boundDeclaration);

        if (boundDeclaration.parent) {
            const parent = boundDeclaration.parent as any;
            const parentLocals = parent.locals;
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

    private getNearestAncestor(node: BoundNodes, kinds: BoundNodeKind[]) {
        let ancestor: BoundNodes | undefined = node;

        do {
            ancestor = ancestor.parent;

            if (!ancestor) {
                throw new Error(`Could not find a matching ancestor.`);
            }
        } while (!kinds.includes(ancestor.kind));

        return ancestor;
    }

    // #endregion
}
