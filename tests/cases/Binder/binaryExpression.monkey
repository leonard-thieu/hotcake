Function BoxBool: Object(val: Bool)
End

Function BoxInt: Object(val: Int)
End

Function BoxFloat: Object(val: Float)
End

Function BoxString: Object(val: String)
End

Function Main()
    BoxInt(1 + 2)
    BoxInt(4 - 3)
    BoxFloat(23 Mod 4)
    BoxFloat(3 * 4.2)
    BoxFloat(12 / 0.44)

    BoxInt(12 Shl 3)
    BoxInt(127 Shr 4)
    BoxInt(242 & 16)
    BoxInt(966 ~ 24)
    BoxInt(549 | 45)

    BoxBool(24.2 = 24)
    BoxBool(17 < False)
    BoxBool(42 > "43")
    BoxBool(24 <= 15.5)
    BoxBool(64 >= 5)
    BoxBool(True <> False)

    BoxBool(True And False)
    BoxBool(False Or True)

    BoxString(10 + " mm")
    BoxString(12.4 + " miles")
    BoxString("full" + " power")
End Function