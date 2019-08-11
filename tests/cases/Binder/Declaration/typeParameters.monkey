Class ArrayObject<T>
	Field value:T[]

	Method New( value:T[] )
		Self.value=value
	End

	Method ToArray:T[]()
		Return value
	End
End

Function Main()
    New ArrayObject<Int>
End