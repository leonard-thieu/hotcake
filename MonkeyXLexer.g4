lexer grammar MonkeyXLexer;

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

fragment Lowercase : [a-z] ;
fragment Uppercase : [A-Z] ;
fragment Numeric : [0-9] ;
fragment Hexadecimal : [0-9a-fA-F] ;

fragment Alpha : Lowercase | Uppercase ;
fragment Alphanumeric : Alpha | Numeric ;

LessThanSign : '<' ;
GreaterThanSign : '>' ;
Comma : ',' ;
EqualsSign : '=' ;
LeftParenthesis : '(' ;
RightParenthesis : ')' ;
FullStop : '.' ;
Asterisk : '*' ;
PlusSign : '+' ;
HyphenMinus : '-' ;
Tilde : '~' ;
Solidus : '/' ;
Ampersand : '&' ;
LeftSquareBracket : '[' ;
RightSquareBracket : ']' ;
Colon : ':' ;
VerticalBar : '|' ;
Semicolon : ';' ;
CommercialAt : '@' ;
NumberSign : '#' ;

InferAssignmentOperator : ':=' ;
MultiplicationUpdateAssignmentOperator : '*=' ;
DivisionUpdateAssignmentOperator : '/=' ;
AdditionUpdateAssignmentOperator : '+=' ;
SubtractionUpdateAssignmentOperator : '-=' ;
BitwiseAndUpdateAssignmentOperator : '&=' ;
BitwiseXorUpdateAssignmentOperator : '~=' ;
BitwiseOrUpdateAssignmentOperator : '|=' ;

LessThanOrEqualsOperator : '<=' ;

// TODO: Investigate the proper way to handle this.
// Disabled because it takes priority over assignment to generic type.
//     Field _head:Node<T>=New HeadNode<T>
//GreaterThanOrEqualsOperator : '>=' ;

NotEqualsOperator : '<>' ;

SliceOperator : '..' ;

Whitespace : (' ' | '\t')+ -> skip ;
Newline : ('\r'? '\n' | '\r')+ -> skip ;

/*
 * Language keywords and reserved identifiers
 */

// Exclude core types so that they don't require special treatment everywhere in the parser.
//Void : V O I D ;
//Bool : B O O L ;
//Int : I N T ;
//Float : F L O A T ;
//String : S T R I N G ;
//Array : A R R A Y ;
//Object : O B J E C T ;
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

/*
 * Non-reserved keywords
 */

Null : N U L L ;
Alias : A L I A S ;
Protected : P R O T E C T E D ;

StringShorthandType : '$' ;
BoolShorthandType : '?' ;
IntShorthandType : '%' ;

StringLiteral : '"' .*? '"';
// Negative numbers are handled by the parser.
FloatLiteral : Numeric* '.' Numeric+ ;
IntLiteral : Numeric+ | '$' Hexadecimal+ ;

Identifier : (Alpha | ('_' Alpha)) (Alphanumeric | '_')* ;

Comment : '\'' .*? Newline -> skip;

DirectiveCommon : NumberSign ;

IfDirectiveStart : DirectiveCommon I F ;
ElseIfDirectiveStart : DirectiveCommon E L S E Whitespace* I F ;
ElseDirectiveStart : DirectiveCommon E L S E ;
EndIfDirectiveStart : DirectiveCommon E N D I F ;
ErrorDirectiveStart : DirectiveCommon E R R O R ;
PrintDirectiveStart : DirectiveCommon P R I N T ;
RemDirectiveStart : DirectiveCommon R E M .*? EndDirectiveStart -> skip ;
EndDirectiveStart : DirectiveCommon E N D ;

ErrorCharacter : . -> channel(HIDDEN) ;
