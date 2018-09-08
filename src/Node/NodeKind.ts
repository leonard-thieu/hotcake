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

    StrictDirective = 'StrictDirective',
    ImportStatement = 'ImportStatement',
    FriendDirective = 'FriendDirective',
    AccessibilityDirective = 'AccessibilityDirective',
    AliasDirectiveSequence = 'AliasDirectiveSequence',
    AliasDirective = 'AliasDirective',
    FunctionDeclaration = 'FunctionDeclaration',
    InterfaceDeclaration = 'InterfaceDeclaration',
    ClassDeclaration = 'ClassDeclaration',

    InterfaceMethodDeclaration = 'InterfaceMethodDeclaration',
    ClassMethodDeclaration = 'ClassMethodDeclaration',
    LocalDataDeclarationSequenceStatement = 'LocalDataDeclarationSequenceStatement',
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

    ModulePath = 'ModulePath',
    TypeReference = 'TypeReference',
    ArrayTypeDeclaration = 'ArrayTypeDeclaration',
    DataDeclaration = 'DataDeclaration',
    DataDeclarationSequence = 'DataDeclarationSequence',
    ShorthandTypeDeclaration = 'ShorthandTypeDeclaration',
    LonghandTypeDeclaration = 'LonghandTypeDeclaration',
    TypeParameter = 'TypeParameter',
    CommaSeparator = 'CommaSeparator',

    NewExpression = 'NewExpression',
    NullExpression = 'NullExpression',
    BooleanLiteral = 'BooleanLiteral',
    SelfExpression = 'SelfExpression',
    SuperExpression = 'SuperExpression',
    IntegerLiteral = 'IntegerLiteral',
    FloatLiteral = 'FloatLiteral',
    StringLiteral = 'StringLiteral',
    ConfigurationTag = 'ConfigurationTag',
    ArrayLiteral = 'ArrayLiteral',
    IdentifierExpression = 'IdentifierExpression',
    ScopeMemberAccessExpression = 'ScopeMemberAccessExpression',
    InvokeExpression = 'InvokeExpression',
    IndexExpression = 'IndexExpression',
    SliceExpression = 'SliceExpression',
    GroupingExpression = 'GroupingExpression',
    UnaryOpExpression = 'UnaryOpExpression',
    BinaryExpression = 'BinaryExpression',
    AssignmentExpression = 'AssignmentExpression',
}
