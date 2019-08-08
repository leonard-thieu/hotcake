import { traceBindingPhase1, traceBindingPhase2, traceInstantiating } from '../Diagnostics';
import { Evaluator } from '../Evaluator';
import { Project } from '../Project';
import { CommaSeparator } from '../Syntax/Node/CommaSeparator';
import { ClassDeclaration, ClassDeclarationMember, ClassMethodDeclaration } from '../Syntax/Node/Declaration/ClassDeclaration';
import { DataDeclaration, DataDeclarationKeywordToken, DataDeclarationSequence } from '../Syntax/Node/Declaration/DataDeclarationSequence';
import { ExternClassDeclaration, ExternClassDeclarationMember, ExternClassMethodDeclaration } from '../Syntax/Node/Declaration/ExternDeclaration/ExternClassDeclaration';
import { ExternDataDeclaration, ExternDataDeclarationKeywordToken, ExternDataDeclarationSequence } from '../Syntax/Node/Declaration/ExternDeclaration/ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from '../Syntax/Node/Declaration/ExternDeclaration/ExternFunctionDeclaration';
import { FunctionDeclaration } from '../Syntax/Node/Declaration/FunctionDeclaration';
import { ImportStatement } from '../Syntax/Node/Declaration/ImportStatement';
import { InterfaceDeclaration, InterfaceDeclarationMember, InterfaceMethodDeclaration } from '../Syntax/Node/Declaration/InterfaceDeclaration';
import { ModuleDeclaration, ModuleDeclarationHeaderMember, ModuleDeclarationMember } from '../Syntax/Node/Declaration/ModuleDeclaration';
import { TypeParameter } from '../Syntax/Node/Declaration/TypeParameter';
import { ArrayLiteralExpression } from '../Syntax/Node/Expression/ArrayLiteralExpression';
import { BinaryExpression, BinaryExpressionOperatorToken } from '../Syntax/Node/Expression/BinaryExpression';
import { BooleanLiteralExpression } from '../Syntax/Node/Expression/BooleanLiteralExpression';
import { MissableExpression } from '../Syntax/Node/Expression/Expressions';
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
import { MissableIdentifier } from '../Syntax/Node/Identifier';
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
import { MissableTypeReference, TypeReference } from '../Syntax/Node/TypeReference';
import { MissableToken } from '../Syntax/Token/MissingToken';
import { SkippedToken } from '../Syntax/Token/SkippedToken';
import { ColonEqualsSignToken, EqualsSignToken, NewKeywordToken, TokenKind } from '../Syntax/Token/Tokens';
import { assertNever } from '../util';
import { ANONYMOUS_NAME, areIdentifiersSame, BoundIdentifiableDeclaration, BoundSymbol, BoundSymbolTable } from './BoundSymbol';
import { BoundNodeKind, BoundNodeKindToBoundNodeMap, BoundNodes } from './Node/BoundNodes';
import { BoundClassDeclaration, BoundClassDeclarationMember, BoundClassMethodDeclaration } from './Node/Declaration/BoundClassDeclaration';
import { BoundDataDeclaration } from './Node/Declaration/BoundDataDeclaration';
import { BoundDeclarations, BoundTypeReferenceDeclaration } from './Node/Declaration/BoundDeclarations';
import { BoundDirectory } from './Node/Declaration/BoundDirectory';
import { BoundFunctionDeclaration } from './Node/Declaration/BoundFunctionDeclaration';
import { BoundClassMethodGroupDeclaration, BoundExternClassMethodGroupDeclaration, BoundExternFunctionGroupDeclaration, BoundFunctionGroupDeclaration, BoundFunctionLikeGroupDeclaration, BoundInterfaceMethodGroupDeclaration, BoundMethodGroupDeclaration } from './Node/Declaration/BoundFunctionLikeGroupDeclaration';
import { BoundInterfaceDeclaration, BoundInterfaceMethodDeclaration } from './Node/Declaration/BoundInterfaceDeclaration';
import { BoundModuleDeclaration } from './Node/Declaration/BoundModuleDeclaration';
import { BoundTypeParameter } from './Node/Declaration/BoundTypeParameter';
import { BoundExternClassDeclaration, BoundExternClassDeclarationMember, BoundExternClassMethodDeclaration } from './Node/Declaration/Extern/BoundExternClassDeclaration';
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
import { TypeParameterType } from './Type/TypeParameterType';
import { DefaultableType, TypeKind, Types } from './Type/Types';

export class Binder {
    // Debugging aid
    private filePath: string = undefined!;

    private document: string = undefined!;
    project: Project = undefined!;
    private phase: 1 | 2 = undefined!;
    private functionLikeGroupList: BoundFunctionLikeGroupDeclaration[] = undefined!;
    private bindDataDeclarationInitializerList: (() => void)[] = undefined!;
    private module: BoundModuleDeclaration = undefined!;

    bind(
        moduleDeclaration: ModuleDeclaration,
        project: Project,
        moduleDirectory: BoundDirectory,
        moduleName: string,
    ): BoundModuleDeclaration {
        this.filePath = moduleDeclaration.filePath.substr(0, moduleDeclaration.filePath.lastIndexOf('.'));

        this.document = moduleDeclaration.document;
        this.project = project;

        return this.bindModuleDeclaration(moduleDirectory, moduleName, moduleDeclaration, project);
    }

    // #region Declarations

    // #region Module declaration

    @traceBindingPhase1(BoundNodeKind.ModuleDeclaration)
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

        this.module = boundModuleDeclaration;
        this.project.cacheModule(boundModuleDeclaration);
        const monkeyModule = this.project.importModuleFromSource(boundModuleDeclaration.directory, ['monkey'], 'lang');
        this.module.importedModules.add(monkeyModule);

        this.bindModuleDeclarationHeaderMembers(moduleDeclaration.headerMembers);

        // Phase 1: Binds member declarations
        // - Does not resolve any references
        this.phase = 1;
        this.functionLikeGroupList = [];
        this.bindDataDeclarationInitializerList = [];
        this.bindModuleDeclarationMembers(boundModuleDeclaration, moduleDeclaration.members);

        // Phase 1.5: Bind parameters and return types for function-likes
        // - Makes overload resolution possible
        // - Depends on types being resolvable (satisfied by phase 1)
        for (const functionLikeGroup of this.functionLikeGroupList) {
            switch (functionLikeGroup.kind) {
                case BoundNodeKind.ExternFunctionGroupDeclaration: {
                    for (const [externFunctionDeclaration, boundExternFunctionDeclaration] of functionLikeGroup.overloads) {
                        boundExternFunctionDeclaration.returnType = this.bindTypeAnnotation(boundExternFunctionDeclaration, externFunctionDeclaration.returnType);
                        boundExternFunctionDeclaration.parameters = this.bindDataDeclarationSequence(boundExternFunctionDeclaration, externFunctionDeclaration.parameters);
                    }
                    break;
                }
                case BoundNodeKind.ExternClassMethodGroupDeclaration: {
                    for (const [externClassMethodDeclaration, boundExternClassMethodDeclaration] of functionLikeGroup.overloads) {
                        if (!externClassMethodDeclaration) {
                            continue;
                        }

                        if (areIdentifiersSame('New', boundExternClassMethodDeclaration.identifier.name)) {
                            boundExternClassMethodDeclaration.returnType = boundExternClassMethodDeclaration.parent!.parent as BoundExternClassDeclaration;
                        } else {
                            boundExternClassMethodDeclaration.returnType = this.bindTypeAnnotation(boundExternClassMethodDeclaration, externClassMethodDeclaration.returnType);
                        }

                        boundExternClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(boundExternClassMethodDeclaration, externClassMethodDeclaration.parameters);
                    }
                    break;
                }
                case BoundNodeKind.FunctionGroupDeclaration: {
                    for (const [functionDeclaration, boundFunctionDeclaration] of functionLikeGroup.overloads) {
                        boundFunctionDeclaration.returnType = this.bindTypeAnnotation(boundFunctionDeclaration, functionDeclaration.returnType);
                        boundFunctionDeclaration.parameters = this.bindDataDeclarationSequence(boundFunctionDeclaration, functionDeclaration.parameters);
                    }
                    break;
                }
                case BoundNodeKind.InterfaceMethodGroupDeclaration: {
                    for (const [interfaceMethodDeclaration, boundInterfaceMethodDeclaration] of functionLikeGroup.overloads) {
                        boundInterfaceMethodDeclaration.returnType = this.bindTypeAnnotation(boundInterfaceMethodDeclaration, interfaceMethodDeclaration.returnType);
                        boundInterfaceMethodDeclaration.parameters = this.bindDataDeclarationSequence(boundInterfaceMethodDeclaration, interfaceMethodDeclaration.parameters);
                    }
                    break;
                }
                case BoundNodeKind.ClassMethodGroupDeclaration: {
                    for (const [classMethodDeclaration, boundClassMethodDeclaration] of functionLikeGroup.overloads) {
                        if (!classMethodDeclaration) {
                            continue;
                        }

                        if (areIdentifiersSame('New', boundClassMethodDeclaration.identifier.name)) {
                            boundClassMethodDeclaration.returnType = boundClassMethodDeclaration.parent!.parent as BoundClassDeclaration;
                        } else {
                            boundClassMethodDeclaration.returnType = this.bindTypeAnnotation(boundClassMethodDeclaration, classMethodDeclaration.returnType);
                        }

                        boundClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(boundClassMethodDeclaration, classMethodDeclaration.parameters);
                    }
                    break;
                }
                default: {
                    assertNever(functionLikeGroup);
                    break;
                }
            }
        }

        // Phase 1.55: Add default constructors to classes
        // - Depends on overload resolution (satisfied by phase 1.5)
        for (const [, member] of boundModuleDeclaration.locals) {
            const { declaration } = member;
            switch (declaration.kind) {
                case BoundNodeKind.ExternClassDeclaration: {
                    if (!this.hasParameterlessExternConstructor(declaration)) {
                        this.createParameterlessExternConstructor(declaration);
                    }
                    break;
                }
                case BoundNodeKind.ClassDeclaration: {
                    if (!this.hasParameterlessConstructor(declaration)) {
                        this.createParameterlessConstructor(declaration);
                    }
                    break;
                }
            }
        }

        // Phase 1.75: Evaluate initializers of data declarations
        // - Depends on expressions being bindable
        for (const bindDataDeclarationInitializer of this.bindDataDeclarationInitializerList) {
            bindDataDeclarationInitializer();
        }

        // Phase 2: Bind statements
        this.phase = 2;
        this.bindModuleDeclarationMembers(boundModuleDeclaration, moduleDeclaration.members);

