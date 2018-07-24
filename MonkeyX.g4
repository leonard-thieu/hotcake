grammar MonkeyX;

// Should/can preprocessor directives be handled separately?

/*
 * Parser Rules
 */

module : moduleMember* EOF ;

moduleMember
    : Strict
    | importStatement
    | classDeclaration
    | interfaceDeclaration
    | functionDeclaration
    | constDeclaration
    | globalDeclaration
    | Private
    | Public
    | Extern
    ;

/* Declarations */

classDeclaration :
    Class Identifier ('<' Identifier (',' Identifier)* '>')? (Extends typeIdentifier)? (Implements typeIdentifier (',' typeIdentifier)*)? Abstract?
        classMember*
    End Class? ;

classMember
    : fieldDeclaration #classField
    | constructorDeclaration #classConstructor
    | classMethodDeclaration #classMethod
    | constDeclaration #classConstant
    | globalDeclaration #classGlobal
    | functionDeclaration #classFunction
    | Private #classPrivate
    | Public #classPublic
    ;

interfaceDeclaration :
    Interface Identifier (Extends typeIdentifier)?
        interfaceMember*
    End Interface? ;

interfaceMember
    : constDeclaration #interfaceConstant
    | interfaceMethodDeclaration #interfaceMethod
    ;

globalDeclaration : Global dataDeclarations ;
fieldDeclaration : Field dataDeclarations ;
constDeclaration : Const dataDeclarations ;
localDeclaration : Local dataDeclarations ;

functionDeclaration :
    Function Identifier ':' typeIdentifier '(' dataDeclarations? ')' (
        statement*
    End Function?)? ;

constructorDeclaration :
    Method New '(' dataDeclarations? ')'
        statement*
    End Method? ;

classMethodDeclaration :
    // Is abstract property allowed?
    Method Identifier ':' typeIdentifier '(' dataDeclarations? ')' Property? (Abstract | (
        statement*
    End Method? ));

interfaceMethodDeclaration :
    Method Identifier ':' typeIdentifier '(' dataDeclarations? ')' ;

dataDeclarations : dataDeclaration (',' dataDeclaration)* ;
dataDeclaration : Identifier ':' typeIdentifier? ('=' expression)? ;

/* Statements */

statement
    : importStatement
    | ifStatement
    | selectStatement
    | whileLoopStatement
    | repeatLoopStatement
    | numericForLoopStatement
    | forEachinLoopStatement
    | throwStatement
    | assignmentStatement
    | expressionStatement
    | returnStatement
    | localDeclaration
    | constDeclaration
    | Exit
    | Continue
    ;

// TODO: Determine if module paths have looser naming rules.
importStatement : Import ((Identifier ('.' Identifier)*) | StringLiteral) ;

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
    Case expression (',' expression)*
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
    For Local? Identifier ':' typeIdentifier? '=' Eachin expression
        statement*
    (Next | End For?) ;

throwStatement : Throw expression ;

assignmentStatement
    : expression
      (   '='
        | '*='
        | '/='
        | Shl '='
        | Shr '='
        | Mod '='
        | '+='
        | '-='
        | '&='
        | '~='
        | '|='
      )
      expression
    ;

expressionStatement
    : expression invokeOperator
    | newExpression
    ;

returnStatement : Return expression? ;

/* Expressions */

expression
    : '(' expression+ ')' #groupingExpression

    | newExpression #newExpression_
    | Null #nullExpression
    | True #trueExpression
    | False #falseExpression
    | Self #selfExpression
    | Super #superExpresson
    | StringLiteral #stringLiteral
    | FloatLiteral #floatLiteral
    | IntLiteral #intLiteral
    | '[' (expression (',' expression)*)? ']' #arrayLiteral
    | (   String
        | Bool
        | Float
        | Int
        | Object
        | Identifier
      ) #identifierExpression

    | expression '.' (New | Identifier) #scopedIdentifierExpression
    | expression invokeOperator #invokeExpression
    | expression indexOperator #indexExpression
    | typeIdentifier invokeOperator #castExpression

    | '+' expression #unaryPlusExpression
    | '-' expression #unaryMinusExpression
    | '~' expression #bitwiseComplementExpression
    | Not expression #booleanInverseExpression

    | expression '*' expression #multiplicationExpression
    | expression '/' expression #divisionExpression
    | expression Mod expression #modulusExpression
    | expression Shl expression #bitwiseShiftLeftExpression
    | expression Shr expression #bitwiseShiftRightExpression

    | expression '+' expression #additionExpression
    | expression '-' expression #subtractionExpression

    | expression '&' expression #bitwiseAndExpression
    | expression '~' expression #bitwiseXorExpression

    | expression '|' expression #bitwiseOrExpression

    | expression '=' expression #equalsExpression
    | expression '<' expression #lessThanExpression
    | expression '>' expression #greaterThanExpression
    | expression '<=' expression #lessThanOrEqualsExpression
    | expression '>=' expression #greaterThanOrEqualsExpression
    | expression '<>' expression #notEqualsExpression

    | expression And expression #conditionalAndExpression

    | expression Or expression #conditionalOrExpression
    ;

