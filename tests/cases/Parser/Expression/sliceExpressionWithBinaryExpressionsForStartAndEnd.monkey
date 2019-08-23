Function CheckString(val$)
End

Function Main()
    Local text := "my text"
    Local i := 0

    CheckString text[i+1..i+3]
End