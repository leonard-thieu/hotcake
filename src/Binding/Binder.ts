import path = require('path');
import { assertNever } from '../assertNever';
import { FILE_EXTENSION, Project } from '../Project';
import { CommaSeparator } from '../Syntax/Node/CommaSeparator';
import { AccessibilityDirective } from '../Syntax/Node/Declaration/AccessibilityDirective';
import { AliasDirective, AliasDirectiveSequence } from '../Syntax/Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration } from '../Syntax/Node/Declaration/ClassDeclaration';
import { ClassMethodDeclaration } from '../Syntax/Node/Declaration/ClassMethodDeclaration';
import { DataDeclaration, DataDeclarationKeywordToken, DataDeclarationSequence } from '../Syntax/Node/Declaration/DataDeclarationSequence';
import { Declarations } from '../Syntax/Node/Declaration/Declaration';
import { ExternClassDeclaration } from '../Syntax/Node/Declaration/ExternDeclaration/ExternClassDeclaration';
import { ExternClassMethodDeclaration } from '../Syntax/Node/Declaration/ExternDeclaration/ExternClassMethodDeclaration';
import { ExternDataDeclaration, ExternDataDeclarationKeywordToken, ExternDataDeclarationSequence } from '../Syntax/Node/Declaration/ExternDeclaration/ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from '../Syntax/Node/Declaration/ExternDeclaration/ExternFunctionDeclaration';
import { FunctionDeclaration } from '../Syntax/Node/Declaration/FunctionDeclaration';
import { ImportStatement } from '../Syntax/Node/Declaration/ImportStatement';
import { InterfaceDeclaration } from '../Syntax/Node/Declaration/InterfaceDeclaration';
import { InterfaceMethodDeclaration } from '../Syntax/Node/Declaration/InterfaceMethodDeclaration';
import { ModuleDeclaration } from '../Syntax/Node/Declaration/ModuleDeclaration';
import { TypeParameter } from '../Syntax/Node/Declaration/TypeParameter';
import { ArrayLiteralExpression } from '../Syntax/Node/Expression/ArrayLiteralExpression';
import { BinaryExpression } from '../Syntax/Node/Expression/BinaryExpression';
import { MissableExpression } from '../Syntax/Node/Expression/Expression';
import { GroupingExpression } from '../Syntax/Node/Expression/GroupingExpression';
import { IdentifierExpression } from '../Syntax/Node/Expression/IdentifierExpression';
import { IndexExpression } from '../Syntax/Node/Expression/IndexExpression';
import { InvokeExpression } from '../Syntax/Node/Expression/InvokeExpression';
import { NewExpression } from '../Syntax/Node/Expression/NewExpression';
import { ScopeMemberAccessExpression } from '../Syntax/Node/Expression/ScopeMemberAccessExpression';
import { SliceExpression } from '../Syntax/Node/Expression/SliceExpression';
import { UnaryExpression } from '../Syntax/Node/Expression/UnaryExpression';
import { ModulePath } from '../Syntax/Node/ModulePath';
import { Nodes } from '../Syntax/Node/Node';
import { NodeKind } from '../Syntax/Node/NodeKind';
import { AssignmentStatement } from '../Syntax/Node/Statement/AssignmentStatement';
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
import { ParseTreeVisitor } from '../Syntax/ParseTreeVisitor';
import { SkippedToken } from '../Syntax/Token/SkippedToken';
import { IdentifierToken, ThrowableKeywordToken, Tokens } from '../Syntax/Token/Token';
import { TokenKind } from '../Syntax/Token/TokenKind';
import { BoundSymbol, BoundSymbolTable } from './BoundSymbol';
import { ModuleReference } from './ModuleReference';
import { BoundModulePath } from "./Node/BoundModulePath";
import { BoundNodes } from './Node/BoundNode';
import { BoundNodeKind } from './Node/BoundNodeKind';
import { BoundAliasDirective } from './Node/Declaration/BoundAliasDirective';
import { BoundClassDeclaration, BoundClassDeclarationMember } from './Node/Declaration/BoundClassDeclaration';
import { BoundClassMethodDeclaration } from './Node/Declaration/BoundClassMethodDeclaration';
import { BoundDataDeclaration } from './Node/Declaration/BoundDataDeclaration';
import { BoundDeclarations, BoundTypedDeclarations } from './Node/Declaration/BoundDeclarations';
import { BoundDirectory } from './Node/Declaration/BoundDirectory';
import { BoundFunctionDeclaration } from './Node/Declaration/BoundFunctionDeclaration';
import { BoundImportStatement } from './Node/Declaration/BoundImportStatement';
import { BoundInterfaceDeclaration, BoundInterfaceDeclarationMember } from './Node/Declaration/BoundInterfaceDeclaration';
import { BoundInterfaceMethodDeclaration } from './Node/Declaration/BoundInterfaceMethodDeclaration';
import { BoundModuleDeclaration, BoundModuleDeclarationMember } from './Node/Declaration/BoundModuleDeclaration';
import { BoundTypeParameter } from './Node/Declaration/BoundTypeParameter';
import { BoundExternClassDeclaration, BoundExternClassDeclarationMember } from './Node/Declaration/Extern/BoundExternClassDeclaration';
import { BoundExternClassMethodDeclaration } from './Node/Declaration/Extern/BoundExternClassMethodDeclaration';
import { BoundExternDataDeclaration } from './Node/Declaration/Extern/BoundExternDataDeclaration';
import { BoundExternFunctionDeclaration } from './Node/Declaration/Extern/BoundExternFunctionDeclaration';
import { BoundArrayLiteralExpression } from './Node/Expression/BoundArrayLiteralExpression';
import { BoundBinaryExpression } from './Node/Expression/BoundBinaryExpression';
import { BoundBooleanLiteralExpression } from './Node/Expression/BoundBooleanLiteralExpression';
import { BoundExpressions } from './Node/Expression/BoundExpressions';
import { BoundFloatLiteralExpression } from './Node/Expression/BoundFloatLiteralExpression';
import { BoundGlobalScopeExpression } from './Node/Expression/BoundGlobalScopeExpression';
import { BoundGroupingExpression } from './Node/Expression/BoundGroupingExpression';
import { BoundIdentifierExpression } from './Node/Expression/BoundIdentifierExpression';
import { BoundIndexExpression } from './Node/Expression/BoundIndexExpression';
import { BoundIntegerLiteralExpression } from './Node/Expression/BoundIntegerLiteralExpression';
import { BoundInvokeExpression } from './Node/Expression/BoundInvokeExpression';
import { BoundNewExpression } from './Node/Expression/BoundNewExpression';
import { BoundNullExpression } from './Node/Expression/BoundNullExpression';
import { BoundScopeMemberAccessExpression } from './Node/Expression/BoundScopeMemberAccessExpression';
import { BoundSelfExpression } from './Node/Expression/BoundSelfExpression';
import { BoundSliceExpression } from './Node/Expression/BoundSliceExpression';
import { BoundStringLiteralExpression } from './Node/Expression/BoundStringLiteralExpression';
import { BoundSuperExpression } from './Node/Expression/BoundSuperExpression';
import { BoundUnaryExpression } from './Node/Expression/BoundUnaryExpression';
import { BoundAssignmentStatement } from './Node/Statement/BoundAssignmentStatement';
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
import { FunctionLikeGroupType, FunctionLikeType, isFunctionLike } from './Type/FunctionLikeType';
import { IntType } from './Type/IntType';
import { ModuleType } from './Type/ModuleType';
import { ObjectType } from './Type/ObjectType';
import { StringType } from './Type/StringType';
import { TypeKind } from './Type/TypeKind';
import { TypeParameterType } from './Type/TypeParameterType';
import { Types } from './Type/Types';
import { VoidType } from './Type/VoidType';

export class Binder {
    private document: string = undefined!;
    private project: Project = undefined!;
    private module: BoundModuleDeclaration = undefined!;
    private phase2Nodes: (() => void)[] = undefined!;
    private phase3Nodes: (() => void)[] = undefined!;

    // Debugging aid
    private get filePath() {
        return this.module.declaration.filePath;
    }

    bind(
        moduleDeclaration: ModuleDeclaration,
        project: Project,
        boundDirectory: BoundDirectory,
        moduleIdentifier: string,
    ): BoundModuleDeclaration {
        this.document = moduleDeclaration.document;
        this.project = project;
        this.phase2Nodes = [];
        this.phase3Nodes = [];

        const boundModuleDeclaration = this.bindModuleDeclaration(moduleDeclaration, project, boundDirectory, moduleIdentifier);

        for (const bindNodeInPhase2 of this.phase2Nodes) {
            bindNodeInPhase2();
        }

        for (const bindNodeInPhase3 of this.phase3Nodes) {
            bindNodeInPhase3();
        }

        return boundModuleDeclaration;
    }

    // #region Declarations

    // #region Module declaration

    private bindModuleDeclaration(
        moduleDeclaration: ModuleDeclaration,
        project: Project,
        boundDirectory: BoundDirectory,
        moduleIdentifier: string,
    ): BoundModuleDeclaration {
        const boundModuleDeclaration = new BoundModuleDeclaration();
        this.module = boundModuleDeclaration;
        boundModuleDeclaration.declaration = moduleDeclaration;
        boundModuleDeclaration.project = project;
        boundModuleDeclaration.directory = boundDirectory;

        boundModuleDeclaration.type = new ModuleType();
        const { type } = boundModuleDeclaration;

        const boundSymbol = new BoundSymbol(moduleIdentifier, boundModuleDeclaration);
        boundModuleDeclaration.directory.locals.set(moduleIdentifier, boundSymbol);
        boundModuleDeclaration.identifier = boundSymbol;
        type.identifier = boundModuleDeclaration.identifier;

        boundModuleDeclaration.locals = moduleDeclaration.locals;

        boundModuleDeclaration.members = this.bindModuleDeclarationHeaderMembers(moduleDeclaration, boundModuleDeclaration);
        boundModuleDeclaration.members.push(...this.bindModuleDeclarationMembers(moduleDeclaration, boundModuleDeclaration));
        this.setMemberTypes(type, boundModuleDeclaration.members);

        return boundModuleDeclaration;
    }

