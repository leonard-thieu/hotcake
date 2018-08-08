parser grammar MonkeyXParser;

options
{
    tokenVocab = MonkeyXLexer;
}

// Should/can preprocessor directives be handled separately?

moduleDeclaration :
    (
        preprocessorDirective |
        strictDirective |
        privateDirective |
        publicDirective |
        externPrivateDirective |
        externDirective |
        importStatement |
        friendDirective |
        aliasDirective |
        constDeclaration |
        globalDeclaration |
        functionDeclaration |
        interfaceDeclaration |
        classDeclaration |
        Newline
    )*
    EOF
    ;

strictDirective : Strict ;

privateDirective : Private ;

publicDirective : Public ;

externPrivateDirective : Extern Private ;

externDirective : Extern ;

importStatement : Import (modulePath | StringLiteral) ;

friendDirective : Friend modulePath ;

aliasDirective : Alias Identifier EqualsSign modulePath FullStop Identifier ;

/*
 * Preprocessor Directives
 */

preprocessorDirective :
    ifDirective |
    elseIfDirective |
    elseDirective |
    endIfDirective |
    printDirective |
    errorDirective |
    assignmentDirective
    ;

ifDirective : IfDirectiveStart expression ;
elseIfDirective : ElseIfDirectiveStart expression ;
elseDirective : ElseDirectiveStart ;
endIfDirective : EndIfDirectiveStart ;
printDirective : PrintDirectiveStart StringLiteral ;
errorDirective : ErrorDirectiveStart StringLiteral ;
assignmentDirective : NumberSign Identifier assignmentOperator expression ;

/*
 * Declarations
 */

constDeclaration : Const assignedDataDeclaration (Comma assignedDataDeclaration)* ;

globalDeclaration : Global dataDeclarations ;

functionDeclaration :
    Function Identifier typeDeclaration? LeftParenthesis dataDeclarations? RightParenthesis (EqualsSign StringLiteral |
        statement*
    End Function?)?
    ;

interfaceDeclaration :
    Interface Identifier (Extends typeReference (Comma typeReference)*)?
        (
            constDeclaration |
            interfaceMethodDeclaration |
            Newline
        )*
    End Interface?
    ;

interfaceMethodDeclaration :
    Method Identifier typeDeclaration? LeftParenthesis dataDeclarations? RightParenthesis
    ;

classDeclaration :
    Class CommercialAt? Identifier
      (LessThanSign Identifier (Comma Identifier)* GreaterThanSign)?
      (Extends (Null | typeReference))?
      (Implements typeReference (Comma typeReference)*)?
      (Abstract | Final)?
      (EqualsSign StringLiteral)?
        (
            preprocessorDirective |
            privateDirective |
            publicDirective |
            protectedDirective |
            constDeclaration |
            globalDeclaration |
            functionDeclaration |
            constructorDeclaration |
            fieldDeclaration |
            classMethodDeclaration |
            Newline
        )*
    End Class?
    ;

protectedDirective : Protected ;

fieldDeclaration : Field dataDeclarations ;

constructorDeclaration :
    // TODO: Can this be Abstract? Extern?
    Method New LeftParenthesis dataDeclarations? RightParenthesis
        statement*
    End Method?
    ;

classMethodDeclaration :
    // `Final` is undocumented.
    Method Identifier typeDeclaration? LeftParenthesis dataDeclarations? RightParenthesis Property? Final? (EqualsSign StringLiteral | Abstract Property? |
        statement*
    End Method?)?
    ;

/*
 * Statements
 */

statement :
    preprocessorDirective |
    inlineStatement? (Newline | Semicolon)
    ;

inlineStatement :
    localDeclaration |
    constDeclaration |
    returnStatement |
    ifStatement |
    selectStatement |
    whileLoop |
    repeatLoop |
    numericForLoop |
    forEachinLoop |
    continueStatement |
    exitStatement |
    throwStatement |
    tryStatement |
    expressionStatement |
    assignmentStatement
    ;

localDeclaration : Local dataDeclarations ;

returnStatement : Return expression? ;

ifStatement :
    If expression Then? inlineStatement (Else inlineStatement)? #singleLineIfStatement |
    If expression Then? Newline
        statement*
    ((ElseIf | Else If) expression Then? Newline
        statement*)*
    (Else Newline
        statement*)?
    (EndIf | End If?) #multiLineIfStatement
    ;

selectStatement :
    Select expression Newline
        (
            preprocessorDirective |
            Newline
        )*
        caseStatement*
        defaultStatement?
    End Select?
    ;

// TODO: Why does this match multline, comma separated expressions without an explicit Newline token?
// TODO: Allow preprocessor directives between expressions?
caseStatement :
    Case expression (Comma expression)*
        statement*
    ;

defaultStatement :
    Default
        statement*
    ;

whileLoop :
    While expression Newline
        statement*
    (Wend | End While?)
    ;

repeatLoop :
    Repeat Newline
        statement*
    (Until expression | Forever)
    ;

numericForLoop :
    For (localDeclaration | assignmentStatement) (To | Until) expression (Step expression)? Newline
        statement*
    (Next | End For?)
    ;

forEachinLoop :
    For (Local Identifier (typeDeclaration? EqualsSign | InferAssignmentOperator) | Identifier EqualsSign) Eachin expression Newline
        statement*
    (Next | End For?)
    ;

