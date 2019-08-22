Function NoParams()
End

Function AllParamsHaveDefaults(p1 = 1, p2 = 2)
End

Class InScope
    Function NoParams()
    End

    Function AllParamsHaveDefaults(p1 = 1, p2 = 2)
    End

    Function GetSomethingElse: SomethingElse()
        Return New SomethingElse
    End
End

Class SomethingElse
    Method Detect(smoke? = False)
    End
End

Function Main()
    ' Expression statements
    NoParams
    AllParamsHaveDefaults
    InScope.NoParams
    InScope.AllParamsHaveDefaults

    ' Expressions
    While NoParams End
    While AllParamsHaveDefaults End
    While InScope.NoParams End
    While InScope.AllParamsHaveDefaults End

    ' Multiple invoke expressions
    While InScope.GetSomethingElse.Detect End
End