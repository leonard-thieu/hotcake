import { Identifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class TypeParameter extends Declaration {
    static CHILD_NAMES: (keyof TypeParameter)[] = [
        'identifier',
    ];

    readonly kind = NodeKind.TypeParameter;

    identifier: Identifier;
}
