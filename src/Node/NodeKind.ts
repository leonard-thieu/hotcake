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

    BinaryExpression,
    BooleanLiteral,
    FloatLiteral,
    GroupingExpression,
    IntegerLiteral,
    StringLiteral,
    UnaryOpExpression,
    Variable,
}
