import { ParseContextElementArray, ParseContextKind } from '../Parser';
import { MissingToken } from '../Token/MissingToken';
import { Token } from '../Token/Token';
import { Expressions } from './Expression/Expression';
import { ModulePath } from './ModulePath';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class TypeReference extends Node {
    static CHILD_NAMES: (keyof TypeReference)[] = [
        'modulePath',
        'scopeMemberAccessOperator',
        'identifier',
        'lessThanSign',
        'typeArguments',
        'greaterThanSign',
        'arrayTypeDeclarations',
    ];

    readonly kind = NodeKind.TypeReference;

    modulePath: ModulePath | null = null;
    scopeMemberAccessOperator: Token | null = null;
    identifier: Token;

    // Generic type arguments
    lessThanSign: Token | null = null;
    typeArguments: ParseContextElementArray<ParseContextKind.TypeReferenceSequence> | null = null;
    greaterThanSign: Token | null = null;

    arrayTypeDeclarations: ArrayTypeDeclaration[] | null = null;
}

export class ArrayTypeDeclaration extends Node {
    static CHILD_NAMES: (keyof ArrayTypeDeclaration)[] = [
        'openingSquareBracket',
        'expression',
        'closingSquareBracket',
    ];

    readonly kind = NodeKind.ArrayTypeDeclaration;

    openingSquareBracket: Token;
    expression: Expressions | MissingToken | null = null;
    closingSquareBracket: Token;
}
