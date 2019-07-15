import path = require('path');
import { assertNever } from '../assertNever';
import { CommaSeparator } from '../Syntax/Node/CommaSeparator';
import { AliasDirectiveSequence } from '../Syntax/Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration } from '../Syntax/Node/Declaration/ClassDeclaration';
import { ClassMethodDeclaration } from '../Syntax/Node/Declaration/ClassMethodDeclaration';
import { DataDeclaration, DataDeclarationKeywordToken, DataDeclarationSequence } from '../Syntax/Node/Declaration/DataDeclarationSequence';
import { Declarations } from '../Syntax/Node/Declaration/Declaration';
import { FunctionDeclaration } from '../Syntax/Node/Declaration/FunctionDeclaration';
import { InterfaceDeclaration } from '../Syntax/Node/Declaration/InterfaceDeclaration';
import { InterfaceMethodDeclaration } from '../Syntax/Node/Declaration/InterfaceMethodDeclaration';
import { ModuleDeclaration } from '../Syntax/Node/Declaration/ModuleDeclaration';
import { ArrayLiteralExpression } from '../Syntax/Node/Expression/ArrayLiteralExpression';
import { AssignmentExpression } from '../Syntax/Node/Expression/AssignmentExpression';
import { BinaryExpression } from '../Syntax/Node/Expression/BinaryExpression';
import { MissableExpression } from '../Syntax/Node/Expression/Expression';
import { GroupingExpression } from '../Syntax/Node/Expression/GroupingExpression';
import { IdentifierExpression } from '../Syntax/Node/Expression/IdentifierExpression';
import { IndexExpression } from '../Syntax/Node/Expression/IndexExpression';
import { InvokeExpression } from '../Syntax/Node/Expression/InvokeExpression';
import { NewExpression } from '../Syntax/Node/Expression/NewExpression';
import { SliceExpression } from '../Syntax/Node/Expression/SliceExpression';
import { UnaryExpression } from '../Syntax/Node/Expression/UnaryExpression';
import { EscapeOptionalIdentifierNameToken } from '../Syntax/Node/Identifier';
import { NodeKind } from '../Syntax/Node/NodeKind';
import { DataDeclarationSequenceStatement } from '../Syntax/Node/Statement/DataDeclarationSequenceStatement';
import { ExpressionStatement } from '../Syntax/Node/Statement/ExpressionStatement';
import { ForLoop } from '../Syntax/Node/Statement/ForLoop';
import { ElseClause, ElseIfClause, IfStatement } from '../Syntax/Node/Statement/IfStatement';
import { RepeatLoop } from '../Syntax/Node/Statement/RepeatLoop';
import { ReturnStatement } from '../Syntax/Node/Statement/ReturnStatement';
import { CaseClause, DefaultClause, SelectStatement } from '../Syntax/Node/Statement/SelectStatement';
import { Statements } from '../Syntax/Node/Statement/Statement';
import { ThrowStatement } from '../Syntax/Node/Statement/ThrowStatement';
import { CatchClause, TryStatement } from '../Syntax/Node/Statement/TryStatement';
import { WhileLoop } from '../Syntax/Node/Statement/WhileLoop';
import { ShorthandTypeToken, TypeAnnotation } from '../Syntax/Node/TypeAnnotation';
import { MissableTypeReference, TypeReference } from '../Syntax/Node/TypeReference';
import { SkippedToken } from '../Syntax/Token/SkippedToken';
import { TokenKinds } from '../Syntax/Token/Token';
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
import { BoundArrayLiteralExpression } from './Node/Expression/BoundArrayLiteralExpression';
import { BoundAssignmentExpression } from './Node/Expression/BoundAssignmentExpression';
import { BoundBinaryExpression } from './Node/Expression/BoundBinaryExpression';
import { BoundBooleanLiteralExpression } from './Node/Expression/BoundBooleanLiteralExpression';
import { BoundExpressions } from './Node/Expression/BoundExpressions';
import { BoundFloatLiteralExpression } from './Node/Expression/BoundFloatLiteralExpression';
import { BoundGroupingExpression } from './Node/Expression/BoundGroupingExpression';
import { BoundIdentifierExpression } from './Node/Expression/BoundIdentifierExpression';
import { BoundIndexExpression } from './Node/Expression/BoundIndexExpression';
import { BoundIntegerLiteralExpression } from './Node/Expression/BoundIntegerLiteralExpression';
import { BoundInvokeExpression } from './Node/Expression/BoundInvokeExpression';
import { BoundNewExpression } from './Node/Expression/BoundNewExpression';
import { BoundNullExpression } from './Node/Expression/BoundNullExpression';
import { BoundSelfExpression } from './Node/Expression/BoundSelfExpression';
import { BoundSliceExpression } from './Node/Expression/BoundSliceExpression';
import { BoundStringLiteralExpression } from './Node/Expression/BoundStringLiteralExpression';
import { BoundSuperExpression } from './Node/Expression/BoundSuperExpression';
import { BoundUnaryExpression } from './Node/Expression/BoundUnaryExpression';
import { BoundContinueStatement } from './Node/Statement/BoundContinueStatement';
import { BoundDataDeclarationStatement } from './Node/Statement/BoundDataDeclarationStatement';
import { BoundExitStatement } from './Node/Statement/BoundExitStatement';
import { BoundExpressionStatement } from './Node/Statement/BoundExpressionStatement';
import { BoundForLoop } from './Node/Statement/BoundForLoop';
import { BoundElseClause, BoundElseIfClause, BoundIfStatement } from './Node/Statement/BoundIfStatement';
import { BoundRepeatLoop } from './Node/Statement/BoundRepeatLoop';
import { BoundReturnStatement } from './Node/Statement/BoundReturnStatement';
import { BoundCaseClause, BoundDefaultClause, BoundSelectStatement } from './Node/Statement/BoundSelectStatement';
import { BoundStatements } from './Node/Statement/BoundStatements';
import { BoundThrowStatement } from './Node/Statement/BoundThrowStatement';
import { BoundCatchClause, BoundTryStatement } from './Node/Statement/BoundTryStatement';
import { BoundWhileLoop } from './Node/Statement/BoundWhileLoop';
import { ArrayType } from './Type/ArrayType';
import { BoolType } from './Type/BoolType';
import { FloatType } from './Type/FloatType';
import { IntType } from './Type/IntType';
import { ObjectType } from './Type/ObjectType';
import { StringType } from './Type/StringType';
import { TypeKind } from './Type/TypeKind';
import { Types } from './Type/Types';
import { VoidType } from './Type/VoidType';

