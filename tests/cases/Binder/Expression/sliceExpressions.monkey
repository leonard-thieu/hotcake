Function Print(message: String)
End

Function Main()
    Print("My example string."[1..2])
    Print("My example string."[..2])
    Print("My example string."[1..])
    Print("My example string."[..])

    Print(["My", "example", "string"][3..4])
    Print(["My", "example", "string"][..4])
    Print(["My", "example", "string"][3..])
    Print(["My", "example", "string"][..])
End