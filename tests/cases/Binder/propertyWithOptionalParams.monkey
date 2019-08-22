Class MyClass
    ' Acts as both getter and setter
    Method MyProp(val=1) Property
    End
End

Function CheckInt(val)
End

Function Main()
    Local myClass := New MyClass
    CheckInt myClass.MyProp
    myClass.MyProp = 2
    myClass.MyProp = myClass.MyProp
End