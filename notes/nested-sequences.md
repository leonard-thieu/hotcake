# Nested sequences

Sequences are delimited lists of language constructs. Sequences may be nested such as the case where `DataDeclarationList` may
have expression sequences assigned to its members.

```monkey
Local a=Exec(1, 2),b=3
```

In some cases, they may result in ambiguity.

## Assignment to parentheses-less invocation (with arguments)

```monkey
Function Main()
    ' Error : Expression cannot be used as a statement.
    Local a=Exec 1,2
End

Function Exec(a,b)
End
```

```monkey
Function Main()
    ' Error : Expression cannot be used as a statement.
    Local a=Exec 1
End

Function Exec(a)
End
```

The following **is** allowed.

```monkey
Function Main()
    Local a=Exec
End

Function Exec()
End
```

## Assignment to parentheses-less invocation (with optional parameters)

```monkey
Function Main()
    ' Error : Syntax error - expecting identifier.
    Local a = Exec ,2
End

Function Exec(a=1,b)
End
```

This gets interpreted as

```monkey
    ' Treated as if `2` is second member of the `Local` declaration.
    Local a = Exec,
          2
```

and not

```monkey
    Local a = Exec(,2)
```
