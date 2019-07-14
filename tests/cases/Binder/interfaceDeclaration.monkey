Interface Moveable 
    Method Move() 
End 
 
Interface Drawable 
    Method Draw() 
End 

Interface Actor Extends Moveable, Drawable
    Const Name$ = "Actor's Name"
End