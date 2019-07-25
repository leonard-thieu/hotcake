#Rem
    Evalulating initializers must be deferred until the end of phase 2 as all type members
    have not been bound yet. In this example, binding `New HeadNode<T>` will fail because
    the members of `HeadNode<T>` have not been bound yet.
#End

Class List<T>
	Field _head:HeadNode<T>=New HeadNode<T>
End

Class HeadNode<T>
End

#Rem
    Deferring the binding of initializers also defers binding the type of data declarations.
    These must be bound before phase 3 starts. Otherwise, binding expressions that reference
    the data declarations will fail.
#End

Class ArrayObject<T>
	Field value:T[]

	Method New( value:T[] )
		Self.value=value
	End
End