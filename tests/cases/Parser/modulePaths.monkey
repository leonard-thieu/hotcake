' Keywords and escaped identifiers are not allowed in module path.

Import module_paths_helper
Import _helpers.level1.file2
' Not an error but won't be able to find `test`.
'Import _helpers.Object.test
'Import Throwable

Function Main()
    ' Expression cannot start with `@`.
    '@Inline.Test
    .@Inline.Test

    Print module_paths_helper.@Inline.ConstVar
    '' Error : Unable to find overload for Print().
    'Print .@Inline.ConstVar
    Print(.@Inline.ConstVar)

    Print module_paths_helper.@Inline.GlobalVar
    Print(.@Inline.GlobalVar)

    '---

    module_paths_helper.Object
    '' Error : Duplicate identifier 'object' found in module 'module_paths_helper' and module 'lang'.
    'Object
    '.Object
    '.@Object

    Print module_paths_helper.ConstVar
    Print ConstVar

    Print module_paths_helper.GlobalVar
    Print GlobalVar

    '' Error : Identifier 'Test' not found.
    'Throwable.Test
End