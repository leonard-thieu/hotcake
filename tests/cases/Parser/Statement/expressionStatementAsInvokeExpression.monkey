Class MyClass
    Function GetInstance: MyClass()
    End

    Method MyMethod: MyClass()
    End

    Method MyProperty: MyClass(val=1) Property
    End
End

Function Main()
    MyClass.GetInstance().MyMethod().MyProperty
    MyClass.GetInstance().MyProperty.MyMethod
End