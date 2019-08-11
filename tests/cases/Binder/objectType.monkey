Class BaseObject
    Field id
End

Interface Speakable
    Method Speak()
End

Class Entity Extends BaseObject Implements Speakable
    Field name$

    Method Speak()
        Print "Hello, my name is " + name
    End
End

Interface Moveable
    Method Move()
End

Interface Drawable
    Method Draw()
End

Interface Shadeable Extends Drawable
    Method Shade()
End

Class Actor Extends Entity Implements Moveable,Shadeable
    Method Move()
        Print "Actor.Move()"
    End
    Method Draw()
        Print "Actor.Draw()"
    End
    Method Shade()
        Print "Actor.Shade()"
    End
End

Function Check( baseObject:BaseObject )
    Print "Object has id: " + baseObject.id
End

Function Speak( speakable:Speakable )
    speakable.Speak
End

Function Hire( entity:Entity )
    Print "You're hired, " + entity.name + "!"
End

Function Move( moveable:Moveable )
    moveable.Move
End

Function Draw( drawable:Drawable )
    drawable.Draw
End

Function Main()
    Local actor:=New Actor

    Check actor ' Non-immediate super type
    Speak actor ' Non-immediate implemented type on a super type
    Hire actor  ' Super type
    Move actor  ' Implemented type
    Draw actor  ' Non-immediate implemented type on an implemented type
End