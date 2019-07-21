Function Main()
    ' TestUnary(+2)
    TestUnary + 2
    
    ' TestUnary() + 2
    Local val := TestUnary + 2

    ' Shadow the function with a local variable
    Local TestUnary

    ' TestUnary + 2
    Local val2 := TestUnary + 2

    ' Error : Identifier 'TestUnary' not found.
    'TestUnary + 2
End

Function TestUnary()
End

Function TestUnary(val1)
End

Function BinaryExpressionStatementsShouldFail()
    1 + 2
End