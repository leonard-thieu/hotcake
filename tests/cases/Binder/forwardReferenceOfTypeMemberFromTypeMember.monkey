#Rem
    Evalulating initializers must be deferred until the end of phase 2 as all type members
    have not been bound yet. In this example, without deferring binding initializers, binding
    `New HeadNode<TFromList>` would fail because the members of `HeadNode<TFromList>` have
    not been bound yet.
#End

Class List<TFromList>
	Field _head:HeadNode<TFromList>=New HeadNode<TFromList>
End

Class HeadNode<TFromHeadNode>
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