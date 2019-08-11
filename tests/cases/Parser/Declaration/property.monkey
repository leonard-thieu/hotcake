Class MyClass
    Method Length() Property
    End

    Method Length(length) Property
    End

    Method LongLength() Property
    End

    Method Parent: MyClass()  Property
    End
End

Function Main()
    Local myClass := New MyClass
    myClass.Length
    myClass.Parent.Length
    myClass.Parent.Parent.Length
End
