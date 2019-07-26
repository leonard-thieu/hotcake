Class ArrayObject<F>
	Field value:F[]
End

Class ArrayBoxer<T>
	Function Unbox:T[]( box:Object )
		Return ArrayObject<T>( box ).value
	End
End