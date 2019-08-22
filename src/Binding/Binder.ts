import { traceBinding, traceInstantiating } from '../Diagnostics';
import { Evaluator } from '../Evaluator';
import { Project } from '../Project';
import { CommaSeparator } from '../Syntax/Node/CommaSeparator';
import { AliasDirective, AliasDirectiveSequence } from '../Syntax/Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration, ClassDeclarationMember, ClassMethodDeclaration } from '../Syntax/Node/Declaration/ClassDeclaration';
import { DataDeclaration, DataDeclarationKeywordToken, DataDeclarationSequence } from '../Syntax/Node/Declaration/DataDeclarationSequence';
import { ExternClassDeclaration, ExternClassDeclarationMember, ExternClassMethodDeclaration } from '../Syntax/Node/Declaration/ExternClassDeclaration';
import { ExternDataDeclaration, ExternDataDeclarationKeywordToken, ExternDataDeclarationSequence } from '../Syntax/Node/Declaration/ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from '../Syntax/Node/Declaration/ExternFunctionDeclaration';
import { FunctionDeclaration } from '../Syntax/Node/Declaration/FunctionDeclaration';
import { ImportStatement } from '../Syntax/Node/Declaration/ImportStatement';
import { InterfaceDeclaration, InterfaceDeclarationMember, InterfaceMethodDeclaration } from '../Syntax/Node/Declaration/InterfaceDeclaration';
import { ModuleDeclaration, ModuleDeclarationMember } from '../Syntax/Node/Declaration/ModuleDeclaration';
import { TypeParameter } from '../Syntax/Node/Declaration/TypeParameter';
import { ArrayLiteralExpression } from '../Syntax/Node/Expression/ArrayLiteralExpression';
import { BinaryExpression, BinaryExpressionOperatorToken } from '../Syntax/Node/Expression/BinaryExpression';
import { BooleanLiteralExpression } from '../Syntax/Node/Expression/BooleanLiteralExpression';
import { Expressions } from '../Syntax/Node/Expression/Expressions';
import { FloatLiteralExpression } from '../Syntax/Node/Expression/FloatLiteralExpression';
import { GroupingExpression } from '../Syntax/Node/Expression/GroupingExpression';
import { IdentifierExpression, IdentifierExpressionIdentifier } from '../Syntax/Node/Expression/IdentifierExpression';
import { IndexExpression } from '../Syntax/Node/Expression/IndexExpression';
import { IntegerLiteralExpression } from '../Syntax/Node/Expression/IntegerLiteralExpression';
import { InvokeExpression } from '../Syntax/Node/Expression/InvokeExpression';
import { NewExpression } from '../Syntax/Node/Expression/NewExpression';
import { ScopeMemberAccessExpression } from '../Syntax/Node/Expression/ScopeMemberAccessExpression';
import { SliceExpression } from '../Syntax/Node/Expression/SliceExpression';
import { StringLiteralExpression } from '../Syntax/Node/Expression/StringLiteralExpression';
import { UnaryExpression, UnaryOperatorToken } from '../Syntax/Node/Expression/UnaryExpression';
import { IdentifierTokens } from '../Syntax/Node/Identifier';
import { ModulePath } from '../Syntax/Node/ModulePath';
import { NodeKind } from '../Syntax/Node/Nodes';
import { AssignmentOperatorToken, AssignmentStatement } from '../Syntax/Node/Statement/AssignmentStatement';
import { DataDeclarationSequenceStatement } from '../Syntax/Node/Statement/DataDeclarationSequenceStatement';
import { ExpressionStatement } from '../Syntax/Node/Statement/ExpressionStatement';
import { ForEachInLoop, NumericForLoop } from '../Syntax/Node/Statement/ForLoops';
import { ElseClause, ElseIfClause, IfStatement } from '../Syntax/Node/Statement/IfStatement';
import { RepeatLoop } from '../Syntax/Node/Statement/RepeatLoop';
import { ReturnStatement } from '../Syntax/Node/Statement/ReturnStatement';
import { CaseClause, DefaultClause, SelectStatement } from '../Syntax/Node/Statement/SelectStatement';
import { Statements } from '../Syntax/Node/Statement/Statements';
import { ThrowStatement } from '../Syntax/Node/Statement/ThrowStatement';
import { CatchClause, TryStatement } from '../Syntax/Node/Statement/TryStatement';
import { WhileLoop } from '../Syntax/Node/Statement/WhileLoop';
import { ShorthandTypeToken, TypeAnnotation } from '../Syntax/Node/TypeAnnotation';
import { TypeReference, TypeReferenceIdentifier } from '../Syntax/Node/TypeReference';
import { MissingToken } from '../Syntax/Token/MissingToken';
import { SkippedToken } from '../Syntax/Token/SkippedToken';
import { ColonEqualsSignToken, EqualsSignToken, IdentifierToken, TokenKind } from '../Syntax/Token/Tokens';
import { areElementsSame, assertNever, getText } from '../util';
import { ANONYMOUS_NAME, areIdentifiersSame, BoundSymbol, BoundSymbolTable } from './BoundSymbol';
import { BoundTreeWalker } from './BoundTreeWalker';
import { BoundModulePath } from './Node/BoundModulePath';
import { BoundNodeKind, BoundNodeKindToBoundNodeMap, BoundNodes } from './Node/BoundNodes';
import { BoundAliasDirective, BoundAliasDirectiveTarget } from './Node/Declaration/BoundAliasDirective';
import { BoundClassDeclaration, BoundClassMethodDeclaration } from './Node/Declaration/BoundClassDeclaration';
import { BoundDataDeclaration, BoundDataDeclarationKind, BoundDataDeclarationOperatorKind } from './Node/Declaration/BoundDataDeclaration';
import { BoundClassMethodLikeDeclaration, BoundDeclarations, BoundTypeReferenceDeclaration, isMethodContainer } from './Node/Declaration/BoundDeclarations';
import { BoundDirectory } from './Node/Declaration/BoundDirectory';
import { BoundExternClassDeclaration, BoundExternClassMethodDeclaration } from './Node/Declaration/BoundExternClassDeclaration';
import { BoundExternDataDeclaration, BoundExternDataDeclarationKind } from './Node/Declaration/BoundExternDataDeclaration';
import { BoundExternFunctionDeclaration } from './Node/Declaration/BoundExternFunctionDeclaration';
import { BoundFunctionDeclaration } from './Node/Declaration/BoundFunctionDeclaration';
import { BoundClassMethodGroupDeclaration, BoundExternClassMethodGroupDeclaration, BoundFunctionGroupDeclaration, BoundFunctionLikeGroupDeclaration, BoundInterfaceMethodGroupDeclaration, BoundMethodGroupDeclaration } from './Node/Declaration/BoundFunctionLikeGroupDeclaration';
import { BoundInterfaceDeclaration, BoundInterfaceMethodDeclaration } from './Node/Declaration/BoundInterfaceDeclaration';
import { BoundModuleDeclaration } from './Node/Declaration/BoundModuleDeclaration';
import { BoundTypeParameter } from './Node/Declaration/BoundTypeParameter';
import { BoundArrayLiteralExpression } from './Node/Expression/BoundArrayLiteralExpression';
import { BoundBinaryExpression, BoundBinaryExpressionOperator } from './Node/Expression/BoundBinaryExpression';
import { BoundBooleanLiteralExpression } from './Node/Expression/BoundBooleanLiteralExpression';
import { BoundCastExpression } from "./Node/Expression/BoundCastExpression";
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
import { BoundPlaceholderExpression } from './Node/Expression/BoundPlaceholderExpression';
import { BoundScopeMemberAccessExpression } from './Node/Expression/BoundScopeMemberAccessExpression';
import { BoundSelfExpression } from './Node/Expression/BoundSelfExpression';
import { BoundSliceExpression } from './Node/Expression/BoundSliceExpression';
import { BoundStringLiteralExpression } from './Node/Expression/BoundStringLiteralExpression';
import { BoundSuperExpression } from './Node/Expression/BoundSuperExpression';
import { BoundUnaryExpression, BoundUnaryExpressionOperator } from './Node/Expression/BoundUnaryExpression';
import { BoundAssignmentStatement, BoundAssignmentStatementOperator, UpdateAssignmentOperator } from './Node/Statement/BoundAssignmentStatement';
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
import { DeferredType } from './Type/DeferredType';
import { BoundFunctionLikeDeclaration, FunctionGroupType, FunctionType, isBoundFunctionLikeDeclaration, MethodGroupType, MethodType } from './Type/FunctionLikeType';
import { ModuleType } from './Type/ModuleType';
import { ObjectType } from './Type/ObjectType';
import { StringType } from './Type/StringType';
import { TypeParameterType } from './Type/TypeParameterType';
import { DefaultableType, TypeKind, Types } from './Type/Types';

export const CONSTRUCTOR_NAME = 'New';

export class Binder {
    // Debugging aid
    private filePath: string = undefined!;

    project: Project = undefined!;
    private bindTypeReferencesCallbackList?: (() => void)[] = undefined!;
    private bindDataDeclarationInitializerList?: (() => void)[] = undefined!;
    private bindStatementsCallbackList?: (() => void)[] = undefined!;

    bind(
        moduleDeclaration: ModuleDeclaration,
        project: Project,
        moduleDirectory: BoundDirectory,
        moduleName: string,
    ): BoundModuleDeclaration {
        this.filePath = moduleDeclaration.filePath.substr(0, moduleDeclaration.filePath.lastIndexOf('.'));

        this.project = project;

        return this.bindModuleDeclaration(moduleDirectory, moduleName, moduleDeclaration, project);
    }

    // #region Declarations

    // #region Module declaration

    @traceBinding(BoundNodeKind.ModuleDeclaration)
    private bindModuleDeclaration(
        directory: BoundDirectory,
        name: string,
        moduleDeclaration: ModuleDeclaration,
        project: Project,
    ): BoundModuleDeclaration {
        const boundModuleDeclaration = new BoundModuleDeclaration();
        boundModuleDeclaration.declaration = moduleDeclaration;
        boundModuleDeclaration.project = project;
        boundModuleDeclaration.directory = directory;
        boundModuleDeclaration.type = new ModuleType(boundModuleDeclaration);
        boundModuleDeclaration.identifier = new BoundSymbol(name, boundModuleDeclaration);
        directory.locals.set(boundModuleDeclaration.identifier);

        this.project.cacheModule(boundModuleDeclaration);

        const frameworkModuleAlias = this.importModule(boundModuleDeclaration, [], 'monkey');
        boundModuleDeclaration.frameworkModule = frameworkModuleAlias.target as BoundModuleDeclaration;

        this.bindTypeReferencesCallbackList = [];
        this.bindDataDeclarationInitializerList = [];
        this.bindStatementsCallbackList = [];

        // Phase 1: Bind member declarations
        // - Binds declarations only (ignores type references, statements, and expressions)
        // - Binds module, class, and interface members
        // - Binds function and method parameters
        this.bindModuleDeclarationMembers(boundModuleDeclaration, moduleDeclaration.members);

        // Phase 2: Bind type references on member declarations
        // - Includes super types, implemented types, alias targets, and native symbols (depends on `String`)
        // - Includes type annotations
        // - Makes overload resolution possible
        // - Depends on types being resolvable
        for (const bindTypeReferencesCallback of this.bindTypeReferencesCallbackList) {
            bindTypeReferencesCallback();
        }
        this.bindTypeReferencesCallbackList = undefined;

        // Phase 3: Evaluate initializers of data declarations
        // - Depends on expressions being bindable
        for (const bindDataDeclarationInitializer of this.bindDataDeclarationInitializerList) {
            bindDataDeclarationInitializer();
        }
        this.bindDataDeclarationInitializerList = undefined;

        // Phase 4: Bind statements
        for (const bindStatementsCallback of this.bindStatementsCallbackList) {
            bindStatementsCallback();
        }
        this.bindStatementsCallbackList = undefined;

        return boundModuleDeclaration;
    }

