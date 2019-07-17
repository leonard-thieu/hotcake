export enum BoundNodeKind {
    Directory = 'Directory',

    ModuleDeclaration = 'ModuleDeclaration',

    ImportStatement = 'ImportStatement',
    ModulePath = 'ModulePath',
    AliasDirective = 'AliasDirective',
    ModuleReference = 'ModuleReference',

    ExternDataDeclaration = 'ExternDataDeclaration',
    ExternFunctionDeclaration = 'ExternFunctionDeclaration',
    ExternClassDeclaration = 'ExternClassDeclaration',
    ExternClassMethodDeclaration = 'ExternClassMethodDeclaration',

    DataDeclaration = 'DataDeclaration',
    FunctionDeclaration = 'FunctionDeclaration',
    InterfaceDeclaration = 'InterfaceDeclaration',
    InterfaceMethodDeclaration = 'InterfaceMethodDeclaration',
    ClassDeclaration = 'ClassDeclaration',
    ClassMethodDeclaration = 'ClassMethodDeclaration',

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
    ExpressionStatement = 'ExpressionStatement',

    AssignmentExpression = 'AssignmentExpression',
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
}
