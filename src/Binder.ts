import path = require('path');
import { assertNever, assertType } from './assertNever';
import { BoundBinaryExpression } from './Binding/BoundBinaryExpression';
import { BoundBooleanLiteralExpression } from './Binding/BoundBooleanLiteralExpression';
import { BoundExpression } from './Binding/BoundExpression';
import { BoundExpressionStatement } from './Binding/BoundExpressionStatement';
import { BoundFloatLiteralExpression } from './Binding/BoundFloatLiteralExpression';
import { BoundFunctionLikeDeclaration } from './Binding/BoundFunctionLikeDeclaration';
import { BoundIntegerLiteralExpression } from './Binding/BoundIntegerLiteralExpression';
import { BoundInvokeExpression } from './Binding/BoundInvokeExpression';
import { BoundModuleDeclaration } from './Binding/BoundModuleDeclaration';
import { BoundStringLiteralExpression } from './Binding/BoundStringLiteralExpression';
import { BoundUnaryOpExpression } from './Binding/BoundUnaryOpExpression';
import { ArrayType } from './Binding/Type/ArrayType';
import { BoolType } from './Binding/Type/BoolType';
import { FloatType } from './Binding/Type/FloatType';
import { IntType } from './Binding/Type/IntType';
import { ObjectType } from './Binding/Type/ObjectType';
import { StringType } from './Binding/Type/StringType';
import { Type } from './Binding/Type/Type';
import { VoidType } from './Binding/Type/VoidType';
import { CommaSeparator } from './Node/CommaSeparator';
import { AccessibilityDirective } from './Node/Declaration/AccessibilityDirective';
import { AliasDirectiveSequence } from './Node/Declaration/AliasDirectiveSequence';
import { ClassDeclaration } from './Node/Declaration/ClassDeclaration';
import { ClassMethodDeclaration } from './Node/Declaration/ClassMethodDeclaration';
import { DataDeclarationSequence } from './Node/Declaration/DataDeclarationSequence';
import { Declarations, FunctionLikeDeclaration } from './Node/Declaration/Declaration';
import { ExternClassDeclaration } from './Node/Declaration/ExternDeclaration/ExternClassDeclaration';
import { ExternClassMethodDeclaration } from './Node/Declaration/ExternDeclaration/ExternClassMethodDeclaration';
import { ExternDataDeclarationSequence } from './Node/Declaration/ExternDeclaration/ExternDataDeclarationSequence';
import { ExternFunctionDeclaration } from './Node/Declaration/ExternDeclaration/ExternFunctionDeclaration';
import { FunctionDeclaration } from './Node/Declaration/FunctionDeclaration';
import { ImportStatement } from './Node/Declaration/ImportStatement';
import { InterfaceDeclaration } from './Node/Declaration/InterfaceDeclaration';
import { InterfaceMethodDeclaration } from './Node/Declaration/InterfaceMethodDeclaration';
import { ModuleDeclaration } from './Node/Declaration/ModuleDeclaration';
import { ArrayLiteralExpression } from './Node/Expression/ArrayLiteralExpression';
import { AssignmentExpression } from './Node/Expression/AssignmentExpression';
import { BinaryExpression } from './Node/Expression/BinaryExpression';
import { MissableExpression } from './Node/Expression/Expression';
import { GlobalScopeExpression } from './Node/Expression/GlobalScopeExpression';
import { GroupingExpression } from './Node/Expression/GroupingExpression';
import { IdentifierExpression } from './Node/Expression/IdentifierExpression';
import { IndexExpression } from './Node/Expression/IndexExpression';
import { InvokeExpression } from './Node/Expression/InvokeExpression';
import { NewExpression } from './Node/Expression/NewExpression';
import { NullExpression } from './Node/Expression/NullExpression';
import { ScopeMemberAccessExpression } from './Node/Expression/ScopeMemberAccessExpression';
import { SelfExpression } from './Node/Expression/SelfExpression';
import { SliceExpression } from './Node/Expression/SliceExpression';
import { SuperExpression } from './Node/Expression/SuperExpression';
import { UnaryOpExpression } from './Node/Expression/UnaryOpExpression';
import { Nodes } from './Node/Node';
import { NodeKind } from './Node/NodeKind';
import { ContinueStatement } from './Node/Statement/ContinueStatement';
import { EmptyStatement } from './Node/Statement/EmptyStatement';
import { ExitStatement } from './Node/Statement/ExitStatement';
import { ExpressionStatement } from './Node/Statement/ExpressionStatement';
import { ForLoop } from './Node/Statement/ForLoop';
import { ElseIfStatement, ElseStatement, IfStatement } from './Node/Statement/IfStatement';
import { RepeatLoop } from './Node/Statement/RepeatLoop';
import { ReturnStatement } from './Node/Statement/ReturnStatement';
import { CaseStatement, DefaultStatement, SelectStatement } from './Node/Statement/SelectStatement';
import { Statements } from './Node/Statement/Statement';
import { ThrowStatement } from './Node/Statement/ThrowStatement';
import { CatchStatement, TryStatement } from './Node/Statement/TryStatement';
import { WhileLoop } from './Node/Statement/WhileLoop';
import { MissingToken } from './Token/MissingToken';
import { SkippedToken } from './Token/SkippedToken';
import { NewlineToken, TokenKinds } from './Token/Token';
import { TokenKind } from './Token/TokenKind';

