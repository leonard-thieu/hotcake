#If TARGET = "cpp"

    Import "native/ifDirective.cpp"

#Else

    Import "native/ifDirective-winnt.cpp"

#End

Import brl