'A comment

#Rem                                'start of a block comment
Print "The sound of silence!"       'inside a block comment
#End

#Rem                                'start of a block comment

    Nested Rem directive
    #Rem                                'start of a block comment
    Print "The sound of silence!"       'inside a block comment
    #End

#End

#Print "My print message."  ' Print directive

#Error "My error message!"  ' Error directive

#ANDROID_MANIFEST_APPLICATION+="<meta-data android:name=~qcom.google.android.gms.version~q android:value=~q@integer/google_play_services_version~q />"  ' Addition update assignment directive
#ANDROID_LIBRARY_REFERENCE_1="android.library.reference.1=google-play-services_lib" ' Assignment directive

Strict  ' Strict directive

' TODO: Move string literal escape code test to more appropriate place.
' Import "my/module/~q/~n/~r/~t/~z/~~/~a"

Import "my/module"  ' Import directive (path)
Import mojo         ' Import directive (module path)
Import my.module    ' Import directive (dotted module path)

Friend my.other.module  ' Friend directive

Private         ' Private directive
Public          ' Public directive
Extern          ' Extern directive
Extern Private  ' Extern Private directive

Alias T=file2.T                'which 'T' to use

Const asd: Int = 1          ' Explicit type (longhand)
Const asd$ = "my constant"  ' Explicit type (shorthand)
Const asd := 1              ' Infer type
Const asd = 1               ' Default type
Const asd=1,edf:=2          ' Multiple declarations

Global asd: Int = 1         ' Explicit type (longhand)
Global asd$ = "my global"   ' Explicit type (shorthand)
Global asd := 1             ' Infer type
Global asd = 1              ' Default type
Global asd=1,edf:=2         ' Multiple declarations
Global asd: Float           ' Explicit type (longhand), default value
Global T                    ' Default type, default value

Global ActiveDriver:Driver="xyzActiveDriver"  ' Extern

Function Eat:Void( amount:Int )     ' Explicit return type, parameter
    '...
End

Function Eat( amount:Int, allow? )  ' Default return type, parameters
    '...
End

Function Eat()                      ' Default return type, no parameters
    '...
End

Function Eat()                      ' End Function
    ' ' Directive
    ' #If TARGET <> "glfw"
    '     Print("Not glfw")
    ' #End

    ' Statement
    While x > 5
        Print(x)
    End While
End Function

Interface Paintable
    Method Paint: Void( refresh?,force:Bool=False)
End

Interface Moveable  ' Interface declaration
    Method Move()
End

Interface Drawable Extends Moveable  ' Interface declaration (extends interface)
    Const asd := 25.4

    Method Draw()
End Interface   ' End Interface

Interface Drawable Extends Paintable, Moveable  ' Interface declaration (extends interfaces)
    Const asd := 25.4                               ' Const declaration

    Method Paint: Void( refresh?,force:Bool=False)  ' Method declaration
    Method Draw()
End Interface

Class MyClass   ' Class declaration
    Field a                 ' Identifier
    Field b := 1            ' Identifier := Expression
    Field c: Float          ' Identifier: Type
    Field d$ = "my field"   ' Identifier: Type = Expression

    Protected   ' Protected directive
    Field e = 0             ' Identifier = Expression

    Private     ' Private directive
    Field x,y,z 'these are NOT visible outside of this module.

    Public      ' Public directive
    Field P,Q,R 'these ARE visible outside of this module.
End

Class Pointer Abstract  ' Class declaration (Abstract)

    Protected   ' Protected directive

    Method Reset() Abstract                 ' Abstract method
    
    Method IsReset() Property Abstract      ' Abstract property

    Method IsNotReset() Abstract Property   ' Abstract property

    Public  ' Public directive

    Method Set( data:T )
        ' _data=data
    End Method

    Method Get:T()
        ' Return _data
    End

    Private ' Private directive

    Field _data:T

    Method Move()
        ' Print "Actor.Move()"
    End
    Method Draw()
        ' Print "Actor.Draw()"
    End
End Class

Class Pointer<T> Extends MyClass                                    ' Class declaration (extends base class)
    '...
End

Class Pointer<T> Extends MyClass Abstract                           ' Class declaration (extends base class and is abstract)

End

Class Pointer<T> Implements Moveable                                ' Class declaration (implements interface)

End

Class Pointer<T> Implements Moveable Abstract                       ' Class declaration (implements interface and is abstract)

End

Class Pointer<T> Implements Moveable,Drawable                       ' Class declaration (implements interfaces)

End

Class Pointer<T> Extends MyClass Implements Moveable,Drawable       ' Class declaration (extends base class, and implements interfaces)

End Class

Class Pointer<T> Extends MyClass Implements Moveable,Drawable Final ' Class declaration (extends base class, implements interfaces, and is final)

End Class

Function IfStatement(val: String)
    If val = "myVal1"
        ' Do things if val = "myVal1"
    End If

    If val = "myVal1"
        ' Do things if val = "myVal1"
    Else
        ' Do things if val = ""
    End If

    If val = "myVal1"
        ' Do things if val = "myVal1"
    Else If val <> ""
        ' Do things if val <> ""
    End If
    
    If val = "myVal1"
        ' Do things if val = "myVal1"
    Else If val <> ""
        ' Do things if val <> ""
    Else
        ' Do things if val = ""
    EndIf

    If val = "myVal1" Then
        ' Do things if val = "myVal1"
    Else If val <> "" Then
        ' Do things if val <> ""
    Else
        ' Do things if val = ""
    End
End Function

Function SingleLineIfStatement(val: String)
    ' If val = "myVal1" Then Return
    ' If val <> "" Return
End Function

Function ReturnStatement()
Return      ' Beginning of line
    Return  ' After space
    ;Return ' After semicolon
    Return; ' Terminated with semicolon

Return 1        ' Beginning of line
    Return 1    ' After space
    ;Return 1   ' After semicolon
    Return 1;   ' Terminated with semicolon

    Return True Or  ' Return multiline expression
           1 < -1

End Function

Function SelectStatement()

    Select myVal    ' Select statement
                    ' Comment in body
        Case 1      ' Case statement
            Exit
        Case 2,     ' Expressions on multiple lines
             3,
             4
            Continue
        Default     ' Default statement
            Select myVal
                Case 1
                    Exit
                Case 2, 3, 4    ' Expressions on same line
                    Continue
                Default
                    Return
            End Select
    End

End
