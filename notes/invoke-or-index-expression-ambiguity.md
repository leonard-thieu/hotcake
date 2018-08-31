# Invoke or index expression ambiguity

The expression `arr [0]` can look like an invoke expression whose first parameter is an array or an 
index expression.

## Conclusion

Without parentheses, `[0]` is treated as an index operation instead of an array literal.

## Experiments

## `arr` is an array

Compiles. Treated as an index expression.

```monkey
Function Main()
    Local arr:=[1,2,3,4]
    If arr [0]
    End
End
```

## `arr` is a function

Does not compile. Treated as a function call with no arguments.

```monkey
Function Main()
    ' Error : Unable to find overload for arr().
    If arr [0]
    End
End

Function arr(a:Int[])
End
```
