Function Main()
	' Error : Expression cannot be used as a statement.
    ' This also tests for a bug where non-invokable expressions were being
    ' parsed as invokable expressions.
    1 + 2
End