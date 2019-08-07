import { Evaluator } from '../Evaluator';
import { Project } from '../Project';
import { CommaSeparator } from '../Syntax/Node/CommaSeparator';
import { ClassDeclaration, ClassDeclarationMember, ClassMethodDeclaration } from '../Syntax/Node/Declaration/ClassDeclaration';
import { DataDeclaration, DataDeclarationKeywordToken, DataDeclarationSequence } from '../Syntax/Node/Declaration/DataDeclarationSequence';
import { TypeDeclaration } from '../Syntax/Node/Declaration/Declarations';
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
import { ParseTreeVisitor } from '../Syntax/ParseTreeVisitor';
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
import { TypeKind, Types } from './Type/Types';

export class Binder {
    // Debugging aid
    private filePath: string = undefined!;

    private document: string = undefined!;
    private project: Project = undefined!;
    private module: BoundModuleDeclaration = undefined!;

    bind(
        moduleDeclaration: ModuleDeclaration,
        project: Project,
        boundDirectory: BoundDirectory,
        moduleIdentifier: string,
    ): BoundModuleDeclaration {
        this.filePath = moduleDeclaration.filePath.substr(0, moduleDeclaration.filePath.lastIndexOf('.'));

        this.document = moduleDeclaration.document;
        this.project = project;

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
        this.project.diagnostics.traceBindingStart(BoundNodeKind.ModuleDeclaration, moduleIdentifier);

        const boundModuleDeclaration = new BoundModuleDeclaration();
        boundModuleDeclaration.declaration = moduleDeclaration;
        boundModuleDeclaration.project = project;
        boundModuleDeclaration.directory = boundDirectory;
        boundModuleDeclaration.type = new ModuleType(boundModuleDeclaration);

        boundModuleDeclaration.identifier = new BoundSymbol(moduleIdentifier, boundModuleDeclaration);
        boundDirectory.locals.set(boundModuleDeclaration.identifier);

        this.module = boundModuleDeclaration;
        this.project.cacheModule(boundModuleDeclaration);
        const monkeyModule = this.project.importModuleFromSource(boundModuleDeclaration.directory, ['monkey'], 'lang');
        this.module.importedModules.add(monkeyModule);

        this.bindModuleDeclarationHeaderMembers(moduleDeclaration.headerMembers);
        this.bindModuleDeclarationMembers(boundModuleDeclaration, moduleDeclaration.members);

        this.project.diagnostics.traceBindingEnd();

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
                    const name = this.getIdentifierText(member.identifier);
                    this.bindExternFunctionGroup(parent, name, members);
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
                    const name = this.getIdentifierText(member.identifier);
                    this.bindFunctionGroup(parent, name, members);
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
        const name = this.getIdentifierText(externDataDeclaration.identifier);

        let boundExternDataDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ExternDataDeclaration);
        if (boundExternDataDeclaration) {
            return boundExternDataDeclaration;
        }

        this.project.diagnostics.traceBindingStart(BoundNodeKind.ExternDataDeclaration, name);

        boundExternDataDeclaration = new BoundExternDataDeclaration();
        boundExternDataDeclaration.parent = parent;
        boundExternDataDeclaration.declarationKind = dataDeclarationKeyword.kind;
        boundExternDataDeclaration.identifier = new BoundSymbol(name, boundExternDataDeclaration);
        parent.locals.set(boundExternDataDeclaration.identifier);
        boundExternDataDeclaration.typeAnnotation = this.bindTypeAnnotation(externDataDeclaration.typeAnnotation);
        boundExternDataDeclaration.type = boundExternDataDeclaration.typeAnnotation.type;

