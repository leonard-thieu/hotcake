Class Entity
    Method GetPosition()
    End
End

Class Actor Extends Entity
    Method Move()
        Super.GetPosition
    End
End

Function Main()
    Local actor := New Actor
    actor.Move
End