Class Box
    Method New(val?)
    End

    Method New(val)
    End

    Method New(val#)
    End

    Method New(val$)
    End
End

Function CheckBox(box:Box)
End

Function Main()
    CheckBox True
    CheckBox 2
    CheckBox 3.14
    CheckBox "this string"
End