export class Binder {
    private document: string = undefined!;

    bind(moduleDeclaration: ModuleDeclaration) {
        this.document = moduleDeclaration.document;

        return this.bindModuleDeclaration(moduleDeclaration);
    }

    private bindModuleDeclaration(moduleDeclaration: ModuleDeclaration): BoundModuleDeclaration {
        this.declareSymbol(moduleDeclaration);

        for (const member of moduleDeclaration.headerMembers) {
            switch (member.kind) {
                case NodeKind.FriendDirective: {
                    // Selectively exports symbols.
                    break;
                }
                case NodeKind.AliasDirectiveSequence: {
                    this.bindAliasDirectiveSequence(member, moduleDeclaration);
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

        let boundMembers: BoundFunctionLikeDeclaration[] = [];

        for (const member of moduleDeclaration.members) {
            switch (member.kind) {
                case NodeKind.AccessibilityDirective: {
                    // Selectively exports symbols.
                    break;
                }
                case NodeKind.DataDeclarationSequence:
                case NodeKind.ExternDataDeclarationSequence: {
                    this.bindDataDeclarationSequence(member, moduleDeclaration);
                    break;
                }
                case NodeKind.FunctionDeclaration:
                case NodeKind.ExternFunctionDeclaration: {
                    const boundFunction = this.bindFunctionLikeDeclaration(member, moduleDeclaration);
                    boundMembers.push(boundFunction);
                    break;
                }
                case NodeKind.InterfaceDeclaration: {
                    this.bindInterfaceDeclaration(member, moduleDeclaration);
                    break;
                }
                case NodeKind.ClassDeclaration:
                case NodeKind.ExternClassDeclaration: {
                    this.bindClassDeclaration(member, moduleDeclaration);
                    break;
                }
                default: {
                    type ExpectedType = NewlineToken | SkippedToken<TokenKinds>;
                    assertType<ExpectedType>(member);
                    break;
                }
            }
        }

        return new BoundModuleDeclaration(boundMembers);
    }

    private bindAliasDirectiveSequence(aliasDirectiveSequence: AliasDirectiveSequence, parent: Nodes): void {
        for (const child of aliasDirectiveSequence.children) {
            switch (child.kind) {
                case NodeKind.AliasDirective: {
                    this.declareSymbol(child, parent);
                    break;
                }
                default: {
                    assertType<CommaSeparator>(child);
                    break;
                }
            }
        }
    }

    private bindInterfaceDeclaration(interfaceDeclaration: InterfaceDeclaration, parent: Nodes): void {
        this.declareSymbol(interfaceDeclaration, parent);

        for (const member of interfaceDeclaration.members) {
            switch (member.kind) {
                case NodeKind.DataDeclarationSequence: {
                    this.bindDataDeclarationSequence(member, interfaceDeclaration);
                    break;
                }
                case NodeKind.InterfaceMethodDeclaration: {
                    this.bindFunctionLikeDeclaration(member, interfaceDeclaration);
                    break;
                }
                default: {
                    type ExpectedType = NewlineToken | SkippedToken<TokenKinds>;
                    assertType<ExpectedType>(member);
                    break;
                }
            }
        }
    }

    private bindClassDeclaration(classDeclaration: ClassDeclaration | ExternClassDeclaration, parent: Nodes): void {
        this.declareSymbol(classDeclaration, parent);

        for (const member of classDeclaration.members) {
            switch (member.kind) {
                case NodeKind.DataDeclarationSequence:
                case NodeKind.ExternDataDeclarationSequence: {
                    this.bindDataDeclarationSequence(member, classDeclaration);
                    break;
                }
                case NodeKind.FunctionDeclaration:
                case NodeKind.ExternFunctionDeclaration:
                case NodeKind.ClassMethodDeclaration:
                case NodeKind.ExternClassMethodDeclaration: {
                    this.bindFunctionLikeDeclaration(member, classDeclaration);
                    break;
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

    private bindFunctionLikeDeclaration(functionLikeDeclaration: FunctionLikeDeclaration, parent: Nodes): BoundFunctionLikeDeclaration {
        this.declareSymbol(functionLikeDeclaration, parent);

        for (const parameter of functionLikeDeclaration.parameters) {
            switch (parameter.kind) {
                case NodeKind.DataDeclaration: {
                    this.declareSymbol(functionLikeDeclaration, parameter);
                    break;
                }
                default: {
                    assertType<CommaSeparator>(parameter);
                    break;
                }
            }
        }

        let boundStatements: BoundExpressionStatement[] = [];

        switch (functionLikeDeclaration.kind) {
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration: {
                if (functionLikeDeclaration.statements) {
                    boundStatements.push(...this.bindStatements(functionLikeDeclaration));
                }
                break;
            }
            default: {
                type ExpectedType =
                    ExternFunctionDeclaration |
                    InterfaceMethodDeclaration |
                    ExternClassMethodDeclaration
                    ;
                assertType<ExpectedType>(functionLikeDeclaration);
                break;
            }
        }

        return new BoundFunctionLikeDeclaration(boundStatements);
    }

    private bindStatements(scopedNode: ScopedNode) {
        const boundStatements: BoundExpressionStatement[] = [];

        if (scopedNode.statements) {
            for (const statement of scopedNode.statements) {
                switch (statement.kind) {
                    case TokenKind.Skipped: { break; }
                    default: {
                        const boundStatement = this.bindStatement(scopedNode, statement);
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

    private bindStatement(parent: Nodes, statement: Statements) {
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

    private bindForLoop(statement: ForLoop): void {
        switch (statement.header.kind) {
            case NodeKind.DataDeclarationSequenceStatement: {
                this.bindDataDeclarationSequence(statement.header.dataDeclarationSequence, statement);
                break;
            }
            case NodeKind.NumericForLoopHeader: {
                if (statement.header.loopVariableExpression.kind === NodeKind.DataDeclarationSequenceStatement) {
                    this.bindDataDeclarationSequence(statement.header.loopVariableExpression.dataDeclarationSequence, statement);
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
            this.declareSymbol(catchStatement.parameter, catchStatement);
        }

        this.bindStatements(catchStatement);
    }

    private bindDataDeclarationSequence(dataDeclarationSequence: DataDeclarationSequence | ExternDataDeclarationSequence, parent: Nodes): void {
        for (const child of dataDeclarationSequence.children) {
            switch (child.kind) {
                case NodeKind.DataDeclaration:
                case NodeKind.ExternDataDeclaration: {
                    this.declareSymbol(child, parent);
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
        const expression = this.bindExpression(statement.expression);

        return new BoundExpressionStatement(expression);
    }

    private bindExpression(expression: MissableExpression): BoundExpression {
        switch (expression.kind) {
            case NodeKind.InvokeExpression: {
                return this.bindInvokeExpression(expression);
            }
            case NodeKind.BinaryExpression: {
                return this.bindBinaryExpression(expression);
            }
            case NodeKind.UnaryOpExpression: {
                return this.bindUnaryOpExpression(expression);
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
                    NullExpression |
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
        // TODO: Determine return type of invocation.
        let type = VoidType.type;

        let boundArguments: BoundExpression[] = [];

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

        return new BoundInvokeExpression(type, boundArguments);
    }

    private bindBinaryExpression(expression: BinaryExpression): BoundBinaryExpression {
        const leftOperand = this.bindExpression(expression.leftOperand);
        const rightOperand = this.bindExpression(expression.rightOperand);

        let type: Type;

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

                type = balancedType;
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

                type = IntType.type;
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

                switch (balancedType) {
                    case null:
                    case ArrayType.type: {
                        throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
                    }
                    case BoolType.type:
                    case ObjectType.type: {
                        if (operatorKind !== TokenKind.EqualsSign &&
                            operatorKind !== TokenKind.LessThanSignGreaterThanSign) {
                            throw new Error(`'${operatorKind}' is not valid for '${leftOperand.kind}' and '${rightOperand.kind}'.`);
                        }

                        break;
                    }
                }

                type = BoolType.type;
                break;
            }

            // Conditional operations
            case TokenKind.AndKeyword:
            case TokenKind.OrKeyword: {
                type = BoolType.type;
                break;
            }

            default:
                type = assertNever(operatorKind);
                break;
        }

        return new BoundBinaryExpression(type, leftOperand, rightOperand);
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

    private bindUnaryOpExpression(expression: UnaryOpExpression): BoundUnaryOpExpression {
        const boundOperand = this.bindExpression(expression.operand);

        let type: Type;

        const operatorKind = expression.operator.kind;
        switch (operatorKind) {
            // Unary plus
            case TokenKind.PlusSign:
            // Unary minus
            case TokenKind.HyphenMinus: {
                const boundOperandType = boundOperand.type;
                switch (boundOperandType) {
                    case IntType.type:
                    case FloatType.type: {
                        type = boundOperandType;
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
                if (boundOperand.type.isConvertibleTo(IntType.type)) {
                    type = IntType.type;
                } else {
                    throw new Error(`Cannot get bitwise complement of '${boundOperand.type}'. '${boundOperand.type}' is not implicitly convertible to 'Int'.`);
                }
                break;
            }
            // Boolean inverse
            case TokenKind.NotKeyword: {
                type = BoolType.type;
                break;
            }
            default: {
                type = assertNever(operatorKind);
                break;
            }
        }

        return new BoundUnaryOpExpression(type, boundOperand);
    }

    private bindBooleanLiteralExpression() {
        return new BoundBooleanLiteralExpression();
    }

    private bindIntegerLiteralExpression() {
        return new BoundIntegerLiteralExpression();
    }

    private bindFloatLiteralExpression() {
        return new BoundFloatLiteralExpression();
    }

    private bindStringLiteralExpression() {
        return new BoundStringLiteralExpression();
    }

    // #region Core

    private declareSymbol(declaration: Declarations, parent?: Nodes): void {
        const name = this.getDeclarationName(declaration);

        let symbol: BoundSymbol | undefined;

        if (parent) {
            if (!parent.locals) {
                parent.locals = new BoundSymbolTable();
            }

            symbol = parent.locals.get(name);
            if (!symbol) {
                symbol = new BoundSymbol(name);
                parent.locals.set(name, symbol);
            }
        } else {
            symbol = new BoundSymbol(name);
        }

        symbol.declarations.push(declaration);
        declaration.symbol = symbol;
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
    constructor(public name: string) { }

    declarations: Declarations[] = [];

    toJSON(): any {
        return {
            name: this.name,
            declarations: this.declarations.map(d => d.kind),
        };
    }
}

export class BoundSymbolTable extends Map<string, BoundSymbol> {
    toJSON(): any {
        let obj = Object.create(null);

        for (let [k, v] of this) {
            obj[k] = v;
        }

        return obj;
    }
}
