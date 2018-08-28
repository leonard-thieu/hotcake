export enum NodeKind {
    PreprocessorModule,

    IfDirective,
    ElseIfDirective,
    ElseDirective,
    EndDirective,
    RemDirective,
    PrintDirective,
    ErrorDirective,
    AssignmentDirective,

    Module,

    StrictDirective,
    ImportStatement,
    FriendDirective,
    AccessibilityDirective,
    AliasDirective,
    ConstantDeclaration,
    VariableDeclaration,
    FunctionDeclaration,
    InterfaceDeclaration,
    ClassDeclaration,

    InterfaceMethodDeclaration,

    ModulePath,
    QualifiedIdentifier,
    DataDeclaration,
    DataDeclarationList,

    BooleanLiteral,
    FloatLiteral,
    IntegerLiteral,
    StringLiteral,
    Variable,
    BinaryExpression,
    GroupingExpression,
    UnaryOpExpression,
}
