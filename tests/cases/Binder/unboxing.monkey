Class Box
    Method ToBool?()
    End

    Method ToInt()
    End

    Method ToFloat#()
    End

    Method ToString$()
    End
End

Function CheckBool(val?)
End

Function CheckInt(val)
End

Function CheckFloat(val#)
End

Function CheckString(val$)
End

Function Main()
    Local box := New Box

    CheckBool box
    CheckInt box
    CheckFloat box
    CheckString box
End
