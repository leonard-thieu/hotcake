import { Identifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export class TypeParameter extends Declaration {
    readonly kind = NodeKind.TypeParameter;

    identifier: Identifier = undefined!;
}
