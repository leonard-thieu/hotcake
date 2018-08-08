parser grammar MonkeyXParser;

options
{
    tokenVocab = MonkeyXLexer;
}

// Should/can preprocessor directives be handled separately?

moduleDeclaration :
    (
        Strict |
        Private |
        Public |
        Extern |
        classDeclaration |
        interfaceDeclaration |
        functionDeclaration |
        constDeclaration |
        globalDeclaration |
        importStatement |
        friendDirective |
        aliasDirective |
        preprocessorDirective |
        Newline
    )*
    EOF
    ;

importStatement : Import (modulePath | StringLiteral) ;

friendDirective : Friend modulePath ;

aliasDirective : Alias Identifier EqualsSign modulePath FullStop Identifier ;

modulePath : Identifier (FullStop Identifier)* ;

/*
 * Directives
 */

preprocessorDirective :
    ifDirective |
    elseIfDirective |
    elseDirective |
    endIfDirective |
    endDirective |
    printDirective |
    errorDirective |
    assignmentDirective
    ;

ifDirective : IfDirectiveStart expression ;
elseIfDirective : ElseIfDirectiveStart expression ;
elseDirective : ElseDirectiveStart ;
endIfDirective : EndIfDirectiveStart ;
endDirective : EndDirectiveStart ;
printDirective : PrintDirectiveStart StringLiteral ;
errorDirective : ErrorDirectiveStart StringLiteral ;
assignmentDirective : NumberSign Identifier assignmentOperator expression ;

/*
 * Declarations
 */

classDeclaration :
    Class CommercialAt? Identifier
      (LessThanSign Identifier (Comma Identifier)* GreaterThanSign)?
      (Extends (Null | typeReference))?
      (Implements typeReference (Comma typeReference)*)?
      (Abstract | Final)?
      (EqualsSign StringLiteral)?
        (
            Private |
            Public |
            Protected |
            constDeclaration |
            globalDeclaration |
            functionDeclaration |
            constructorDeclaration |
            fieldDeclaration |
            classMethodDeclaration |
            preprocessorDirective |
            Newline
        )*
    End Class?
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

globalDeclaration : Global dataDeclarations ;
fieldDeclaration : Field dataDeclarations ;
constDeclaration : Const dataDeclarations ;
localDeclaration : Local dataDeclarations ;

functionDeclaration :
    Function Identifier typeDeclaration? LeftParenthesis dataDeclarations? RightParenthesis (EqualsSign StringLiteral |
        (
            preprocessorDirective |
            statement
        )*
    End Function?)?
    ;

constructorDeclaration :
    Method New LeftParenthesis dataDeclarations? RightParenthesis
        (
            preprocessorDirective |
            statement
        )*
    End Method?
    ;

classMethodDeclaration :
    // `Final` is undocumented.
    Method Identifier typeDeclaration? LeftParenthesis dataDeclarations? RightParenthesis Property? Final? (EqualsSign StringLiteral | Abstract Property? |
        (
            preprocessorDirective |
            statement
        )*
    End Method?)?
    ;

interfaceMethodDeclaration :
    Method Identifier typeDeclaration? LeftParenthesis dataDeclarations? RightParenthesis
    ;

dataDeclarations : dataDeclaration (Comma dataDeclaration)* ;
dataDeclaration : Identifier (typeDeclaration? (EqualsSign expression)? | InferAssignmentOperator expression) ;

/*
 * Statements
 */

statement :
    inlineStatement? (Newline | Semicolon) |
    preprocessorDirective
    ;

inlineStatement :
    Exit |
    Continue |
    ifStatement |
    selectStatement |
    whileLoopStatement |
    repeatLoopStatement |
    numericForLoopStatement |
    forEachinLoopStatement |
    throwStatement |
    tryStatement |
    returnStatement |
    localDeclaration |
    constDeclaration |
    expressionStatement |
    assignmentStatement
    ;

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
    Select expression Newline+
        caseStatement*
        defaultStatement?
    End Select?
    ;

caseStatement :
    Case expression (Comma expression)* Newline?
        statement*
    ;

defaultStatement :
    Default Newline?
        statement*
    ;

whileLoopStatement :
    While expression Newline
        statement*
    (Wend | End While?)
    ;

repeatLoopStatement :
    Repeat Newline
        statement*
    (Until expression | Forever)
    ;

numericForLoopStatement :
    For (localDeclaration | assignmentStatement) (To | Until) expression (Step expression)? Newline
        statement*
    (Next | End For?)
    ;

forEachinLoopStatement :
    For (Local Identifier (typeDeclaration? EqualsSign | InferAssignmentOperator) | Identifier EqualsSign) Eachin expression Newline
        statement*
    (Next | End For?)
    ;

throwStatement : Throw expression ;

tryStatement :
    Try Newline
        statement*
    (Catch dataDeclaration Newline
        statement*)+
    End
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
    Shl EqualsSign |
    Shr EqualsSign |
    Mod EqualsSign |
    AdditionUpdateAssignmentOperator |
    SubtractionUpdateAssignmentOperator |
    BitwiseAndUpdateAssignmentOperator |
    BitwiseXorUpdateAssignmentOperator |
    BitwiseOrUpdateAssignmentOperator
    ;

expressionStatement :
    Super FullStop New (invokeOperator | invokeArguments)? |
    invokableExpression (invokeOperator | invokeArguments)?
    ;

returnStatement : Return expression? ;

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
    Newline* identifierExpression |

    Newline* dottableExpression FullStop identifierExpression |
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
    identifierExpression |
    dottableExpression FullStop identifierExpression invokeOperator? |
    indexableExpression indexOperator
    ;

invokableExpression :
    newExpression |
    dottableExpression FullStop identifierExpression |
    FullStop identifierExpression |
    identifierExpression |
    typeReference
    ;

indexableExpression :
    stringLiteral |
    arrayLiteral |
    identifierExpression |
    (
        Self |
        Super |
    ) FullStop identifierExpression |
    FullStop? identifierExpression (FullStop identifierExpression)* |
    newExpression |
    indexableExpression indexOperator FullStop identifierExpression |
    indexableExpression indexOperator |
    (
        identifierExpression |
        typeReference
    ) invokeOperator |
    groupingExpression
    ;

// Undocumented
groupingExpression : LeftParenthesis expression RightParenthesis ;

identifierExpression : Identifier ;

stringLiteral : StringLiteral ;

arrayLiteral : LeftSquareBracket (expression (Comma expression)*)? RightSquareBracket ;

invokeOperator : LeftParenthesis invokeArguments? RightParenthesis ;
invokeArguments : (Comma | expression) (Comma expression?)* ;

indexOperator : LeftSquareBracket (expression | expression? SliceOperator expression?) RightSquareBracket ;

typeDeclaration :
    shorthandTypeReference arrayTypeReference* |
    arrayTypeReference+ |
    Colon longhandTypeReference arrayTypeReference*
    ;

typeReference :
    shorthandTypeReference arrayTypeReference* |
    arrayTypeReference+ |
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
