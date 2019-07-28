Class ArrayObject<T>
	Field value:T[]
End

Class ArrayBoxer<T>
	Function Unbox:T[]( box:Object )
		Return ArrayObject<T>( box ).value
	End
End