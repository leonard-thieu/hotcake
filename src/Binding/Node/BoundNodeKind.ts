export enum BoundNodeKind {
    ModuleDeclaration = 'ModuleDeclaration',
    InterfaceDeclaration = 'InterfaceDeclaration',
    InterfaceMethodDeclaration = 'InterfaceMethodDeclaration',
    ClassDeclaration = 'ClassDeclaration',
    ClassMethodDeclaration = 'ClassMethodDeclaration',
    FunctionDeclaration = 'FunctionDeclaration',
    DataDeclaration = 'DataDeclaration',

    ReturnStatement = 'ReturnStatement',
    ExpressionStatement = 'ExpressionStatement',

    NewExpression = 'NewExpression',
    InvokeExpression = 'InvokeExpression',
    BinaryExpression = 'BinaryExpression',
    UnaryExpression = 'UnaryExpression',
    IdentifierExpression = 'IdentifierExpression',
    NullExpression = 'NullExpression',
    BooleanLiteralExpression = 'BooleanLiteralExpression',
    IntegerLiteralExpression = 'IntegerLiteralExpression',
    FloatLiteralExpression = 'FloatLiteralExpression',
    StringLiteralExpression = 'StringLiteralExpression',
}
