import { Identifier } from '../Identifier';
import { NodeKind } from '../Nodes';
import { Declaration } from './Declarations';

export const TypeParameterChildNames: ReadonlyArray<keyof TypeParameter> = [
    'identifier',
];

export class TypeParameter extends Declaration {
    readonly kind = NodeKind.TypeParameter;

    identifier: Identifier = undefined!;
}
