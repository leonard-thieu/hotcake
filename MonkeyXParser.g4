parser grammar MonkeyXParser;

options
{
    tokenVocab = MonkeyXLexer;
}

// Should/can preprocessor directives be handled separately?
// Should Strict introduce its own mode?
// Should Extern [Private] introduce its own mode?

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
        aliasDirective |
        directive |
        Newline
    )*
    EOF
    ;

// TODO: Determine if module paths have looser naming rules.
importStatement : Import (modulePath | StringLiteral) ;

aliasDirective : Alias Identifier EqualsSign modulePath FullStop Identifier ;

modulePath : Identifier (FullStop Identifier)* ;

/*
 * Directives
 */

directive :
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
            directive |
            Newline
        )*
    End Class?
    ;

interfaceDeclaration :
    Interface Identifier (Extends typeReference (',' typeReference)*)?
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
            directive |
            statement
        )*
    End Function?)?
    ;

constructorDeclaration :
    Method New LeftParenthesis dataDeclarations? RightParenthesis
        (
            directive |
            statement
        )*
    End Method?
    ;

classMethodDeclaration :
    // Is abstract property allowed?
    // `Final` is undocumented.
    Method Identifier typeDeclaration? LeftParenthesis dataDeclarations? RightParenthesis Property? Final? (EqualsSign StringLiteral | Abstract |
        (
            directive |
            statement
        )*
    End Method? )?
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
    directive
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

assignmentStatement : assignableExpression assignmentOperator expression ;
assignableExpression :
    (
        indexableExpression indexOperator |
        dottableExpression FullStop Identifier |
        FullStop Identifier |
        Identifier
    ) (LeftSquareBracket expression RightSquareBracket)?
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

    Newline* dottableExpression FullStop Identifier |
    Newline* FullStop Identifier |
    Newline* invokableExpression invokeOperator |
    Newline* indexableExpression indexOperator  |

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

stringLiteral : StringLiteral ;

arrayLiteral : LeftSquareBracket (expression (Comma expression)*)? RightSquareBracket ;

identifierExpression : Identifier ;

invokeOperator: LeftParenthesis invokeArguments? RightParenthesis ;
invokeArguments : expression (Comma expression?)* ;

indexOperator : LeftSquareBracket (expression | expression? SliceOperator expression?) RightSquareBracket ;

typeDeclaration :
    (
        (
            StringShorthandType |
            BoolShorthandType |
            NumberSign |
            IntShorthandType
        ) |
        Colon Identifier ('.' Identifier)*
    ) (LessThanSign typeReference (Comma typeReference)* GreaterThanSign)? (LeftSquareBracket expression? RightSquareBracket)* |
    (LeftSquareBracket expression? RightSquareBracket)+
    ;

typeReference :
    (
        StringShorthandType |
        BoolShorthandType |
        NumberSign |
        IntShorthandType |
        modulePath '.' Identifier |
        Identifier
    ) (LessThanSign typeReference (Comma typeReference)* GreaterThanSign)? (LeftSquareBracket expression? RightSquareBracket)* |
    (LeftSquareBracket expression? RightSquareBracket)+
    ;

identifier :
    Null |
    Alias |
    Identifier
    ;
