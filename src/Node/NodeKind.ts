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

    BooleanLiteral,
    FloatLiteral,
    IntegerLiteral,
    StringLiteral,
    Variable,
    BinaryExpression,
    GroupingExpression,
    UnaryOpExpression,
}
