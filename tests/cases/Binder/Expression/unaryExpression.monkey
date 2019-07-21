Function BoxBool: Object(val: Bool)
End

Function BoxInt: Object(val: Int)
End

Function BoxFloat: Object(val: Float)
End

Function Main()
    BoxInt(+4)
    BoxFloat(+13.85)

    BoxInt(-2)
    BoxFloat(-1.67)

    BoxInt(~12)

    BoxBool(Not False)
    BoxBool(Not 5)
    BoxBool(Not 9.12)
    BoxBool(Not "")
End Function