        if (externDataDeclaration.nativeSymbol) {
            if (externDataDeclaration.nativeSymbol.kind === TokenKind.Missing) {
                throw new Error(`Native symbol is missing.`);
            }

            boundExternDataDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternDataDeclaration, externDataDeclaration.nativeSymbol);
        }

        this.project.diagnostics.traceBindingEnd();

        return boundExternDataDeclaration;
    }

    // #endregion

    // #region Extern function declaration

    private bindExternFunctionGroup(
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
        name: string,
        members: ModuleDeclarationMember[] | ExternClassDeclarationMember[],
    ): BoundExternFunctionGroupDeclaration {
        this.project.diagnostics.traceBindingStart(BoundNodeKind.ExternFunctionGroupDeclaration, name);

        const boundExternFunctionGroupDeclaration = this.bindExternFunctionGroupDeclaration(parent, name);

        for (const member of members) {
            if (member.kind === NodeKind.ExternFunctionDeclaration) {
                const memberName = this.getIdentifierText(member.identifier);
                if (areIdentifiersSame(name, memberName)) {
                    this.bindExternFunctionDeclaration(boundExternFunctionGroupDeclaration, member);
                }
            }
        }

        this.project.diagnostics.traceBindingEnd();

        return boundExternFunctionGroupDeclaration;
    }

    private bindExternFunctionGroupDeclaration(
        parent: BoundModuleDeclaration | BoundExternClassDeclaration,
        name: string,
    ) {
        let boundExternFunctionGroupDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ExternFunctionGroupDeclaration);
        if (boundExternFunctionGroupDeclaration) {
            return boundExternFunctionGroupDeclaration;
        }

        boundExternFunctionGroupDeclaration = new BoundExternFunctionGroupDeclaration();
        boundExternFunctionGroupDeclaration.parent = parent;
        boundExternFunctionGroupDeclaration.type = new FunctionGroupType(boundExternFunctionGroupDeclaration);
        boundExternFunctionGroupDeclaration.identifier = new BoundSymbol(name, boundExternFunctionGroupDeclaration);
        parent.locals.set(boundExternFunctionGroupDeclaration.identifier);

        return boundExternFunctionGroupDeclaration;
    }

    private bindExternFunctionDeclaration(
        parent: BoundExternFunctionGroupDeclaration,
        externFunctionDeclaration: ExternFunctionDeclaration,
    ): BoundExternFunctionDeclaration {
        let boundExternFunctionDeclaration = parent.overloads.get(externFunctionDeclaration);
        if (boundExternFunctionDeclaration) {
            return boundExternFunctionDeclaration;
        }

        const name = this.getIdentifierText(externFunctionDeclaration.identifier);
        this.project.diagnostics.traceBindingStart(BoundNodeKind.ExternFunctionDeclaration, name);

        boundExternFunctionDeclaration = new BoundExternFunctionDeclaration();
        boundExternFunctionDeclaration.declaration = externFunctionDeclaration;
        parent.overloads.set(boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.parent = parent;
        boundExternFunctionDeclaration.type = new FunctionType(boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.identifier = new BoundSymbol(name, boundExternFunctionDeclaration);
        boundExternFunctionDeclaration.returnType = this.bindTypeAnnotation(externFunctionDeclaration.returnType);
        boundExternFunctionDeclaration.parameters = this.bindDataDeclarationSequence(boundExternFunctionDeclaration, externFunctionDeclaration.parameters);

        if (externFunctionDeclaration.nativeSymbol) {
            if (externFunctionDeclaration.nativeSymbol.kind === TokenKind.Missing) {
                throw new Error(`Native symbol is missing.`);
            }

            boundExternFunctionDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternFunctionDeclaration, externFunctionDeclaration.nativeSymbol);
        }

        this.project.diagnostics.traceBindingEnd();

        return boundExternFunctionDeclaration;
    }

    // #endregion

    // #region Extern class declaration

    private bindExternClassDeclaration(
        parent: BoundModuleDeclaration,
        externClassDeclaration: ExternClassDeclaration,
    ): BoundExternClassDeclaration {
        const name = this.getIdentifierText(externClassDeclaration.identifier);

        let boundExternClassDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ExternClassDeclaration);
        if (boundExternClassDeclaration) {
            return boundExternClassDeclaration;
        }

        this.project.diagnostics.traceBindingStart(BoundNodeKind.ExternFunctionGroupDeclaration, name);

        boundExternClassDeclaration = new BoundExternClassDeclaration();
        boundExternClassDeclaration.declaration = externClassDeclaration;
        boundExternClassDeclaration.parent = parent;
        boundExternClassDeclaration.identifier = new BoundSymbol(name, boundExternClassDeclaration);
        parent.locals.set(boundExternClassDeclaration.identifier);

        switch (name) {
            case 'String': {
                boundExternClassDeclaration.type = new StringType(boundExternClassDeclaration);
                break;
            }
            case 'Array': {
                const typeParameter = new BoundTypeParameter();
                typeParameter.parent = boundExternClassDeclaration;
                typeParameter.identifier = new BoundSymbol('T', typeParameter);
                typeParameter.type = new TypeParameterType(typeParameter);

                boundExternClassDeclaration.type = new ArrayType(boundExternClassDeclaration, typeParameter);
                break;
            }
            default: {
                boundExternClassDeclaration.type = new ObjectType(boundExternClassDeclaration);
                break;
            }
        }

        if (externClassDeclaration.superType) {
            if (externClassDeclaration.superType.kind !== TokenKind.NullKeyword) {
                boundExternClassDeclaration.superType = this.bindTypeReference(externClassDeclaration.superType,
                    NodeKind.ExternClassDeclaration,
                    NodeKind.ClassDeclaration,
                ) as BoundExternClassDeclaration | BoundClassDeclaration;
            }
        } else {
            boundExternClassDeclaration.superType = this.resolveSpecialType(SpecialType.Object);
        }

        if (externClassDeclaration.nativeSymbol) {
            if (externClassDeclaration.nativeSymbol.kind === TokenKind.Missing) {
                throw new Error(`Native symbol is missing.`);
            }

            boundExternClassDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternClassDeclaration, externClassDeclaration.nativeSymbol);
        }

        this.bindExternClassDeclarationMembers(boundExternClassDeclaration, externClassDeclaration.members);

        if (!this.hasParameterlessExternConstructor(boundExternClassDeclaration)) {
            this.createParameterlessExternConstructor(boundExternClassDeclaration);
        }

        this.project.diagnostics.traceBindingEnd();

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
                    const name = this.getIdentifierText(member.identifier);
                    this.bindExternFunctionGroup(parent, name, members);
                    break;
                }
                case NodeKind.ExternClassMethodDeclaration: {
                    const name = this.getIdentifierText(member.identifier);
                    this.bindExternClassMethodGroup(parent, name, members);
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

        const boundMethodGroupDeclaration = this.bindBoundExternClassMethodGroupDeclaration(parent, name);

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

    private bindExternClassMethodGroup(
        parent: BoundExternClassDeclaration,
        name: string,
        members: ExternClassDeclarationMember[],
    ): BoundExternClassMethodGroupDeclaration {
        this.project.diagnostics.traceBindingStart(BoundNodeKind.ExternClassMethodDeclaration, name);

        const boundExternClassMethodGroupDeclaration = this.bindBoundExternClassMethodGroupDeclaration(parent, name);

        for (const member of members) {
            if (member.kind === NodeKind.ExternClassMethodDeclaration) {
                const memberName = this.getIdentifierText(member.identifier);
                if (areIdentifiersSame(name, memberName)) {
                    this.bindExternClassMethodDeclaration(boundExternClassMethodGroupDeclaration, member);
                }
            }
        }

        this.project.diagnostics.traceBindingEnd();

        return boundExternClassMethodGroupDeclaration;
    }

    private bindBoundExternClassMethodGroupDeclaration(
        parent: BoundExternClassDeclaration,
        name: string,
    ): BoundExternClassMethodGroupDeclaration {
        let boundExternClassMethodGroupDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ExternClassMethodGroupDeclaration);
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

    private bindExternClassMethodDeclaration(
        parent: BoundExternClassMethodGroupDeclaration,
        externClassMethodDeclaration: ExternClassMethodDeclaration,
    ): BoundExternClassMethodDeclaration {
        let boundExternClassMethodDeclaration = parent.overloads.get(externClassMethodDeclaration);
        if (boundExternClassMethodDeclaration) {
            return boundExternClassMethodDeclaration;
        }

        const name = this.getIdentifierText(externClassMethodDeclaration.identifier);
        this.project.diagnostics.traceBindingStart(BoundNodeKind.ExternClassMethodDeclaration, name);

        boundExternClassMethodDeclaration = new BoundExternClassMethodDeclaration();
        boundExternClassMethodDeclaration.declaration = externClassMethodDeclaration;
        parent.overloads.set(boundExternClassMethodDeclaration);
        boundExternClassMethodDeclaration.parent = parent;
        boundExternClassMethodDeclaration.type = new MethodType(boundExternClassMethodDeclaration);
        boundExternClassMethodDeclaration.identifier = new BoundSymbol(name, boundExternClassMethodDeclaration);

        if (areIdentifiersSame('New', name)) {
            boundExternClassMethodDeclaration.returnType = parent.parent as BoundExternClassDeclaration;
        } else {
            boundExternClassMethodDeclaration.returnType = this.bindTypeAnnotation(externClassMethodDeclaration.returnType);
        }

        boundExternClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(boundExternClassMethodDeclaration, externClassMethodDeclaration.parameters);

        if (externClassMethodDeclaration.nativeSymbol) {
            if (externClassMethodDeclaration.nativeSymbol.kind === TokenKind.Missing) {
                throw new Error(`Native symbol is missing.`);
            }

            boundExternClassMethodDeclaration.nativeSymbol = this.bindStringLiteralExpression(boundExternClassMethodDeclaration, externClassMethodDeclaration.nativeSymbol);
        }

        this.project.diagnostics.traceBindingEnd();

        return boundExternClassMethodDeclaration;
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

        let scope: Scope | undefined;
        if (this.isScope(parent)) {
            scope = parent;
        } else {
            scope = this.getScope(parent);
            if (!scope) {
                throw new Error(`Could not find scope for '${name}'.`);
            }
        }

        let boundDataDeclaration = scope.locals.getDeclaration(name, BoundNodeKind.DataDeclaration);
        if (boundDataDeclaration) {
            return boundDataDeclaration;
        }

        this.project.diagnostics.traceBindingStart(BoundNodeKind.DataDeclaration, name);

        let declarationKind: BoundDataDeclaration['declarationKind'] = null;
        if (dataDeclarationKeyword) {
            declarationKind = dataDeclarationKeyword.kind;
        }

        let operator: BoundDataDeclaration['operator'] = null;
        if (dataDeclaration.operator) {
            operator = dataDeclaration.operator.kind;
        }

        let getExpression: GetBoundNode<BoundExpressions> | undefined = undefined;
        if (dataDeclaration.expression) {
            const { expression } = dataDeclaration;
            getExpression = (parent) => this.bindExpression(parent, expression);
        }

        boundDataDeclaration = this.dataDeclaration(parent,
            {
                name,
                declarationKind,
                operator,
                getTypeAnnotation: () => this.bindTypeAnnotation(dataDeclaration.typeAnnotation),
                getExpression,
            },
        );

        this.project.diagnostics.traceBindingEnd();

        return boundDataDeclaration;
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
        const boundDataDeclaration = new BoundDataDeclaration();
        boundDataDeclaration.parent = parent;
        boundDataDeclaration.declarationKind = declarationKind;

        boundDataDeclaration.identifier = new BoundSymbol(name, boundDataDeclaration);
        const scope = this.getScope(boundDataDeclaration);
        if (!scope) {
            throw new Error(`Could not find scope for '${boundDataDeclaration.identifier.name}'.`);
        }
        scope.locals.set(boundDataDeclaration.identifier);

        switch (operator) {
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
                assertNever(operator);
                break;
            }
        }
        boundDataDeclaration.operator = operator;

        return boundDataDeclaration;
    }

    // #endregion

    // #endregion

    // #region Function declaration

    private bindFunctionGroup(
        parent: BoundModuleDeclaration | BoundClassDeclaration,
        name: string,
        members: ModuleDeclarationMember[] | ClassDeclarationMember[],
    ): BoundFunctionGroupDeclaration {
        this.project.diagnostics.traceBindingStart(BoundNodeKind.FunctionGroupDeclaration, name);

        const boundFunctionGroupDeclaration = this.bindFunctionGroupDeclaration(parent, name);

        for (const member of members) {
            if (member.kind === NodeKind.FunctionDeclaration) {
                const memberName = this.getIdentifierText(member.identifier);
                if (areIdentifiersSame(name, memberName)) {
                    this.bindFunctionDeclaration(boundFunctionGroupDeclaration, member);
                }
            }
        }

        this.project.diagnostics.traceBindingEnd();

        return boundFunctionGroupDeclaration;
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
        boundFunctionGroupDeclaration.parent = parent;
        boundFunctionGroupDeclaration.type = new FunctionGroupType(boundFunctionGroupDeclaration);
        boundFunctionGroupDeclaration.identifier = new BoundSymbol(name, boundFunctionGroupDeclaration);
        parent.locals.set(boundFunctionGroupDeclaration.identifier);

        return boundFunctionGroupDeclaration;
    }

    private bindFunctionDeclaration(
        parent: BoundFunctionGroupDeclaration,
        functionDeclaration: FunctionDeclaration,
    ): BoundFunctionDeclaration {
        let boundFunctionDeclaration = parent.overloads.get(functionDeclaration);
        if (boundFunctionDeclaration) {
            return boundFunctionDeclaration;
        }

        const name = this.getIdentifierText(functionDeclaration.identifier);
        this.project.diagnostics.traceBindingStart(BoundNodeKind.FunctionDeclaration, name);

        boundFunctionDeclaration = new BoundFunctionDeclaration();
        boundFunctionDeclaration.declaration = functionDeclaration;
        parent.overloads.set(boundFunctionDeclaration);
        boundFunctionDeclaration.parent = parent;
        boundFunctionDeclaration.type = new FunctionType(boundFunctionDeclaration);
        boundFunctionDeclaration.identifier = new BoundSymbol(name, boundFunctionDeclaration);
        boundFunctionDeclaration.returnType = this.bindTypeAnnotation(functionDeclaration.returnType);
        boundFunctionDeclaration.parameters = this.bindDataDeclarationSequence(boundFunctionDeclaration, functionDeclaration.parameters);
        boundFunctionDeclaration.statements = this.bindStatements(boundFunctionDeclaration, functionDeclaration.statements);

        this.project.diagnostics.traceBindingEnd();

        return boundFunctionDeclaration;
    }

    // #endregion

    // #region Interface declaration

    private bindInterfaceDeclaration(
        parent: BoundModuleDeclaration,
        interfaceDeclaration: InterfaceDeclaration,
    ): BoundInterfaceDeclaration {
        const name = this.getIdentifierText(interfaceDeclaration.identifier);

        let boundInterfaceDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.InterfaceDeclaration);
        if (boundInterfaceDeclaration) {
            return boundInterfaceDeclaration;
        }

        this.project.diagnostics.traceBindingStart(BoundNodeKind.InterfaceDeclaration, name);

        boundInterfaceDeclaration = new BoundInterfaceDeclaration();
        boundInterfaceDeclaration.declaration = interfaceDeclaration;
        boundInterfaceDeclaration.parent = parent;
        boundInterfaceDeclaration.type = new ObjectType(boundInterfaceDeclaration);
        boundInterfaceDeclaration.identifier = new BoundSymbol(name, boundInterfaceDeclaration);
        parent.locals.set(boundInterfaceDeclaration.identifier);

        if (interfaceDeclaration.implementedTypes) {
            boundInterfaceDeclaration.implementedTypes = this.bindTypeReferenceSequence(interfaceDeclaration.implementedTypes,
                NodeKind.InterfaceDeclaration,
            ) as BoundInterfaceDeclaration[];
        }

        this.bindInterfaceDeclarationMembers(boundInterfaceDeclaration, interfaceDeclaration.members);

        this.project.diagnostics.traceBindingEnd();

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
                    const name = this.getIdentifierText(member.identifier);
                    this.bindInterfaceMethodGroup(parent, name, members);
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

    private bindInterfaceMethodGroup(
        parent: BoundInterfaceDeclaration,
        name: string,
        members: InterfaceDeclarationMember[],
    ): BoundInterfaceMethodGroupDeclaration {
        this.project.diagnostics.traceBindingStart(BoundNodeKind.InterfaceMethodGroupDeclaration, name);

        const boundInterfaceMethodGroupDeclaration = this.bindInterfaceMethodGroupDeclaration(parent, name);

        for (const member of members) {
            if (member.kind === NodeKind.InterfaceMethodDeclaration) {
                const memberName = this.getIdentifierText(member.identifier);
                if (areIdentifiersSame(name, memberName)) {
                    this.bindInterfaceMethodDeclaration(boundInterfaceMethodGroupDeclaration, member);
                }
            }
        }

        this.project.diagnostics.traceBindingEnd();

        return boundInterfaceMethodGroupDeclaration;
    }

    private bindInterfaceMethodGroupDeclaration(parent: BoundInterfaceDeclaration, name: string) {
        let boundInterfaceMethodGroupDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.InterfaceMethodGroupDeclaration);
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

    private bindInterfaceMethodDeclaration(
        boundInterfaceMethodGroupDeclaration: BoundInterfaceMethodGroupDeclaration,
        interfaceMethodDeclaration: InterfaceMethodDeclaration,
    ): BoundInterfaceMethodDeclaration {
        let boundInterfaceMethodDeclaration = boundInterfaceMethodGroupDeclaration.overloads.get(interfaceMethodDeclaration);
        if (boundInterfaceMethodDeclaration) {
            return boundInterfaceMethodDeclaration;
        }

        const name = this.getIdentifierText(interfaceMethodDeclaration.identifier);
        this.project.diagnostics.traceBindingStart(BoundNodeKind.InterfaceMethodDeclaration, name);

        boundInterfaceMethodDeclaration = new BoundInterfaceMethodDeclaration();
        boundInterfaceMethodDeclaration.declaration = interfaceMethodDeclaration;
        boundInterfaceMethodGroupDeclaration.overloads.set(boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.parent = boundInterfaceMethodGroupDeclaration;
        boundInterfaceMethodDeclaration.type = new MethodType(boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.identifier = new BoundSymbol(name, boundInterfaceMethodDeclaration);
        boundInterfaceMethodDeclaration.returnType = this.bindTypeAnnotation(interfaceMethodDeclaration.returnType);
        boundInterfaceMethodDeclaration.parameters = this.bindDataDeclarationSequence(boundInterfaceMethodDeclaration, interfaceMethodDeclaration.parameters);

        this.project.diagnostics.traceBindingEnd();

        return boundInterfaceMethodDeclaration;
    }

    // #endregion

    // #endregion

    // #region Class declaration

    private bindClassDeclaration(
        parent: BoundModuleDeclaration,
        classDeclaration: ClassDeclaration,
    ): BoundClassDeclaration {
        const name = this.getIdentifierText(classDeclaration.identifier);

        let boundClassDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ClassDeclaration);
        if (boundClassDeclaration) {
            return boundClassDeclaration;
        }

        this.project.diagnostics.traceBindingStart(BoundNodeKind.ClassDeclaration, name);

        boundClassDeclaration = new BoundClassDeclaration();
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

        if (classDeclaration.superType) {
            boundClassDeclaration.superType = this.bindTypeReference(classDeclaration.superType,
                NodeKind.ExternClassDeclaration,
                NodeKind.ClassDeclaration,
            ) as BoundExternClassDeclaration | BoundClassDeclaration;
        } else {
            boundClassDeclaration.superType = this.resolveSpecialType(SpecialType.Object);
        }

        if (classDeclaration.implementedTypes) {
            boundClassDeclaration.implementedTypes = this.bindTypeReferenceSequence(classDeclaration.implementedTypes,
                NodeKind.InterfaceDeclaration,
            ) as BoundInterfaceDeclaration[];
        }

        this.bindClassDeclarationMembers(boundClassDeclaration, classDeclaration.members);

        if (!this.hasParameterlessConstructor(boundClassDeclaration)) {
            this.createParameterlessConstructor(boundClassDeclaration);
        }

        this.project.diagnostics.traceBindingEnd();

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
                    const name = this.getIdentifierText(member.identifier);
                    this.bindFunctionGroup(parent, name, members);
                    break;
                }
                case NodeKind.ClassMethodDeclaration: {
                    const name = this.getIdentifierText(member.identifier);
                    this.bindClassMethodGroup(parent, name, members);
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

        const boundMethodGroupDeclaration = this.bindBoundClassMethodGroupDeclaration(parent, name);

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

    private bindClassMethodGroup(
        parent: BoundClassDeclaration,
        name: string,
        members: ClassDeclaration['members'],
    ): BoundClassMethodGroupDeclaration {
        this.project.diagnostics.traceBindingStart(BoundNodeKind.ClassMethodGroupDeclaration, name);

        const boundClassMethodGroupDeclaration = this.bindBoundClassMethodGroupDeclaration(parent, name);

        for (const member of members) {
            if (member.kind === NodeKind.ClassMethodDeclaration) {
                const memberName = this.getIdentifierText(member.identifier);
                if (areIdentifiersSame(name, memberName)) {
                    this.bindClassMethodDeclaration(boundClassMethodGroupDeclaration, member);
                }
            }
        }

        this.project.diagnostics.traceBindingEnd();

        return boundClassMethodGroupDeclaration;
    }

    private bindBoundClassMethodGroupDeclaration(parent: BoundClassDeclaration, name: string) {
        let boundClassMethodGroupDeclaration = parent.locals.getDeclaration(name, BoundNodeKind.ClassMethodGroupDeclaration);
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

    private bindClassMethodDeclaration(
        parent: BoundClassMethodGroupDeclaration,
        classMethodDeclaration: ClassMethodDeclaration,
    ): BoundClassMethodDeclaration {
        let boundClassMethodDeclaration = parent.overloads.get(classMethodDeclaration);
        if (boundClassMethodDeclaration) {
            return boundClassMethodDeclaration;
        }

        const name = this.getIdentifierText(classMethodDeclaration.identifier);
        this.project.diagnostics.traceBindingStart(BoundNodeKind.ClassMethodDeclaration, name);

        boundClassMethodDeclaration = new BoundClassMethodDeclaration();
        boundClassMethodDeclaration.declaration = classMethodDeclaration;
        parent.overloads.set(boundClassMethodDeclaration);
        boundClassMethodDeclaration.parent = parent;
        boundClassMethodDeclaration.type = new MethodType(boundClassMethodDeclaration);
        boundClassMethodDeclaration.identifier = new BoundSymbol(name, boundClassMethodDeclaration);

        if (areIdentifiersSame('New', name)) {
            boundClassMethodDeclaration.returnType = parent.parent as BoundClassDeclaration;
        } else {
            boundClassMethodDeclaration.returnType = this.bindTypeAnnotation(classMethodDeclaration.returnType);
        }

        boundClassMethodDeclaration.parameters = this.bindDataDeclarationSequence(boundClassMethodDeclaration, classMethodDeclaration.parameters);

        if (classMethodDeclaration.statements) {
            boundClassMethodDeclaration.statements = this.bindStatements(boundClassMethodDeclaration, classMethodDeclaration.statements);
        }

        this.project.diagnostics.traceBindingEnd();

        return boundClassMethodDeclaration;
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

        if (getExpression) {
            boundReturnStatement.expression = getExpression(boundReturnStatement);
            boundReturnStatement.type = boundReturnStatement.expression.type;
        } else {
            boundReturnStatement.type = this.project.voidTypeDeclaration.type;
        }

        const functionOrMethodDeclaration = this.getNearestAncestor(boundReturnStatement,
            BoundNodeKind.FunctionDeclaration,
            BoundNodeKind.ClassMethodDeclaration,
        );

        if (!boundReturnStatement.type.isConvertibleTo(functionOrMethodDeclaration.returnType.type)) {
            throw new Error(`'${boundReturnStatement.type}' is not convertible to '${functionOrMethodDeclaration.returnType.type}'.`);
        }

        return boundReturnStatement;
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
                        getTypeAnnotation: () => this.bindTypeAnnotation(numericForLoop.typeAnnotation),
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
                                getTypeAnnotation: () => this.bindTypeAnnotation(forEachInLoop.typeAnnotation),
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
                        throw new Error();
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
                                getTypeAnnotation: () => this.bindTypeAnnotation(forEachInLoop.typeAnnotation),
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
                        throw new Error();
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
                throw new Error(`Unexpected collection expression type: '${boundCollectionExpression.type.kind}'`);
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
        const boundClassLikeDeclaration = this.bindTypeReference(newExpression.type,
            NodeKind.ExternClassDeclaration,
            NodeKind.ClassDeclaration,
        ) as BoundExternClassDeclaration | BoundClassDeclaration | undefined;

        if (!boundClassLikeDeclaration) {
            const type = newExpression.type as TypeReference;
            const typeName = this.getIdentifierText(type.identifier as MissableIdentifier | NewKeywordToken);

            throw new Error(`Couldn't find a class named '${typeName}'.`);
        }

        return this.newExpression(parent, boundClassLikeDeclaration);
    }

    private newExpression(
        parent: BoundNodes,
        boundClassLikeDeclaration: BoundExternClassDeclaration | BoundClassDeclaration,
    ): BoundNewExpression {
        const boundNewExpression = new BoundNewExpression();
        boundNewExpression.parent = parent;
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

    private bindExternClassConstructorGroup(
        boundExternClassDeclaration: BoundExternClassDeclaration,
    ): BoundExternClassMethodGroupDeclaration {
        const name = 'New';

        const boundExternConstructorGroupDeclarationSymbol = boundExternClassDeclaration.locals.get(name);
        if (boundExternConstructorGroupDeclarationSymbol &&
            boundExternConstructorGroupDeclarationSymbol.declaration.kind === BoundNodeKind.ExternClassMethodGroupDeclaration
        ) {
            return boundExternConstructorGroupDeclarationSymbol.declaration;
        }

        const { members } = boundExternClassDeclaration.declaration;
        for (const member of members) {
            if (member.kind === NodeKind.ExternClassMethodDeclaration) {
                const memberIdentifierText = this.getIdentifierText(member.identifier);
                if (areIdentifiersSame(name, memberIdentifierText)) {
                    return this.bindExternClassMethodGroup(boundExternClassDeclaration, name, members);
                }
            }
        }

        return this.createParameterlessExternConstructor(boundExternClassDeclaration);
    }

    private bindClassConstructorGroup(
        boundClassDeclaration: BoundClassDeclaration,
    ): BoundClassMethodGroupDeclaration {
        const name = 'New';

        const boundClassConstructorGroupDeclarationSymbol = boundClassDeclaration.locals.get(name);
        if (boundClassConstructorGroupDeclarationSymbol &&
            boundClassConstructorGroupDeclarationSymbol.declaration.kind === BoundNodeKind.ClassMethodGroupDeclaration
        ) {
            return boundClassConstructorGroupDeclarationSymbol.declaration;
        }

        const { members } = boundClassDeclaration.declaration;
        for (const member of members) {
            if (member.kind === NodeKind.ClassMethodDeclaration) {
                const memberIdentifierText = this.getIdentifierText(member.identifier);
                if (areIdentifiersSame(name, memberIdentifierText)) {
                    return this.bindClassMethodGroup(boundClassDeclaration, name, members);
                }
            }
        }

        return this.createParameterlessConstructor(boundClassDeclaration);;
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

        const classDeclaration = this.getNearestAncestor(boundSelfExpression, BoundNodeKind.ClassDeclaration);
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

        const classDeclaration = this.getNearestAncestor(boundSuperExpression, BoundNodeKind.ClassDeclaration);
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
        boundStringLiteralExpression.type = this.resolveSpecialType(SpecialType.String).type;
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
        let boundTypeArguments: BoundTypeReferenceDeclaration[] | undefined = undefined;
        if (identifierExpression.typeArguments) {
            boundTypeArguments = this.bindTypeReferenceSequence(identifierExpression.typeArguments);
        }

        return this.identifierExpression(parent,
            (parent) => this.resolveIdentifier(
                parent,
                identifierExpression.identifier,
                scope,
                boundTypeArguments,
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

    private instantiateArrayType(elementType: BoundTypeReferenceDeclaration): BoundExternClassDeclaration {
        let instantiatedType = this.project.arrayTypeCache.get(elementType);
        if (instantiatedType) {
            return instantiatedType;
        }

        const openType = this.resolveSpecialType(SpecialType.Array);

        this.project.diagnostics.traceInstantiateStart(openType.kind, openType.identifier.name);

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

        this.project.diagnostics.traceInstantiateEnd();

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
        let match = true;

        for (const [typeParameter, typeArgument] of typeMap) {
            if (typeParameter !== typeArgument) {
                match = false;
                break;
            }
        }

        if (match) {
            return openType;
        }

        const rootType = openType.rootType!;
        const instantiatedTypes = rootType.instantiatedTypes!;
        const typeArguments = Array.from(typeMap.values());

        for (const instantiatedType of instantiatedTypes) {
            let match = true;

            const instantiatedTypeTypeArguments = instantiatedType.typeArguments!;
            for (let i = 0; i < instantiatedTypeTypeArguments.length; i++) {
                if (typeArguments[i] !== instantiatedTypeTypeArguments[i]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return instantiatedType;
            }
        }

        this.project.diagnostics.traceInstantiateStart(openType.kind, openType.identifier.name);

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

        this.project.diagnostics.traceInstantiateEnd();

        return instantiatedType;
    }

    // #region Instantiate data declaration

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

        this.project.diagnostics.traceInstantiateStart(boundDataDeclaration.kind, name);

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

        this.project.diagnostics.traceInstantiateEnd();

        return instantiatedDataDeclaration;
    }

    // #endregion

    // #region Instantiate function declaration

    private instantiateFunctionGroupDeclaration(
        parent: BoundClassDeclaration,
        boundFunctionGroupDeclaration: BoundFunctionGroupDeclaration,
        typeMap: TypeMap,
    ): BoundFunctionGroupDeclaration {
        const { name } = boundFunctionGroupDeclaration.identifier;
        this.project.diagnostics.traceInstantiateStart(boundFunctionGroupDeclaration.kind, name);

        const instantiatedFunctionGroupDeclaration = new BoundFunctionGroupDeclaration();
        instantiatedFunctionGroupDeclaration.parent = parent;
        instantiatedFunctionGroupDeclaration.type = new FunctionGroupType(instantiatedFunctionGroupDeclaration);
        instantiatedFunctionGroupDeclaration.identifier = new BoundSymbol(name, instantiatedFunctionGroupDeclaration);
        parent.locals.set(instantiatedFunctionGroupDeclaration.identifier);

        for (const [, overload] of boundFunctionGroupDeclaration.overloads) {
            this.instantiateFunctionDeclaration(instantiatedFunctionGroupDeclaration, overload, typeMap);
        }

        this.project.diagnostics.traceInstantiateEnd();

        return instantiatedFunctionGroupDeclaration;
    }

    private instantiateFunctionDeclaration(
        parent: BoundFunctionGroupDeclaration,
        boundFunctionDeclaration: BoundFunctionDeclaration,
        typeMap: TypeMap,
    ): BoundFunctionDeclaration {
        const { name } = boundFunctionDeclaration.identifier;
        this.project.diagnostics.traceInstantiateStart(boundFunctionDeclaration.kind, name);

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

        this.project.diagnostics.traceInstantiateEnd();

        return instantiatedFunctionDeclaration;
    }

    // #endregion

    // #region Instantiate class method declaration

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

        this.project.diagnostics.traceInstantiateStart(boundClassMethodGroupDeclaration.kind, name);

        instantiatedClassMethodGroupDeclaration = new BoundClassMethodGroupDeclaration();
        instantiatedClassMethodGroupDeclaration.parent = parent;
        instantiatedClassMethodGroupDeclaration.type = new MethodGroupType(instantiatedClassMethodGroupDeclaration);
        instantiatedClassMethodGroupDeclaration.identifier = new BoundSymbol(name, instantiatedClassMethodGroupDeclaration);
        parent.locals.set(instantiatedClassMethodGroupDeclaration.identifier);

        for (const [, overload] of boundClassMethodGroupDeclaration.overloads) {
            this.instantiateClassMethodDeclaration(instantiatedClassMethodGroupDeclaration, overload, typeMap);
        }

        this.project.diagnostics.traceInstantiateEnd();

        return instantiatedClassMethodGroupDeclaration;
    }

    private instantiateClassMethodDeclaration(
        parent: BoundClassMethodGroupDeclaration,
        boundClassMethodDeclaration: BoundClassMethodDeclaration,
        typeMap: TypeMap,
    ): BoundClassMethodDeclaration {
        this.project.diagnostics.traceInstantiateStart(boundClassMethodDeclaration.kind, boundClassMethodDeclaration.identifier.name);

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

        this.project.diagnostics.traceInstantiateEnd();

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
                const boundClassLikeDeclaration = this.instantiateType(
                    expression.typeReference,
                    typeMap,
                ) as BoundExternClassDeclaration | BoundClassDeclaration;

                return this.newExpression(parent, boundClassLikeDeclaration);
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
                        // TODO: `parent` is not the parent of the data declaration. Need to locate correct parent.
                        //       Didn't eager binding run into the same scenario? Check what was done there.
                        instantiatedDeclaration = this.instantiateDataDeclaration(parent, declaration, typeMap);
                        break;
                    }
                    case BoundNodeKind.ClassMethodGroupDeclaration: {
                        const boundClassDeclaration = this.getNearestAncestor(parent, BoundNodeKind.ClassDeclaration);
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
                boundDeclaration = this.resolveSpecialType(SpecialType.String);
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
                break;
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

            const boundModuleDeclaration = moduleSymbol.declaration;
            if (boundModuleDeclaration.kind !== BoundNodeKind.ModuleDeclaration) {
                throw new Error(`'${moduleIdentifierText}' is not a module.`);
            }

            const declaration = this.bindTypeDeclarationFromModule(boundModuleDeclaration, identifierText, ...kinds);
            if (!declaration) {
                throw new Error(`Could not find '${identifierText}' in '${moduleIdentifierText}'.`);
            }

            return declaration;
        }

        // If we're in a class, check if it's a type parameter
        const classDeclaration = ParseTreeVisitor.getNearestAncestor(typeReference, NodeKind.ClassDeclaration);
        if (classDeclaration &&
            classDeclaration.typeParameters
        ) {
            const boundClassDeclaration = this.bindClassDeclaration(this.module, classDeclaration);
            const boundTypeParameter = boundClassDeclaration.locals.get(identifierText);
            if (boundTypeParameter &&
                boundTypeParameter.declaration.kind === BoundNodeKind.TypeParameter
            ) {
                return boundTypeParameter.declaration;
            }
        }

        // Check if it's a type in this module
        const declaration = this.bindTypeDeclarationFromModule(this.module, identifierText, ...kinds);
        if (declaration) {
            return declaration;
        }

        // Check if it's a type in any imported modules
        for (const [, node] of this.module.locals) {
            const nodeDeclaration = node.declaration!;
            if (nodeDeclaration.kind === BoundNodeKind.ModuleDeclaration) {
                const declaration = this.bindTypeDeclarationFromModule(nodeDeclaration, identifierText, ...kinds);
                if (declaration) {
                    return declaration;
                }
            }
        }

        // TODO: This is a temporary hack until `Import monkey` is working.
        switch (identifier.kind) {
            case TokenKind.ObjectKeyword: {
                return this.resolveSpecialType(SpecialType.Object);
            }
            case TokenKind.ThrowableKeyword: {
                return this.resolveSpecialType(SpecialType.Throwable);
            }
        }

        throw new Error(`Could not find '${identifierText}'.`);
    }

    private bindTypeDeclarationFromModule(
        parent: BoundModuleDeclaration,
        name: string,
        ...kinds: TypeDeclarationNodeKind[]
    ) {
        for (const member of parent.declaration.members) {
            switch (member.kind) {
                case NodeKind.ExternClassDeclaration:
                case NodeKind.InterfaceDeclaration:
                case NodeKind.ClassDeclaration: {
                    const memberName = this.getIdentifierText(member.identifier, parent.declaration.document);
                    if (areIdentifiersSame(name, memberName)) {
                        assertTypeDeclarationKind(member.kind, kinds, memberName);

                        switch (member.kind) {
                            case NodeKind.ExternClassDeclaration: {
                                return this.bindExternClassDeclaration(parent, member);
                            }
                            case NodeKind.InterfaceDeclaration: {
                                return this.bindInterfaceDeclaration(parent, member);
                            }
                            case NodeKind.ClassDeclaration: {
                                return this.bindClassDeclaration(parent, member);
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

    // #region Symbols

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
        node: BoundNodes,
        identifier: IdentifierExpressionIdentifier,
        scope?: BoundMemberContainerDeclaration,
        typeArguments?: BoundTypeReferenceDeclaration[],
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

                    return this.resolveIdentifierName(node, identifierText, scope, typeArguments);
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
                    return this.resolveSpecialType(SpecialType.String);
                }
                case TokenKind.Identifier:
                case TokenKind.ObjectKeyword:
                case TokenKind.ThrowableKeyword:
                case TokenKind.NewKeyword:
                case NodeKind.EscapedIdentifier: {
                    const identifierText = this.getIdentifierText(identifier);

                    return this.resolveIdentifierName(node, identifierText, scope, typeArguments);
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
        typeArguments?: BoundTypeReferenceDeclaration[],
    ) {
        if (scope) {
            const declaration = this.resolveIdentifierOnScope(name, scope);
            if (declaration) {
                return declaration;
            }

            throw new Error(`'${name}' does not exist on '${scope.type}'.`);
        } else {
            let declaration = this.resolveIdentifierFromNode(name, node);
            if (!declaration) {
                throw new Error(`Could not find '${name}'.`);
            }

            // Cast expression
            if (typeArguments) {
                if (declaration.kind !== BoundNodeKind.ClassDeclaration ||
                    !declaration.typeParameters
                ) {
                    throw new Error(`'${name}' is not a generic class.`);
                }

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
        const declaration = this.tryBindMemberDeclarationWithName(scope, name);
        if (declaration) {
            return declaration;
        }

        const identifier = scope.locals.get(name);
        if (identifier) {
            return identifier.declaration;
        }
    }

    private resolveSpecialType(kind: SpecialType) {
        switch (kind) {
            case SpecialType.String: {
                if (!this.project.stringTypeDeclaration) {
                    const langModule = this.project.getLangModule();
                    this.project.stringTypeDeclaration = this.bindTypeDeclarationFromModule(langModule, 'String',
                        NodeKind.ExternClassDeclaration,
                    ) as BoundExternClassDeclaration;
                }

                return this.project.stringTypeDeclaration;
            }
            case SpecialType.Array: {
                if (!this.project.arrayTypeDeclaration) {
                    const langModule = this.project.getLangModule();
                    this.project.arrayTypeDeclaration = this.bindTypeDeclarationFromModule(langModule, 'Array',
                        NodeKind.ExternClassDeclaration,
                    ) as BoundExternClassDeclaration;
                }

                return this.project.arrayTypeDeclaration;
            }
            case SpecialType.Object: {
                if (!this.project.objectTypeDeclaration) {
                    const langModule = this.project.getLangModule();
                    this.project.objectTypeDeclaration = this.bindTypeDeclarationFromModule(langModule, 'Object',
                        NodeKind.ExternClassDeclaration,
                    ) as BoundExternClassDeclaration;
                }

                return this.project.objectTypeDeclaration;
            }
            case SpecialType.Throwable: {
                if (!this.project.throwableTypeDeclaration) {
                    const langModule = this.project.getLangModule();
                    this.project.throwableTypeDeclaration = this.bindTypeDeclarationFromModule(langModule, 'Throwable',
                        NodeKind.ExternClassDeclaration,
                    ) as BoundExternClassDeclaration;
                }

                return this.project.throwableTypeDeclaration;
            }
            default: {
                return assertNever(kind);
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

    // #region Eager binding

    private tryBindMemberDeclarationWithName(
        scope: Scope,
        name: string,
    ) {
        switch (scope.kind) {
            case BoundNodeKind.ModuleDeclaration: {
                const memberDeclaration = this.tryBindModuleMemberDeclarationWithName(scope, name);
                if (memberDeclaration) {
                    return memberDeclaration;
                }
                break;
            }
            case BoundNodeKind.ExternClassDeclaration: {
                const memberDeclaration = this.tryBindExternClassDeclarationMemberWithName(scope, name);
                if (memberDeclaration) {
                    return memberDeclaration;
                }
                break;
            }
            case BoundNodeKind.InterfaceDeclaration: {
                const memberDeclaration = this.tryBindInterfaceDeclarationMemberWithName(scope, name);
                if (memberDeclaration) {
                    return memberDeclaration;
                }
                break;
            }
            case BoundNodeKind.ClassDeclaration: {
                const memberDeclaration = this.tryBindClassDeclarationMemberWithName(scope, name);
                if (memberDeclaration) {
                    return memberDeclaration;
                }
                break;
            }
        }
    }

    private tryBindModuleMemberDeclarationWithName(
        scope: BoundModuleDeclaration,
        name: string,
    ) {
        for (const member of scope.declaration.members) {
            switch (member.kind) {
                case NodeKind.ExternDataDeclarationSequence: {
                    const boundMember = this.tryBindExternDataDeclarationWithName(scope, name, member);
                    if (boundMember) {
                        return boundMember;
                    }
                    break;
                }
                case NodeKind.DataDeclarationSequence: {
                    const boundMember = this.tryBindDataDeclarationWithName(scope, name, member);
                    if (boundMember) {
                        return boundMember;
                    }
                    break;
                }
                case NodeKind.ExternFunctionDeclaration: {
                    const memberName = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, memberName)) {
                        return this.bindExternFunctionGroup(scope, memberName, scope.declaration.members);
                    }
                    break;
                }
                case NodeKind.ExternClassDeclaration: {
                    const identifierText = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, identifierText)) {
                        return this.bindExternClassDeclaration(scope, member);
                    }
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    const memberName = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, memberName)) {
                        return this.bindFunctionGroup(scope, memberName, scope.declaration.members);
                    }
                    break;
                }
                case NodeKind.InterfaceDeclaration: {
                    const identifierText = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, identifierText)) {
                        return this.bindInterfaceDeclaration(scope, member);
                    }
                    break;
                }
                case NodeKind.ClassDeclaration: {
                    const identifierText = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, identifierText)) {
                        return this.bindClassDeclaration(scope, member);
                    }
                    break;
                }
                case NodeKind.AccessibilityDirective:
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

    private tryBindExternClassDeclarationMemberWithName(
        scope: BoundExternClassDeclaration,
        name: string,
    ) {
        // TODO: Overloads of methods on super types?

        for (const member of scope.declaration.members) {
            switch (member.kind) {
                case NodeKind.ExternDataDeclarationSequence: {
                    const boundMember = this.tryBindExternDataDeclarationWithName(scope, name, member);
                    if (boundMember) {
                        return boundMember;
                    }
                    break;
                }
                case NodeKind.ExternFunctionDeclaration: {
                    const memberName = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, memberName)) {
                        return this.bindExternFunctionGroup(scope, memberName, scope.declaration.members);
                    }
                    break;
                }
                case NodeKind.ExternClassMethodDeclaration: {
                    const identifierText = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, identifierText)) {
                        return this.bindExternClassMethodGroup(scope, identifierText, scope.declaration.members);
                    }
                    break;
                }
                case NodeKind.AccessibilityDirective:
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

    private tryBindInterfaceDeclarationMemberWithName(
        scope: BoundInterfaceDeclaration,
        name: string,
    ) {
        // TODO: Overloads of methods on super types?

        for (const member of scope.declaration.members) {
            switch (member.kind) {
                case NodeKind.DataDeclarationSequence: {
                    const boundMember = this.tryBindDataDeclarationWithName(scope, name, member);
                    if (boundMember) {
                        return boundMember;
                    }
                    break;
                }
                case NodeKind.InterfaceMethodDeclaration: {
                    const memberName = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, memberName)) {
                        return this.bindInterfaceMethodGroup(scope, memberName, scope.declaration.members);
                    }
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

    private tryBindClassDeclarationMemberWithName(
        scope: BoundClassDeclaration,
        name: string,
    ) {
        // TODO: Overloads of methods on super types?

        for (const member of scope.declaration.members) {
            switch (member.kind) {
                case NodeKind.DataDeclarationSequence: {
                    const boundMember = this.tryBindDataDeclarationWithName(scope, name, member);
                    if (boundMember) {
                        return boundMember;
                    }
                    break;
                }
                case NodeKind.FunctionDeclaration: {
                    const memberName = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, memberName)) {
                        return this.bindFunctionGroup(scope, memberName, scope.declaration.members);
                    }
                    break;
                }
                case NodeKind.ClassMethodDeclaration: {
                    const memberName = this.getIdentifierText(member.identifier);
                    if (areIdentifiersSame(name, memberName)) {
                        return this.bindClassMethodGroup(scope, memberName, scope.declaration.members);
                    }
                    break;
                }
                case NodeKind.AccessibilityDirective:
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

    private tryBindExternDataDeclarationWithName(
        scope: BoundModuleDeclaration | BoundExternClassDeclaration,
        name: string,
        member: ExternDataDeclarationSequence,
    ): BoundExternDataDeclaration | undefined {
        for (const dataDeclaration of member.children) {
            switch (dataDeclaration.kind) {
                case NodeKind.ExternDataDeclaration: {
                    const identifierText = this.getIdentifierText(dataDeclaration.identifier);
                    if (areIdentifiersSame(name, identifierText)) {
                        return this.bindExternDataDeclaration(scope, dataDeclaration, member.dataDeclarationKeyword);
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
    }

    private tryBindDataDeclarationWithName(
        scope: BoundModuleDeclaration | BoundInterfaceDeclaration | BoundClassDeclaration,
        name: string,
        member: DataDeclarationSequence,
    ): BoundDataDeclaration | undefined {
        for (const dataDeclaration of member.children) {
            switch (dataDeclaration.kind) {
                case NodeKind.DataDeclaration: {
                    const identifierText = this.getIdentifierText(dataDeclaration.identifier);
                    if (areIdentifiersSame(name, identifierText)) {
                        return this.bindDataDeclaration(scope, dataDeclaration, member.dataDeclarationKeyword);
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
                return this.resolveSpecialType(SpecialType.String);
            }
            default: {
                return assertNever(shorthandType);
            }
        }
    }

    private getBalancedType(leftOperandType: Types, rightOperandType: Types) {
        const stringType = this.resolveSpecialType(SpecialType.String).type;

        if (leftOperandType === stringType ||
            rightOperandType === stringType
        ) {
            return stringType;
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

    private getNearestAncestor<TKind extends BoundNodeKind>(node: BoundNodes, ...kinds: TKind[]): BoundNodeKindToBoundNodeMap[TKind] {
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

        throw new Error(`Could not find the specified ancestor.`);
    }

    // #endregion
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

enum SpecialType {
    String = 'String',
    Array = 'Array',
    Object = 'Object',
    Throwable = 'Throwable',
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
): void {
    if (kinds.length &&
        !kinds.includes(kind)
    ) {
        throw new Error(`Expected '${identifierText}' to be '${kinds.join(', ')}' but got '${kind}'.`);
    }
}
