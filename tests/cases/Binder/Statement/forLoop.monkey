Function Main()
    For Local i := 10 Until 0 Step -1
        CheckInt(i)
    End

    For Local val := EachIn "MyValue"
        CheckInt(val)
    End

    For Local val := EachIn [1, 2, 3]
        CheckInt(val)
    End

    For Local item := EachIn New Collection
        CheckItem(item)
    End

    Local val2: Int[]
    For val2 = EachIn [3, 4, 5]
        CheckInt(val2)
    End
End

Function CheckInt(val: Int)
End

Class Collection
    Method ObjectEnumerator: CollectionEnumerator()
    End
End

Class CollectionEnumerator
    Method HasNext: Bool()
    End

    Method NextObject: Item()
    End
End

Class Item
End

Function CheckItem(val: Item)
End