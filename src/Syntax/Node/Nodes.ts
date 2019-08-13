import { ArrayTypeAnnotation } from './ArrayTypeAnnotation';
import { CommaSeparator } from './CommaSeparator';
import { Declarations } from './Declaration/Declarations';
import { Directives } from './Directive/Directives';
import { ElseDirective, ElseIfDirective } from './Directive/IfDirective';
import { Expressions } from './Expression/Expressions';
import { ConfigurationTag } from './Expression/StringLiteralExpression';
import { EscapedIdentifier } from './Identifier';
import { ModulePath } from './ModulePath';
import { ElseClause, ElseIfClause } from './Statement/IfStatement';
import { CaseClause, DefaultClause } from './Statement/SelectStatement';
import { Statements } from './Statement/Statements';
import { CatchClause } from './Statement/TryStatement';
import { TypeAnnotation } from './TypeAnnotation';
import { TypeReference } from './TypeReference';

export abstract class Node {
    abstract readonly kind: NodeKind = undefined!;
    parent?: Nodes = undefined;
}

export type Nodes =
    | Declarations
    | Directives
    | ElseIfDirective | ElseDirective
    | Statements
    | ElseIfClause | ElseClause
    | CaseClause | DefaultClause
    | CatchClause
    | Expressions
    | ConfigurationTag
    | EscapedIdentifier
    | ModulePath
    | TypeAnnotation | ArrayTypeAnnotation
    | TypeReference
    | CommaSeparator
    ;

export enum NodeKind {
    PreprocessorModuleDeclaration = 'PreprocessorModuleDeclaration',

    IfDirective = 'IfDirective',
    ElseIfDirective = 'ElseIfDirective',
    ElseDirective = 'ElseDirective',
    RemDirective = 'RemDirective',
    PrintDirective = 'PrintDirective',
    ErrorDirective = 'ErrorDirective',
    AssignmentDirective = 'AssignmentDirective',

    ModuleDeclaration = 'ModuleDeclaration',

    ExternDataDeclarationSequence = 'ExternDataDeclarationSequence',
    ExternDataDeclaration = 'ExternDataDeclaration',
    ExternFunctionDeclaration = 'ExternFunctionDeclaration',
    ExternClassDeclaration = 'ExternClassDeclaration',
    ExternClassMethodDeclaration = 'ExternClassMethodDeclaration',

    StrictDirective = 'StrictDirective',
    ImportStatement = 'ImportStatement',
    FriendDirective = 'FriendDirective',
    AccessibilityDirective = 'AccessibilityDirective',
    AliasDirectiveSequence = 'AliasDirectiveSequence',
    AliasDirective = 'AliasDirective',
    DataDeclarationSequence = 'DataDeclarationSequence',
    DataDeclaration = 'DataDeclaration',
    FunctionDeclaration = 'FunctionDeclaration',
    InterfaceDeclaration = 'InterfaceDeclaration',
    InterfaceMethodDeclaration = 'InterfaceMethodDeclaration',
    ClassDeclaration = 'ClassDeclaration',
    ClassMethodDeclaration = 'ClassMethodDeclaration',

    DataDeclarationSequenceStatement = 'DataDeclarationSequenceStatement',
    ReturnStatement = 'ReturnStatement',
    IfStatement = 'IfStatement',
    ElseIfClause = 'ElseIfClause',
    ElseClause = 'ElseClause',
    SelectStatement = 'SelectStatement',
    CaseClause = 'CaseClause',
    DefaultClause = 'DefaultClause',
    WhileLoop = 'WhileLoop',
    RepeatLoop = 'RepeatLoop',
    NumericForLoop = 'NumericForLoop',
    ForEachInLoop = 'ForEachInLoop',
    ContinueStatement = 'ContinueStatement',
    ExitStatement = 'ExitStatement',
    ThrowStatement = 'ThrowStatement',
    TryStatement = 'TryStatement',
    CatchClause = 'CatchClause',
    AssignmentStatement = 'AssignmentStatement',
    ExpressionStatement = 'ExpressionStatement',
    EmptyStatement = 'EmptyStatement',

    BinaryExpression = 'BinaryExpression',
    UnaryExpression = 'UnaryExpression',
    NewExpression = 'NewExpression',
    NullExpression = 'NullExpression',
    BooleanLiteralExpression = 'BooleanLiteralExpression',
    SelfExpression = 'SelfExpression',
    SuperExpression = 'SuperExpression',
    IntegerLiteralExpression = 'IntegerLiteralExpression',
    FloatLiteralExpression = 'FloatLiteralExpression',
    StringLiteralExpression = 'StringLiteralExpression',
    ConfigurationTag = 'ConfigurationTag',
    ArrayLiteralExpression = 'ArrayLiteralExpression',
    IdentifierExpression = 'IdentifierExpression',
    ScopeMemberAccessExpression = 'ScopeMemberAccessExpression',
    InvokeExpression = 'InvokeExpression',
    IndexExpression = 'IndexExpression',
    SliceExpression = 'SliceExpression',
    GlobalScopeExpression = 'GlobalScopeExpression',
    GroupingExpression = 'GroupingExpression',

    EscapedIdentifier = 'EscapedIdentifier',
    ModulePath = 'ModulePath',
    ShorthandTypeAnnotation = 'ShorthandTypeAnnotation',
    LonghandTypeAnnotation = 'LonghandTypeAnnotation',
    ArrayTypeAnnotation = 'ArrayTypeAnnotation',
    TypeReference = 'TypeReference',
    TypeParameter = 'TypeParameter',
    CommaSeparator = 'CommaSeparator',
}

export type NodeKindToNodeMap = {
    [K in keyof typeof NodeKind]: Extract<Nodes, { kind: K; }>;
}
