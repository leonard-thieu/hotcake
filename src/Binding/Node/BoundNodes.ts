import { BoundDeclarations } from './Declaration/BoundDeclarations';
import { BoundExpressions } from './Expression/BoundExpressions';
import { BoundElseClause, BoundElseIfClause } from './Statement/BoundIfStatement';
import { BoundCaseClause, BoundDefaultClause } from './Statement/BoundSelectStatement';
import { BoundStatements } from './Statement/BoundStatements';
import { BoundCatchClause } from './Statement/BoundTryStatement';

export abstract class BoundNode {
    abstract readonly kind: BoundNodeKind = undefined!;
    parent?: BoundNodes = undefined!;
}

export type BoundNodes =
    | BoundDeclarations
    | BoundStatements
    | BoundElseIfClause | BoundElseClause
    | BoundCaseClause | BoundDefaultClause
    | BoundCatchClause
    | BoundExpressions
    ;

export enum BoundNodeKind {
    IntrinsicType = 'IntrinsicType',
    Directory = 'Directory',

    ModuleDeclaration = 'ModuleDeclaration',

    AliasDirective = 'AliasDirective',

    ExternDataDeclaration = 'ExternDataDeclaration',
    ExternFunctionDeclaration = 'ExternFunctionDeclaration',
    ExternClassDeclaration = 'ExternClassDeclaration',
    ExternClassMethodDeclaration = 'ExternClassMethodDeclaration',
    ExternClassMethodGroupDeclaration = 'ExternClassMethodGroupDeclaration',

    DataDeclaration = 'DataDeclaration',
    FunctionDeclaration = 'FunctionDeclaration',
    FunctionGroupDeclaration = 'FunctionGroupDeclaration',
    InterfaceDeclaration = 'InterfaceDeclaration',
    InterfaceMethodDeclaration = 'InterfaceMethodDeclaration',
    InterfaceMethodGroupDeclaration = 'InterfaceMethodGroupDeclaration',
    ClassDeclaration = 'ClassDeclaration',
    ClassMethodDeclaration = 'ClassMethodDeclaration',
    ClassMethodGroupDeclaration = 'ClassMethodGroupDeclaration',
    TypeParameter = 'TypeParameter',

    DataDeclarationStatement = 'DataDeclarationStatement',
    ReturnStatement = 'ReturnStatement',
    IfStatement = 'IfStatement',
    ElseIfClause = 'ElseIfClause',
    ElseClause = 'ElseClause',
    SelectStatement = 'SelectStatement',
    CaseClause = 'CaseClause',
    DefaultClause = 'DefaultClause',
    WhileLoop = 'WhileLoop',
    RepeatLoop = 'RepeatLoop',
    ForLoop = 'ForLoop',
    ContinueStatement = 'ContinueStatement',
    ExitStatement = 'ExitStatement',
    ThrowStatement = 'ThrowStatement',
    TryStatement = 'TryStatement',
    CatchClause = 'CatchClause',
    AssignmentStatement = 'AssignmentStatement',
    ExpressionStatement = 'ExpressionStatement',

    BinaryExpression = 'BinaryExpression',
    UnaryExpression = 'UnaryExpression',
    NewExpression = 'NewExpression',
    NullExpression = 'NullExpression',
    BooleanLiteralExpression = 'BooleanLiteralExpression',
    SelfExpression = 'SelfExpression',
    SuperExpression = 'SuperExpression',
    StringLiteralExpression = 'StringLiteralExpression',
    FloatLiteralExpression = 'FloatLiteralExpression',
    IntegerLiteralExpression = 'IntegerLiteralExpression',
    ArrayLiteralExpression = 'ArrayLiteralExpression',
    GlobalScopeExpression = 'GlobalScopeExpression',
    IdentifierExpression = 'IdentifierExpression',
    GroupingExpression = 'GroupingExpression',
    ScopeMemberAccessExpression = 'ScopeMemberAccessExpression',
    IndexExpression = 'IndexExpression',
    SliceExpression = 'SliceExpression',
    InvokeExpression = 'InvokeExpression',
    CastExpression = 'CastExpression',
    PlaceholderExpression = 'PlaceholderExpression',
}

export type BoundNodeKindToBoundNodeMap = {
    [K in keyof typeof BoundNodeKind]: Extract<BoundNodes, { kind: K; }>;
}
