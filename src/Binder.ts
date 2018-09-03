import path = require('path');
import { assertType } from './assertNever';
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
import { StrictDirective } from './Node/Declaration/StrictDirective';
import { AssignmentExpression } from './Node/Expression/AssignmentExpression';
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
    private document: string;

    bind(moduleDeclaration: ModuleDeclaration): void {
        this.document = moduleDeclaration.document;

        this.bindModuleDeclaration(moduleDeclaration);
    }

    private bindModuleDeclaration(moduleDeclaration: ModuleDeclaration): void {
        this.declareSymbol(null, moduleDeclaration);

        for (const member of moduleDeclaration.members) {
            switch (member.kind) {
                case NodeKind.FriendDirective: {
                    // Selectively exports symbols.
                    break;
                }
                case NodeKind.AccessibilityDirective: {
                    // Selectively exports symbols.
                    break;
                }
                case NodeKind.ExternDataDeclarationSequence:
                case NodeKind.DataDeclarationSequence: {
                    this.bindDataDeclarationSequence(moduleDeclaration, member);
                    break;
                }
                case NodeKind.AliasDirectiveSequence: {
                    this.bindAliasDirectiveSequence(moduleDeclaration, member);
                    break;
                }
                case NodeKind.ExternFunctionDeclaration:
                case NodeKind.FunctionDeclaration: {
                    this.bindFunctionLikeDeclaration(moduleDeclaration, member);
                    break;
                }
                case NodeKind.InterfaceDeclaration: {
                    this.bindInterfaceDeclaration(moduleDeclaration, member);
                    break;
                }
                case NodeKind.ExternClassDeclaration:
                case NodeKind.ClassDeclaration: {
                    this.bindClassDeclaration(moduleDeclaration, member);
                    break;
                }
                default: {
                    type ExpectedType =
                        StrictDirective |
                        ImportStatement |
                        NewlineToken |
                        SkippedToken<TokenKinds>
                        ;
                    assertType<ExpectedType>(member);
                    break;
                }
            }
        }
    }

    private bindAliasDirectiveSequence(parent: Nodes, aliasDirectiveSequence: AliasDirectiveSequence): void {
        for (const child of aliasDirectiveSequence.children) {
            switch (child.kind) {
                case NodeKind.AliasDirective: {
                    this.declareSymbol(parent, child);
                    break;
                }
                default: {
                    assertType<CommaSeparator>(child);
                    break;
                }
            }
        }
    }

    private bindInterfaceDeclaration(parent: Nodes, interfaceDeclaration: InterfaceDeclaration): void {
        this.declareSymbol(parent, interfaceDeclaration);

        for (const member of interfaceDeclaration.members) {
            switch (member.kind) {
                case NodeKind.DataDeclarationSequence: {
                    this.bindDataDeclarationSequence(interfaceDeclaration, member);
                    break;
                }
                case NodeKind.InterfaceMethodDeclaration: {
                    this.bindFunctionLikeDeclaration(interfaceDeclaration, member);
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
    }

    private bindClassDeclaration(parent: Nodes, classDeclaration: ExternClassDeclaration | ClassDeclaration): void {
        this.declareSymbol(parent, classDeclaration);

        for (const member of classDeclaration.members) {
            switch (member.kind) {
                case NodeKind.ExternDataDeclarationSequence:
                case NodeKind.DataDeclarationSequence: {
                    this.bindDataDeclarationSequence(classDeclaration, member);
                    break;
                }
                case NodeKind.ExternFunctionDeclaration:
                case NodeKind.ExternClassMethodDeclaration:
                case NodeKind.FunctionDeclaration:
                case NodeKind.ClassMethodDeclaration: {
                    this.bindFunctionLikeDeclaration(classDeclaration, member);
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

    private bindFunctionLikeDeclaration(parent: Nodes, functionLikeDeclaration: FunctionLikeDeclaration): void {
        this.declareSymbol(parent, functionLikeDeclaration);

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

        switch (functionLikeDeclaration.kind) {
            case NodeKind.FunctionDeclaration:
            case NodeKind.ClassMethodDeclaration: {
                if (functionLikeDeclaration.statements) {
                    this.bindStatements(functionLikeDeclaration);
                }
                break;
            }
            default: {
                type ExpectedType =
                    ExternFunctionDeclaration |
                    ExternClassMethodDeclaration |
                    InterfaceMethodDeclaration
                    ;
                assertType<ExpectedType>(functionLikeDeclaration);
                break;
            }
        }
    }

    private bindStatements(scopedNode: ScopedNode): void {
        if (scopedNode.statements) {
            for (const statement of scopedNode.statements) {
                switch (statement.kind) {
                    case TokenKind.Skipped: { break; }
                    default: {
                        this.bindStatement(scopedNode, statement);
                        break;
                    }
                }
            }
        }
    }

    private bindStatement(parent: Nodes, statement: Statements): void {
        switch (statement.kind) {
            case NodeKind.DataDeclarationSequenceStatement: {
                this.bindDataDeclarationSequence(parent, statement.dataDeclarationSequence);
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
            default: {
                type ExpectedType =
                    ElseIfStatement | ElseStatement |
                    CaseStatement | DefaultStatement |
                    ContinueStatement | ExitStatement |
                    ThrowStatement |
                    CatchStatement |
                    ReturnStatement |
                    ExpressionStatement |
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
                this.bindDataDeclarationSequence(statement, statement.header.dataDeclarationSequence);
                break;
            }
            case NodeKind.NumericForLoopHeader: {
                if (statement.header.loopVariableExpression.kind === NodeKind.DataDeclarationSequenceStatement) {
                    this.bindDataDeclarationSequence(statement, statement.header.loopVariableExpression.dataDeclarationSequence);
                }
                break;
            }
            default: {
                type ExpectedType =
                    AssignmentExpression |
                    MissingToken<TokenKind.ForLoopHeader>
                    ;
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
            this.declareSymbol(catchStatement, catchStatement.parameter);
        }

        this.bindStatements(catchStatement);
    }

    private bindDataDeclarationSequence(parent: Nodes, dataDeclarationSequence: ExternDataDeclarationSequence | DataDeclarationSequence): void {
        for (const child of dataDeclarationSequence.children) {
            switch (child.kind) {
                case NodeKind.ExternDataDeclaration:
                case NodeKind.DataDeclaration: {
                    this.declareSymbol(parent, child);
                    break;
                }
                default: {
                    assertType<CommaSeparator>(child);
                    break;
                }
            }
        }
    }

    // #region Core

    private declareSymbol(parent: Nodes | null, declaration: Declarations): void {
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
            case NodeKind.ExternDataDeclaration:
            case NodeKind.ExternFunctionDeclaration:
            case NodeKind.ExternClassDeclaration:
            case NodeKind.ExternClassMethodDeclaration:
            case NodeKind.DataDeclaration:
            case NodeKind.AliasDirective:
            case NodeKind.FunctionDeclaration:
            case NodeKind.InterfaceDeclaration:
            case NodeKind.InterfaceMethodDeclaration:
            case NodeKind.ClassDeclaration:
            case NodeKind.ClassMethodDeclaration: {
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
