export enum BoundNodeKind {
    ModuleDeclaration = 'ModuleDeclaration',
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
