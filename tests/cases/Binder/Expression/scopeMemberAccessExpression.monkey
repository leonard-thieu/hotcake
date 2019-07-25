Class C
   Global T
End

Class HeadNode
    Field _pred: HeadNode
    Field _head: HeadNode
End

Function Main()
    C.T=10

    Local headNode := New HeadNode
    Local chainedScopeMemberAccess := headNode._pred._head
End