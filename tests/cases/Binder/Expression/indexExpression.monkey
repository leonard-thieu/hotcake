Class Stack
	Field data:Int[]
End

Class Enumerator
	Method NextObject()
		Return stack.data[1]
	End

	Field stack:Stack
End