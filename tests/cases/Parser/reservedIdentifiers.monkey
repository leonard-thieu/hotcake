Import reserved_identifiers_helper

Alias @Float = Int

Function Main()
    Local object
    Local throwable
    Local @void
    Local @strict
    Local @public
    Local @private
    Local @protected
    Local @friend
    Local @property
    Local @bool
    Local @int
    Local @float
    Local @string
    Local @array
    Local @object
    Local @mod
    Local @continue
    Local @exit
    Local @include
    Local @import
    Local @module
    Local @extern
    Local @new
    Local @self
    Local @super
    Local @eachin
    Local @true
    Local @false
    Local @null
    Local @not
    Local @extends
    Local @abstract
    Local @final
    Local @select
    Local @case
    Local @default
    Local @const
    Local @local
    Local @global
    Local @field
    Local @method
    Local @function
    Local @class
    Local @and
    Local @or
    Local @shl
    Local @shr
    Local @end
    Local @if
    Local @then
    Local @else
    Local @elseif
    Local @endif
    Local @while
    Local @wend
    Local @repeat
    Local @until
    Local @forever
    Local @for
    Local @to
    Local @step
    Local @next
    Local @return
    Local @interface
    Local @implements
    Local @inline
    Local @alias
    Local @try
    Local @catch
    Local @throw
    Local @throwable
    Local @a

    New @Object

    '' Error : Syntax error - expecting identifier.
    'New .Actor

    If .Actor.Test
    End

    If .@Actor.Test
    End

    If .Object.Test
    End

    If .@Object.Test
    End

    '' Error : Syntax error - expecting identifier.
    'New .@Object

    Actor.@Object

    Actor.@New 1, 2

    Local actor := New Actor
    actor.@New 1

    Local floatAsInt: @Float = 6.5

    GenericActor<Int>(actor)

    '' Error : Syntax error - unexpected token '@'
    '@Actor.@Object

    '' Error : Syntax error - unexpected token '@'
    'If @Actor.@Object
    'End

    reserved_identifiers_helper.@Array.TestEscapedIdentifierInModulePath
End

Class @Object
    Function Test()
        Throw New Throwable()
    End
End

Class Actor
    Function Test()
        Throw New Throwable()
    End

    Function @Object()
        Throw New Throwable()
    End

    Function @New(a, b)
    End

    Method @New(a)
    End
End

Class GenericActor<T> Extends Actor
End