    private bindModuleDeclarationMembers(
        parent: BoundModuleDeclaration,
        members: ModuleDeclarationMember[],
    ): void {
        for (const member of members) {
            switch (member.kind) {
                case NodeKind.ImportStatement: {
                    this.bindImportStatement(parent, member);
                    break;
                }
                case NodeKind.AliasDirectiveSequence: {
                    this.bindAliasDirectiveSequence(parent, member);
                    break;
                }
                case NodeKind.FriendDirective:
                case NodeKind.AccessibilityDirective: {
                    // console.warn('Method not implemented.');
                    break;
                }
                case NodeKind.ExternDataDeclarationSequence: {
                    this.bindExternDataDeclarationSequence(parent, member);
                    break;
                }
                case NodeKind.ExternFunctionDeclaration: {
                    this.bindExternFunctionDeclaration(parent, member);
                    break;
                }
                case NodeKind.ExternClassDeclaration: {
                    this.bindExternClassDeclaration(parent, member);
                    break;
                }
                case NodeKind.DataDeclarationSequence: {
                    this.bindDataDeclarationSequence(parent, member);
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    this.bindFunctionDeclaration(parent, member);
                    break;
                }
                case NodeKind.InterfaceDeclaration: {
                    this.bindInterfaceDeclaration(parent, member);
                    break;
                }
                case NodeKind.ClassDeclaration: {
                    this.bindClassDeclaration(parent, member);
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

    // #endregion

    // #region Import statement

    private bindImportStatement(
        parent: BoundModuleDeclaration,
        importStatement: ImportStatement,
    ) {
        const { path } = importStatement;
        switch (path.kind) {
            case NodeKind.StringLiteralExpression: {
                // console.log(`Binding native imports is not implemented.`);
                break;
            }
            case NodeKind.ModulePath: {
                const { segments, name } = this.bindModulePath(parent, path);

                return this.importModule(parent, segments, name);
            }
            case TokenKind.Missing: { break; }
            default: {
                assertNever(path);
                break;
            }
        }
    }

    private importModule(
        parent: BoundModuleDeclaration,
        segments: string[],
        name: string,
    ): BoundAliasDirective {
        const importedModule = parent.project.importModuleFromSource(parent.directory, segments, name);
        parent.importedModules.add(importedModule);

        const boundAliasDirective = new BoundAliasDirective();
        boundAliasDirective.parent = parent;
        boundAliasDirective.identifier = new BoundSymbol(importedModule.identifier.name, boundAliasDirective);
        parent.locals.set(boundAliasDirective.identifier);
        boundAliasDirective.target = importedModule;
        boundAliasDirective.type = importedModule.type;

        return boundAliasDirective;
    }

    // #endregion

    // #region Module path

    private bindModulePath(
        parent: BoundModuleDeclaration,
        modulePath: ModulePath,
    ): BoundModulePath {
        const { moduleIdentifier } = modulePath;
        switch (moduleIdentifier.kind) {
            case TokenKind.Identifier: {
                const segments: string[] = [];

                for (const child of modulePath.children) {
                    switch (child.kind) {
                        case TokenKind.Identifier: {
                            // TODO: Can directories be referenced as identifiers in code?
                            //       If so, we may want to tie this in with how we resolve those.
                            const segment = getText(child, parent);
                            segments.push(segment);
                            break;
                        }
                        case TokenKind.Period: { break; }
                        default: {
                            assertNever(child);
                            break;
                        }
                    }
                }

                const name = getText(moduleIdentifier, parent);

                return { segments, name };
            }
            case TokenKind.Missing: {
                throw new Error('Method not implemented.');
            }
            default: {
                return assertNever(moduleIdentifier);
            }
        }
    }

    // #endregion

    // #region Alias directive sequence

    private bindAliasDirectiveSequence(
        parent: BoundModuleDeclaration,
        aliasDirectiveSequence: AliasDirectiveSequence,
    ): void {
        for (const child of aliasDirectiveSequence.children) {
            switch (child.kind) {
                case NodeKind.AliasDirective: {
                    this.bindAliasDirective(parent, child);
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

    private bindAliasDirective(
        parent: BoundModuleDeclaration,
        aliasDirective: AliasDirective,
    ): BoundAliasDirective {
        const boundAliasDirective = new BoundAliasDirective();
        boundAliasDirective.parent = parent;

        const aliasName = getText(aliasDirective.identifier, parent);
        boundAliasDirective.identifier = new BoundSymbol(aliasName, boundAliasDirective);
        parent.locals.set(boundAliasDirective.identifier);

        let target: BoundAliasDirectiveTarget = parent;

        for (const child of aliasDirective.children) {
            switch (child.kind) {
                case TokenKind.Identifier:
                case TokenKind.ObjectKeyword:
                case TokenKind.ThrowableKeyword:
                case NodeKind.EscapedIdentifier: {
                    if (!isBoundMemberContainerDeclaration(target)) {
                        throw new Error(`'${target.identifier.name}' has no members.`);
                    }

                    const scope: BoundMemberContainerDeclaration | undefined = target === parent ?
                        undefined :
                        target;

                    const member: BoundAliasDirectiveTarget | undefined = this.resolveIdentifier(child, parent, scope, /*getTypeArguments*/ undefined,
                        BoundNodeKind.ModuleDeclaration,
                        BoundNodeKind.ExternClassDeclaration,
                        BoundNodeKind.InterfaceDeclaration,
                        BoundNodeKind.ClassDeclaration,
                        BoundNodeKind.FunctionGroupDeclaration,
                        BoundNodeKind.ExternClassMethodGroupDeclaration,
                        BoundNodeKind.InterfaceMethodGroupDeclaration,
                        BoundNodeKind.ClassMethodGroupDeclaration,
                        BoundNodeKind.ExternDataDeclaration,
                        BoundNodeKind.DataDeclaration,
                    );
                    if (!member) {
                        const memberName = getText(child, parent);
                        throw new Error(`'${memberName}' does not exist in '${target.identifier.name}'.`);
                    }

                    target = member;
                    break;
                }
                case TokenKind.IntKeyword: {
                    target = parent.project.intTypeDeclaration;
                    break;
                }
                case TokenKind.FloatKeyword: {
                    target = parent.project.floatTypeDeclaration;
                    break;
                }
                case TokenKind.StringKeyword: {
                    target = parent.project.stringTypeDeclaration;
                    break;
                }
                case TokenKind.Period: { break; }
                default: {
                    assertNever(child);
                    break;
                }
            }
        }

        boundAliasDirective.target = target;
        boundAliasDirective.type = target.type;

        return boundAliasDirective;
    }

    // #endregion

    // #region Extern data declaration sequence

    private bindExternDataDeclarationSequence(
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
        externDataDeclarationSequence: ExternDataDeclarationSequence,
    ): BoundExternDataDeclaration[] {
        const boundExternDataDeclarations: BoundExternDataDeclaration[] = [];

        const declarationKind = this.getExternDataDeclarationKind(externDataDeclarationSequence.dataDeclarationKeyword);

        for (const externDataDeclaration of externDataDeclarationSequence.children) {
            switch (externDataDeclaration.kind) {
                case NodeKind.ExternDataDeclaration: {
                    const boundExternDataDeclaration = this.bindExternDataDeclaration(parent, externDataDeclaration, declarationKind);
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

    private getExternDataDeclarationKind(externDataDeclarationKeyword: ExternDataDeclarationKeywordToken) {
        switch (externDataDeclarationKeyword.kind) {
            case TokenKind.GlobalKeyword: { return BoundExternDataDeclarationKind.Global; }
            case TokenKind.FieldKeyword: { return BoundExternDataDeclarationKind.Field; }
            default: { return assertNever(externDataDeclarationKeyword); }
        }
    }

    @traceBinding(BoundNodeKind.ExternDataDeclaration)
    private bindExternDataDeclaration(
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
        externDataDeclaration: ExternDataDeclaration,
        declarationKind: BoundExternDataDeclarationKind,
    ): BoundExternDataDeclaration {
        const name = getText(externDataDeclaration.identifier, parent);

        const boundExternDataDeclaration = new BoundExternDataDeclaration();
        boundExternDataDeclaration.parent = parent;
        boundExternDataDeclaration.declarationKind = declarationKind;
        boundExternDataDeclaration.identifier = new BoundSymbol(name, boundExternDataDeclaration);
        parent.locals.set(boundExternDataDeclaration.identifier);

        const bindTypeReferencesOnExternDataDeclaration = () => {
            boundExternDataDeclaration.typeAnnotation = this.bindTypeAnnotation(boundExternDataDeclaration, externDataDeclaration.typeAnnotation);
            boundExternDataDeclaration.type = boundExternDataDeclaration.typeAnnotation.type;

            if (externDataDeclaration.nativeSymbol) {
                const { nativeSymbol } = externDataDeclaration;
                if (nativeSymbol.kind === TokenKind.Missing) {
                    throw new Error(`Native symbol is missing.`);
                }

                boundExternDataDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternDataDeclaration, nativeSymbol);
            }
        };
        deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnExternDataDeclaration);

        return boundExternDataDeclaration;
    }

    // #endregion

    // #region Extern function declaration

    @traceBinding(BoundNodeKind.ExternFunctionDeclaration)
    private bindExternFunctionDeclaration(
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
        externFunctionDeclaration: ExternFunctionDeclaration,
    ): BoundExternFunctionDeclaration {
        const name = getText(externFunctionDeclaration.identifier, parent);
        const boundFunctionGroupDeclaration = this.bindFunctionGroupDeclaration(parent, name);

        const boundExternFunctionDeclaration = new BoundExternFunctionDeclaration();
        boundExternFunctionDeclaration.declaration = externFunctionDeclaration;
        boundFunctionGroupDeclaration.overloads.set(boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.parent = boundFunctionGroupDeclaration;
        boundExternFunctionDeclaration.type = new FunctionType(boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.identifier = new BoundSymbol(name, boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.parameters = this.bindDataDeclarationSequence(boundExternFunctionDeclaration, externFunctionDeclaration.parameters);

        const bindTypeReferencesOnExternFunctionDeclaration = () => {
            boundExternFunctionDeclaration.returnType = this.bindTypeAnnotation(boundExternFunctionDeclaration, externFunctionDeclaration.returnType);

            if (externFunctionDeclaration.nativeSymbol) {
                const { nativeSymbol } = externFunctionDeclaration;
                if (nativeSymbol.kind === TokenKind.Missing) {
                    throw new Error(`Native symbol is missing.`);
                }

                boundExternFunctionDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternFunctionDeclaration, nativeSymbol);
            }
        };
        deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnExternFunctionDeclaration);

        return boundExternFunctionDeclaration;
    }

    // #endregion

    // #region Extern class declaration

    @traceBinding(BoundNodeKind.ExternClassDeclaration)
    private bindExternClassDeclaration(
        parent: BoundModuleDeclaration,
        externClassDeclaration: ExternClassDeclaration,
    ): BoundExternClassDeclaration {
        const name = getText(externClassDeclaration.identifier, parent);

        const boundExternClassDeclaration = new BoundExternClassDeclaration();
        boundExternClassDeclaration.declaration = externClassDeclaration;
        boundExternClassDeclaration.parent = parent;
        boundExternClassDeclaration.identifier = new BoundSymbol(name, boundExternClassDeclaration);
        parent.locals.set(boundExternClassDeclaration.identifier);

        switch (name) {
            case 'String': {
                this.project.stringTypeDeclaration = boundExternClassDeclaration;
                boundExternClassDeclaration.type = new StringType(boundExternClassDeclaration);
                break;
            }
            case 'Array': {
                this.project.arrayTypeDeclaration = boundExternClassDeclaration;

                const typeParameter = new BoundTypeParameter();
                typeParameter.parent = boundExternClassDeclaration;
                typeParameter.identifier = new BoundSymbol('T', typeParameter);
                typeParameter.type = new TypeParameterType(typeParameter);

                boundExternClassDeclaration.type = new ArrayType(boundExternClassDeclaration, typeParameter);
                break;
            }
            case 'Object': {
                this.project.objectTypeDeclaration = boundExternClassDeclaration;
                boundExternClassDeclaration.type = new ObjectType(boundExternClassDeclaration);
                break;
            }
            case 'Throwable': {
                this.project.throwableTypeDeclaration = boundExternClassDeclaration;
                boundExternClassDeclaration.type = new ObjectType(boundExternClassDeclaration);
                break;
            }
            default: {
                boundExternClassDeclaration.type = new ObjectType(boundExternClassDeclaration);
                break;
            }
        }

        this.bindExternClassDeclarationMembers(boundExternClassDeclaration, externClassDeclaration.members);

        const bindTypeReferencesOnExternClassDeclaration = () => {
            if (externClassDeclaration.superType) {
                if (externClassDeclaration.superType.kind !== TokenKind.NullKeyword) {
                    boundExternClassDeclaration.superType = this.bindTypeReference(boundExternClassDeclaration, externClassDeclaration.superType, /*typeMap*/ undefined,
                        BoundNodeKind.ExternClassDeclaration,
                        BoundNodeKind.ClassDeclaration,
                    );
                }
            } else {
                boundExternClassDeclaration.superType = parent.project.objectTypeDeclaration;
            }

            if (externClassDeclaration.nativeSymbol) {
                if (externClassDeclaration.nativeSymbol.kind === TokenKind.Missing) {
                    throw new Error(`Native symbol is missing.`);
                }

                boundExternClassDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternClassDeclaration, externClassDeclaration.nativeSymbol);
            }
        };
        deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnExternClassDeclaration);

        return boundExternClassDeclaration;
    }

    private bindExternClassDeclarationMembers(
        parent: BoundExternClassDeclaration,
        members: ExternClassDeclarationMember[],
    ): void {
        for (const member of members) {
            switch (member.kind) {
                case NodeKind.AccessibilityDirective: {
                    throw new Error('Method not implemented.');
                }
                case NodeKind.ExternDataDeclarationSequence: {
                    this.bindExternDataDeclarationSequence(parent, member);
                    break;
                }
                case NodeKind.ExternFunctionDeclaration: {
                    this.bindExternFunctionDeclaration(parent, member);
                    break;
                }
                case NodeKind.ExternClassMethodDeclaration: {
                    this.bindExternClassMethodDeclaration(parent, member);
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

        if (!this.hasParameterlessExternConstructor(parent)) {
            this.createParameterlessExternConstructor(parent);
        }
    }

    // #region Default constructor

    private hasParameterlessExternConstructor(boundExternClassDeclaration: BoundExternClassDeclaration): boolean {
        const constructorGroup = boundExternClassDeclaration.locals.get(CONSTRUCTOR_NAME, BoundNodeKind.ExternClassMethodGroupDeclaration);
        if (constructorGroup) {
            for (const [, overload] of constructorGroup.overloads) {
                if (overload.parameters.length === 0) {
                    return true;
                }
            }
        }

        return false;
    }

    private createParameterlessExternConstructor(parent: BoundExternClassDeclaration): BoundExternClassMethodGroupDeclaration {
        const boundExternClassMethodGroupDeclaration = this.bindExternClassMethodGroupDeclaration(parent, CONSTRUCTOR_NAME);

        const boundExternClassMethodDeclaration = new BoundExternClassMethodDeclaration();
        boundExternClassMethodGroupDeclaration.overloads.set(boundExternClassMethodDeclaration);
        boundExternClassMethodDeclaration.parent = boundExternClassMethodGroupDeclaration;
        boundExternClassMethodDeclaration.type = new MethodType(boundExternClassMethodDeclaration);
        boundExternClassMethodDeclaration.identifier = new BoundSymbol(CONSTRUCTOR_NAME, boundExternClassMethodDeclaration);
        boundExternClassMethodDeclaration.returnType = parent;
        boundExternClassMethodDeclaration.parameters = [];

        return boundExternClassMethodGroupDeclaration;
    }

    // #endregion

    // #region Extern class method declaration

    @traceBinding(BoundNodeKind.ExternClassMethodDeclaration)
    private bindExternClassMethodDeclaration(
        parent: BoundExternClassDeclaration,
        externClassMethodDeclaration: ExternClassMethodDeclaration,
    ): BoundExternClassMethodDeclaration {
        const name = getText(externClassMethodDeclaration.identifier, parent);
        const boundExternClassMethodGroupDeclaration = this.bindExternClassMethodGroupDeclaration(parent, name);

        const boundExternClassMethodDeclaration = new BoundExternClassMethodDeclaration();
        boundExternClassMethodDeclaration.declaration = externClassMethodDeclaration;
        boundExternClassMethodGroupDeclaration.overloads.set(boundExternClassMethodDeclaration);
        boundExternClassMethodDeclaration.parent = boundExternClassMethodGroupDeclaration;
        boundExternClassMethodDeclaration.type = new MethodType(boundExternClassMethodDeclaration);
        boundExternClassMethodDeclaration.identifier = new BoundSymbol(name, boundExternClassMethodDeclaration);
        boundExternClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(boundExternClassMethodDeclaration, externClassMethodDeclaration.parameters);
        boundExternClassMethodDeclaration.isProperty = this.isProperty(externClassMethodDeclaration);

        const bindTypeReferencesOnExternClassMethodDeclaration = () => {
            if (areIdentifiersSame(CONSTRUCTOR_NAME, boundExternClassMethodDeclaration.identifier.name)) {
                boundExternClassMethodDeclaration.returnType = parent;
            } else {
                boundExternClassMethodDeclaration.returnType = this.bindTypeAnnotation(boundExternClassMethodDeclaration, externClassMethodDeclaration.returnType);
            }

            if (externClassMethodDeclaration.nativeSymbol) {
                const { nativeSymbol } = externClassMethodDeclaration;
                if (nativeSymbol.kind === TokenKind.Missing) {
                    throw new Error(`Native symbol is missing.`);
                }

                boundExternClassMethodDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternClassMethodDeclaration, nativeSymbol);
            }
        };
        deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnExternClassMethodDeclaration);

        return boundExternClassMethodDeclaration;
    }

    private bindExternClassMethodGroupDeclaration(
        parent: BoundExternClassDeclaration,
        name: string,
    ): BoundExternClassMethodGroupDeclaration {
        let boundExternClassMethodGroupDeclaration = parent.locals.get(name, BoundNodeKind.ExternClassMethodGroupDeclaration);
        if (boundExternClassMethodGroupDeclaration) {
            return boundExternClassMethodGroupDeclaration;
        }

        boundExternClassMethodGroupDeclaration = new BoundExternClassMethodGroupDeclaration();
        boundExternClassMethodGroupDeclaration.parent = parent;
        boundExternClassMethodGroupDeclaration.identifier = new BoundSymbol(name, boundExternClassMethodGroupDeclaration);
        parent.locals.set(boundExternClassMethodGroupDeclaration.identifier);
        boundExternClassMethodGroupDeclaration.type = new MethodGroupType(boundExternClassMethodGroupDeclaration);

        return boundExternClassMethodGroupDeclaration;
    }

    // #endregion

    // #endregion

    // #region Data declaration sequence

    private bindDataDeclarationSequence(
        parent: BoundNodes,
        dataDeclarationSequence: DataDeclarationSequence,
        typeMap?: TypeMap,
    ): BoundDataDeclaration[] {
        const boundDataDeclarations: BoundDataDeclaration[] = [];

        const dataDeclarationKind = this.getDataDeclarationKind(dataDeclarationSequence.dataDeclarationKeyword);

        for (const dataDeclaration of dataDeclarationSequence.children) {
            switch (dataDeclaration.kind) {
                case NodeKind.DataDeclaration: {
                    const boundDataDeclaration = this.bindDataDeclaration(parent, dataDeclaration, dataDeclarationKind, typeMap);
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

    private getDataDeclarationKind(dataDeclarationKeyword: DataDeclarationKeywordToken | null) {
        if (!dataDeclarationKeyword) {
            return BoundDataDeclarationKind.Parameter;
        }

        switch (dataDeclarationKeyword.kind) {
            case TokenKind.ConstKeyword: {
                return BoundDataDeclarationKind.Const;
            }
            case TokenKind.GlobalKeyword: {
                return BoundDataDeclarationKind.Global;
            }
            case TokenKind.FieldKeyword: {
                return BoundDataDeclarationKind.Field;
            }
            case TokenKind.LocalKeyword: {
                return BoundDataDeclarationKind.Local;
            }
            default: {
                return assertNever(dataDeclarationKeyword);
            }
        }
    }

    // #region Data declaration

    private bindDataDeclaration(
        parent: BoundNodes,
        dataDeclaration: DataDeclaration,
        declarationKind: BoundDataDeclarationKind,
        typeMap?: TypeMap,
    ): BoundDataDeclaration {
        const name = getText(dataDeclaration.identifier, parent);

        let operator: BoundDataDeclarationOperatorKind | undefined = undefined;
        if (dataDeclaration.operator) {
            operator = dataDeclaration.operator.kind;
        }

        let getTypeAnnotation: GetBoundNode<BoundTypeReferenceDeclaration> | undefined = undefined;
        switch (operator) {
            case TokenKind.EqualsSign:
            case undefined: {
                getTypeAnnotation = (parent) => this.bindTypeAnnotation(parent, dataDeclaration.typeAnnotation, typeMap);
                break;
            }
        }

        let getExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (dataDeclaration.expression) {
            const { expression } = dataDeclaration;
            getExpression = (parent) => this.bindExpression(parent, expression, typeMap);
        }

        let boundDataDeclaration: BoundDataDeclaration;

        if (isBoundMemberContainerDeclaration(parent) ||
            (isBoundFunctionLikeDeclaration(parent) && declarationKind === BoundDataDeclarationKind.Parameter)
        ) {
            boundDataDeclaration = this.bindDataDeclarationPhase1(parent, declarationKind, name, operator);
            const bindTypeReferencesOnDataDeclaration = () => this.bindDataDeclarationTypeAnnotation(boundDataDeclaration, getTypeAnnotation!);
            const bindInitializerOnDataDeclaration = () => this.bindDataDeclarationInitializer(boundDataDeclaration, getExpression!);

            switch (operator) {
                case TokenKind.EqualsSign: {
                    deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnDataDeclaration);
                    deferOrExecute(this.bindDataDeclarationInitializerList, bindInitializerOnDataDeclaration);
                    break;
                }
                case TokenKind.ColonEqualsSign: {
                    deferOrExecute(this.bindDataDeclarationInitializerList, bindInitializerOnDataDeclaration);
                    break;
                }
                case undefined: {
                    deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnDataDeclaration);
                    break;
                }
                case TokenKind.Missing: {
                    throw new Error(`Missing operator for data declaration.`);
                }
                default: {
                    assertNever(operator);
                    break;
                }
            }
        } else {
            boundDataDeclaration = this.dataDeclaration(parent,
                declarationKind,
                name,
                operator,
                getTypeAnnotation,
                getExpression,
            );
        }

        return boundDataDeclaration;
    }

    @traceBinding(BoundNodeKind.DataDeclaration)
    private bindDataDeclarationPhase1(
        parent: BoundNodes,
        declarationKind: BoundDataDeclarationKind,
        name: string,
        operator: BoundDataDeclarationOperatorKind | undefined,
    ): BoundDataDeclaration {
        const boundDataDeclaration = new BoundDataDeclaration();
        boundDataDeclaration.parent = parent;
        boundDataDeclaration.declarationKind = declarationKind;

        boundDataDeclaration.identifier = new BoundSymbol(name, boundDataDeclaration);
        const scope = this.getScope(boundDataDeclaration);
        if (!scope) {
            throw new Error(`Could not find scope for '${boundDataDeclaration.identifier.name}'.`);
        }
        scope.locals.set(boundDataDeclaration.identifier);

        boundDataDeclaration.operator = operator;

        return boundDataDeclaration;
    }

    private bindDataDeclarationTypeAnnotation(
        boundDataDeclaration: BoundDataDeclaration,
        getTypeAnnotation: GetBoundNode<BoundTypeReferenceDeclaration>,
    ): void {
        switch (boundDataDeclaration.operator) {
            case TokenKind.EqualsSign: {
                boundDataDeclaration.typeAnnotation = getTypeAnnotation(boundDataDeclaration);
                boundDataDeclaration.type = boundDataDeclaration.typeAnnotation.type;
                break;
            }
            case undefined: {
                boundDataDeclaration.typeAnnotation = getTypeAnnotation(boundDataDeclaration);
                boundDataDeclaration.type = boundDataDeclaration.typeAnnotation.type;
                break;
            }
        }
    }

    private bindDataDeclarationInitializer(
        boundDataDeclaration: BoundDataDeclaration,
        getExpression: GetBoundNode<BoundExpressions>,
    ): void {
        switch (boundDataDeclaration.operator) {
            case TokenKind.EqualsSign: {
                boundDataDeclaration.expression = getExpression(boundDataDeclaration);

                if (!boundDataDeclaration.expression.type.isConvertibleTo(boundDataDeclaration.typeAnnotation!.type)) {
                    throw new Error(`'${boundDataDeclaration.expression.type}' is not convertible to '${boundDataDeclaration.typeAnnotation!.type}'.`);
                }
                break;
            }
            case TokenKind.ColonEqualsSign: {
                boundDataDeclaration.expression = getExpression(boundDataDeclaration);
                boundDataDeclaration.type = boundDataDeclaration.expression.type;
                break;
            }
        }
    }

    private dataDeclaration(
        parent: BoundNodes,
        declarationKind: BoundDataDeclarationKind,
        name: string,
        operator: BoundDataDeclarationOperatorKind | undefined,
        getTypeAnnotation: GetBoundNode<BoundTypeReferenceDeclaration> | undefined,
        getExpression: GetBoundNode<BoundExpressions> | undefined,
    ): BoundDataDeclaration {
        const boundDataDeclaration = this.bindDataDeclarationPhase1(parent, declarationKind, name, operator);
        this.bindDataDeclarationTypeAnnotation(boundDataDeclaration, getTypeAnnotation!);
        this.bindDataDeclarationInitializer(boundDataDeclaration, getExpression!);

        return boundDataDeclaration;
    }

    private localDeclaration(
        parent: BoundNodes,
        getExpression: GetBoundNode<BoundExpressions> | undefined,
        getTypeAnnotation?: GetBoundNode<BoundTypeReferenceDeclaration>,
        name: string = ANONYMOUS_NAME,
    ): BoundDataDeclaration {
        return this.dataDeclaration(parent,
            BoundDataDeclarationKind.Local,
            name,
            TokenKind.ColonEqualsSign,
            getTypeAnnotation,
            getExpression,
        );
    }

    // #endregion

    // #endregion

    // #region Function declaration

    @traceBinding(BoundNodeKind.FunctionDeclaration)
    private bindFunctionDeclaration(
        parent: BoundModuleDeclaration | BoundClassDeclaration,
        functionDeclaration: FunctionDeclaration,
        typeMap?: TypeMap,
    ): BoundFunctionDeclaration {
        const name = getText(functionDeclaration.identifier, parent);
        const boundFunctionGroupDeclaration = this.bindFunctionGroupDeclaration(parent, name);

        const boundFunctionDeclaration = new BoundFunctionDeclaration();
        boundFunctionDeclaration.declaration = functionDeclaration;
        boundFunctionGroupDeclaration.overloads.set(boundFunctionDeclaration);
        boundFunctionDeclaration.parent = boundFunctionGroupDeclaration;
        boundFunctionDeclaration.type = new FunctionType(boundFunctionDeclaration);
        boundFunctionDeclaration.identifier = new BoundSymbol(name, boundFunctionDeclaration);
        boundFunctionDeclaration.parameters = this.bindDataDeclarationSequence(boundFunctionDeclaration, functionDeclaration.parameters, typeMap);

        const bindTypeReferencesOnFunctionDeclaration = () => {
            boundFunctionDeclaration.returnType = this.bindTypeAnnotation(boundFunctionDeclaration, functionDeclaration.returnType, typeMap);
        };
        deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnFunctionDeclaration);

        const bindStatementsOnFunctionDeclaration = () => {
            boundFunctionDeclaration.statements = this.bindStatements(boundFunctionDeclaration, functionDeclaration.statements, typeMap);
        };
        deferOrExecute(this.bindStatementsCallbackList, bindStatementsOnFunctionDeclaration);

        return boundFunctionDeclaration;
    }

    private bindFunctionGroupDeclaration(
        parent: BoundModuleDeclaration | BoundExternClassDeclaration | BoundClassDeclaration,
        name: string,
    ): BoundFunctionGroupDeclaration {
        let boundFunctionGroupDeclaration = parent.locals.get(name, BoundNodeKind.FunctionGroupDeclaration);
        if (boundFunctionGroupDeclaration) {
            return boundFunctionGroupDeclaration;
        }

        boundFunctionGroupDeclaration = new BoundFunctionGroupDeclaration();
        boundFunctionGroupDeclaration.parent = parent;
        boundFunctionGroupDeclaration.type = new FunctionGroupType(boundFunctionGroupDeclaration);
        boundFunctionGroupDeclaration.identifier = new BoundSymbol(name, boundFunctionGroupDeclaration);
        parent.locals.set(boundFunctionGroupDeclaration.identifier);

        return boundFunctionGroupDeclaration;
    }

    // #endregion

    // #region Interface declaration

    @traceBinding(BoundNodeKind.InterfaceDeclaration)
    private bindInterfaceDeclaration(
        parent: BoundModuleDeclaration,
        interfaceDeclaration: InterfaceDeclaration,
    ): BoundInterfaceDeclaration {
        const name = getText(interfaceDeclaration.identifier, parent);

        const boundInterfaceDeclaration = new BoundInterfaceDeclaration();
        boundInterfaceDeclaration.declaration = interfaceDeclaration;
        boundInterfaceDeclaration.parent = parent;
        boundInterfaceDeclaration.type = new ObjectType(boundInterfaceDeclaration);
        boundInterfaceDeclaration.identifier = new BoundSymbol(name, boundInterfaceDeclaration);
        parent.locals.set(boundInterfaceDeclaration.identifier);

        this.bindInterfaceDeclarationMembers(boundInterfaceDeclaration, interfaceDeclaration.members);

        const bindTypeReferencesOnInterfaceDeclaration = () => {
            if (interfaceDeclaration.implementedTypes) {
                boundInterfaceDeclaration.implementedTypes = this.bindTypeReferenceSequence(
                    boundInterfaceDeclaration,
                    interfaceDeclaration.implementedTypes,
                    /*typeMap*/ undefined,
                    BoundNodeKind.InterfaceDeclaration,
                );
            }
        };
        deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnInterfaceDeclaration);

        return boundInterfaceDeclaration;
    }

    private bindInterfaceDeclarationMembers(
        parent: BoundInterfaceDeclaration,
        members: InterfaceDeclarationMember[],
    ): void {
        for (const member of members) {
            switch (member.kind) {
                case NodeKind.DataDeclarationSequence: {
                    this.bindDataDeclarationSequence(parent, member);
                    break;
                }
                case NodeKind.InterfaceMethodDeclaration: {
                    this.bindInterfaceMethodDeclaration(parent, member);
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

    // #region Interface method declaration

    @traceBinding(BoundNodeKind.InterfaceMethodDeclaration)
    private bindInterfaceMethodDeclaration(
        parent: BoundInterfaceDeclaration,
        interfaceMethodDeclaration: InterfaceMethodDeclaration,
    ): BoundInterfaceMethodDeclaration {
        const name = getText(interfaceMethodDeclaration.identifier, parent);
        const boundInterfaceMethodGroupDeclaration = this.bindInterfaceMethodGroupDeclaration(parent, name);

        const boundInterfaceMethodDeclaration = new BoundInterfaceMethodDeclaration();
        boundInterfaceMethodDeclaration.declaration = interfaceMethodDeclaration;
        boundInterfaceMethodGroupDeclaration.overloads.set(boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.parent = boundInterfaceMethodGroupDeclaration;
        boundInterfaceMethodDeclaration.type = new MethodType(boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.identifier = new BoundSymbol(name, boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.parameters = this.bindDataDeclarationSequence(boundInterfaceMethodDeclaration, interfaceMethodDeclaration.parameters);

        const bindTypeReferencesOnInterfaceMethodDeclaration = () => {
            boundInterfaceMethodDeclaration.returnType = this.bindTypeAnnotation(boundInterfaceMethodDeclaration, interfaceMethodDeclaration.returnType);
        };
        deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnInterfaceMethodDeclaration);

        return boundInterfaceMethodDeclaration;
    }

    private bindInterfaceMethodGroupDeclaration(parent: BoundInterfaceDeclaration, name: string) {
        let boundInterfaceMethodGroupDeclaration = parent.locals.get(name, BoundNodeKind.InterfaceMethodGroupDeclaration);
        if (boundInterfaceMethodGroupDeclaration) {
            return boundInterfaceMethodGroupDeclaration;
        }

        boundInterfaceMethodGroupDeclaration = new BoundInterfaceMethodGroupDeclaration();
        boundInterfaceMethodGroupDeclaration.parent = parent;
        boundInterfaceMethodGroupDeclaration.type = new MethodGroupType(boundInterfaceMethodGroupDeclaration);
        boundInterfaceMethodGroupDeclaration.identifier = new BoundSymbol(name, boundInterfaceMethodGroupDeclaration);
        parent.locals.set(boundInterfaceMethodGroupDeclaration.identifier);

        return boundInterfaceMethodGroupDeclaration;
    }

    // #endregion

    // #endregion

    // #region Class declaration

    @traceBinding(BoundNodeKind.ClassDeclaration)
    private bindClassDeclaration(
        parent: BoundModuleDeclaration,
        classDeclaration: ClassDeclaration,
        typeMap?: TypeMap,
    ): BoundClassDeclaration {
        const name = getText(classDeclaration.identifier, parent);

        const boundClassDeclaration = new BoundClassDeclaration();
        boundClassDeclaration.declaration = classDeclaration;
        boundClassDeclaration.parent = parent;
        boundClassDeclaration.type = new ObjectType(boundClassDeclaration);
        boundClassDeclaration.identifier = new BoundSymbol(name, boundClassDeclaration);
        parent.locals.set(boundClassDeclaration.identifier);

        if (!typeMap && classDeclaration.typeParameters) {
            boundClassDeclaration.instantiatedTypes = [];

            return boundClassDeclaration;
        }

        return this.bindClassDeclaration2(boundClassDeclaration, typeMap);
    }

    private bindClassDeclaration2(
        boundClassDeclaration: BoundClassDeclaration,
        typeMap: TypeMap | undefined,
    ) {
        const classDeclaration = boundClassDeclaration.declaration;

        const bindTypeReferencesOnClassDeclaration = () => {
            if (classDeclaration.superType) {
                boundClassDeclaration.superType = this.bindTypeReference(boundClassDeclaration, classDeclaration.superType, typeMap,
                    BoundNodeKind.ExternClassDeclaration,
                    BoundNodeKind.ClassDeclaration,
                );
            } else {
                boundClassDeclaration.superType = this.project.objectTypeDeclaration;
            }

            if (classDeclaration.implementedTypes) {
                boundClassDeclaration.implementedTypes = this.bindTypeReferenceSequence(
                    boundClassDeclaration,
                    classDeclaration.implementedTypes,
                    /*typeMap*/ undefined,
                    BoundNodeKind.InterfaceDeclaration,
                );
            }
        };
        deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnClassDeclaration);

        this.bindClassDeclarationMembers(boundClassDeclaration, classDeclaration.members, typeMap);

        return boundClassDeclaration;
    }

    // #region Type parameters

    private bindTypeParameters(
        parent: BoundClassDeclaration,
        typeParameters: (TypeParameter | CommaSeparator)[],
    ): BoundTypeParameter[] {
        const boundTypeParameters: BoundTypeParameter[] = [];

        for (const typeParameter of typeParameters) {
            switch (typeParameter.kind) {
                case NodeKind.TypeParameter: {
                    const boundTypeParameter = this.bindTypeParameter(parent, typeParameter);
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
        parent: BoundClassDeclaration,
        typeParameter: TypeParameter,
    ): BoundTypeParameter {
        const boundTypeParameter = new BoundTypeParameter();
        boundTypeParameter.parent = parent;
        boundTypeParameter.type = new TypeParameterType(boundTypeParameter);
        const name = getText(typeParameter.identifier, parent);
        boundTypeParameter.identifier = new BoundSymbol(name, boundTypeParameter);
        parent.locals.set(boundTypeParameter.identifier);

        return boundTypeParameter;
    }

    // #endregion

    private bindClassDeclarationMembers(
        parent: BoundClassDeclaration,
        members: ClassDeclarationMember[],
        typeMap: TypeMap | undefined,
    ): void {
        for (const member of members) {
            switch (member.kind) {
                case NodeKind.AccessibilityDirective: {
                    // console.warn(`'${member.accessibilityKeyword.kind}' directive is not implemented.`);
                    break;
                }
                case NodeKind.DataDeclarationSequence: {
                    this.bindDataDeclarationSequence(parent, member, typeMap);
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    this.bindFunctionDeclaration(parent, member, typeMap);
                    break;
                }
                case NodeKind.ClassMethodDeclaration: {
                    this.bindClassMethodDeclaration(parent, member, typeMap);
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

        if (!this.hasParameterlessConstructor(parent)) {
            this.createParameterlessConstructor(parent);
        }
    }

    // #region Default constructor

    private hasParameterlessConstructor(boundClassDeclaration: BoundClassDeclaration): boolean {
        const constructorGroup = boundClassDeclaration.locals.get(CONSTRUCTOR_NAME, BoundNodeKind.ClassMethodGroupDeclaration);
        if (constructorGroup) {
            for (const [, overload] of constructorGroup.overloads) {
                if (overload.parameters.length === 0) {
                    return true;
                }
            }
        }

        return false;
    }

    private createParameterlessConstructor(parent: BoundClassDeclaration): BoundClassMethodGroupDeclaration {
        const boundMethodGroupDeclaration = this.bindClassMethodGroupDeclaration(parent, CONSTRUCTOR_NAME);

        const boundClassMethodDeclaration = new BoundClassMethodDeclaration();
        boundMethodGroupDeclaration.overloads.set(boundClassMethodDeclaration);
        boundClassMethodDeclaration.parent = boundMethodGroupDeclaration;
        boundClassMethodDeclaration.type = new MethodType(boundClassMethodDeclaration);
        boundClassMethodDeclaration.identifier = new BoundSymbol(CONSTRUCTOR_NAME, boundClassMethodDeclaration);
        boundClassMethodDeclaration.returnType = parent;
        boundClassMethodDeclaration.parameters = [];

        // TODO: Check what Monkey X compiler does here
        boundClassMethodDeclaration.statements = [];

        return boundMethodGroupDeclaration;
    }

    // #endregion

    // #region Class method declaration

    @traceBinding(BoundNodeKind.ClassMethodDeclaration)
    private bindClassMethodDeclaration(
        parent: BoundClassDeclaration,
        classMethodDeclaration: ClassMethodDeclaration,
        typeMap: TypeMap | undefined,
    ): BoundClassMethodDeclaration {
        const name = getText(classMethodDeclaration.identifier, parent);
        const boundClassMethodGroupDeclaration = this.bindClassMethodGroupDeclaration(parent, name);

        const boundClassMethodDeclaration = new BoundClassMethodDeclaration();
        boundClassMethodDeclaration.declaration = classMethodDeclaration;
        boundClassMethodGroupDeclaration.overloads.set(boundClassMethodDeclaration);
        boundClassMethodDeclaration.parent = boundClassMethodGroupDeclaration;
        boundClassMethodDeclaration.type = new MethodType(boundClassMethodDeclaration);
        boundClassMethodDeclaration.identifier = new BoundSymbol(name, boundClassMethodDeclaration);
        boundClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(boundClassMethodDeclaration, classMethodDeclaration.parameters, typeMap);
        boundClassMethodDeclaration.isProperty = this.isProperty(classMethodDeclaration);

        const bindTypeReferencesOnClassMethodDeclaration = () => {
            if (areIdentifiersSame(CONSTRUCTOR_NAME, boundClassMethodDeclaration.identifier.name)) {
                boundClassMethodDeclaration.returnType = parent;
            } else {
                boundClassMethodDeclaration.returnType = this.bindTypeAnnotation(boundClassMethodDeclaration, classMethodDeclaration.returnType, typeMap);
            }
        };
        deferOrExecute(this.bindTypeReferencesCallbackList, bindTypeReferencesOnClassMethodDeclaration);

        const bindStatementsOnClassMethodDeclaration = () => {
            if (classMethodDeclaration.statements) {
                boundClassMethodDeclaration.statements = this.bindStatements(boundClassMethodDeclaration, classMethodDeclaration.statements, typeMap);
            }
        }
        deferOrExecute(this.bindStatementsCallbackList, bindStatementsOnClassMethodDeclaration);

        return boundClassMethodDeclaration;
    }

    private bindClassMethodGroupDeclaration(parent: BoundClassDeclaration, name: string): BoundClassMethodGroupDeclaration {
        let boundClassMethodGroupDeclaration = parent.locals.get(name, BoundNodeKind.ClassMethodGroupDeclaration);
        if (boundClassMethodGroupDeclaration) {
            return boundClassMethodGroupDeclaration;
        }

        boundClassMethodGroupDeclaration = new BoundClassMethodGroupDeclaration();
        boundClassMethodGroupDeclaration.parent = parent;
        boundClassMethodGroupDeclaration.type = new MethodGroupType(boundClassMethodGroupDeclaration);
        boundClassMethodGroupDeclaration.identifier = new BoundSymbol(name, boundClassMethodGroupDeclaration);
        parent.locals.set(boundClassMethodGroupDeclaration.identifier);

        return boundClassMethodGroupDeclaration;
    }

    private isProperty(classLikeMethodDeclaration: ExternClassMethodDeclaration | ClassMethodDeclaration) {
        const isProperty = classLikeMethodDeclaration.attributes.some((attribute) =>
            attribute.kind === TokenKind.PropertyKeyword
        );

        if (isProperty) {
            let parameterCount = 0;

            for (const parameter of classLikeMethodDeclaration.parameters.children) {
                if (parameter.kind === NodeKind.DataDeclaration) {
                    parameterCount++;
                }
            }

            switch (parameterCount) {
                case 0:
                case 1: {
                    break;
                }
                default: {
                    throw new Error(`Properties may only have 0 or 1 parameters.`);
                }
            }
        }

        return isProperty;
    }

    // #endregion

    // #endregion

    // #endregion

    // #region Statements

    private bindStatements(
        parent: BoundNodes,
        statements: (Statements | SkippedToken)[],
        typeMap: TypeMap | undefined,
    ): BoundStatements[] {
        const boundStatements: BoundStatements[] = [];

        for (const statement of statements) {
            switch (statement.kind) {
                case NodeKind.DataDeclarationSequenceStatement: {
                    const boundDataDeclarations = this.bindDataDeclarationSequenceStatement(parent, statement, typeMap);
                    boundStatements.push(...boundDataDeclarations);
                    break;
                }
                case NodeKind.ReturnStatement: {
                    const boundReturnStatement = this.bindReturnStatement(parent, statement, typeMap);
                    boundStatements.push(boundReturnStatement);
                    break;
                }
                case NodeKind.IfStatement: {
                    const boundIfStatement = this.bindIfStatement(parent, statement, typeMap);
                    boundStatements.push(boundIfStatement);
                    break;
                }
                case NodeKind.SelectStatement: {
                    const boundSelectStatement = this.bindSelectStatement(parent, statement, typeMap);
                    boundStatements.push(boundSelectStatement);
                    break;
                }
                case NodeKind.WhileLoop: {
                    const boundWhileLoop = this.bindWhileLoop(parent, statement, typeMap);
                    boundStatements.push(boundWhileLoop);
                    break;
                }
                case NodeKind.RepeatLoop: {
                    const boundRepeatLoop = this.bindRepeatLoop(parent, statement, typeMap);
                    boundStatements.push(boundRepeatLoop);
                    break;
                }
                case NodeKind.NumericForLoop: {
                    const boundNumericForLoop = this.bindNumericForLoop(parent, statement, typeMap);
                    boundStatements.push(boundNumericForLoop);
                    break;
                }
                case NodeKind.ForEachInLoop: {
                    const boundForEachInLoop = this.bindForEachInLoop(parent, statement, typeMap);
                    boundStatements.push(...boundForEachInLoop);
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
                    const boundThrowStatement = this.bindThrowStatement(parent, statement, typeMap);
                    boundStatements.push(boundThrowStatement);
                    break;
                }
                case NodeKind.TryStatement: {
                    const boundTryStatement = this.bindTryStatement(parent, statement, typeMap);
                    boundStatements.push(boundTryStatement);
                    break;
                }
                case NodeKind.AssignmentStatement: {
                    const boundAssignmentStatement = this.bindAssignmentStatement(parent, statement, typeMap);
                    boundStatements.push(boundAssignmentStatement);
                    break;
                }
                case NodeKind.ExpressionStatement: {
                    const boundExpressionStatement = this.bindExpressionStatement(parent, statement, typeMap);
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
        parent: BoundNodes,
        dataDeclarationSequenceStatement: DataDeclarationSequenceStatement,
        typeMap: TypeMap | undefined,
    ): BoundDataDeclarationStatement[] {
        const boundDataDeclarationStatements: BoundDataDeclarationStatement[] = [];

        const { dataDeclarationSequence } = dataDeclarationSequenceStatement;
        const dataDeclarationKind = this.getDataDeclarationKind(dataDeclarationSequence.dataDeclarationKeyword);

        for (const dataDeclaration of dataDeclarationSequence.children) {
            switch (dataDeclaration.kind) {
                case NodeKind.DataDeclaration: {
                    const boundDataDeclarationStatement = this.bindDataDeclarationStatement(parent, dataDeclaration, dataDeclarationKind, typeMap);
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
        parent: BoundNodes,
        dataDeclaration: DataDeclaration,
        dataDeclarationKind: BoundDataDeclarationKind,
        typeMap: TypeMap | undefined,
    ): BoundDataDeclarationStatement {
        return this.dataDeclarationStatement(parent,
            (parent) => this.bindDataDeclaration(parent, dataDeclaration, dataDeclarationKind, typeMap),
        );
    }

    private dataDeclarationStatement(
        parent: BoundNodes,
        getDataDeclaration: GetBoundNode<BoundDataDeclaration>,
    ): BoundDataDeclarationStatement {
        const boundDataDeclarationStatement = new BoundDataDeclarationStatement();
        boundDataDeclarationStatement.parent = parent;
        boundDataDeclarationStatement.dataDeclaration = getDataDeclaration(boundDataDeclarationStatement);

        return boundDataDeclarationStatement;
    }

    // #endregion

    // #region Return statement

    private bindReturnStatement(
        parent: BoundNodes,
        statement: ReturnStatement,
        typeMap: TypeMap | undefined,
    ): BoundReturnStatement {
        let getExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (statement.expression) {
            const { expression } = statement;
            getExpression = (parent) => this.bindExpression(parent, expression, typeMap);
        }

        return this.returnStatement(parent, getExpression);
    }

    private returnStatement(
        parent: BoundNodes,
        getExpression: GetBoundNode<BoundExpressions> | undefined,
    ): BoundReturnStatement {
        const boundReturnStatement = new BoundReturnStatement();
        boundReturnStatement.parent = parent;

        const functionLikeDeclaration = BoundTreeWalker.getClosest(boundReturnStatement,
            BoundNodeKind.FunctionDeclaration,
            BoundNodeKind.ClassMethodDeclaration,
        )!;
        const { returnType } = functionLikeDeclaration;

        if (getExpression) {
            boundReturnStatement.expression = getExpression(boundReturnStatement);
            boundReturnStatement.type = boundReturnStatement.expression.type;
        } else {
            switch (returnType.type.kind) {
                case TypeKind.Null: {
                    // Should be unreachable
                    throw new Error(`'${returnType.type.kind}' is not a valid return type.`);
                }
                case TypeKind.Void:
                case TypeKind.TypeParameter: {
                    boundReturnStatement.type = returnType.type;
                    break;
                }
                default: {
                    boundReturnStatement.expression = this.getDefaultValueExpression(boundReturnStatement, returnType.type.kind);
                    boundReturnStatement.type = boundReturnStatement.expression.type;
                    break;
                }
            }
        }

        if (!boundReturnStatement.type.isConvertibleTo(returnType.type)) {
            throw new Error(`'${boundReturnStatement.type}' is not convertible to '${returnType.type}'.`);
        }

        return boundReturnStatement;
    }

    private getDefaultValueExpression(
        parent: BoundReturnStatement,
        kind: DefaultableType['kind'],
    ) {
        switch (kind) {
            case TypeKind.Bool: {
                return this.booleanLiteral(parent, 'False');
            }
            case TypeKind.Int: {
                return this.integerLiteral(parent, '0');
            }
            case TypeKind.Float: {
                return this.floatLiteral(parent, '.0');
            }
            case TypeKind.String: {
                return this.stringLiteral(parent, '');
            }
            case TypeKind.Array: {
                return this.arrayLiteralExpression(parent, () => []);
            }
            case TypeKind.Object: {
                return this.nullExpression(parent);
            }
            default: {
                return assertNever(kind);
            }
        }
    }

    // #endregion

    // #region If statement

    private bindIfStatement(
        parent: BoundNodes,
        ifStatement: IfStatement,
        typeMap: TypeMap | undefined,
    ): BoundIfStatement {
        let getElseIfClauses: GetBoundNodes<BoundElseIfClause> | undefined = undefined;
        if (ifStatement.elseIfClauses) {
            const { elseIfClauses } = ifStatement;
            getElseIfClauses = (parent) => elseIfClauses.map((elseIfClause) =>
                this.bindElseIfClause(parent, elseIfClause, typeMap)
            );
        }

        let getElseClause: GetBoundNode<BoundElseClause> | undefined = undefined;
        if (ifStatement.elseClause) {
            const { elseClause } = ifStatement;
            getElseClause = (parent) => this.bindElseClause(parent, elseClause, typeMap);
        }

        return this.ifStatement(parent,
            (parent) => this.bindExpression(parent, ifStatement.expression, typeMap),
            (parent) => this.bindStatements(parent, ifStatement.statements, typeMap),
            getElseIfClauses,
            getElseClause,
        );
    }

    private ifStatement(
        parent: BoundNodes,
        getExpression: GetBoundNode<BoundExpressions>,
        getStatements: GetBoundNodes<BoundStatements>,
        getElseIfClauses: GetBoundNodes<BoundElseIfClause> | undefined,
        getElseClause: GetBoundNode<BoundElseClause> | undefined,
    ): BoundIfStatement {
        const boundIfStatement = new BoundIfStatement();
        boundIfStatement.parent = parent;
        boundIfStatement.expression = getExpression(boundIfStatement);

        if (!this.isExplicitlyConvertible(boundIfStatement.expression.type, this.project.boolTypeDeclaration.type)) {
            throw new Error(`'${boundIfStatement.expression.type}' is not convertible to '${this.project.boolTypeDeclaration.type}'.`);
        }

        boundIfStatement.statements = getStatements(boundIfStatement);
        if (getElseIfClauses) {
            boundIfStatement.elseIfClauses = getElseIfClauses(boundIfStatement);
        }
        if (getElseClause) {
            boundIfStatement.elseClause = getElseClause(boundIfStatement);
        }

        return boundIfStatement;
    }

    private bindElseIfClause(
        parent: BoundNodes,
        elseifClause: ElseIfClause,
        typeMap: TypeMap | undefined,
    ): BoundElseIfClause {
        return this.elseIfClause(parent,
            (parent) => this.bindExpression(parent, elseifClause.expression, typeMap),
            (parent) => this.bindStatements(parent, elseifClause.statements, typeMap),
        );
    }

    private elseIfClause(
        parent: BoundNodes,
        getExpression: GetBoundNode<BoundExpressions>,
        getStatements: GetBoundNodes<BoundStatements>,
    ): BoundElseIfClause {
        const boundElseIfClause = new BoundElseIfClause();
        boundElseIfClause.parent = parent;
        boundElseIfClause.expression = getExpression(boundElseIfClause);

        if (!this.isExplicitlyConvertible(boundElseIfClause.expression.type, this.project.boolTypeDeclaration.type)) {
            throw new Error(`'${boundElseIfClause.expression.type}' is not convertible to '${this.project.boolTypeDeclaration.type}'.`);
        }

        boundElseIfClause.statements = getStatements(boundElseIfClause);

        return boundElseIfClause;
    }

    private bindElseClause(
        parent: BoundNodes,
        elseClause: ElseClause,
        typeMap: TypeMap | undefined,
    ): BoundElseClause {
        return this.elseClause(parent,
            (parent) => this.bindStatements(parent, elseClause.statements, typeMap),
        );
    }

    private elseClause(
        parent: BoundNodes,
        getStatements: GetBoundNodes<BoundStatements>,
    ): BoundElseClause {
        const boundElseClause = new BoundElseClause();
        boundElseClause.parent = parent;
        boundElseClause.statements = getStatements(boundElseClause);

        return boundElseClause;
    }

    // #endregion

    // #region Select statement

    private bindSelectStatement(
        parent: BoundNodes,
        selectStatement: SelectStatement,
        typeMap: TypeMap | undefined,
    ): BoundSelectStatement {
        let getDefaultClause: GetBoundNode<BoundDefaultClause> | undefined = undefined;
        if (selectStatement.defaultClause) {
            const { defaultClause } = selectStatement;
            getDefaultClause = (parent) => this.bindDefaultClause(parent, defaultClause, typeMap);
        }

        return this.selectStatement(parent,
            (parent) => selectStatement.caseClauses.map((caseClause) =>
                this.bindCaseClause(parent, caseClause, typeMap)
            ),
            getDefaultClause,
        );
    }

    private selectStatement(
        parent: BoundNodes,
        getCaseClauses: GetBoundNodes<BoundCaseClause>,
        getDefaultClause: GetBoundNode<BoundDefaultClause> | undefined,
    ): BoundSelectStatement {
        const boundSelectStatement = new BoundSelectStatement();
        boundSelectStatement.parent = parent;
        boundSelectStatement.caseClauses = getCaseClauses(boundSelectStatement);
        if (getDefaultClause) {
            boundSelectStatement.defaultClause = getDefaultClause(boundSelectStatement);
        }

        return boundSelectStatement;
    }

    private bindCaseClause(
        parent: BoundNodes,
        caseClause: CaseClause,
        typeMap: TypeMap | undefined,
    ): BoundCaseClause {
        return this.caseClause(parent,
            (parent) => this.bindExpressionSequence(parent, caseClause.expressions, typeMap),
            (parent) => this.bindStatements(parent, caseClause.statements, typeMap),
        );
    }

    private caseClause(
        parent: BoundNodes,
        getExpressions: GetBoundNodes<BoundExpressions>,
        getStatements: GetBoundNodes<BoundStatements>,
    ): BoundCaseClause {
        const boundCaseClause = new BoundCaseClause();
        boundCaseClause.parent = parent;
        boundCaseClause.expressions = getExpressions(boundCaseClause);
        boundCaseClause.statements = getStatements(boundCaseClause);

        return boundCaseClause;
    }

    private bindDefaultClause(
        parent: BoundNodes,
        defaultClause: DefaultClause,
        typeMap: TypeMap | undefined,
    ): BoundDefaultClause {
        return this.defaultClause(parent,
            (parent) => this.bindStatements(parent, defaultClause.statements, typeMap),
        );
    }

    private defaultClause(
        parent: BoundNodes,
        getStatements: GetBoundNodes<BoundStatements>,
    ): BoundDefaultClause {
        const boundDefaultClause = new BoundDefaultClause();
        boundDefaultClause.parent = parent;
        boundDefaultClause.statements = getStatements(boundDefaultClause);

        return boundDefaultClause;
    }

    // #endregion

    // #region Loops

    // #region While loop

    private bindWhileLoop(
        parent: BoundNodes,
        whileLoop: WhileLoop,
        typeMap: TypeMap | undefined,
    ): BoundWhileLoop {
        return this.whileLoop(parent,
            (parent) => this.bindExpression(parent, whileLoop.expression, typeMap),
            (parent) => this.bindStatements(parent, whileLoop.statements, typeMap),
        );
    }

    private whileLoop(
        parent: BoundNodes,
        getExpression: GetBoundNode<BoundExpressions>,
        getStatements: GetBoundNodes<BoundStatements>,
    ): BoundWhileLoop {
        const boundWhileLoop = new BoundWhileLoop();
        boundWhileLoop.parent = parent;
        boundWhileLoop.expression = getExpression(boundWhileLoop);

        if (!this.isExplicitlyConvertible(boundWhileLoop.expression.type, this.project.boolTypeDeclaration.type)) {
            throw new Error(`'${boundWhileLoop.expression.type}' is not convertible to '${this.project.boolTypeDeclaration.type}'.`);
        }

        boundWhileLoop.statements = getStatements(boundWhileLoop);

        return boundWhileLoop;
    }

    // #endregion

    // #region Repeat loop

    private bindRepeatLoop(
        parent: BoundNodes,
        repeatLoop: RepeatLoop,
        typeMap: TypeMap | undefined,
    ): BoundRepeatLoop {
        let getUntilExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (repeatLoop.untilExpression) {
            const { untilExpression } = repeatLoop;
            getUntilExpression = (parent) => this.bindExpression(parent, untilExpression, typeMap);
        }

        return this.repeatLoop(parent,
            getUntilExpression,
            (parent) => this.bindStatements(parent, repeatLoop.statements, typeMap),
        );
    }

    private repeatLoop(
        parent: BoundNodes,
        getUntilExpression: GetBoundNode<BoundExpressions> | undefined,
        getStatements: GetBoundNodes<BoundStatements>,
    ): BoundRepeatLoop {
        const boundRepeatLoop = new BoundRepeatLoop();
        boundRepeatLoop.parent = parent;

        if (getUntilExpression) {
            boundRepeatLoop.untilExpression = getUntilExpression(boundRepeatLoop);

            if (!this.isExplicitlyConvertible(boundRepeatLoop.untilExpression.type, this.project.boolTypeDeclaration.type)) {
                throw new Error(`'${boundRepeatLoop.untilExpression.type}' is not convertible to '${this.project.boolTypeDeclaration.type}'.`);
            }
        }

        boundRepeatLoop.statements = getStatements(boundRepeatLoop);

        return boundRepeatLoop;
    }

    // #endregion

    // #region For loop

    private bindNumericForLoop(
        parent: BoundNodes,
        numericForLoop: NumericForLoop,
        typeMap: TypeMap | undefined,
    ): BoundForLoop {
        const { indexVariable } = numericForLoop;
        if (indexVariable.kind === TokenKind.Missing) {
            throw new Error(`Index variable is missing.`);
        }

        if (numericForLoop.operator.kind === TokenKind.Missing) {
            throw new Error(`Operator is missing.`);
        }

        let getFirstValueStatement: GetBoundNode<BoundStatements>;
        if (numericForLoop.localKeyword) {
            const operatorToken = numericForLoop.operator as EqualsSignToken | ColonEqualsSignToken;

            getFirstValueStatement = (parent) => this.dataDeclarationStatement(parent,
                (parent) => this.dataDeclaration(parent,
                    this.getDataDeclarationKind(numericForLoop.localKeyword!),
                    getText(indexVariable, parent),
                    operatorToken.kind,
                    (parent) => this.bindTypeAnnotation(parent, numericForLoop.typeAnnotation, typeMap),
                    (parent) => this.bindExpression(parent, numericForLoop.firstValueExpression, typeMap),
                ),
            );
        } else {
            const operatorToken = numericForLoop.operator as AssignmentOperatorToken;

            getFirstValueStatement = (parent) => this.assignmentStatement(parent,
                (parent) => this.identifierExpression(parent,
                    (parent) => this.resolveIdentifier(indexVariable, parent),
                ),
                this.getAssignmentStatementOperator(operatorToken.kind),
                (parent) => this.bindExpression(parent, numericForLoop.firstValueExpression, typeMap),
            );
        }

        let getStepValueExpression: GetBoundNode<BoundExpressions>;
        if (numericForLoop.stepValueExpression) {
            getStepValueExpression = (parent) => this.bindExpression(parent, numericForLoop.stepValueExpression!, typeMap)
        } else {
            getStepValueExpression = (parent) => this.integerLiteral(parent, '1');
        }

        return this.forLoop(parent,
            getFirstValueStatement,
            (parent) => this.binaryExpression(parent,
                (parent) => this.identifierExpression(parent,
                    (parent) => this.resolveIdentifier(indexVariable, parent),
                ),
                this.getComparisonExpressionOperator(numericForLoop),
                (parent) => this.bindExpression(parent, numericForLoop.lastValueExpression, typeMap),
            ),
            (parent) => this.assignmentStatement(parent,
                (parent) => this.identifierExpression(parent,
                    (parent) => this.resolveIdentifier(indexVariable, parent),
                ),
                BoundAssignmentStatementOperator.AdditionUpdateAssignment,
                getStepValueExpression,
            ),
            (parent) => this.bindStatements(parent, numericForLoop.statements, typeMap),
        );
    }

    private forLoop(
        parent: BoundNodes,
        getFirstValueStatement: GetBoundNode<BoundStatements>,
        getLastValueExpression: GetBoundNode<BoundExpressions>,
        getStepValueClause: GetBoundNode<BoundAssignmentStatement>,
        getStatements: GetBoundNodes<BoundStatements>,
    ): BoundForLoop {
        const boundForLoop = new BoundForLoop();
        boundForLoop.parent = parent;
        boundForLoop.firstValueStatement = getFirstValueStatement(boundForLoop);
        boundForLoop.lastValueExpression = getLastValueExpression(boundForLoop);
        boundForLoop.stepValueClause = getStepValueClause(boundForLoop);
        boundForLoop.statements = getStatements(boundForLoop);

        return boundForLoop;
    }

    private getComparisonExpressionOperator(numericForLoop: NumericForLoop) {
        switch (numericForLoop.toOrUntilKeyword.kind) {
            case TokenKind.ToKeyword: {
                if (numericForLoop.stepValueExpression &&
                    numericForLoop.stepValueExpression.kind === NodeKind.UnaryExpression &&
                    numericForLoop.stepValueExpression.operator.kind === TokenKind.HyphenMinus
                ) {
                    return BoundBinaryExpressionOperator.GreaterThanOrEquals;
                }

                return BoundBinaryExpressionOperator.LessThanOrEquals;
            }
            case TokenKind.UntilKeyword: {
                if (numericForLoop.stepValueExpression &&
                    numericForLoop.stepValueExpression.kind === NodeKind.UnaryExpression &&
                    numericForLoop.stepValueExpression.operator.kind === TokenKind.HyphenMinus
                ) {
                    return BoundBinaryExpressionOperator.GreaterThan;
                }

                return BoundBinaryExpressionOperator.LessThan;
            }
            case TokenKind.Missing: {
                throw new Error(`Missing 'To' or 'Until' keyword.`);
            }
            default: {
                return assertNever(numericForLoop.toOrUntilKeyword);
            }
        }
    }

    private bindForEachInLoop(
        parent: BoundNodes,
        forEachInLoop: ForEachInLoop,
        typeMap: TypeMap | undefined,
    ): BoundStatements[] {
        const boundStatements: BoundStatements[] = [];

        // Temporarily set `parent` of the expression to our current parent. As `parent` is used for symbol resolution,
        // this still works out fine even if it's not strictly correct.
        const boundCollectionExpression = this.bindExpression(parent, forEachInLoop.collectionExpression, typeMap);

        switch (boundCollectionExpression.type.kind) {
            case TypeKind.String:
            case TypeKind.Array: {
                // Local _AnonymousCollection_ := _CollectionExpression_
                const boundCollectionDeclarationStatement = this.dataDeclarationStatement(parent,
                    (parent) => this.localDeclaration(parent,
                        (parent) => setParent(boundCollectionExpression, parent),
                    ),
                );
                boundStatements.push(boundCollectionDeclarationStatement);
                const boundCollectionDeclaration = boundCollectionDeclarationStatement.dataDeclaration;

                // Local _AnonymousIndex_ := 0
                const firstValueStatement = this.dataDeclarationStatement(parent,
                    (parent) => this.localDeclaration(parent,
                        (parent) => this.integerLiteral(parent, '0'),
                    ),
                );
                boundStatements.push(firstValueStatement);
                const boundIndexDeclaration = firstValueStatement.dataDeclaration;

                // While _AnonymousIndex_ < _AnonymousCollection_.Length
                const boundWhileLoop = new BoundWhileLoop();
                boundWhileLoop.parent = parent;

                boundWhileLoop.expression = this.binaryExpression(boundWhileLoop,
                    (parent) => this.identifierExpression(parent,
                        () => boundIndexDeclaration,
                    ),
                    BoundBinaryExpressionOperator.LessThan,
                    (parent) => this.invokeSpecialMethod(parent,
                        boundCollectionDeclaration,
                        'Length',
                        (returnType) => returnType.kind === TypeKind.Int,
                    ),
                );

                boundWhileLoop.statements = [];

                const { indexVariable } = forEachInLoop;
                if (indexVariable.kind === TokenKind.Missing) {
                    throw new Error(`Index variable is missing.`);
                }

                if (forEachInLoop.operator.kind === TokenKind.Missing) {
                    throw new Error(`Operator is missing.`);
                }

                if (forEachInLoop.localKeyword) {
                    const operatorToken = forEachInLoop.operator as EqualsSignToken | ColonEqualsSignToken;

                    // Local _IndexVariable_: _TypeAnnotation_ _Operator_ _AnonymousCollection_[_AnonymousIndex_]
                    const indexVariableStatement = this.dataDeclarationStatement(boundWhileLoop,
                        (parent) => this.dataDeclaration(parent,
                            this.getDataDeclarationKind(forEachInLoop.localKeyword!),
                            getText(indexVariable, parent),
                            operatorToken.kind,
                            (parent) => this.bindTypeAnnotation(parent, forEachInLoop.typeAnnotation, typeMap),
                            (parent) => this.indexExpression(parent,
                                (parent) => this.identifierExpression(parent,
                                    () => boundCollectionDeclaration,
                                ),
                                (parent) => this.identifierExpression(parent,
                                    () => boundIndexDeclaration,
                                ),
                            ),
                        ),
                    );
                    boundWhileLoop.statements.push(indexVariableStatement);
                } else {
                    const operatorToken = forEachInLoop.operator as AssignmentOperatorToken;

                    // _IndexVariable_ _Operator_ _AnonymousCollection_[_AnonymousIndex_]
                    const indexVariableStatement = this.assignmentStatement(boundWhileLoop,
                        (parent) => this.identifierExpression(parent,
                            (parent) => this.resolveIdentifier(indexVariable, parent),
                        ),
                        this.getAssignmentStatementOperator(operatorToken.kind),
                        (parent) => this.indexExpression(parent,
                            (parent) => this.identifierExpression(parent,
                                () => boundCollectionDeclaration,
                            ),
                            (parent) => this.identifierExpression(parent,
                                () => boundIndexDeclaration,
                            ),
                        ),
                    );
                    boundWhileLoop.statements.push(indexVariableStatement);
                }

                // _AnonymousIndex_ += 1
                const incrementStatement = this.assignmentStatement(boundWhileLoop,
                    (parent) => this.identifierExpression(parent,
                        () => boundIndexDeclaration,
                    ),
                    BoundAssignmentStatementOperator.AdditionUpdateAssignment,
                    (parent) => this.integerLiteral(parent, '1'),
                );
                boundWhileLoop.statements.push(incrementStatement);

                const boundWhileLoopStatements = this.bindStatements(boundWhileLoop, forEachInLoop.statements, typeMap);
                boundWhileLoop.statements.push(...boundWhileLoopStatements);

                boundStatements.push(boundWhileLoop);
                break;
            }
            case TypeKind.Object: {
                // Local _AnonymousCollection_ := _CollectionExpression_.ObjectEnumerator()
                const boundCollectionDeclarationStatement = this.dataDeclarationStatement(parent,
                    (parent) => this.localDeclaration(parent,
                        (parent) => this.invokeSpecialMethod(parent,
                            boundCollectionExpression,
                            'ObjectEnumerator',
                            // Don't need to explicitly check that the return type has `HasNext()` and `NextObject()`.
                            // Errors will occur when we try to resolve them.
                        ),
                    ),
                );
                boundStatements.push(boundCollectionDeclarationStatement);
                const boundCollectionDeclaration = boundCollectionDeclarationStatement.dataDeclaration;

                // While _AnonymousCollection_.HasNext()
                const boundWhileLoop = new BoundWhileLoop();
                boundWhileLoop.parent = parent;

                boundWhileLoop.expression = this.invokeSpecialMethod(boundWhileLoop,
                    boundCollectionDeclaration,
                    'HasNext',
                    (returnType) => returnType.kind === TypeKind.Bool,
                );

                boundWhileLoop.statements = [];

                const { indexVariable } = forEachInLoop;
                if (indexVariable.kind === TokenKind.Missing) {
                    throw new Error(`Index variable is missing.`);
                }

                if (forEachInLoop.operator.kind === TokenKind.Missing) {
                    throw new Error(`Operator is missing.`);
                }

                if (forEachInLoop.localKeyword) {
                    const operatorToken = forEachInLoop.operator as EqualsSignToken | ColonEqualsSignToken;

                    // Local _IndexVariable_: _TypeAnnotation_ _Operator_ _AnonymousCollection_.NextObject()
                    const indexVariableStatement = this.dataDeclarationStatement(boundWhileLoop,
                        (parent) => this.dataDeclaration(parent,
                            this.getDataDeclarationKind(forEachInLoop.localKeyword!),
                            getText(indexVariable, parent),
                            operatorToken.kind,
                            (parent) => this.bindTypeAnnotation(parent, forEachInLoop.typeAnnotation, typeMap),
                            (parent) => this.invokeSpecialMethod(parent,
                                boundCollectionDeclaration,
                                'NextObject',
                            ),
                        ),
                    );
                    boundWhileLoop.statements.push(indexVariableStatement);
                } else {
                    const operatorToken = forEachInLoop.operator as AssignmentOperatorToken;

                    // _IndexVariable_ _Operator_ _AnonymousCollection_.NextObject()
                    const indexVariableStatement = this.assignmentStatement(boundWhileLoop,
                        (parent) => this.identifierExpression(parent,
                            (parent) => this.resolveIdentifier(indexVariable, parent),
                        ),
                        this.getAssignmentStatementOperator(operatorToken.kind),
                        (parent) => this.invokeSpecialMethod(parent,
                            boundCollectionDeclaration,
                            'NextObject',
                        ),
                    );
                    boundWhileLoop.statements.push(indexVariableStatement);
                }

                const boundWhileLoopStatements = this.bindStatements(boundWhileLoop, forEachInLoop.statements, typeMap);
                boundWhileLoop.statements.push(...boundWhileLoopStatements);

                boundStatements.push(boundWhileLoop);
                break;
            }
            default: {
                throw new Error(`'${boundCollectionExpression.type.kind}' is not a collection type.`);
            }
        }

        return boundStatements;
    }

    // #endregion

    private bindContinueStatement(
        parent: BoundNodes,
    ): BoundContinueStatement {
        return this.continueStatement(parent);
    }

    private continueStatement(
        parent: BoundNodes,
    ): BoundContinueStatement {
        const boundContinueStatement = new BoundContinueStatement();
        boundContinueStatement.parent = parent;

        return boundContinueStatement;
    }

    private bindExitStatement(
        parent: BoundNodes,
    ): BoundExitStatement {
        return this.exitStatement(parent);
    }

    private exitStatement(
        parent: BoundNodes,
    ): BoundExitStatement {
        const boundExitStatement = new BoundExitStatement();
        boundExitStatement.parent = parent;

        return boundExitStatement;
    }

    // #endregion

    // #region Throw statement

    private bindThrowStatement(
        parent: BoundNodes,
        throwStatement: ThrowStatement,
        typeMap: TypeMap | undefined,
    ): BoundThrowStatement {
        return this.throwStatement(parent,
            (parent) => this.bindExpression(parent, throwStatement.expression, typeMap),
        );
    }

    private throwStatement(
        parent: BoundNodes,
        getExpression: GetBoundNode<BoundExpressions>,
    ): BoundThrowStatement {
        const boundThrowStatement = new BoundThrowStatement();
        boundThrowStatement.parent = parent;
        boundThrowStatement.expression = getExpression(boundThrowStatement);

        return boundThrowStatement;
    }

    // #endregion

    // #region Try statement

    private bindTryStatement(
        parent: BoundNodes,
        tryStatement: TryStatement,
        typeMap: TypeMap | undefined,
    ): BoundTryStatement {
        return this.tryStatement(parent,
            (parent) => this.bindStatements(parent, tryStatement.statements, typeMap),
            (parent) => tryStatement.catchClauses.map((catchClause) =>
                this.bindCatchClause(parent, catchClause, typeMap)
            ),
        );
    }

    private tryStatement(
        parent: BoundNodes,
        getStatements: GetBoundNodes<BoundStatements>,
        getCatchClauses: GetBoundNodes<BoundCatchClause>,
    ): BoundTryStatement {
        const boundTryStatement = new BoundTryStatement();
        boundTryStatement.parent = parent;
        boundTryStatement.statements = getStatements(boundTryStatement);
        boundTryStatement.catchClauses = getCatchClauses(boundTryStatement);

        return boundTryStatement;
    }

    private bindCatchClause(
        parent: BoundNodes,
        catchClause: CatchClause,
        typeMap: TypeMap | undefined,
    ): BoundCatchClause {
        let getParameter: GetBoundNode<BoundDataDeclaration>;
        switch (catchClause.parameter.kind) {
            case NodeKind.DataDeclaration: {
                const { parameter } = catchClause;
                getParameter = (parent) => this.bindDataDeclaration(parent, parameter, BoundDataDeclarationKind.Parameter, typeMap);
                break;
            }
            case TokenKind.Missing: {
                throw new Error('Catch clause must declare a parameter.');
            }
            default: {
                getParameter = assertNever(catchClause.parameter);
                break;
            }
        }

        return this.catchClause(parent,
            getParameter,
            (parent) => this.bindStatements(parent, catchClause.statements, typeMap),
        );
    }

    private catchClause(
        parent: BoundNodes,
        getParameter: GetBoundNode<BoundDataDeclaration>,
        getStatements: GetBoundNodes<BoundStatements>,
    ): BoundCatchClause {
        const boundCatchClause = new BoundCatchClause();
        boundCatchClause.parent = parent;
        boundCatchClause.parameter = getParameter(boundCatchClause);
        boundCatchClause.statements = getStatements(boundCatchClause);

        return boundCatchClause;
    }

    // #endregion

    // #region Assignment statement

    private bindAssignmentStatement(
        parent: BoundNodes,
        assignmentStatement: AssignmentStatement,
        typeMap: TypeMap | undefined,
    ): BoundAssignmentStatement | BoundExpressionStatement {
        // Fake that we're binding an invoke expression so that if the left operand is a property, it does not
        // get bound as a getter.
        const boundInvokeExpression = new BoundInvokeExpression();
        boundInvokeExpression.parent = parent;
        const leftOperand = this.bindExpression(boundInvokeExpression, assignmentStatement.leftOperand, typeMap);

        // Property setter
        if (leftOperand.type.kind === TypeKind.MethodGroup) {
            return this.expressionStatement(parent,
                (parent) => this.invokeExpression(parent,
                    (parent) => setParent(leftOperand, parent),
                    (parent) => [this.bindExpression(parent, assignmentStatement.rightOperand, typeMap)],
                    (overloads, args) => {
                        const overload = this.chooseOverload(overloads, args) as BoundClassMethodLikeDeclaration;
                        if (!overload.isProperty) {
                            throw new Error(`'${overload.type}' is not a property.`);
                        }

                        return overload;
                    },
                ),
            );
        }

        return this.assignmentStatement(parent,
            (parent) => setParent(leftOperand, parent),
            this.getAssignmentStatementOperator(assignmentStatement.operator.kind),
            (parent) => this.bindExpression(parent, assignmentStatement.rightOperand, typeMap),
        );
    }

    private getAssignmentStatementOperator(operatorKind: AssignmentOperatorToken['kind']) {
        switch (operatorKind) {
            case TokenKind.VerticalBarEqualsSign: { return BoundAssignmentStatementOperator.BitwiseOrUpdateAssignment; }
            case TokenKind.TildeEqualsSign: { return BoundAssignmentStatementOperator.BitwiseXorUpdateAssignment; }
            case TokenKind.AmpersandEqualsSign: { return BoundAssignmentStatementOperator.BitwiseAndUpdateAssignment; }
            case TokenKind.HyphenMinusEqualsSign: { return BoundAssignmentStatementOperator.SubtractionUpdateAssignment; }
            case TokenKind.PlusSignEqualsSign: { return BoundAssignmentStatementOperator.AdditionUpdateAssignment; }
            case TokenKind.ShrKeywordEqualsSign: { return BoundAssignmentStatementOperator.BitwiseShiftRightUpdateAssignment; }
            case TokenKind.ShlKeywordEqualsSign: { return BoundAssignmentStatementOperator.BitwiseShiftLeftUpdateAssignment; }
            case TokenKind.ModKeywordEqualsSign: { return BoundAssignmentStatementOperator.ModulusUpdateAssignment; }
            case TokenKind.SlashEqualsSign: { return BoundAssignmentStatementOperator.DivisionUpdateAssignment; }
            case TokenKind.AsteriskEqualsSign: { return BoundAssignmentStatementOperator.MultiplicationUpdateAssignment; }
            case TokenKind.EqualsSign: { return BoundAssignmentStatementOperator.Assignment; }
            default: { return assertNever(operatorKind); }
        }
    }

    private assignmentStatement(
        parent: BoundNodes,
        getLeftOperand: GetBoundNode<BoundExpressions>,
        operator: BoundAssignmentStatementOperator,
        getRightOperand: GetBoundNode<BoundExpressions>,
    ): BoundAssignmentStatement {
        const boundAssignmentStatement = new BoundAssignmentStatement();
        boundAssignmentStatement.parent = parent;
        boundAssignmentStatement.leftOperand = getLeftOperand(boundAssignmentStatement);
        boundAssignmentStatement.operator = operator;

        // TODO: What about side effects? Should we even bother lowering?
        //       The Monkey X compiler does lower (accounting for side effects).
        //       Is it actually necessary? Do all the target languages have update assignments with the
        //       same semantics?
        // Lower update assignments to an assignment of a binary expression
        if (operator !== BoundAssignmentStatementOperator.Assignment) {
            boundAssignmentStatement.rightOperand = this.binaryExpression(boundAssignmentStatement,
                (parent) => getLeftOperand(parent),
                this.getBinaryExpressionOperatorForUpdateAssignmentOperator(operator),
                (parent) => getRightOperand(parent),
            );
        } else {
            boundAssignmentStatement.rightOperand = getRightOperand(boundAssignmentStatement);
        }

        const { leftOperand, rightOperand } = boundAssignmentStatement;

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

    private getBinaryExpressionOperatorForUpdateAssignmentOperator(operator: UpdateAssignmentOperator) {
        switch (operator) {
            case BoundAssignmentStatementOperator.BitwiseOrUpdateAssignment: { return BoundBinaryExpressionOperator.BitwiseOr; }
            case BoundAssignmentStatementOperator.BitwiseXorUpdateAssignment: { return BoundBinaryExpressionOperator.BitwiseXor; }
            case BoundAssignmentStatementOperator.BitwiseAndUpdateAssignment: { return BoundBinaryExpressionOperator.BitwiseAnd; }
            case BoundAssignmentStatementOperator.SubtractionUpdateAssignment: { return BoundBinaryExpressionOperator.Subtraction; }
            case BoundAssignmentStatementOperator.AdditionUpdateAssignment: { return BoundBinaryExpressionOperator.Addition; }
            case BoundAssignmentStatementOperator.BitwiseShiftRightUpdateAssignment: { return BoundBinaryExpressionOperator.BitwiseShiftRight; }
            case BoundAssignmentStatementOperator.BitwiseShiftLeftUpdateAssignment: { return BoundBinaryExpressionOperator.BitwiseShiftLeft; }
            case BoundAssignmentStatementOperator.ModulusUpdateAssignment: { return BoundBinaryExpressionOperator.Modulus; }
            case BoundAssignmentStatementOperator.DivisionUpdateAssignment: { return BoundBinaryExpressionOperator.Division; }
            case BoundAssignmentStatementOperator.MultiplicationUpdateAssignment: { return BoundBinaryExpressionOperator.Multiplication; }
            default: { return assertNever(operator); }
        }
    }

    // #endregion

    // #region Expression statement

    private bindExpressionStatement(
        parent: BoundNodes,
        expressionStatement: ExpressionStatement,
        typeMap: TypeMap | undefined,
    ): BoundExpressionStatement {
        return this.expressionStatement(parent,
            (parent) => this.bindExpression(parent, expressionStatement.expression, typeMap),
        );
    }

    private expressionStatement(
        parent: BoundNodes,
        getExpression: GetBoundNode<BoundExpressions>,
    ): BoundExpressionStatement {
        const boundExpressionStatement = new BoundExpressionStatement();
        boundExpressionStatement.parent = parent;
        boundExpressionStatement.expression = getExpression(boundExpressionStatement);

        return boundExpressionStatement;
    }

    // #endregion

    // #endregion

    // #region Expressions

    private bindExpression(
        parent: BoundNodes,
        expression: Expressions | MissingToken,
        typeMap: TypeMap | undefined,
        scope?: BoundMemberContainerDeclaration,
    ) {
        switch (expression.kind) {
            case NodeKind.BinaryExpression: {
                return this.bindBinaryExpression(parent, expression, typeMap);
            }
            case NodeKind.UnaryExpression: {
                return this.bindUnaryExpression(parent, expression, typeMap);
            }
            case NodeKind.NewExpression: {
                return this.bindNewExpression(parent, expression, typeMap);
            }
            case NodeKind.NullExpression: {
                return this.bindNullExpression(parent);
            }
            case NodeKind.BooleanLiteralExpression: {
                return this.bindBooleanLiteralExpression(parent, expression);
            }
            case NodeKind.SelfExpression: {
                return this.bindSelfExpression(parent);
            }
            case NodeKind.SuperExpression: {
                return this.bindSuperExpression(parent);
            }
            case NodeKind.StringLiteralExpression: {
                return this.bindStringLiteralExpression(parent, expression);
            }
            case NodeKind.FloatLiteralExpression: {
                return this.bindFloatLiteralExpression(parent, expression);
            }
            case NodeKind.IntegerLiteralExpression: {
                return this.bindIntegerLiteralExpression(parent, expression);
            }
            case NodeKind.ArrayLiteralExpression: {
                return this.bindArrayLiteralExpression(parent, expression, typeMap);
            }
            case NodeKind.GlobalScopeExpression: {
                return this.bindGlobalScopeExpression(parent);
            }
            case NodeKind.IdentifierExpression: {
                return this.bindIdentifierExpression(parent, expression, typeMap, scope);
            }
            case NodeKind.GroupingExpression: {
                return this.bindGroupingExpression(parent, expression, typeMap);
            }
            case NodeKind.ScopeMemberAccessExpression: {
                return this.bindScopeMemberAccessExpression(parent, expression, typeMap, scope);
            }
            case NodeKind.IndexExpression: {
                return this.bindIndexExpression(parent, expression, typeMap, scope);
            }
            case NodeKind.SliceExpression: {
                return this.bindSliceExpression(parent, expression, typeMap, scope);
            }
            case NodeKind.InvokeExpression: {
                return this.bindInvokeExpression(parent, expression, typeMap, scope);
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
        parent: BoundNodes,
        expression: BinaryExpression,
        typeMap: TypeMap | undefined,
    ): BoundBinaryExpression {
        return this.binaryExpression(parent,
            (parent) => this.bindExpression(parent, expression.leftOperand, typeMap),
            this.getBinaryExpressionOperator(expression.operator.kind),
            (parent) => this.bindExpression(parent, expression.rightOperand, typeMap),
        );
    }

    private getBinaryExpressionOperator(operatorKind: BinaryExpressionOperatorToken['kind']) {
        switch (operatorKind) {
            case TokenKind.OrKeyword: { return BoundBinaryExpressionOperator.ConditionalOr; }
            case TokenKind.AndKeyword: { return BoundBinaryExpressionOperator.ConditionalAnd; }
            case TokenKind.LessThanSignGreaterThanSign: { return BoundBinaryExpressionOperator.NotEquals; }
            case TokenKind.GreaterThanSignEqualsSign: { return BoundBinaryExpressionOperator.GreaterThanOrEquals; }
            case TokenKind.LessThanSignEqualsSign: { return BoundBinaryExpressionOperator.LessThanOrEquals; }
            case TokenKind.GreaterThanSign: { return BoundBinaryExpressionOperator.GreaterThan; }
            case TokenKind.LessThanSign: { return BoundBinaryExpressionOperator.LessThan; }
            case TokenKind.EqualsSign: { return BoundBinaryExpressionOperator.Equals; }
            case TokenKind.VerticalBar: { return BoundBinaryExpressionOperator.BitwiseOr; }
            case TokenKind.Tilde: { return BoundBinaryExpressionOperator.BitwiseXor; }
            case TokenKind.Ampersand: { return BoundBinaryExpressionOperator.BitwiseAnd; }
            case TokenKind.HyphenMinus: { return BoundBinaryExpressionOperator.Subtraction; }
            case TokenKind.PlusSign: { return BoundBinaryExpressionOperator.Addition; }
            case TokenKind.ShrKeyword: { return BoundBinaryExpressionOperator.BitwiseShiftRight; }
            case TokenKind.ShlKeyword: { return BoundBinaryExpressionOperator.BitwiseShiftLeft; }
            case TokenKind.ModKeyword: { return BoundBinaryExpressionOperator.Modulus; }
            case TokenKind.Slash: { return BoundBinaryExpressionOperator.Division; }
            case TokenKind.Asterisk: { return BoundBinaryExpressionOperator.Multiplication; }
            default: { return assertNever(operatorKind); }
        }
    }

    private binaryExpression(
        parent: BoundNodes,
        getLeftOperand: GetBoundNode<BoundExpressions>,
        operator: BoundBinaryExpressionOperator,
        getRightOperand: GetBoundNode<BoundExpressions>,
    ): BoundBinaryExpression {
        const boundBinaryExpression = new BoundBinaryExpression();
        boundBinaryExpression.parent = parent;
        boundBinaryExpression.leftOperand = getLeftOperand(boundBinaryExpression);
        boundBinaryExpression.operator = operator;
        boundBinaryExpression.rightOperand = getRightOperand(boundBinaryExpression);

        switch (operator) {
            case BoundBinaryExpressionOperator.ConditionalOr:
            case BoundBinaryExpressionOperator.ConditionalAnd: {
                if (!this.isExplicitlyConvertible(boundBinaryExpression.leftOperand.type, this.project.boolTypeDeclaration.type)) {
                    throw new Error(`'${boundBinaryExpression.leftOperand.type}' is not convertible to '${this.project.boolTypeDeclaration.type}'.`);
                }

                if (!this.isExplicitlyConvertible(boundBinaryExpression.rightOperand.type, this.project.boolTypeDeclaration.type)) {
                    throw new Error(`'${boundBinaryExpression.rightOperand.type}' is not convertible to '${this.project.boolTypeDeclaration.type}'.`);
                }
                break;
            }
        }

        boundBinaryExpression.type = this.getTypeOfBinaryExpression(
            boundBinaryExpression.leftOperand.type,
            boundBinaryExpression.operator,
            boundBinaryExpression.rightOperand.type,
        );

        return boundBinaryExpression;
    }

    private getTypeOfBinaryExpression(
        leftOperand: Types,
        operator: BoundBinaryExpressionOperator,
        rightOperand: Types,
    ) {
        switch (operator) {
            // Binary arithmetic operations
            case BoundBinaryExpressionOperator.Multiplication:
            case BoundBinaryExpressionOperator.Division:
            case BoundBinaryExpressionOperator.Modulus:
            case BoundBinaryExpressionOperator.Addition:
            case BoundBinaryExpressionOperator.Subtraction: {
                return this.bindBinaryArithmeticOperationType(leftOperand, operator, rightOperand);
            }

            // Bitwise operations
            case BoundBinaryExpressionOperator.BitwiseShiftLeft:
            case BoundBinaryExpressionOperator.BitwiseShiftRight:
            case BoundBinaryExpressionOperator.BitwiseAnd:
            case BoundBinaryExpressionOperator.BitwiseXor:
            case BoundBinaryExpressionOperator.BitwiseOr: {
                return this.bindBitwiseOperationType(leftOperand, operator, rightOperand);
            }

            // Comparison operations
            case BoundBinaryExpressionOperator.Equals:
            case BoundBinaryExpressionOperator.LessThan:
            case BoundBinaryExpressionOperator.GreaterThan:
            case BoundBinaryExpressionOperator.LessThanOrEquals:
            case BoundBinaryExpressionOperator.GreaterThanOrEquals:
            case BoundBinaryExpressionOperator.NotEquals: {
                return this.bindComparisonOperationType(leftOperand, operator, rightOperand);
            }

            // Conditional operations
            case BoundBinaryExpressionOperator.ConditionalAnd:
            case BoundBinaryExpressionOperator.ConditionalOr: {
                return this.project.boolTypeDeclaration.type;
            }

            default: {
                return assertNever(operator);
            }
        }
    }

    private bindBinaryArithmeticOperationType(
        leftOperand: Types,
        operator: BoundBinaryExpressionOperator,
        rightOperand: Types,
    ) {
        const balancedType = this.getBalancedType(leftOperand, rightOperand);
        if (!balancedType) {
            throw new Error(`'${operator}' is not valid for '${leftOperand}' and '${rightOperand}'.`);
        }

        switch (balancedType.kind) {
            case TypeKind.String: {
                if (operator !== BoundBinaryExpressionOperator.Addition) {
                    throw new Error(`'${operator}' is not valid for '${leftOperand}' and '${rightOperand}'.`);
                }
                break;
            }
            case TypeKind.Int:
            case TypeKind.Float: {
                break;
            }
            default: {
                throw new Error(`'${operator}' is not valid for '${leftOperand}' and '${rightOperand}'.`);
            }
        }

        return balancedType;
    }

    private bindBitwiseOperationType(
        leftOperand: Types,
        operator: BoundBinaryExpressionOperator,
        rightOperand: Types,
    ) {
        if (!leftOperand.isConvertibleTo(this.project.intTypeDeclaration.type) ||
            !rightOperand.isConvertibleTo(this.project.intTypeDeclaration.type)
        ) {
            throw new Error(`'${operator}' is not valid for '${leftOperand}' and '${rightOperand}'.`);
        }

        return this.project.intTypeDeclaration.type;
    }

    private bindComparisonOperationType(
        leftOperand: Types,
        operator: BoundBinaryExpressionOperator,
        rightOperand: Types,
    ) {
        const balancedType = this.getBalancedType(leftOperand, rightOperand);
        if (!balancedType) {
            throw new Error(`'${operator}' is not valid for '${leftOperand}' and '${rightOperand}'.`);
        }

        switch (balancedType.kind) {
            case TypeKind.Array: {
                throw new Error(`'${operator}' is not valid for '${leftOperand}' and '${rightOperand}'.`);
            }
            case TypeKind.Bool:
            case TypeKind.Object: {
                switch (operator) {
                    case BoundBinaryExpressionOperator.Equals:
                    case BoundBinaryExpressionOperator.NotEquals: {
                        break;
                    }
                    default: {
                        throw new Error(`'${operator}' is not valid for '${leftOperand}' and '${rightOperand}'.`);
                    }
                }
                break;
            }
        }

        return this.project.boolTypeDeclaration.type;
    }

    // #endregion

    // #region Unary expression

    private bindUnaryExpression(
        parent: BoundNodes,
        expression: UnaryExpression,
        typeMap: TypeMap | undefined,
    ): BoundUnaryExpression {
        return this.unaryExpression(parent,
            this.getUnaryExpressionOperator(expression.operator.kind),
            (parent) => this.bindExpression(parent, expression.operand, typeMap),
        );
    }

    private getUnaryExpressionOperator(operatorKind: UnaryOperatorToken['kind']) {
        switch (operatorKind) {
            case TokenKind.PlusSign: { return BoundUnaryExpressionOperator.UnaryPlus; }
            case TokenKind.HyphenMinus: { return BoundUnaryExpressionOperator.UnaryMinus; }
            case TokenKind.Tilde: { return BoundUnaryExpressionOperator.BitwiseComplement; }
            case TokenKind.NotKeyword: { return BoundUnaryExpressionOperator.BooleanInverse; }
            default: { return assertNever(operatorKind); }
        }
    }

    private unaryExpression(
        parent: BoundNodes,
        operator: BoundUnaryExpressionOperator,
        getOperand: GetBoundNode<BoundExpressions>,
    ): BoundUnaryExpression {
        const boundUnaryExpression = new BoundUnaryExpression();
        boundUnaryExpression.parent = parent;
        boundUnaryExpression.operator = operator;
        boundUnaryExpression.operand = getOperand(boundUnaryExpression);

        if (operator === BoundUnaryExpressionOperator.BooleanInverse) {
            if (!this.isExplicitlyConvertible(boundUnaryExpression.operand.type, this.project.boolTypeDeclaration.type)) {
                throw new Error(`'${boundUnaryExpression.operand.type}' is not convertible to '${this.project.boolTypeDeclaration.type}'.`);
            }
        }

        boundUnaryExpression.type = this.getTypeOfUnaryExpression(
            boundUnaryExpression.operator,
            boundUnaryExpression.operand.type,
        );

        return boundUnaryExpression;
    }

    private getTypeOfUnaryExpression(
        operator: BoundUnaryExpressionOperator,
        operand: Types,
    ) {
        switch (operator) {
            case BoundUnaryExpressionOperator.UnaryPlus:
            case BoundUnaryExpressionOperator.UnaryMinus: {
                switch (operand.kind) {
                    case TypeKind.Int:
                    case TypeKind.Float: {
                        return operand;
                    }
                    default: {
                        throw new Error(`Unexpected operand type '${operand}' for unary operator '${operator}'.`);
                    }
                }
            }
            case BoundUnaryExpressionOperator.BitwiseComplement: {
                if (operand.isConvertibleTo(this.project.intTypeDeclaration.type)) {
                    return this.project.intTypeDeclaration.type;
                } else {
                    throw new Error(`Cannot get bitwise complement of '${operand}'. '${operand}' is not implicitly convertible to '${this.project.intTypeDeclaration.type}'.`);
                }
            }
            case BoundUnaryExpressionOperator.BooleanInverse: {
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
        parent: BoundNodes,
        expression: NewExpression,
        typeMap: TypeMap | undefined,
    ): BoundNewExpression {
        return this.newExpression(parent,
            (parent) => this.bindTypeReference(parent, expression.type, typeMap,
                BoundNodeKind.ExternClassDeclaration,
                BoundNodeKind.ClassDeclaration,
            ),
        );
    }

    private newExpression(
        parent: BoundNodes,
        getTypeReference: GetBoundNode<BoundExternClassDeclaration | BoundClassDeclaration>,
    ): BoundNewExpression {
        const boundNewExpression = new BoundNewExpression();
        boundNewExpression.parent = parent;
        boundNewExpression.typeReference = getTypeReference(boundNewExpression);

        const constructorGroup = boundNewExpression.typeReference.locals.get(CONSTRUCTOR_NAME,
            BoundNodeKind.ExternClassMethodGroupDeclaration,
            BoundNodeKind.ClassMethodGroupDeclaration,
        )!;
        boundNewExpression.type = constructorGroup.type;

        return boundNewExpression;
    }

    // #endregion

    // #region Null expression

    private bindNullExpression(
        parent: BoundNodes,
    ): BoundNullExpression {
        return this.nullExpression(parent);
    }

    private nullExpression(
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
        expression: BooleanLiteralExpression,
    ): BoundBooleanLiteralExpression {
        return this.booleanLiteral(parent,
            getText(expression.value, parent),
        );
    }

    private booleanLiteral(
        parent: BoundNodes,
        value: string,
    ): BoundBooleanLiteralExpression {
        const boundBooleanLiteralExpression = new BoundBooleanLiteralExpression();
        boundBooleanLiteralExpression.parent = parent;
        boundBooleanLiteralExpression.type = this.project.boolTypeDeclaration.type;
        boundBooleanLiteralExpression.value = value;

        return boundBooleanLiteralExpression;
    }

    // #endregion

    // #region Self expression

    private bindSelfExpression(
        parent: BoundNodes,
    ): BoundSelfExpression {
        return this.selfExpression(parent);
    }

    private selfExpression(
        parent: BoundNodes,
    ): BoundSelfExpression {
        const boundSelfExpression = new BoundSelfExpression();
        boundSelfExpression.parent = parent;

        const classDeclaration = BoundTreeWalker.getClosest(boundSelfExpression, BoundNodeKind.ClassDeclaration)!;
        boundSelfExpression.type = classDeclaration.type;

        return boundSelfExpression;
    }

    // #endregion

    // #region Super expression

    private bindSuperExpression(
        parent: BoundNodes,
    ): BoundSuperExpression {
        return this.superExpression(parent);
    }

    private superExpression(
        parent: BoundNodes,
    ): BoundSuperExpression {
        const boundSuperExpression = new BoundSuperExpression();
        boundSuperExpression.parent = parent;

        const classDeclaration = BoundTreeWalker.getClosest(boundSuperExpression, BoundNodeKind.ClassDeclaration)!;
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
        expression: StringLiteralExpression,
    ): BoundStringLiteralExpression {
        const { document } = BoundTreeWalker.getModule(parent).declaration;

        return this.stringLiteral(parent,
            Evaluator.evalStringLiteral(expression, document),
        );
    }

    private stringLiteral(
        parent: BoundNodes,
        value: string,
    ): BoundStringLiteralExpression {
        const boundStringLiteralExpression = new BoundStringLiteralExpression();
        boundStringLiteralExpression.parent = parent;
        boundStringLiteralExpression.type = this.project.stringTypeDeclaration.type;
        boundStringLiteralExpression.value = value;

        return boundStringLiteralExpression;
    }

    // #endregion

    // #region Float literal expression

    private bindFloatLiteralExpression(
        parent: BoundNodes,
        expression: FloatLiteralExpression,
    ): BoundFloatLiteralExpression {
        return this.floatLiteral(parent,
            getText(expression.value, parent),
        );
    }

    private floatLiteral(
        parent: BoundNodes,
        value: string,
    ): BoundFloatLiteralExpression {
        const boundFloatLiteralExpression = new BoundFloatLiteralExpression();
        boundFloatLiteralExpression.parent = parent;
        boundFloatLiteralExpression.type = this.project.floatTypeDeclaration.type;
        boundFloatLiteralExpression.value = value;

        return boundFloatLiteralExpression;
    }

    // #endregion

    // #region Integer literal expression

    private bindIntegerLiteralExpression(
        parent: BoundNodes,
        expression: IntegerLiteralExpression,
    ): BoundIntegerLiteralExpression {
        return this.integerLiteral(parent,
            getText(expression.value, parent),
        );
    }

    private integerLiteral(
        parent: BoundNodes,
        value: string,
    ): BoundIntegerLiteralExpression {
        const boundIntegerLiteralExpression = new BoundIntegerLiteralExpression();
        boundIntegerLiteralExpression.parent = parent;
        boundIntegerLiteralExpression.type = this.project.intTypeDeclaration.type;
        boundIntegerLiteralExpression.value = value;

        return boundIntegerLiteralExpression;
    }

    // #endregion

    // #region Array literal expression

    private bindArrayLiteralExpression(
        parent: BoundNodes,
        expression: ArrayLiteralExpression,
        typeMap: TypeMap | undefined,
    ): BoundArrayLiteralExpression {
        return this.arrayLiteralExpression(parent,
            (parent) => this.bindExpressionSequence(parent, expression.expressions, typeMap),
        );
    }

    private arrayLiteralExpression(
        parent: BoundNodes,
        getExpressions: GetBoundNodes<BoundExpressions>,
    ): BoundArrayLiteralExpression {
        const boundArrayLiteralExpression = new BoundArrayLiteralExpression();
        boundArrayLiteralExpression.parent = parent;
        boundArrayLiteralExpression.expressions = getExpressions(boundArrayLiteralExpression);
        boundArrayLiteralExpression.type = this.getTypeOfArrayLiteralExpression(boundArrayLiteralExpression.expressions);

        return boundArrayLiteralExpression;
    }

    private getTypeOfArrayLiteralExpression(expressions: BoundExpressions[]) {
        let type: Types;

        // TODO: `Void[]` seems to be implicitly convertible to any other array. Verify that the binder handles this correctly.
        if (!expressions.length) {
            type = this.project.voidTypeDeclaration.type;
        } else {
            type = expressions[0].type;

            for (const expression of expressions) {
                const balancedType = this.getBalancedType(type, expression.type);
                if (!balancedType) {
                    throw new Error('Array must contain a common type.');
                }

                type = balancedType;
            }
        }

        const arrayTypeDeclaration = this.instantiateArrayType(type.declaration as BoundTypeReferenceDeclaration);

        return arrayTypeDeclaration.type;
    }

    // #endregion

    // #region Global scope expression

    private bindGlobalScopeExpression(
        parent: BoundNodes,
    ): BoundGlobalScopeExpression {
        return this.globalScopeExpression(parent);
    }

    private globalScopeExpression(
        parent: BoundNodes,
    ): BoundGlobalScopeExpression {
        const boundGlobalScopeExpression = new BoundGlobalScopeExpression();
        boundGlobalScopeExpression.parent = parent;

        const boundModule = BoundTreeWalker.getModule(parent);
        boundGlobalScopeExpression.type = boundModule.type;

        return boundGlobalScopeExpression;
    }

    // #endregion

    // #region Identifier expression

    private bindIdentifierExpression(
        parent: BoundNodes,
        expression: IdentifierExpression,
        typeMap: TypeMap | undefined,
        scope?: BoundMemberContainerDeclaration,
    ): BoundIdentifierExpression | BoundInvokeExpression {
        let getTypeArguments: GetBoundNodes<BoundTypeReferenceDeclaration> | undefined = undefined;
        if (expression.typeArguments) {
            const { typeArguments } = expression;
            getTypeArguments = (parent) => this.bindTypeReferenceSequence(parent, typeArguments, typeMap);
        }

        const identifierExpression = this.identifierExpression(parent,
            (parent) => this.resolveIdentifier(
                expression.identifier,
                parent,
                scope,
                getTypeArguments,
            ),
        );
        const { declaration } = identifierExpression.identifier;

        // Fix up expressions that are ambiguous to the parser
        if (!BoundTreeWalker.isInvoked(identifierExpression)) {
            // Property getter
            switch (declaration.kind) {
                case BoundNodeKind.ExternClassMethodGroupDeclaration:
                case BoundNodeKind.ClassMethodGroupDeclaration: {
                    const args: BoundExpressions[] = [];
                    const overload = this.chooseOverloadOptional(declaration.overloads, args) as BoundClassMethodLikeDeclaration | undefined;
                    if (overload && overload.isProperty) {
                        return this.invokeExpression(parent,
                            (parent) => setParent(identifierExpression, parent),
                            () => args,
                            () => overload,
                        );
                    }
                    break;
                }
            }

            // Non-expression statement parameterless invoke expression
            switch (declaration.kind) {
                case BoundNodeKind.FunctionGroupDeclaration:
                case BoundNodeKind.ExternClassMethodGroupDeclaration:
                case BoundNodeKind.InterfaceMethodGroupDeclaration:
                case BoundNodeKind.ClassMethodGroupDeclaration: {
                    return this.invokeExpression(parent,
                        (parent) => setParent(identifierExpression, parent),
                        () => [],
                        (overloads, args) => this.chooseOverload(overloads, args),
                    );
                }
            }
        }

        return identifierExpression;
    }

    private identifierExpression(
        parent: BoundNodes,
        getDeclaration: GetBoundNode<BoundDeclarations>,
    ): BoundIdentifierExpression {
        const boundIdentifierExpression = new BoundIdentifierExpression();
        boundIdentifierExpression.parent = parent;

        const declaration = getDeclaration(boundIdentifierExpression);
        boundIdentifierExpression.identifier = declaration.identifier;

        if (declaration.kind !== BoundNodeKind.Directory) {
            boundIdentifierExpression.type = declaration.type;
        }

        return boundIdentifierExpression;
    }

    // #endregion

    // #region Grouping expression

    private bindGroupingExpression(
        parent: BoundNodes,
        expression: GroupingExpression,
        typeMap: TypeMap | undefined,
    ): BoundGroupingExpression {
        return this.groupingExpression(parent,
            (parent) => this.bindExpression(parent, expression.expression, typeMap),
        );
    }

    private groupingExpression(
        parent: BoundNodes,
        getExpression: GetBoundNode<BoundExpressions>,
    ): BoundGroupingExpression {
        const boundGroupingExpression = new BoundGroupingExpression();
        boundGroupingExpression.parent = parent;
        boundGroupingExpression.expression = getExpression(boundGroupingExpression);
        boundGroupingExpression.type = boundGroupingExpression.expression.type;

        return boundGroupingExpression;
    }

    // #endregion

    // #region Scope member access expression

    private bindScopeMemberAccessExpression(
        parent: BoundNodes,
        expression: ScopeMemberAccessExpression,
        typeMap: TypeMap | undefined,
        scope?: BoundMemberContainerDeclaration,
    ): BoundScopeMemberAccessExpression {
        return this.scopeMemberAccessExpression(parent,
            (parent) => this.bindExpression(parent, expression.scopableExpression, typeMap, scope),
            (parent, scope) => this.bindExpression(parent, expression.member, typeMap, scope),
        );
    }

    private scopeMemberAccessExpression(
        parent: BoundNodes,
        getScopableExpression: GetBoundNode<BoundExpressions>,
        getMemberExpression: (parent: BoundNodes, scope: BoundMemberContainerDeclaration) => BoundExpressions,
    ): BoundScopeMemberAccessExpression {
        const boundScopeMemberAccessExpression = new BoundScopeMemberAccessExpression();
        boundScopeMemberAccessExpression.parent = parent;
        boundScopeMemberAccessExpression.scopableExpression = getScopableExpression(boundScopeMemberAccessExpression);

        const scopableExpressionType = boundScopeMemberAccessExpression.scopableExpression.type;
        switch (scopableExpressionType.kind) {
            case TypeKind.Module:
            case TypeKind.String:
            case TypeKind.Array:
            case TypeKind.Object: {
                boundScopeMemberAccessExpression.member = getMemberExpression(boundScopeMemberAccessExpression, scopableExpressionType.declaration);
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
        parent: BoundNodes,
        expression: IndexExpression,
        typeMap: TypeMap | undefined,
        scope?: BoundMemberContainerDeclaration,
    ): BoundIndexExpression {
        return this.indexExpression(parent,
            (parent) => this.bindExpression(parent, expression.indexableExpression, typeMap, scope),
            (parent) => this.bindExpression(parent, expression.indexExpressionExpression, typeMap),
        );
    }

    private indexExpression(
        parent: BoundNodes,
        getIndexableExpression: GetBoundNode<BoundExpressions>,
        getIndexExpressionExpression: GetBoundNode<BoundExpressions>,
    ): BoundIndexExpression {
        const boundIndexExpression = new BoundIndexExpression();
        boundIndexExpression.parent = parent;
        boundIndexExpression.indexableExpression = getIndexableExpression(boundIndexExpression);
        boundIndexExpression.indexExpressionExpression = getIndexExpressionExpression(boundIndexExpression);

        if (!boundIndexExpression.indexExpressionExpression.type.isConvertibleTo(this.project.intTypeDeclaration.type)) {
            throw new Error(`Index expression is '${boundIndexExpression.indexExpressionExpression.type}' but must be '${this.project.intTypeDeclaration.type}'.`);
        }

        boundIndexExpression.type = this.getTypeOfIndexExpression(boundIndexExpression.indexableExpression.type);

        return boundIndexExpression;
    }

    private getTypeOfIndexExpression(indexableExpression: Types) {
        switch (indexableExpression.kind) {
            case TypeKind.String: {
                return this.project.intTypeDeclaration.type;
            }
            case TypeKind.Array: {
                return indexableExpression.elementType.type;
            }
            default: {
                throw new Error(`Expressions of type '${indexableExpression}' cannot be accessed by index.`);
            }
        }

    }

    // #endregion

    // #region Slice expression

    private bindSliceExpression(
        parent: BoundNodes,
        expression: SliceExpression,
        typeMap: TypeMap | undefined,
        scope?: BoundMemberContainerDeclaration,
    ): BoundSliceExpression {
        let getStartExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (expression.startExpression) {
            const { startExpression } = expression;
            getStartExpression = (parent) => this.bindExpression(parent, startExpression, typeMap);
        }

        let getEndExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (expression.endExpression) {
            const { endExpression } = expression;
            getEndExpression = (parent) => this.bindExpression(parent, endExpression, typeMap);
        }

        return this.sliceExpression(parent,
            (parent) => this.bindExpression(parent, expression.sliceableExpression, typeMap, scope),
            getStartExpression,
            getEndExpression,
        );
    }

    private sliceExpression(
        parent: BoundNodes,
        getSliceableExpression: GetBoundNode<BoundExpressions>,
        getStartExpression?: GetBoundNode<BoundExpressions>,
        getEndExpression?: GetBoundNode<BoundExpressions>,
    ): BoundSliceExpression {
        const boundSliceExpression = new BoundSliceExpression();
        boundSliceExpression.parent = parent;
        boundSliceExpression.sliceableExpression = getSliceableExpression(boundSliceExpression);

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

        if (getStartExpression) {
            boundSliceExpression.startExpression = getStartExpression(boundSliceExpression);
            if (!boundSliceExpression.startExpression.type.isConvertibleTo(this.project.intTypeDeclaration.type)) {
                throw new Error(`Start index expression is '${boundSliceExpression.startExpression.type}' but must be '${this.project.intTypeDeclaration.type}'.`)
            }
        }

        if (getEndExpression) {
            boundSliceExpression.endExpression = getEndExpression(boundSliceExpression);
            if (!boundSliceExpression.endExpression.type.isConvertibleTo(this.project.intTypeDeclaration.type)) {
                throw new Error(`End index expression is '${boundSliceExpression.endExpression.type}' but must be '${this.project.intTypeDeclaration.type}'.`)
            }
        }

        return boundSliceExpression;
    }

    // #endregion

    // #region Invoke expression

    private bindInvokeExpression(
        parent: BoundNodes,
        expression: InvokeExpression,
        typeMap: TypeMap | undefined,
        scope?: BoundMemberContainerDeclaration,
    ): BoundInvokeExpression | BoundCastExpression {
        const boundInvokeExpression = new BoundInvokeExpression();
        boundInvokeExpression.parent = parent;

        const invocableExpression = this.bindExpression(boundInvokeExpression, expression.invocableExpression, typeMap, scope);

        switch (invocableExpression.type.kind) {
            case TypeKind.FunctionGroup:
            case TypeKind.MethodGroup: {
                return this.invokeExpression(parent,
                    (parent) => setParent(invocableExpression, parent),
                    (parent) => this.bindExpressionSequence(parent, expression.arguments, typeMap),
                    (overloads, args) => this.chooseOverload(overloads, args),
                );
            }
            case TypeKind.Bool:
            case TypeKind.Int:
            case TypeKind.Float:
            case TypeKind.String:
            case TypeKind.Object: {
                return this.bindCastExpression(parent, invocableExpression, expression.arguments, typeMap);
            }
            default: {
                throw new Error(`Cannot invoke an expression of type '${invocableExpression.type.kind}'.`);
            }
        }
    }

    private bindCastExpression(
        parent: BoundNodes,
        invocableExpression: BoundExpressions,
        args: (Expressions | MissingToken | CommaSeparator)[],
        typeMap: TypeMap | undefined,
    ): BoundCastExpression {
        const boundCastExpression = new BoundCastExpression();
        boundCastExpression.parent = parent;
        invocableExpression.parent = boundCastExpression;
        boundCastExpression.invocableExpression = invocableExpression;

        const boundArgs = this.bindExpressionSequence(boundCastExpression, args, typeMap);
        if (boundArgs.length !== 1) {
            throw new Error(`Cast expressions require exactly 1 parameter.`);
        }

        const boundArg = boundArgs[0];
        if (!this.isExplicitlyConvertible(boundArg.type, invocableExpression.type)) {
            throw new Error(`'${boundArg.type}' is not convertible to '${invocableExpression.type}'.`);
        }

        boundCastExpression.argument = boundArg;
        boundCastExpression.type = invocableExpression.type;

        return boundCastExpression;
    }

    private invokeExpression(
        parent: BoundNodes,
        getInvocableExpression: GetBoundNode<BoundExpressions>,
        getArguments: GetBoundNodes<BoundExpressions>,
        getOverload: (overloads: BoundFunctionLikeGroupDeclaration['overloads'], args: BoundExpressions[]) => BoundFunctionLikeDeclaration,
    ): BoundInvokeExpression {
        const boundInvokeExpression = new BoundInvokeExpression();
        boundInvokeExpression.parent = parent;
        boundInvokeExpression.invocableExpression = getInvocableExpression(boundInvokeExpression);

        const { type } = boundInvokeExpression.invocableExpression;
        switch (type.kind) {
            case TypeKind.FunctionGroup:
            case TypeKind.MethodGroup: {
                const args = getArguments(boundInvokeExpression);
                boundInvokeExpression.overload = getOverload(type.declaration.overloads, args);
                boundInvokeExpression.arguments = this.applyDefaultParameters(args, boundInvokeExpression.overload.parameters)
                boundInvokeExpression.type = boundInvokeExpression.overload.returnType.type;
                break;
            }
            default: {
                throw new Error(`Cannot invoke an expression of type '${type.kind}'.`);
            }
        }

        return boundInvokeExpression;
    }

    private chooseOverload(
        overloads: BoundFunctionLikeGroupDeclaration['overloads'],
        args: BoundExpressions[],
    ): BoundFunctionLikeDeclaration {
        const overload = this.chooseOverloadOptional(overloads, args);
        if (overload) {
            return overload;
        }

        let name: string = undefined!;
        const overloadStrs: string[] = [''];

        for (const [, overload] of overloads) {
            name = overload.identifier.name;
            overloadStrs.push(overload.type.toString());
        }

        const nameWithArgs = `${name}(${args.map(a => a.type).join(',')})`;

        throw new Error(`A matching overload could not be found for ${nameWithArgs}.${overloadStrs.join('\n')}`);
    }

    private chooseOverloadOptional(
        overloads: BoundFunctionLikeGroupDeclaration['overloads'],
        args: BoundExpressions[],
    ): BoundFunctionLikeDeclaration | undefined {
        // Search for an exact match (cannot use default parameters)
        for (const [, overload] of overloads) {
            if (isExactMatch(overload)) {
                return overload;
            }
        }

        let candidates: BoundFunctionLikeDeclaration[] = [];

        // Search for exactly one match with implicit conversions allowed
        for (const [, overload] of overloads) {
            if (isMatch(overload)) {
                candidates.push(overload);
            }
        }

        switch (candidates.length) {
            case 0: { return; }
            case 1: { return candidates[0]; }
            default: {
                throw new Error(`Multiple overloads matched invoke expression (${candidates.map(c => c.type).join(', ')}).`);
            }
        }

        function isExactMatch(overload: BoundFunctionLikeDeclaration): boolean {
            if (overload.parameters.length < args.length) {
                return false;
            }

            for (let i = 0; i < overload.parameters.length; i++) {
                const param = overload.parameters[i];
                const arg = args[i];

                if (arg) {
                    if (arg.kind === BoundNodeKind.PlaceholderExpression ||
                        arg.type !== param.type
                    ) {
                        return false;
                    }
                } else {
                    // Trailing default parameters still counts as an "exact" match
                    if (!param.expression) {
                        return false;
                    }
                }
            }

            return true;
        }

        function isMatch(overload: BoundFunctionLikeDeclaration): boolean {
            if (overload.parameters.length < args.length) {
                return false;
            }

            for (let i = 0; i < overload.parameters.length; i++) {
                const param = overload.parameters[i];
                const arg = args[i];

                if (!(
                    arg && arg.type.isConvertibleTo(param.type) ||
                    param.expression
                )) {
                    return false;
                }
            }

            return true;
        }
    }

    private applyDefaultParameters(args: BoundExpressions[], params: BoundDataDeclaration[]): BoundExpressions[] {
        const argsWithDefaults: BoundExpressions[] = [];

        // Copy in default parameters
        for (let i = 0; i < params.length; i++) {
            const param = params[i];
            const arg = args[i];

            if (!arg || arg.kind === BoundNodeKind.PlaceholderExpression) {
                if (param.expression) {
                    // TODO: Should the expression be cloned?
                    argsWithDefaults[i] = param.expression;
                    continue;
                } else {
                    // Should be unreachable as the correct overload is selected before this function is called.
                    throw new Error(`'${param.identifier.name}' does not have a default.`);
                }
            }

            argsWithDefaults[i] = args[i];
        }

        return argsWithDefaults;
    }

    private invokeSpecialMethod(
        parent: BoundNodes,
        instanceVariable_collectionExpression: BoundDataDeclaration | BoundExpressions,
        methodName: string,
        checkReturnType?: (returnType: Types) => boolean,
        ...args: BoundExpressions[]
    ): BoundInvokeExpression {
        const methodContainer = instanceVariable_collectionExpression.type.declaration;
        if (!isMethodContainer(methodContainer)) {
            throw new Error(`'${methodContainer.identifier.name}' does not have member '${methodName}'.`);
        }

        const overload = BoundTreeWalker.getSpecialMethod(methodContainer, methodName, checkReturnType, ...args.map((arg) => arg.type));
        if (!overload) {
            throw new Error(`'${methodContainer.identifier.name}' does not have member '${methodName}'.`);
        }

        const boundInvokeExpression = new BoundInvokeExpression();
        boundInvokeExpression.parent = parent;

        if (instanceVariable_collectionExpression.kind === BoundNodeKind.DataDeclaration) {
            boundInvokeExpression.invocableExpression = this.scopeMemberAccessExpression(boundInvokeExpression,
                (parent) => this.identifierExpression(parent,
                    () => instanceVariable_collectionExpression,
                ),
                (parent) => this.identifierExpression(parent,
                    () => overload.parent as BoundMethodGroupDeclaration,
                ),
            );
        } else {
            boundInvokeExpression.invocableExpression = this.scopeMemberAccessExpression(boundInvokeExpression,
                (parent) => setParent(instanceVariable_collectionExpression, parent),
                (parent) => this.identifierExpression(parent,
                    () => overload.parent as BoundMethodGroupDeclaration,
                ),
            );
        }

        boundInvokeExpression.arguments = args;
        boundInvokeExpression.overload = overload;
        boundInvokeExpression.type = overload.returnType.type;

        return boundInvokeExpression;
    }

    // #endregion

    private bindExpressionSequence(
        parent: BoundNodes,
        expressions: (Expressions | MissingToken | CommaSeparator)[],
        typeMap: TypeMap | undefined,
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
                    const boundExpression = this.bindExpression(parent, expression, typeMap);
                    boundExpressions.push(boundExpression);
                    break;
                }

                case TokenKind.Missing: {
                    const placeholderExpression = new BoundPlaceholderExpression();
                    placeholderExpression.parent = parent;
                    placeholderExpression.type = new DeferredType();

                    boundExpressions.push(placeholderExpression);
                    break;
                }

                case NodeKind.CommaSeparator: { break; }

                default: {
                    assertNever(expression);
                    break;
                }
            }
        }

        return boundExpressions;
    }

    // #endregion

    // #region Type resolution

    private bindTypeAnnotation(
        node: BoundNodes,
        typeAnnotation: TypeAnnotation | undefined,
        typeMap?: TypeMap,
    ) {
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
                return this.bindTypeReference(node, typeAnnotation.typeReference, typeMap);
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

    private bindTypeReferenceSequence<TKind extends BoundTypeReferenceDeclaration['kind']>(
        node: BoundNodes,
        typeReferenceSequence: (TypeReference | CommaSeparator)[],
        typeMap: TypeMap | undefined,
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind][] {
        const boundTypeReferences: BoundNodeKindToBoundNodeMap[TKind][] = [];

        for (const typeReference of typeReferenceSequence) {
            switch (typeReference.kind) {
                case NodeKind.TypeReference: {
                    const boundTypeReference = this.bindTypeReference(node, typeReference, typeMap, ...kinds);
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

    private bindTypeReference<TKind extends BoundTypeReferenceDeclaration['kind']>(
        node: BoundNodes,
        typeReference: TypeReference | MissingToken,
        typeMap: TypeMap | undefined,
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind] {
        if (typeReference.kind === TokenKind.Missing) {
            throw new Error('Type reference is missing.');
        }

        if (typeMap && kinds.length) {
            kinds = [
                ...kinds,
                BoundNodeKind.TypeParameter,
            ] as TKind[];
        }

        let boundDeclaration: BoundTypeReferenceDeclaration = this.resolveTypeReference(node, typeReference, kinds);

        if (typeReference.typeArguments) {
            if (boundDeclaration.kind !== BoundNodeKind.ClassDeclaration) {
                throw new Error(`'${boundDeclaration.kind}' cannot be generic.`);
            }

            const boundTypeArguments = this.bindTypeReferenceSequence(node, typeReference.typeArguments, typeMap);
            boundDeclaration = this.instantiateGenericType(boundDeclaration, boundTypeArguments);
        } else if (typeMap) {
            switch (boundDeclaration.kind) {
                case BoundNodeKind.ClassDeclaration: {
                    if (boundDeclaration.declaration.typeParameters) {
                        const boundTypeArguments = Array.from(typeMap.values());
                        boundDeclaration = this.instantiateGenericType(boundDeclaration, boundTypeArguments);
                    }
                    break;
                }
                case BoundNodeKind.TypeParameter: {
                    boundDeclaration = typeMap.get(boundDeclaration);
                    break;
                }
            }
        }

        for (const { } of typeReference.arrayTypeAnnotations) {
            boundDeclaration = this.instantiateArrayType(boundDeclaration);
        }

        if (kinds.length &&
            !kinds.some((kind) => kind === boundDeclaration.kind)
        ) {
            throw new Error(`Expected '${boundDeclaration.identifier.name}' to be '${kinds.join(', ')}' but got '${boundDeclaration.kind}'.`);
        }

        return boundDeclaration;
    }

    private resolveTypeReference<TKind extends BoundTypeReferenceDeclaration['kind']>(
        node: BoundNodes,
        typeReference: TypeReference,
        kinds: TKind[],
    ): BoundNodeKindToBoundNodeMap[TKind] {
        let identifier: TypeReferenceIdentifier | IdentifierToken | IdentifierTokens | MissingToken = typeReference.identifier;

        switch (identifier.kind) {
            case TokenKind.VoidKeyword: { return this.project.voidTypeDeclaration; }
            case TokenKind.BoolKeyword: { return this.project.boolTypeDeclaration; }
            case TokenKind.IntKeyword: { return this.project.intTypeDeclaration; }
            case TokenKind.FloatKeyword: { return this.project.floatTypeDeclaration; }
            case TokenKind.StringKeyword: { return this.project.stringTypeDeclaration; }
            case TokenKind.Missing: {
                throw new Error(`Type reference identifier is missing.`);
            }
        }

        if (identifier.kind === NodeKind.EscapedIdentifier) {
            identifier = identifier.name;
        }

        const name = getText(identifier, node);

        // Module is specified
        if (typeReference.moduleIdentifier) {
            const moduleName = getText(typeReference.moduleIdentifier, node);
            const importedModule = this.resolveIdentifierName(
                moduleName,
                node,
                /*scope*/ undefined,
                /*getTypeArguments*/ undefined,
                BoundNodeKind.ModuleDeclaration,
            );
            if (!importedModule) {
                throw new Error(`The '${moduleName}' module is not imported.`);
            }

            const boundDeclaration = this.resolveIdentifierName(
                name,
                importedModule,
                /*scope*/ undefined,
                /*getTypeArguments*/ undefined,
                ...kinds
            );
            if (!boundDeclaration) {
                throw new Error(`Could not find '${name}' in '${moduleName}'.`);
            }

            return boundDeclaration;
        }

        const boundDeclaration = this.resolveIdentifierName(
            name,
            node,
            /*scope*/ undefined,
            /*getTypeArguments*/ undefined,
            ...kinds
        );
        if (!boundDeclaration) {
            throw new Error(`Could not find '${name}'.`);
        }

        if (kinds.length) {
            if (!kinds.some((kind) => boundDeclaration.kind === kind)) {
                throw new Error(`Expected '${name}' to be '${kinds.join(', ')}' but got '${boundDeclaration.kind}'.`);
            }
        }

        return boundDeclaration;
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

    private isExplicitlyConvertible(from: Types, to: Types) {
        if (from.isConvertibleTo(to)) { return true; }

        switch (from.kind) {
            case TypeKind.Int:
            case TypeKind.Float:
            case TypeKind.Array: {
                return to.kind === TypeKind.Bool;
            }
            case TypeKind.String: {
                switch (to.kind) {
                    case TypeKind.Bool:
                    case TypeKind.Int:
                    case TypeKind.Float: {
                        return true;
                    }
                }
                break;
            }
            case TypeKind.Null:
            case TypeKind.Object: {
                if (to.kind === TypeKind.Bool) { return true; }

                switch (to.declaration.kind) {
                    case BoundNodeKind.ExternClassDeclaration:
                    case BoundNodeKind.ClassDeclaration: {
                        let ancestor: BoundExternClassDeclaration | BoundClassDeclaration | undefined = to.declaration;
                        while (ancestor) {
                            if (from.declaration === ancestor) {
                                return true;
                            }

                            ancestor = ancestor.superType;
                        }
                        break;
                    }
                }
                break;
            }
        }

        return false;
    }

    // #endregion

    // #region Generics

    @traceInstantiating(BoundNodeKind.ExternClassDeclaration)
    private instantiateArrayType(elementType: BoundTypeReferenceDeclaration): BoundExternClassDeclaration {
        let instantiatedType = this.project.arrayTypeCache.get(elementType);
        if (instantiatedType) {
            return instantiatedType;
        }

        const openType = this.project.arrayTypeDeclaration;

        instantiatedType = new BoundExternClassDeclaration();
        this.project.arrayTypeCache.set(elementType, instantiatedType);
        instantiatedType.declaration = openType.declaration;
        instantiatedType.parent = openType.parent;
        instantiatedType.identifier = new BoundSymbol(openType.identifier.name, instantiatedType);
        instantiatedType.type = new ArrayType(instantiatedType, elementType);
        instantiatedType.superType = openType.superType; // Probably should be deferred but ends up working out because of default
        instantiatedType.nativeSymbol = openType.nativeSymbol;

        this.bindExternClassDeclarationMembers(instantiatedType, openType.declaration.members);

        // TODO: This doesn't seem to be the way Monkey X does it. Investigate differences and align implementations if necessary.
        const fixResizeMethodReturnType = () => {
            const resizeMethod = BoundTreeWalker.getSpecialMethod(
                instantiatedType!,
                'Resize',
                (returnType) => returnType.kind === TypeKind.Array && returnType.elementType.type.kind === TypeKind.Int,
                this.project.intTypeDeclaration.type,
            )!;
            resizeMethod.returnType = instantiatedType!;
        };
        deferOrExecute(this.bindTypeReferencesCallbackList, fixResizeMethodReturnType);

        return instantiatedType;
    }

    private createTypeMap(
        typeParameters: BoundTypeParameter[],
        typeArguments: BoundTypeReferenceDeclaration[],
    ): TypeMap {
        if (typeParameters.length !== typeArguments.length) {
            throw new Error(`Wrong number of type arguments (expected: ${typeParameters.length}, got: ${typeArguments.length}).`);
        }

        const typeMap = new TypeMap();

        for (let i = 0; i < typeParameters.length; i++) {
            typeMap.set(typeParameters[i], typeArguments[i]);
        }

        return typeMap;
    }

    @traceInstantiating(BoundNodeKind.ClassDeclaration)
    private instantiateGenericType(
        openType: BoundClassDeclaration,
        typeArguments: BoundTypeReferenceDeclaration[],
    ): BoundClassDeclaration {
        if (!openType.declaration.typeParameters) {
            throw new Error(`'${openType.identifier.name}' is not generic.`);
        }

        let rootType = openType;
        while (rootType.openType) {
            rootType = rootType.openType;
        }

        const instantiatedTypes = rootType.instantiatedTypes!;

        for (const instantiatedType of instantiatedTypes) {
            if (areElementsSame(typeArguments, instantiatedType.typeArguments!,
                (typeArgument, instantiatedTypeTypeArgument) => typeArgument === instantiatedTypeTypeArgument,
            )) {
                return instantiatedType;
            }
        }

        const instantiatedType = new BoundClassDeclaration();
        instantiatedType.declaration = openType.declaration;
        instantiatedType.openType = openType;
        instantiatedType.parent = openType.parent;
        instantiatedType.type = new ObjectType(instantiatedType);
        instantiatedType.identifier = new BoundSymbol(openType.identifier.name, instantiatedType);
        instantiatedType.typeParameters = this.bindTypeParameters(instantiatedType, openType.declaration.typeParameters);
        instantiatedType.typeArguments = typeArguments;
        instantiatedTypes.push(instantiatedType);

        if (typeArguments.some((typeArgument) => typeArgument.kind !== BoundNodeKind.TypeParameter)) {
            // TODO: Need to map through whole chain?
            const typeMap = this.createTypeMap(instantiatedType.typeParameters, typeArguments);
            this.bindClassDeclaration2(instantiatedType, typeMap);
        }

        return instantiatedType;
    }

    // #endregion

    // #region Symbols

    private resolveIdentifier<TKind extends BoundDeclarations['kind']>(
        identifier: IdentifierExpressionIdentifier,
        node: BoundNodes,
        scope?: BoundMemberContainerDeclaration,
        getTypeArguments?: GetBoundNodes<BoundTypeReferenceDeclaration>,
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind] {
        if (scope) {
            switch (identifier.kind) {
                // TODO: Is this caught by the parser?
                case TokenKind.BoolKeyword:
                case TokenKind.IntKeyword:
                case TokenKind.FloatKeyword:
                case TokenKind.StringKeyword: {
                    throw new Error(`'${identifier.kind}' is a reserved keyword.`);
                }
            }
        } else {
            switch (identifier.kind) {
                case TokenKind.BoolKeyword: { return this.project.boolTypeDeclaration; }
                case TokenKind.IntKeyword: { return this.project.intTypeDeclaration; }
                case TokenKind.FloatKeyword: { return this.project.floatTypeDeclaration; }
                case TokenKind.StringKeyword: { return this.project.stringTypeDeclaration; }
            }
        }

        const name = getText(identifier, node);

        return this.resolveIdentifierName(name, node, scope, getTypeArguments, ...kinds);
    }

    private resolveIdentifierName<TKind extends BoundDeclarations['kind']>(
        name: string,
        node: BoundNodes,
        scope?: BoundMemberContainerDeclaration,
        getTypeArguments?: GetBoundNodes<BoundTypeReferenceDeclaration>,
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind] {
        let boundDeclaration: BoundDeclarations | undefined;

        if (scope) {
            boundDeclaration = this.resolveIdentifierNameOnScope(name, scope, kinds);
            if (!boundDeclaration) {
                throw new Error(`'${name}' does not exist on '${scope.identifier.name}'.`);
            }

            return boundDeclaration;
        } else {
            boundDeclaration = this.resolveIdentifierNameFromNode(name, node, kinds);
            if (!boundDeclaration) {
                throw new Error(`Could not find '${name}'.`);
            }
        }

        // Cast expression
        if (getTypeArguments) {
            if (boundDeclaration.kind !== BoundNodeKind.ClassDeclaration ||
                !boundDeclaration.declaration.typeParameters
            ) {
                throw new Error(`'${name}' is not a generic class.`);
            }

            const typeArguments = getTypeArguments(node);
            boundDeclaration = this.instantiateGenericType(boundDeclaration, typeArguments);
        }

        return boundDeclaration;
    }

    private resolveIdentifierNameFromNode<TKind extends BoundDeclarations['kind']>(
        name: string,
        node: BoundNodes,
        kinds: TKind[],
    ): BoundNodeKindToBoundNodeMap[TKind] | undefined {
        let scope: Scope | undefined;
        if (this.isScope(node)) {
            scope = node;
        } else {
            scope = this.getScope(node);
        }

        while (scope) {
            const boundDeclaration = this.resolveIdentifierNameOnScope(name, scope, kinds);
            if (boundDeclaration) {
                return boundDeclaration;
            }

            switch (scope.kind) {
                case BoundNodeKind.ModuleDeclaration: {
                    const boundDeclarations: BoundNodeKindToBoundNodeMap[TKind][] = [];

                    for (const importedModule of BoundTreeWalker.getImportedModules(scope)) {
                        const boundDeclaration = this.resolveIdentifierNameOnScope(name, importedModule, kinds);
                        if (boundDeclaration) {
                            boundDeclarations.push(boundDeclaration);
                        }
                    }

                    if (boundDeclarations.length === 1) {
                        return boundDeclarations[0];
                    } else if (boundDeclarations.length > 1) {
                        // TODO: Verify how this is supposed to work
                        if (boundDeclarations.every((boundDeclaration) =>
                            boundDeclarations[0] === boundDeclaration)
                        ) {
                            return boundDeclarations[0];
                        }

                        throw new Error(`Multiple declarations found for '${name}'.`);
                    }
                    break;
                }
            }

            scope = this.getScope(scope);
        }
    }

    private resolveIdentifierNameOnScope<TKind extends BoundDeclarations['kind']>(
        name: string,
        scope: Scope,
        kinds: TKind[],
    ): BoundNodeKindToBoundNodeMap[TKind] | undefined {
        const boundDeclaration = scope.locals.get(name, ...kinds);
        if (boundDeclaration) {
            return boundDeclaration;
        }

        switch (scope.kind) {
            case BoundNodeKind.ExternClassDeclaration:
            case BoundNodeKind.ClassDeclaration: {
                if (scope.superType) {
                    const boundDeclaration = this.resolveIdentifierNameOnScope(name, scope.superType, kinds);
                    if (boundDeclaration) {
                        return boundDeclaration;
                    }
                }
                break;
            }
            case BoundNodeKind.InterfaceDeclaration: {
                if (scope.implementedTypes) {
                    for (const implementedType of scope.implementedTypes) {
                        const boundDeclaration = this.resolveIdentifierNameOnScope(name, implementedType, kinds);
                        if (boundDeclaration) {
                            return boundDeclaration;
                        }
                    }
                }
                break;
            }
        }
    }

    private getScope(node: BoundNodes): Scope | undefined {
        let ancestor = node.parent;

        while (ancestor) {
            if (this.isScope(ancestor)) {
                return ancestor;
            }

            ancestor = ancestor.parent;
        }
    }

    private isScope(node: BoundNodes): node is Scope {
        switch (node.kind) {
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
                return true;
            }
        }

        return false;
    }

    // #endregion
}

function deferOrExecute(list: (() => void)[] | undefined, callback: (() => void)) {
    if (list) {
        list.push(callback);
    } else {
        callback();
    }
}

type GetBoundNode<TBoundNode extends BoundNodes> = (parent: BoundNodes) => TBoundNode;
type GetBoundNodes<TBoundNode extends BoundNodes> = (parent: BoundNodes) => TBoundNode[];

function setParent<TNode extends BoundNodes>(node: TNode, parent: BoundNodes): TNode {
    node.parent = parent;

    return node;
}

class TypeMap extends Map<BoundTypeReferenceDeclaration, BoundTypeReferenceDeclaration> {
    get(key: BoundTypeReferenceDeclaration): BoundTypeReferenceDeclaration {
        if (key.kind === BoundNodeKind.TypeParameter) {
            const value = super.get(key);
            if (!value) {
                throw new Error(`Mapping does not exist for '${key.identifier.name}'.`);
            }

            return value;
        }

        return key;
    }
}

export type Scope =
    Exclude<
        Extract<
            BoundNodes,
            { locals: BoundSymbolTable; }
        >,
        BoundDirectory
    >;

type BoundMemberContainerDeclaration =
    | BoundModuleDeclaration
    | BoundExternClassDeclaration
    | BoundInterfaceDeclaration
    | BoundClassDeclaration
    ;

function isBoundMemberContainerDeclaration(node: BoundNodes): node is BoundMemberContainerDeclaration {
    switch (node.kind) {
        case BoundNodeKind.ModuleDeclaration:
        case BoundNodeKind.ExternClassDeclaration:
        case BoundNodeKind.InterfaceDeclaration:
        case BoundNodeKind.ClassDeclaration: {
            return true;
        }
    }

    return false;
}
