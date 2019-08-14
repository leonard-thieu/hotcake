Class MyClass
End

Class MyClass2
    Field sibling := New MyClass
End

Class MyGenericClass<T>
    Method New()
        New T
    End
End

Function Main()
    New MyClass()
    New MyGenericClass<MyClass>()
End
