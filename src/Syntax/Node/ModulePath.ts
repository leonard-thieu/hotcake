import { MissableToken } from '../Token/MissingToken';
import { IdentifierToken, PeriodToken } from '../Token/Token';
import { Node } from './Node';
import { NodeKind } from './NodeKind';

export const ModulePathChildNames: ReadonlyArray<keyof ModulePath> = [
    'children',
    'moduleIdentifier',
];

export class ModulePath extends Node {
    readonly kind = NodeKind.ModulePath;

    children: (IdentifierToken | PeriodToken)[] = undefined!;
    moduleIdentifier: MissableToken<IdentifierToken> = undefined!;
}
