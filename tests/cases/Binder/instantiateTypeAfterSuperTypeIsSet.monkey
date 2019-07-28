#Rem
    Tests that the base type is set before instantiating a type.
#End

Class List<T>
	Method ObjectEnumerator:Enumerator<T>()
		Return New Enumerator<T>()
	End
End

Class Enumerator<T>
    Field val: T

    Method HasNext: Bool()
        Return True
    End

    Method NextObject: T()
        Return val
    End
End

Function Main()
    For Local val := EachIn New List<Object>()
    End
End