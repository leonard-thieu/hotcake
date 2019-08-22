Class MyClass
    Method Length() Property
    End

    Method Length(length) Property
    End

    Method LongLength() Property
    End

    Method Parent: MyClass() Property
    End

    Method Test()
        Local a

        a = Length
        a = Self.Length
        a = Self.Parent.Length
        a = Self.Parent.Parent().Parent.Test()
    End
End

Function Main()
    Local myClass := New MyClass
    CheckInt myClass.Length
    myClass.Length = 1

    Local length
    length = myClass.Length

    If (myClass.LongLength - myClass.Length) Or ~myClass.Length
    End
End

Function CheckInt(val)
End