import { IdentifierToken } from '../../Token/Token';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class TypeParameter extends Declaration {
    static CHILD_NAMES: (keyof TypeParameter)[] = [
        'name',
    ];

    readonly kind = NodeKind.TypeParameter;

    name: IdentifierToken;
}