newExpression : New typeIdentifier invokeOperator? ;

invokeOperator: '(' invokeArguments* ')' ;
invokeArguments : expression (',' expression)* ;

indexOperator : '[' (expression | expression? '..' expression?) ']' ;

typeIdentifier
    : (   String
        | Bool
        | Float
        | Int
        | Object
        | Void
        | Identifier ('.' Identifier)? ('<' typeIdentifier (',' typeIdentifier)* '>')?
      ) ('[' expression? ']')?
    ;

/*
 * Lexer Rules
 */

fragment A : [aA];
fragment B : [bB];
fragment C : [cC];
fragment D : [dD];
fragment E : [eE];
fragment F : [fF];
fragment G : [gG];
fragment H : [hH];
fragment I : [iI];
fragment J : [jJ];
fragment K : [kK];
fragment L : [lL];
fragment M : [mM];
fragment N : [nN];
fragment O : [oO];
fragment P : [pP];
fragment Q : [qQ];
fragment R : [rR];
fragment S : [sS];
fragment T : [tT];
fragment U : [uU];
fragment V : [vV];
fragment W : [wW];
fragment X : [xX];
fragment Y : [yY];
fragment Z : [zZ];

fragment Lowercase    : [a-z] ;
fragment Uppercase    : [A-Z] ;
fragment Numeric      : [0-9] ;

fragment Alpha        : Lowercase | Uppercase ;
fragment Alphanumeric : Alpha | Numeric ;

Whitespace            : (' ' | '\t')+ -> skip ;
Newline               : ('\r'? '\n' | '\r')+ -> skip ;

/*
 * Language keywords and reserved identifiers
 */

Void : V O I D ;
Strict : S T R I C T ;
Public : P U B L I C ;
Private : P R I V A T E ;
Property : P R O P E R T Y ;
Bool : B O O L ;
Int : I N T ;
Float : F L O A T ;
String : S T R I N G ;
Array : A R R A Y ;
Object : O B J E C T ;
Mod : M O D ;
Continue : C O N T I N U E ;
Exit : E X I T ;
Import : I M P O R T ;
Extern : E X T E R N ;
New : N E W ;
Self : S E L F ;
Super : S U P E R ;
Try : T R Y ;
Catch : C A T C H ;
Eachin : E A C H I N ;
True : T R U E ;
False : F A L S E ;
Not : N O T ;
Extends : E X T E N D S ;
Abstract : A B S T R A C T ;
Final : F I N A L ;
Select : S E L E C T ;
Case : C A S E ;
Default : D E F A U L T ;
Const : C O N S T ;
Local : L O C A L ;
Global : G L O B A L ;
Field : F I E L D ;
Method : M E T H O D ;
Function : F U N C T I O N ;
Class : C L A S S ;
And : A N D ;
Or : O R ;
Shl : S H L ;
Shr : S H R ;
End : E N D ;
If : I F ;
Then : T H E N ;
Else : E L S E ;
ElseIf : E L S E I F ;
EndIf : E N D I F ;
While : W H I L E ;
Wend : W E N D ;
Repeat : R E P E A T ;
Until : U N T I L ;
Forever : F O R E V E R ;
For : F O R ;
To : T O ;
Step : S T E P ;
Next : N E X T ;
Return : R E T U R N ;
Module : M O D U L E ;
Interface : I N T E R F A C E ;
Implements : I M P L E M E N T S ;
Inline : I N L I N E ;
Throw : T H R O W ;

Null : N U L L ;

StringLiteral : '"' (~'"')* '"';
BoolLiteral : False | True ;
FloatLiteral : Numeric* '.' Numeric+ ;
IntLiteral : Numeric+ | '$' (Numeric | [A-Fa-f])+ ;

Identifier : (Alpha | ('_' Alpha)) (Alphanumeric | '_')* ;

Comment : '\'' ~([\r\n])* -> skip;

fragment EndDirective : '#' E N D ;
RemDirective : '#' R E M ~'#'+ EndDirective -> skip ;
