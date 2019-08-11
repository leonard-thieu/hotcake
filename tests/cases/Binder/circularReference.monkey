Class List<T>
    Method ObjectEnumerator:Enumerator<T>()
        Return New Enumerator<T>( Self )
    End
End

Class Enumerator<T>
    Method New( list:List<T> )
        _list=list
    End Method

    Field _list:List<T>
End

Function Main()
    New List<Int>
End