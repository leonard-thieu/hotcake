import path = require('path');
import { assertNever } from '../assertNever';
import { FILE_EXTENSION, Project } from '../Project';
import { CommaSeparator } from '../Syntax/Node/CommaSeparator';
import { AccessibilityDirective } from '../Syntax/Node/Declaration/AccessibilityDirective';
import { AliasDirective, AliasDirectiveSequence } from '../Syntax/Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration } from '../Syntax/Node/Declaration/ClassDeclaration';
import { ClassMethodDeclaration } from '../Syntax/Node/Declaration/ClassMethodDeclaration';
import { DataDeclaration, DataDeclarationKeywordToken, DataDeclarationSequence } from '../Syntax/Node/Declaration/DataDeclarationSequence';
import { Declarations, TypeDeclaration } from '../Syntax/Node/Declaration/Declaration';
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
import { BinaryExpression, BinaryExpressionOperatorToken } from '../Syntax/Node/Expression/BinaryExpression';
import { MissableExpression } from '../Syntax/Node/Expression/Expression';
import { GroupingExpression } from '../Syntax/Node/Expression/GroupingExpression';
import { IdentifierExpression } from '../Syntax/Node/Expression/IdentifierExpression';
import { IndexExpression } from '../Syntax/Node/Expression/IndexExpression';
import { InvokeExpression } from '../Syntax/Node/Expression/InvokeExpression';
import { NewExpression } from '../Syntax/Node/Expression/NewExpression';
import { ScopeMemberAccessExpression } from '../Syntax/Node/Expression/ScopeMemberAccessExpression';
import { SliceExpression } from '../Syntax/Node/Expression/SliceExpression';
import { UnaryExpression, UnaryOperatorToken } from '../Syntax/Node/Expression/UnaryExpression';
import { MissableIdentifier } from '../Syntax/Node/Identifier';
import { ModulePath } from '../Syntax/Node/ModulePath';
import { NodeKind } from '../Syntax/Node/NodeKind';
import { AssignmentStatement, AssignmentOperatorToken } from '../Syntax/Node/Statement/AssignmentStatement';
import { DataDeclarationSequenceStatement } from '../Syntax/Node/Statement/DataDeclarationSequenceStatement';
import { ExpressionStatement } from '../Syntax/Node/Statement/ExpressionStatement';
import { NumericForLoop, ForEachInLoop } from '../Syntax/Node/Statement/ForLoop';
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
import { NewKeywordToken, EqualsSignToken } from '../Syntax/Token/Token';
import { TokenKind } from '../Syntax/Token/TokenKind';
import { areIdentifiersSame, BoundIdentifiableDeclaration, BoundSymbol, BoundSymbolTable } from './BoundSymbol';
import { BoundModulePath } from "./Node/BoundModulePath";
import { BoundNodes } from './Node/BoundNode';
import { BoundNodeKind } from './Node/BoundNodeKind';
import { BoundAliasDirective } from './Node/Declaration/BoundAliasDirective';
import { BoundClassDeclaration, BoundClassDeclarationMember } from './Node/Declaration/BoundClassDeclaration';
import { BoundClassMethodDeclaration } from './Node/Declaration/BoundClassMethodDeclaration';
import { BoundDataDeclaration } from './Node/Declaration/BoundDataDeclaration';
import { BoundDeclarations, BoundTypeReferenceDeclaration } from './Node/Declaration/BoundDeclarations';
import { BoundDirectory } from './Node/Declaration/BoundDirectory';
import { BoundFunctionDeclaration } from './Node/Declaration/BoundFunctionDeclaration';
import { BoundClassMethodGroupDeclaration, BoundExternClassMethodGroupDeclaration, BoundExternFunctionGroupDeclaration, BoundFunctionGroupDeclaration, BoundFunctionLikeGroupDeclaration, BoundInterfaceMethodGroupDeclaration } from './Node/Declaration/BoundFunctionLikeGroupDeclaration';
import { BoundImportStatement } from './Node/Declaration/BoundImportStatement';
import { BoundInterfaceDeclaration, BoundInterfaceDeclarationMember } from './Node/Declaration/BoundInterfaceDeclaration';
import { BoundInterfaceMethodDeclaration } from './Node/Declaration/BoundInterfaceMethodDeclaration';
import { BoundModuleDeclaration, BoundModuleDeclarationMember } from './Node/Declaration/BoundModuleDeclaration';
import { BoundTypeMembers } from './Node/Declaration/BoundTypeMembers';
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
import { BoundFunctionLikeDeclaration, FunctionGroupType, FunctionType, MethodGroupType, MethodType } from './Type/FunctionLikeType';
import { ModuleType } from './Type/ModuleType';
import { ObjectType } from './Type/ObjectType';
import { StringType } from './Type/StringType';
import { TypeKind } from './Type/TypeKind';
import { TypeParameterType } from './Type/TypeParameterType';
import { Types } from './Type/Types';

export class Binder {
    private document: string = undefined!;
    private project: Project = undefined!;
    private module: BoundModuleDeclaration = undefined!;
    private declarationCache: Map<Declarations, BoundDeclarations> = undefined!;

    // Debugging aid
    private filePath: string = undefined!;

    bind(
        moduleDeclaration: ModuleDeclaration,
        project: Project,
        boundDirectory: BoundDirectory,
        moduleIdentifier: string,
    ): BoundModuleDeclaration {
        this.filePath = moduleDeclaration.filePath.substr(0, moduleDeclaration.filePath.lastIndexOf('.'));

        this.document = moduleDeclaration.document;
        this.project = project;
        this.declarationCache = new Map<Declarations, BoundDeclarations>();

        return this.bindModuleDeclaration(moduleDeclaration, project, boundDirectory, moduleIdentifier);
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
        boundModuleDeclaration.declaration = moduleDeclaration;
        boundModuleDeclaration.project = project;
        boundModuleDeclaration.directory = boundDirectory;
        boundModuleDeclaration.type = new ModuleType(boundModuleDeclaration);

        const boundSymbol = new BoundSymbol(moduleIdentifier, boundModuleDeclaration);
        boundModuleDeclaration.directory.locals.set(moduleIdentifier, boundSymbol);
        boundModuleDeclaration.identifier = boundSymbol;

        this.module = boundModuleDeclaration;
        this.project.cacheModule(boundModuleDeclaration);
        this.project.importModuleFromSource(boundModuleDeclaration, 'monkey.lang');

        boundModuleDeclaration.locals = new BoundSymbolTable();

        this.bindModuleDeclarationHeaderMembers(moduleDeclaration, boundModuleDeclaration);

        boundModuleDeclaration.members = new BoundTypeMembers<BoundModuleDeclarationMember>();
        this.bindModuleDeclarationMembers(moduleDeclaration, boundModuleDeclaration);

        return boundModuleDeclaration;
    }

