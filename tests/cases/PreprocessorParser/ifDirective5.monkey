#If TARGET = "cpp"

    Import "native/ifDirective.cpp"

#ElseIf HOST = "winnt"

    Import "native/ifDirective-winnt.cpp"

#ElseIf HOST = "linux"

    Import "native/ifDirective-linux.cpp"

#End

Import brl