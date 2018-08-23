#If TARGET = "cpp"

    Import "native/ifDirective.cpp"

#ElseIf HOST = "winnt"

    Import "native/ifDirective-winnt.cpp"

    #If 34896712 > TIME

        #Print "It's past due."

    #End

#ElseIf HOST = "linux"

    Import "native/ifDirective-linux.cpp"

#Else

    Import "native/ifDirective-macos.cpp"

#End

Import brl