    private bindModuleDeclarationHeaderMembers(
        moduleDeclaration: ModuleDeclaration,
        parent: BoundNodes,
    ): void {
        for (const member of moduleDeclaration.headerMembers) {
            switch (member.kind) {
                case NodeKind.ImportStatement: {
                    this.bindImportStatement(member, parent);
                    break;
                }
                case NodeKind.FriendDirective:
                case NodeKind.AccessibilityDirective: {
                    throw new Error('Method not implemented.');
                }
                case NodeKind.AliasDirectiveSequence: {
                    this.bindAliasDirectiveSequence(member, parent);
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
    }

    private bindModuleDeclarationMembers(
        moduleDeclaration: ModuleDeclaration,
        parent: BoundModuleDeclaration,
    ): void {
        const boundModuleDeclarationMembers = parent.members;

        for (const moduleDeclarationMember of moduleDeclaration.members) {
            switch (moduleDeclarationMember.kind) {
                case NodeKind.AccessibilityDirective: {
                    this.bindAccessibilityDirective(moduleDeclarationMember);
                    break;
                }
                case NodeKind.ExternDataDeclarationSequence: {
                    const boundExternDataDeclarations = this.bindExternDataDeclarationSequence(moduleDeclarationMember, parent);
                    for (const dataDeclaration of boundExternDataDeclarations) {
                        boundModuleDeclarationMembers.set(dataDeclaration.identifier.name, dataDeclaration);
                    }
                    break;
                }
                case NodeKind.ExternFunctionDeclaration: {
                    const boundExternFunctionGroupDeclaration = this.bindExternFunctionDeclaration(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.set(boundExternFunctionGroupDeclaration.identifier.name, boundExternFunctionGroupDeclaration);
                    break;
                }
                case NodeKind.ExternClassDeclaration: {
                    const boundExternClassDeclaration = this.bindExternClassDeclaration(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.set(boundExternClassDeclaration.identifier.name, boundExternClassDeclaration);
                    break;
                }
                case NodeKind.DataDeclarationSequence: {
                    const boundDataDeclarationSequence = this.bindDataDeclarationSequence(moduleDeclarationMember, parent);
                    for (const dataDeclaration of boundDataDeclarationSequence) {
                        boundModuleDeclarationMembers.set(dataDeclaration.identifier.name, dataDeclaration);
                    }
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    const boundFunctionGroupDeclaration = this.bindFunctionDeclaration(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.set(boundFunctionGroupDeclaration.identifier.name, boundFunctionGroupDeclaration);
                    break;
                }
                case NodeKind.InterfaceDeclaration: {
                    const boundInterfaceDeclaration = this.bindInterfaceDeclaration(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.set(boundInterfaceDeclaration.identifier.name, boundInterfaceDeclaration);
                    break;
                }
                case NodeKind.ClassDeclaration: {
                    const boundClassDeclaration = this.bindClassDeclaration(moduleDeclarationMember, parent);
                    boundModuleDeclarationMembers.set(boundClassDeclaration.identifier.name, boundClassDeclaration);
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
                boundModulePath.moduleIdentifier = boundTargetModule;
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
        let boundExternDataDeclaration = this.declarationCache.get(externDataDeclaration);
        if (boundExternDataDeclaration) {
            return boundExternDataDeclaration as BoundExternDataDeclaration;
        }

        boundExternDataDeclaration = new BoundExternDataDeclaration();
        this.declarationCache.set(externDataDeclaration, boundExternDataDeclaration);
        boundExternDataDeclaration.parent = parent;
        boundExternDataDeclaration.declarationKind = dataDeclarationKeyword.kind;
        const name = this.getIdentifierText(externDataDeclaration.identifier);
        boundExternDataDeclaration.identifier = this.declareSymbolInScope(name, boundExternDataDeclaration);
        boundExternDataDeclaration.typeAnnotation = this.bindTypeAnnotation(externDataDeclaration.typeAnnotation);
        boundExternDataDeclaration.type = boundExternDataDeclaration.typeAnnotation!.type;
        if (externDataDeclaration.nativeSymbol) {
            boundExternDataDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternDataDeclaration);
        }

        return boundExternDataDeclaration;
    }

    // #endregion

    // #region Extern function declaration

    private bindExternFunctionDeclaration(
        externFunctionDeclaration: ExternFunctionDeclaration,
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
    ): BoundExternFunctionGroupDeclaration {
        let boundExternFunctionDeclaration = this.declarationCache.get(externFunctionDeclaration);
        if (boundExternFunctionDeclaration) {
            return boundExternFunctionDeclaration.parent as BoundExternFunctionGroupDeclaration;
        }

        const name = this.getIdentifierText(externFunctionDeclaration.identifier);

        let boundExternFunctionGroupDeclaration = parent.members.get(name,
            BoundNodeKind.ExternFunctionGroupDeclaration,
        ) as BoundExternFunctionGroupDeclaration | undefined;

        if (!boundExternFunctionGroupDeclaration) {
            boundExternFunctionGroupDeclaration = new BoundExternFunctionGroupDeclaration();
            boundExternFunctionGroupDeclaration.parent = parent;
            boundExternFunctionGroupDeclaration.identifier = this.declareSymbolInScope(name, boundExternFunctionGroupDeclaration);
            boundExternFunctionGroupDeclaration.type = new FunctionGroupType(boundExternFunctionGroupDeclaration);
        }

        boundExternFunctionDeclaration = new BoundExternFunctionDeclaration();
        this.declarationCache.set(externFunctionDeclaration, boundExternFunctionDeclaration);
        boundExternFunctionGroupDeclaration.overloads.add(boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.parent = boundExternFunctionGroupDeclaration;
        boundExternFunctionDeclaration.locals = new BoundSymbolTable();
        boundExternFunctionDeclaration.type = new FunctionType(boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.identifier = new BoundSymbol(name, boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.returnType = this.bindTypeAnnotation(externFunctionDeclaration.returnType);
        boundExternFunctionDeclaration.parameters = this.bindDataDeclarationSequence(externFunctionDeclaration.parameters, boundExternFunctionDeclaration);
        if (externFunctionDeclaration.nativeSymbol) {
            boundExternFunctionDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternFunctionDeclaration);
        }

        return boundExternFunctionGroupDeclaration;
    }

    // #endregion

    // #region Extern class declaration

    private bindExternClassDeclaration(
        externClassDeclaration: ExternClassDeclaration,
        parent: BoundNodes,
    ): BoundExternClassDeclaration {
        let boundExternClassDeclaration = this.declarationCache.get(externClassDeclaration);
        if (boundExternClassDeclaration) {
            return boundExternClassDeclaration as BoundExternClassDeclaration;
        }

        const name = this.getIdentifierText(externClassDeclaration.identifier);
        switch (name) {
            case 'String': {
                boundExternClassDeclaration = this.project.stringTypeDeclaration;
                boundExternClassDeclaration.type = new StringType(boundExternClassDeclaration);
                break;
            }
            case 'Array': {
                boundExternClassDeclaration = this.project.arrayTypeDeclaration;

                const typeParameter = new BoundTypeParameter();
                typeParameter.parent = boundExternClassDeclaration;
                typeParameter.identifier = new BoundSymbol('T', typeParameter);
                typeParameter.type = new TypeParameterType(typeParameter);

                boundExternClassDeclaration.type = new ArrayType(boundExternClassDeclaration, typeParameter);
                break;
            }
            case 'Object': {
                boundExternClassDeclaration = this.project.objectTypeDeclaration;
                boundExternClassDeclaration.type = new ObjectType(boundExternClassDeclaration);
                break;
            }
            case 'Throwable': {
                boundExternClassDeclaration = this.project.throwableTypeDeclaration;
                boundExternClassDeclaration.type = new ObjectType(boundExternClassDeclaration);
                break;
            }
            default: {
                boundExternClassDeclaration = new BoundExternClassDeclaration();
                boundExternClassDeclaration.type = new ObjectType(boundExternClassDeclaration);
                break;
            }
        }

        this.declarationCache.set(externClassDeclaration, boundExternClassDeclaration);
        boundExternClassDeclaration.parent = parent;
        boundExternClassDeclaration.locals = new BoundSymbolTable();
        boundExternClassDeclaration.identifier = this.declareSymbolInScope(name, boundExternClassDeclaration);

        if (externClassDeclaration.superType) {
            if (externClassDeclaration.superType.kind !== TokenKind.NullKeyword) {
                boundExternClassDeclaration.superType = this.bindTypeReference(externClassDeclaration.superType,
                    NodeKind.ExternClassDeclaration,
                    NodeKind.ClassDeclaration,
                ) as BoundExternClassDeclaration | BoundClassDeclaration;
            }
        } else {
            boundExternClassDeclaration.superType = this.project.objectTypeDeclaration;
        }

        if (externClassDeclaration.nativeSymbol) {
            boundExternClassDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternClassDeclaration);
        }

        boundExternClassDeclaration.members = new BoundTypeMembers<BoundExternClassDeclarationMember>();
        this.bindExternClassDeclarationMembers(externClassDeclaration, boundExternClassDeclaration);

        if (!this.hasParameterlessExternConstructor(boundExternClassDeclaration)) {
            const boundMethodGroupDeclaration = this.createParameterlessExternConstructor(boundExternClassDeclaration);
            boundExternClassDeclaration.members.set(boundMethodGroupDeclaration.identifier.name, boundMethodGroupDeclaration);
        }

        return boundExternClassDeclaration;
    }

    private bindExternClassDeclarationMembers(
        externClassDeclaration: ExternClassDeclaration,
        parent: BoundExternClassDeclaration,
    ): void {
        const boundExternClassDeclarationMembers = parent.members;

        for (const externClassDeclarationMember of externClassDeclaration.members) {
            switch (externClassDeclarationMember.kind) {
                case NodeKind.AccessibilityDirective: {
                    throw new Error('Method not implemented.');
                }
                case NodeKind.ExternDataDeclarationSequence: {
                    const boundExternDataDeclarations = this.bindExternDataDeclarationSequence(externClassDeclarationMember, parent);
                    for (const dataDeclaration of boundExternDataDeclarations) {
                        boundExternClassDeclarationMembers.set(dataDeclaration.identifier.name, dataDeclaration);
                    }
                    break;
                }
                case NodeKind.ExternFunctionDeclaration: {
                    const boundExternFunctionGroupDeclaration = this.bindExternFunctionDeclaration(externClassDeclarationMember, parent);
                    boundExternClassDeclarationMembers.set(boundExternFunctionGroupDeclaration.identifier.name, boundExternFunctionGroupDeclaration);
                    break;
                }
                case NodeKind.ExternClassMethodDeclaration: {
                    if (this.declarationCache.get(externClassDeclarationMember)) {
                        continue;
                    }

                    const name = this.getIdentifierText(externClassDeclarationMember.identifier);
                    const boundExternClassMethodGroupDeclaration = this.bindExternClassMethodGroup(name, externClassDeclaration.members, parent);
                    boundExternClassDeclarationMembers.set(boundExternClassMethodGroupDeclaration.identifier.name, boundExternClassMethodGroupDeclaration);
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
    }

    // #region Default constructor

    private hasParameterlessExternConstructor(boundClassDeclaration: BoundExternClassDeclaration): boolean {
        const newMethod = this.getMethod(boundClassDeclaration, 'New');
        if (newMethod) {
            return true;
        }

        return false;
    }

    private createParameterlessExternConstructor(parent: BoundExternClassDeclaration): BoundExternClassMethodGroupDeclaration {
        const name = 'New';

        const boundMethodGroupDeclaration = this.getBoundExternClassMethodGroupDeclaration(parent, name);

        const boundClassMethodDeclaration = new BoundExternClassMethodDeclaration();
        boundMethodGroupDeclaration.overloads.add(boundClassMethodDeclaration);
        boundClassMethodDeclaration.parent = boundMethodGroupDeclaration;
        boundClassMethodDeclaration.locals = new BoundSymbolTable();
        boundClassMethodDeclaration.type = new MethodType(boundClassMethodDeclaration);
        boundClassMethodDeclaration.identifier = new BoundSymbol(name, boundClassMethodDeclaration);
        boundClassMethodDeclaration.returnType = parent;
        boundClassMethodDeclaration.parameters = [];

        return boundMethodGroupDeclaration;
    }

    // #endregion

    // #region Extern class method declaration

    private getBoundExternClassMethodGroupDeclaration(parent: BoundExternClassDeclaration, name: string) {
        let boundExternClassMethodGroupDeclaration = parent.members.get(name,
            BoundNodeKind.ExternClassMethodGroupDeclaration,
        ) as BoundExternClassMethodGroupDeclaration | undefined;

        if (!boundExternClassMethodGroupDeclaration) {
            boundExternClassMethodGroupDeclaration = new BoundExternClassMethodGroupDeclaration();
            boundExternClassMethodGroupDeclaration.parent = parent;
            boundExternClassMethodGroupDeclaration.identifier = this.declareSymbolInScope(name, boundExternClassMethodGroupDeclaration);
            boundExternClassMethodGroupDeclaration.type = new MethodGroupType(boundExternClassMethodGroupDeclaration);
        }

        return boundExternClassMethodGroupDeclaration;
    }

    private bindExternClassMethodGroup(
        name: string,
        members: ExternClassDeclaration['members'],
        parent: BoundExternClassDeclaration,
    ): BoundExternClassMethodGroupDeclaration {
        const boundExternClassMethodGroupDeclaration = this.getBoundExternClassMethodGroupDeclaration(parent, name);

        const externClassMethodDeclarations: ExternClassMethodDeclaration[] = [];

        for (const member of members) {
            if (member.kind === NodeKind.ExternClassMethodDeclaration) {
                const memberName = this.getIdentifierText(member.identifier);
                if (areIdentifiersSame(name, memberName)) {
                    externClassMethodDeclarations.push(member);
                }
            }
        }

        for (const externClassMethodDeclaration of externClassMethodDeclarations) {
            const boundExternClassMethodDeclaration = new BoundExternClassMethodDeclaration();
            this.declarationCache.set(externClassMethodDeclaration, boundExternClassMethodDeclaration);
            boundExternClassMethodGroupDeclaration.overloads.add(boundExternClassMethodDeclaration);
            boundExternClassMethodDeclaration.parent = boundExternClassMethodGroupDeclaration;
            boundExternClassMethodDeclaration.locals = new BoundSymbolTable();
            boundExternClassMethodDeclaration.type = new MethodType(boundExternClassMethodDeclaration);
            boundExternClassMethodDeclaration.identifier = new BoundSymbol(name, boundExternClassMethodDeclaration);

            if (areIdentifiersSame('New', name)) {
                boundExternClassMethodDeclaration.returnType = parent;
            } else {
                boundExternClassMethodDeclaration.returnType = this.bindTypeAnnotation(externClassMethodDeclaration.returnType);
            }

            boundExternClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(externClassMethodDeclaration.parameters, boundExternClassMethodDeclaration);
            if (externClassMethodDeclaration.nativeSymbol) {
                boundExternClassMethodDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternClassMethodDeclaration);
            }
        }

        return boundExternClassMethodGroupDeclaration;
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
        let boundDataDeclaration = this.declarationCache.get(dataDeclaration);
        if (boundDataDeclaration) {
            return boundDataDeclaration as BoundDataDeclaration;
        }

        boundDataDeclaration = new BoundDataDeclaration();
        this.declarationCache.set(dataDeclaration, boundDataDeclaration);
        boundDataDeclaration.parent = parent;

        if (dataDeclarationKeyword) {
            boundDataDeclaration.declarationKind = dataDeclarationKeyword.kind;
        }

        const name = this.getIdentifierText(dataDeclaration.identifier);
        boundDataDeclaration.identifier = this.declareSymbolInScope(name, boundDataDeclaration);

        // TODO: Should this be lowered to an assignment expression?
        if (dataDeclaration.expression) {
            boundDataDeclaration.expression = this.bindExpression(dataDeclaration.expression, boundDataDeclaration);
        }

        if (dataDeclaration.equalsSign &&
            dataDeclaration.equalsSign.kind === TokenKind.ColonEqualsSign
        ) {
            if (!boundDataDeclaration.expression) {
                // No expression to infer type from, default to Int
                boundDataDeclaration.type = this.project.intTypeDeclaration.type;
            } else {
                boundDataDeclaration.type = boundDataDeclaration.expression.type;
            }
        } else {
            boundDataDeclaration.typeAnnotation = this.bindTypeAnnotation(dataDeclaration.typeAnnotation);
            boundDataDeclaration.type = boundDataDeclaration.typeAnnotation!.type;

            if (boundDataDeclaration.expression) {
                if (!boundDataDeclaration.expression.type.isConvertibleTo(boundDataDeclaration.type)) {
                    throw new Error(`'${boundDataDeclaration.expression.type}' is not convertible to '${boundDataDeclaration.typeAnnotation.type}'.`);
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
        parent: BoundModuleDeclaration | BoundClassDeclaration,
    ): BoundFunctionGroupDeclaration {
        let boundFunctionDeclaration = this.declarationCache.get(functionDeclaration);
        if (boundFunctionDeclaration) {
            return boundFunctionDeclaration.parent as BoundFunctionGroupDeclaration;
        }

        const name = this.getIdentifierText(functionDeclaration.identifier);

        let boundFunctionGroupDeclaration = parent.members.get(name,
            BoundNodeKind.FunctionGroupDeclaration,
        ) as BoundFunctionGroupDeclaration | undefined;

        if (!boundFunctionGroupDeclaration) {
            boundFunctionGroupDeclaration = new BoundFunctionGroupDeclaration();
            boundFunctionGroupDeclaration.parent = parent;
            boundFunctionGroupDeclaration.identifier = this.declareSymbolInScope(name, boundFunctionGroupDeclaration);
            boundFunctionGroupDeclaration.type = new FunctionGroupType(boundFunctionGroupDeclaration);
        }

        boundFunctionDeclaration = new BoundFunctionDeclaration();
        this.declarationCache.set(functionDeclaration, boundFunctionDeclaration);
        boundFunctionGroupDeclaration.overloads.add(boundFunctionDeclaration);
        boundFunctionDeclaration.parent = boundFunctionGroupDeclaration;
        boundFunctionDeclaration.locals = new BoundSymbolTable();
        boundFunctionDeclaration.type = new FunctionType(boundFunctionDeclaration);
        boundFunctionDeclaration.identifier = new BoundSymbol(name, boundFunctionDeclaration);
        boundFunctionDeclaration.returnType = this.bindTypeAnnotation(functionDeclaration.returnType);
        boundFunctionDeclaration.parameters = this.bindDataDeclarationSequence(functionDeclaration.parameters, boundFunctionDeclaration);
        boundFunctionDeclaration.statements = this.bindStatements(functionDeclaration.statements, boundFunctionDeclaration);

        return boundFunctionGroupDeclaration;
    }
    // #endregion

    // #region Interface declaration

    private bindInterfaceDeclaration(
        interfaceDeclaration: InterfaceDeclaration,
        parent: BoundNodes,
    ): BoundInterfaceDeclaration {
        let boundInterfaceDeclaration = this.declarationCache.get(interfaceDeclaration);
        if (boundInterfaceDeclaration) {
            return boundInterfaceDeclaration as BoundInterfaceDeclaration;
        }

        boundInterfaceDeclaration = new BoundInterfaceDeclaration();
        this.declarationCache.set(interfaceDeclaration, boundInterfaceDeclaration);
        boundInterfaceDeclaration.parent = parent;
        boundInterfaceDeclaration.locals = new BoundSymbolTable();
        boundInterfaceDeclaration.type = new ObjectType(boundInterfaceDeclaration);
        const name = this.getIdentifierText(interfaceDeclaration.identifier);
        boundInterfaceDeclaration.identifier = this.declareSymbolInScope(name, boundInterfaceDeclaration);

        if (interfaceDeclaration.baseTypes) {
            boundInterfaceDeclaration.baseTypes = this.bindTypeReferenceSequence(interfaceDeclaration.baseTypes,
                NodeKind.InterfaceDeclaration,
            ) as BoundInterfaceDeclaration[];
        }

        boundInterfaceDeclaration.members = new BoundTypeMembers<BoundInterfaceDeclarationMember>();
        this.bindInterfaceDeclarationMembers(interfaceDeclaration, boundInterfaceDeclaration);

        return boundInterfaceDeclaration;
    }

    private bindInterfaceDeclarationMembers(
        interfaceDeclaration: InterfaceDeclaration,
        parent: BoundInterfaceDeclaration,
    ): void {
        const boundInterfaceDeclarationMembers = parent.members;

        for (const interfaceDeclarationMember of interfaceDeclaration.members) {
            switch (interfaceDeclarationMember.kind) {
                case NodeKind.DataDeclarationSequence: {
                    const boundDataDeclarations = this.bindDataDeclarationSequence(interfaceDeclarationMember, parent);
                    for (const dataDeclaration of boundDataDeclarations) {
                        boundInterfaceDeclarationMembers.set(dataDeclaration.identifier.name, dataDeclaration);
                    }
                    break;
                }
                case NodeKind.InterfaceMethodDeclaration: {
                    const boundInterfaceMethodGroupDeclaration = this.bindInterfaceMethodDeclaration(interfaceDeclarationMember, parent);
                    boundInterfaceDeclarationMembers.set(boundInterfaceMethodGroupDeclaration.identifier.name, boundInterfaceMethodGroupDeclaration);
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
    }

    // #region Interface method declaration

    private bindInterfaceMethodDeclaration(
        interfaceMethodDeclaration: InterfaceMethodDeclaration,
        parent: BoundInterfaceDeclaration,
    ): BoundInterfaceMethodGroupDeclaration {
        let boundInterfaceMethodDeclaration = this.declarationCache.get(interfaceMethodDeclaration);
        if (boundInterfaceMethodDeclaration) {
            return boundInterfaceMethodDeclaration.parent as BoundInterfaceMethodGroupDeclaration;
        }

        const name = this.getIdentifierText(interfaceMethodDeclaration.identifier);

        let boundInterfaceMethodGroupDeclaration = parent.members.get(name,
            BoundNodeKind.InterfaceMethodGroupDeclaration,
        ) as BoundInterfaceMethodGroupDeclaration | undefined;

        if (!boundInterfaceMethodGroupDeclaration) {
            boundInterfaceMethodGroupDeclaration = new BoundInterfaceMethodGroupDeclaration();
            boundInterfaceMethodGroupDeclaration.parent = parent;
            boundInterfaceMethodGroupDeclaration.identifier = this.declareSymbolInScope(name, boundInterfaceMethodGroupDeclaration);
            boundInterfaceMethodGroupDeclaration.type = new MethodGroupType(boundInterfaceMethodGroupDeclaration);
        }

        boundInterfaceMethodDeclaration = new BoundInterfaceMethodDeclaration();
        this.declarationCache.set(interfaceMethodDeclaration, boundInterfaceMethodDeclaration);
        boundInterfaceMethodGroupDeclaration.overloads.add(boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.parent = boundInterfaceMethodGroupDeclaration;
        boundInterfaceMethodDeclaration.locals = new BoundSymbolTable();
        boundInterfaceMethodDeclaration.type = new MethodType(boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.identifier = new BoundSymbol(name, boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.returnType = this.bindTypeAnnotation(interfaceMethodDeclaration.returnType);
        boundInterfaceMethodDeclaration.parameters = this.bindDataDeclarationSequence(interfaceMethodDeclaration.parameters, boundInterfaceMethodDeclaration);

        return boundInterfaceMethodGroupDeclaration;
    }

    // #endregion

    // #endregion

    // #region Class declaration

    private bindClassDeclaration(
        classDeclaration: ClassDeclaration,
        parent: BoundNodes,
    ): BoundClassDeclaration {
        let boundClassDeclaration = this.declarationCache.get(classDeclaration);
        if (boundClassDeclaration) {
            return boundClassDeclaration as BoundClassDeclaration;
        }

        boundClassDeclaration = new BoundClassDeclaration();
        this.declarationCache.set(classDeclaration, boundClassDeclaration);
        boundClassDeclaration.declaration = classDeclaration;
        boundClassDeclaration.parent = parent;
        boundClassDeclaration.locals = new BoundSymbolTable();
        const name = this.getIdentifierText(classDeclaration.identifier);
        boundClassDeclaration.identifier = this.declareSymbolInScope(name, boundClassDeclaration);
        boundClassDeclaration.type = new ObjectType(boundClassDeclaration);

        if (classDeclaration.typeParameters) {
            boundClassDeclaration.typeParameters = this.bindTypeParameters(classDeclaration.typeParameters, boundClassDeclaration);
        }

        if (classDeclaration.superType) {
            boundClassDeclaration.superType = this.bindTypeReference(classDeclaration.superType,
                NodeKind.ExternClassDeclaration,
                NodeKind.ClassDeclaration,
            ) as BoundExternClassDeclaration | BoundClassDeclaration;
        } else {
            boundClassDeclaration.superType = this.project.objectTypeDeclaration;
        }

        if (classDeclaration.implementedTypes) {
            boundClassDeclaration.implementedTypes = this.bindTypeReferenceSequence(classDeclaration.implementedTypes,
                NodeKind.InterfaceDeclaration,
            ) as BoundInterfaceDeclaration[];
        }

        boundClassDeclaration.members = new BoundTypeMembers<BoundClassDeclarationMember>();
        this.bindClassDeclarationMembers(classDeclaration, boundClassDeclaration);

        if (!this.hasParameterlessConstructor(boundClassDeclaration)) {
            const boundMethodGroupDeclaration = this.createParameterlessConstructor(boundClassDeclaration);
            boundClassDeclaration.members.set(boundMethodGroupDeclaration.identifier.name, boundMethodGroupDeclaration);
        }

        return boundClassDeclaration;
    }

    // #region Type reference sequence

    private bindTypeReferenceSequence(typeReferenceSequence: (TypeReference | CommaSeparator)[], ...kinds: TypeDeclaration['kind'][]) {
        const boundTypeReferences: BoundTypeReferenceDeclaration[] = [];

        for (const typeReference of typeReferenceSequence) {
            switch (typeReference.kind) {
                case NodeKind.TypeReference: {
                    const boundTypeReference = this.bindTypeReference(typeReference, ...kinds);
                    boundTypeReferences.push(boundTypeReference);
                    break;
                }
                case NodeKind.CommaSeparator: { break; }
                default: {
                    assertNever(typeReference);
                    break;
                }
            }
        }

        return boundTypeReferences;
    }

    private bindTypeReference(typeReference: MissableTypeReference, ...kinds: TypeDeclaration['kind'][]) {
        if (typeReference.kind === TokenKind.Missing) {
            throw new Error('Type reference is missing.');
        }

        let boundDeclaration: BoundTypeReferenceDeclaration;

        switch (typeReference.identifier.kind) {
            case TokenKind.VoidKeyword: {
                boundDeclaration = this.project.voidTypeDeclaration;
                break;
            }
            case TokenKind.BoolKeyword: {
                boundDeclaration = this.project.boolTypeDeclaration;
                break;
            }
            case TokenKind.IntKeyword: {
                boundDeclaration = this.project.intTypeDeclaration;
                break;
            }
            case TokenKind.FloatKeyword: {
                boundDeclaration = this.project.floatTypeDeclaration;
                break;
            }
            case TokenKind.StringKeyword: {
                boundDeclaration = this.project.stringTypeDeclaration;
                break;
            }
            default: {
                boundDeclaration = this.resolveTypeReference(typeReference, ...kinds);

                if (typeReference.typeArguments) {
                    switch (boundDeclaration.kind) {
                        case BoundNodeKind.ExternClassDeclaration:
                        case BoundNodeKind.InterfaceDeclaration:
                        case BoundNodeKind.TypeParameter: {
                            throw new Error(`'${boundDeclaration.kind}' cannot be generic.`);
                        }
                    }

                    const boundTypeArguments = this.bindTypeReferenceSequence(typeReference.typeArguments);
                    const typeMap = this.createTypeMap(boundDeclaration, boundTypeArguments);
                    boundDeclaration = this.instantiateGenericType(boundDeclaration, typeMap);
                }
            }
        }

        for (const { } of typeReference.arrayTypeAnnotations) {
            boundDeclaration = this.instantiateArrayType(boundDeclaration);
        }

        return boundDeclaration;
    }

    private resolveTypeReference(typeReference: TypeReference, ...kinds: TypeDeclarationNodeKind[]) {
        const { identifier } = typeReference;
        switch (identifier.kind) {
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.Identifier: {
                break;
            }
            case NodeKind.EscapedIdentifier: {
                throw new Error(`Resolving type references with escaped identifiers is not implemented.`);
            }
            case TokenKind.Missing: {
                throw new Error(`Type reference identifier is missing.`);
            }
            default: {
                throw new Error(`'resolveTypeReference()' may only be called with identifier type references.`);
            }
        }

        const identifierText = identifier.getText(this.document);

        // Module is specified
        if (typeReference.moduleIdentifier) {
            const moduleIdentifierText = typeReference.moduleIdentifier.getText(this.document);
            const moduleSymbol = this.module.locals.get(moduleIdentifierText);
            if (!moduleSymbol) {
                throw new Error(`The '${moduleIdentifierText}' module is not imported.`);
            }

            const boundModuleDeclaration = moduleSymbol.declaration!;
            if (boundModuleDeclaration.kind !== BoundNodeKind.ModuleDeclaration) {
                throw new Error(`'${moduleIdentifierText}' is not a module.`);
            }

            const declaration = this.bindTypeDeclarationFromModule(boundModuleDeclaration, identifierText, kinds);
            if (!declaration) {
                throw new Error(`Could not find '${identifierText}' in '${moduleIdentifierText}'.`);
            }

            return declaration;
        }

        // If we're in a class, check if it's a type parameter
        const classDeclaration = ParseTreeVisitor.getNearestAncestor(typeReference,
            NodeKind.ClassDeclaration,
        ) as ClassDeclaration | undefined;
        if (classDeclaration &&
            classDeclaration.typeParameters
        ) {
            const boundClassDeclaration = this.bindClassDeclaration(classDeclaration, this.module);
            const boundTypeParameter = boundClassDeclaration.locals.get(identifierText);
            if (boundTypeParameter &&
                boundTypeParameter.declaration.kind === BoundNodeKind.TypeParameter
            ) {
                return boundTypeParameter.declaration;
            }
        }

        // Check if it's a type in this module
        const declaration = this.bindTypeDeclarationFromModule(this.module, identifierText, kinds);
        if (declaration) {
            return declaration;
        }

        // Check if it's a type in any imported modules
        for (const [, node] of this.module.locals) {
            const nodeDeclaration = node.declaration!;
            if (nodeDeclaration.kind === BoundNodeKind.ModuleDeclaration) {
                const declaration = this.bindTypeDeclarationFromModule(nodeDeclaration, identifierText, kinds);
                if (declaration) {
                    return declaration;
                }
            }
        }

        // TODO: This is a temporary hack until `Import monkey` is working.
        switch (identifier.kind) {
            case TokenKind.ObjectKeyword: {
                return this.project.objectTypeDeclaration;
            }
            case TokenKind.ThrowableKeyword: {
                return this.project.throwableTypeDeclaration;
            }
        }

        throw new Error(`Could not find '${identifierText}'.`);
    }

    private bindTypeDeclarationFromModule(
        boundModuleDeclaration: BoundModuleDeclaration,
        identifierText: string,
        kinds: TypeDeclarationNodeKind[]
    ) {
        const moduleDeclaration = boundModuleDeclaration.declaration;

        for (const member of moduleDeclaration.members) {
            switch (member.kind) {
                case NodeKind.ExternClassDeclaration:
                case NodeKind.InterfaceDeclaration:
                case NodeKind.ClassDeclaration: {
                    const memberIdentifierText = this.getIdentifierText(member.identifier, moduleDeclaration.document);
                    if (identifierText === memberIdentifierText) {
                        assertTypeDeclarationKind(member.kind, kinds, memberIdentifierText);

                        switch (member.kind) {
                            case NodeKind.ExternClassDeclaration: {
                                return this.bindExternClassDeclaration(member, boundModuleDeclaration);
                            }
                            case NodeKind.InterfaceDeclaration: {
                                return this.bindInterfaceDeclaration(member, boundModuleDeclaration);
                            }
                            case NodeKind.ClassDeclaration: {
                                return this.bindClassDeclaration(member, boundModuleDeclaration);
                            }
                            default: {
                                return assertNever(member);
                            }
                        }
                    }
                    break;
                }
            }
        }
    }

    // #endregion

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
        boundTypeParameter.type = new TypeParameterType(boundTypeParameter);
        const name = this.getIdentifierText(typeParameter.identifier);
        boundTypeParameter.identifier = this.declareSymbolInScope(name, boundTypeParameter);

        return boundTypeParameter;
    }

    // #endregion

    private bindClassDeclarationMembers(
        classDeclaration: ClassDeclaration,
        parent: BoundClassDeclaration,
    ): void {
        const boundClassDeclarationMembers = parent.members;

        for (const classDeclarationMember of classDeclaration.members) {
            switch (classDeclarationMember.kind) {
                case NodeKind.AccessibilityDirective: {
                    console.warn(`'${classDeclarationMember.accessibilityKeyword.kind}' directive is not implemented.`);
                    break;
                }
                case NodeKind.DataDeclarationSequence: {
                    const boundDataDeclarationSequence = this.bindDataDeclarationSequence(classDeclarationMember, parent);
                    for (const dataDeclaration of boundDataDeclarationSequence) {
                        boundClassDeclarationMembers.set(dataDeclaration.identifier.name, dataDeclaration);
                    }
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    const boundFunctionGroupDeclaration = this.bindFunctionDeclaration(classDeclarationMember, parent);
                    boundClassDeclarationMembers.set(boundFunctionGroupDeclaration.identifier.name, boundFunctionGroupDeclaration);
                    break;
                }
                case NodeKind.ClassMethodDeclaration: {
                    if (this.declarationCache.get(classDeclarationMember)) {
                        continue;
                    }

                    const classMethodName = this.getIdentifierText(classDeclarationMember.identifier);
                    const boundClassMethodGroupDeclaration = this.bindClassMethodGroup(classMethodName, classDeclaration.members, parent);
                    boundClassDeclarationMembers.set(boundClassMethodGroupDeclaration.identifier.name, boundClassMethodGroupDeclaration);
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
    }

    // #region Default constructor

    private hasParameterlessConstructor(boundClassDeclaration: BoundClassDeclaration): boolean {
        const newMethod = this.getMethod(boundClassDeclaration, 'New');
        if (newMethod) {
            return true;
        }

        return false;
    }

    private createParameterlessConstructor(parent: BoundClassDeclaration): BoundClassMethodGroupDeclaration {
        const name = 'New';

        const boundMethodGroupDeclaration = this.getBoundClassMethodGroupDeclaration(parent, name);

        const boundClassMethodDeclaration = new BoundClassMethodDeclaration();
        boundMethodGroupDeclaration.overloads.add(boundClassMethodDeclaration);
        boundClassMethodDeclaration.parent = boundMethodGroupDeclaration;
        boundClassMethodDeclaration.locals = new BoundSymbolTable();
        boundClassMethodDeclaration.type = new MethodType(boundClassMethodDeclaration);
        boundClassMethodDeclaration.identifier = new BoundSymbol(name, boundClassMethodDeclaration);
        boundClassMethodDeclaration.returnType = parent;
        boundClassMethodDeclaration.parameters = [];

        // TODO: Check what Monkey X compiler does here
        boundClassMethodDeclaration.statements = [];

        return boundMethodGroupDeclaration;
    }

    // #endregion

    // #region Class method declaration

    private getBoundClassMethodGroupDeclaration(parent: BoundClassDeclaration, name: string) {
        let boundClassMethodGroupDeclaration = parent.members.get(name,
            BoundNodeKind.ClassMethodGroupDeclaration,
        ) as BoundClassMethodGroupDeclaration | undefined;

        if (!boundClassMethodGroupDeclaration) {
            boundClassMethodGroupDeclaration = new BoundClassMethodGroupDeclaration();
            boundClassMethodGroupDeclaration.parent = parent;
            boundClassMethodGroupDeclaration.identifier = this.declareSymbolInScope(name, boundClassMethodGroupDeclaration);
            boundClassMethodGroupDeclaration.type = new MethodGroupType(boundClassMethodGroupDeclaration);
        }

        return boundClassMethodGroupDeclaration;
    }

    private bindClassMethodGroup(
        name: string,
        members: ClassDeclaration['members'],
        parent: BoundClassDeclaration,
    ): BoundClassMethodGroupDeclaration {
        const boundClassMethodGroupDeclaration = this.getBoundClassMethodGroupDeclaration(parent, name);

        const classMethodDeclarations: ClassMethodDeclaration[] = [];

        for (const member of members) {
            if (member.kind === NodeKind.ClassMethodDeclaration) {
                const memberName = this.getIdentifierText(member.identifier);
                if (areIdentifiersSame(name, memberName)) {
                    classMethodDeclarations.push(member);
                }
            }
        }

        for (const classMethodDeclaration of classMethodDeclarations) {
            const boundClassMethodDeclaration = new BoundClassMethodDeclaration();
            this.declarationCache.set(classMethodDeclaration, boundClassMethodDeclaration);
            boundClassMethodGroupDeclaration.overloads.add(boundClassMethodDeclaration);
            boundClassMethodDeclaration.parent = boundClassMethodGroupDeclaration;
            boundClassMethodDeclaration.locals = new BoundSymbolTable();
            boundClassMethodDeclaration.type = new MethodType(boundClassMethodDeclaration);
            boundClassMethodDeclaration.identifier = new BoundSymbol(name, boundClassMethodDeclaration);

            if (areIdentifiersSame('New', name)) {
                boundClassMethodDeclaration.returnType = parent;
            } else {
                boundClassMethodDeclaration.returnType = this.bindTypeAnnotation(classMethodDeclaration.returnType);
            }

            boundClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(classMethodDeclaration.parameters, boundClassMethodDeclaration);

            if (classMethodDeclaration.statements) {
                boundClassMethodDeclaration.statements = this.bindStatements(classMethodDeclaration.statements, boundClassMethodDeclaration);
            }
        }

        return boundClassMethodGroupDeclaration;
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
                case NodeKind.NumericForLoop: {
                    const boundNumericForLoop = this.bindNumericForLoop(statement, parent);
                    boundStatements.push(boundNumericForLoop);
                    break;
                }
                case NodeKind.ForEachInLoop: {
                    const boundForEachInLoop = this.bindForEachInLoop(statement, parent);
                    boundStatements.push(boundForEachInLoop);
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
            boundReturnStatement.type = this.project.voidTypeDeclaration.type;
        }

        const functionOrMethodDeclaration = this.getNearestAncestor(boundReturnStatement,
            BoundNodeKind.FunctionDeclaration,
            BoundNodeKind.ClassMethodDeclaration,
        ) as BoundFunctionDeclaration | BoundClassMethodDeclaration;

        if (!boundReturnStatement.type.isConvertibleTo(functionOrMethodDeclaration.returnType.type)) {
            throw new Error(`'${boundReturnStatement.type}' is not convertible to '${functionOrMethodDeclaration.returnType.type}'.`);
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
        boundIfStatement.locals = new BoundSymbolTable();
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
        boundElseIfClause.locals = new BoundSymbolTable();
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
        boundElseClause.locals = new BoundSymbolTable();
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
        boundCaseClause.locals = new BoundSymbolTable();
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
        boundDefaultClause.locals = new BoundSymbolTable();
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
        boundWhileLoop.locals = new BoundSymbolTable();
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
        boundRepeatLoop.locals = new BoundSymbolTable();
        if (repeatLoop.untilExpression) {
            boundRepeatLoop.expression = this.bindExpression(repeatLoop.untilExpression, boundRepeatLoop);
        }
        boundRepeatLoop.statements = this.bindStatements(repeatLoop.statements, boundRepeatLoop);

        return boundRepeatLoop;
    }

    // #endregion

    // #region For loop

    private bindNumericForLoop(
        numericForLoop: NumericForLoop,
        parent: BoundNodes,
    ): BoundForLoop {
        const boundForLoop = new BoundForLoop();
        boundForLoop.parent = parent;
        boundForLoop.locals = new BoundSymbolTable();
        // boundForLoop.statement = this.bindLoopVariableStatement(forLoop.loopVariableStatement, boundForLoop);
        boundForLoop.lastValueExpression = this.bindExpression(numericForLoop.lastValueExpression, boundForLoop);

        if (numericForLoop.stepValueExpression) {
            boundForLoop.stepValueExpression = this.bindExpression(numericForLoop.stepValueExpression, boundForLoop);
        }

        boundForLoop.statements = this.bindStatements(numericForLoop.statements, boundForLoop);


        return boundForLoop;
    }

    private bindForEachInLoop(
        forEachInLoop: ForEachInLoop,
        parent: BoundNodes,
    ): BoundWhileLoop {
        const boundWhileLoop = new BoundWhileLoop();
        boundWhileLoop.parent = parent;
        boundWhileLoop.locals = new BoundSymbolTable();

        // // For EachIn loop -- loop variable statement
        // if (dataDeclaration.eachInKeyword) {
        //     if (dataDeclaration.equalsSign &&
        //         dataDeclaration.equalsSign.kind === TokenKind.ColonEqualsSign
        //     ) {
        //         if (!boundDataDeclaration.expression) {
        //             // No expression to infer type from, default to Int
        //             boundDataDeclaration.type = this.project.intTypeDeclaration.type;
        //         } else {
        //             boundDataDeclaration.type = this.getCollectionElementType(boundDataDeclaration.expression.type);
        //         }
        //     } else {
        //         boundDataDeclaration.typeAnnotation = this.bindTypeAnnotation(dataDeclaration.type);
        //         boundDataDeclaration.type = boundDataDeclaration.typeAnnotation!.type;

        //         if (boundDataDeclaration.expression) {
        //             const collectionElementType = this.getCollectionElementType(boundDataDeclaration.expression.type);
        //             if (!collectionElementType.isConvertibleTo(boundDataDeclaration.type)) {
        //                 throw new Error(`'${collectionElementType}' is not convertible to '${boundDataDeclaration.typeAnnotation}'.`);
        //             }
        //         }
        //     }
        // }

        return boundWhileLoop;
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
        boundTryStatement.locals = new BoundSymbolTable();
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
        boundCatchClause.locals = new BoundSymbolTable();

        switch (catchClause.parameter.kind) {
            case NodeKind.DataDeclaration: {
                boundCatchClause.parameter = this.bindDataDeclaration(catchClause.parameter, boundCatchClause);
                break;
            }
            case TokenKind.Missing: {
                throw new Error('Catch clause must declare a parameter.');
            }
            default: {
                assertNever(catchClause.parameter);
                break;
            }
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
        if (assignmentStatement.operator.kind !== TokenKind.EqualsSign) {
            const operator = this.getBinaryExpressionOperatorKind(assignmentStatement.operator);

            const boundBinaryExpression = new BoundBinaryExpression();
            boundBinaryExpression.parent = boundAssignmentStatement;
            boundBinaryExpression.leftOperand = leftOperand;
            boundBinaryExpression.operator = operator;
            boundBinaryExpression.rightOperand = rightOperand;
            boundBinaryExpression.type = this.getTypeOfBinaryExpression(leftOperand, operator, rightOperand);

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

    private getBinaryExpressionOperatorKind(assignmentStatementOperator: Exclude<AssignmentOperatorToken, EqualsSignToken>) {
        switch (assignmentStatementOperator.kind) {
            case TokenKind.AsteriskEqualsSign: { return TokenKind.Asterisk; }
            case TokenKind.SlashEqualsSign: { return TokenKind.Slash; }
            case TokenKind.ModKeywordEqualsSign: { return TokenKind.ModKeyword; }
            case TokenKind.PlusSignEqualsSign: { return TokenKind.PlusSign; }
            case TokenKind.HyphenMinusEqualsSign: { return TokenKind.HyphenMinus; }
            case TokenKind.ShlKeywordEqualsSign: { return TokenKind.ShlKeyword; }
            case TokenKind.ShrKeywordEqualsSign: { return TokenKind.ShrKeyword; }
            case TokenKind.AmpersandEqualsSign: { return TokenKind.Ampersand; }
            case TokenKind.TildeEqualsSign: { return TokenKind.Tilde; }
            case TokenKind.VerticalBarEqualsSign: { return TokenKind.VerticalBar; }
            default: {
                return assertNever(assignmentStatementOperator);
            }
        }
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
        boundBinaryExpression.operator = expression.operator.kind;
        boundBinaryExpression.rightOperand = this.bindExpression(expression.rightOperand, boundBinaryExpression);
        boundBinaryExpression.type = this.getTypeOfBinaryExpression(
            boundBinaryExpression.leftOperand,
            boundBinaryExpression.operator,
            boundBinaryExpression.rightOperand,
        );

        return boundBinaryExpression;
    }

    private getTypeOfBinaryExpression(
        leftOperand: BoundExpressions,
        operator: BinaryExpressionOperatorToken['kind'],
        rightOperand: BoundExpressions,
    ) {
        switch (operator) {
            // Binary arithmetic operations
            case TokenKind.Asterisk:
            case TokenKind.Slash:
            case TokenKind.ModKeyword:
            case TokenKind.PlusSign:
            case TokenKind.HyphenMinus: {
                return this.bindBinaryArithmeticOperationType(leftOperand, operator, rightOperand);
            }

            // Bitwise operations
            case TokenKind.ShlKeyword:
            case TokenKind.ShrKeyword:
            case TokenKind.Ampersand:
            case TokenKind.Tilde:
            case TokenKind.VerticalBar: {
                return this.bindBitwiseOperationType(leftOperand, operator, rightOperand);
            }

            // Comparison operations
            case TokenKind.EqualsSign:
            case TokenKind.LessThanSign:
            case TokenKind.GreaterThanSign:
            case TokenKind.LessThanSignEqualsSign:
            case TokenKind.GreaterThanSignEqualsSign:
            case TokenKind.LessThanSignGreaterThanSign: {
                return this.bindComparisonOperationType(leftOperand, operator, rightOperand);
            }

            // Conditional operations
            case TokenKind.AndKeyword:
            case TokenKind.OrKeyword: {
                return this.project.boolTypeDeclaration.type;
            }

            default: {
                return assertNever(operator);
            }
        }
    }

    private bindBinaryArithmeticOperationType(
        leftOperand: BoundExpressions,
        operatorKind: TokenKind,
        rightOperand: BoundExpressions,
    ) {
        const balancedType = this.getBalancedType(leftOperand.type, rightOperand.type);
        if (!balancedType) {
            throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
        }

        switch (balancedType.kind) {
            case TypeKind.String: {
                if (operatorKind !== TokenKind.PlusSign) {
                    throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
                }
                break;
            }
            case TypeKind.Int:
            case TypeKind.Float: {
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
        if (!leftOperand.type.isConvertibleTo(this.project.intTypeDeclaration.type) ||
            !rightOperand.type.isConvertibleTo(this.project.intTypeDeclaration.type)
        ) {
            throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
        }

        return this.project.intTypeDeclaration.type;
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

        return this.project.boolTypeDeclaration.type;
    }

    // #endregion

    // #region Unary expression

    private bindUnaryExpression(
        expression: UnaryExpression,
        parent: BoundNodes,
    ): BoundUnaryExpression {
        const boundUnaryExpression = new BoundUnaryExpression();
        boundUnaryExpression.parent = parent;
        boundUnaryExpression.operator = expression.operator.kind;
        boundUnaryExpression.operand = this.bindExpression(expression.operand, boundUnaryExpression);
        boundUnaryExpression.type = this.getTypeOfUnaryExpression(
            boundUnaryExpression.operator,
            boundUnaryExpression.operand,
        );

        return boundUnaryExpression;
    }

    private getTypeOfUnaryExpression(
        operator: UnaryOperatorToken['kind'],
        operand: BoundExpressions,
    ) {
        switch (operator) {
            // Unary plus
            case TokenKind.PlusSign:
            // Unary minus
            case TokenKind.HyphenMinus: {
                switch (operand.type.kind) {
                    case TypeKind.Int:
                    case TypeKind.Float: {
                        return operand.type;
                    }
                    default: {
                        throw new Error(`Unexpected operand type '${operand.type}' for unary operator '${operator}'.`);
                    }
                }
            }
            // Bitwise complement
            case TokenKind.Tilde: {
                if (operand.type.isConvertibleTo(this.project.intTypeDeclaration.type)) {
                    return this.project.intTypeDeclaration.type;
                } else {
                    throw new Error(`Cannot get bitwise complement of '${operand.type}'. '${operand.type}' is not implicitly convertible to 'Int'.`);
                }
            }
            // Boolean inverse
            case TokenKind.NotKeyword: {
                return this.project.boolTypeDeclaration.type;
            }
            default: {
                return assertNever(operator);
            }
        }
    }

    // #endregion

    // #region New expression

    private bindNewExpression(
        newExpression: NewExpression,
        parent: BoundNodes,
    ): BoundNewExpression {
        const boundNewExpression = new BoundNewExpression();
        boundNewExpression.parent = parent;

        const boundClassLikeDeclaration = this.bindTypeReference(newExpression.type,
            NodeKind.ExternClassDeclaration,
            NodeKind.ClassDeclaration,
        ) as BoundExternClassDeclaration | BoundClassDeclaration | undefined;

        if (!boundClassLikeDeclaration) {
            throw new Error(`Couldn't find a class named '${'TODO: Get the type name'}'.`);
        }

        boundNewExpression.typeReference = boundClassLikeDeclaration;

        const constructorGroup = this.bindConstructorGroup(boundClassLikeDeclaration);
        boundNewExpression.type = constructorGroup.type;

        return boundNewExpression;
    }

    private bindConstructorGroup(boundClassLikeDeclaration: BoundExternClassDeclaration | BoundClassDeclaration) {
        switch (boundClassLikeDeclaration.kind) {
            case BoundNodeKind.ExternClassDeclaration: {
                return this.bindExternClassConstructorGroup(boundClassLikeDeclaration);
            }
            case BoundNodeKind.ClassDeclaration: {
                return this.bindClassConstructorGroup(boundClassLikeDeclaration);
            }
            default: {
                return assertNever(boundClassLikeDeclaration);
            }
        }
    }

    private bindExternClassConstructorGroup(boundExternClassDeclaration: BoundExternClassDeclaration) {
        const name = 'New';

        let boundExternConstructorGroupDeclaration = boundExternClassDeclaration.members.get(name,
            BoundNodeKind.ExternClassMethodGroupDeclaration,
        ) as BoundExternClassMethodGroupDeclaration | undefined;

        if (!boundExternConstructorGroupDeclaration) {
            const { members } = boundExternClassDeclaration.declaration;
            for (const member of members) {
                if (member.kind === NodeKind.ExternClassMethodDeclaration) {
                    const memberIdentifierText = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, memberIdentifierText)) {
                        boundExternConstructorGroupDeclaration = this.bindExternClassMethodGroup(name, members, boundExternClassDeclaration);
                        break;
                    }
                }
            }

            if (!boundExternConstructorGroupDeclaration) {
                boundExternConstructorGroupDeclaration = this.createParameterlessExternConstructor(boundExternClassDeclaration);
            }

            boundExternClassDeclaration.members.set(boundExternConstructorGroupDeclaration.identifier.name, boundExternConstructorGroupDeclaration);
        }

        return boundExternConstructorGroupDeclaration;
    }

    private bindClassConstructorGroup(boundClassDeclaration: BoundClassDeclaration) {
        const name = 'New';

        let boundClassConstructorGroupDeclaration = boundClassDeclaration.members.get(name,
            BoundNodeKind.ClassMethodGroupDeclaration,
        ) as BoundClassMethodGroupDeclaration | undefined;

        if (!boundClassConstructorGroupDeclaration) {
            const { members } = boundClassDeclaration.declaration;
            for (const member of members) {
                if (member.kind === NodeKind.ClassMethodDeclaration) {
                    const memberIdentifierText = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, memberIdentifierText)) {
                        boundClassConstructorGroupDeclaration = this.bindClassMethodGroup(name, members, boundClassDeclaration);
                        break;
                    }
                }
            }

            if (!boundClassConstructorGroupDeclaration) {
                boundClassConstructorGroupDeclaration = this.createParameterlessConstructor(boundClassDeclaration);
            }

            boundClassDeclaration.members.set(boundClassConstructorGroupDeclaration.identifier.name, boundClassConstructorGroupDeclaration);
        }

        return boundClassConstructorGroupDeclaration;
    }

    // #endregion

    // #region Null expression

    private bindNullExpression(
        parent: BoundNodes,
    ): BoundNullExpression {
        const boundNullExpression = new BoundNullExpression();
        boundNullExpression.parent = parent;
        boundNullExpression.type = this.project.nullTypeDeclaration.type;

        return boundNullExpression;
    }

    // #endregion

    // #region Boolean literal expression

    private bindBooleanLiteralExpression(
        parent: BoundNodes,
    ): BoundBooleanLiteralExpression {
        const boundBooleanLiteralExpression = new BoundBooleanLiteralExpression();
        boundBooleanLiteralExpression.parent = parent;
        boundBooleanLiteralExpression.type = this.project.boolTypeDeclaration.type;

        return boundBooleanLiteralExpression;
    }

    // #endregion

    // #region Self expression

    private bindSelfExpression(
        parent: BoundNodes,
    ): BoundSelfExpression {
        const boundSelfExpression = new BoundSelfExpression();
        boundSelfExpression.parent = parent;

        const classDeclaration = this.getNearestAncestor(boundSelfExpression,
            BoundNodeKind.ClassDeclaration,
        ) as BoundClassDeclaration;

        boundSelfExpression.type = classDeclaration.type;

        return boundSelfExpression;
    }

    // #endregion

    // #region Super expression

    private bindSuperExpression(
        parent: BoundNodes,
    ): BoundSuperExpression {
        const boundSuperExpression = new BoundSuperExpression();
        boundSuperExpression.parent = parent;

        const classDeclaration = this.getNearestAncestor(boundSuperExpression,
            BoundNodeKind.ClassDeclaration,
        ) as BoundClassDeclaration;

        if (!classDeclaration.superType) {
            throw new Error(`'${classDeclaration.identifier.name}' does not extend a base class.`);
        }

        boundSuperExpression.type = classDeclaration.superType.type;

        return boundSuperExpression;
    }

    // #endregion

    // #region String literal expression

    private bindStringLiteralExpression(
        parent: BoundNodes,
    ): BoundStringLiteralExpression {
        const boundStringLiteralExpression = new BoundStringLiteralExpression();
        boundStringLiteralExpression.parent = parent;
        boundStringLiteralExpression.type = this.project.stringTypeDeclaration.type;

        return boundStringLiteralExpression;
    }

    // #endregion

    // #region Float literal expression

    private bindFloatLiteralExpression(
        parent: BoundNodes,
    ): BoundFloatLiteralExpression {
        const boundFloatLiteralExpression = new BoundFloatLiteralExpression();
        boundFloatLiteralExpression.parent = parent;
        boundFloatLiteralExpression.type = this.project.floatTypeDeclaration.type;

        return boundFloatLiteralExpression;
    }

    // #endregion

    // #region Integer literal expression

    private bindIntegerLiteralExpression(
        parent: BoundNodes,
    ): BoundIntegerLiteralExpression {
        const boundIntegerLiteralExpression = new BoundIntegerLiteralExpression();
        boundIntegerLiteralExpression.parent = parent;
        boundIntegerLiteralExpression.type = this.project.intTypeDeclaration.type;

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
        boundArrayLiteralExpression.type = this.getTypeOfArrayLiteralExpression(boundArrayLiteralExpression.expressions);

        return boundArrayLiteralExpression;
    }

    private getTypeOfArrayLiteralExpression(expressions: BoundExpressions[]) {
        let { type } = expressions[0];

        for (const expression of expressions) {
            const balancedType = this.getBalancedType(type, expression.type);
            if (!balancedType) {
                throw new Error('Array must contain a common type.');
            }

            type = balancedType;
        }

        const arrayTypeDeclaration = this.instantiateArrayType(type.declaration as BoundTypeReferenceDeclaration);

        return arrayTypeDeclaration.type;
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

        // When binding `member` on `ScopeMemberAccessExpression`.
        if (scope) {
            switch (identifier.kind) {
                case TokenKind.BoolKeyword:
                case TokenKind.IntKeyword:
                case TokenKind.FloatKeyword:
                case TokenKind.StringKeyword: {
                    throw new Error(`'${identifier.kind}' is a reserved keyword.`);
                }
                default: {
                    const identifierText = this.getIdentifierText(identifier);
                    const member = scope.declaration.members.get(identifierText);
                    if (!member) {
                        throw new Error(`'${identifierText}' does not exist on '${scope.declaration.identifier.name}'.`);
                    }

                    boundIdentifierExpression.identifier = member.identifier;
                    boundIdentifierExpression.type = member.type;
                    break;
                }
            }
        } else {
            switch (identifier.kind) {
                case TokenKind.BoolKeyword: {
                    boundIdentifierExpression.type = this.project.boolTypeDeclaration.type;
                    break;
                }
                case TokenKind.IntKeyword: {
                    boundIdentifierExpression.type = this.project.intTypeDeclaration.type;
                    break;
                }
                case TokenKind.FloatKeyword: {
                    boundIdentifierExpression.type = this.project.floatTypeDeclaration.type;
                    break;
                }
                case TokenKind.StringKeyword: {
                    boundIdentifierExpression.type = this.project.stringTypeDeclaration.type;
                    break;
                }
                case TokenKind.Identifier:
                case TokenKind.ObjectKeyword:
                case TokenKind.ThrowableKeyword:
                case TokenKind.NewKeyword:
                case NodeKind.EscapedIdentifier: {
                    const identifierText = this.getIdentifierText(identifier);
                    let member = this.resolveIdentifier(identifierText, boundIdentifierExpression);
                    if (!member) {
                        throw new Error(`Could not find '${identifierText}'.`);
                    }

                    // Cast expression
                    if (identifierExpression.typeArguments) {
                        if (member.kind !== BoundNodeKind.ClassDeclaration ||
                            !member.typeParameters
                        ) {
                            throw new Error(`'${identifierText}' is not a generic class.`);
                        }

                        const typeArguments = this.bindTypeReferenceSequence(identifierExpression.typeArguments);
                        const typeMap = this.createTypeMap(member, typeArguments);
                        member = this.instantiateGenericType(member, typeMap);
                    }

                    boundIdentifierExpression.identifier = member.identifier;
                    boundIdentifierExpression.type = (member as any).type;
                    break;
                }
                default: {
                    assertNever(identifier);
                    break;
                }
            }
        }

        return boundIdentifierExpression;
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
            case TypeKind.String:
            case TypeKind.Array:
            case TypeKind.Object: {
                boundScopeMemberAccessExpression.member = this.bindExpression(
                    scopeMemberAccessExpression.member,
                    boundScopeMemberAccessExpression,
                    scopableExpressionType,
                );
                boundScopeMemberAccessExpression.type = boundScopeMemberAccessExpression.member.type;
                break;
            }
            default: {
                throw new Error(`'${scopableExpressionType.kind}' does not have any members.`);
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
        if (!boundIndexExpression.indexExpressionExpression.type.isConvertibleTo(this.project.intTypeDeclaration.type)) {
            throw new Error(`Index expression is '${boundIndexExpression.indexExpressionExpression.type}' but must be '${this.project.intTypeDeclaration.type}'.`);
        }

        boundIndexExpression.indexExpressionExpression = this.bindExpression(indexExpression.indexExpressionExpression, boundIndexExpression);
        boundIndexExpression.type = this.getTypeOfIndexExpression(boundIndexExpression.indexableExpression);

        return boundIndexExpression;
    }

    private getTypeOfIndexExpression(indexableExpression: BoundExpressions) {
        switch (indexableExpression.type.kind) {
            case TypeKind.String: {
                return this.project.intTypeDeclaration.type;
            }
            case TypeKind.Array: {
                return indexableExpression.type.elementType.type;
            }
            default: {
                throw new Error(`Expressions of type '${indexableExpression.type}' cannot be accessed by index.`);
            }
        }

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
            if (!boundSliceExpression.startExpression.type.isConvertibleTo(this.project.intTypeDeclaration.type)) {
                throw new Error(`Start index expression is '${boundSliceExpression.startExpression.type}' but must be '${this.project.intTypeDeclaration.type}'.`)
            }
        }

        if (sliceExpression.endExpression) {
            boundSliceExpression.endExpression = this.bindExpression(sliceExpression.endExpression, boundSliceExpression);
            if (!boundSliceExpression.endExpression.type.isConvertibleTo(this.project.intTypeDeclaration.type)) {
                throw new Error(`End index expression is '${boundSliceExpression.endExpression.type}' but must be '${this.project.intTypeDeclaration.type}'.`)
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
            case TypeKind.FunctionGroup:
            case TypeKind.MethodGroup: {
                const overload = this.chooseOverload(
                    type.declaration.overloads,
                    boundInvokeExpression.arguments,
                );
                boundInvokeExpression.invocationType = overload.type;
                boundInvokeExpression.type = overload.returnType.type;
                break;
            }
            // Cast expression
            case TypeKind.Object: {
                // TODO: Validate arguments
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
        overloads: Set<BoundFunctionLikeDeclaration>,
        args: BoundExpressions[],
    ): BoundFunctionLikeDeclaration {
        // Search for an exact match (cannot use default parameters)
        for (const overload of overloads) {
            if (args.length === overload.parameters.length) {
                let match = true;

                for (let i = 0; i < args.length; i++) {
                    const argument = args[i].type;
                    const parameter = overload.parameters[i].type;
                    if (argument !== parameter) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    return overload;
                }
            }
        }

        let candidate: BoundFunctionLikeDeclaration | undefined = undefined;

        // Search for exactly one match with implicit conversions allowed
        for (const overload of overloads) {
            // TODO: Support default parameters
            if (args.length === overload.parameters.length) {
                let match = true;

                for (let i = 0; i < args.length; i++) {
                    const argument = args[i].type;
                    const parameter = overload.parameters[i].type;
                    if (!argument.isConvertibleTo(parameter)) {
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

    // #region Symbols

    private declareSymbolInScope(
        name: string,
        boundDeclaration: BoundIdentifiableDeclaration,
    ): BoundSymbol {
        const scope = this.getScope(boundDeclaration);
        if (!scope) {
            throw new Error(`Could not find a scope for '${name}'.`);
        }

        return this.setSymbolInScope(name, scope, boundDeclaration);
    }

    private setSymbolInScope(
        name: string,
        scope: Scope,
        boundDeclaration: BoundIdentifiableDeclaration,
    ): BoundSymbol {
        let identifier = scope.locals.get(name);
        if (identifier) {
            throw new Error(`Duplicate symbol '${name}'.`);
        }

        identifier = new BoundSymbol(name, boundDeclaration);
        scope.locals.set(name, identifier);

        return identifier;
    }

    private getIdentifierText(identifier: MissableIdentifier | NewKeywordToken, document: string = this.document) {
        switch (identifier.kind) {
            case NodeKind.EscapedIdentifier: {
                return identifier.name.getText(document);
            }
            case TokenKind.Identifier:
            case TokenKind.ObjectKeyword:
            case TokenKind.ThrowableKeyword:
            case TokenKind.NewKeyword: {
                return identifier.getText(document);
            }
            case TokenKind.Missing: {
                throw new Error(`Missing identifier.`);
            }
            default: {
                return assertNever(identifier);
            }
        }
    }

    private resolveIdentifier(
        name: string,
        node: BoundNodes,
    ): BoundIdentifiableDeclaration | undefined {
        let scope = this.getScope(node);
        while (scope) {
            let identifierSymbol = scope.locals.get(name);
            if (identifierSymbol) {
                return identifierSymbol.declaration;
            }

            switch (scope.kind) {
                case BoundNodeKind.ModuleDeclaration:
                case BoundNodeKind.ExternClassDeclaration:
                case BoundNodeKind.InterfaceDeclaration:
                case BoundNodeKind.ClassDeclaration: {
                    // TODO: Overloads of methods on super types?
                    let functionLikeGroup: BoundFunctionLikeGroupDeclaration | undefined = undefined;

                    for (const member of scope.declaration.members) {
                        switch (member.kind) {
                            case NodeKind.ExternDataDeclarationSequence: {
                                for (const dataDeclaration of member.children) {
                                    switch (dataDeclaration.kind) {
                                        case NodeKind.ExternDataDeclaration: {
                                            const identifierText = this.getIdentifierText(dataDeclaration.identifier);
                                            if (areIdentifiersSame(name, identifierText)) {
                                                return this.bindExternDataDeclaration(dataDeclaration, scope, member.dataDeclarationKeyword);
                                            }
                                            break;
                                        }
                                        case NodeKind.CommaSeparator: { break; }
                                        default: {
                                            assertNever(dataDeclaration);
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                            case NodeKind.DataDeclarationSequence: {
                                for (const dataDeclaration of member.children) {
                                    switch (dataDeclaration.kind) {
                                        case NodeKind.DataDeclaration: {
                                            const identifierText = this.getIdentifierText(dataDeclaration.identifier);
                                            if (areIdentifiersSame(name, identifierText)) {
                                                return this.bindDataDeclaration(dataDeclaration, scope, member.dataDeclarationKeyword);
                                            }
                                            break;
                                        }
                                        case NodeKind.CommaSeparator: { break; }
                                        default: {
                                            assertNever(dataDeclaration);
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                            case NodeKind.AccessibilityDirective:
                            case TokenKind.Newline:
                            case TokenKind.Skipped: {
                                break;
                            }
                            default: {
                                const identifierText = this.getIdentifierText(member.identifier);
                                if (areIdentifiersSame(name, identifierText)) {
                                    switch (member.kind) {
                                        case NodeKind.ExternFunctionDeclaration: {
                                            const _scope = scope as BoundModuleDeclaration | BoundExternClassDeclaration;
                                            functionLikeGroup = this.bindExternFunctionDeclaration(member, _scope);
                                            _scope.members.set(functionLikeGroup.identifier.name, functionLikeGroup);
                                            break;
                                        }
                                        case NodeKind.ExternClassDeclaration: {
                                            return this.bindExternClassDeclaration(member, scope);
                                        }
                                        case NodeKind.ExternClassMethodDeclaration: {
                                            const _scope = scope as BoundExternClassDeclaration;
                                            functionLikeGroup = this.bindExternClassMethodGroup(identifierText, _scope.declaration.members, _scope);
                                            _scope.members.set(functionLikeGroup.identifier.name, functionLikeGroup);
                                            break;
                                        }
                                        case NodeKind.FunctionDeclaration: {
                                            const _scope = scope as BoundModuleDeclaration | BoundClassDeclaration;
                                            functionLikeGroup = this.bindFunctionDeclaration(member, _scope);
                                            _scope.members.set(functionLikeGroup.identifier.name, functionLikeGroup);
                                            break;
                                        }
                                        case NodeKind.InterfaceDeclaration: {
                                            return this.bindInterfaceDeclaration(member, scope);
                                        }
                                        case NodeKind.InterfaceMethodDeclaration: {
                                            const _scope = scope as BoundInterfaceDeclaration;
                                            functionLikeGroup = this.bindInterfaceMethodDeclaration(member, _scope);
                                            _scope.members.set(functionLikeGroup.identifier.name, functionLikeGroup);
                                            break;
                                        }
                                        case NodeKind.ClassDeclaration: {
                                            return this.bindClassDeclaration(member, scope);
                                        }
                                        case NodeKind.ClassMethodDeclaration: {
                                            const _scope = scope as BoundClassDeclaration;
                                            const functionLikeGroup = this.bindClassMethodGroup(identifierText, _scope.declaration.members, _scope);
                                            _scope.members.set(functionLikeGroup.identifier.name, functionLikeGroup);

                                            return functionLikeGroup;
                                        }
                                        default: {
                                            assertNever(member);
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }

                    if (functionLikeGroup) {
                        return functionLikeGroup;
                    }
                    break;
                }
            }

            switch (scope.kind) {
                case BoundNodeKind.ClassDeclaration: {
                    const { superType } = scope;
                    if (superType) {
                        identifierSymbol = superType.locals.get(name);
                        if (identifierSymbol) {
                            return identifierSymbol.declaration;
                        }
                    }
                    break;
                }
            }

            scope = this.getScope(scope);
        }
    }

    private getScope(node: BoundNodes): Scope | undefined {
        let ancestor = node.parent;

        while (true) {
            if (!ancestor) {
                return undefined;
            }

            switch (ancestor.kind) {
                case BoundNodeKind.ModuleDeclaration:
                case BoundNodeKind.ExternFunctionDeclaration:
                case BoundNodeKind.ExternClassDeclaration:
                case BoundNodeKind.ExternClassMethodDeclaration:
                case BoundNodeKind.FunctionDeclaration:
                case BoundNodeKind.InterfaceDeclaration:
                case BoundNodeKind.InterfaceMethodDeclaration:
                case BoundNodeKind.ClassDeclaration:
                case BoundNodeKind.ClassMethodDeclaration:
                case BoundNodeKind.IfStatement:
                case BoundNodeKind.ElseIfClause:
                case BoundNodeKind.ElseClause:
                case BoundNodeKind.CaseClause:
                case BoundNodeKind.DefaultClause:
                case BoundNodeKind.WhileLoop:
                case BoundNodeKind.RepeatLoop:
                case BoundNodeKind.ForLoop:
                case BoundNodeKind.TryStatement:
                case BoundNodeKind.CatchClause: {
                    return ancestor;
                }
            }

            ancestor = ancestor.parent;
        }
    }

    // #endregion

    // #region Generics

    private instantiateType(openType: BoundTypeReferenceDeclaration, typeMap: TypeMap) {
        switch (openType.kind) {
            case BoundNodeKind.IntrinsicType:
            case BoundNodeKind.InterfaceDeclaration: {
                return openType;
            }
            case BoundNodeKind.ExternClassDeclaration: {
                if (openType.type.kind === TypeKind.Array) {
                    const instantiatedElementType = this.instantiateType(openType.type.elementType, typeMap) as BoundTypeReferenceDeclaration;

                    return this.instantiateArrayType(instantiatedElementType);
                }

                return openType;
            }
            case BoundNodeKind.ClassDeclaration: {
                if (openType.kind === BoundNodeKind.ClassDeclaration &&
                    openType.typeParameters
                ) {
                    return this.instantiateGenericType(openType, typeMap);
                }

                return openType;
            }
            case BoundNodeKind.TypeParameter: {
                return typeMap.get(openType);
            }
            default: {
                return assertNever(openType);
            }
        }
    }

    private instantiateArrayType(elementType: BoundTypeReferenceDeclaration): BoundExternClassDeclaration {
        let instantiatedType = this.project.arrayTypeCache.get(elementType);
        if (instantiatedType) {
            return instantiatedType;
        }

        const openType = this.project.arrayTypeDeclaration;

        instantiatedType = new BoundExternClassDeclaration();
        this.project.arrayTypeCache.set(elementType, instantiatedType);
        instantiatedType.parent = openType.parent;
        instantiatedType.identifier = new BoundSymbol(openType.identifier.name, instantiatedType);
        instantiatedType.locals = new BoundSymbolTable();
        instantiatedType.type = new ArrayType(instantiatedType, elementType);
        instantiatedType.superType = openType.superType;
        instantiatedType.nativeSymbol = openType.nativeSymbol;

        const instantiatedMembers = new BoundTypeMembers<BoundExternClassDeclarationMember>();

        // // TODO: Clone members
        // for (const [name, member] of openType.members) {
        //     switch (member.kind) {
        //         case BoundNodeKind.ExternDataDeclaration: {

        //             break;
        //         }
        //         case BoundNodeKind.ExternFunctionGroupDeclaration: {

        //             break;
        //         }
        //         case BoundNodeKind.ExternClassMethodGroupDeclaration: {

        //             break;
        //         }
        //         default: {
        //             assertNever(member);
        //             break;
        //         }
        //     }
        // }

        instantiatedType.members = instantiatedMembers;

        return instantiatedType;
    }

    private createTypeMap(
        openType: BoundClassDeclaration,
        typeArguments: BoundTypeReferenceDeclaration[],
    ): TypeMap {
        const { typeParameters } = openType;
        if (!typeParameters) {
            throw new Error(`'${openType.identifier.name}' is not generic.`);
        }

        if (typeParameters.length !== typeArguments.length) {
            throw new Error(`Wrong number of type arguments (expected: ${typeParameters.length}, got: ${typeArguments.length}).`);
        }

        const typeMap = new TypeMap();

        for (let i = 0; i < typeParameters.length; i++) {
            typeMap.set(typeParameters[i], typeArguments[i]);
        }

        return typeMap;
    }

    private instantiateGenericType(
        openType: BoundClassDeclaration,
        typeMap: TypeMap,
    ): BoundClassDeclaration {
        // TODO: Where are instantiated types stored? Should the declaration be added to the bound tree?
        const instantiatedType = new BoundClassDeclaration();
        instantiatedType.declaration = openType.declaration;
        instantiatedType.parent = openType.parent;
        instantiatedType.locals = new BoundSymbolTable();
        instantiatedType.identifier = new BoundSymbol(openType.identifier.name, instantiatedType);
        instantiatedType.type = new ObjectType(instantiatedType);

        if (openType.superType) {
            instantiatedType.superType = this.instantiateType(
                openType.superType,
                typeMap,
            ) as BoundExternClassDeclaration | BoundClassDeclaration;
        }

        if (openType.implementedTypes) {
            instantiatedType.implementedTypes = [...openType.implementedTypes];
        }

        const instantiatedMembers = new BoundTypeMembers<BoundClassDeclarationMember>();

        for (const [name, member] of openType.members) {
            switch (member.kind) {
                case BoundNodeKind.DataDeclaration: {
                    const instantiatedDataDeclaration = this.instantiateDataDeclaration(member, instantiatedType, typeMap);
                    instantiatedMembers.set(name, instantiatedDataDeclaration);
                    break;
                }
                case BoundNodeKind.FunctionGroupDeclaration: {
                    // TODO: Instantiate function group
                    instantiatedMembers.set(name, member);
                    break;
                }
                case BoundNodeKind.ClassMethodGroupDeclaration: {
                    // TODO: Instantiate class method group
                    instantiatedMembers.set(name, member);
                    break;
                }
                default: {
                    assertNever(member);
                    break;
                }
            }
        }

        instantiatedType.members = instantiatedMembers;

        return instantiatedType;
    }

    private instantiateDataDeclaration(
        boundDataDeclaration: BoundDataDeclaration,
        parent: BoundClassDeclaration,
        typeMap: TypeMap,
    ) {
        const instantiatedDataDeclaration = new BoundDataDeclaration();
        instantiatedDataDeclaration.parent = parent;
        instantiatedDataDeclaration.declarationKind = boundDataDeclaration.declarationKind;
        instantiatedDataDeclaration.identifier = this.setSymbolInScope(boundDataDeclaration.identifier.name, parent, instantiatedDataDeclaration);

        if (boundDataDeclaration.typeAnnotation) {
            instantiatedDataDeclaration.typeAnnotation = this.instantiateType(
                boundDataDeclaration.typeAnnotation,
                typeMap,
            ) as BoundExternClassDeclaration | BoundClassDeclaration;

            instantiatedDataDeclaration.type = instantiatedDataDeclaration.typeAnnotation.type;
        }

        if (boundDataDeclaration.expression) {
            instantiatedDataDeclaration.expression = this.instantiateExpression(boundDataDeclaration.expression, instantiatedDataDeclaration, typeMap);
            instantiatedDataDeclaration.type = instantiatedDataDeclaration.expression.type;
        }

        instantiatedDataDeclaration.type = boundDataDeclaration.type;

        return instantiatedDataDeclaration;
    }

    private instantiateExpression(
        expression: BoundExpressions,
        parent: BoundNodes,
        typeMap: TypeMap,
    ) {
        switch (expression.kind) {
            case BoundNodeKind.BinaryExpression: {
                const instExpr = new BoundBinaryExpression();
                instExpr.parent = parent;
                instExpr.leftOperand = this.instantiateExpression(expression.leftOperand, instExpr, typeMap);
                instExpr.rightOperand = this.instantiateExpression(expression.rightOperand, instExpr, typeMap);
                instExpr.type = this.getTypeOfBinaryExpression(
                    instExpr.leftOperand,
                    instExpr.operator,
                    instExpr.rightOperand,
                );

                return instExpr;
            }
            case BoundNodeKind.UnaryExpression: {
                const instExpr = new BoundUnaryExpression();
                instExpr.parent = parent;
                instExpr.operand = this.instantiateExpression(expression.operand, instExpr, typeMap);
                instExpr.type = this.getTypeOfUnaryExpression(
                    instExpr.operator,
                    instExpr.operand,
                );

                return instExpr;
            }
            case BoundNodeKind.NewExpression: {
                const instExpr = new BoundNewExpression();
                instExpr.parent = parent;
                instExpr.typeReference = this.instantiateType(expression.typeReference, typeMap) as BoundExternClassDeclaration | BoundClassDeclaration;

                const constructorGroup = this.bindConstructorGroup(instExpr.typeReference);
                instExpr.type = constructorGroup.type;

                return instExpr;
            }
            case BoundNodeKind.NullExpression: {
                const instExpr = new BoundNullExpression();
                instExpr.parent = parent;
                instExpr.type = expression.type;

                return instExpr;
            }
            case BoundNodeKind.BooleanLiteralExpression: {
                const instExpr = new BoundBooleanLiteralExpression();
                instExpr.parent = parent;
                instExpr.type = expression.type;

                return instExpr;
            }
            case BoundNodeKind.SelfExpression: {
                const instExpr = new BoundSelfExpression();
                instExpr.parent = parent;

                const selfTypeDeclaration = this.instantiateType(
                    expression.type.declaration as BoundClassDeclaration,
                    typeMap,
                ) as BoundClassDeclaration;
                instExpr.type = selfTypeDeclaration.type;

                return instExpr;
            }
            case BoundNodeKind.SuperExpression: {
                const instExpr = new BoundSuperExpression();
                instExpr.parent = parent;

                const superTypeDeclaration = this.instantiateType(
                    expression.type.declaration as BoundExternClassDeclaration | BoundClassDeclaration,
                    typeMap,
                ) as BoundExternClassDeclaration | BoundClassDeclaration;
                instExpr.type = superTypeDeclaration.type;

                return instExpr;
            }
            case BoundNodeKind.StringLiteralExpression: {
                const instExpr = new BoundStringLiteralExpression();
                instExpr.parent = parent;
                instExpr.type = expression.type;

                return instExpr;
            }
            case BoundNodeKind.FloatLiteralExpression: {
                const instExpr = new BoundFloatLiteralExpression();
                instExpr.parent = parent;
                instExpr.type = expression.type;

                return instExpr;
            }
            case BoundNodeKind.IntegerLiteralExpression: {
                const instExpr = new BoundIntegerLiteralExpression();
                instExpr.parent = parent;
                instExpr.type = expression.type;

                return instExpr;
            }
            case BoundNodeKind.ArrayLiteralExpression: {
                const instExpr = new BoundArrayLiteralExpression();
                instExpr.parent = parent;
                instExpr.expressions = expression.expressions.map(e => this.instantiateExpression(e, instExpr, typeMap));
                instExpr.type = this.getTypeOfArrayLiteralExpression(instExpr.expressions);

                return instExpr;
            }
            case BoundNodeKind.GlobalScopeExpression: {
                const instExpr = new BoundGlobalScopeExpression();
                instExpr.parent = parent;
                instExpr.type = expression.type;

                return instExpr;
            }
            case BoundNodeKind.IdentifierExpression: {
                const instExpr = new BoundIdentifierExpression();
                instExpr.parent = parent;

                return instExpr;
            }
            case BoundNodeKind.GroupingExpression: {
                const instExpr = new BoundGroupingExpression();
                instExpr.parent = parent;
                instExpr.expression = this.instantiateExpression(expression.expression, instExpr, typeMap);
                instExpr.type = instExpr.expression.type;

                return instExpr;
            }
            case BoundNodeKind.ScopeMemberAccessExpression: {
                const instExpr = new BoundScopeMemberAccessExpression();
                instExpr.parent = parent;
                // TODO: Probably more to this
                instExpr.scopableExpression = this.instantiateExpression(expression.scopableExpression, instExpr, typeMap);
                instExpr.member = this.instantiateExpression(expression.member, instExpr, typeMap);
                instExpr.type = instExpr.member.type;

                return instExpr;
            }
            case BoundNodeKind.IndexExpression: {
                const instExpr = new BoundIndexExpression();
                instExpr.parent = parent;
                instExpr.indexableExpression = this.instantiateExpression(expression.indexableExpression, instExpr, typeMap);
                instExpr.indexExpressionExpression = this.instantiateExpression(expression.indexExpressionExpression, instExpr, typeMap);
                instExpr.type = this.getTypeOfIndexExpression(instExpr.indexableExpression);

                return instExpr;
            }
            case BoundNodeKind.SliceExpression: {
                const instExpr = new BoundSliceExpression();
                instExpr.parent = parent;

                return instExpr;
            }
            case BoundNodeKind.InvokeExpression: {
                const instExpr = new BoundInvokeExpression();
                instExpr.parent = parent;

                return instExpr;
            }
            default: {
                return assertNever(expression);
            }
        }
    }

    // #endregion

    private bindTypeAnnotation(typeAnnotation: TypeAnnotation | undefined) {
        if (!typeAnnotation) {
            return this.project.intTypeDeclaration;
        }

        switch (typeAnnotation.kind) {
            case NodeKind.ShorthandTypeAnnotation: {
                const { arrayTypeAnnotations, shorthandType } = typeAnnotation;

                let type: BoundDeclarations;

                if (!shorthandType) {
                    type = this.project.intTypeDeclaration;
                } else {
                    type = this.bindShorthandType(shorthandType);
                }

                for (const { } of arrayTypeAnnotations) {
                    type = this.instantiateArrayType(type);
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
                return this.project.boolTypeDeclaration;
            }
            case TokenKind.PercentSign: {
                return this.project.intTypeDeclaration;
            }
            case TokenKind.NumberSign: {
                return this.project.floatTypeDeclaration;
            }
            case TokenKind.DollarSign: {
                return this.project.stringTypeDeclaration;
            }
            default: {
                return assertNever(shorthandType);
            }
        }
    }

    private getBalancedType(leftOperandType: Types, rightOperandType: Types) {
        if (leftOperandType === this.project.stringTypeDeclaration.type ||
            rightOperandType === this.project.stringTypeDeclaration.type
        ) {
            return this.project.stringTypeDeclaration.type;
        }

        if (leftOperandType === this.project.floatTypeDeclaration.type ||
            rightOperandType === this.project.floatTypeDeclaration.type
        ) {
            return this.project.floatTypeDeclaration.type;
        }

        if (leftOperandType === this.project.intTypeDeclaration.type ||
            rightOperandType === this.project.intTypeDeclaration.type
        ) {
            return this.project.intTypeDeclaration.type;
        }

        if (leftOperandType.isConvertibleTo(rightOperandType)) {
            return rightOperandType;
        }

        if (rightOperandType.isConvertibleTo(leftOperandType)) {
            return leftOperandType;
        }
    }

    private getCollectionElementType(collection: Types) {
        switch (collection.kind) {
            case TypeKind.Array: {
                return collection.elementType.type;
            }
            case TypeKind.String: {
                return this.project.intTypeDeclaration.type;
            }
            case TypeKind.Object: {
                const objectEnumeratorMethod = this.getMethod(
                    collection.declaration,
                    /*name*/ 'ObjectEnumerator',
                    (returnType) => returnType.isConvertibleTo(this.project.objectTypeDeclaration.type),
                );
                if (!objectEnumeratorMethod) {
                    throw new Error(`'${collection}' does not have a 'ObjectEnumerator: TObjectEnumerator()' method.`);
                }

                const enumeratorType = objectEnumeratorMethod.returnType as MethodContainerDeclaration;

                const hasNextMethod = this.getMethod(
                    enumeratorType,
                    /*name*/ 'HasNext',
                    (returnType) => returnType === this.project.boolTypeDeclaration.type,
                );
                if (!hasNextMethod) {
                    throw new Error(`'${enumeratorType}' does not have a 'HasNext: Bool()' method.`);
                }

                const nextObjectMethod = this.getMethod(
                    enumeratorType,
                    /*name*/ 'NextObject',
                );
                if (!nextObjectMethod) {
                    throw new Error(`'${enumeratorType}' does not have a 'NextObject: T()' method.`);
                }

                return nextObjectMethod.returnType.type;
            }
            default: {
                throw new Error(`'${collection.kind}' is not a valid collection type.`);
            }
        }
    }

    private getNearestAncestor(node: BoundNodes, kind: BoundNodeKind, ...kinds: BoundNodeKind[]): BoundNodes | undefined {
        let ancestor = node.parent;

        while (ancestor) {
            if (ancestor.kind === kind ||
                kinds.includes(ancestor.kind)
            ) {
                return ancestor;
            }

            ancestor = ancestor.parent;
        }
    }

    private getMethod(
        typeDeclaration: MethodContainerDeclaration,
        name: string,
        checkReturnType: (type: Types) => boolean = (returnType) => true,
        ...parameters: Types[]
    ) {
        let member = typeDeclaration.members.get(name);
        if (member) {
            switch (member.kind) {
                case BoundNodeKind.ExternClassMethodGroupDeclaration:
                case BoundNodeKind.InterfaceMethodGroupDeclaration:
                case BoundNodeKind.ClassMethodGroupDeclaration: {
                    return this.getOverload(member.overloads, checkReturnType, ...parameters);
                }
            }
        }
    }

    private getOverload(
        members: MethodLikeGroupDeclaration['overloads'],
        checkReturnType: (type: Types) => boolean = (returnType) => true,
        ...parameters: Types[]
    ) {
        for (const member of members) {
            if (checkReturnType(member.returnType.type)) {
                if (member.parameters.length === parameters.length) {
                    for (let i = 0; i < member.parameters.length; i++) {
                        if (member.parameters[i].type !== parameters[i]) {
                            return undefined;
                        }
                    }

                    return member;
                }
            }
        }
    }

    // #endregion
}

class TypeMap extends Map<BoundTypeParameter, BoundTypeReferenceDeclaration> {
    get(key: BoundTypeReferenceDeclaration): BoundTypeReferenceDeclaration {
        if (key.kind === BoundNodeKind.TypeParameter) {
            const value = super.get(key);
            if (!value) {
                throw new Error();
            }

            return value;
        }

        return key;
    }
}

type Scope =
    | BoundModuleDeclaration
    | BoundExternFunctionDeclaration
    | BoundExternClassDeclaration
    | BoundExternClassMethodDeclaration
    | BoundFunctionDeclaration
    | BoundInterfaceDeclaration
    | BoundInterfaceMethodDeclaration
    | BoundClassDeclaration
    | BoundClassMethodDeclaration
    | BoundIfStatement
    | BoundElseIfClause
    | BoundElseClause
    | BoundCaseClause
    | BoundDefaultClause
    | BoundWhileLoop
    | BoundRepeatLoop
    | BoundForLoop
    | BoundTryStatement
    | BoundCatchClause
    ;

type MemberContainerType =
    | ModuleType
    | StringType
    | ArrayType
    | ObjectType
    ;

type MethodContainerDeclaration =
    | BoundExternClassDeclaration
    | BoundInterfaceDeclaration
    | BoundClassDeclaration
    ;

type MethodLikeGroupDeclaration =
    | BoundExternClassMethodGroupDeclaration
    | BoundInterfaceMethodGroupDeclaration
    | BoundClassMethodGroupDeclaration
    ;

type TypeDeclarationNodeKind =
    | NodeKind.ExternClassDeclaration
    | NodeKind.InterfaceDeclaration
    | NodeKind.ClassDeclaration
    | NodeKind.TypeParameter
    ;

function assertTypeDeclarationKind(
    kind: TypeDeclarationNodeKind,
    kinds: TypeDeclarationNodeKind[],
    identifierText: string,
) {
    if (kinds.length &&
        !kinds.includes(kind)
    ) {
        throw new Error(`Expected '${identifierText}' to be '${kinds.join(', ')}' but got '${kind}'.`);
    }
}
