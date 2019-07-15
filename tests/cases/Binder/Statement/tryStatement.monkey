Class Throwable
End

Class Ex1 Extends Throwable 
End 
 
Class Ex2 Extends Throwable 
End 

Function Print(message$)
End
 
Function Main() 
    For Local i:=1 To 10 
        Try 
            If (i & 1) Throw New Ex1 Else Throw New Ex2 
        Catch ex:Ex1 
            Print "Caught an ex1!" 
        Catch ex:Ex2 
            Print "Caught an ex2!" 
        End 
    Next 
End 