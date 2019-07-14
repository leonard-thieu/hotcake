Function Print(message$)
End

Function Main()
    Local val := 24

    Select val
        Case 1
            Print("1")
        Case 2,
             3
            Print(val)
        Default
            Print("oh no")
    End
End