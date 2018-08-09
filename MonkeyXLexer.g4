lexer grammar MonkeyXLexer;

channels
{
    WhitespaceChannel
}

fragment A : [Aa] ;
fragment B : [Bb] ;
fragment C : [Cc] ;
fragment D : [Dd] ;
fragment E : [Ee] ;
fragment F : [Ff] ;
fragment G : [Gg] ;
fragment H : [Hh] ;
fragment I : [Ii] ;
fragment J : [Jj] ;
fragment K : [Kk] ;
fragment L : [Ll] ;
fragment M : [Mm] ;
fragment N : [Nn] ;
fragment O : [Oo] ;
fragment P : [Pp] ;
fragment Q : [Qq] ;
fragment R : [Rr] ;
fragment S : [Ss] ;
fragment T : [Tt] ;
fragment U : [Uu] ;
fragment V : [Vv] ;
fragment W : [Ww] ;
fragment X : [Xx] ;
fragment Y : [Yy] ;
fragment Z : [Zz] ;

NumberSign : '#' ;
DollarSign : '$' ;
PercentSign : '%' ;
Ampersand : '&' ;
OpeningParenthesis : '(' ;
ClosingParenthesis : ')' ;
Asterisk : '*' ;
PlusSign : '+' ;
Comma : ',' ;
HyphenMinus : '-' ;
Period : '.' ;
Slash : '/' ;
Colon : ':' ;
Semicolon : ';' ;
LessThanSign : '<' ;
EqualsSign : '=' ;
GreaterThanSign : '>' ;
QuestionMark : '?' ;
CommercialAt : '@' ;
OpeningSquareBracket : '[' ;
ClosingSquareBracket : ']' ;
VerticalBar : '|' ;
Tilde : '~' ;

InferAssignmentOperator : ':=' ;
MultiplicationUpdateAssignmentOperator : '*=' ;
DivisionUpdateAssignmentOperator : '/=' ;
ShiftLeftUpdateAssignmentOperator : S H L EqualsSign ;
ShiftRightUpdateAssignmentOperator : S H R EqualsSign ;
ModulusUpdateAssignmentOperator : M O D EqualsSign ;
AdditionUpdateAssignmentOperator : '+=' ;
SubtractionUpdateAssignmentOperator : '-=' ;
BitwiseAndUpdateAssignmentOperator : '&=' ;
BitwiseXorUpdateAssignmentOperator : '~=' ;
BitwiseOrUpdateAssignmentOperator : '|=' ;

SliceOperator : '..' ;

Whitespace : [\u0000-\u0009\u000B-\u0020]+ -> channel(WhitespaceChannel) ;
Newline : '\n' ;

/*
 * Language keywords and reserved identifiers
 */

Strict : S T R I C T ;
Public : P U B L I C ;
Private : P R I V A T E ;
Property : P R O P E R T Y ;
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
EachIn : E A C H I N ;
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

// Undocumented as reserved.

Null : N U L L ;
Alias : A L I A S ;
Protected : P R O T E C T E D ;
Friend : F R I E N D ;
Include : I N C L U D E ;

// Exclude core types so that they don't require special treatment everywhere in the parser.

//Void : V O I D ;
//Bool : B O O L ;
//Int : I N T ;
//Float : F L O A T ;
//String : S T R I N G ;
//Array : A R R A Y ;
//Object : O B J E C T ;
//Throwable : T H R O W A B L E ;

StringLiteral : '"' .*? '"' ;
// Negative numbers are handled by the parser.
FloatLiteral :
    [0-9]* Period [0-9]+ (E (PlusSign | HyphenMinus)? [0-9]*)? |
    [0-9]+ E (PlusSign | HyphenMinus)? [0-9]*
    ;
IntLiteral :
    DollarSign [0-9A-Fa-f]+ |
    PercentSign [0-1]+ |
    [0-9]+
    ;

// Documentation states that a leading underscore must be followed by an alphabetic character but the transpiler seems to
// allow underscore and numeric characters to follow.
Identifier : ([A-Za-z] | ('_' [A-Za-z])) [0-9A-Z_a-z]* ;

Comment : '\'' ~[\n]* -> skip ;

IfDirectiveStart : NumberSign I F ;
ElseIfDirectiveStart : NumberSign E L S E Whitespace* I F ;
ElseDirectiveStart : NumberSign E L S E ;
EndIfDirectiveStart : NumberSign E N D (I F)? ;
ErrorDirectiveStart : NumberSign E R R O R ;
PrintDirectiveStart : NumberSign P R I N T ;

RemDirective :
    NumberSign R E M
        (RemDirective | .)+?
    Newline Whitespace* NumberSign E N D -> skip
    ;

ErrorCharacter : . -> channel(HIDDEN) ;
