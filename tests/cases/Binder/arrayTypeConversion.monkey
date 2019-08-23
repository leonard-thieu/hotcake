Function CheckIntArray(val[]) End

Function Main()
    Local assignVoidArrayToIntArray: Int[] = []
    Local assignSameArrayType: Float[] = [.1]

    ' Void arrays are possible but appear to be effectively unusable.
    Local voidArray: Void[] = []
    voidArray = voidArray.Resize(2)

    #Rem
        bb_arrayTypeConversion_CheckIntArray(Array<int >());
    #End
    CheckIntArray voidArray
End