export class Binder {
    private document: string = undefined!;
    private module: BoundModuleDeclaration = undefined!;

    bind(moduleDeclaration: ModuleDeclaration): BoundModuleDeclaration {
        this.document = moduleDeclaration.document;

        return this.bindModuleDeclaration(moduleDeclaration);
    }

    // #region Declarations

    // #region Module declaration

    private bindModuleDeclaration(moduleDeclaration: ModuleDeclaration): BoundModuleDeclaration {
        const boundModuleDeclaration = new BoundModuleDeclaration();
        this.module = boundModuleDeclaration;
        boundModuleDeclaration.identifier = this.declareSymbol(moduleDeclaration, boundModuleDeclaration);
        boundModuleDeclaration.locals = new BoundSymbolTable();

        for (const member of moduleDeclaration.headerMembers) {
            switch (member.kind) {
                case NodeKind.ImportStatement:
                case NodeKind.FriendDirective:
                case NodeKind.AccessibilityDirective: {
                    throw new Error('Method not implemented.');
                }
                case NodeKind.AliasDirectiveSequence: {
                    this.bindAliasDirectiveSequence(member);
                    break;
                }
                case TokenKind.Newline:
                case TokenKind.Skipped: {
                    break;
                }
                default: {
                    assertNever(member);
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
    ): BoundModuleDeclarationMember[] {
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
                case TokenKind.Newline:
                case TokenKind.Skipped: {
                    break;
                }
                default: {
                    assertNever(member);
                    break;
                }
            }
        }

        return boundMembers;
    }

    // #endregion

    // #region Alias directive sequence

    private bindAliasDirectiveSequence(aliasDirectiveSequence: AliasDirectiveSequence) {
        for (const child of aliasDirectiveSequence.children) {
            switch (child.kind) {
                case NodeKind.AliasDirective: {
                    // TOOD: Bind Alias directive
                    break;
                }
                case NodeKind.CommaSeparator: { break; }
                default: {
                    assertNever(child);
                    break;
                }
            }
        }
    }

    // #endregion

    // #region Data declaration sequence

    private bindDataDeclarationSequence(
        dataDeclarationSequence: DataDeclarationSequence,
        parent: BoundNodes,
    ): BoundDataDeclaration[] {
        const boundDataDeclarations: BoundDataDeclaration[] = [];

        for (const dataDeclaration of dataDeclarationSequence.children) {
            switch (dataDeclaration.kind) {
                case NodeKind.DataDeclaration: {
                    const boundDataDeclaration = this.bindDataDeclaration(dataDeclaration, parent, dataDeclarationSequence.dataDeclarationKeyword);
                    boundDataDeclarations.push(boundDataDeclaration);
                    break;
                }
                case NodeKind.CommaSeparator: { break; }
                default: {
                    assertNever(dataDeclaration);
                    break;
                }
            }
        }

        return boundDataDeclarations;
    }

    // #region Data declaration

    private bindDataDeclaration(
        dataDeclaration: DataDeclaration,
        parent: BoundNodes,
        dataDeclarationKeyword?: DataDeclarationKeywordToken,
    ): BoundDataDeclaration {
        const boundDataDeclaration = new BoundDataDeclaration();
        boundDataDeclaration.parent = parent;

        if (dataDeclarationKeyword) {
            boundDataDeclaration.declarationKind = dataDeclarationKeyword.kind;
        }

        boundDataDeclaration.identifier = this.declareSymbol(dataDeclaration, boundDataDeclaration);

        // TODO: Should this be lowered to an assignment expression?
        if (dataDeclaration.expression) {
            boundDataDeclaration.expression = this.bindExpression(dataDeclaration.expression, boundDataDeclaration);
        }

        if (dataDeclaration.equalsSign &&
            dataDeclaration.equalsSign.kind === TokenKind.ColonEqualsSign) {
            if (boundDataDeclaration.expression) {
                boundDataDeclaration.type = boundDataDeclaration.expression.type;
            }
        } else {
            boundDataDeclaration.type = this.bindTypeAnnotation(dataDeclaration.type);
            if (boundDataDeclaration.expression) {
                if (!boundDataDeclaration.expression.type.isConvertibleTo(boundDataDeclaration.type)) {
                    throw new Error(`'${boundDataDeclaration.expression.type}' is not convertible to '${boundDataDeclaration.type}'.`);
                }
            }
        }

        return boundDataDeclaration;
    }

    // #endregion

    // #endregion

    // #region Function declaration

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
        boundFunctionDeclaration.statements = this.bindStatements(functionDeclaration.statements, boundFunctionDeclaration);

        return boundFunctionDeclaration;
    }

    // #endregion

