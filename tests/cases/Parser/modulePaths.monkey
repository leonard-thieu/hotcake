' Keywords and escaped identifiers are not allowed in module path.

Import module_paths_helper
Import _helpers.level1.file2
' Not an error but won't be able to find `test`.
'Import _helpers.Object.test
'Import Throwable

' ModulePath.ClassIdentifier.FunctionIdentifier
Alias A1 = module_paths_helper.@Inline.@Test
' ModulePath.ClassIdentifier.ConstIdentifier
Alias A2 = module_paths_helper.@Inline.ConstVar
' ModulePath.ClassIdentifier.GlobalIdentifier
Alias A3 = module_paths_helper.@Inline.GlobalVar

' ModulePath.FunctionIdentifier
Alias A4 = module_paths_helper.Object
' ModulePath.ConstIdentifier
Alias A5 = module_paths_helper.ConstVar
' ModulePath.GlobalIdentifier
Alias A6 = module_paths_helper.@GlobalVar

'' Error : Syntax error - expecting declaration.
'Alias A7 = module_paths_helper.GenericType[]
'' Error : Syntax error - expecting declaration.
'Alias A7 = module_paths_helper.GenericType<Int>
' Error : Syntax error - expecting '='.
'Alias A7<T> = module_paths_helper.GenericType<T>
Alias A7 = module_paths_helper.@GenericType

'' Error : Identifier '_helpers' not found.
'Alias A8 = _helpers.level1.file2.T
Alias A8 = file2.T

' ModulePath.InterfaceIdentifier.ConstIdentifier
Alias A9 = module_paths_helper.Drawable.ConstVar

'' Error : Syntax error - expecting identifier.
'Alias A10 = Void

'' Error : Syntax error - expecting identifier.
'Alias A11 = Bool

Alias A12 = Int
Alias A13 = Float
Alias A14 = String
'Alias A15 = Object
Alias A16 = Throwable

' InterfaceIdentifier.ConstIdentifier
Alias A17 = Drawable.ConstVar
' ConstIdentifier
Alias A18 = @ConstVar
' ClassIdentifier.GlobalIdentifier
Alias A19 = @Inline.GlobalVar
Alias A20 = @Inline

Function Main()
    ' Transpiles incorrectly by itself.
    A1
    ' Adding this function call makes the alias work as expected.
    module_paths_helper.@Inline.Test
    ' Expression cannot start with `@`.
    '@Inline.Test
    .@Inline.Test

    Print A2
    Print module_paths_helper.@Inline.ConstVar
    '' Error : Unable to find overload for Print().
    'Print .@Inline.ConstVar
    Print(.@Inline.ConstVar)

    Print A3
    Print module_paths_helper.@Inline.GlobalVar
    Print(.@Inline.GlobalVar)

    '---

    A4
    module_paths_helper.Object
    '' Error : Duplicate identifier 'object' found in module 'module_paths_helper' and module 'lang'.
    'Object
    '.Object
    '.@Object

    Print A5
    Print module_paths_helper.ConstVar
    Print ConstVar

    Print A6
    Print module_paths_helper.GlobalVar
    Print GlobalVar

    New A7<Int>

    Print A8

    Print A9

    '' Error : Identifier 'Test' not found.
    'Throwable.Test

    Print A17
    Print A18
    Print A19

    New A20
End