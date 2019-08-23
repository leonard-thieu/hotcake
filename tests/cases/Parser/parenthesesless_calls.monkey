Function Sum( x:Int=0,y:Int=0,z:Int=0 ) 
End 
 
Function Main()
    Sum 10,,30

    If Sum
    End

    ' Error : Expression cannot be used as a statement.
    'If Sum 10
    'End

    ' Error : Expression cannot be used as a statement.
    'If Sum 10,,30
    'End

    Print Sum

    ' Error : Expression cannot be used as a statement.
    'Print Sum 10

    ' Error : Syntax error - expecting ')'
    'Print(Sum 10)

    Local dirs:=New MyClass,files:=New MyClass

    ' Error : Expression cannot be used as a statement.
    'Local dirs:=New MyClass 1

    ' Error : Expression cannot be used as a statement.
    'Local dirs:=New MyClass 1,files:=New MyClass

    ' Error : Expression cannot be used as a statement.
    'Local dirs:=New MyClass,files:=New MyClass 1

    ' Parentheses-less function calls with arguments are only allowed as expression statements
    ' Parentheses-less function calls without arguments are allowed as expressions (default parameters 
    ' can satisify the no argument requirement)
End 

Class MyClass
    ' Counts as a parameterless constructor
    Method New(val=1)
    End
End