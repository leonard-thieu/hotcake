export enum NodeKind {
    PreprocessorModuleDeclaration = 'PreprocessorModuleDeclaration',

    IfDirective = 'IfDirective',
    ElseIfDirective = 'ElseIfDirective',
    ElseDirective = 'ElseDirective',
    EndDirective = 'EndDirective',
    RemDirective = 'RemDirective',
    PrintDirective = 'PrintDirective',
    ErrorDirective = 'ErrorDirective',
    AssignmentDirective = 'AssignmentDirective',

    ModuleDeclaration = 'ModuleDeclaration',

    StrictDirective = 'StrictDirective',
    ImportStatement = 'ImportStatement',
    FriendDirective = 'FriendDirective',
    AccessibilityDirective = 'AccessibilityDirective',
    AliasDirective = 'AliasDirective',
    ConstantDeclaration = 'ConstantDeclaration',
    VariableDeclaration = 'VariableDeclaration',
    FunctionDeclaration = 'FunctionDeclaration',
    InterfaceDeclaration = 'InterfaceDeclaration',
    ClassDeclaration = 'ClassDeclaration',

    InterfaceMethodDeclaration = 'InterfaceMethodDeclaration',
    ClassMethodDeclaration = 'ClassMethodDeclaration',
    ReturnStatement = 'ReturnStatement',
    IfStatement = 'IfStatement',
    ElseIfStatement = 'ElseIfStatement',
    ElseStatement = 'ElseStatement',
    SelectStatement = 'SelectStatement',
    CaseStatement = 'CaseStatement',
    DefaultStatement = 'DefaultStatement',
    WhileLoop = 'WhileLoop',
    RepeatLoop = 'RepeatLoop',
    ForLoop = 'ForLoop',
    NumericForLoopHeader = 'NumericForLoopHeader',
    ForEachInLoopHeader = 'ForEachInLoopHeader',
    ForEachInLoopDataDeclaration = 'ForEachInLoopDataDeclaration',
    ContinueStatement = 'ContinueStatement',
    ExitStatement = 'ExitStatement',
    ThrowStatement = 'ThrowStatement',
    TryStatement = 'TryStatement',
    CatchStatement = 'CatchStatement',
    EmptyStatement = 'EmptyStatement',

    ModulePath = 'ModulePath',
    QualifiedIdentifier = 'QualifiedIdentifier',
    DataDeclaration = 'DataDeclaration',
    DataDeclarationList = 'DataDeclarationList',
    TypeParameter = 'TypeParameter',
    CommaSeparator = 'CommaSeparator',

    BooleanLiteral = 'BooleanLiteral',
    FloatLiteral = 'FloatLiteral',
    IntegerLiteral = 'IntegerLiteral',
    StringLiteral = 'StringLiteral',
    Variable = 'Variable',
    BinaryExpression = 'BinaryExpression',
    GroupingExpression = 'GroupingExpression',
    UnaryOpExpression = 'UnaryOpExpression',
}