    private bindModuleDeclarationHeaderMembers(
        moduleDeclaration: ModuleDeclaration,
        parent: BoundNodes,
    ): BoundModuleDeclarationMember[] {
        const boundHeaderMembers: BoundModuleDeclarationMember[] = [];

        for (const member of moduleDeclaration.headerMembers) {
            switch (member.kind) {
                case NodeKind.ImportStatement: {
                    const boundImportStatement = this.bindImportStatement(member, parent);
                    boundHeaderMembers.push(boundImportStatement);
                    break;
                }
                case NodeKind.FriendDirective:
                case NodeKind.AccessibilityDirective: {
                    throw new Error('Method not implemented.');
                }
                case NodeKind.AliasDirectiveSequence: {
                    const boundAliasDirectives = this.bindAliasDirectiveSequence(member, parent);
                    boundHeaderMembers.push(...boundAliasDirectives);
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

        return boundHeaderMembers;
    }

    private bindModuleDeclarationMembers(
        moduleDeclaration: ModuleDeclaration,
        parent: BoundNodes,
    ): BoundModuleDeclarationMember[] {
        const boundModuleDeclarationMembers: BoundModuleDeclarationMember[] = [];

        for (const moduleDeclarationMember of moduleDeclaration.members) {
            switch (moduleDeclarationMember.kind) {
                case NodeKind.AccessibilityDirective: {
                    this.bindAccessibilityDirective(moduleDeclarationMember);
                    break;
                }
                case NodeKind.ExternDataDeclarationSequence: {
                    const boundExternDataDeclarations = this.bindExternDataDeclarationSequence(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.push(...boundExternDataDeclarations);
                    break;
                }
                case NodeKind.ExternFunctionDeclaration: {
                    const boundExternFunctionDeclaration = this.bindExternFunctionDeclaration(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.push(boundExternFunctionDeclaration);
                    break;
                }
                case NodeKind.ExternClassDeclaration: {
                    const boundExternClassDeclaration = this.bindExternClassDeclaration(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.push(boundExternClassDeclaration);
                    break;
                }
                case NodeKind.DataDeclarationSequence: {
                    const boundDataDeclarationSequence = this.bindDataDeclarationSequence(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.push(...boundDataDeclarationSequence);
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    const boundFunctionDeclaration = this.bindFunctionDeclaration(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.push(boundFunctionDeclaration);
                    break;
                }
                case NodeKind.InterfaceDeclaration: {
                    const boundInterfaceDeclaration = this.bindInterfaceDeclaration(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.push(boundInterfaceDeclaration);
                    break;
                }
                case NodeKind.ClassDeclaration: {
                    const boundClassDeclaration = this.bindClassDeclaration(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.push(boundClassDeclaration);
                    break;
                }
                case TokenKind.Newline:
                case TokenKind.Skipped: {
                    break;
                }
                default: {
                    assertNever(moduleDeclarationMember);
                    break;
                }
            }
        }

        return boundModuleDeclarationMembers;
    }

    // #endregion

    // #region Import statement

    private bindImportStatement(
        importStatement: ImportStatement,
        parent: BoundNodes,
    ): BoundImportStatement {
        const boundImportStatement = new BoundImportStatement();
        boundImportStatement.parent = parent;

        const { path } = importStatement;
        switch (path.kind) {
            case NodeKind.StringLiteralExpression: {
                boundImportStatement.path = this.bindStringLiteralExpression(boundImportStatement);
                break;
            }
            case NodeKind.ModulePath: {
                boundImportStatement.path = this.bindModulePath(path, boundImportStatement);
                break;
            }
            case TokenKind.Missing: { break; }
            default: {
                assertNever(path);
                break;
            }
        }

        return boundImportStatement;
    }

    // #endregion

    // #region Module path

    private bindModulePath(
        modulePath: ModulePath,
        parent: BoundNodes,
    ): BoundModulePath {
        const boundModulePath = new BoundModulePath();
        boundModulePath.parent = parent;

        const { moduleIdentifier } = modulePath;
        switch (moduleIdentifier.kind) {
            case TokenKind.Identifier: {
                const { project } = this.module;
                const modulePathComponents = project.getModulePathComponents(modulePath.children, this.document);
                const moduleIdentifier = modulePath.moduleIdentifier.getText(this.document);
                const boundTargetModuleDirectory = project.resolveModuleDirectory(this.module.directory.fullPath, modulePathComponents, moduleIdentifier);
                if (!boundTargetModuleDirectory) {
                    const pathComponents = [
                        ...modulePathComponents,
                        moduleIdentifier,
                    ];

                    throw new Error(`Could not resolve '${pathComponents.join('.')}'.`);
                }

                const targetModulePath = path.resolve(boundTargetModuleDirectory.fullPath, moduleIdentifier + FILE_EXTENSION);
                const boundTargetModule = project.importModule(targetModulePath);
                const moduleReference = new ModuleReference(boundTargetModule);
                boundModulePath.moduleIdentifier = moduleReference;
                break;
            }
            case TokenKind.Missing: {
                throw new Error('Method not implemented.');
            }
            default: {
                assertNever(moduleIdentifier);
                break;
            }
        }

        return boundModulePath;
    }

    // #endregion

    // #region Alias directive sequence

    private bindAliasDirectiveSequence(
        aliasDirectiveSequence: AliasDirectiveSequence,
        parent: BoundNodes,
    ): BoundAliasDirective[] {
        const boundAliasDirectives: BoundAliasDirective[] = [];

        for (const aliasDirective of aliasDirectiveSequence.children) {
            switch (aliasDirective.kind) {
                case NodeKind.AliasDirective: {
                    const boundAliasDirective = this.bindAliasDirective(aliasDirective, parent);
                    boundAliasDirectives.push(boundAliasDirective);
                    break;
                }
                case NodeKind.CommaSeparator: { break; }
                default: {
                    assertNever(aliasDirective);
                    break;
                }
            }
        }

        return boundAliasDirectives;
    }

    private bindAliasDirective(
        aliasDirective: AliasDirective,
        parent: BoundNodes,
    ): BoundAliasDirective {
        const boundAliasDirective = new BoundAliasDirective();
        boundAliasDirective.parent = parent;
        boundAliasDirective.moduleIdentifier = aliasDirective.moduleIdentifier;
        boundAliasDirective.typeIdentifier = aliasDirective.typeIdentifier;

        const { target } = aliasDirective;
        switch (target.kind) {
            case NodeKind.EscapedIdentifier:
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.IntKeyword:
            case TokenKind.FloatKeyword:
            case TokenKind.StringKeyword: {
                boundAliasDirective.target = target;
                break;
            }
            case TokenKind.Missing: { break; }
            default: {
                assertNever(target);
                break;
            }
        }

        return boundAliasDirective;
    }

    // #endregion

    // #region Accessibility directive

    private bindAccessibilityDirective(
        accessibilityDirective: AccessibilityDirective,
    ): void {
        const { accessibilityKeyword } = accessibilityDirective;
        switch (accessibilityKeyword.kind) {
            case TokenKind.PrivateKeyword:
            case TokenKind.PublicKeyword:
            case TokenKind.ProtectedKeyword: {
                console.warn(`'${accessibilityKeyword.kind}' directive is not implemented.`);
                break;
            }
            case TokenKind.ExternKeyword: {
                // Extern is handled by the parser but is it also implicitly public?
                // If it does, encountering extern while private would require special handling.

                if (accessibilityDirective.externPrivateKeyword) {
                    throw new Error('Method not implemented.');
                }
                break;
            }
            default: {
                assertNever(accessibilityKeyword);
                break;
            }
        }
    }

    // #endregion

    // #region Extern data declaration sequence

    private bindExternDataDeclarationSequence(
        externDataDeclarationSequence: ExternDataDeclarationSequence,
        parent: BoundNodes,
    ): BoundExternDataDeclaration[] {
        const boundExternDataDeclarations: BoundExternDataDeclaration[] = [];

        for (const externDataDeclaration of externDataDeclarationSequence.children) {
            switch (externDataDeclaration.kind) {
                case NodeKind.ExternDataDeclaration: {
                    const boundExternDataDeclaration = this.bindExternDataDeclaration(externDataDeclaration, parent, externDataDeclarationSequence.dataDeclarationKeyword);
                    boundExternDataDeclarations.push(boundExternDataDeclaration);
                    break;
                }
                case NodeKind.CommaSeparator: { break; }
                default: {
                    assertNever(externDataDeclaration);
                    break;
                }
            }
        }

        return boundExternDataDeclarations;
    }

    private bindExternDataDeclaration(
        externDataDeclaration: ExternDataDeclaration,
        parent: BoundNodes,
        dataDeclarationKeyword: ExternDataDeclarationKeywordToken,
    ): BoundExternDataDeclaration {
        const boundExternDataDeclaration = new BoundExternDataDeclaration();
        boundExternDataDeclaration.parent = parent;
        boundExternDataDeclaration.declarationKind = dataDeclarationKeyword.kind;
        boundExternDataDeclaration.identifier = this.declareSymbolInScope(externDataDeclaration, boundExternDataDeclaration);
        boundExternDataDeclaration.type = this.bindTypeAnnotation(externDataDeclaration.type);
        if (externDataDeclaration.nativeSymbol) {
            boundExternDataDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternDataDeclaration);
        }

        return boundExternDataDeclaration;
    }

    // #endregion

    // #region Extern function declaration

    private bindExternFunctionDeclaration(
        externFunctionDeclaration: ExternFunctionDeclaration,
        parent: BoundNodes,
    ): BoundExternFunctionDeclaration {
        const boundExternFunctionDeclaration = new BoundExternFunctionDeclaration();
        boundExternFunctionDeclaration.parent = parent;
        boundExternFunctionDeclaration.locals = externFunctionDeclaration.locals;

        boundExternFunctionDeclaration.type = new FunctionLikeType();
        const { type } = boundExternFunctionDeclaration;

        boundExternFunctionDeclaration.identifier = this.declareSymbolInScope(externFunctionDeclaration, boundExternFunctionDeclaration);
        type.identifier = boundExternFunctionDeclaration.identifier;
        boundExternFunctionDeclaration.returnType = this.bindTypeAnnotation(externFunctionDeclaration.returnType);
        type.returnType = boundExternFunctionDeclaration.returnType;

        boundExternFunctionDeclaration.parameters = this.bindDataDeclarationSequence(externFunctionDeclaration.parameters, boundExternFunctionDeclaration);
        const parameters: Types[] = [];
        for (const parameter of boundExternFunctionDeclaration.parameters) {
            parameters.push(parameter.type);
        }
        type.parameters = parameters;

        if (externFunctionDeclaration.nativeSymbol) {
            boundExternFunctionDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternFunctionDeclaration);
        }

        return boundExternFunctionDeclaration;
    }

    // #endregion

    // #region Extern class declaration

    private bindExternClassDeclaration(
        externClassDeclaration: ExternClassDeclaration,
        parent: BoundNodes,
    ): BoundExternClassDeclaration {
        const boundExternClassDeclaration = new BoundExternClassDeclaration();
        boundExternClassDeclaration.declaration = externClassDeclaration;
        boundExternClassDeclaration.parent = parent;
        boundExternClassDeclaration.locals = externClassDeclaration.locals;

        const name = this.getDeclarationName(externClassDeclaration, this.document);
        if (name === 'String') {
            boundExternClassDeclaration.type = this.project.stringType;
        } else {
            boundExternClassDeclaration.type = new ObjectType();
        }

        const { type } = boundExternClassDeclaration;

        boundExternClassDeclaration.identifier = this.declareSymbolInScope(externClassDeclaration, boundExternClassDeclaration);
        type.identifier = boundExternClassDeclaration.identifier;

        if (externClassDeclaration.nativeSymbol) {
            boundExternClassDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternClassDeclaration);
        }

        this.phase2Nodes.push(() => this.bindExternClassDeclaration2(externClassDeclaration, boundExternClassDeclaration));

        return boundExternClassDeclaration;
    }

    private bindExternClassDeclaration2(
        externClassDeclaration: ExternClassDeclaration,
        boundExternClassDeclaration: BoundExternClassDeclaration,
    ): void {
        const { type } = boundExternClassDeclaration;

        const { baseType } = externClassDeclaration;
        if (!baseType) {
            boundExternClassDeclaration.baseType = ObjectType.type;
        } else {
            switch (baseType.kind) {
                case NodeKind.TypeReference: {
                    boundExternClassDeclaration.baseType = this.bindTypeReference(baseType) as ObjectType;
                    break;
                }
                case TokenKind.NullKeyword:
                case TokenKind.Missing: {
                    break;
                }
                default: {
                    assertNever(baseType);
                    break;
                }
            }
        }

        type.superType = boundExternClassDeclaration.baseType;

        boundExternClassDeclaration.members = this.bindExternClassDeclarationMembers(externClassDeclaration, boundExternClassDeclaration);
        this.setMemberTypes(type, boundExternClassDeclaration.members);
    }

    private bindExternClassDeclarationMembers(
        externClassDeclaration: ExternClassDeclaration,
        parent: BoundNodes,
    ): BoundExternClassDeclarationMember[] {
        const boundExternClassDeclarationMembers: BoundExternClassDeclarationMember[] = [];

        for (const externClassDeclarationMember of externClassDeclaration.members) {
            switch (externClassDeclarationMember.kind) {
                case NodeKind.AccessibilityDirective: {
                    throw new Error('Method not implemented.');
                }
                case NodeKind.ExternDataDeclarationSequence: {
                    const boundExternDataDeclarations = this.bindExternDataDeclarationSequence(externClassDeclarationMember, parent);
                    boundExternClassDeclarationMembers.push(...boundExternDataDeclarations);
                    break;
                }
                case NodeKind.ExternFunctionDeclaration: {
                    const boundExternFunctionDeclaration = this.bindExternFunctionDeclaration(externClassDeclarationMember, parent);
                    boundExternClassDeclarationMembers.push(boundExternFunctionDeclaration);
                    break;
                }
                case NodeKind.ExternClassMethodDeclaration: {
                    const boundExternClassMethodDeclaration = this.bindExternClassMethodDeclaration(externClassDeclarationMember, parent);
                    boundExternClassDeclarationMembers.push(boundExternClassMethodDeclaration);
                    break;
                }
                case TokenKind.Newline:
                case TokenKind.Skipped: {
                    break;
                }
                default: {
                    assertNever(externClassDeclarationMember);
                    break;
                }
            }
        }

        return boundExternClassDeclarationMembers;
    }

    // #region Extern class method declaration

    private bindExternClassMethodDeclaration(
        externClassMethodDeclaration: ExternClassMethodDeclaration,
        parent: BoundNodes,
    ): BoundExternClassMethodDeclaration {
        const boundExternClassMethodDeclaration = new BoundExternClassMethodDeclaration();
        boundExternClassMethodDeclaration.parent = parent;
        boundExternClassMethodDeclaration.locals = externClassMethodDeclaration.locals;

        boundExternClassMethodDeclaration.type = new FunctionLikeType();
        const { type } = boundExternClassMethodDeclaration;

        boundExternClassMethodDeclaration.identifier = this.declareSymbolInScope(externClassMethodDeclaration, boundExternClassMethodDeclaration);
        type.identifier = boundExternClassMethodDeclaration.identifier;
        boundExternClassMethodDeclaration.returnType = this.bindTypeAnnotation(externClassMethodDeclaration.returnType);
        type.returnType = boundExternClassMethodDeclaration.returnType;

        boundExternClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(externClassMethodDeclaration.parameters, boundExternClassMethodDeclaration);
        const parameters: Types[] = [];
        for (const parameter of boundExternClassMethodDeclaration.parameters) {
            parameters.push(parameter.type);
        }
        type.parameters = parameters;

        if (externClassMethodDeclaration.nativeSymbol) {
            boundExternClassMethodDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternClassMethodDeclaration);
        }

        return boundExternClassMethodDeclaration;
    }

    // #endregion

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

        boundDataDeclaration.identifier = this.declareSymbolInScope(dataDeclaration, boundDataDeclaration);

        switch (parent.kind) {
            case BoundNodeKind.ExternClassDeclaration:
            case BoundNodeKind.InterfaceDeclaration:
            case BoundNodeKind.ClassDeclaration: {
                this.phase2Nodes.push(() => {
                    this.bindDataDeclaration2(dataDeclaration, boundDataDeclaration);
                    parent.type.members.set(
                        boundDataDeclaration.identifier.name,
                        boundDataDeclaration.type,
                    );
                });
                break;
            }
            default: {
                this.bindDataDeclaration2(dataDeclaration, boundDataDeclaration);
                break;
            }
        }

        return boundDataDeclaration;
    }

    private bindDataDeclaration2(
        dataDeclaration: DataDeclaration,
        boundDataDeclaration: BoundDataDeclaration,
    ): void {
        // TODO: Should this be lowered to an assignment expression?
        if (dataDeclaration.expression) {
            boundDataDeclaration.expression = this.bindExpression(dataDeclaration.expression, boundDataDeclaration);
        }

        if (dataDeclaration.eachInKeyword) {
            if (dataDeclaration.equalsSign &&
                dataDeclaration.equalsSign.kind === TokenKind.ColonEqualsSign
            ) {
                if (!boundDataDeclaration.expression) {
                    // No expression to infer type from, default to Int
                    boundDataDeclaration.type = IntType.type;
                } else {
                    boundDataDeclaration.type = this.getCollectionElementType(boundDataDeclaration.expression.type);
                }
            } else {
                boundDataDeclaration.type = this.bindTypeAnnotation(dataDeclaration.type);

                if (boundDataDeclaration.expression) {
                    const collectionElementType = this.getCollectionElementType(boundDataDeclaration.expression.type);
                    if (!collectionElementType.isConvertibleTo(boundDataDeclaration.type)) {
                        throw new Error(`'${collectionElementType}' is not convertible to '${boundDataDeclaration.type}'.`);
                    }
                }
            }
        } else {
            if (dataDeclaration.equalsSign &&
                dataDeclaration.equalsSign.kind === TokenKind.ColonEqualsSign
            ) {
                if (!boundDataDeclaration.expression) {
                    // No expression to infer type from, default to Int
                    boundDataDeclaration.type = IntType.type;
                } else {
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
        }
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
        boundFunctionDeclaration.locals = functionDeclaration.locals;

        boundFunctionDeclaration.type = new FunctionLikeType();
        const { type } = boundFunctionDeclaration;

        boundFunctionDeclaration.identifier = this.declareSymbolInScope(functionDeclaration, boundFunctionDeclaration);
        type.identifier = boundFunctionDeclaration.identifier;
        boundFunctionDeclaration.returnType = this.bindTypeAnnotation(functionDeclaration.returnType);
        type.returnType = boundFunctionDeclaration.returnType;

        boundFunctionDeclaration.parameters = this.bindDataDeclarationSequence(functionDeclaration.parameters, boundFunctionDeclaration);
        const parameters: Types[] = [];
        for (const parameter of boundFunctionDeclaration.parameters) {
            parameters.push(parameter.type);
        }
        type.parameters = parameters;

        this.phase3Nodes.push(() => this.bindFunctionDeclaration3(functionDeclaration, boundFunctionDeclaration));

        return boundFunctionDeclaration;
    }

    private bindFunctionDeclaration3(
        functionDeclaration: FunctionDeclaration,
        boundFunctionDeclaration: BoundFunctionDeclaration,
    ): void {
        boundFunctionDeclaration.statements = this.bindStatements(functionDeclaration.statements, boundFunctionDeclaration);
    }

    // #endregion

    // #region Interface declaration

    private bindInterfaceDeclaration(
        interfaceDeclaration: InterfaceDeclaration,
        parent: BoundNodes,
    ): BoundInterfaceDeclaration {
        const boundInterfaceDeclaration = new BoundInterfaceDeclaration();
        boundInterfaceDeclaration.declaration = interfaceDeclaration;
        boundInterfaceDeclaration.parent = parent;
        boundInterfaceDeclaration.locals = interfaceDeclaration.locals;

        boundInterfaceDeclaration.type = new ObjectType();
        const { type } = boundInterfaceDeclaration;

        boundInterfaceDeclaration.identifier = this.declareSymbolInScope(interfaceDeclaration, boundInterfaceDeclaration);
        type.identifier = boundInterfaceDeclaration.identifier;

        this.phase2Nodes.push(() => this.bindInterfaceDeclaration2(interfaceDeclaration, boundInterfaceDeclaration));

        return boundInterfaceDeclaration;
    }

    private bindInterfaceDeclaration2(
        interfaceDeclaration: InterfaceDeclaration,
        boundInterfaceDeclaration: BoundInterfaceDeclaration,
    ): void {
        const { type } = boundInterfaceDeclaration;

        if (interfaceDeclaration.baseTypes) {
            boundInterfaceDeclaration.baseTypes = this.bindTypeReferenceSequence(interfaceDeclaration.baseTypes) as ObjectType[];
        }

        boundInterfaceDeclaration.members = this.bindInterfaceDeclarationMembers(interfaceDeclaration, boundInterfaceDeclaration);
        this.setMemberTypes(type, boundInterfaceDeclaration.members);
    }

    private bindInterfaceDeclarationMembers(
        interfaceDeclaration: InterfaceDeclaration,
        parent: BoundNodes,
    ): BoundInterfaceDeclarationMember[] {
        const boundInterfaceDeclarationMembers: BoundInterfaceDeclarationMember[] = [];

        for (const interfaceDeclarationMember of interfaceDeclaration.members) {
            switch (interfaceDeclarationMember.kind) {
                case NodeKind.DataDeclarationSequence: {
                    const boundDataDeclarations = this.bindDataDeclarationSequence(interfaceDeclarationMember, parent);
                    boundInterfaceDeclarationMembers.push(...boundDataDeclarations);
                    break;
                }
                case NodeKind.InterfaceMethodDeclaration: {
                    const boundInterfaceMethodDeclaration = this.bindInterfaceMethodDeclaration(interfaceDeclarationMember, parent);
                    boundInterfaceDeclarationMembers.push(boundInterfaceMethodDeclaration);
                    break;
                }
                case TokenKind.Newline:
                case TokenKind.Skipped: {
                    break;
                }
                default: {
                    assertNever(interfaceDeclarationMember);
                    break;
                }
            }
        }

        return boundInterfaceDeclarationMembers;
    }

    // #region Interface method declaration

    private bindInterfaceMethodDeclaration(
        interfaceMethodDeclaration: InterfaceMethodDeclaration,
        parent: BoundNodes,
    ): BoundInterfaceMethodDeclaration {
        const boundInterfaceMethodDeclaration = new BoundInterfaceMethodDeclaration();
        boundInterfaceMethodDeclaration.parent = parent;
        boundInterfaceMethodDeclaration.locals = interfaceMethodDeclaration.locals;

        boundInterfaceMethodDeclaration.type = new FunctionLikeType();
        const { type } = boundInterfaceMethodDeclaration;

        boundInterfaceMethodDeclaration.identifier = this.declareSymbolInScope(interfaceMethodDeclaration, boundInterfaceMethodDeclaration);
        type.identifier = boundInterfaceMethodDeclaration.identifier;
        boundInterfaceMethodDeclaration.returnType = this.bindTypeAnnotation(interfaceMethodDeclaration.returnType);
        type.returnType = boundInterfaceMethodDeclaration.returnType;

        boundInterfaceMethodDeclaration.parameters = this.bindDataDeclarationSequence(interfaceMethodDeclaration.parameters, boundInterfaceMethodDeclaration);
        const parameters: Types[] = [];
        for (const parameter of boundInterfaceMethodDeclaration.parameters) {
            parameters.push(parameter.type);
        }
        type.parameters = parameters;

        return boundInterfaceMethodDeclaration;
    }

    // #endregion

    // #endregion

    // #region Class declaration

    private bindClassDeclaration(
        classDeclaration: ClassDeclaration,
        parent: BoundNodes,
    ): BoundClassDeclaration {
        const boundClassDeclaration = new BoundClassDeclaration();
        boundClassDeclaration.declaration = classDeclaration;
        boundClassDeclaration.parent = parent;
        boundClassDeclaration.locals = classDeclaration.locals;

        boundClassDeclaration.type = new ObjectType();
        const { type } = boundClassDeclaration;

        boundClassDeclaration.identifier = this.declareSymbolInScope(classDeclaration, boundClassDeclaration);
        type.identifier = boundClassDeclaration.identifier;

        if (classDeclaration.typeParameters) {
            boundClassDeclaration.typeParameters = this.bindTypeParameters(classDeclaration.typeParameters, boundClassDeclaration);

            const typeParameters: TypeParameterType[] = [];
            for (const typeParameter of boundClassDeclaration.typeParameters) {
                typeParameters.push(typeParameter.type);
            }
            type.typeParameters = typeParameters;
        }

        this.phase2Nodes.push(() => this.bindClassDeclaration2(classDeclaration, boundClassDeclaration));

        return boundClassDeclaration;
    }

    private bindClassDeclaration2(
        classDeclaration: ClassDeclaration,
        boundClassDeclaration: BoundClassDeclaration,
    ): void {
        const { type } = boundClassDeclaration;

        if (classDeclaration.baseType) {
            if (classDeclaration.baseType.kind === NodeKind.TypeReference) {
                boundClassDeclaration.baseType = this.bindTypeReference(classDeclaration.baseType) as ObjectType;
            }
        } else {
            boundClassDeclaration.baseType = ObjectType.type;
        }
        type.superType = boundClassDeclaration.baseType;

        if (classDeclaration.implementedTypes) {
            boundClassDeclaration.implementedTypes = this.bindTypeReferenceSequence(classDeclaration.implementedTypes) as ObjectType[];
        }

        boundClassDeclaration.members = this.bindClassDeclarationMembers(classDeclaration, boundClassDeclaration);

        if (!this.hasParameterlessConstructor(boundClassDeclaration)) {
            const boundClassMethodDeclaration = this.createParameterlessConstructor(classDeclaration, boundClassDeclaration);
            boundClassDeclaration.members.push(boundClassMethodDeclaration);
        }

        this.setMemberTypes(type, boundClassDeclaration.members);
    }

    // #region Type parameters

    private bindTypeParameters(
        typeParameters: (TypeParameter | CommaSeparator)[],
        parent: BoundClassDeclaration,
    ): BoundTypeParameter[] {
        const boundTypeParameters: BoundTypeParameter[] = [];

        for (const typeParameter of typeParameters) {
            switch (typeParameter.kind) {
                case NodeKind.TypeParameter: {
                    const boundTypeParameter = this.bindTypeParameter(typeParameter, parent);
                    boundTypeParameters.push(boundTypeParameter);
                    break;
                }
                case NodeKind.CommaSeparator: { break; }
                default: {
                    assertNever(typeParameter);
                    break;
                }
            }
        }

        return boundTypeParameters;
    }

    private bindTypeParameter(
        typeParameter: TypeParameter,
        parent: BoundClassDeclaration,
    ): BoundTypeParameter {
        const boundTypeParameter = new BoundTypeParameter();
        boundTypeParameter.parent = parent;

        boundTypeParameter.type = new TypeParameterType();
        const { type } = boundTypeParameter;
        type.parent = parent.type;

        boundTypeParameter.identifier = this.declareSymbolInScope(typeParameter, boundTypeParameter);
        type.identifier = boundTypeParameter.identifier;

        return boundTypeParameter;
    }

    // #endregion

    private bindClassDeclarationMembers(
        classDeclaration: ClassDeclaration,
        parent: BoundClassDeclaration,
    ): BoundClassDeclarationMember[] {
        const boundClassDeclarationMembers: BoundClassDeclarationMember[] = [];

        for (const classDeclarationMember of classDeclaration.members) {
            switch (classDeclarationMember.kind) {
                case NodeKind.AccessibilityDirective: {
                    console.warn(`'${classDeclarationMember.accessibilityKeyword.kind}' directive is not implemented.`);
                    break;
                }
                case NodeKind.DataDeclarationSequence: {
                    const boundDataDeclarationSequence = this.bindDataDeclarationSequence(classDeclarationMember, parent);
                    boundClassDeclarationMembers.push(...boundDataDeclarationSequence);
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    const boundFunctionDeclaration = this.bindFunctionDeclaration(classDeclarationMember, parent);
                    boundClassDeclarationMembers.push(boundFunctionDeclaration);
                    break;
                }
                case NodeKind.ClassMethodDeclaration: {
                    const boundClassMethodDeclaration = this.bindClassMethodDeclaration(classDeclarationMember, parent);
                    boundClassDeclarationMembers.push(boundClassMethodDeclaration);
                    break;
                }
                case TokenKind.Newline:
                case TokenKind.Skipped: {
                    break;
                }
                default: {
                    assertNever(classDeclarationMember);
                    break;
                }
            }
        }

        return boundClassDeclarationMembers;
    }

    // #region Default constructor

    private hasParameterlessConstructor(boundClassDeclaration: BoundClassDeclaration): boolean {
        for (const member of boundClassDeclaration.members) {
            if (member.kind === BoundNodeKind.ClassMethodDeclaration &&
                member.identifier.name.toLowerCase() === 'new' &&
                member.parameters.length === 0
            ) {
                return true;
            }
        }

        return false;
    }

    private createParameterlessConstructor(
        classDeclaration: ClassDeclaration,
        parent: BoundClassDeclaration,
    ): BoundClassMethodDeclaration {
        const boundClassMethodDeclaration = new BoundClassMethodDeclaration();
        boundClassMethodDeclaration.parent = parent;
        boundClassMethodDeclaration.locals = new BoundSymbolTable();

        boundClassMethodDeclaration.type = new FunctionLikeType();
        const { type } = boundClassMethodDeclaration;

        boundClassMethodDeclaration.identifier = this.setSymbolInScope('New', classDeclaration, boundClassMethodDeclaration);
        type.identifier = boundClassMethodDeclaration.identifier;
        boundClassMethodDeclaration.returnType = parent.type;
        type.returnType = boundClassMethodDeclaration.returnType;

        boundClassMethodDeclaration.parameters = [];
        type.parameters = [];

        return boundClassMethodDeclaration;
    }

    // #endregion

    // #region Class method declaration

    private bindClassMethodDeclaration(
        classMethodDeclaration: ClassMethodDeclaration,
        parent: BoundClassDeclaration,
    ): BoundClassMethodDeclaration {
        const boundClassMethodDeclaration = new BoundClassMethodDeclaration();
        boundClassMethodDeclaration.parent = parent;
        boundClassMethodDeclaration.locals = classMethodDeclaration.locals;

        boundClassMethodDeclaration.type = new FunctionLikeType();
        const { type } = boundClassMethodDeclaration;

        boundClassMethodDeclaration.identifier = this.declareSymbolInScope(classMethodDeclaration, boundClassMethodDeclaration);
        type.identifier = boundClassMethodDeclaration.identifier;

        if (boundClassMethodDeclaration.identifier.name.toLowerCase() === 'new') {
            boundClassMethodDeclaration.returnType = parent.type;
        } else {
            boundClassMethodDeclaration.returnType = this.bindTypeAnnotation(classMethodDeclaration.returnType);
        }
        type.returnType = boundClassMethodDeclaration.returnType;

        boundClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(classMethodDeclaration.parameters, boundClassMethodDeclaration);
        const parameters: Types[] = [];
        for (const parameter of boundClassMethodDeclaration.parameters) {
            parameters.push(parameter.type);
        }
        type.parameters = parameters;

        if (classMethodDeclaration.statements) {
            this.phase3Nodes.push(() => this.bindClassMethodDeclaration3(classMethodDeclaration, boundClassMethodDeclaration));
        }

        return boundClassMethodDeclaration;
    }

    private bindClassMethodDeclaration3(
        classMethodDeclaration: ClassMethodDeclaration,
        boundClassMethodDeclaration: BoundClassMethodDeclaration,
    ): void {
        boundClassMethodDeclaration.statements = this.bindStatements(classMethodDeclaration.statements!, boundClassMethodDeclaration);
    }

    // #endregion

    // #endregion

    // #endregion

    // #region Statements

    private bindStatements(
        statements: (Statements | SkippedToken)[],
        parent: BoundNodes,
    ): BoundStatements[] {
        const boundStatements: BoundStatements[] = [];

        for (const statement of statements) {
            switch (statement.kind) {
                case NodeKind.DataDeclarationSequenceStatement: {
                    const boundDataDeclarations = this.bindDataDeclarationSequenceStatement(statement, parent);
                    boundStatements.push(...boundDataDeclarations);
                    break;
                }
                case NodeKind.ReturnStatement: {
                    const boundReturnStatement = this.bindReturnStatement(statement, parent);
                    boundStatements.push(boundReturnStatement);
                    break;
                }
                case NodeKind.IfStatement: {
                    const boundIfStatement = this.bindIfStatement(statement, parent);
                    boundStatements.push(boundIfStatement);
                    break;
                }
                case NodeKind.SelectStatement: {
                    const boundSelectStatement = this.bindSelectStatement(statement, parent);
                    boundStatements.push(boundSelectStatement);
                    break;
                }
                case NodeKind.WhileLoop: {
                    const boundWhileLoop = this.bindWhileLoop(statement, parent);
                    boundStatements.push(boundWhileLoop);
                    break;
                }
                case NodeKind.RepeatLoop: {
                    const boundRepeatLoop = this.bindRepeatLoop(statement, parent);
                    boundStatements.push(boundRepeatLoop);
                    break;
                }
                case NodeKind.ForLoop: {
                    const boundForLoop = this.bindForLoop(statement, parent);
                    boundStatements.push(boundForLoop);
                    break;
                }
                case NodeKind.ContinueStatement: {
                    const boundContinueStatement = this.bindContinueStatement(parent);
                    boundStatements.push(boundContinueStatement);
                    break;
                }
                case NodeKind.ExitStatement: {
                    const boundExitStatement = this.bindExitStatement(parent);
                    boundStatements.push(boundExitStatement);
                    break;
                }
                case NodeKind.ThrowStatement: {
                    const boundThrowStatement = this.bindThrowStatement(statement, parent);
                    boundStatements.push(boundThrowStatement);
                    break;
                }
                case NodeKind.TryStatement: {
                    const boundTryStatement = this.bindTryStatement(statement, parent);
                    boundStatements.push(boundTryStatement);
                    break;
                }
                case NodeKind.AssignmentStatement: {
                    const boundAssignmentStatement = this.bindAssignmentStatement(statement, parent);
                    boundStatements.push(boundAssignmentStatement);
                    break;
                }
                case NodeKind.ExpressionStatement: {
                    const boundExpressionStatement = this.bindExpressionStatement(statement, parent);
                    boundStatements.push(boundExpressionStatement);
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

        const functionOrMethod = this.getNearestAncestor(boundReturnStatement,
            BoundNodeKind.FunctionDeclaration,
            BoundNodeKind.ClassMethodDeclaration,
        ) as BoundFunctionDeclaration | BoundClassMethodDeclaration;

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
        boundIfStatement.locals = ifStatement.locals;
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
        parent: BoundNodes,
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
        parent: BoundNodes,
    ): BoundElseIfClause {
        const boundElseIfClause = new BoundElseIfClause();
        boundElseIfClause.parent = parent;
        boundElseIfClause.locals = elseifClause.locals;
        boundElseIfClause.expression = this.bindExpression(elseifClause.expression, boundElseIfClause);
        boundElseIfClause.statements = this.bindStatements(elseifClause.statements, boundElseIfClause);

        return boundElseIfClause;
    }

    private bindElseClause(
        elseClause: ElseClause,
        parent: BoundNodes,
    ): BoundElseClause {
        const boundElseClause = new BoundElseClause();
        boundElseClause.parent = parent;
        boundElseClause.locals = elseClause.locals;
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
        parent: BoundNodes,
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
        parent: BoundNodes,
    ): BoundCaseClause {
        const boundCaseClause = new BoundCaseClause();
        boundCaseClause.parent = parent;
        boundCaseClause.locals = caseClause.locals;
        boundCaseClause.expressions = this.bindExpressionSequence(caseClause.expressions, boundCaseClause);
        boundCaseClause.statements = this.bindStatements(caseClause.statements, boundCaseClause);

        return boundCaseClause;
    }

    private bindDefaultClause(
        defaultClause: DefaultClause,
        parent: BoundNodes,
    ): BoundDefaultClause {
        const boundDefaultClause = new BoundDefaultClause();
        boundDefaultClause.parent = parent;
        boundDefaultClause.locals = defaultClause.locals;
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
        boundWhileLoop.locals = whileLoop.locals;
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
        boundRepeatLoop.locals = repeatLoop.locals;
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
        boundForLoop.locals = forLoop.locals;

        const { header } = forLoop;
        switch (header.kind) {
            case NodeKind.NumericForLoopHeader: {
                const { loopVariableStatement } = header;
                switch (loopVariableStatement.kind) {
                    case NodeKind.DataDeclarationSequenceStatement: {
                        boundForLoop.statement = this.bindDataDeclarationSequenceStatement(loopVariableStatement, boundForLoop)[0];
                        break;
                    }
                    case NodeKind.AssignmentStatement: {
                        boundForLoop.statement = this.bindAssignmentStatement(loopVariableStatement, boundForLoop);
                        break;
                    }
                    default: {
                        assertNever(loopVariableStatement);
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
            case NodeKind.AssignmentStatement: {
                boundForLoop.statement = this.bindAssignmentStatement(header, boundForLoop);
                break;
            }
            case TokenKind.Missing: { break; }
            default: {
                assertNever(header);
                break;
            }
        }

        boundForLoop.statements = this.bindStatements(forLoop.statements, boundForLoop);

        return boundForLoop;
    }

    // #endregion

    private bindContinueStatement(
        parent: BoundNodes,
    ): BoundContinueStatement {
        const boundContinueStatement = new BoundContinueStatement();
        boundContinueStatement.parent = parent;

        return boundContinueStatement;
    }

    private bindExitStatement(
        parent: BoundNodes,
    ): BoundExitStatement {
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
        boundTryStatement.locals = tryStatement.locals;
        boundTryStatement.statements = this.bindStatements(tryStatement.statements, boundTryStatement);
        boundTryStatement.catchClauses = this.bindCatchClauses(tryStatement, boundTryStatement);

        return boundTryStatement;
    }

    private bindCatchClauses(
        tryStatement: TryStatement,
        parent: BoundNodes,
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
        parent: BoundNodes,
    ): BoundCatchClause {
        const boundCatchClause = new BoundCatchClause();
        boundCatchClause.parent = parent;
        boundCatchClause.locals = catchClause.locals;

        if (catchClause.parameter.kind === TokenKind.Missing) {
            throw new Error('Catch clause must declare a parameter.');
        } else {
            boundCatchClause.parameter = this.bindDataDeclaration(catchClause.parameter, boundCatchClause);
        }

        boundCatchClause.statements = this.bindStatements(catchClause.statements, boundCatchClause);

        return boundCatchClause;
    }

    // #endregion

    // #region Assignment statement

    private bindAssignmentStatement(
        assignmentStatement: AssignmentStatement,
        parent: BoundNodes,
    ): BoundAssignmentStatement {
        const boundAssignmentStatement = new BoundAssignmentStatement();
        boundAssignmentStatement.parent = parent;
        boundAssignmentStatement.leftOperand = this.bindExpression(assignmentStatement.leftOperand, boundAssignmentStatement);
        boundAssignmentStatement.rightOperand = this.bindExpression(assignmentStatement.rightOperand, boundAssignmentStatement);

        const { leftOperand, rightOperand } = boundAssignmentStatement;

        // Lower update assignments to an assignment of a binary expression
        const operatorKind = assignmentStatement.operator.kind;
        if (operatorKind !== TokenKind.EqualsSign) {
            const boundBinaryExpression = new BoundBinaryExpression();
            boundBinaryExpression.parent = boundAssignmentStatement;
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

            boundAssignmentStatement.rightOperand = boundBinaryExpression;
        }

        switch (leftOperand.kind) {
            case BoundNodeKind.IdentifierExpression:
            case BoundNodeKind.ScopeMemberAccessExpression:
            case BoundNodeKind.IndexExpression: {
                break;
            }
            default: {
                throw new Error(`'${leftOperand.kind}' cannot be assigned to.`);
            }
        }

        if (!rightOperand.type.isConvertibleTo(leftOperand.type)) {
            throw new Error(`'${rightOperand.type}' cannot be converted to '${leftOperand.type}'.`);
        }

        return boundAssignmentStatement;
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
        scope?: MemberContainerType,
    ) {
        switch (expression.kind) {
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
            case NodeKind.GlobalScopeExpression: {
                return this.bindGlobalScopeExpression(parent);
            }
            case NodeKind.IdentifierExpression: {
                return this.bindIdentifierExpression(expression, parent, scope);
            }
            case NodeKind.GroupingExpression: {
                return this.bindGroupingExpression(expression, parent);
            }
            case NodeKind.ScopeMemberAccessExpression: {
                return this.bindScopeMemberAccessExpression(expression, parent, scope);
            }
            case NodeKind.IndexExpression: {
                return this.bindIndexExpression(expression, parent);
            }
            case NodeKind.SliceExpression: {
                return this.bindSliceExpression(expression, parent);
            }
            case NodeKind.InvokeExpression: {
                return this.bindInvokeExpression(expression, parent, scope);
            }
            case TokenKind.Missing: {
                throw new Error('Expression is missing.');
            }
            default: {
                return assertNever(expression);
            }
        }
    }

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
            case this.project.stringType: {
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
            !rightOperand.type.isConvertibleTo(IntType.type)
        ) {
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
                    operatorKind !== TokenKind.LessThanSignGreaterThanSign
                ) {
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
        boundNewExpression.parent = parent;

        const classType = this.bindTypeReference(newExpression.type) as ObjectType;
        const classDeclaration = classType.identifier!.declaration as BoundExternClassDeclaration | BoundClassDeclaration;
        const constructorGroupType = classDeclaration.type.members.get('New')!;

        if (classType.typeParameters) {
            const typeMap = this.createTypeMap(classType.typeParameters, classType.typeArguments!);
            boundNewExpression.type = this.instantiateType(constructorGroupType, typeMap);
        } else {
            boundNewExpression.type = constructorGroupType;
        }

        return boundNewExpression;
    }

    // #endregion

    // #region Null expression

    private bindNullExpression(
        parent: BoundNodes,
    ): BoundNullExpression {
        const boundNullExpression = new BoundNullExpression();
        boundNullExpression.parent = parent;

        return boundNullExpression;
    }

    // #endregion

    // #region Boolean literal expression

    private bindBooleanLiteralExpression(
        parent: BoundNodes,
    ): BoundBooleanLiteralExpression {
        const boundBooleanLiteralExpression = new BoundBooleanLiteralExpression();
        boundBooleanLiteralExpression.parent = parent;

        return boundBooleanLiteralExpression;
    }

    // #endregion

    // #region Self expression

    private bindSelfExpression(
        parent: BoundNodes,
    ): BoundSelfExpression {
        const boundSelfExpression = new BoundSelfExpression();
        boundSelfExpression.parent = parent;

        const ancestor = this.getNearestAncestor(boundSelfExpression,
            BoundNodeKind.ClassDeclaration,
        ) as BoundClassDeclaration;
        boundSelfExpression.type = ancestor.type;

        return boundSelfExpression;
    }

    // #endregion

    // #region Super expression

    private bindSuperExpression(
        parent: BoundNodes,
    ): BoundSuperExpression {
        const boundSuperExpression = new BoundSuperExpression();
        boundSuperExpression.parent = parent;

        const ancestor = this.getNearestAncestor(boundSuperExpression,
            BoundNodeKind.ClassDeclaration,
        ) as BoundClassDeclaration;
        if (!ancestor.baseType) {
            throw new Error(`'${ancestor.identifier.name}' does not extend a base class.`);
        }
        boundSuperExpression.type = ancestor.baseType;

        return boundSuperExpression;
    }

    // #endregion

    // #region String literal expression

    private bindStringLiteralExpression(
        parent: BoundNodes,
    ): BoundStringLiteralExpression {
        const boundStringLiteralExpression = new BoundStringLiteralExpression();
        boundStringLiteralExpression.parent = parent;
        boundStringLiteralExpression.type = this.project.stringType;

        return boundStringLiteralExpression;
    }

    // #endregion

    // #region Float literal expression

    private bindFloatLiteralExpression(
        parent: BoundNodes,
    ): BoundFloatLiteralExpression {
        const boundFloatLiteralExpression = new BoundFloatLiteralExpression();
        boundFloatLiteralExpression.parent = parent;

        return boundFloatLiteralExpression;
    }

    // #endregion

    // #region Integer literal expression

    private bindIntegerLiteralExpression(
        parent: BoundNodes,
    ): BoundIntegerLiteralExpression {
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

        boundArrayLiteralExpression.type = this.bindArrayType(type);

        return boundArrayLiteralExpression;
    }

    // #endregion

    // #region Global scope expression

    private bindGlobalScopeExpression(
        parent: BoundNodes,
    ): BoundGlobalScopeExpression {
        const boundGlobalScopeExpression = new BoundGlobalScopeExpression();
        boundGlobalScopeExpression.parent = parent;
        boundGlobalScopeExpression.type = this.module.type;

        return boundGlobalScopeExpression;
    }

    // #endregion

    // #region Identifier expression

    private bindIdentifierExpression(
        identifierExpression: IdentifierExpression,
        parent: BoundNodes,
        scope?: MemberContainerType,
    ): BoundIdentifierExpression {
        const boundIdentifierExpression = new BoundIdentifierExpression();
        boundIdentifierExpression.parent = parent;

        const { identifier } = identifierExpression;
        switch (identifier.kind) {
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword: {
                // Called when binding `member` on `ScopeMemberAccessExpression`.
                if (scope) {
                    const identifierText = identifier.getText(this.document);
                    const memberType = scope.members.get(identifierText);
                    if (!memberType) {
                        const scopeIdentifierText = scope.identifier!.name;

                        throw new Error(`'${identifierText}' does not exist on '${scopeIdentifierText}'.`);
                    }

                    const scopeDeclaration = scope.identifier.declaration!;
                    switch (scopeDeclaration.kind) {
                        case BoundNodeKind.ModuleDeclaration:
                        case BoundNodeKind.ExternClassDeclaration:
                        case BoundNodeKind.InterfaceDeclaration:
                        case BoundNodeKind.ClassDeclaration: {
                            boundIdentifierExpression.identifier = scopeDeclaration.locals.get(identifierText)!;
                            break;
                        }
                        default: {
                            throw new Error(`Unexpected scope: '${scopeDeclaration.kind}'`);
                        }
                    }

                    boundIdentifierExpression.type = this.instantiateGenericType(
                        memberType.identifier.type as ObjectType,
                        identifierExpression.typeArguments,
                    );
                } else {
                    boundIdentifierExpression.identifier = this.getSymbol(identifier, identifierExpression);
                    boundIdentifierExpression.type = this.instantiateGenericType(
                        boundIdentifierExpression.identifier.type as ObjectType,
                        identifierExpression.typeArguments,
                    );
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
                boundIdentifierExpression.type = this.project.stringType;
                break;
            }
            case TokenKind.NewKeyword:
            case NodeKind.EscapedIdentifier: {
                throw new Error('Method not implemented.');
            }
            default: {
                assertNever(identifier);
                break;
            }
        }

        return boundIdentifierExpression;
    }

    private getSymbol(
        token: Tokens,
        node: Nodes,
    ): BoundSymbol {
        const identifierText = token.getText(this.document);

        let scope = this.getScope(node);
        while (true) {
            if (!scope) {
                throw new Error(`Could not find '${identifierText}'.`);
            }

            const identifierSymbol = scope.locals.get(identifierText);
            if (identifierSymbol) {
                return identifierSymbol;
            }

            scope = this.getScope(scope);
        }
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

    // #region Scope member access expression

    private bindScopeMemberAccessExpression(
        scopeMemberAccessExpression: ScopeMemberAccessExpression,
        parent: BoundNodes,
        scope?: MemberContainerType,
    ): BoundScopeMemberAccessExpression {
        const boundScopeMemberAccessExpression = new BoundScopeMemberAccessExpression();
        boundScopeMemberAccessExpression.parent = parent;
        boundScopeMemberAccessExpression.scopableExpression = this.bindExpression(
            scopeMemberAccessExpression.scopableExpression,
            boundScopeMemberAccessExpression,
            scope,
        );

        const scopableExpressionType = boundScopeMemberAccessExpression.scopableExpression.type;
        switch (scopableExpressionType.kind) {
            case TypeKind.Module:
            case TypeKind.Object:
            case TypeKind.String: {
                boundScopeMemberAccessExpression.member = this.bindExpression(
                    scopeMemberAccessExpression.member,
                    boundScopeMemberAccessExpression,
                    scopableExpressionType,
                );
                boundScopeMemberAccessExpression.type = boundScopeMemberAccessExpression.member.type;
                break;
            }
            default: {
                throw new Error(`Binding scope member access on '${scopableExpressionType.kind}' is not implemented.`);
            }
        }

        return boundScopeMemberAccessExpression;
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

        const { sliceableExpression } = boundSliceExpression;
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
        scope?: MemberContainerType,
    ): BoundInvokeExpression {
        const boundInvokeExpression = new BoundInvokeExpression();
        boundInvokeExpression.parent = parent;
        boundInvokeExpression.invokableExpression = this.bindExpression(expression.invokableExpression, boundInvokeExpression, scope);
        boundInvokeExpression.arguments = this.bindExpressionSequence(expression.arguments, boundInvokeExpression);

        const { type } = boundInvokeExpression.invokableExpression;
        switch (type.kind) {
            case TypeKind.FunctionLikeGroup: {
                const overload = this.chooseOverload(
                    type.members,
                    boundInvokeExpression.arguments,
                );
                boundInvokeExpression.invocationType = overload;
                boundInvokeExpression.type = overload.returnType;
                break;
            }
            case TypeKind.Object: {
                boundInvokeExpression.type = type;
                break;
            }
            default: {
                throw new Error(`Cannot invoke an expression of type '${type.kind}'.`);
            }
        }

        return boundInvokeExpression;
    }

    private chooseOverload(
        overloads: FunctionLikeType[],
        args: BoundExpressions[],
    ): FunctionLikeType {
        // Search for an exact match (cannot use default parameters)
        for (const overload of overloads) {
            if (args.length === overload.parameters.length) {
                let match = true;

                for (let i = 0; i < args.length; i++) {
                    const argument = args[i];
                    const parameter = overload.parameters[i];
                    if (argument.type !== parameter) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    return overload;
                }
            }
        }

        let candidate: FunctionLikeType | undefined = undefined;

        // Search for exactly one match with implicit conversions allowed
        for (const overload of overloads) {
            // TODO: Support default parameters
            if (args.length === overload.parameters.length) {
                let match = true;

                for (let i = 0; i < args.length; i++) {
                    const argument = args[i];
                    const parameter = overload.parameters[i];
                    if (!argument.type.isConvertibleTo(parameter)) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    if (candidate) {
                        throw new Error('Multiple overloads matched invoke expression.');
                    }

                    candidate = overload;
                }
            }
        }

        if (candidate) {
            return candidate;
        }

        throw new Error('A matching overload could not be found.');
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
                case NodeKind.GlobalScopeExpression: {
                    const boundExpression = this.bindExpression(expression, parent);
                    boundExpressions.push(boundExpression);
                    break;
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

    declareSymbolInScope(
        declaration: Declarations,
        boundDeclaration: BoundTypedDeclarations,
    ): BoundSymbol {
        const name = this.getDeclarationName(declaration, this.document);
        const scope = this.getScope(declaration);

        if (!scope) {
            throw new Error(`Could not find a scope for '${name}'.`);
        }

        return this.setSymbolInScope(name, scope, boundDeclaration);
    }

    private setSymbolInScope(
        name: string,
        scope: Scope,
        boundDeclaration: BoundTypedDeclarations,
    ): BoundSymbol {
        let identifier = scope.locals.get(name);
        if (identifier) {
            if (isFunctionLike(boundDeclaration)) {
                identifier.declarations.push(boundDeclaration);
            } else {
                throw new Error(`Duplicate symbol '${name}'.`);
            }
        } else {
            identifier = new BoundSymbol(name, boundDeclaration);
            scope.locals.set(name, identifier);
        }

        return identifier;
    }

    private getDeclarationName(declaration: Declarations, document: string): string {
        switch (declaration.kind) {
            case NodeKind.AliasDirective:
            case NodeKind.ExternDataDeclaration:
            case NodeKind.ExternFunctionDeclaration:
            case NodeKind.ExternClassDeclaration:
            case NodeKind.ExternClassMethodDeclaration:
            case NodeKind.DataDeclaration:
            case NodeKind.FunctionDeclaration:
            case NodeKind.InterfaceDeclaration:
            case NodeKind.InterfaceMethodDeclaration:
            case NodeKind.ClassDeclaration:
            case NodeKind.ClassMethodDeclaration:
            case NodeKind.TypeParameter: {
                switch (declaration.identifier.kind) {
                    case TokenKind.Missing: { break; }
                    case NodeKind.EscapedIdentifier: {
                        return declaration.identifier.name.getText(document);
                    }
                    default: {
                        return declaration.identifier.getText(document);
                    }
                }
            }
        }

        throw new Error(`Unexpected declaration: ${JSON.stringify(declaration.kind)}`);
    }

    private setMemberTypes(
        type: MemberContainerType,
        members: (BoundDeclarations | BoundAliasDirective)[],
    ): void {
        for (const member of members) {
            switch (member.kind) {
                case BoundNodeKind.ImportStatement:
                case BoundNodeKind.AliasDirective: {
                    break;
                }
                default: {
                    // Data declarations on types will not have their type set when this is called. Their type will be
                    // set during phase 2.
                    if (member.type) {
                        const { name } = member.identifier;
                        if (member.type.kind === TypeKind.FunctionLike) {
                            let functionLikeGroupType = type.members.get(name) as FunctionLikeGroupType;
                            if (!functionLikeGroupType) {
                                functionLikeGroupType = member.identifier.type as FunctionLikeGroupType;
                                type.members.set(name, functionLikeGroupType);
                            }

                            functionLikeGroupType.members.push(member.type);
                        } else {
                            type.members.set(name, member.type);
                        }
                    }
                    break;
                }
            }
        }
    }

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
                const { arrayTypeAnnotations, shorthandType } = typeAnnotation;

                let type: Types;

                if (!shorthandType) {
                    type = IntType.type;
                } else {
                    type = this.bindShorthandType(shorthandType);
                }

                for (const { } of arrayTypeAnnotations) {
                    type = this.bindArrayType(type);
                }

                return type;
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
            case TokenKind.PercentSign: {
                return IntType.type;
            }
            case TokenKind.NumberSign: {
                return FloatType.type;
            }
            case TokenKind.DollarSign: {
                return this.project.stringType;
            }
            default: {
                return assertNever(shorthandType);
            }
        }
    }

    private bindTypeReference(typeReference: MissableTypeReference) {
        switch (typeReference.kind) {
            case NodeKind.TypeReference: {
                let type: Types = this.bindTypeReferenceElementType(typeReference);
                for (const { } of typeReference.arrayTypeAnnotations) {
                    type = this.bindArrayType(type);
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

    private bindTypeReferenceElementType(typeReference: TypeReference) {
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
                return this.project.stringType;
            }
            case TokenKind.ObjectKeyword: {
                return ObjectType.type;
            }
            case TokenKind.VoidKeyword: {
                return VoidType.type;
            }
            case TokenKind.ThrowableKeyword:
            case TokenKind.Identifier: {
                const type = this.bindTypeReferenceOfObjectType(typeReference);

                return this.instantiateGenericType(type, typeReference.typeArguments);
            }
            default: {
                throw new Error(`Binding '${identifier.kind}' types is not implemented.`);
            }
        }
    }

    // Types are instantiated _after_ this function is called
    private bindTypeReferenceOfObjectType(typeReference: TypeReference): ObjectType {
        const identifier = typeReference.identifier as IdentifierToken | ThrowableKeywordToken;

        if (typeReference.moduleIdentifier) {
            const moduleIdentifierText = typeReference.moduleIdentifier.getText(this.document);
            const moduleReferenceSymbol = this.module.locals.get(moduleIdentifierText);
            if (!moduleReferenceSymbol) {
                throw new Error(`The '${moduleIdentifierText}' module is not imported.`);
            }

            const moduleDeclaration = moduleReferenceSymbol.declaration!;
            if (moduleDeclaration.kind !== BoundNodeKind.ModuleDeclaration) {
                throw new Error(`'${moduleIdentifierText}' is not a module.`);
            }

            const identifierText = identifier.getText(this.document);
            const type = this.bindTypeReferenceFromModule(identifierText, moduleDeclaration);
            if (!type) {
                throw new Error(`Could not find '${identifierText}' in '${moduleIdentifierText}'.`);
            }

            return type as ObjectType;
        }

        const identifierText = identifier.getText(this.document);

        const classDeclaration = ParseTreeVisitor.getNearestAncestor(typeReference,
            NodeKind.ClassDeclaration,
        ) as ClassDeclaration | undefined;
        if (classDeclaration) {
            const typeParameterSymbol = classDeclaration.locals.get(identifierText);
            if (typeParameterSymbol) {
                const typeParameterDeclaration = typeParameterSymbol.declaration!;
                if (typeParameterDeclaration.kind !== BoundNodeKind.TypeParameter) {
                    throw new Error(`'${typeParameterSymbol.name}' is not a type parameter.`);
                }

                return typeParameterSymbol.declaration!.type as ObjectType;
            }
        }

        const type = this.bindTypeReferenceFromModule(identifierText, this.module);
        if (type) {
            return type as ObjectType;
        }

        for (const [, node] of this.module.locals) {
            const declaration = node.declaration!;
            if (declaration.kind === BoundNodeKind.ModuleDeclaration) {
                const type = this.bindTypeReferenceFromModule(identifierText, declaration);
                if (type) {
                    return type as ObjectType;
                }
            }
        }

        throw new Error(`Could not find '${identifierText}'.`);
    }

    // Types are instantiated _after_ this function is called
    private bindTypeReferenceFromModule(identifierText: string, moduleDeclaration: BoundModuleDeclaration) {
        const identifierSymbol = moduleDeclaration.locals.get(identifierText);

        if (!identifierSymbol) {
            return undefined;
        } else {
            const identifierDeclaration = identifierSymbol.declaration!;
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
        if (leftOperandType === this.project.stringType ||
            rightOperandType === this.project.stringType
        ) {
            return this.project.stringType;
        }

        if (leftOperandType === FloatType.type ||
            rightOperandType === FloatType.type
        ) {
            return FloatType.type;
        }

        if (leftOperandType === IntType.type ||
            rightOperandType === IntType.type
        ) {
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

    private getScope(node: Nodes): Scope | undefined {
        let ancestor = node.parent;

        while (true) {
            if (!ancestor) {
                return undefined;
            }

            switch (ancestor.kind) {
                case NodeKind.ModuleDeclaration:
                case NodeKind.ExternFunctionDeclaration:
                case NodeKind.ExternClassDeclaration:
                case NodeKind.ExternClassMethodDeclaration:
                case NodeKind.FunctionDeclaration:
                case NodeKind.InterfaceDeclaration:
                case NodeKind.InterfaceMethodDeclaration:
                case NodeKind.ClassDeclaration:
                case NodeKind.ClassMethodDeclaration:
                case NodeKind.IfStatement:
                case NodeKind.ElseIfClause:
                case NodeKind.ElseClause:
                case NodeKind.CaseClause:
                case NodeKind.DefaultClause:
                case NodeKind.WhileLoop:
                case NodeKind.RepeatLoop:
                case NodeKind.ForLoop:
                case NodeKind.TryStatement:
                case NodeKind.CatchClause: {
                    return ancestor;
                }
            }

            ancestor = ancestor.parent;
        }
    }

    private getNearestAncestor(node: BoundNodes, kind: BoundNodeKind, ...kinds: BoundNodeKind[]): BoundNodes {
        let ancestor = node.parent;

        while (ancestor) {
            if (ancestor.kind === kind ||
                kinds.includes(ancestor.kind)
            ) {
                return ancestor;
            }

            ancestor = ancestor.parent;
        }

        throw new Error(`Could not find a matching ancestor.`);
    }

    private getCollectionElementType(collectionType: Types) {
        switch (collectionType.kind) {
            case TypeKind.Array: {
                return collectionType.elementType;
            }
            case TypeKind.String: {
                return IntType.type;
            }
            case TypeKind.Object: {
                const objectEnumeratorMethod = this.getMethod(
                    collectionType,
                    /*name*/ 'ObjectEnumerator',
                    (returnType) => returnType.isConvertibleTo(ObjectType.type),
                );
                if (!objectEnumeratorMethod) {
                    throw new Error(`'${collectionType.identifier!.name}' does not have a 'ObjectEnumerator: TObjectEnumerator()' method.`);
                }

                const enumeratorType = objectEnumeratorMethod.returnType as ObjectType;

                const hasNextMethod = this.getMethod(
                    enumeratorType,
                    /*name*/ 'HasNext',
                    (returnType) => returnType === BoolType.type,
                );
                if (!hasNextMethod) {
                    throw new Error(`'${enumeratorType.identifier!.name}' does not have a 'HasNext: Bool()' method.`);
                }

                const nextObjectMethod = this.getMethod(
                    enumeratorType,
                    /*name*/ 'NextObject',
                );
                if (!nextObjectMethod) {
                    throw new Error(`'${enumeratorType.identifier!.name}' does not have a 'NextObject: T()' method.`);
                }

                return nextObjectMethod.returnType;
            }
            default: {
                throw new Error(`'${collectionType.kind}' is not a valid collection type.`);
            }
        }
    }

    private getMethod(
        type: ObjectType,
        name: string,
        checkReturnType: (type: Types) => boolean = (returnType) => true,
        ...parameters: Types[]
    ) {
        const memberType = type.members.get(name);
        if (memberType &&
            memberType.kind === TypeKind.FunctionLikeGroup &&
            memberType.isMethod
        ) {
            for (const type of memberType.members) {
                if (type.kind === TypeKind.FunctionLike &&
                    checkReturnType(type.returnType)
                ) {
                    if (type.parameters.length === parameters.length) {
                        for (let i = 0; i < type.parameters.length; i++) {
                            if (type.parameters[i] !== parameters[i]) {
                                return undefined;
                            }
                        }

                        return type;
                    }
                }
            }
        }
    }

    // #region Generic types

    private bindArrayType(elementType: Types, openType: ArrayType = ArrayType.type): ArrayType {
        const arrayType = new ArrayType(elementType);
        openType.instantiatedTypes.push(arrayType);

        return arrayType;
    }

    private instantiateGenericType(
        openType: ObjectType,
        typeArguments: (TypeReference | CommaSeparator)[] | undefined,
    ): ObjectType {
        const { typeParameters } = openType;
        if (typeArguments && typeParameters) {
            const typeReferences = this.bindTypeReferenceSequence(typeArguments);
            const typeMap = this.createTypeMap(typeParameters, typeReferences);

            return this.instantiateType(openType, typeMap) as ObjectType;
        }

        return openType;
    }

    private instantiateType(openType: Types, typeMap: Map<TypeParameterType, Types>): Types {
        switch (openType.kind) {
            case TypeKind.TypeParameter: {
                return this.instantiateTypeParameterType(openType, typeMap);
            }
            case TypeKind.Object: {
                return this.instantiateObjectType(openType, typeMap);
            }
            case TypeKind.Array: {
                return this.instantiateArrayType(openType, typeMap);
            }
            case TypeKind.FunctionLikeGroup: {
                return this.instantiateFunctionLikeGroupType(openType, typeMap);
            }
            case TypeKind.FunctionLike: {
                throw new Error(`Cannot directly instantiate a '${openType.kind}' type.`);
            }
            default: {
                return openType;
            }
        }
    }

    private createTypeMap(
        typeParameters: TypeParameterType[],
        typeArguments: Types[],
    ): Map<TypeParameterType, Types> {
        if (typeArguments.length !== typeParameters.length) {
            throw new Error('A different number of type arguments were for given type parameters.');
        }

        const typeMap = new Map<TypeParameterType, Types>();

        for (let i = 0; i < typeParameters.length; i++) {
            typeMap.set(typeParameters[i], typeArguments[i]);
        }

        return typeMap;
    }

    private instantiateTypeParameterType(openType: TypeParameterType, typeMap: Map<TypeParameterType, Types>): Types {
        const type = typeMap.get(openType);
        if (!type) {
            throw new Error(`'${openType}' is not mapped.`);
        }

        return type;
    }

    private instantiateObjectType(openType: ObjectType, typeMap: Map<TypeParameterType, Types>): ObjectType {
        if (!openType.typeParameters) {
            return openType;
        }

        const typeArguments = Array.from(typeMap.values());
        let instantiatedType = this.getCachedInstantiatedType(openType.instantiatedTypes, typeArguments);
        if (instantiatedType) {
            return instantiatedType;
        }

        instantiatedType = new ObjectType();
        openType.instantiatedTypes.push(instantiatedType);
        instantiatedType.identifier = openType.identifier;

        // TODO: Instantiate super type?
        // TODO: Instantiate implemented types?
        // TODO: Assert matching number of type parameters/arguments?

        instantiatedType.typeParameters = openType.typeParameters;

        instantiatedType.typeArguments = [];
        for (const typeParameter of openType.typeParameters) {
            const typeArgument = typeMap.get(typeParameter)!;
            instantiatedType.typeArguments.push(typeArgument);
        }

        return instantiatedType;
    }

    private instantiateArrayType(openType: ArrayType, typeMap: Map<TypeParameterType, Types>): ArrayType {
        const elementType = this.instantiateType(openType.elementType, typeMap);

        for (const instantiatedType of openType.instantiatedTypes) {
            if (instantiatedType.elementType === elementType) {
                return instantiatedType;
            }
        }

        return this.bindArrayType(elementType, openType);
    }

    private instantiateFunctionLikeGroupType(openType: FunctionLikeGroupType, typeMap: Map<TypeParameterType, Types>): FunctionLikeGroupType {
        const typeArguments = Array.from(typeMap.values());
        let instantiatedType = this.getCachedInstantiatedType(openType.instantiatedTypes, typeArguments);
        if (instantiatedType) {
            return instantiatedType;
        }

        instantiatedType = new FunctionLikeGroupType();
        instantiatedType.identifier = openType.identifier;
        instantiatedType.isMethod = openType.isMethod;

        for (const declaration of openType.identifier.declarations) {
            const overloadType = this.instantiateFunctionLikeType(declaration.type as FunctionLikeType, typeMap);
            instantiatedType.members.push(overloadType);
        }

        return instantiatedType;
    }

    private instantiateFunctionLikeType(
        openType: FunctionLikeType,
        typeMap: Map<TypeParameterType, Types>,
    ): FunctionLikeType {
        const instantiatedType = new FunctionLikeType();
        instantiatedType.identifier = openType.identifier;
        instantiatedType.returnType = this.instantiateType(openType.returnType, typeMap);

        const parameters: Types[] = [];

        for (const parameter of openType.parameters) {
            parameters.push(this.instantiateType(parameter, typeMap));
        }

        instantiatedType.parameters = parameters;

        return instantiatedType;
    }

    private getCachedInstantiatedType<TType extends ObjectType | FunctionLikeGroupType>(
        instantiatedTypes: TType[],
        typeArguments: Types[],
    ): TType | undefined {
        for (const instantiatedType of instantiatedTypes) {
            let argumentsMatch = true;

            const instantiatedTypeArguments = instantiatedType.typeArguments!;
            for (let i = 0; i < instantiatedTypeArguments.length; i++) {
                if (instantiatedTypeArguments[i] !== typeArguments[i]) {
                    argumentsMatch = false;
                    break;
                }
            }

            if (argumentsMatch) {
                return instantiatedType;
            }
        }
    }

    // #endregion

    // #endregion
}

type Scope =
    | ModuleDeclaration
    | ExternFunctionDeclaration
    | ExternClassDeclaration
    | ExternClassMethodDeclaration
    | FunctionDeclaration
    | InterfaceDeclaration
    | InterfaceMethodDeclaration
    | ClassDeclaration
    | ClassMethodDeclaration
    | IfStatement
    | ElseIfClause
    | ElseClause
    | CaseClause
    | DefaultClause
    | WhileLoop
    | RepeatLoop
    | ForLoop
    | TryStatement
    | CatchClause
    ;

type MemberContainerType =
    | ModuleType
    | ObjectType
    | StringType
    ;