continueStatement : Continue ;

exitStatement : Exit ;

throwStatement : Throw expression ;

tryStatement :
    Try Newline
        statement*
    catchStatement+
    End
    ;

catchStatement :
    Catch dataDeclaration Newline
        statement*
    ;

expressionStatement :
    newExpression (invokeOperator | invokeArguments)? |
    invokableExpression (invokeOperator | invokeArguments)?
    ;

assignmentStatement : assignableExpression assignmentOperator expression ;

assignableExpression :
    indexableExpression indexOperator |
    dottableExpression FullStop Identifier |
    FullStop Identifier |
    Identifier
    ;

assignmentOperator :
    EqualsSign |
    MultiplicationUpdateAssignmentOperator |
    DivisionUpdateAssignmentOperator |
    ShiftLeftUpdateAssignmentOperator |
    ShiftRightUpdateAssignmentOperator |
    ModulusUpdateAssignmentOperator |
    AdditionUpdateAssignmentOperator |
    SubtractionUpdateAssignmentOperator |
    BitwiseAndUpdateAssignmentOperator |
    BitwiseXorUpdateAssignmentOperator |
    BitwiseOrUpdateAssignmentOperator
    ;

/*
 * Expressions
 */

expression :
    Newline* groupingExpression |

    Newline* newExpression |
    Newline* Null |
    Newline* True |
    Newline* False |
    Newline* Self |
    Newline* Super |
    Newline* stringLiteral |
    Newline* FloatLiteral |
    Newline* IntLiteral |
    Newline* arrayLiteral |
    Newline* Identifier |

    Newline* dottableExpression FullStop Identifier |
    Newline* FullStop Identifier |
    Newline* invokableExpression invokeOperator |
    Newline* indexableExpression indexOperator |

    Newline* PlusSign expression |
    Newline* HyphenMinus expression |
    Newline* Tilde expression |
    Newline* Not expression |

    expression Asterisk expression |
    expression Solidus expression |
    expression Mod expression |
    expression Shl expression |
    expression Shr expression |

    expression PlusSign expression |
    expression HyphenMinus expression |

    expression Ampersand expression |
    expression Tilde expression |

    expression VerticalBar expression |

    expression EqualsSign expression |
    expression LessThanSign expression |
    expression GreaterThanSign expression |
    expression LessThanOrEqualsOperator expression |
    expression GreaterThanSign EqualsSign expression |
    expression NotEqualsOperator expression |

    expression And expression |

    expression Or expression
    ;

newExpression : New typeReference ;

dottableExpression :
    groupingExpression |
    newExpression invokeOperator? |
    Self |
    Super |
    stringLiteral |
    arrayLiteral |
    FullStop Identifier |
    typeReference invokeOperator |
    Identifier |
    dottableExpression FullStop Identifier invokeOperator? |
    indexableExpression indexOperator
    ;

invokableExpression :
    newExpression |
    Super FullStop New |
    dottableExpression FullStop Identifier |
    FullStop Identifier |
    Identifier |
    typeReference
    ;

indexableExpression :
    stringLiteral |
    arrayLiteral |
    Identifier |
    (
        Self |
        Super |
    ) FullStop Identifier |
    FullStop? Identifier (FullStop Identifier)* |
    newExpression |
    indexableExpression indexOperator FullStop Identifier |
    indexableExpression indexOperator |
    (
        Identifier |
        typeReference
    ) invokeOperator |
    groupingExpression
    ;

// Undocumented
groupingExpression : LeftParenthesis expression RightParenthesis ;

stringLiteral : StringLiteral ;

arrayLiteral : LeftSquareBracket (expression (Comma expression)*)? RightSquareBracket ;

invokeOperator : LeftParenthesis invokeArguments? RightParenthesis ;

invokeArguments : (Comma | expression) (Comma expression?)* ;

indexOperator : LeftSquareBracket (expression | expression? SliceOperator expression?) RightSquareBracket ;

/*
 * Helpers
 */

dataDeclarations : dataDeclaration (Comma dataDeclaration)* ;

dataDeclaration :
    assignedDataDeclaration |
    baseDataDeclaration
    ;

assignedDataDeclaration :
    Identifier InferAssignmentOperator expression |
    baseDataDeclaration EqualsSign expression
    ;

baseDataDeclaration : Identifier typeDeclaration? ;

typeDeclaration :
    arrayTypeReference+ |
    shorthandTypeReference arrayTypeReference* |
    Colon longhandTypeReference arrayTypeReference*
    ;

typeReference :
    arrayTypeReference+ |
    shorthandTypeReference arrayTypeReference* |
    longhandTypeReference arrayTypeReference*
    ;

longhandTypeReference : (modulePath FullStop)? Identifier genericTypeReference? ;

shorthandTypeReference :
    DollarSign |
    QuestionMark |
    NumberSign |
    PercentSign
    ;

genericTypeReference : LessThanSign typeReference (Comma typeReference)* GreaterThanSign ;

arrayTypeReference :
    // Undocumented?
    LeftSquareBracket expression RightSquareBracket |
    LeftSquareBracket RightSquareBracket
    ;

modulePath : Identifier (FullStop Identifier)* ;
