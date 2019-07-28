#Rem
    `Node<List:T>` is referenced twice here. Once as a type annotation `Node<T>` and the second from
    `New HeadNode<T>`. Type checking relies on instance comparison so each unique type must only be
    instantiated once.

    This issue originally occurred due to the use of multiple caches. `Node<List:T>` was first
    instantiated on `Node<HeadNode:T>`. When instantiating the type annotation `Node<T>`, the binder
    only checked the cache on `Node<Node:T>`, failed to find the already instantiated `Node<List:T>`,
    and proceeds to create a duplicate instance.
#End

Class List<T>
	Field _head:Node<T>=New HeadNode<T>
End

Class Node<T>
End

Class HeadNode<T> Extends Node<T>
End