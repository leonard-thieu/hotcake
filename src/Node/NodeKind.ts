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
    LocalDeclarationListStatement = 'LocalDeclarationListStatement',
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
    ExpressionStatement = 'ExpressionStatement',
    EmptyStatement = 'EmptyStatement',

    ModulePath = 'ModulePath',
    TypeReference = 'TypeReference',
    ArrayTypeDeclaration = 'ArrayTypeDeclaration',
    DataDeclaration = 'DataDeclaration',
    DataDeclarationList = 'DataDeclarationList',
    ShorthandTypeDeclaration = 'ShorthandTypeDeclaration',
    LonghandTypeDeclaration = 'LonghandTypeDeclaration',
    TypeParameter = 'TypeParameter',
    CommaSeparator = 'CommaSeparator',

    NewExpression = 'NewExpression',
    NullExpression = 'NullExpression',
    BooleanLiteral = 'BooleanLiteral',
    SelfExpression = 'SelfExpression',
    SuperExpression = 'SuperExpression',
    FloatLiteral = 'FloatLiteral',
    IntegerLiteral = 'IntegerLiteral',
    StringLiteral = 'StringLiteral',
    ArrayLiteral = 'ArrayLiteral',
    IdentifierExpression = 'IdentifierExpression',
    ScopeMemberAccessExpression = 'ScopeMemberAccessExpression',
    InvokeExpression = 'InvokeExpression',
    IndexExpression = 'IndexExpression',
    UnaryOpExpression = 'UnaryOpExpression',
    BinaryExpression = 'BinaryExpression',
    AssignmentExpression = 'AssignmentExpression',
    GroupingExpression = 'GroupingExpression',
}
