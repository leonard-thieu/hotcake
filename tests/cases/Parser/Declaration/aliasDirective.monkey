Import _aliasDirective._module
Import _aliasDirective.directory.file
Import _aliasDirective

Alias ImportedModule = _module,
      ImportedInterface = @Interface,
      ImportedClassGlobal = @Class.@Global

Alias ModuleConst = _module.@Const,
      ModuleGlobal = _module.@Global,
      ModuleFunction = _module.@Function

Alias ModuleInterface = _module.@Interface,
      ModuleInterfaceConst = _module.@Interface.@Const,
      ModuleInterfaceGlobal = _module.@Interface.@Method

Alias ModuleClass = _module.@Class,
      ModuleClassFunction = _module.@Class.@Function,
      ModuleClassConst = _module.@Class.@Const,
      ModuleClassGlobal = _module.@Class.@Global,
      ModuleClassField = _module.@Class.@Field,
      ModuleClassMethod = _module.@Class.@Method

Alias Generic = GenericClass

' Error : Syntax error - expecting declaration.
'Alias ArrayAnnotation = _module.Class[]

' Error : Syntax error - expecting declaration.
'Alias InstantiatedType = _module.GenericClass<Int>

' Error : Syntax error - expecting '='.
'Alias GenericAlias<T> = _module.GenericClass<T>

' Error : Identifier 'directory' not found.
' DirectoryAndImportedModule.Directory.ImportedModule.Global
'Alias UnimportedIdentifierInPath = _aliasDirective.directory.file.T

' First segment must resolve to an identifier imported into this module.
' Following segments are resolved in the scope introduced by the preceding identifier.
Alias ImportedIdentifiersInPath = _aliasDirective.directory_and_module.directory_and_module2.file2.Class2.@Global,
      LocalIntroducedByImport = directory_and_module.directory_and_module2.file2.Class2.@Global,
      LocalIntroducedByImportOfImport = directory_and_module2.file2.Class2.@Global

' Escaped module identifiers are allowed in Alias module paths.
' Import only allows escaped identifiers in the first segment. Although in that case, it will not introduce any locals
' effectively making it a no-op.
Alias EscapedModuleIdentifiersAllowedInPath = @_aliasDirective.@directory_and_module.@directory_and_module2.@file2.Class2.@Global

' Error : Syntax error - expecting identifier.
'Alias LangTypeVoid = Void

' Error : Syntax error - expecting identifier.
'Alias LangTypeBool = Bool

' Error : Syntax error - expecting identifier.
'Alias LangTypeArray = Array

Alias LangTypeInterface = Int,
      LangTypeFloat = Float,
      LangTypeString = String,
      LangTypeObject = Object,
      LangTypeThrowable = Throwable

Alias AliasedAlias = ModuleConst

' Duplicate identifiers only error on use
' Error : Duplicate identifier 'array' found in module '_module' and module 'lang'.
'Alias DuplicateIdentifier = @Array

Class ExtendAliasedClass Extends ModuleClass Implements ImportedInterface
    Method New()
        ModuleClassMethod

        ' Error : Can't find superclass method 'ModuleClassMethod'.
        'Super.ModuleClassMethod

        ' Error : Method 'ModuleClassMethod' cannot be accessed from here.
        '.ModuleClassMethod
    End
End

Function Main()
    New ImportedModule.@Class
    New ModuleClass
    New Generic<Int>
    New ExtendAliasedClass

    Print ImportedIdentifiersInPath
    Print LocalIntroducedByImport
    Print LocalIntroducedByImportOfImport
    Print EscapedModuleIdentifiersAllowedInPath

    Print AliasedAlias

    ' Error : Syntax error - unexpected token '@'
    'Print @AliasedAlias
End