    // #region Interface declaration

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
    ): BoundInterfaceDeclarationMember[] {
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
                case TokenKind.Newline:
                case TokenKind.Skipped: {
                    break;
                }
                default: {
                    assertNever(member);
                    break;
                }
            }
        }

        return boundMembers;
    }

    // #region Interface method declaration

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

    // #endregion

    // #endregion

    // #region Class declaration

    private bindClassDeclaration(
        classDeclaration: ClassDeclaration,
        parent: BoundModuleDeclaration,
    ): BoundClassDeclaration {
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
    ): BoundClassDeclarationMember[] {
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
                case TokenKind.Newline:
                case TokenKind.Skipped: {
                    break;
                }
                default: {
                    assertNever(member);
                    break;
                }
            }
        }

        return boundMembers;
    }

    // #region Class method declaration

    private bindClassMethodDeclaration(
        classMethodDeclaration: ClassMethodDeclaration,
        parent: BoundClassDeclaration,
    ): BoundClassMethodDeclaration {
        const boundClassMethodDeclaration = new BoundClassMethodDeclaration();
        boundClassMethodDeclaration.parent = parent;
        boundClassMethodDeclaration.identifier = this.declareSymbol(classMethodDeclaration, boundClassMethodDeclaration);
        boundClassMethodDeclaration.locals = new BoundSymbolTable();
        boundClassMethodDeclaration.returnType = this.bindTypeAnnotation(classMethodDeclaration.returnType);
        boundClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(classMethodDeclaration.parameters, boundClassMethodDeclaration);
        if (classMethodDeclaration.statements) {
            boundClassMethodDeclaration.statements = this.bindStatements(classMethodDeclaration.statements, boundClassMethodDeclaration);
        }

        return boundClassMethodDeclaration;
    }

    // #endregion

    // #endregion

    // #endregion

    // #region Statements

    private bindStatements(
        statements: (Statements | SkippedToken<TokenKinds>)[],
        parent: BoundNodes,
    ): BoundStatements[] {
        const boundStatements: BoundStatements[] = [];

        for (const statement of statements) {
            switch (statement.kind) {
                case NodeKind.DataDeclarationSequenceStatement:
                case NodeKind.ReturnStatement:
                case NodeKind.IfStatement:
                case NodeKind.SelectStatement:
                case NodeKind.WhileLoop:
                case NodeKind.RepeatLoop:
                case NodeKind.ForLoop:
                case NodeKind.ContinueStatement:
                case NodeKind.ExitStatement:
                case NodeKind.ThrowStatement:
                case NodeKind.TryStatement:
                case NodeKind.ExpressionStatement: {
                    const boundStatement = this.bindStatement(statement, parent);
                    if (boundStatement) {
                        if (Array.isArray(boundStatement)) {
                            boundStatements.push(...boundStatement);
                        } else {
                            boundStatements.push(boundStatement);
                        }
                    }
                    break;
                }

                case NodeKind.EmptyStatement:
                case TokenKind.Skipped: {
                    break;
                }

                default: {
                    assertNever(statement);
                    break;
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
                return this.bindDataDeclarationSequenceStatement(statement, parent);
            }
            case NodeKind.IfStatement: {
                return this.bindIfStatement(statement, parent);
            }
            case NodeKind.SelectStatement: {
                return this.bindSelectStatement(statement, parent);
            }
            case NodeKind.ForLoop: {
                return this.bindForLoop(statement, parent);
            }
            case NodeKind.TryStatement: {
                return this.bindTryStatement(statement, parent);
            }
            case NodeKind.ReturnStatement: {
                return this.bindReturnStatement(statement, parent);
            }
            case NodeKind.ExpressionStatement: {
                return this.bindExpressionStatement(statement, parent);
            }
            case NodeKind.WhileLoop: {
                return this.bindWhileLoop(statement, parent);
            }
            case NodeKind.RepeatLoop: {
                return this.bindRepeatLoop(statement, parent);
            }
            case NodeKind.ThrowStatement: {
                return this.bindThrowStatement(statement, parent);
            }
            case NodeKind.ContinueStatement: {
                return this.bindContinueStatement(parent);
            }
            case NodeKind.ExitStatement: {
                return this.bindExitStatement(parent);
            }
            case NodeKind.EmptyStatement: {
                break;
            }
            default: {
                return assertNever(statement);
            }
        }
    }

    // #region Data declaration sequence statement

    private bindDataDeclarationSequenceStatement(
        dataDeclarationSequenceStatement: DataDeclarationSequenceStatement,
        parent: BoundNodes,
    ): BoundDataDeclarationStatement[] {
        const { dataDeclarationSequence } = dataDeclarationSequenceStatement;

        const boundDataDeclarationStatements: BoundDataDeclarationStatement[] = [];

        for (const dataDeclaration of dataDeclarationSequence.children) {
            switch (dataDeclaration.kind) {
                case NodeKind.DataDeclaration: {
                    const boundDataDeclarationStatement = this.bindDataDeclarationStatement(dataDeclaration, parent, dataDeclarationSequence.dataDeclarationKeyword);
                    boundDataDeclarationStatements.push(boundDataDeclarationStatement);
                    break;
                }
                case NodeKind.CommaSeparator: { break; }
                default: {
                    assertNever(dataDeclaration);
                    break;
                }
            }
        }

        return boundDataDeclarationStatements;
    }

    private bindDataDeclarationStatement(
        dataDeclaration: DataDeclaration,
        parent: BoundNodes,
        dataDeclarationKeyword?: DataDeclarationKeywordToken,
    ): BoundDataDeclarationStatement {
        const boundDataDeclarationStatement = new BoundDataDeclarationStatement();
        boundDataDeclarationStatement.parent = parent;
        boundDataDeclarationStatement.declaration = this.bindDataDeclaration(dataDeclaration, boundDataDeclarationStatement, dataDeclarationKeyword);

        return boundDataDeclarationStatement;
    }

    // #endregion

    // #region Return statement

    private bindReturnStatement(
        statement: ReturnStatement,
        parent: BoundNodes,
    ): BoundReturnStatement {
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

    // #endregion

    // #region If statement

    private bindIfStatement(
        ifStatement: IfStatement,
        parent: BoundNodes,
    ): BoundIfStatement {
        const boundIfStatement = new BoundIfStatement();
        boundIfStatement.parent = parent;
        boundIfStatement.expression = this.bindExpression(ifStatement.expression, boundIfStatement);
        boundIfStatement.statements = this.bindStatements(ifStatement.statements, boundIfStatement);

        if (ifStatement.elseIfClauses) {
            boundIfStatement.elseIfClauses = this.bindElseIfClauses(ifStatement.elseIfClauses, boundIfStatement);
        }

        if (ifStatement.elseClause) {
            boundIfStatement.elseClause = this.bindElseClause(ifStatement.elseClause, boundIfStatement);
        }

        return boundIfStatement;
    }

    private bindElseIfClauses(
        elseIfClauses: ElseIfClause[],
        parent: BoundIfStatement,
    ): BoundElseIfClause[] {
        const boundElseIfClauses: BoundElseIfClause[] = [];

        for (const elseifClause of elseIfClauses) {
            const boundElseIfClause = this.bindElseIfClause(elseifClause, parent);
            boundElseIfClauses.push(boundElseIfClause);
        }

        return boundElseIfClauses;
    }

    private bindElseIfClause(
        elseifClause: ElseIfClause,
        parent: BoundIfStatement,
    ): BoundElseIfClause {
        const boundElseIfClause = new BoundElseIfClause();
        boundElseIfClause.parent = parent;
        boundElseIfClause.expression = this.bindExpression(elseifClause.expression, boundElseIfClause);
        boundElseIfClause.statements = this.bindStatements(elseifClause.statements, boundElseIfClause);

        return boundElseIfClause;
    }

    private bindElseClause(
        elseClause: ElseClause,
        parent: BoundIfStatement,
    ): BoundElseClause {
        const boundElseClause = new BoundElseClause();
        boundElseClause.parent = parent;
        boundElseClause.statements = this.bindStatements(elseClause.statements, boundElseClause);

        return boundElseClause;
    }

    // #endregion

    // #region Select statement

    private bindSelectStatement(
        selectStatement: SelectStatement,
        parent: BoundNodes,
    ): BoundSelectStatement {
        const boundSelectStatement = new BoundSelectStatement();
        boundSelectStatement.parent = parent;
        boundSelectStatement.caseClauses = this.bindCaseClauses(selectStatement.caseClauses, boundSelectStatement);
        if (selectStatement.defaultClause) {
            boundSelectStatement.defaultClause = this.bindDefaultClause(selectStatement.defaultClause, boundSelectStatement);
        }

        return boundSelectStatement;
    }

    private bindCaseClauses(
        caseClauses: CaseClause[],
        parent: BoundSelectStatement,
    ): BoundCaseClause[] {
        const boundCaseClauses: BoundCaseClause[] = [];

        for (const caseClause of caseClauses) {
            const boundCaseClause = this.bindCaseClause(caseClause, parent);
            boundCaseClauses.push(boundCaseClause);
        }

        return boundCaseClauses;
    }

    private bindCaseClause(
        caseClause: CaseClause,
        parent: BoundSelectStatement,
    ): BoundCaseClause {
        const boundCaseClause = new BoundCaseClause();
        boundCaseClause.parent = parent;
        boundCaseClause.expressions = this.bindExpressionSequence(caseClause.expressions, boundCaseClause);
        boundCaseClause.statements = this.bindStatements(caseClause.statements, boundCaseClause);

        return boundCaseClause;
    }

    private bindDefaultClause(
        defaultClause: DefaultClause,
        parent: BoundSelectStatement,
    ): BoundDefaultClause {
        const boundDefaultClause = new BoundDefaultClause();
        boundDefaultClause.parent = parent;
        boundDefaultClause.statements = this.bindStatements(defaultClause.statements, boundDefaultClause);

        return boundDefaultClause;
    }

    // #endregion

    // #region Loops

    // #region While loop

    private bindWhileLoop(
        whileLoop: WhileLoop,
        parent: BoundNodes,
    ): BoundWhileLoop {
        const boundWhileLoop = new BoundWhileLoop();
        boundWhileLoop.parent = parent;
        boundWhileLoop.expression = this.bindExpression(whileLoop.expression, boundWhileLoop);
        boundWhileLoop.statements = this.bindStatements(whileLoop.statements, boundWhileLoop);

        return boundWhileLoop;
    }

    // #endregion

    // #region Repeat loop

    private bindRepeatLoop(
        repeatLoop: RepeatLoop,
        parent: BoundNodes,
    ): BoundRepeatLoop {
        const boundRepeatLoop = new BoundRepeatLoop();
        boundRepeatLoop.parent = parent;
        if (repeatLoop.untilExpression) {
            boundRepeatLoop.expression = this.bindExpression(repeatLoop.untilExpression, boundRepeatLoop);
        }
        boundRepeatLoop.statements = this.bindStatements(repeatLoop.statements, boundRepeatLoop);

        return boundRepeatLoop;
    }

    // #endregion

    // #region For loop

    private bindForLoop(
        forLoop: ForLoop,
        parent: BoundNodes,
    ): BoundForLoop {
        const boundForLoop = new BoundForLoop();
        boundForLoop.parent = parent;

        const { header } = forLoop;
        switch (header.kind) {
            case NodeKind.NumericForLoopHeader: {
                const { loopVariableExpression } = header;
                switch (loopVariableExpression.kind) {
                    case NodeKind.DataDeclarationSequenceStatement: {
                        boundForLoop.statement = this.bindDataDeclarationSequenceStatement(loopVariableExpression, boundForLoop)[0];
                        break;
                    }
                    case NodeKind.AssignmentExpression: {
                        const boundExpressionStatement = new BoundExpressionStatement();
                        boundExpressionStatement.parent = boundForLoop;
                        boundExpressionStatement.expression = this.bindAssignmentExpression(loopVariableExpression, boundExpressionStatement);
                        boundForLoop.statement = boundExpressionStatement;
                        break;
                    }
                    default: {
                        assertNever(loopVariableExpression);
                        break;
                    }
                }

                boundForLoop.lastValueExpression = this.bindExpression(header.lastValueExpression, boundForLoop);
                if (header.stepValueExpression) {
                    boundForLoop.stepValueExpression = this.bindExpression(header.stepValueExpression, boundForLoop);
                }
                break;
            }
            case NodeKind.DataDeclarationSequenceStatement: {
                boundForLoop.statement = this.bindDataDeclarationSequenceStatement(header, boundForLoop)[0];
                break;
            }
            case NodeKind.AssignmentExpression: {
                const boundExpressionStatement = new BoundExpressionStatement();
                boundExpressionStatement.parent = boundForLoop;
                boundExpressionStatement.expression = this.bindAssignmentExpression(header, boundExpressionStatement);
                boundForLoop.statement = boundExpressionStatement;
                break;
            }
            case TokenKind.Missing: {
                break;
            }
            default: {
                assertNever(header);
                break;
            }
        }

        boundForLoop.statements = this.bindStatements(forLoop.statements, boundForLoop);

        return boundForLoop;
    }

    // #endregion

    private bindContinueStatement(parent: BoundNodes): BoundContinueStatement {
        const boundContinueStatement = new BoundContinueStatement();
        boundContinueStatement.parent = parent;

        return boundContinueStatement;
    }

    private bindExitStatement(parent: BoundNodes): BoundExitStatement {
        const boundExitStatement = new BoundExitStatement();
        boundExitStatement.parent = parent;

        return boundExitStatement;
    }

    // #endregion

    // #region Throw statement

    private bindThrowStatement(
        throwStatement: ThrowStatement,
        parent: BoundNodes,
    ): BoundThrowStatement {
        const boundThrowStatement = new BoundThrowStatement();
        boundThrowStatement.parent = parent;
        boundThrowStatement.expression = this.bindExpression(throwStatement.expression, boundThrowStatement);

        return boundThrowStatement;
    }

    // #endregion

    // #region Try statement

    private bindTryStatement(
        tryStatement: TryStatement,
        parent: BoundNodes,
    ): BoundTryStatement {
        const boundTryStatement = new BoundTryStatement();
        boundTryStatement.parent = parent;
        boundTryStatement.statements = this.bindStatements(tryStatement.statements, boundTryStatement);
        boundTryStatement.catchClauses = this.bindCatchClauses(tryStatement, boundTryStatement);

        return boundTryStatement;
    }

    private bindCatchClauses(
        tryStatement: TryStatement,
        parent: BoundTryStatement,
    ): BoundCatchClause[] {
        const boundCatchClauses: BoundCatchClause[] = [];

        for (const catchClause of tryStatement.catchClauses) {
            const boundCatchClause = this.bindCatchClause(catchClause, parent);
            boundCatchClauses.push(boundCatchClause);
        }

        return boundCatchClauses;
    }

    private bindCatchClause(
        catchClause: CatchClause,
        parent: BoundTryStatement,
    ): BoundCatchClause {
        const boundCatchClause = new BoundCatchClause();
        boundCatchClause.parent = parent;

        if (catchClause.parameter.kind === TokenKind.Missing) {
            throw new Error('Catch clause must declare a parameter.');
        }
        else {
            boundCatchClause.parameter = this.bindDataDeclaration(catchClause.parameter, boundCatchClause);
        }

        boundCatchClause.statements = this.bindStatements(catchClause.statements, boundCatchClause);

        return boundCatchClause;
    }

    // #endregion

    // #region Expression statement

    private bindExpressionStatement(
        expressionStatement: ExpressionStatement,
        parent: BoundNodes,
    ): BoundExpressionStatement {
        const boundExpressionStatement = new BoundExpressionStatement();
        boundExpressionStatement.parent = parent;
        boundExpressionStatement.expression = this.bindExpression(expressionStatement.expression, boundExpressionStatement);

        return boundExpressionStatement;
    }

    // #endregion

    // #endregion

    // #region Expressions

    private bindExpression(
        expression: MissableExpression,
        parent: BoundNodes,
    ) {
        switch (expression.kind) {
            case NodeKind.AssignmentExpression: {
                return this.bindAssignmentExpression(expression, parent);
            }
            case NodeKind.BinaryExpression: {
                return this.bindBinaryExpression(expression, parent);
            }
            case NodeKind.UnaryExpression: {
                return this.bindUnaryExpression(expression, parent);
            }
            case NodeKind.NewExpression: {
                return this.bindNewExpression(expression, parent);
            }
            case NodeKind.NullExpression: {
                return this.bindNullExpression(parent);
            }
            case NodeKind.BooleanLiteralExpression: {
                return this.bindBooleanLiteralExpression(parent);
            }
            case NodeKind.SelfExpression: {
                return this.bindSelfExpression(parent);
            }
            case NodeKind.SuperExpression: {
                return this.bindSuperExpression(parent);
            }
            case NodeKind.StringLiteralExpression: {
                return this.bindStringLiteralExpression(parent);
            }
            case NodeKind.FloatLiteralExpression: {
                return this.bindFloatLiteralExpression(parent);
            }
            case NodeKind.IntegerLiteralExpression: {
                return this.bindIntegerLiteralExpression(parent);
            }
            case NodeKind.ArrayLiteralExpression: {
                return this.bindArrayLiteralExpression(expression, parent);
            }
            case NodeKind.IdentifierExpression: {
                return this.bindIdentifierExpression(expression, parent);
            }
            case NodeKind.GroupingExpression: {
                return this.bindGroupingExpression(expression, parent);
            }
            case NodeKind.IndexExpression: {
                return this.bindIndexExpression(expression, parent);
            }
            case NodeKind.SliceExpression: {
                return this.bindSliceExpression(expression, parent);
            }
            case NodeKind.InvokeExpression: {
                return this.bindInvokeExpression(expression, parent);
            }
            case NodeKind.ScopeMemberAccessExpression:
            case NodeKind.GlobalScopeExpression: {
                throw new Error(`Binding '${expression.kind}' is not implemented.`);
            }
            case TokenKind.Missing: {
                throw new Error('Expression is missing.');
            }
            default: {
                return assertNever(expression);
            }
        }
    }

    // #region Assignment expression

    private bindAssignmentExpression(
        assignmentExpression: AssignmentExpression,
        parent: BoundNodes,
    ): BoundAssignmentExpression {
        const boundAssignmentExpression = new BoundAssignmentExpression();
        boundAssignmentExpression.parent = parent;
        boundAssignmentExpression.leftOperand = this.bindExpression(assignmentExpression.leftOperand, boundAssignmentExpression);
        boundAssignmentExpression.rightOperand = this.bindExpression(assignmentExpression.rightOperand, boundAssignmentExpression);

        const { leftOperand, rightOperand } = boundAssignmentExpression;

        // Lower update assignments to an assignment of a binary expression
        const operatorKind = assignmentExpression.operator.kind;
        if (operatorKind !== TokenKind.EqualsSign) {
            const boundBinaryExpression = new BoundBinaryExpression();
            boundBinaryExpression.parent = boundAssignmentExpression;
            boundBinaryExpression.leftOperand = leftOperand;
            boundBinaryExpression.rightOperand = rightOperand;

            switch (operatorKind) {
                // Binary arithmetic operations
                case TokenKind.AsteriskEqualsSign: {
                    boundBinaryExpression.type = this.bindBinaryArithmeticOperationType(leftOperand, TokenKind.Asterisk, rightOperand);
                    break;
                }
                case TokenKind.SlashEqualsSign: {
                    boundBinaryExpression.type = this.bindBinaryArithmeticOperationType(leftOperand, TokenKind.Slash, rightOperand);
                    break;
                }
                case TokenKind.ModKeywordEqualsSign: {
                    boundBinaryExpression.type = this.bindBinaryArithmeticOperationType(leftOperand, TokenKind.ModKeyword, rightOperand);
                    break;
                }
                case TokenKind.PlusSignEqualsSign: {
                    boundBinaryExpression.type = this.bindBinaryArithmeticOperationType(leftOperand, TokenKind.PlusSign, rightOperand);
                    break;
                }
                case TokenKind.HyphenMinusEqualsSign: {
                    boundBinaryExpression.type = this.bindBinaryArithmeticOperationType(leftOperand, TokenKind.HyphenMinus, rightOperand);
                    break;
                }

                // Bitwise operations
                case TokenKind.ShlKeywordEqualsSign: {
                    boundBinaryExpression.type = this.bindBitwiseOperationType(leftOperand, TokenKind.ShlKeyword, rightOperand);
                    break;
                }
                case TokenKind.ShrKeywordEqualsSign: {
                    boundBinaryExpression.type = this.bindBitwiseOperationType(leftOperand, TokenKind.ShrKeyword, rightOperand);
                    break;
                }
                case TokenKind.AmpersandEqualsSign: {
                    boundBinaryExpression.type = this.bindBitwiseOperationType(leftOperand, TokenKind.Ampersand, rightOperand);
                    break;
                }
                case TokenKind.TildeEqualsSign: {
                    boundBinaryExpression.type = this.bindBitwiseOperationType(leftOperand, TokenKind.Tilde, rightOperand);
                    break;
                }
                case TokenKind.VerticalBarEqualsSign: {
                    boundBinaryExpression.type = this.bindBitwiseOperationType(leftOperand, TokenKind.VerticalBar, rightOperand);
                    break;
                }

                default: {
                    assertNever(operatorKind);
                    break;
                }
            }

            boundAssignmentExpression.rightOperand = boundBinaryExpression;
        }

        switch (leftOperand.kind) {
            case BoundNodeKind.IndexExpression:
            case BoundNodeKind.IdentifierExpression: { break; }
            default: {
                throw new Error(`'${leftOperand.kind}' cannot be assigned to.`);
            }
        }

        if (!rightOperand.type.isConvertibleTo(leftOperand.type)) {
            throw new Error(`'${rightOperand.type}' cannot be converted to '${leftOperand.type}'.`);
        }

        return boundAssignmentExpression;
    }

    // #endregion

    // #region Binary expression

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
                boundBinaryExpression.type = this.bindBinaryArithmeticOperationType(leftOperand, operatorKind, rightOperand);
                break;
            }

            // Bitwise operations
            case TokenKind.ShlKeyword:
            case TokenKind.ShrKeyword:
            case TokenKind.Ampersand:
            case TokenKind.Tilde:
            case TokenKind.VerticalBar: {
                boundBinaryExpression.type = this.bindBitwiseOperationType(leftOperand, operatorKind, rightOperand);
                break;
            }

            // Comparison operations
            case TokenKind.EqualsSign:
            case TokenKind.LessThanSign:
            case TokenKind.GreaterThanSign:
            case TokenKind.LessThanSignEqualsSign:
            case TokenKind.GreaterThanSignEqualsSign:
            case TokenKind.LessThanSignGreaterThanSign: {
                boundBinaryExpression.type = this.bindComparisonOperationType(leftOperand, operatorKind, rightOperand);
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

    private bindBinaryArithmeticOperationType(
        leftOperand: BoundExpressions,
        operatorKind: TokenKind,
        rightOperand: BoundExpressions,
    ) {
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

        return balancedType;
    }

    private bindBitwiseOperationType(
        leftOperand: BoundExpressions,
        operatorKind: TokenKind,
        rightOperand: BoundExpressions,
    ) {
        if (!leftOperand.type.isConvertibleTo(IntType.type) ||
            !rightOperand.type.isConvertibleTo(IntType.type)) {
            throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
        }

        return IntType.type;
    }

    private bindComparisonOperationType(
        leftOperand: BoundExpressions,
        operatorKind: TokenKind,
        rightOperand: BoundExpressions,
    ) {
        const balancedType = this.getBalancedType(leftOperand.type, rightOperand.type);
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

        return BoolType.type;
    }

    // #endregion

    // #region Unary expression

    private bindUnaryExpression(
        expression: UnaryExpression,
        parent: BoundNodes,
    ): BoundUnaryExpression {
        const boundUnaryExpression = new BoundUnaryExpression();
        boundUnaryExpression.parent = parent;
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

    // #endregion

    // #region New expression

    private bindNewExpression(
        newExpression: NewExpression,
        parent: BoundNodes,
    ): BoundNewExpression {
        const boundNewExpression = new BoundNewExpression();
        boundNewExpression.type = this.bindTypeReference(newExpression.type);
        boundNewExpression.parent = parent;

        return boundNewExpression;
    }

    // #endregion

    // #region Null expression

    private bindNullExpression(parent: BoundNodes): BoundNullExpression {
        const boundNullExpression = new BoundNullExpression();
        boundNullExpression.parent = parent;

        return boundNullExpression;
    }

    // #endregion

    // #region Boolean literal expression

    private bindBooleanLiteralExpression(parent: BoundNodes): BoundBooleanLiteralExpression {
        const boundBooleanLiteralExpression = new BoundBooleanLiteralExpression();
        boundBooleanLiteralExpression.parent = parent;

        return boundBooleanLiteralExpression;
    }

    // #endregion

    // #region Self expression

    private bindSelfExpression(parent: BoundNodes): BoundSelfExpression {
        const boundSelfExpression = new BoundSelfExpression();
        boundSelfExpression.parent = parent;

        const ancestor = this.getNearestAncestor(boundSelfExpression, [BoundNodeKind.ClassDeclaration]) as BoundClassDeclaration;
        boundSelfExpression.type = ancestor.type;

        return boundSelfExpression;
    }

    // #endregion

    // #region Super expression

    private bindSuperExpression(parent: BoundNodes): BoundSuperExpression {
        const boundSuperExpression = new BoundSuperExpression();
        boundSuperExpression.parent = parent;

        const ancestor = this.getNearestAncestor(boundSuperExpression, [BoundNodeKind.ClassDeclaration]) as BoundClassDeclaration;
        if (!ancestor.baseType) {
            throw new Error(`'${ancestor.identifier.name}' does not extend a base class.`);
        }
        boundSuperExpression.type = ancestor.baseType;

        return boundSuperExpression;
    }

    // #endregion

    // #region String literal expression

    private bindStringLiteralExpression(parent: BoundNodes): BoundStringLiteralExpression {
        const boundStringLiteralExpression = new BoundStringLiteralExpression();
        boundStringLiteralExpression.parent = parent;

        return boundStringLiteralExpression;
    }

    // #endregion

    // #region Float literal expression

    private bindFloatLiteralExpression(parent: BoundNodes): BoundFloatLiteralExpression {
        const boundFloatLiteralExpression = new BoundFloatLiteralExpression();
        boundFloatLiteralExpression.parent = parent;

        return boundFloatLiteralExpression;
    }

    // #endregion

    // #region Integer literal expression

    private bindIntegerLiteralExpression(parent: BoundNodes): BoundIntegerLiteralExpression {
        const boundIntegerLiteralExpression = new BoundIntegerLiteralExpression();
        boundIntegerLiteralExpression.parent = parent;

        return boundIntegerLiteralExpression;
    }

    // #endregion

    // #region Array literal expression

    private bindArrayLiteralExpression(
        arrayLiteralExpression: ArrayLiteralExpression,
        parent: BoundNodes,
    ): BoundArrayLiteralExpression {
        const boundArrayLiteralExpression = new BoundArrayLiteralExpression();
        boundArrayLiteralExpression.parent = parent;
        boundArrayLiteralExpression.expressions = this.bindExpressionSequence(arrayLiteralExpression.expressions, boundArrayLiteralExpression);

        let type = boundArrayLiteralExpression.expressions[0].type;
        for (const expression of boundArrayLiteralExpression.expressions) {
            const balancedType = this.getBalancedType(type, expression.type);
            if (!balancedType) {
                throw new Error('Array must contain a common type.');
            }
            type = balancedType;
        }
        boundArrayLiteralExpression.type = new ArrayType(type);

        return boundArrayLiteralExpression;
    }

    // #endregion

    // #region Identifier expression

    private bindIdentifierExpression(
        identifierExpression: IdentifierExpression,
        parent: BoundNodes,
    ): BoundIdentifierExpression {
        const boundIdentifierExpression = new BoundIdentifierExpression();
        boundIdentifierExpression.parent = parent;

        const { identifier } = identifierExpression;
        switch (identifier.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword: {
                boundIdentifierExpression.identifier = this.getSymbol(identifier, boundIdentifierExpression);

                const { declaration } = boundIdentifierExpression.identifier;
                switch (declaration.kind) {
                    case BoundNodeKind.InterfaceDeclaration:
                    case BoundNodeKind.ClassDeclaration:
                    case BoundNodeKind.DataDeclaration: {
                        boundIdentifierExpression.type = declaration.type;
                        break;
                    }

                    case BoundNodeKind.ModuleDeclaration:
                    case BoundNodeKind.InterfaceMethodDeclaration:
                    case BoundNodeKind.ClassMethodDeclaration:
                    case BoundNodeKind.FunctionDeclaration: {
                        break;
                    }

                    default: {
                        assertNever(declaration);
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
            case TokenKind.NewKeyword:
            case NodeKind.EscapedIdentifier: {
                break;
            }
            default: {
                assertNever(identifier);
                break;
            }
        }

        return boundIdentifierExpression;
    }

    private getSymbol(
        identifier: EscapeOptionalIdentifierNameToken,
        boundIdentifierExpression: BoundIdentifierExpression,
    ): BoundSymbol {
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

    // #endregion

    // #region Grouping expression

    private bindGroupingExpression(
        groupingExpression: GroupingExpression,
        parent: BoundNodes,
    ): BoundGroupingExpression {
        const boundGroupingExpression = new BoundGroupingExpression();
        boundGroupingExpression.parent = parent;
        boundGroupingExpression.expression = this.bindExpression(groupingExpression.expression, boundGroupingExpression);
        boundGroupingExpression.type = boundGroupingExpression.expression.type;

        return boundGroupingExpression;
    }

    // #endregion

    // #region Index expression

    private bindIndexExpression(
        indexExpression: IndexExpression,
        parent: BoundNodes,
    ): BoundIndexExpression {
        const boundIndexExpression = new BoundIndexExpression();
        boundIndexExpression.parent = parent;
        boundIndexExpression.indexableExpression = this.bindExpression(indexExpression.indexableExpression, boundIndexExpression);
        boundIndexExpression.indexExpressionExpression = this.bindExpression(indexExpression.indexExpressionExpression, boundIndexExpression);

        const { indexableExpression, indexExpressionExpression } = boundIndexExpression;

        switch (indexableExpression.type.kind) {
            case TypeKind.String: {
                boundIndexExpression.type = IntType.type;
                break;
            }
            case TypeKind.Array: {
                boundIndexExpression.type = indexableExpression.type.elementType;
                break;
            }
            default: {
                throw new Error(`Expressions of type '${indexableExpression.type}' cannot be accessed by index.`);
            }
        }

        if (!indexExpressionExpression.type.isConvertibleTo(IntType.type)) {
            throw new Error(`Index expression is '${indexExpressionExpression.type}' but must be '${IntType.type}'.`)
        }

        return boundIndexExpression;
    }

    // #endregion

    // #region Slice expression

    private bindSliceExpression(
        sliceExpression: SliceExpression,
        parent: BoundNodes,
    ): BoundSliceExpression {
        const boundSliceExpression = new BoundSliceExpression();
        boundSliceExpression.parent = parent;

        boundSliceExpression.sliceableExpression = this.bindExpression(sliceExpression.sliceableExpression, boundSliceExpression);

        const sliceableExpression = boundSliceExpression.sliceableExpression;
        switch (sliceableExpression.type.kind) {
            case TypeKind.String:
            case TypeKind.Array: {
                boundSliceExpression.type = sliceableExpression.type;
                break;
            }
            default: {
                throw new Error(`Expressions of type '${sliceableExpression.type}' cannot be sliced.`);
            }
        }

        if (sliceExpression.startExpression) {
            boundSliceExpression.startExpression = this.bindExpression(sliceExpression.startExpression, boundSliceExpression);
            if (!boundSliceExpression.startExpression.type.isConvertibleTo(IntType.type)) {
                throw new Error(`Start index expression is '${boundSliceExpression.startExpression.type}' but must be '${IntType.type}'.`)
            }

        }

        if (sliceExpression.endExpression) {
            boundSliceExpression.endExpression = this.bindExpression(sliceExpression.endExpression, boundSliceExpression);
            if (!boundSliceExpression.endExpression.type.isConvertibleTo(IntType.type)) {
                throw new Error(`End index expression is '${boundSliceExpression.endExpression.type}' but must be '${IntType.type}'.`)
            }
        }

        return boundSliceExpression;
    }

    // #endregion

    // #region Invoke expression

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
    ): BoundExpressions[] {
        const boundArguments: BoundExpressions[] = [];

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

    // #endregion

    private bindExpressionSequence(
        expressions: (MissableExpression | CommaSeparator)[],
        parent: BoundNodes,
    ): BoundExpressions[] {
        const boundExpressions: BoundExpressions[] = [];

        for (const expression of expressions) {
            switch (expression.kind) {
                case NodeKind.NewExpression:
                case NodeKind.NullExpression:
                case NodeKind.BooleanLiteralExpression:
                case NodeKind.SelfExpression:
                case NodeKind.SuperExpression:
                case NodeKind.IntegerLiteralExpression:
                case NodeKind.FloatLiteralExpression:
                case NodeKind.StringLiteralExpression:
                case NodeKind.ArrayLiteralExpression:
                case NodeKind.IdentifierExpression:
                case NodeKind.ScopeMemberAccessExpression:
                case NodeKind.InvokeExpression:
                case NodeKind.IndexExpression:
                case NodeKind.SliceExpression:
                case NodeKind.GroupingExpression:
                case NodeKind.UnaryExpression:
                case NodeKind.BinaryExpression:
                case NodeKind.AssignmentExpression:
                case NodeKind.GlobalScopeExpression: {
                    const boundExpression = this.bindExpression(expression, parent);
                    boundExpressions.push(boundExpression);
                }

                case NodeKind.CommaSeparator:
                case TokenKind.Missing: {
                    break;
                }

                default: {
                    assertNever(expression);
                    break;
                }
            }
        }

        return boundExpressions;
    }

    // #endregion

    // #region Core

    private bindTypeReferenceSequence(typeReferences: (TypeReference | CommaSeparator)[]): Types[] {
        const types: Types[] = [];

        for (const typeReference of typeReferences) {
            switch (typeReference.kind) {
                case NodeKind.TypeReference: {
                    const type = this.bindTypeReference(typeReference);
                    types.push(type);
                    break;
                }
                case NodeKind.CommaSeparator: { break; }
                default: {
                    assertNever(typeReference);
                    break;
                }
            }
        }

        return types;
    }

    private bindTypeAnnotation(typeAnnotation: TypeAnnotation | undefined) {
        if (!typeAnnotation) {
            return IntType.type;
        }

        switch (typeAnnotation.kind) {
            case NodeKind.ShorthandTypeAnnotation: {
                // TODO: Nested array annotations
                const { arrayTypeAnnotations, shorthandType } = typeAnnotation;
                if (arrayTypeAnnotations.length) {
                    let elementType: Types;
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
                let type = this.getElementType(typeReference);
                for (const { } of typeReference.arrayTypeAnnotations) {
                    type = new ArrayType(type);
                }

                return type;
            }
            case TokenKind.Missing: {
                throw new Error('Method not implemented.');
            }
            default: {
                return assertNever(typeReference);
            }
        }
    }

    private getElementType(typeReference: TypeReference) {
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
            case TokenKind.ThrowableKeyword:
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
                        for (const [, node] of this.module.locals) {
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

    private getBalancedType(leftOperandType: Types, rightOperandType: Types) {
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

    private declareSymbol(declaration: Declarations, boundDeclaration: BoundDeclarations): BoundSymbol {
        const name = this.getDeclarationName(declaration);
        const identifier = new BoundSymbol(name, boundDeclaration);

        const scope = this.getScope(boundDeclaration);
        if (scope) {
            const existingSymbol = scope.locals.get(name);

            if (existingSymbol) {
                throw new Error(`Duplicate symbol '${name}'.`);
            } else {
                scope.locals.set(name, identifier);
            }
        }

        return identifier;
    }

    private getScope(boundDeclaration: BoundDeclarations) {
        let node = boundDeclaration.parent;

        while (true) {
            if (!node) {
                return undefined;
            }

            switch (node.kind) {
                case BoundNodeKind.ClassDeclaration:
                case BoundNodeKind.ClassMethodDeclaration:
                case BoundNodeKind.FunctionDeclaration:
                case BoundNodeKind.InterfaceDeclaration:
                case BoundNodeKind.InterfaceMethodDeclaration:
                case BoundNodeKind.ModuleDeclaration: {
                    return node;
                }
            }

            node = node.parent;
        }
    }

    private getDeclarationName(declaration: Declarations): string {
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

    private getNearestAncestor(node: BoundNodes, kinds: BoundNodeKind[]): BoundNodes {
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
