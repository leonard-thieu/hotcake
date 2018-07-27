parser grammar MonkeyXParser;

options
{
    tokenVocab = MonkeyXLexer;
}

// Should/can preprocessor directives be handled separately?
// Should Strict introduce its own mode?
// Should Extern [Private] introduce its own mode?

moduleDeclaration
    :
        (
              Strict
              // Beginning of file directive (no leading newline)
            | directive
        )?
        // Import section
        (   
              Private
            | Public
            | importStatement
            | aliasDirective
            | directive
        )*
        // Main body
        (     Private
            | Public
            | Extern
            | classDeclaration
            | interfaceDeclaration
            | functionDeclaration
            | constDeclaration
            | globalDeclaration
            | directive
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

directive
    : ifDirective
    | elseIfDirective
    | elseDirective
    | endIfDirective
    | endDirective
    | printDirective
    | errorDirective
    | assignmentDirective
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
      (Extends typeReference)?
      (Implements typeReference (Comma typeReference)*)?
      Abstract?
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
            directive
        )*
    End Class? ;

interfaceDeclaration :
    Interface Identifier (Extends typeReference)?
        (
            constDeclaration |
            interfaceMethodDeclaration
        )*
    End Interface? ;

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
    End Function?)? ;

constructorDeclaration :
    Method New LeftParenthesis dataDeclarations? RightParenthesis
        (
            directive |
            statement
        )*
    End Method? ;

classMethodDeclaration :
    // Is abstract property allowed?
    // `Final` is undocumented.
    Method Identifier typeDeclaration? LeftParenthesis dataDeclarations? RightParenthesis Property? Final? (EqualsSign StringLiteral | Abstract |
        (
            directive |
            statement
        )*
    End Method? )? ;

interfaceMethodDeclaration :
    Method Identifier typeDeclaration? LeftParenthesis dataDeclarations? RightParenthesis ;

dataDeclarations : dataDeclaration (Comma dataDeclaration)* ;
dataDeclaration : Identifier (typeDeclaration? (EqualsSign expression)? | InferAssignmentOperator expression) ;

/*
 * Statements
 */

statement :
    (
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
    ) Semicolon? |
    directive
    ;

ifStatement
    : (If expression Then?
          statement*
      ((ElseIf | Else If) expression Then?
          statement*)*
      (Else
          statement*)?
      (EndIf | End If?))
    | (If expression Then? statement (Else statement)?)
    ;

selectStatement :
    Select expression
        caseStatement*
        defaultStatement?
    End Select? ;

caseStatement :
    Case expression (Comma expression)*
        statement* ;

defaultStatement :
    Default
        statement* ;

whileLoopStatement :
    While expression
        statement*
    (Wend | End While?) ;

repeatLoopStatement :
    Repeat
        statement*
    (Until expression | Forever) ;

numericForLoopStatement :
    For (localDeclaration | assignmentStatement) (To | Until) expression (Step expression)?
        statement*
    (Next | End For?) ;

forEachinLoopStatement :
    For (Local Identifier (typeDeclaration? EqualsSign | InferAssignmentOperator) | Identifier EqualsSign) Eachin expression
        statement*
    (Next | End For?) ;

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
    groupingExpression |

    newExpression |
    Null |
    True |
    False |
    Self |
    Super |
    stringLiteral |
    FloatLiteral |
    IntLiteral |
    arrayLiteral |
    identifierExpression |

    dottableExpression FullStop Identifier |
    FullStop Identifier |
    invokableExpression invokeOperator |
    indexableExpression indexOperator  |

    PlusSign expression |
    HyphenMinus expression |
    Tilde expression |
    Not expression |

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

newExpression : New typeReference (invokeOperator | indexOperator)? ;

dottableExpression :
    groupingExpression |
    newExpression |
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
    New typeReference |
    dottableExpression FullStop identifierExpression |
    FullStop identifierExpression |
    identifierExpression |
    typeReference
    ;

indexableExpression :
    stringLiteral |
    arrayLiteral |
    identifierExpression |
    (Self | identifierExpression) FullStop identifierExpression |
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
invokeArguments : expression (Comma expression)* ;

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
    ) (LessThanSign typeReference (Comma typeReference)* GreaterThanSign)? (LeftSquareBracket expression? RightSquareBracket)? |
    LeftSquareBracket RightSquareBracket
    ;

typeReference :
    (
        StringShorthandType |
        BoolShorthandType |
        NumberSign |
        IntShorthandType |
        identifier ('.' Identifier)*
    ) (LessThanSign typeReference (Comma typeReference)* GreaterThanSign)? (LeftSquareBracket RightSquareBracket)? |
    LeftSquareBracket RightSquareBracket
    ;

identifier :
    Null |
    Alias |
    Identifier
    ;
