export enum BoundNodeKind {
    ModuleDeclaration = 'ModuleDeclaration',
    InterfaceDeclaration = 'InterfaceDeclaration',
    InterfaceMethodDeclaration = 'InterfaceMethodDeclaration',
    ClassDeclaration = 'ClassDeclaration',
    ClassMethodDeclaration = 'ClassMethodDeclaration',
    FunctionDeclaration = 'FunctionDeclaration',
    DataDeclaration = 'DataDeclaration',

    ExpressionStatement = 'ExpressionStatement',

    InvokeExpression = 'InvokeExpression',
    BinaryExpression = 'BinaryExpression',
    UnaryExpression = 'UnaryExpression',
    NullExpression = 'NullExpression',
    BooleanLiteralExpression = 'BooleanLiteralExpression',
    IntegerLiteralExpression = 'IntegerLiteralExpression',
    FloatLiteralExpression = 'FloatLiteralExpression',
    StringLiteralExpression = 'StringLiteralExpression',
}