        return boundModuleDeclaration;
    }

    private bindModuleDeclarationHeaderMembers(
        members: ModuleDeclarationHeaderMember[],
    ): void {
        for (const member of members) {
            switch (member.kind) {
                case NodeKind.ImportStatement: {
                    this.bindImportStatement(member);
                    break;
                }
                case NodeKind.FriendDirective:
                case NodeKind.AccessibilityDirective:
                case NodeKind.AliasDirectiveSequence: {
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
    }

    private bindModuleDeclarationMembers(
        parent: BoundModuleDeclaration,
        members: ModuleDeclarationMember[],
    ): void {
        for (const member of members) {
            switch (member.kind) {
                case NodeKind.AccessibilityDirective: {
                    // console.warn(`Binding accessibility directives is not implemented.`);
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
        importStatement: ImportStatement,
    ): void {
        const { path } = importStatement;
        switch (path.kind) {
            case NodeKind.StringLiteralExpression: {
                // console.log(`Binding native imports is not implemented.`);
                break;
            }
            case NodeKind.ModulePath: {
                this.bindModulePath(path);
                break;
            }
            case TokenKind.Missing: { break; }
            default: {
                assertNever(path);
                break;
            }
        }
    }

    // #endregion

    // #region Module path

    private bindModulePath(
        modulePath: ModulePath,
    ): void {
        const { moduleIdentifier } = modulePath;
        switch (moduleIdentifier.kind) {
            case TokenKind.Identifier: {
                const modulePathComponents: string[] = [];

                for (const child of modulePath.children) {
                    switch (child.kind) {
                        case TokenKind.Identifier: {
                            // TODO: Can directories be referenced as identifiers in code?
                            //       If so, we may want to tie this in with how we resolve those.
                            const component = child.getText(this.document);
                            modulePathComponents.push(component);
                            break;
                        }
                        case TokenKind.Period: { break; }
                        default: {
                            assertNever(child);
                            break;
                        }
                    }
                }

                const name = moduleIdentifier.getText(this.document);
                const boundModuleDeclaration = this.project.importModuleFromSource(this.module.directory, modulePathComponents, name);
                this.module.importedModules.add(boundModuleDeclaration);
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
    }

    // #endregion

    // #region Extern data declaration sequence

    private bindExternDataDeclarationSequence(
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
        externDataDeclarationSequence: ExternDataDeclarationSequence,
    ): BoundExternDataDeclaration[] {
        const boundExternDataDeclarations: BoundExternDataDeclaration[] = [];

        for (const externDataDeclaration of externDataDeclarationSequence.children) {
            switch (externDataDeclaration.kind) {
                case NodeKind.ExternDataDeclaration: {
                    const boundExternDataDeclaration = this.bindExternDataDeclaration(parent, externDataDeclaration, externDataDeclarationSequence.dataDeclarationKeyword);
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
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
        externDataDeclaration: ExternDataDeclaration,
        dataDeclarationKeyword: ExternDataDeclarationKeywordToken,
    ): BoundExternDataDeclaration {
        let boundExternDataDeclaration: BoundExternDataDeclaration | undefined;

        switch (this.phase) {
            case 1: {
                boundExternDataDeclaration = this.bindExternDataDeclarationPhase1(parent, externDataDeclaration, dataDeclarationKeyword);
                break;
            }
            case 2: {
                const name = this.getIdentifierText(externDataDeclaration.identifier);
                boundExternDataDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ExternDataDeclaration)!;
                this.bindExternDataDeclarationPhase2(boundExternDataDeclaration, externDataDeclaration);
                break;
            }
            default: {
                boundExternDataDeclaration = assertNever(this.phase);
                break;
            }
        }

        return boundExternDataDeclaration;
    }

    @traceBindingPhase1(BoundNodeKind.ExternDataDeclaration)
    private bindExternDataDeclarationPhase1(
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
        externDataDeclaration: ExternDataDeclaration,
        dataDeclarationKeyword: ExternDataDeclarationKeywordToken,
    ): BoundExternDataDeclaration {
        const name = this.getIdentifierText(externDataDeclaration.identifier);

        const boundExternDataDeclaration = new BoundExternDataDeclaration();
        boundExternDataDeclaration.parent = parent;
        boundExternDataDeclaration.declarationKind = dataDeclarationKeyword.kind;
        boundExternDataDeclaration.identifier = new BoundSymbol(name, boundExternDataDeclaration);
        parent.locals.set(boundExternDataDeclaration.identifier);

        return boundExternDataDeclaration;
    }

    @traceBindingPhase2(BoundNodeKind.ExternDataDeclaration)
    private bindExternDataDeclarationPhase2(
        boundExternDataDeclaration: BoundExternDataDeclaration,
        externDataDeclaration: ExternDataDeclaration,
    ): void {
        boundExternDataDeclaration.typeAnnotation = this.bindTypeAnnotation(boundExternDataDeclaration, externDataDeclaration.typeAnnotation);
        boundExternDataDeclaration.type = boundExternDataDeclaration.typeAnnotation.type;

        if (externDataDeclaration.nativeSymbol) {
            if (externDataDeclaration.nativeSymbol.kind === TokenKind.Missing) {
                throw new Error(`Native symbol is missing.`);
            }

            boundExternDataDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternDataDeclaration, externDataDeclaration.nativeSymbol);
        }
    }

    // #endregion

    // #region Extern function declaration

    private bindExternFunctionDeclaration(
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
        externFunctionDeclaration: ExternFunctionDeclaration,
    ): BoundExternFunctionDeclaration {
        let boundExternFunctionDeclaration: BoundExternFunctionDeclaration;

        const name = this.getIdentifierText(externFunctionDeclaration.identifier);
        const boundFunctionGroupDeclaration = this.bindExternFunctionGroupDeclaration(parent, name);

        switch (this.phase) {
            case 1: {
                boundExternFunctionDeclaration = this.bindExternFunctionDeclarationPhase1(boundFunctionGroupDeclaration, externFunctionDeclaration);
                break;
            }
            case 2: {
                boundExternFunctionDeclaration = boundFunctionGroupDeclaration.overloads.get(externFunctionDeclaration)!;
                this.bindExternFunctionDeclarationPhase2(boundExternFunctionDeclaration, externFunctionDeclaration);
                break;
            }
            default: {
                boundExternFunctionDeclaration = assertNever(this.phase);
                break;
            }
        }

        return boundExternFunctionDeclaration;
    }

    private bindExternFunctionGroupDeclaration(
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
        name: string,
    ): BoundExternFunctionGroupDeclaration {
        let boundExternFunctionGroupDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ExternFunctionGroupDeclaration);
        if (boundExternFunctionGroupDeclaration) {
            return boundExternFunctionGroupDeclaration;
        }

        boundExternFunctionGroupDeclaration = new BoundExternFunctionGroupDeclaration();
        this.functionLikeGroupList.push(boundExternFunctionGroupDeclaration);
        boundExternFunctionGroupDeclaration.parent = parent;
        boundExternFunctionGroupDeclaration.type = new FunctionGroupType(boundExternFunctionGroupDeclaration);
        boundExternFunctionGroupDeclaration.identifier = new BoundSymbol(name, boundExternFunctionGroupDeclaration);
        parent.locals.set(boundExternFunctionGroupDeclaration.identifier);

        return boundExternFunctionGroupDeclaration;
    }

    @traceBindingPhase1(BoundNodeKind.ExternFunctionDeclaration)
    private bindExternFunctionDeclarationPhase1(
        parent: BoundExternFunctionGroupDeclaration,
        externFunctionDeclaration: ExternFunctionDeclaration,
    ): BoundExternFunctionDeclaration {
        const name = this.getIdentifierText(externFunctionDeclaration.identifier);

        const boundExternFunctionDeclaration = new BoundExternFunctionDeclaration();
        boundExternFunctionDeclaration.declaration = externFunctionDeclaration;
        parent.overloads.set(boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.parent = parent;
        boundExternFunctionDeclaration.type = new FunctionType(boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.identifier = new BoundSymbol(name, boundExternFunctionDeclaration);

        return boundExternFunctionDeclaration;
    }

    @traceBindingPhase2(BoundNodeKind.ExternFunctionDeclaration)
    private bindExternFunctionDeclarationPhase2(
        boundExternFunctionDeclaration: BoundExternFunctionDeclaration,
        externFunctionDeclaration: ExternFunctionDeclaration,
    ): void {
        if (externFunctionDeclaration.nativeSymbol) {
            if (externFunctionDeclaration.nativeSymbol.kind === TokenKind.Missing) {
                throw new Error(`Native symbol is missing.`);
            }

            boundExternFunctionDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternFunctionDeclaration, externFunctionDeclaration.nativeSymbol);
        }
    }

    // #endregion

    // #region Extern class declaration

    private bindExternClassDeclaration(
        parent: BoundModuleDeclaration,
        externClassDeclaration: ExternClassDeclaration,
    ): BoundExternClassDeclaration {
        let boundExternClassDeclaration: BoundExternClassDeclaration;

        switch (this.phase) {
            case 1: {
                boundExternClassDeclaration = this.bindExternClassDeclarationPhase1(parent, externClassDeclaration);
                break;
            }
            case 2: {
                const name = this.getIdentifierText(externClassDeclaration.identifier);
                boundExternClassDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ExternClassDeclaration)!;
                this.bindExternClassDeclarationPhase2(boundExternClassDeclaration, externClassDeclaration);
                break;
            }
            default: {
                boundExternClassDeclaration = assertNever(this.phase);
                break;
            }
        }

        return boundExternClassDeclaration;
    }

    @traceBindingPhase1(BoundNodeKind.ExternClassDeclaration)
    private bindExternClassDeclarationPhase1(
        parent: BoundModuleDeclaration,
        externClassDeclaration: ExternClassDeclaration,
    ): BoundExternClassDeclaration {
        const name = this.getIdentifierText(externClassDeclaration.identifier);

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

        return boundExternClassDeclaration;
    }

    @traceBindingPhase2(BoundNodeKind.ExternClassDeclaration)
    private bindExternClassDeclarationPhase2(
        boundExternClassDeclaration: BoundExternClassDeclaration,
        externClassDeclaration: ExternClassDeclaration,
    ): void {
        if (externClassDeclaration.superType) {
            if (externClassDeclaration.superType.kind !== TokenKind.NullKeyword) {
                boundExternClassDeclaration.superType = this.bindTypeReference(boundExternClassDeclaration, externClassDeclaration.superType,
                    BoundNodeKind.ExternClassDeclaration,
                    BoundNodeKind.ClassDeclaration,
                );
            }
        } else {
            boundExternClassDeclaration.superType = this.project.objectTypeDeclaration;
        }

        if (externClassDeclaration.nativeSymbol) {
            if (externClassDeclaration.nativeSymbol.kind === TokenKind.Missing) {
                throw new Error(`Native symbol is missing.`);
            }

            boundExternClassDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternClassDeclaration, externClassDeclaration.nativeSymbol);
        }

        this.bindExternClassDeclarationMembers(boundExternClassDeclaration, externClassDeclaration.members);
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
    }

    // #region Default constructor

    private hasParameterlessExternConstructor(boundClassDeclaration: BoundExternClassDeclaration): boolean {
        const newMethod = getMethod(boundClassDeclaration, 'New');
        if (newMethod) {
            return true;
        }

        return false;
    }

    private createParameterlessExternConstructor(parent: BoundExternClassDeclaration): BoundExternClassMethodGroupDeclaration {
        const name = 'New';

        const boundMethodGroupDeclaration = this.bindExternClassMethodGroupDeclaration(parent, name);

        const boundClassMethodDeclaration = new BoundExternClassMethodDeclaration();
        boundMethodGroupDeclaration.overloads.set(boundClassMethodDeclaration);
        boundClassMethodDeclaration.parent = boundMethodGroupDeclaration;
        boundClassMethodDeclaration.type = new MethodType(boundClassMethodDeclaration);
        boundClassMethodDeclaration.identifier = new BoundSymbol(name, boundClassMethodDeclaration);
        boundClassMethodDeclaration.returnType = parent;
        boundClassMethodDeclaration.parameters = [];

        return boundMethodGroupDeclaration;
    }

    // #endregion

    // #region Extern class method declaration

    private bindExternClassMethodDeclaration(
        parent: BoundExternClassDeclaration,
        externClassMethodDeclaration: ExternClassMethodDeclaration,
    ): BoundExternClassMethodDeclaration {
        let boundExternClassMethodDeclaration: BoundExternClassMethodDeclaration;

        const name = this.getIdentifierText(externClassMethodDeclaration.identifier);
        const boundExternClassMethodGroupDeclaration = this.bindExternClassMethodGroupDeclaration(parent, name);

        switch (this.phase) {
            case 1: {
                boundExternClassMethodDeclaration = this.bindExternClassMethodDeclarationPhase1(boundExternClassMethodGroupDeclaration, externClassMethodDeclaration);
                break;
            }
            case 2: {
                boundExternClassMethodDeclaration = boundExternClassMethodGroupDeclaration.overloads.get(externClassMethodDeclaration)!;
                this.bindExternClassMethodDeclarationPhase2(boundExternClassMethodDeclaration, externClassMethodDeclaration);
                break;
            }
            default: {
                boundExternClassMethodDeclaration = assertNever(this.phase);
                break;
            }
        }

        return boundExternClassMethodDeclaration;
    }

    private bindExternClassMethodGroupDeclaration(
        parent: BoundExternClassDeclaration,
        name: string,
    ): BoundExternClassMethodGroupDeclaration {
        let boundExternClassMethodGroupDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ExternClassMethodGroupDeclaration);
        if (boundExternClassMethodGroupDeclaration) {
            return boundExternClassMethodGroupDeclaration;
        }

        boundExternClassMethodGroupDeclaration = new BoundExternClassMethodGroupDeclaration();
        this.functionLikeGroupList.push(boundExternClassMethodGroupDeclaration);
        boundExternClassMethodGroupDeclaration.parent = parent;
        boundExternClassMethodGroupDeclaration.identifier = new BoundSymbol(name, boundExternClassMethodGroupDeclaration);
        parent.locals.set(boundExternClassMethodGroupDeclaration.identifier);
        boundExternClassMethodGroupDeclaration.type = new MethodGroupType(boundExternClassMethodGroupDeclaration);

        return boundExternClassMethodGroupDeclaration;
    }

    @traceBindingPhase1(BoundNodeKind.ExternClassMethodDeclaration)
    private bindExternClassMethodDeclarationPhase1(
        parent: BoundExternClassMethodGroupDeclaration,
        externClassMethodDeclaration: ExternClassMethodDeclaration,
    ): BoundExternClassMethodDeclaration {
        const name = this.getIdentifierText(externClassMethodDeclaration.identifier);

        const boundExternClassMethodDeclaration = new BoundExternClassMethodDeclaration();
        boundExternClassMethodDeclaration.declaration = externClassMethodDeclaration;
        parent.overloads.set(boundExternClassMethodDeclaration);
        boundExternClassMethodDeclaration.parent = parent;
        boundExternClassMethodDeclaration.type = new MethodType(boundExternClassMethodDeclaration);
        boundExternClassMethodDeclaration.identifier = new BoundSymbol(name, boundExternClassMethodDeclaration);

        return boundExternClassMethodDeclaration;
    }

    @traceBindingPhase2(BoundNodeKind.ExternClassMethodDeclaration)
    private bindExternClassMethodDeclarationPhase2(
        boundExternClassMethodDeclaration: BoundExternClassMethodDeclaration,
        externClassMethodDeclaration: ExternClassMethodDeclaration,
    ): void {
        if (externClassMethodDeclaration.nativeSymbol) {
            if (externClassMethodDeclaration.nativeSymbol.kind === TokenKind.Missing) {
                throw new Error(`Native symbol is missing.`);
            }

            boundExternClassMethodDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternClassMethodDeclaration, externClassMethodDeclaration.nativeSymbol);
        }
    }

    // #endregion

    // #endregion

    // #region Data declaration sequence

    private bindDataDeclarationSequence(
        parent: BoundNodes,
        dataDeclarationSequence: DataDeclarationSequence,
    ): BoundDataDeclaration[] {
        const boundDataDeclarations: BoundDataDeclaration[] = [];

        for (const dataDeclaration of dataDeclarationSequence.children) {
            switch (dataDeclaration.kind) {
                case NodeKind.DataDeclaration: {
                    const boundDataDeclaration = this.bindDataDeclaration(parent, dataDeclaration, dataDeclarationSequence.dataDeclarationKeyword);
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
        parent: BoundNodes,
        dataDeclaration: DataDeclaration,
        dataDeclarationKeyword: DataDeclarationKeywordToken | null = null,
    ): BoundDataDeclaration {
        const name = this.getIdentifierText(dataDeclaration.identifier);

        let declarationKind: BoundDataDeclaration['declarationKind'] = null;
        if (dataDeclarationKeyword) {
            declarationKind = dataDeclarationKeyword.kind;
        }

        let operator: BoundDataDeclaration['operator'] = null;
        if (dataDeclaration.operator) {
            operator = dataDeclaration.operator.kind;
        }

        let getTypeAnnotation: GetBoundNode<BoundTypeReferenceDeclaration> | undefined = undefined;
        if (operator !== TokenKind.ColonEqualsSign) {
            getTypeAnnotation = (parent) => this.bindTypeAnnotation(parent, dataDeclaration.typeAnnotation);
        }

        let getExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (dataDeclaration.expression) {
            const { expression } = dataDeclaration;
            getExpression = (parent) => this.bindExpression(parent, expression);
        }

        let boundDataDeclaration: BoundDataDeclaration | undefined;

        switch (parent.kind) {
            case BoundNodeKind.ModuleDeclaration:
            case BoundNodeKind.ExternClassDeclaration:
            case BoundNodeKind.InterfaceDeclaration:
            case BoundNodeKind.ClassDeclaration: {
                switch (this.phase) {
                    case 1: {
                        boundDataDeclaration = this.bindDataDeclarationPhase1(parent, name, declarationKind, operator);
                        const dataDeclaration = boundDataDeclaration;
                        this.bindDataDeclarationInitializerList.push(() =>
                            this.bindDataDeclarationPhase2(dataDeclaration, getTypeAnnotation, getExpression)
                        );
                        break;
                    }
                    case 2: {
                        boundDataDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.DataDeclaration)!;
                        break;
                    }
                    default: {
                        boundDataDeclaration = assertNever(this.phase);
                        break;
                    }
                }
                break;
            }
            default: {
                boundDataDeclaration = this.dataDeclaration(parent, {
                    name,
                    declarationKind,
                    operator,
                    getTypeAnnotation,
                    getExpression,
                });
                break;
            }
        }

        return boundDataDeclaration;
    }

    @traceBindingPhase1(BoundNodeKind.DataDeclaration)
    private bindDataDeclarationPhase1(
        parent: BoundNodes,
        name: string,
        declarationKind: BoundDataDeclaration['declarationKind'],
        operator: BoundDataDeclaration['operator'],
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

    @traceBindingPhase2(BoundNodeKind.DataDeclaration)
    private bindDataDeclarationPhase2(
        boundDataDeclaration: BoundDataDeclaration,
        getTypeAnnotation?: GetBoundNode<BoundTypeReferenceDeclaration>,
        getExpression?: GetBoundNode<BoundExpressions>,
    ): void {
        switch (boundDataDeclaration.operator) {
            case null: {
                boundDataDeclaration.typeAnnotation = getTypeAnnotation!(boundDataDeclaration);
                boundDataDeclaration.type = boundDataDeclaration.typeAnnotation.type;
                break;
            }
            case TokenKind.EqualsSign: {
                boundDataDeclaration.typeAnnotation = getTypeAnnotation!(boundDataDeclaration);
                boundDataDeclaration.type = boundDataDeclaration.typeAnnotation.type;

                if (!getExpression) {
                    throw new Error(`Missing expression for data declaration.`);
                }

                boundDataDeclaration.expression = getExpression(boundDataDeclaration);

                if (!boundDataDeclaration.expression.type.isConvertibleTo(boundDataDeclaration.type)) {
                    throw new Error(`'${boundDataDeclaration.expression.type}' is not convertible to '${boundDataDeclaration.typeAnnotation.type}'.`);
                }
                break;
            }
            case TokenKind.ColonEqualsSign: {
                boundDataDeclaration.expression = getExpression!(boundDataDeclaration);
                boundDataDeclaration.type = boundDataDeclaration.expression.type;
                break;
            }
            case TokenKind.Missing: {
                throw new Error(`Missing operator for data declaration.`);
            }
            default: {
                assertNever(boundDataDeclaration.operator);
                break;
            }
        }
    }

    private dataDeclaration(
        parent: BoundNodes,
        {
            name = ANONYMOUS_NAME,
            declarationKind = TokenKind.LocalKeyword,
            operator = TokenKind.ColonEqualsSign,
            getTypeAnnotation,
            getExpression,
        }: {
            name?: string;
            declarationKind?: BoundDataDeclaration['declarationKind'];
            operator?: BoundDataDeclaration['operator'];
            getTypeAnnotation?: GetBoundNode<BoundTypeReferenceDeclaration>;
            getExpression?: GetBoundNode<BoundExpressions>;
        },
    ): BoundDataDeclaration {
        const boundDataDeclaration = this.bindDataDeclarationPhase1(parent, name, declarationKind, operator);
        this.bindDataDeclarationPhase2(boundDataDeclaration, getTypeAnnotation, getExpression);

        return boundDataDeclaration;
    }

    // #endregion

    // #endregion

    // #region Function declaration

    private bindFunctionDeclaration(
        parent: BoundModuleDeclaration | BoundClassDeclaration,
        functionDeclaration: FunctionDeclaration,
    ): BoundFunctionDeclaration {
        let boundFunctionDeclaration: BoundFunctionDeclaration;

        const name = this.getIdentifierText(functionDeclaration.identifier);
        const boundFunctionGroupDeclaration = this.bindFunctionGroupDeclaration(parent, name);

        switch (this.phase) {
            case 1: {
                boundFunctionDeclaration = this.bindFunctionDeclarationPhase1(boundFunctionGroupDeclaration, functionDeclaration);
                break;
            }
            case 2: {
                boundFunctionDeclaration = boundFunctionGroupDeclaration.overloads.get(functionDeclaration)!;
                this.bindFunctionDeclarationPhase2(boundFunctionDeclaration, functionDeclaration);
                break;
            }
            default: {
                boundFunctionDeclaration = assertNever(this.phase);
                break;
            }
        }

        return boundFunctionDeclaration;
    }

    private bindFunctionGroupDeclaration(
        parent: BoundModuleDeclaration | BoundClassDeclaration,
        name: string,
    ): BoundFunctionGroupDeclaration {
        let boundFunctionGroupDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.FunctionGroupDeclaration);
        if (boundFunctionGroupDeclaration) {
            return boundFunctionGroupDeclaration;
        }

        boundFunctionGroupDeclaration = new BoundFunctionGroupDeclaration();
        this.functionLikeGroupList.push(boundFunctionGroupDeclaration);
        boundFunctionGroupDeclaration.parent = parent;
        boundFunctionGroupDeclaration.type = new FunctionGroupType(boundFunctionGroupDeclaration);
        boundFunctionGroupDeclaration.identifier = new BoundSymbol(name, boundFunctionGroupDeclaration);
        parent.locals.set(boundFunctionGroupDeclaration.identifier);

        return boundFunctionGroupDeclaration;
    }

    @traceBindingPhase1(BoundNodeKind.FunctionDeclaration)
    private bindFunctionDeclarationPhase1(
        parent: BoundFunctionGroupDeclaration,
        functionDeclaration: FunctionDeclaration,
    ): BoundFunctionDeclaration {
        const name = this.getIdentifierText(functionDeclaration.identifier);

        const boundFunctionDeclaration = new BoundFunctionDeclaration();
        boundFunctionDeclaration.declaration = functionDeclaration;
        parent.overloads.set(boundFunctionDeclaration);
        boundFunctionDeclaration.parent = parent;
        boundFunctionDeclaration.type = new FunctionType(boundFunctionDeclaration);
        boundFunctionDeclaration.identifier = new BoundSymbol(name, boundFunctionDeclaration);

        return boundFunctionDeclaration;
    }

    @traceBindingPhase2(BoundNodeKind.FunctionDeclaration)
    private bindFunctionDeclarationPhase2(
        boundFunctionDeclaration: BoundFunctionDeclaration,
        functionDeclaration: FunctionDeclaration,
    ): void {
        boundFunctionDeclaration.statements = this.bindStatements(boundFunctionDeclaration, functionDeclaration.statements);
    }

    // #endregion

    // #region Interface declaration

    private bindInterfaceDeclaration(
        parent: BoundModuleDeclaration,
        interfaceDeclaration: InterfaceDeclaration,
    ): BoundInterfaceDeclaration {
        let boundInterfaceDeclaration: BoundInterfaceDeclaration;

        switch (this.phase) {
            case 1: {
                boundInterfaceDeclaration = this.bindInterfaceDeclarationPhase1(parent, interfaceDeclaration);
                break;
            }
            case 2: {
                const name = this.getIdentifierText(interfaceDeclaration.identifier);
                boundInterfaceDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.InterfaceDeclaration)!;
                this.bindInterfaceDeclarationPhase2(boundInterfaceDeclaration, interfaceDeclaration);
                break;
            }
            default: {
                boundInterfaceDeclaration = assertNever(this.phase);
                break;
            }
        }

        return boundInterfaceDeclaration;
    }

    @traceBindingPhase1(BoundNodeKind.InterfaceDeclaration)
    private bindInterfaceDeclarationPhase1(
        parent: BoundModuleDeclaration,
        interfaceDeclaration: InterfaceDeclaration,
    ): BoundInterfaceDeclaration {
        const name = this.getIdentifierText(interfaceDeclaration.identifier);

        const boundInterfaceDeclaration = new BoundInterfaceDeclaration();
        boundInterfaceDeclaration.declaration = interfaceDeclaration;
        boundInterfaceDeclaration.parent = parent;
        boundInterfaceDeclaration.type = new ObjectType(boundInterfaceDeclaration);
        boundInterfaceDeclaration.identifier = new BoundSymbol(name, boundInterfaceDeclaration);
        parent.locals.set(boundInterfaceDeclaration.identifier);

        this.bindInterfaceDeclarationMembers(boundInterfaceDeclaration, interfaceDeclaration.members);

        return boundInterfaceDeclaration;
    }

    @traceBindingPhase2(BoundNodeKind.InterfaceDeclaration)
    private bindInterfaceDeclarationPhase2(
        boundInterfaceDeclaration: BoundInterfaceDeclaration,
        interfaceDeclaration: InterfaceDeclaration,
    ): void {
        if (interfaceDeclaration.implementedTypes) {
            boundInterfaceDeclaration.implementedTypes = this.bindTypeReferenceSequence(boundInterfaceDeclaration, interfaceDeclaration.implementedTypes,
                BoundNodeKind.InterfaceDeclaration,
            );
        }

        this.bindInterfaceDeclarationMembers(boundInterfaceDeclaration, interfaceDeclaration.members);
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

    private bindInterfaceMethodDeclaration(
        parent: BoundInterfaceDeclaration,
        interfaceMethodDeclaration: InterfaceMethodDeclaration,
    ): BoundInterfaceMethodDeclaration {
        let boundInterfaceMethodDeclaration: BoundInterfaceMethodDeclaration;

        const name = this.getIdentifierText(interfaceMethodDeclaration.identifier);
        const boundInterfaceMethodGroupDeclaration = this.bindInterfaceMethodGroupDeclaration(parent, name);

        switch (this.phase) {
            case 1: {
                boundInterfaceMethodDeclaration = this.bindInterfaceMethodDeclarationPhase1(boundInterfaceMethodGroupDeclaration, interfaceMethodDeclaration);
                break;
            }
            case 2: {
                boundInterfaceMethodDeclaration = boundInterfaceMethodGroupDeclaration.overloads.get(interfaceMethodDeclaration)!;
                break;
            }
            default: {
                boundInterfaceMethodDeclaration = assertNever(this.phase);
                break;
            }
        }

        return boundInterfaceMethodDeclaration;
    }

    private bindInterfaceMethodGroupDeclaration(parent: BoundInterfaceDeclaration, name: string) {
        let boundInterfaceMethodGroupDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.InterfaceMethodGroupDeclaration);
        if (boundInterfaceMethodGroupDeclaration) {
            return boundInterfaceMethodGroupDeclaration;
        }

        boundInterfaceMethodGroupDeclaration = new BoundInterfaceMethodGroupDeclaration();
        this.functionLikeGroupList.push(boundInterfaceMethodGroupDeclaration);
        boundInterfaceMethodGroupDeclaration.parent = parent;
        boundInterfaceMethodGroupDeclaration.type = new MethodGroupType(boundInterfaceMethodGroupDeclaration);
        boundInterfaceMethodGroupDeclaration.identifier = new BoundSymbol(name, boundInterfaceMethodGroupDeclaration);
        parent.locals.set(boundInterfaceMethodGroupDeclaration.identifier);

        return boundInterfaceMethodGroupDeclaration;
    }

    @traceBindingPhase1(BoundNodeKind.InterfaceMethodDeclaration)
    private bindInterfaceMethodDeclarationPhase1(
        boundInterfaceMethodGroupDeclaration: BoundInterfaceMethodGroupDeclaration,
        interfaceMethodDeclaration: InterfaceMethodDeclaration,
    ): BoundInterfaceMethodDeclaration {
        const name = this.getIdentifierText(interfaceMethodDeclaration.identifier);

        const boundInterfaceMethodDeclaration = new BoundInterfaceMethodDeclaration();
        boundInterfaceMethodDeclaration.declaration = interfaceMethodDeclaration;
        boundInterfaceMethodGroupDeclaration.overloads.set(boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.parent = boundInterfaceMethodGroupDeclaration;
        boundInterfaceMethodDeclaration.type = new MethodType(boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.identifier = new BoundSymbol(name, boundInterfaceMethodDeclaration);

        return boundInterfaceMethodDeclaration;
    }

    // #endregion

    // #endregion

    // #region Class declaration

    private bindClassDeclaration(
        parent: BoundModuleDeclaration,
        classDeclaration: ClassDeclaration,
    ): BoundClassDeclaration {
        let boundClassDeclaration: BoundClassDeclaration;

        switch (this.phase) {
            case 1: {
                boundClassDeclaration = this.bindClassDeclarationPhase1(parent, classDeclaration);
                break;
            }
            case 2: {
                const name = this.getIdentifierText(classDeclaration.identifier);
                boundClassDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ClassDeclaration)!;
                this.bindClassDeclarationPhase2(boundClassDeclaration, classDeclaration);
                break;
            }
            default: {
                boundClassDeclaration = assertNever(this.phase);
                break;
            }
        }

        return boundClassDeclaration;
    }

    @traceBindingPhase1(BoundNodeKind.ClassDeclaration)
    private bindClassDeclarationPhase1(
        parent: BoundModuleDeclaration,
        classDeclaration: ClassDeclaration,
    ): BoundClassDeclaration {
        const name = this.getIdentifierText(classDeclaration.identifier);

        const boundClassDeclaration = new BoundClassDeclaration();
        boundClassDeclaration.declaration = classDeclaration;
        boundClassDeclaration.parent = parent;
        boundClassDeclaration.type = new ObjectType(boundClassDeclaration);
        boundClassDeclaration.identifier = new BoundSymbol(name, boundClassDeclaration);
        parent.locals.set(boundClassDeclaration.identifier);

        if (classDeclaration.typeParameters) {
            boundClassDeclaration.rootType = boundClassDeclaration;
            boundClassDeclaration.instantiatedTypes = [];
            boundClassDeclaration.typeParameters = this.bindTypeParameters(boundClassDeclaration, classDeclaration.typeParameters);
        }

        this.bindClassDeclarationMembers(boundClassDeclaration, classDeclaration.members);

        return boundClassDeclaration;
    }

    @traceBindingPhase2(BoundNodeKind.ClassDeclaration)
    private bindClassDeclarationPhase2(
        boundClassDeclaration: BoundClassDeclaration,
        classDeclaration: ClassDeclaration,
    ): void {
        if (classDeclaration.superType) {
            boundClassDeclaration.superType = this.bindTypeReference(boundClassDeclaration, classDeclaration.superType,
                BoundNodeKind.ExternClassDeclaration,
                BoundNodeKind.ClassDeclaration,
            );
        } else {
            boundClassDeclaration.superType = this.project.objectTypeDeclaration;
        }

        if (classDeclaration.implementedTypes) {
            boundClassDeclaration.implementedTypes = this.bindTypeReferenceSequence(boundClassDeclaration, classDeclaration.implementedTypes,
                BoundNodeKind.InterfaceDeclaration,
            );
        }

        this.bindClassDeclarationMembers(boundClassDeclaration, classDeclaration.members);
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

        const name = this.getIdentifierText(typeParameter.identifier);
        boundTypeParameter.identifier = new BoundSymbol(name, boundTypeParameter);
        parent.locals.set(boundTypeParameter.identifier);

        return boundTypeParameter;
    }

    // #endregion

    private bindClassDeclarationMembers(
        parent: BoundClassDeclaration,
        members: ClassDeclarationMember[],
    ): void {
        for (const member of members) {
            switch (member.kind) {
                case NodeKind.AccessibilityDirective: {
                    // console.warn(`'${member.accessibilityKeyword.kind}' directive is not implemented.`);
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
                case NodeKind.ClassMethodDeclaration: {
                    this.bindClassMethodDeclaration(parent, member);
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

    // #region Default constructor

    private hasParameterlessConstructor(boundClassDeclaration: BoundClassDeclaration): boolean {
        const newMethod = getMethod(boundClassDeclaration, 'New');
        if (newMethod) {
            return true;
        }

        return false;
    }

    private createParameterlessConstructor(parent: BoundClassDeclaration): BoundClassMethodGroupDeclaration {
        const name = 'New';

        const boundMethodGroupDeclaration = this.bindClassMethodGroupDeclaration(parent, name);

        const boundClassMethodDeclaration = new BoundClassMethodDeclaration();
        boundMethodGroupDeclaration.overloads.set(boundClassMethodDeclaration);
        boundClassMethodDeclaration.parent = boundMethodGroupDeclaration;
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

    private bindClassMethodDeclaration(
        parent: BoundClassDeclaration,
        classMethodDeclaration: ClassMethodDeclaration,
    ): BoundClassMethodDeclaration {
        let boundClassMethodDeclaration: BoundClassMethodDeclaration;

        const name = this.getIdentifierText(classMethodDeclaration.identifier);
        const boundClassMethodGroupDeclaration = this.bindClassMethodGroupDeclaration(parent, name);

        switch (this.phase) {
            case 1: {
                boundClassMethodDeclaration = this.bindClassMethodDeclarationPhase1(boundClassMethodGroupDeclaration, classMethodDeclaration);
                break;
            }
            case 2: {
                boundClassMethodDeclaration = boundClassMethodGroupDeclaration.overloads.get(classMethodDeclaration)!;
                this.bindClassMethodDeclarationPhase2(boundClassMethodDeclaration, classMethodDeclaration);
                break;
            }
            default: {
                boundClassMethodDeclaration = assertNever(this.phase);
                break;
            }
        }

        return boundClassMethodDeclaration;
    }

    private bindClassMethodGroupDeclaration(parent: BoundClassDeclaration, name: string): BoundClassMethodGroupDeclaration {
        let boundClassMethodGroupDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ClassMethodGroupDeclaration);
        if (boundClassMethodGroupDeclaration) {
            return boundClassMethodGroupDeclaration;
        }

        boundClassMethodGroupDeclaration = new BoundClassMethodGroupDeclaration();
        this.functionLikeGroupList.push(boundClassMethodGroupDeclaration);
        boundClassMethodGroupDeclaration.parent = parent;
        boundClassMethodGroupDeclaration.type = new MethodGroupType(boundClassMethodGroupDeclaration);
        boundClassMethodGroupDeclaration.identifier = new BoundSymbol(name, boundClassMethodGroupDeclaration);
        parent.locals.set(boundClassMethodGroupDeclaration.identifier);

        return boundClassMethodGroupDeclaration;
    }

    @traceBindingPhase1(BoundNodeKind.ClassMethodDeclaration)
    private bindClassMethodDeclarationPhase1(
        parent: BoundClassMethodGroupDeclaration,
        classMethodDeclaration: ClassMethodDeclaration,
    ): BoundClassMethodDeclaration {
        const name = this.getIdentifierText(classMethodDeclaration.identifier);

        const boundClassMethodDeclaration = new BoundClassMethodDeclaration();
        boundClassMethodDeclaration.declaration = classMethodDeclaration;
        parent.overloads.set(boundClassMethodDeclaration);
        boundClassMethodDeclaration.parent = parent;
        boundClassMethodDeclaration.type = new MethodType(boundClassMethodDeclaration);
        boundClassMethodDeclaration.identifier = new BoundSymbol(name, boundClassMethodDeclaration);

        return boundClassMethodDeclaration;
    }

    @traceBindingPhase2(BoundNodeKind.ClassMethodDeclaration)
    private bindClassMethodDeclarationPhase2(
        boundClassMethodDeclaration: BoundClassMethodDeclaration,
        classMethodDeclaration: ClassMethodDeclaration,
    ): void {
        if (classMethodDeclaration.statements) {
            boundClassMethodDeclaration.statements = this.bindStatements(boundClassMethodDeclaration, classMethodDeclaration.statements);
        }
    }

    // #endregion

    // #endregion

    // #endregion

    // #region Statements

    private bindStatements(
        parent: BoundNodes,
        statements: (Statements | SkippedToken)[],
    ): BoundStatements[] {
        const boundStatements: BoundStatements[] = [];

        for (const statement of statements) {
            switch (statement.kind) {
                case NodeKind.DataDeclarationSequenceStatement: {
                    const boundDataDeclarations = this.bindDataDeclarationSequenceStatement(parent, statement);
                    boundStatements.push(...boundDataDeclarations);
                    break;
                }
                case NodeKind.ReturnStatement: {
                    const boundReturnStatement = this.bindReturnStatement(parent, statement);
                    boundStatements.push(boundReturnStatement);
                    break;
                }
                case NodeKind.IfStatement: {
                    const boundIfStatement = this.bindIfStatement(parent, statement);
                    boundStatements.push(boundIfStatement);
                    break;
                }
                case NodeKind.SelectStatement: {
                    const boundSelectStatement = this.bindSelectStatement(parent, statement);
                    boundStatements.push(boundSelectStatement);
                    break;
                }
                case NodeKind.WhileLoop: {
                    const boundWhileLoop = this.bindWhileLoop(parent, statement);
                    boundStatements.push(boundWhileLoop);
                    break;
                }
                case NodeKind.RepeatLoop: {
                    const boundRepeatLoop = this.bindRepeatLoop(parent, statement);
                    boundStatements.push(boundRepeatLoop);
                    break;
                }
                case NodeKind.NumericForLoop: {
                    const boundNumericForLoop = this.bindNumericForLoop(parent, statement);
                    boundStatements.push(boundNumericForLoop);
                    break;
                }
                case NodeKind.ForEachInLoop: {
                    const boundForEachInLoop = this.bindForEachInLoop(parent, statement);
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
                    const boundThrowStatement = this.bindThrowStatement(parent, statement);
                    boundStatements.push(boundThrowStatement);
                    break;
                }
                case NodeKind.TryStatement: {
                    const boundTryStatement = this.bindTryStatement(parent, statement);
                    boundStatements.push(boundTryStatement);
                    break;
                }
                case NodeKind.AssignmentStatement: {
                    const boundAssignmentStatement = this.bindAssignmentStatement(parent, statement);
                    boundStatements.push(boundAssignmentStatement);
                    break;
                }
                case NodeKind.ExpressionStatement: {
                    const boundExpressionStatement = this.bindExpressionStatement(parent, statement);
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
    ): BoundDataDeclarationStatement[] {
        const { dataDeclarationSequence } = dataDeclarationSequenceStatement;

        const boundDataDeclarationStatements: BoundDataDeclarationStatement[] = [];

        for (const dataDeclaration of dataDeclarationSequence.children) {
            switch (dataDeclaration.kind) {
                case NodeKind.DataDeclaration: {
                    const boundDataDeclarationStatement = this.bindDataDeclarationStatement(parent, dataDeclaration, dataDeclarationSequence.dataDeclarationKeyword);
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
        dataDeclarationKeyword: DataDeclarationKeywordToken | null,
    ): BoundDataDeclarationStatement {
        return this.dataDeclarationStatement(parent,
            (parent) => this.bindDataDeclaration(parent, dataDeclaration, dataDeclarationKeyword),
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
    ): BoundReturnStatement {
        let getExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (statement.expression) {
            const { expression } = statement;
            getExpression = (parent) => this.bindExpression(parent, expression);
        }

        return this.returnStatement(parent, getExpression);
    }

    private returnStatement(
        parent: BoundNodes,
        getExpression: GetBoundNode<BoundExpressions> | undefined,
    ): BoundReturnStatement {
        const boundReturnStatement = new BoundReturnStatement();
        boundReturnStatement.parent = parent;

        const functionLikeDeclaration = this.getNearestAncestor(boundReturnStatement,
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
    ): BoundIfStatement {
        let getElseIfClauses: GetBoundNodes<BoundElseIfClause> | undefined = undefined;
        if (ifStatement.elseIfClauses) {
            const { elseIfClauses } = ifStatement;
            getElseIfClauses = (parent) => elseIfClauses.map((elseIfClause) =>
                this.bindElseIfClause(parent, elseIfClause)
            );
        }

        let getElseClause: GetBoundNode<BoundElseClause> | undefined = undefined;
        if (ifStatement.elseClause) {
            const { elseClause } = ifStatement;
            getElseClause = (parent) => this.bindElseClause(parent, elseClause);
        }

        return this.ifStatement(parent,
            (parent) => this.bindExpression(parent, ifStatement.expression),
            (parent) => this.bindStatements(parent, ifStatement.statements),
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
    ): BoundElseIfClause {
        return this.elseIfClause(parent,
            (parent) => this.bindExpression(parent, elseifClause.expression),
            (parent) => this.bindStatements(parent, elseifClause.statements),
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
        boundElseIfClause.statements = getStatements(boundElseIfClause);

        return boundElseIfClause;
    }

    private bindElseClause(
        parent: BoundNodes,
        elseClause: ElseClause,
    ): BoundElseClause {
        return this.elseClause(parent,
            (parent) => this.bindStatements(parent, elseClause.statements),
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
    ): BoundSelectStatement {
        let getDefaultClause: GetBoundNode<BoundDefaultClause> | undefined = undefined;
        if (selectStatement.defaultClause) {
            const { defaultClause } = selectStatement;
            getDefaultClause = (parent) => this.bindDefaultClause(parent, defaultClause);
        }

        return this.selectStatement(parent,
            (parent) => selectStatement.caseClauses.map((caseClause) =>
                this.bindCaseClause(parent, caseClause)
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
    ): BoundCaseClause {
        return this.caseClause(parent,
            (parent) => this.bindExpressionSequence(parent, caseClause.expressions),
            (parent) => this.bindStatements(parent, caseClause.statements),
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
    ): BoundDefaultClause {
        return this.defaultClause(parent,
            (parent) => this.bindStatements(parent, defaultClause.statements),
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
    ): BoundWhileLoop {
        return this.whileLoop(parent,
            (parent) => this.bindExpression(parent, whileLoop.expression),
            (parent) => this.bindStatements(parent, whileLoop.statements),
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
        boundWhileLoop.statements = getStatements(boundWhileLoop);

        return boundWhileLoop;
    }

    // #endregion

    // #region Repeat loop

    private bindRepeatLoop(
        parent: BoundNodes,
        repeatLoop: RepeatLoop,
    ): BoundRepeatLoop {
        let getUntilExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (repeatLoop.untilExpression) {
            const { untilExpression } = repeatLoop;
            getUntilExpression = (parent) => this.bindExpression(parent, untilExpression);
        }

        return this.repeatLoop(parent,
            getUntilExpression,
            (parent) => this.bindStatements(parent, repeatLoop.statements),
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
        }
        boundRepeatLoop.statements = getStatements(boundRepeatLoop);

        return boundRepeatLoop;
    }

    // #endregion

    // #region For loop

    private bindNumericForLoop(
        parent: BoundNodes,
        numericForLoop: NumericForLoop,
    ): BoundForLoop {
        const { indexVariable } = numericForLoop;
        if (indexVariable.kind === TokenKind.Missing) {
            throw new Error(`Index variable is missing.`);
        }

        let getFirstValueStatement: GetBoundNode<BoundStatements>;
        if (numericForLoop.localKeyword) {
            const { localKeyword } = numericForLoop;
            const operator = numericForLoop.operator as MissableToken<EqualsSignToken | ColonEqualsSignToken>;

            getFirstValueStatement = (parent) => this.dataDeclarationStatement(parent,
                (parent) => this.dataDeclaration(parent,
                    {
                        name: this.getIdentifierText(indexVariable),
                        declarationKind: localKeyword.kind,
                        operator: operator.kind,
                        getTypeAnnotation: (parent) => this.bindTypeAnnotation(parent, numericForLoop.typeAnnotation),
                        getExpression: (parent) => this.bindExpression(parent, numericForLoop.firstValueExpression),
                    },
                ),
            );
        } else {
            const operator = numericForLoop.operator as MissableToken<AssignmentOperatorToken>;
            if (operator.kind === TokenKind.Missing) {
                throw new Error(`Missing assignment operator.`);
            }

            getFirstValueStatement = (parent) => this.assignmentStatement(parent,
                (parent) => this.identifierExpression(parent,
                    (parent) => this.resolveIdentifier(parent, indexVariable),
                ),
                operator.kind,
                (parent) => this.bindExpression(parent, numericForLoop.firstValueExpression),
            );
        }

        let getStepValueExpression: GetBoundNode<BoundExpressions>;
        if (numericForLoop.stepValueExpression) {
            const { stepValueExpression } = numericForLoop;
            getStepValueExpression = (parent) => this.bindExpression(parent, stepValueExpression)
        } else {
            getStepValueExpression = (parent) => this.integerLiteral(parent, '1');
        }

        return this.forLoop(parent,
            getFirstValueStatement,
            (parent) => this.binaryExpression(parent,
                (parent) => this.identifierExpression(parent,
                    (parent) => this.resolveIdentifier(parent, indexVariable),
                ),
                this.getComparisonExpressionOperator(numericForLoop),
                (parent) => this.bindExpression(parent, numericForLoop.lastValueExpression),
            ),
            (parent) => this.assignmentStatement(parent,
                (parent) => this.identifierExpression(parent,
                    (parent) => this.resolveIdentifier(parent, indexVariable),
                ),
                TokenKind.PlusSignEqualsSign,
                getStepValueExpression,
            ),
            (parent) => this.bindStatements(parent, numericForLoop.statements),
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
                    return TokenKind.GreaterThanSignEqualsSign;
                }

                return TokenKind.LessThanSignEqualsSign;
            }
            case TokenKind.UntilKeyword: {
                if (numericForLoop.stepValueExpression &&
                    numericForLoop.stepValueExpression.kind === NodeKind.UnaryExpression &&
                    numericForLoop.stepValueExpression.operator.kind === TokenKind.HyphenMinus
                ) {
                    return TokenKind.GreaterThanSign;
                }

                return TokenKind.LessThanSign;
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
    ): BoundStatements[] {
        const boundStatements: BoundStatements[] = [];

        // Temporarily set `parent` of the expression to our current parent. As `parent` is used for symbol resolution,
        // this still works out fine even if it's not strictly correct.
        const boundCollectionExpression = this.bindExpression(parent, forEachInLoop.collectionExpression);

        switch (boundCollectionExpression.type.kind) {
            case TypeKind.String:
            case TypeKind.Array: {
                const boundCollectionDeclarationStatement = this.dataDeclarationStatement(parent,
                    (parent) => this.dataDeclaration(parent,
                        {
                            getExpression: (parent) => {
                                boundCollectionExpression.parent = parent;

                                return boundCollectionExpression;
                            },
                        },
                    ),
                );
                boundStatements.push(boundCollectionDeclarationStatement);

                const firstValueStatement = this.dataDeclarationStatement(parent,
                    (parent) => this.dataDeclaration(parent,
                        {
                            getExpression: (parent) => this.integerLiteral(parent, '0'),
                        },
                    ),
                );
                boundStatements.push(firstValueStatement);

                const boundIndexDeclaration = firstValueStatement.dataDeclaration;
                const boundCollectionDeclaration = boundCollectionDeclarationStatement.dataDeclaration;

                const boundWhileLoop = new BoundWhileLoop();
                boundWhileLoop.parent = parent;

                boundWhileLoop.expression = this.binaryExpression(boundWhileLoop,
                    (parent) => this.identifierExpression(parent, boundIndexDeclaration),
                    TokenKind.LessThanSign,
                    (parent) => this.invokeExpression(parent,
                        (parent) => this.scopeMemberAccessExpression(parent,
                            (parent) => this.identifierExpression(parent, boundCollectionDeclaration),
                            (parent, scope) => this.identifierExpressionFromName(parent,
                                'Length',
                                scope,
                            ),
                        ),
                        () => [],
                    ),
                );

                boundWhileLoop.statements = [];

                if (forEachInLoop.localKeyword) {
                    const operator = forEachInLoop.operator as MissableToken<EqualsSignToken | ColonEqualsSignToken>;

                    const indexVariableStatement = this.dataDeclarationStatement(boundWhileLoop,
                        (parent) => this.dataDeclaration(parent,
                            {
                                name: this.getIdentifierText(forEachInLoop.indexVariable),
                                operator: operator.kind,
                                getTypeAnnotation: (parent) => this.bindTypeAnnotation(parent, forEachInLoop.typeAnnotation),
                                getExpression: (parent) => this.indexExpression(parent,
                                    (parent) => this.identifierExpression(parent, boundCollectionDeclaration),
                                    (parent) => this.identifierExpression(parent, boundIndexDeclaration),
                                ),
                            },
                        ),
                    );
                    boundWhileLoop.statements.push(indexVariableStatement);
                } else {
                    const operator = forEachInLoop.operator as MissableToken<AssignmentOperatorToken>;
                    if (operator.kind === TokenKind.Missing) {
                        throw new Error(`Missing assignment operator.`);
                    }

                    const indexVariableStatement = this.assignmentStatement(boundWhileLoop,
                        (parent) => this.identifierExpression(parent, boundIndexDeclaration),
                        operator.kind,
                        (parent) => this.indexExpression(parent,
                            (parent) => this.identifierExpression(parent, boundCollectionDeclaration),
                            (parent) => this.identifierExpression(parent, boundIndexDeclaration),
                        ),
                    );
                    boundWhileLoop.statements.push(indexVariableStatement);
                }

                const incrementStatement = this.assignmentStatement(boundWhileLoop,
                    (parent) => this.identifierExpression(parent, boundIndexDeclaration),
                    TokenKind.PlusSignEqualsSign,
                    (parent) => this.integerLiteral(parent, '1'),
                );
                boundWhileLoop.statements.push(incrementStatement);

                const boundWhileLoopStatements = this.bindStatements(boundWhileLoop, forEachInLoop.statements);
                boundWhileLoop.statements.push(...boundWhileLoopStatements);

                boundStatements.push(boundWhileLoop);
                break;
            }
            case TypeKind.Object: {
                const boundCollectionDeclarationStatement = this.dataDeclarationStatement(parent,
                    (parent) => this.dataDeclaration(parent,
                        {
                            getExpression: (parent) => this.invokeExpression(parent,
                                (parent) => this.scopeMemberAccessExpression(parent,
                                    (parent) => {
                                        boundCollectionExpression.parent = parent;

                                        return boundCollectionExpression;
                                    },
                                    (parent, scope) => this.identifierExpressionFromName(parent,
                                        'ObjectEnumerator',
                                        scope,
                                    ),
                                ),
                                () => [],
                            ),
                        },
                    ),
                );
                boundStatements.push(boundCollectionDeclarationStatement);

                const boundEnumeratorDeclaration = boundCollectionDeclarationStatement.dataDeclaration;

                const boundWhileLoop = new BoundWhileLoop();
                boundWhileLoop.parent = parent;

                boundWhileLoop.expression = this.invokeExpression(boundWhileLoop,
                    (parent) => this.scopeMemberAccessExpression(parent,
                        (parent) => this.identifierExpression(parent, boundEnumeratorDeclaration),
                        (parent, scope) => this.identifierExpressionFromName(parent,
                            'HasNext',
                            scope,
                        ),
                    ),
                    () => [],
                );

                boundWhileLoop.statements = [];

                const { indexVariable } = forEachInLoop;
                if (indexVariable.kind === TokenKind.Missing) {
                    throw new Error(`Index variable is missnig.`);
                }

                if (forEachInLoop.localKeyword) {
                    const operator = forEachInLoop.operator as MissableToken<EqualsSignToken | ColonEqualsSignToken>;

                    const indexVariableStatement = this.dataDeclarationStatement(boundWhileLoop,
                        (parent) => this.dataDeclaration(parent,
                            {
                                name: this.getIdentifierText(indexVariable),
                                operator: operator.kind,
                                getTypeAnnotation: (parent) => this.bindTypeAnnotation(parent, forEachInLoop.typeAnnotation),
                                getExpression: (parent) => this.invokeExpression(parent,
                                    (parent) => this.scopeMemberAccessExpression(parent,
                                        (parent) => this.identifierExpression(parent, boundEnumeratorDeclaration),
                                        (parent, scope) => this.identifierExpressionFromName(parent,
                                            'NextObject',
                                            scope,
                                        ),
                                    ),
                                    () => [],
                                ),
                            },
                        ),
                    );
                    boundWhileLoop.statements.push(indexVariableStatement);
                } else {
                    const operator = forEachInLoop.operator as MissableToken<AssignmentOperatorToken>;
                    if (operator.kind === TokenKind.Missing) {
                        throw new Error(`Missing assignment operator.`);
                    }

                    const indexVariableStatement = this.assignmentStatement(boundWhileLoop,
                        (parent) => this.identifierExpression(parent,
                            (parent) => this.resolveIdentifier(parent, indexVariable),
                        ),
                        operator.kind,
                        (parent) => this.invokeExpression(parent,
                            (parent) => this.scopeMemberAccessExpression(parent,
                                (parent) => this.identifierExpression(parent, boundEnumeratorDeclaration),
                                (parent, scope) => this.identifierExpressionFromName(parent,
                                    'NextObject',
                                    scope,
                                ),
                            ),
                            () => [],
                        ),
                    );
                    boundWhileLoop.statements.push(indexVariableStatement);
                }

                const boundWhileLoopStatements = this.bindStatements(boundWhileLoop, forEachInLoop.statements);
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
    ): BoundThrowStatement {
        return this.throwStatement(parent,
            (parent) => this.bindExpression(parent, throwStatement.expression),
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
    ): BoundTryStatement {
        return this.tryStatement(parent,
            (parent) => this.bindStatements(parent, tryStatement.statements),
            (parent) => tryStatement.catchClauses.map((catchClause) =>
                this.bindCatchClause(parent, catchClause)
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
    ): BoundCatchClause {
        let getParameter: GetBoundNode<BoundDataDeclaration>;
        switch (catchClause.parameter.kind) {
            case NodeKind.DataDeclaration: {
                const { parameter } = catchClause;
                getParameter = (parent) => this.bindDataDeclaration(parent, parameter);
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
            (parent) => this.bindStatements(parent, catchClause.statements),
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
    ): BoundAssignmentStatement {
        return this.assignmentStatement(parent,
            (parent) => this.bindExpression(parent, assignmentStatement.leftOperand),
            assignmentStatement.operator.kind,
            (parent) => this.bindExpression(parent, assignmentStatement.rightOperand),
        );
    }

    private assignmentStatement(
        parent: BoundNodes,
        getLeftOperand: GetBoundNode<BoundExpressions>,
        operator: BoundAssignmentStatement['operator'],
        getRightOperand: GetBoundNode<BoundExpressions>,
    ): BoundAssignmentStatement {
        const boundAssignmentStatement = new BoundAssignmentStatement();
        boundAssignmentStatement.parent = parent;
        boundAssignmentStatement.leftOperand = getLeftOperand(boundAssignmentStatement);
        boundAssignmentStatement.operator = operator;
        boundAssignmentStatement.rightOperand = getRightOperand(boundAssignmentStatement);

        const { leftOperand, rightOperand } = boundAssignmentStatement;

        // Lower update assignments to an assignment of a binary expression
        if (operator !== TokenKind.EqualsSign) {
            boundAssignmentStatement.rightOperand = this.binaryExpression(boundAssignmentStatement,
                (parent) => getLeftOperand(parent),
                this.getBinaryExpressionOperatorKind(operator),
                (parent) => getRightOperand(parent),
            );
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

    private getBinaryExpressionOperatorKind(assignmentStatementOperatorKind: Exclude<AssignmentOperatorToken, EqualsSignToken>['kind']) {
        switch (assignmentStatementOperatorKind) {
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
                return assertNever(assignmentStatementOperatorKind);
            }
        }
    }

    // #endregion

    // #region Expression statement

    private bindExpressionStatement(
        parent: BoundNodes,
        expressionStatement: ExpressionStatement,
    ): BoundExpressionStatement {
        return this.expressionStatement(parent,
            (parent) => this.bindExpression(parent, expressionStatement.expression),
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
        expression: MissableExpression,
        scope?: BoundMemberContainerDeclaration,
    ) {
        switch (expression.kind) {
            case NodeKind.BinaryExpression: {
                return this.bindBinaryExpression(parent, expression);
            }
            case NodeKind.UnaryExpression: {
                return this.bindUnaryExpression(parent, expression);
            }
            case NodeKind.NewExpression: {
                return this.bindNewExpression(parent, expression);
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
                return this.bindArrayLiteralExpression(parent, expression);
            }
            case NodeKind.GlobalScopeExpression: {
                return this.bindGlobalScopeExpression(parent);
            }
            case NodeKind.IdentifierExpression: {
                return this.bindIdentifierExpression(parent, expression, scope);
            }
            case NodeKind.GroupingExpression: {
                return this.bindGroupingExpression(parent, expression);
            }
            case NodeKind.ScopeMemberAccessExpression: {
                return this.bindScopeMemberAccessExpression(parent, expression, scope);
            }
            case NodeKind.IndexExpression: {
                return this.bindIndexExpression(parent, expression);
            }
            case NodeKind.SliceExpression: {
                return this.bindSliceExpression(parent, expression);
            }
            case NodeKind.InvokeExpression: {
                return this.bindInvokeExpression(parent, expression, scope);
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
    ): BoundBinaryExpression {
        return this.binaryExpression(parent,
            (parent) => this.bindExpression(parent, expression.leftOperand),
            expression.operator.kind,
            (parent) => this.bindExpression(parent, expression.rightOperand),
        );
    }

    private binaryExpression(
        parent: BoundNodes,
        getLeftOperand: (parent: BoundBinaryExpression) => BoundExpressions,
        operator: BinaryExpressionOperatorToken['kind'],
        getRightOperand: (parent: BoundBinaryExpression) => BoundExpressions,
    ): BoundBinaryExpression {
        const boundBinaryExpression = new BoundBinaryExpression();
        boundBinaryExpression.parent = parent;
        boundBinaryExpression.leftOperand = getLeftOperand(boundBinaryExpression);
        boundBinaryExpression.operator = operator;
        boundBinaryExpression.rightOperand = getRightOperand(boundBinaryExpression);
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
        parent: BoundNodes,
        expression: UnaryExpression,
    ): BoundUnaryExpression {
        return this.unaryExpression(parent,
            expression.operator.kind,
            (parent) => this.bindExpression(parent, expression.operand),
        );
    }

    private unaryExpression(
        parent: BoundNodes,
        operator: UnaryOperatorToken['kind'],
        getOperand: GetBoundNode<BoundExpressions>,
    ): BoundUnaryExpression {
        const boundUnaryExpression = new BoundUnaryExpression();
        boundUnaryExpression.parent = parent;
        boundUnaryExpression.operator = operator;
        boundUnaryExpression.operand = getOperand(boundUnaryExpression);
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
        parent: BoundNodes,
        newExpression: NewExpression,
    ): BoundNewExpression {
        return this.newExpression(parent,
            (parent) => this.bindTypeReference(parent, newExpression.type,
                BoundNodeKind.ExternClassDeclaration,
                BoundNodeKind.ClassDeclaration,
            ),
        );
    }

    private newExpression(
        parent: BoundNodes,
        getBoundClassLikeDeclaration: GetBoundNode<BoundExternClassDeclaration | BoundClassDeclaration>,
    ): BoundNewExpression {
        const boundNewExpression = new BoundNewExpression();
        boundNewExpression.parent = parent;
        boundNewExpression.typeReference = getBoundClassLikeDeclaration(boundNewExpression);

        const constructorGroup = boundNewExpression.typeReference.locals.getDeclaration('New',
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
            expression.value.getText(this.document),
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

        const classDeclaration = this.getNearestAncestor(boundSelfExpression, BoundNodeKind.ClassDeclaration)!;
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

        const classDeclaration = this.getNearestAncestor(boundSuperExpression, BoundNodeKind.ClassDeclaration)!;
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
        return this.stringLiteral(parent,
            Evaluator.evalStringLiteral(expression, this.document),
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
            expression.value.getText(this.document),
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
        integerLiteralExpression: IntegerLiteralExpression,
    ): BoundIntegerLiteralExpression {
        return this.integerLiteral(parent,
            integerLiteralExpression.value.getText(this.document),
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
        arrayLiteralExpression: ArrayLiteralExpression,
    ): BoundArrayLiteralExpression {
        return this.arrayLiteralExpression(parent,
            (parent) => this.bindExpressionSequence(parent, arrayLiteralExpression.expressions),
        );
    }

    private arrayLiteralExpression(
        parent: BoundNodes,
        getExpressions: (parent: BoundNodes) => BoundExpressions[],
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
        boundGlobalScopeExpression.type = this.module.type;

        return boundGlobalScopeExpression;
    }

    // #endregion

    // #region Identifier expression

    private bindIdentifierExpression(
        parent: BoundNodes,
        identifierExpression: IdentifierExpression,
        scope?: BoundMemberContainerDeclaration,
    ): BoundIdentifierExpression {
        let getTypeArguments: GetBoundNodes<BoundTypeReferenceDeclaration> | undefined = undefined;
        if (identifierExpression.typeArguments) {
            const { typeArguments } = identifierExpression;
            getTypeArguments = (parent) => this.bindTypeReferenceSequence(parent, typeArguments);
        }

        return this.identifierExpression(parent,
            (parent) => this.resolveIdentifier(
                parent,
                identifierExpression.identifier,
                scope,
                getTypeArguments,
            ),
        );
    }

    private identifierExpression(
        parent: BoundNodes,
        declaration_getDeclaration: BoundIdentifiableDeclaration | GetBoundNode<BoundIdentifiableDeclaration>,
    ): BoundIdentifierExpression {
        const boundIdentifierExpression = new BoundIdentifierExpression();
        boundIdentifierExpression.parent = parent;

        let declaration: BoundIdentifiableDeclaration;
        if (typeof declaration_getDeclaration === 'function') {
            declaration = declaration_getDeclaration(boundIdentifierExpression);
        } else {
            declaration = declaration_getDeclaration;
        }

        boundIdentifierExpression.identifier = declaration.identifier;

        if (declaration.kind !== BoundNodeKind.Directory) {
            boundIdentifierExpression.type = declaration.type;
        }

        return boundIdentifierExpression;
    }

    private identifierExpressionFromName(
        parent: BoundNodes,
        name: string,
        scope: BoundMemberContainerDeclaration,
    ): BoundIdentifierExpression {
        const boundIdentifierExpression = new BoundIdentifierExpression();
        boundIdentifierExpression.parent = parent;

        const member = this.resolveIdentifierName(boundIdentifierExpression, name, scope) as BoundTypeReferenceDeclaration;
        boundIdentifierExpression.identifier = member.identifier;
        boundIdentifierExpression.type = member.type;

        return boundIdentifierExpression;
    }

    // #endregion

    // #region Grouping expression

    private bindGroupingExpression(
        parent: BoundNodes,
        groupingExpression: GroupingExpression,
    ): BoundGroupingExpression {
        return this.groupingExpression(parent,
            (parent) => this.bindExpression(parent, groupingExpression.expression),
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
        scopeMemberAccessExpression: ScopeMemberAccessExpression,
        scope?: BoundMemberContainerDeclaration,
    ): BoundScopeMemberAccessExpression {
        return this.scopeMemberAccessExpression(parent,
            (parent) => this.bindExpression(parent,
                scopeMemberAccessExpression.scopableExpression,
                scope,
            ),
            (parent, scope) => this.bindExpression(parent,
                scopeMemberAccessExpression.member,
                scope,
            ),
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
        indexExpression: IndexExpression,
    ): BoundIndexExpression {
        return this.indexExpression(parent,
            (parent) => this.bindExpression(parent, indexExpression.indexableExpression),
            (parent) => this.bindExpression(parent, indexExpression.indexExpressionExpression),
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
        parent: BoundNodes,
        sliceExpression: SliceExpression,
    ): BoundSliceExpression {
        let getStartExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (sliceExpression.startExpression) {
            const { startExpression } = sliceExpression;
            getStartExpression = (parent) => this.bindExpression(parent, startExpression);
        }

        let getEndExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (sliceExpression.endExpression) {
            const { endExpression } = sliceExpression;
            getEndExpression = (parent) => this.bindExpression(parent, endExpression);
        }

        return this.sliceExpression(parent,
            (parent) => this.bindExpression(parent, sliceExpression.sliceableExpression),
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
        scope?: BoundMemberContainerDeclaration,
    ): BoundInvokeExpression {
        return this.invokeExpression(parent,
            (parent) => this.bindExpression(parent, expression.invokableExpression, scope),
            (parent) => this.bindExpressionSequence(parent, expression.arguments),
        );
    }

    private invokeExpression(
        parent: BoundNodes,
        getInvokableExpression: GetBoundNode<BoundExpressions>,
        getArguments: GetBoundNodes<BoundExpressions>,
    ): BoundInvokeExpression {
        const boundInvokeExpression = new BoundInvokeExpression();
        boundInvokeExpression.parent = parent;
        boundInvokeExpression.invokableExpression = getInvokableExpression(boundInvokeExpression);
        boundInvokeExpression.arguments = getArguments(boundInvokeExpression);

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
        overloads: BoundFunctionLikeGroupDeclaration['overloads'],
        args: BoundExpressions[],
    ): BoundFunctionLikeDeclaration {
        // Search for an exact match (cannot use default parameters)
        for (const [, overload] of overloads) {
            const params = overload.parameters;
            if (args.length === params.length) {
                let match = true;

                for (let i = 0; i < args.length; i++) {
                    if (args[i].type !== params[i].type) {
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
        for (const [, overload] of overloads) {
            // TODO: Support default parameters
            const params = overload.parameters;
            if (args.length === params.length) {
                let match = true;

                for (let i = 0; i < args.length; i++) {
                    if (!args[i].type.isConvertibleTo(params[i].type)) {
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
        parent: BoundNodes,
        expressions: (MissableExpression | CommaSeparator)[],
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
                    const boundExpression = this.bindExpression(parent, expression);
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
                    (openType.typeParameters || openType.typeArguments)
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
        instantiatedType.superType = openType.superType;
        instantiatedType.nativeSymbol = openType.nativeSymbol;

        for (const [, identifier] of openType.locals) {
            // TODO: Investigate parameterizing `BoundSymbol.declaration` for improved type checking.
            const declaration = identifier.declaration as BoundExternClassDeclarationMember;
            switch (declaration.kind) {
                // We can skip these since we know `Array` doesn't have these kinds of members.
                case BoundNodeKind.ExternDataDeclaration:
                case BoundNodeKind.ExternFunctionGroupDeclaration: {
                    break;
                }
                // TODO: Should these be cloned anyway even though they don't take a generic type parameter?
                case BoundNodeKind.ExternClassMethodGroupDeclaration: {
                    instantiatedType.locals.set(identifier);
                    break;
                }
                default: {
                    assertNever(declaration);
                    break;
                }
            }
        }

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

    @traceInstantiating(BoundNodeKind.ClassDeclaration)
    private instantiateGenericType(
        openType: BoundClassDeclaration,
        typeMap: TypeMap,
    ): BoundClassDeclaration {
        const typeParameters = Array.from(typeMap.keys());
        const typeArguments = Array.from(typeMap.values());

        if (areElementsSame(typeParameters, typeArguments,
            (typeParameter, typeArgument) => typeParameter === typeArgument,
        )) {
            return openType;
        }

        const rootType = openType.rootType!;
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
        instantiatedType.parent = openType.parent;
        instantiatedType.type = new ObjectType(instantiatedType);
        instantiatedType.identifier = new BoundSymbol(openType.identifier.name, instantiatedType);
        instantiatedType.typeArguments = typeArguments;
        instantiatedType.rootType = rootType;
        instantiatedTypes.push(instantiatedType);

        if (openType.superType) {
            instantiatedType.superType = this.instantiateType(
                openType.superType,
                typeMap,
            ) as BoundExternClassDeclaration | BoundClassDeclaration;
        }

        if (openType.implementedTypes) {
            instantiatedType.implementedTypes = [...openType.implementedTypes];
        }

        for (const [, member] of openType.locals) {
            const declaration = member.declaration as BoundClassDeclarationMember | BoundTypeParameter;
            switch (declaration.kind) {
                case BoundNodeKind.DataDeclaration: {
                    this.instantiateDataDeclaration(instantiatedType, declaration, typeMap);
                    break;
                }
                case BoundNodeKind.FunctionGroupDeclaration: {
                    this.instantiateFunctionGroupDeclaration(instantiatedType, declaration, typeMap);
                    break;
                }
                case BoundNodeKind.ClassMethodGroupDeclaration: {
                    this.instantiateClassMethodGroupDeclaration(instantiatedType, declaration, typeMap);
                    break;
                }
                case BoundNodeKind.TypeParameter: { break; }
                default: {
                    assertNever(declaration);
                    break;
                }
            }
        }

        return instantiatedType;
    }

    // #region Instantiate data declaration

    @traceInstantiating(BoundNodeKind.DataDeclaration)
    private instantiateDataDeclaration(
        parent: BoundNodes,
        boundDataDeclaration: BoundDataDeclaration,
        typeMap: TypeMap,
    ): BoundDataDeclaration {
        const { name } = boundDataDeclaration.identifier;

        let scope: Scope | undefined;
        if (this.isScope(parent)) {
            scope = parent;
        } else {
            scope = this.getScope(parent);
            if (!scope) {
                throw new Error(`Could not find scope for '${name}'.`);
            }
        }

        let instantiatedDataDeclaration = scope.locals.getDeclaration(name, BoundNodeKind.DataDeclaration);
        if (instantiatedDataDeclaration) {
            return instantiatedDataDeclaration;
        }

        let getTypeAnnotation: GetBoundNode<BoundTypeReferenceDeclaration> | undefined = undefined;
        if (boundDataDeclaration.typeAnnotation) {
            const { typeAnnotation } = boundDataDeclaration;
            getTypeAnnotation = () => this.instantiateType(typeAnnotation, typeMap);
        }

        let getExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (boundDataDeclaration.expression) {
            const { expression } = boundDataDeclaration;
            getExpression = (parent) => this.instantiateExpression(parent, expression, typeMap);
        }

        instantiatedDataDeclaration = this.dataDeclaration(parent,
            {
                name,
                declarationKind: boundDataDeclaration.declarationKind,
                operator: boundDataDeclaration.operator,
                getTypeAnnotation,
                getExpression,
            },
        );

        return instantiatedDataDeclaration;
    }

    // #endregion

    // #region Instantiate function declaration

    @traceInstantiating(BoundNodeKind.FunctionGroupDeclaration)
    private instantiateFunctionGroupDeclaration(
        parent: BoundClassDeclaration,
        boundFunctionGroupDeclaration: BoundFunctionGroupDeclaration,
        typeMap: TypeMap,
    ): BoundFunctionGroupDeclaration {
        const { name } = boundFunctionGroupDeclaration.identifier;

        const instantiatedFunctionGroupDeclaration = new BoundFunctionGroupDeclaration();
        instantiatedFunctionGroupDeclaration.parent = parent;
        instantiatedFunctionGroupDeclaration.type = new FunctionGroupType(instantiatedFunctionGroupDeclaration);
        instantiatedFunctionGroupDeclaration.identifier = new BoundSymbol(name, instantiatedFunctionGroupDeclaration);
        parent.locals.set(instantiatedFunctionGroupDeclaration.identifier);

        for (const [, overload] of boundFunctionGroupDeclaration.overloads) {
            this.instantiateFunctionDeclaration(instantiatedFunctionGroupDeclaration, overload, typeMap);
        }

        return instantiatedFunctionGroupDeclaration;
    }

    @traceInstantiating(BoundNodeKind.FunctionDeclaration)
    private instantiateFunctionDeclaration(
        parent: BoundFunctionGroupDeclaration,
        boundFunctionDeclaration: BoundFunctionDeclaration,
        typeMap: TypeMap,
    ): BoundFunctionDeclaration {
        const { name } = boundFunctionDeclaration.identifier;

        const instantiatedFunctionDeclaration = new BoundFunctionDeclaration();
        instantiatedFunctionDeclaration.declaration = boundFunctionDeclaration.declaration;
        parent.overloads.set(instantiatedFunctionDeclaration);
        instantiatedFunctionDeclaration.parent = parent;
        instantiatedFunctionDeclaration.identifier = new BoundSymbol(name, instantiatedFunctionDeclaration);
        instantiatedFunctionDeclaration.type = new FunctionType(instantiatedFunctionDeclaration);
        instantiatedFunctionDeclaration.returnType = this.instantiateType(boundFunctionDeclaration.returnType, typeMap);
        instantiatedFunctionDeclaration.parameters = boundFunctionDeclaration.parameters.map((parameter) =>
            this.instantiateDataDeclaration(instantiatedFunctionDeclaration, parameter, typeMap)
        );
        instantiatedFunctionDeclaration.statements = boundFunctionDeclaration.statements.map((statement) =>
            this.instantiateStatement(instantiatedFunctionDeclaration, statement, typeMap)
        );

        return instantiatedFunctionDeclaration;
    }

    // #endregion

    // #region Instantiate class method declaration

    @traceInstantiating(BoundNodeKind.ClassMethodGroupDeclaration)
    private instantiateClassMethodGroupDeclaration(
        parent: BoundClassDeclaration,
        boundClassMethodGroupDeclaration: BoundClassMethodGroupDeclaration,
        typeMap: TypeMap,
    ): BoundClassMethodGroupDeclaration {
        const { name } = boundClassMethodGroupDeclaration.identifier;

        let instantiatedClassMethodGroupDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ClassMethodGroupDeclaration);
        if (instantiatedClassMethodGroupDeclaration) {
            return instantiatedClassMethodGroupDeclaration;
        }

        instantiatedClassMethodGroupDeclaration = new BoundClassMethodGroupDeclaration();
        instantiatedClassMethodGroupDeclaration.parent = parent;
        instantiatedClassMethodGroupDeclaration.type = new MethodGroupType(instantiatedClassMethodGroupDeclaration);
        instantiatedClassMethodGroupDeclaration.identifier = new BoundSymbol(name, instantiatedClassMethodGroupDeclaration);
        parent.locals.set(instantiatedClassMethodGroupDeclaration.identifier);

        for (const [, overload] of boundClassMethodGroupDeclaration.overloads) {
            this.instantiateClassMethodDeclaration(instantiatedClassMethodGroupDeclaration, overload, typeMap);
        }

        return instantiatedClassMethodGroupDeclaration;
    }

    @traceInstantiating(BoundNodeKind.ClassMethodDeclaration)
    private instantiateClassMethodDeclaration(
        parent: BoundClassMethodGroupDeclaration,
        boundClassMethodDeclaration: BoundClassMethodDeclaration,
        typeMap: TypeMap,
    ): BoundClassMethodDeclaration {
        const instantiatedClassMethodDeclaration = new BoundClassMethodDeclaration();
        instantiatedClassMethodDeclaration.declaration = boundClassMethodDeclaration.declaration;
        parent.overloads.set(instantiatedClassMethodDeclaration);
        instantiatedClassMethodDeclaration.parent = parent;
        instantiatedClassMethodDeclaration.type = new MethodType(instantiatedClassMethodDeclaration);
        instantiatedClassMethodDeclaration.identifier = new BoundSymbol(boundClassMethodDeclaration.identifier.name, instantiatedClassMethodDeclaration);
        instantiatedClassMethodDeclaration.returnType = this.instantiateType(boundClassMethodDeclaration.returnType, typeMap);
        instantiatedClassMethodDeclaration.parameters = boundClassMethodDeclaration.parameters.map((parameter) =>
            this.instantiateDataDeclaration(instantiatedClassMethodDeclaration, parameter, typeMap)
        );

        if (boundClassMethodDeclaration.statements) {
            instantiatedClassMethodDeclaration.statements = boundClassMethodDeclaration.statements.map((statement) =>
                this.instantiateStatement(instantiatedClassMethodDeclaration, statement, typeMap)
            );
        }

        return instantiatedClassMethodDeclaration;
    }

    // #endregion

    // #region Instantiate statements

    private instantiateStatement(
        parent: BoundNodes,
        statement: BoundStatements,
        typeMap: TypeMap,
    ): BoundStatements {
        switch (statement.kind) {
            case BoundNodeKind.DataDeclarationStatement: {
                return this.dataDeclarationStatement(parent, (parent) =>
                    this.instantiateDataDeclaration(parent, statement.dataDeclaration, typeMap)
                );
            }
            case BoundNodeKind.ReturnStatement: {
                let getExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
                if (statement.expression) {
                    const { expression } = statement;
                    getExpression = (parent) => this.instantiateExpression(parent, expression, typeMap);
                }

                return this.returnStatement(parent, getExpression);
            }
            case BoundNodeKind.IfStatement: {
                let getElseIfClauses: GetBoundNodes<BoundElseIfClause> | undefined = undefined;
                if (statement.elseIfClauses) {
                    const { elseIfClauses } = statement;
                    getElseIfClauses = (parent) => elseIfClauses.map((elseIfClause) =>
                        this.elseIfClause(parent,
                            (parent) => this.instantiateExpression(parent, elseIfClause.expression, typeMap),
                            (parent) => elseIfClause.statements.map((statement) =>
                                this.instantiateStatement(parent, statement, typeMap)
                            ),
                        )
                    );
                }

                let getElseClause: GetBoundNode<BoundElseClause> | undefined = undefined;
                if (statement.elseClause) {
                    const { elseClause } = statement;
                    getElseClause = (parent) => this.elseClause(parent,
                        (parent) => elseClause.statements.map((statement) =>
                            this.instantiateStatement(parent, statement, typeMap)
                        ),
                    );
                }

                return this.ifStatement(parent,
                    (parent) => this.instantiateExpression(parent, statement.expression, typeMap),
                    (parent) => statement.statements.map((statement) =>
                        this.instantiateStatement(parent, statement, typeMap)
                    ),
                    getElseIfClauses,
                    getElseClause,
                );
            }
            case BoundNodeKind.SelectStatement: {
                let getDefaultClause: GetBoundNode<BoundDefaultClause> | undefined = undefined;
                if (statement.defaultClause) {
                    const { defaultClause } = statement;
                    getDefaultClause = (parent) => this.defaultClause(parent,
                        (parent) => defaultClause.statements.map((statement) =>
                            this.instantiateStatement(parent, statement, typeMap)
                        ),
                    );
                }

                return this.selectStatement(parent,
                    (parent) => statement.caseClauses.map((caseClause) =>
                        this.caseClause(parent,
                            (parent) => caseClause.expressions.map((expression) =>
                                this.instantiateExpression(parent, expression, typeMap)
                            ),
                            (parent) => caseClause.statements.map((statement) =>
                                this.instantiateStatement(parent, statement, typeMap)
                            ),
                        ),
                    ),
                    getDefaultClause,
                );
            }
            case BoundNodeKind.WhileLoop: {
                return this.whileLoop(parent,
                    (parent) => this.instantiateExpression(parent, statement.expression, typeMap),
                    (parent) => statement.statements.map((statement) =>
                        this.instantiateStatement(parent, statement, typeMap)
                    ),
                );
            }
            case BoundNodeKind.RepeatLoop: {
                let getUntilExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
                if (statement.untilExpression) {
                    const { untilExpression } = statement;
                    getUntilExpression = (parent) => this.instantiateExpression(parent, untilExpression, typeMap);
                }

                return this.repeatLoop(parent,
                    getUntilExpression,
                    (parent) => statement.statements.map((statement) =>
                        this.instantiateStatement(parent, statement, typeMap)
                    ),
                );
            }
            case BoundNodeKind.ForLoop: {
                return this.forLoop(parent,
                    (parent) => this.instantiateStatement(parent, statement.firstValueStatement, typeMap),
                    (parent) => this.instantiateExpression(parent, statement.lastValueExpression, typeMap),
                    (parent) => this.instantiateStatement(parent, statement.stepValueClause, typeMap) as BoundAssignmentStatement,
                    (parent) => statement.statements.map((statement) =>
                        this.instantiateStatement(parent, statement, typeMap)
                    ),
                );
            }
            case BoundNodeKind.ContinueStatement: {
                return this.continueStatement(parent);
            }
            case BoundNodeKind.ExitStatement: {
                return this.exitStatement(parent);
            }
            case BoundNodeKind.ThrowStatement: {
                return this.throwStatement(parent,
                    (parent) => this.instantiateExpression(parent, statement.expression, typeMap),
                );
            }
            case BoundNodeKind.TryStatement: {
                return this.tryStatement(parent,
                    (parent) => statement.statements.map((statement) =>
                        this.instantiateStatement(parent, statement, typeMap)
                    ),
                    (parent) => statement.catchClauses.map((catchClause) =>
                        this.catchClause(parent,
                            (parent) => this.instantiateDataDeclaration(parent, catchClause.parameter, typeMap),
                            (parent) => statement.statements.map((statement) =>
                                this.instantiateStatement(parent, statement, typeMap)
                            ),
                        )
                    ),
                );
            }
            case BoundNodeKind.AssignmentStatement: {
                return this.assignmentStatement(parent,
                    (parent) => this.instantiateExpression(parent, statement.leftOperand, typeMap),
                    statement.operator,
                    (parent) => this.instantiateExpression(parent, statement.rightOperand, typeMap),
                );
            }
            case BoundNodeKind.ExpressionStatement: {
                return this.expressionStatement(parent,
                    (parent) => this.instantiateExpression(parent, statement.expression, typeMap),
                );
            }
            default: {
                return assertNever(statement);
            }
        }
    }

    // #endregion

    // #region Instantiate expressions

    private instantiateExpression(
        parent: BoundNodes,
        expression: BoundExpressions,
        typeMap: TypeMap,
        scope?: BoundMemberContainerDeclaration,
    ): BoundExpressions {
        switch (expression.kind) {
            case BoundNodeKind.BinaryExpression: {
                return this.binaryExpression(parent,
                    (parent) => this.instantiateExpression(parent, expression.leftOperand, typeMap),
                    expression.operator,
                    (parent) => this.instantiateExpression(parent, expression.rightOperand, typeMap),
                );
            }
            case BoundNodeKind.UnaryExpression: {
                return this.unaryExpression(parent,
                    expression.operator,
                    (parent) => this.instantiateExpression(parent, expression.operand, typeMap),
                );
            }
            case BoundNodeKind.NewExpression: {
                return this.newExpression(parent,
                    () => this.instantiateType(
                        expression.typeReference,
                        typeMap,
                    ) as BoundExternClassDeclaration | BoundClassDeclaration,
                );
            }
            case BoundNodeKind.NullExpression: {
                return this.nullExpression(parent);
            }
            case BoundNodeKind.BooleanLiteralExpression: {
                return this.booleanLiteral(parent, expression.value);
            }
            case BoundNodeKind.SelfExpression: {
                return this.selfExpression(parent);
            }
            case BoundNodeKind.SuperExpression: {
                return this.superExpression(parent);
            }
            case BoundNodeKind.StringLiteralExpression: {
                return this.stringLiteral(parent, expression.value);
            }
            case BoundNodeKind.FloatLiteralExpression: {
                return this.floatLiteral(parent, expression.value);
            }
            case BoundNodeKind.IntegerLiteralExpression: {
                return this.integerLiteral(parent, expression.value);
            }
            case BoundNodeKind.ArrayLiteralExpression: {
                return this.arrayLiteralExpression(parent,
                    (parent) => expression.expressions.map((expression) =>
                        this.instantiateExpression(parent, expression, typeMap)
                    ),
                );
            }
            case BoundNodeKind.GlobalScopeExpression: {
                return this.globalScopeExpression(parent);
            }
            case BoundNodeKind.IdentifierExpression: {
                let instantiatedDeclaration: BoundIdentifiableDeclaration | GetBoundNode<BoundIdentifiableDeclaration>;

                const { declaration } = expression.identifier;
                switch (declaration.kind) {
                    case BoundNodeKind.IntrinsicType:
                    case BoundNodeKind.ExternClassDeclaration:
                    case BoundNodeKind.InterfaceDeclaration:
                    case BoundNodeKind.ClassDeclaration:
                    case BoundNodeKind.TypeParameter: {
                        instantiatedDeclaration = this.instantiateType(declaration, typeMap);
                        break;
                    }

                    case BoundNodeKind.DataDeclaration: {
                        if (scope) {
                            instantiatedDeclaration = this.instantiateDataDeclaration(scope, declaration, typeMap);
                        } else {
                            switch (declaration.parent!.kind) {
                                case BoundNodeKind.ModuleDeclaration:
                                case BoundNodeKind.ClassDeclaration: {
                                    const dataDeclarationParent = this.getNearestAncestor(parent,
                                        BoundNodeKind.ModuleDeclaration,
                                        BoundNodeKind.ClassDeclaration,
                                    )!;
                                    instantiatedDeclaration = this.instantiateDataDeclaration(dataDeclarationParent, declaration, typeMap);
                                    break;
                                }
                                default: {
                                    instantiatedDeclaration = (parent) => this.resolveIdentifierName(parent, expression.identifier.name, scope);
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    case BoundNodeKind.ClassMethodGroupDeclaration: {
                        const boundClassDeclaration = this.getNearestAncestor(parent, BoundNodeKind.ClassDeclaration)!;
                        instantiatedDeclaration = this.instantiateClassMethodGroupDeclaration(boundClassDeclaration, declaration, typeMap);
                        break;
                    }

                    case BoundNodeKind.ExternDataDeclaration:
                    case BoundNodeKind.ExternClassMethodGroupDeclaration:
                    case BoundNodeKind.ExternFunctionGroupDeclaration:
                    case BoundNodeKind.FunctionGroupDeclaration:
                    case BoundNodeKind.InterfaceMethodGroupDeclaration:
                    case BoundNodeKind.ClassMethodGroupDeclaration: {
                        instantiatedDeclaration = (parent) => this.resolveIdentifierName(parent, expression.identifier.name, scope);
                        break;
                    }

                    case BoundNodeKind.Directory:
                    case BoundNodeKind.ModuleDeclaration:
                    case BoundNodeKind.ExternFunctionDeclaration:
                    case BoundNodeKind.ExternClassMethodDeclaration:
                    case BoundNodeKind.FunctionDeclaration:
                    case BoundNodeKind.InterfaceMethodDeclaration:
                    case BoundNodeKind.ClassMethodDeclaration: {
                        throw new Error(`Could not resolve '${declaration.identifier.name}'. Resolving '${declaration.kind}' identifiers is not implemented.`);
                    }

                    default: {
                        instantiatedDeclaration = assertNever(declaration);
                        break;
                    }
                }

                return this.identifierExpression(parent, instantiatedDeclaration);
            }
            case BoundNodeKind.GroupingExpression: {
                return this.groupingExpression(parent,
                    (parent) => this.instantiateExpression(parent, expression.expression, typeMap),
                );
            }
            case BoundNodeKind.ScopeMemberAccessExpression: {
                return this.scopeMemberAccessExpression(parent,
                    (parent) => this.instantiateExpression(parent, expression.scopableExpression, typeMap, scope),
                    (parent, scope) => this.instantiateExpression(parent, expression.member, typeMap, scope),
                );
            }
            case BoundNodeKind.IndexExpression: {
                return this.indexExpression(parent,
                    (parent) => this.instantiateExpression(parent, expression.indexableExpression, typeMap),
                    (parent) => this.instantiateExpression(parent, expression.indexExpressionExpression, typeMap),
                );
            }
            case BoundNodeKind.SliceExpression: {
                let getStartExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
                if (expression.startExpression) {
                    const { startExpression } = expression;
                    getStartExpression = (parent) => this.instantiateExpression(parent, startExpression, typeMap);
                }

                let getEndExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
                if (expression.endExpression) {
                    const { endExpression } = expression;
                    getEndExpression = (parent) => this.instantiateExpression(parent, endExpression, typeMap);
                }

                return this.sliceExpression(parent,
                    (parent) => this.instantiateExpression(parent, expression.sliceableExpression, typeMap),
                    getStartExpression,
                    getEndExpression,
                );
            }
            case BoundNodeKind.InvokeExpression: {
                return this.invokeExpression(parent,
                    (parent) => this.instantiateExpression(parent, expression.invokableExpression, typeMap, scope),
                    (parent) => expression.arguments.map((argument) =>
                        this.instantiateExpression(parent, argument, typeMap)
                    ),
                );
            }
            default: {
                return assertNever(expression);
            }
        }
    }

    // #endregion

    // #endregion

    // #region Core

    // #region Type resolution

    private bindTypeAnnotation(
        node: BoundNodes,
        typeAnnotation: TypeAnnotation | undefined,
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
                return this.bindTypeReference(node, typeAnnotation.typeReference);
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
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind][] {
        const boundTypeReferences: BoundNodeKindToBoundNodeMap[TKind][] = [];

        for (const typeReference of typeReferenceSequence) {
            switch (typeReference.kind) {
                case NodeKind.TypeReference: {
                    const boundTypeReference = this.bindTypeReference(node, typeReference, ...kinds);
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
        typeReference: MissableTypeReference,
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind] {
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
                boundDeclaration = this.resolveTypeReference(node, typeReference, ...kinds);

                if (typeReference.typeArguments) {
                    switch (boundDeclaration.kind) {
                        case BoundNodeKind.IntrinsicType:
                        case BoundNodeKind.ExternClassDeclaration:
                        case BoundNodeKind.InterfaceDeclaration:
                        case BoundNodeKind.TypeParameter: {
                            throw new Error(`'${boundDeclaration.kind}' cannot be generic.`);
                        }
                    }

                    // const boundTypeArguments = this.bindTypeReferenceSequence(node, typeReference.typeArguments);
                    // const typeMap = this.createTypeMap(boundDeclaration, boundTypeArguments);
                    // boundDeclaration = this.instantiateGenericType(boundDeclaration, typeMap);
                }
                break;
            }
        }

        for (const { } of typeReference.arrayTypeAnnotations) {
            boundDeclaration = this.instantiateArrayType(boundDeclaration);
        }

        return boundDeclaration;
    }

    private resolveTypeReference<TKind extends BoundTypeReferenceDeclaration['kind']>(
        node: BoundNodes,
        typeReference: TypeReference,
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind] {
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

        const name = identifier.getText(this.document);

        // Module is specified
        if (typeReference.moduleIdentifier) {
            const moduleName = typeReference.moduleIdentifier.getText(this.document);
            let boundModuleDeclaration: BoundModuleDeclaration | undefined = undefined;
            for (const importedModule of this.module.importedModules) {
                if (areIdentifiersSame(moduleName, importedModule.identifier.name)) {
                    boundModuleDeclaration = importedModule;
                    break;
                }
            }

            if (!boundModuleDeclaration) {
                throw new Error(`The '${moduleName}' module is not imported.`);
            }

            const declaration = boundModuleDeclaration.locals.getDeclaration(name, ...kinds);
            if (!declaration) {
                throw new Error(`Could not find '${name}' in '${moduleName}'.`);
            }

            return declaration;
        }

        // If we're in a class, check if it's a type parameter
        let boundClassDeclaration: BoundClassDeclaration | undefined = undefined;
        if (node.kind === BoundNodeKind.ClassDeclaration) {
            boundClassDeclaration = node;
        } else {
            boundClassDeclaration = this.getNearestAncestor(node, BoundNodeKind.ClassDeclaration);
        }

        if (boundClassDeclaration &&
            boundClassDeclaration.typeParameters
        ) {
            const boundTypeParameter = boundClassDeclaration.locals.get(name);
            if (boundTypeParameter &&
                boundTypeParameter.declaration.kind === BoundNodeKind.TypeParameter
            ) {
                if (kinds.length) {
                    let match = false;

                    for (const kind of kinds) {
                        if (kind === BoundNodeKind.TypeParameter) {
                            match = true;
                            break;
                        }
                    }

                    if (!match) {
                        throw new Error(`Expected '${name}' to be '${kinds.join(',')}' but got '${boundTypeParameter.declaration.kind}'.`);
                    }
                }

                return boundTypeParameter.declaration;
            }
        }

        // Check if it's a type in this module
        const declaration = this.module.locals.getDeclaration(name, ...kinds);
        if (declaration) {
            return declaration;
        }

        // Check if it's a type in any imported modules
        for (const importedModule of this.module.importedModules) {
            const declaration = importedModule.locals.getDeclaration(name, ...kinds);
            if (declaration) {
                return declaration;
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

        throw new Error(`Could not find '${name}'.`);
    }

    // #endregion

    // #region Symbols

    getIdentifierText(identifier: MissableIdentifier | NewKeywordToken, document: string = this.document) {
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
        node: BoundNodes,
        identifier: IdentifierExpressionIdentifier,
        scope?: BoundMemberContainerDeclaration,
        getTypeArguments?: GetBoundNodes<BoundTypeReferenceDeclaration>,
    ) {
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

                    return this.resolveIdentifierName(node, identifierText, scope, getTypeArguments);
                }
            }
        } else {
            switch (identifier.kind) {
                case TokenKind.BoolKeyword: {
                    return this.project.boolTypeDeclaration;
                }
                case TokenKind.IntKeyword: {
                    return this.project.intTypeDeclaration;
                }
                case TokenKind.FloatKeyword: {
                    return this.project.floatTypeDeclaration;
                }
                case TokenKind.StringKeyword: {
                    return this.project.stringTypeDeclaration;
                }
                case TokenKind.Identifier:
                case TokenKind.ObjectKeyword:
                case TokenKind.ThrowableKeyword:
                case TokenKind.NewKeyword:
                case NodeKind.EscapedIdentifier: {
                    const identifierText = this.getIdentifierText(identifier);

                    return this.resolveIdentifierName(node, identifierText, scope, getTypeArguments);
                }
                default: {
                    return assertNever(identifier);
                }
            }
        }
    }

    private resolveIdentifierName(
        node: BoundNodes,
        name: string,
        scope?: BoundMemberContainerDeclaration,
        getTypeArguments?: GetBoundNodes<BoundTypeReferenceDeclaration>,
    ) {
        if (scope) {
            const declaration = this.resolveIdentifierOnScope(name, scope);
            if (!declaration) {
                throw new Error(`'${name}' does not exist on '${scope.type}'.`);
            }

            return declaration;
        } else {
            let declaration = this.resolveIdentifierFromNode(name, node);
            if (!declaration) {
                throw new Error(`Could not find '${name}'.`);
            }

            // Cast expression
            if (getTypeArguments) {
                if (declaration.kind !== BoundNodeKind.ClassDeclaration ||
                    !declaration.typeParameters
                ) {
                    throw new Error(`'${name}' is not a generic class.`);
                }

                const typeArguments = getTypeArguments(node);
                const typeMap = this.createTypeMap(declaration, typeArguments);
                declaration = this.instantiateGenericType(declaration, typeMap);
            }

            return declaration;
        }
    }

    private resolveIdentifierFromNode(
        name: string,
        node: BoundNodes,
    ): BoundIdentifiableDeclaration | undefined {
        let scope = this.getScope(node);
        while (scope) {
            const declaration = this.resolveIdentifierOnScope(name, scope);
            if (declaration) {
                return declaration;
            }

            switch (scope.kind) {
                case BoundNodeKind.ModuleDeclaration: {
                    for (const importedModule of this.module.importedModules) {
                        const declaration = this.resolveIdentifierOnScope(name, importedModule);
                        if (declaration) {
                            return declaration;
                        }
                    }
                    break;
                }
                case BoundNodeKind.ExternClassDeclaration:
                case BoundNodeKind.ClassDeclaration: {
                    let { superType } = scope;
                    while (superType) {
                        const declaration = this.resolveIdentifierOnScope(name, superType);
                        if (declaration) {
                            return declaration;
                        }

                        superType = superType.superType;
                    }
                    break;
                }
            }

            scope = this.getScope(scope);
        }
    }

    private resolveIdentifierOnScope(
        name: string,
        scope: Scope,
    ) {
        const identifier = scope.locals.get(name);
        if (identifier) {
            return identifier.declaration;
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

    private getNearestAncestor<TKind extends BoundNodeKind>(
        node: BoundNodes,
        ...kinds: TKind[]
    ): BoundNodeKindToBoundNodeMap[TKind] | undefined {
        let ancestor = node.parent;

        while (ancestor) {
            if (kinds.length === 0) {
                return ancestor;
            }

            for (const kind of kinds) {
                if (ancestor.kind === kind) {
                    return ancestor;
                }
            }

            ancestor = ancestor.parent;
        }
    }

    // #endregion
}

function areElementsSame<T1, T2>(arr1: T1[], arr2: T2[], compare: ((e1: T1, e2: T2) => boolean)) {
    if (arr1.length === arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (!compare(arr1[i], arr2[i])) {
            return false;
        }
    }

    return true;
}

export function getMethod(
    typeDeclaration: BoundMethodContainerDeclaration,
    name: string,
    checkReturnType: (type: Types) => boolean = () => true,
    ...parameters: Types[]
) {
    const member = typeDeclaration.locals.get(name);
    if (member) {
        switch (member.declaration.kind) {
            case BoundNodeKind.ExternClassMethodGroupDeclaration:
            case BoundNodeKind.InterfaceMethodGroupDeclaration:
            case BoundNodeKind.ClassMethodGroupDeclaration: {
                return getOverload(member.declaration.overloads, checkReturnType, ...parameters);
            }
        }
    }
}

function getOverload(
    overloads: BoundMethodGroupDeclaration['overloads'],
    checkReturnType: (type: Types) => boolean = () => true,
    ...parameters: Types[]
) {
    for (const [, overload] of overloads) {
        if (checkReturnType(overload.returnType.type)) {
            if (overload.parameters.length === parameters.length) {
                let match = true;

                for (let i = 0; i < overload.parameters.length; i++) {
                    if (overload.parameters[i].type !== parameters[i]) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    return overload;
                }
            }
        }
    }
}

type GetBoundNode<TBoundNode extends BoundNodes> = (parent: BoundNodes) => TBoundNode;
type GetBoundNodes<TBoundNode extends BoundNodes> = (parent: BoundNodes) => TBoundNode[];

class TypeMap extends Map<BoundTypeReferenceDeclaration, BoundTypeReferenceDeclaration> {
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

type BoundMethodContainerDeclaration =
    | BoundExternClassDeclaration
    | BoundInterfaceDeclaration
    | BoundClassDeclaration
    ;

