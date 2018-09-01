#If TARGET = "cpp"

    Import "native/ifDirective.cpp"

#ElseIf HOST = "winnt"

    Import "native/ifDirective-winnt.cpp"

#ElseIf HOST = "linux"

    Import "native/ifDirective-linux.cpp"

#Else

    Import "native/ifDirective-macos.cpp"

#End

Import brl