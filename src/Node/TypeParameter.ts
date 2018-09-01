import { Token } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export class TypeParameter extends Node {
    static CHILD_NAMES: (keyof TypeParameter)[] = [
        'name',
    ];

    readonly kind = NodeKind.TypeParameter;

    name: Token;
}
