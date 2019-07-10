import { Identifier } from '../Identifier';
import { isNode } from '../Node';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class TypeParameter extends Declaration {
    static CHILD_NAMES: (keyof TypeParameter)[] = [
        'identifier',
    ];

    readonly kind = NodeKind.TypeParameter;

    identifier: Identifier = undefined!;

    get firstToken() {
        if (isNode(this.identifier)) {
            return this.identifier.firstToken;
        }

        return this.identifier;
    }

    get lastToken() {
        if (isNode(this.identifier)) {
            return this.identifier.lastToken;
        }

        return this.identifier;
    }
}
