import { Identifier } from '../Identifier';
import { NodeKind } from '../NodeKind';
import { Declaration } from './Declaration';

export const TypeParameterChildNames: ReadonlyArray<keyof TypeParameter> = [
    'identifier',
];

export class TypeParameter extends Declaration {
    readonly kind = NodeKind.TypeParameter;

    identifier: Identifier = undefined!;
}
