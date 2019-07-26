Function Add( value:Int )
End

Function Add( value:Float )
End

Function Add( value:String )
End

Function Main()
    Add( 10 )   'calls first version as 10 is of type Int

    Add( 10.0 ) 'calls second version as 10.0 is of type Float

    Add( "10" ) 'calls third version as "10" is of type String

End