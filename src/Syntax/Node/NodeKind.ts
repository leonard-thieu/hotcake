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
    ElseIfStatement = 'ElseIfStatement',
    ElseStatement = 'ElseStatement',
    SelectStatement = 'SelectStatement',
    CaseStatement = 'CaseStatement',
    DefaultStatement = 'DefaultStatement',
    WhileLoop = 'WhileLoop',
    RepeatLoop = 'RepeatLoop',
    ForLoop = 'ForLoop',
    NumericForLoopHeader = 'NumericForLoopHeader',
    ContinueStatement = 'ContinueStatement',
    ExitStatement = 'ExitStatement',
    ThrowStatement = 'ThrowStatement',
    TryStatement = 'TryStatement',
    CatchStatement = 'CatchStatement',
    ExpressionStatement = 'ExpressionStatement',
    EmptyStatement = 'EmptyStatement',

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
    GroupingExpression = 'GroupingExpression',
    UnaryExpression = 'UnaryExpression',
    BinaryExpression = 'BinaryExpression',
    AssignmentExpression = 'AssignmentExpression',
    GlobalScopeExpression = 'GlobalScopeExpression',

    ModulePath = 'ModulePath',
    ArrayTypeDeclaration = 'ArrayTypeDeclaration',
    ShorthandTypeDeclaration = 'ShorthandTypeDeclaration',
    LonghandTypeDeclaration = 'LonghandTypeDeclaration',
    TypeReference = 'TypeReference',
    TypeParameter = 'TypeParameter',
    EscapedIdentifier = 'EscapedIdentifier',
    CommaSeparator = 'CommaSeparator',
}